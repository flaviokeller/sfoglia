<script setup lang="ts">
import SiteNav, { type NavLink } from './SiteNav.vue';

export interface LanguageLink {
  code: string;
  /** Full name, shown as the abbreviation's tooltip. */
  name: string;
  href: string;
  current?: boolean;
}

defineProps<{
  businessName: string;
  homeHref: string;
  links: NavLink[];
  /** Current pathname, used to mark the active nav link. */
  current?: string;
  languages: LanguageLink[];
  languageSwitchLabel?: string;
  menuLabel?: string;
  closeLabel?: string;
  /**
   * Brand and language switch only, no page nav — for a coming-soon page or
   * any page whose nav targets do not exist yet.
   */
  minimal?: boolean;
}>();
</script>

<template>
  <header class="site-header">
    <div class="container site-header__inner">
      <a class="site-header__brand" :href="homeHref">{{ businessName }}</a>

      <div class="site-header__right">
        <SiteNav
          v-if="!minimal"
          :links="links"
          :current="current"
          :menu-label="menuLabel"
          :close-label="closeLabel"
        />

        <nav class="lang-switch" :aria-label="languageSwitchLabel">
          <a
            v-for="language in languages"
            :key="language.code"
            class="lang-switch__link"
            :href="language.href"
            :hreflang="language.code"
            :aria-current="language.current ? 'true' : 'false'"
          >
            <abbr :title="language.name">{{ language.code.toUpperCase() }}</abbr>
          </a>
        </nav>
      </div>
    </div>
  </header>
</template>
