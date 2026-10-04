<script setup lang="ts">
import { computed } from 'vue';

export interface SocialLink {
  icon: 'instagram' | 'youtube' | 'link' | (string & {});
  label?: string;
  href: string;
}

const props = defineProps<{
  businessName: string;
  /** Falls back to `businessName` in the copyright line. */
  legalName?: string;
  street?: string;
  /** "8001 Zürich" — the caller joins postal code and city. */
  locality?: string;
  phone?: string;
  phoneHref?: string;
  email?: string;
  socials?: SocialLink[];
  socialLabel?: string;
  legalLinks: { href: string; label: string }[];
  legalLabel?: string;
  rights?: string;
  /** Passed in, not read from the clock, so stories and tests stay deterministic. */
  year: number;
}>();

// A half-filled entry in the editor would otherwise render as a dead icon.
const socials = computed(() => (props.socials ?? []).filter((social) => social.href));
</script>

<template>
  <footer class="site-footer">
    <div class="container site-footer__inner">
      <div class="site-footer__block">
        <p class="site-footer__brand">{{ businessName }}</p>
        <address v-if="street || locality" class="site-footer__address">
          {{ street }}<br v-if="street && locality" />{{ locality }}
        </address>
      </div>

      <div v-if="phone || email" class="site-footer__block">
        <a v-if="phone" class="link" :href="phoneHref">{{ phone }}</a>
        <a v-if="email" class="link" :href="`mailto:${email}`">{{ email }}</a>
      </div>

      <nav
        v-if="socials.length"
        class="site-footer__block site-footer__socials"
        :aria-label="socialLabel"
      >
        <a
          v-for="social in socials"
          :key="social.href"
          class="site-footer__social-link"
          :href="social.href"
          :aria-label="social.label || social.href"
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <template v-if="social.icon === 'instagram'">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
            </template>
            <template v-else-if="social.icon === 'youtube'">
              <rect x="2" y="5" width="20" height="14" rx="4" />
              <path d="M10 9l5 3-5 3z" fill="currentColor" stroke="none" />
            </template>
            <template v-else>
              <path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
              <path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
            </template>
          </svg>
        </a>
      </nav>

      <nav class="site-footer__block" :aria-label="legalLabel">
        <a v-for="link in legalLinks" :key="link.href" class="link" :href="link.href">{{
          link.label
        }}</a>
      </nav>
    </div>

    <div class="container site-footer__meta">
      <small>&copy; {{ year }} {{ legalName || businessName }}. {{ rights }}</small>
    </div>
  </footer>
</template>
