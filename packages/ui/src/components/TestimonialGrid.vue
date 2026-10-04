<script setup lang="ts">
import { computed } from 'vue';

export interface TestimonialItem {
  quote: string;
  author: string;
  context?: string;
}

const props = defineProps<{
  title?: string;
  testimonials: TestimonialItem[];
}>();

/*
 * The design adds curly quotes around every quote. Editors often type their own,
 * which would double up as “„Super Praxis““ — so strip any they included.
 */
const QUOTE_MARKS = /^["'“”„«»‘’‚\s]+|["'“”„«»‘’‚\s]+$/g;

const items = computed(() =>
  props.testimonials
    .map((item) => ({ ...item, quote: item.quote.replace(QUOTE_MARKS, '') }))
    .filter((item) => item.quote),
);
</script>

<template>
  <!-- Nothing to quote: render nothing rather than an empty band. -->
  <section v-if="items.length" class="section">
    <div class="container stack">
      <h2 v-if="title" class="heading-2">{{ title }}</h2>

      <ul class="grid grid--auto testimonials" role="list">
        <li v-for="item in items" :key="item.author + item.quote">
          <figure class="card testimonials__item">
            <blockquote class="testimonials__quote">
              <p>{{ item.quote }}</p>
            </blockquote>
            <figcaption class="testimonials__author">
              <span>{{ item.author }}</span>
              <span v-if="item.context" class="text-muted"> · {{ item.context }}</span>
            </figcaption>
          </figure>
        </li>
      </ul>
    </div>
  </section>
</template>
