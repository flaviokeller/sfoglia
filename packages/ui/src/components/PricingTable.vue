<script setup lang="ts">
export interface PriceTier {
  name: string;
  /** Shown as typed: "CHF 120", "ab CHF 80". Never parsed or formatted. */
  price: string;
  /** "pro Sitzung", "per month". */
  period?: string;
  description?: string;
  features?: string[];
  highlighted?: boolean;
  cta?: { label: string; href: string };
}

export interface PriceItem {
  name: string;
  description?: string;
  price: string;
}

export interface PriceGroup {
  title?: string;
  items: PriceItem[];
}

defineProps<{
  /**
   * `tiers`: a few packages side by side. `list`: a menu-style price list,
   * for sites with many small services.
   */
  variant?: 'tiers' | 'list';
  title?: string;
  intro?: string;
  tiers?: PriceTier[];
  groups?: PriceGroup[];
  /** "Preise inkl. MwSt." and similar. */
  note?: string;
  surface?: boolean;
}>();
</script>

<template>
  <section class="pricing" :class="{ 'section--surface': surface }">
    <div class="container stack">
      <div v-if="title || intro" class="stack">
        <h2 v-if="title" class="heading-2">{{ title }}</h2>
        <p v-if="intro" class="lead">{{ intro }}</p>
      </div>

      <ul v-if="variant !== 'list' && tiers?.length" class="pricing__tiers">
        <li
          v-for="tier in tiers"
          :key="tier.name"
          class="pricing__tier card"
          :class="{ 'pricing__tier--highlighted': tier.highlighted }"
        >
          <h3 class="heading-4">{{ tier.name }}</h3>
          <p class="pricing__price">
            <span class="pricing__amount">{{ tier.price }}</span>
            <span v-if="tier.period" class="pricing__period">{{ tier.period }}</span>
          </p>
          <p v-if="tier.description" class="text-muted">{{ tier.description }}</p>
          <ul v-if="tier.features?.length" class="pricing__features">
            <li v-for="feature in tier.features" :key="feature">{{ feature }}</li>
          </ul>
          <a
            v-if="tier.cta"
            class="button pricing__cta"
            :class="tier.highlighted ? 'button--primary' : 'button--secondary'"
            :href="tier.cta.href"
            >{{ tier.cta.label }}</a
          >
        </li>
      </ul>

      <div v-else-if="variant === 'list' && groups?.length" class="pricing__groups">
        <div v-for="(group, index) in groups" :key="group.title ?? index" class="pricing__group">
          <h3 v-if="group.title" class="heading-4">{{ group.title }}</h3>
          <dl class="pricing__rows">
            <div v-for="item in group.items" :key="item.name" class="pricing__row">
              <dt class="pricing__name">{{ item.name }}</dt>
              <dd class="pricing__row-price">{{ item.price }}</dd>
              <dd v-if="item.description" class="pricing__row-text">{{ item.description }}</dd>
            </div>
          </dl>
        </div>
      </div>

      <p v-if="note" class="pricing__note">{{ note }}</p>
    </div>
  </section>
</template>
