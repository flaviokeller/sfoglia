<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

export interface NavLink {
  href: string;
  label: string;
}

const props = withDefaults(
  defineProps<{
    links: NavLink[];
    /** Current pathname, used to mark the active link. */
    current?: string;
    menuLabel?: string;
    closeLabel?: string;
  }>(),
  {
    current: '',
    menuLabel: 'Menü',
    closeLabel: 'Menü schliessen',
  },
);

const open = ref(false);
const toggleButton = ref<HTMLButtonElement | null>(null);
const drawer = ref<HTMLElement | null>(null);

/*
 * No scoped styles anywhere in this package: every class below is defined in
 * styles/components.css against design tokens. That keeps theme.css the single
 * file you edit to re-theme a client site.
 */

function onDocumentKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && open.value) {
    close();
    toggleButton.value?.focus();
  }
}

/*
 * The page behind the open drawer is scroll-locked in CSS (components.css,
 * `:root:has(...)` inside the drawer's media query), not here: widening the
 * window past the breakpoint then releases the lock by itself instead of
 * leaving a desktop page that cannot scroll.
 */
function close() {
  open.value = false;
}

async function openDrawer() {
  open.value = true;
  await nextTick();
  drawer.value?.querySelector<HTMLAnchorElement>('a')?.focus();
}

function toggle() {
  if (open.value) close();
  else void openDrawer();
}

/** Trailing-slash-insensitive, so `/de/team` and `/de/team/` both mark Team. */
function isCurrent(href: string) {
  const strip = (path: string) => path.replace(/\/+$/, '');
  return strip(props.current) === strip(href);
}

/**
 * Keeps Tab cycling inside the open drawer. The toggle sits outside the drawer
 * in the DOM but is its close button, so it is part of the cycle.
 */
function onNavKeydown(event: KeyboardEvent) {
  if (event.key !== 'Tab' || !open.value || !drawer.value) return;
  const focusables = [
    toggleButton.value,
    ...drawer.value.querySelectorAll<HTMLElement>('a, button'),
  ].filter((element): element is HTMLElement => element !== null);
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (!first || !last) return;

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

onMounted(() => document.addEventListener('keydown', onDocumentKeydown));
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onDocumentKeydown);
});
</script>

<template>
  <nav class="nav" aria-label="Navigation" @keydown="onNavKeydown">
    <div class="nav__bar">
      <a
        v-for="link in props.links"
        :key="link.href"
        class="nav__link"
        :href="link.href"
        :aria-current="isCurrent(link.href) ? 'page' : 'false'"
        >{{ link.label }}</a
      >
    </div>

    <button
      ref="toggleButton"
      class="nav__toggle"
      type="button"
      :aria-expanded="open ? 'true' : 'false'"
      aria-controls="site-nav-drawer"
      @click="toggle"
    >
      <span class="visually-hidden">{{ open ? props.closeLabel : props.menuLabel }}</span>
      <svg
        viewBox="0 0 24 24"
        width="24"
        height="24"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      >
        <path v-if="open" d="M6 6l12 12M18 6L6 18" />
        <path v-else d="M4 7h16M4 12h16M4 17h16" />
      </svg>
    </button>

    <div
      id="site-nav-drawer"
      ref="drawer"
      class="nav__drawer"
      :hidden="!open"
    >
      <a
        v-for="link in props.links"
        :key="link.href"
        class="nav__link"
        :href="link.href"
        :aria-current="isCurrent(link.href) ? 'page' : 'false'"
        @click="close"
        >{{ link.label }}</a
      >
    </div>

    <div class="nav__backdrop" :hidden="!open" @click="close"></div>
  </nav>
</template>
