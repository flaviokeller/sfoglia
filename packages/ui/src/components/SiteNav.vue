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

function close() {
  open.value = false;
  // Release the scroll lock applied when the drawer opened.
  document.body.style.removeProperty('overflow');
}

async function openDrawer() {
  open.value = true;
  // The drawer is a fixed overlay — the page behind it must not scroll.
  document.body.style.overflow = 'hidden';
  await nextTick();
  drawer.value?.querySelector<HTMLAnchorElement>('a')?.focus();
}

function toggle() {
  if (open.value) close();
  else void openDrawer();
}

/** Keeps Tab cycling inside the drawer while it is open. */
function onDrawerKeydown(event: KeyboardEvent) {
  if (event.key !== 'Tab' || !drawer.value) return;
  const focusables = [...drawer.value.querySelectorAll<HTMLElement>('a, button')];
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
  document.body.style.removeProperty('overflow');
});
</script>

<template>
  <nav class="nav" aria-label="Navigation">
    <div class="nav__bar">
      <a
        v-for="link in props.links"
        :key="link.href"
        class="nav__link"
        :href="link.href"
        :aria-current="props.current === link.href ? 'page' : 'false'"
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
      @keydown="onDrawerKeydown"
    >
      <a
        v-for="link in props.links"
        :key="link.href"
        class="nav__link"
        :href="link.href"
        :aria-current="props.current === link.href ? 'page' : 'false'"
        @click="close"
        >{{ link.label }}</a
      >
    </div>

    <div class="nav__backdrop" :hidden="!open" @click="close"></div>
  </nav>
</template>
