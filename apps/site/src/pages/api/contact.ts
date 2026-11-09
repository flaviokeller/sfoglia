import { getSecret } from 'astro:env/server';
import type { APIRoute } from 'astro';

import { site } from '../../data/site';

/**
 * Contact form endpoint. Receives the form as a URL-encoded POST and mails it
 * to the site owner through Lettermint (EU), with the visitor as Reply-To.
 *
 * - `fetch` from the hydrated form sends `Accept: application/json` and gets a
 *   status reply. A native no-JS POST gets a 303 to the `success-url` field.
 * - Validation mirrors ContactForm.vue; the client checks are only a courtesy.
 * - The honeypot (`bot-field`) answers like a success so bots learn nothing.
 *
 * Swapping the mail service means rewriting `send()` only.
 */
export const prerender = false;

const LETTERMINT_SEND_URL = 'https://api.lettermint.co/v1/send';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_LENGTH = { name: 200, email: 320, message: 10_000 };

type Submission = { name: string; email: string; message: string };

export const POST: APIRoute = async ({ request, redirect }) => {
  if (site.contactMode !== 'form') {
    return new Response(null, { status: 404 });
  }

  const wantsJson = request.headers.get('accept')?.includes('application/json') ?? false;
  const reply = (status: number, successUrl: string | null) => {
    if (wantsJson || status !== 200 || !successUrl) {
      return Response.json({ ok: status === 200 }, { status });
    }
    return redirect(successUrl, 303);
  };

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return reply(400, null);
  }
  const field = (name: string) => String(form.get(name) ?? '').trim();
  const successUrl = sameSitePath(field('success-url'));

  if (field('bot-field')) {
    return reply(200, successUrl);
  }

  const submission: Submission = {
    name: field('name'),
    email: field('email'),
    message: field('message'),
  };
  if (!isValid(submission)) {
    return reply(422, null);
  }

  const token = getSecret('LETTERMINT_PROJECT_TOKEN');
  const from = getSecret('CONTACT_FROM_EMAIL');
  const to = getSecret('CONTACT_TO_EMAIL');
  if (!token || !from || !to) {
    console.error(
      '[contact] LETTERMINT_PROJECT_TOKEN, CONTACT_FROM_EMAIL or CONTACT_TO_EMAIL is not set',
    );
    return reply(503, null);
  }

  try {
    await send(submission, { token, from, to });
  } catch (error) {
    console.error('[contact] sending failed', error);
    return reply(502, null);
  }
  return reply(200, successUrl);
};

function isValid({ name, email, message }: Submission): boolean {
  return (
    name.length > 0 &&
    name.length <= MAX_LENGTH.name &&
    email.length <= MAX_LENGTH.email &&
    EMAIL_PATTERN.test(email) &&
    message.length > 0 &&
    message.length <= MAX_LENGTH.message
  );
}

/** Only a path on this site (`/de/danke/`), never `//evil.example` or a full URL. */
function sameSitePath(value: string): string | null {
  return value.startsWith('/') && !value.startsWith('//') ? value : null;
}

async function send(
  { name, email, message }: Submission,
  { token, from, to }: { token: string; from: string; to: string },
): Promise<void> {
  const response = await fetch(LETTERMINT_SEND_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-lettermint-token': token },
    body: JSON.stringify({
      from: `${site.businessName} <${from}>`,
      to: [to],
      reply_to: [email],
      // Collapse whitespace so a crafted name cannot break the subject line.
      subject: `Kontaktformular: ${name.replace(/\s+/g, ' ')}`,
      text: `${message}\n\n—\n${name} <${email}>`,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) {
    throw new Error(`Lettermint responded ${response.status}: ${await response.text()}`);
  }
}
