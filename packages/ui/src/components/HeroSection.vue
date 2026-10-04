<script setup lang="ts">
import type { ResponsiveImage } from '../types';

export interface CtaLink {
  href: string;
  label: string;
}

withDefaults(
  defineProps<{
    eyebrow?: string;
    title: string;
    /**
     * Heading level. h1 because the hero is normally the page title — drop to
     * h2 when the section is used more than once on a page (the styleguide does
     * this), so the page keeps exactly one h1.
     */
    as?: 'h1' | 'h2';
    lead?: string;
    image?: ResponsiveImage;
    primaryCta?: CtaLink;
    secondaryCta?: CtaLink;
  }>(),
  { as: 'h1' },
);
</script>

<template>
  <section class="section hero">
    <div class="container hero__inner" :data-with-image="image ? 'true' : 'false'">
      <div class="hero__content stack">
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <component :is="as" class="heading-hero">{{ title }}</component>
        <p v-if="lead" class="lead">{{ lead }}</p>
        <div v-if="primaryCta || secondaryCta" class="hero__actions">
          <a v-if="primaryCta" class="button button--primary button--lg" :href="primaryCta.href">{{
            primaryCta.label
          }}</a>
          <a
            v-if="secondaryCta"
            class="button button--secondary button--lg"
            :href="secondaryCta.href"
            >{{ secondaryCta.label }}</a
          >
        </div>
      </div>

      <!-- Eager + high priority: this is the LCP element, never lazy-load it. -->
      <div v-if="image" class="hero__media">
        <img
          :src="image.src"
          :srcset="image.srcset"
          :sizes="image.sizes"
          :width="image.width"
          :height="image.height"
          :alt="image.alt ?? ''"
          loading="eager"
          fetchpriority="high"
          decoding="async"
        />
      </div>
    </div>
  </section>
</template>
