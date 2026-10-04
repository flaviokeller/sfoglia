<script setup lang="ts">
import ContactForm, { type ContactFormLabels } from './ContactForm.vue';

withDefaults(
  defineProps<{
    title: string;
    /** h1 when the section is the page itself (Kontakt), h2 inside a longer page. */
    as?: 'h1' | 'h2';
    formName?: string;
    successUrl?: string;
    labels?: Partial<ContactFormLabels>;
  }>(),
  { as: 'h2', formName: 'contact', successUrl: undefined, labels: () => ({}) },
);
</script>

<template>
  <section id="kontakt" class="section">
    <div class="container">
      <component :is="as" :class="as === 'h1' ? 'heading-1' : 'heading-2'">{{ title }}</component>
      <ContactForm :form-name="formName" :success-url="successUrl" :labels="labels" />
    </div>
  </section>
</template>
