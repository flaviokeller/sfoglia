<script setup lang="ts">
import EventList, { type EventItem } from './EventList.vue';

defineProps<{
  /** Anchor target, for one-page navigation. */
  id?: string;
  title: string;
  events: EventItem[];
  today: string;
  live?: boolean;
  locale?: string;
  labels?: Partial<Record<'past' | 'empty', string>>;
  surface?: boolean;
}>();
</script>

<template>
  <!--
    A site that never entered an event has no Termine section. One between
    seasons keeps it, with the empty-state message.
  -->
  <section v-if="events.length" :id="id" class="section" :class="{ 'section--surface': surface }">
    <div class="container stack events-section">
      <h2 class="heading-2">{{ title }}</h2>
      <EventList
        :events="events"
        :today="today"
        :live="live"
        :locale="locale"
        :labels="labels"
      />
    </div>
  </section>
</template>
