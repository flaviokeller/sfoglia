<script setup lang="ts">
import ContactForm, { type ContactFormLabels } from './ContactForm.vue';

withDefaults(
  defineProps<{
    title: string;
    /** h1 when the section is the page itself (Kontakt), h2 inside a longer page. */
    as?: 'h1' | 'h2';
    successUrl?: string;
    labels?: Partial<ContactFormLabels>;
    /**
     * Set both to show a mailto link instead of the form, for sites that do not
     * send form mail at all.
     */
    mailto?: string;
    mailtoLabel?: string;
  }>(),
  {
    as: 'h2',
    successUrl: undefined,
    labels: () => ({}),
    mailto: undefined,
    mailtoLabel: undefined,
  },
);
</script>

<template>
  <section id="kontakt" class="section">
    <div class="container">
      <component :is="as" :class="as === 'h1' ? 'heading-1' : 'heading-2'">{{ title }}</component>
      <p v-if="mailto && mailtoLabel">
        <a class="button button--primary" :href="`mailto:${mailto}`">{{ mailtoLabel }}</a>
      </p>
      <ContactForm v-else :success-url="successUrl" :labels="labels" />
    </div>
  </section>
</template>
