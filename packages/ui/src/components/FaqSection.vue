<script setup lang="ts">
import FaqAccordion, { type AccordionItem } from './FaqAccordion.vue';

defineProps<{
  title: string;
  items: AccordionItem[];
}>();
</script>

<template>
  <!--
    No questions yet: render nothing rather than a heading over an empty list.
    The FAQPage structured data lives in the site's wrapper, not here.
  -->
  <section v-if="items.length" class="section">
    <div class="container stack faq">
      <h2 class="heading-2">{{ title }}</h2>
      <FaqAccordion :items="items" />
    </div>
  </section>
</template>
