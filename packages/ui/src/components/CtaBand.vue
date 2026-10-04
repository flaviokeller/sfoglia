<script setup lang="ts">
export interface CtaAction {
  label: string;
  href: string;
}

withDefaults(
  defineProps<{
    title: string;
    text?: string;
    primary: CtaAction;
    secondary?: CtaAction;
    /** `accent` fills the band with the brand colour, `surface` stays quiet. */
    tone?: 'accent' | 'surface';
  }>(),
  { tone: 'accent' },
);
</script>

<template>
  <section class="cta" :class="`cta--${tone}`">
    <div class="container cta__inner">
      <div class="cta__copy">
        <h2 class="heading-2 cta__title">{{ title }}</h2>
        <p v-if="text" class="cta__text">{{ text }}</p>
      </div>
      <div class="cta__actions">
        <a class="button button--lg cta__primary" :href="primary.href">{{ primary.label }}</a>
        <a v-if="secondary" class="button button--lg cta__secondary" :href="secondary.href">{{
          secondary.label
        }}</a>
      </div>
    </div>
  </section>
</template>
