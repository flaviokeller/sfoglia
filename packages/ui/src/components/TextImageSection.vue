<script setup lang="ts">
import type { ResponsiveImage } from '../types';

withDefaults(
  defineProps<{
    /** Anchor target, for one-page navigation. */
    id?: string;
    eyebrow?: string;
    title: string;
    image?: ResponsiveImage;
    /** Puts the image first on wide viewports. Ignored on narrow ones. */
    reversed?: boolean;
    surface?: boolean;
  }>(),
  { reversed: false, surface: false },
);
</script>

<template>
  <section :id="id" class="section" :class="{ 'section--surface': surface }">
    <div class="container text-image" :data-reversed="reversed ? 'true' : 'false'">
      <div class="text-image__body stack">
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h2 class="heading-2">{{ title }}</h2>
        <div class="prose text-muted"><slot /></div>
      </div>

      <div v-if="image" class="text-image__media">
        <img
          :src="image.src"
          :srcset="image.srcset"
          :sizes="image.sizes"
          :width="image.width"
          :height="image.height"
          :alt="image.alt ?? ''"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  </section>
</template>
