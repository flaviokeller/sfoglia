<script setup lang="ts">
// `useId` renamed for the same Fast Refresh reason as in FaqAccordion.vue.
import { computed, useId as createId, nextTick, onMounted, ref, watch } from 'vue';

export interface ContactFormLabels {
  name: string;
  email: string;
  message: string;
  submit: string;
  sending: string;
  success: string;
  error: string;
  required: string;
  invalidEmail: string;
}

const DEFAULT_LABELS: ContactFormLabels = {
  name: 'Name',
  email: 'E-Mail',
  message: 'Nachricht',
  submit: 'Nachricht senden',
  sending: 'Wird gesendet …',
  success: 'Danke! Ihre Nachricht ist angekommen.',
  error: 'Das hat leider nicht geklappt. Bitte versuchen Sie es später noch einmal.',
  required: 'Dieses Feld ist erforderlich.',
  invalidEmail: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
};

const props = withDefaults(
  defineProps<{
    /** Must match the `name` on the hidden static twin form that Netlify parses. */
    formName?: string;
    /**
     * Where a no-JS submission lands. Netlify serves this path after the native
     * POST; without it the visitor gets Netlify's generic confirmation page.
     */
    successUrl?: string;
    labels?: Partial<ContactFormLabels>;
  }>(),
  { formName: 'contact', successUrl: undefined, labels: () => ({}) },
);

/** How long to wait on Netlify before telling the visitor it failed. */
const SUBMIT_TIMEOUT_MS = 15_000;

const t = computed<ContactFormLabels>(() => ({ ...DEFAULT_LABELS, ...props.labels }));

type FieldName = 'name' | 'email' | 'message';

const values = ref<Record<FieldName, string>>({ name: '', email: '', message: '' });
const botField = ref('');
const errors = ref<Partial<Record<FieldName, string>>>({});
const status = ref<'idle' | 'sending' | 'sent' | 'failed'>('idle');
const form = ref<HTMLFormElement | null>(null);
const successMessage = ref<HTMLElement | null>(null);

/** Per-instance field ids, so two forms on one page keep their labels apart. */
const idBase = createId();
const fieldId = (field: FieldName) => `${idBase}-${field}`;
const errorId = (field: FieldName) => `${idBase}-${field}-error`;

/*
 * Until hydration, the server-rendered form is the no-JS fallback: it posts
 * natively, so the browser's own `required` / `type="email"` checks must run.
 * Once Vue takes over, `novalidate` hands validation to `validate()` below,
 * which shows translated messages inline instead of browser bubbles.
 */
const hydrated = ref(false);
onMounted(() => {
  hydrated.value = true;
});

function validate(): Partial<Record<FieldName, string>> {
  const found: Partial<Record<FieldName, string>> = {};
  const { name, email, message } = values.value;

  if (!name.trim()) found.name = t.value.required;
  if (!email.trim()) found.email = t.value.required;
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
    found.email = t.value.invalidEmail;
  }
  if (!message.trim()) found.message = t.value.required;

  return found;
}

/*
 * Once a field shows an error, re-check it as the visitor types, so the message
 * disappears the moment it is fixed rather than on the next submit. Fields
 * without an error are left alone: no scolding while someone is still typing.
 */
watch(
  values,
  () => {
    const shown = Object.keys(errors.value) as FieldName[];
    if (shown.length === 0) return;
    const found = validate();
    errors.value = Object.fromEntries(
      shown.map((field) => [field, found[field]]).filter(([, message]) => message),
    );
  },
  { deep: true },
);

async function onSubmit() {
  // Honeypot: real users never fill a hidden field. Pretend success so bots do
  // not learn they were caught.
  if (botField.value) {
    status.value = 'sent';
    return;
  }

  const found = validate();
  errors.value = found;
  const firstInvalid = Object.keys(found)[0];
  if (firstInvalid) {
    await nextTick();
    form.value?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
    return;
  }

  status.value = 'sending';

  try {
    const body = new URLSearchParams({
      'form-name': props.formName,
      ...values.value,
    });
    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
      // A stalled request must not leave the button on "Sending …" forever.
      signal: AbortSignal.timeout(SUBMIT_TIMEOUT_MS),
    });
    if (!response.ok) throw new Error(`Netlify responded ${response.status}`);
    status.value = 'sent';
    values.value = { name: '', email: '', message: '' };
    // The form (and the focused button) is replaced by the confirmation; move
    // focus there so keyboard and screen-reader users are not dropped on <body>.
    await nextTick();
    successMessage.value?.focus();
  } catch (error) {
    // Surfaced to the user below; logged so a failure is never silent.
    console.error('[ui] contact form submission failed', error);
    status.value = 'failed';
  }
}
</script>

<template>
  <p
    v-if="status === 'sent'"
    ref="successMessage"
    class="form__status form__status--success"
    role="status"
    tabindex="-1"
  >
    {{ t.success }}
  </p>

  <form
    v-else
    ref="form"
    class="form stack"
    :name="props.formName"
    method="POST"
    :action="props.successUrl"
    :novalidate="hydrated"
    @submit.prevent="onSubmit"
  >
    <input type="hidden" name="form-name" :value="props.formName" />
    <p hidden>
      <label>Bitte leer lassen <input v-model="botField" name="bot-field" /></label>
    </p>

    <div class="field">
      <label class="field__label" :for="fieldId('name')">{{ t.name }}</label>
      <input
        :id="fieldId('name')"
        v-model="values.name"
        class="input"
        type="text"
        name="name"
        required
        autocomplete="name"
        :aria-invalid="errors.name ? 'true' : 'false'"
        :aria-describedby="errors.name ? errorId('name') : undefined"
      />
      <p v-if="errors.name" :id="errorId('name')" class="field__error">{{ errors.name }}</p>
    </div>

    <div class="field">
      <label class="field__label" :for="fieldId('email')">{{ t.email }}</label>
      <input
        :id="fieldId('email')"
        v-model="values.email"
        class="input"
        type="email"
        name="email"
        required
        autocomplete="email"
        :aria-invalid="errors.email ? 'true' : 'false'"
        :aria-describedby="errors.email ? errorId('email') : undefined"
      />
      <p v-if="errors.email" :id="errorId('email')" class="field__error">{{ errors.email }}</p>
    </div>

    <div class="field">
      <label class="field__label" :for="fieldId('message')">{{ t.message }}</label>
      <textarea
        :id="fieldId('message')"
        v-model="values.message"
        class="textarea"
        name="message"
        required
        :aria-invalid="errors.message ? 'true' : 'false'"
        :aria-describedby="errors.message ? errorId('message') : undefined"
      ></textarea>
      <p v-if="errors.message" :id="errorId('message')" class="field__error">
        {{ errors.message }}
      </p>
    </div>

    <button class="button button--primary" type="submit" :disabled="status === 'sending'">
      {{ status === 'sending' ? t.sending : t.submit }}
    </button>

    <p v-if="status === 'failed'" class="form__status form__status--error" role="alert">
      {{ t.error }}
    </p>
  </form>
</template>
