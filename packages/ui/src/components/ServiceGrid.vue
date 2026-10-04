<script setup lang="ts">
import { computed } from 'vue';

export interface ServiceItem {
  title: string;
  summary: string;
  href?: string;
}

const props = withDefaults(
  defineProps<{
    /** Anchor target, for one-page navigation. */
    id?: string;
    eyebrow?: string;
    title: string;
    /** h1 when the grid is the page itself (Leistungen), h2 as a section of a longer page. */
    as?: 'h1' | 'h2';
    lead?: string;
    services: ServiceItem[];
    surface?: boolean;
  }>(),
  { as: 'h2', surface: true },
);

/*
 * As a section, an empty grid would be a heading over nothing, so it drops out.
 * As the page itself it keeps its heading, so the page is never blank.
 */
const visible = computed(() => props.services.length > 0 || props.as === 'h1');
</script>

<template>
  <section v-if="visible" :id="id" class="section" :class="{ 'section--surface': surface }">
    <div class="container stack">
      <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
      <component :is="as" :class="as === 'h1' ? 'heading-1' : 'heading-2'">{{ title }}</component>
      <p v-if="lead" class="lead">{{ lead }}</p>

      <ul v-if="services.length" class="grid grid--auto service-grid" role="list">
        <li v-for="service in services" :key="service.title">
          <article class="card" :class="{ 'card--interactive': service.href }">
            <h3 class="heading-4">
              <a v-if="service.href" class="service-grid__link" :href="service.href">{{
                service.title
              }}</a>
              <template v-else>{{ service.title }}</template>
            </h3>
            <p class="text-muted">{{ service.summary }}</p>
          </article>
        </li>
      </ul>
    </div>
  </section>
</template>
