<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

export interface EventItem {
  /** ISO date, YYYY-MM-DD. A string, not a Date: YAML would parse it in UTC. */
  date: string;
  time?: string;
  title: string;
  venue?: string;
  town?: string;
  url?: string;
}

const props = withDefaults(
  defineProps<{
    events: EventItem[];
    /**
     * "Today" as an ISO date, for the server render. Without `live` it stays
     * fixed, so stories and tests are deterministic.
     */
    today: string;
    /**
     * Re-derive `today` from the visitor's clock on hydration, so the
     * upcoming/past split is right on every page load, not just as of the last
     * deploy — nothing rebuilds a static site on a schedule.
     */
    live?: boolean;
    /** How long a finished event stays under "past" before it drops off. */
    pastWindowDays?: number;
    /** BCP 47 locale for date formatting. */
    locale?: string;
    /** Show finished events under a second heading. */
    showPast?: boolean;
    labels?: Partial<Record<'past' | 'empty', string>>;
  }>(),
  {
    live: false,
    pastWindowDays: 90,
    locale: 'de-CH',
    showPast: true,
    labels: () => ({}),
  },
);

const t = computed(() => ({
  past: props.labels.past ?? 'Vergangene Termine',
  empty: props.labels.empty ?? 'Zurzeit sind keine Termine geplant.',
}));

/**
 * A Date as YYYY-MM-DD on the LOCAL calendar. `toISOString()` would give the
 * UTC date, which in Switzerland is still yesterday for an hour or two after
 * midnight.
 */
function isoDay(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Local midnight of an ISO date, so the displayed day matches the stored one. */
function parseDay(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return y && m && d ? new Date(y, m - 1, d) : null;
}

const today = ref(props.today);

onMounted(() => {
  if (props.live) today.value = isoDay(new Date());
});

const sorted = computed(() => [...props.events].sort((a, b) => a.date.localeCompare(b.date)));

/*
 * String comparison, not Date comparison: both sides are YYYY-MM-DD, which
 * compares correctly as text and cannot be shifted by a timezone.
 */
const pastCutoff = computed(() => {
  const cutoff = parseDay(today.value) ?? new Date(0);
  cutoff.setDate(cutoff.getDate() - props.pastWindowDays);
  return isoDay(cutoff);
});

const upcoming = computed(() => sorted.value.filter((e) => e.date >= today.value));
const past = computed(() =>
  sorted.value.filter((e) => e.date < today.value && e.date >= pastCutoff.value).reverse(),
);

function formatDate(iso: string) {
  const day = parseDay(iso);
  if (!day) return iso;
  return new Intl.DateTimeFormat(props.locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(day);
}

/** "Venue, Town", without a dangling comma when the editor left one empty. */
function where(event: EventItem) {
  return [event.venue, event.town].filter(Boolean).join(', ');
}
</script>

<template>
  <div class="events">
    <ol v-if="upcoming.length" class="events__list">
      <li v-for="event in upcoming" :key="event.date + event.title" class="events__item">
        <time class="events__date" :datetime="event.date">
          {{ formatDate(event.date) }}<template v-if="event.time">, {{ event.time }}</template>
        </time>
        <div class="events__detail">
          <p class="events__title">
            <a v-if="event.url" class="events__link" :href="event.url">{{ event.title }}</a>
            <template v-else>{{ event.title }}</template>
          </p>
          <p v-if="where(event)" class="events__where">{{ where(event) }}</p>
        </div>
      </li>
    </ol>

    <!--
      Not an edge case: dates run out between seasons, and a bare "nothing
      here" reads as abandoned. Say what it means and keep the door open.
    -->
    <p v-else class="events__empty">{{ t.empty }}</p>

    <template v-if="showPast && past.length">
      <h3 class="events__past-heading">{{ t.past }}</h3>
      <ol class="events__list events__list--past">
        <li v-for="event in past" :key="event.date + event.title" class="events__item">
          <time class="events__date" :datetime="event.date">{{ formatDate(event.date) }}</time>
          <div class="events__detail">
            <p class="events__title">{{ event.title }}</p>
            <p v-if="where(event)" class="events__where">{{ where(event) }}</p>
          </div>
        </li>
      </ol>
    </template>
  </div>
</template>
