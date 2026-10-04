<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

export type Weekday =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export interface HoursEntry {
  day: Weekday;
  /** Empty string means closed that day. */
  opens?: string;
  closes?: string;
}

const props = withDefaults(
  defineProps<{
    title: string;
    street?: string;
    /** "8001 Zürich" — the caller joins postal code and city. */
    locality?: string;
    phone?: string;
    phoneHref?: string;
    mapLink?: { href: string; label: string };
    hours?: HoursEntry[];
    /** Localised day names, keyed by weekday. */
    dayNames: Record<Weekday, string>;
    closedLabel?: string;
    /** Weekday to highlight on the server render. Stories pin it; the site sets `live`. */
    today?: Weekday;
    /**
     * Re-derive `today` from the visitor's clock on hydration. A build-time date
     * would freeze on whatever day the site was deployed.
     */
    live?: boolean;
    surface?: boolean;
  }>(),
  { closedLabel: 'Geschlossen', live: false, surface: true },
);

const WEEKDAYS: Weekday[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

const current = ref<Weekday | undefined>(props.today);

onMounted(() => {
  if (props.live) current.value = WEEKDAYS[new Date().getDay()];
});

const entries = computed(() => props.hours ?? []);
</script>

<template>
  <section class="section" :class="{ 'section--surface': surface }">
    <div class="container hours">
      <div class="stack">
        <h2 class="heading-2">{{ title }}</h2>
        <!--
          Every contact field is optional in Keystatic: a blank one drops out
          instead of leaving a stray line break or an empty link.
        -->
        <address v-if="street || locality" class="hours__address">
          {{ street }}<br v-if="street && locality" />{{ locality }}
        </address>
        <p v-if="phone">
          <a class="link" :href="phoneHref">{{ phone }}</a>
        </p>
        <p v-if="mapLink">
          <a class="link" :href="mapLink.href">{{ mapLink.label }}</a>
        </p>
      </div>

      <!-- No hours entered yet: the address block stands alone. -->
      <table v-if="entries.length" class="hours__table">
        <tbody>
          <tr
            v-for="entry in entries"
            :key="entry.day"
            :data-today="entry.day === current ? 'true' : undefined"
          >
            <th scope="row">{{ dayNames[entry.day] }}</th>
            <td>
              <template v-if="entry.opens && entry.closes"
                >{{ entry.opens }}&ndash;{{ entry.closes }}</template
              >
              <span v-else class="text-muted">{{ closedLabel }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
