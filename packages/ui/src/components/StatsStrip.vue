<script setup lang="ts">
export interface StatItem {
  /** Shown as typed: "1998", "120+", "4.9 / 5". Never parsed or formatted. */
  value: string;
  label: string;
}

defineProps<{
  stats: StatItem[];
  title?: string;
  surface?: boolean;
}>();
</script>

<template>
  <section v-if="stats.length" class="stats" :class="{ 'section--surface': surface }">
    <div class="container stack">
      <h2 v-if="title" class="heading-3 stats__title">{{ title }}</h2>
      <dl class="stats__list">
        <div v-for="stat in stats" :key="stat.label" class="stats__item">
          <dt class="stats__label">{{ stat.label }}</dt>
          <dd class="stats__value">{{ stat.value }}</dd>
        </div>
      </dl>
    </div>
  </section>
</template>
