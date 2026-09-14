<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';

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
    labels?: Partial<ContactFormLabels>;
  }>(),
  { formName: 'contact', labels: () => ({}) },
);

const t = computed<ContactFormLabels>(() => ({ ...DEFAULT_LABELS, ...props.labels }));

type FieldName = 'name' | 'email' | 'message';

const values = ref<Record<FieldName, string>>({ name: '', email: '', message: '' });
const botField = ref('');
const errors = ref<Partial<Record<FieldName, string>>>({});
const status = ref<'idle' | 'sending' | 'sent' | 'failed'>('idle');
const form = ref<HTMLFormElement | null>(null);

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
    });
    if (!response.ok) throw new Error(`Netlify responded ${response.status}`);
    status.value = 'sent';
    values.value = { name: '', email: '', message: '' };
  } catch (error) {
    // Surfaced to the user below; logged so a failure is never silent.
    console.error('[ui] contact form submission failed', error);
    status.value = 'failed';
  }
}
</script>

<template>
  <p v-if="status === 'sent'" class="form__status form__status--success" role="status">
    {{ t.success }}
  </p>

  <form
    v-else
    ref="form"
    class="form stack"
    :name="props.formName"
    method="POST"
    novalidate
    @submit.prevent="onSubmit"
  >
    <input type="hidden" name="form-name" :value="props.formName" />
    <p hidden>
      <label>Bitte leer lassen <input v-model="botField" name="bot-field" /></label>
    </p>

    <div class="field">
      <label class="field__label" for="contact-name">{{ t.name }}</label>
      <input
        id="contact-name"
        v-model="values.name"
        class="input"
        type="text"
        name="name"
        autocomplete="name"
        :aria-invalid="errors.name ? 'true' : 'false'"
        :aria-describedby="errors.name ? 'contact-name-error' : undefined"
      />
      <p v-if="errors.name" id="contact-name-error" class="field__error">{{ errors.name }}</p>
    </div>

    <div class="field">
      <label class="field__label" for="contact-email">{{ t.email }}</label>
      <input
        id="contact-email"
        v-model="values.email"
        class="input"
        type="email"
        name="email"
        autocomplete="email"
        :aria-invalid="errors.email ? 'true' : 'false'"
        :aria-describedby="errors.email ? 'contact-email-error' : undefined"
      />
      <p v-if="errors.email" id="contact-email-error" class="field__error">{{ errors.email }}</p>
    </div>

    <div class="field">
      <label class="field__label" for="contact-message">{{ t.message }}</label>
      <textarea
        id="contact-message"
        v-model="values.message"
        class="textarea"
        name="message"
        :aria-invalid="errors.message ? 'true' : 'false'"
        :aria-describedby="errors.message ? 'contact-message-error' : undefined"
      ></textarea>
      <p v-if="errors.message" id="contact-message-error" class="field__error">
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
