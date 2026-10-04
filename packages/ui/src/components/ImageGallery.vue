<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';

export interface GalleryImage {
  /** Full-size source, shown in the lightbox. */
  src: string;
  /** Optional smaller source for the grid. Falls back to `src`. */
  thumb?: string;
  alt: string;
  caption?: string;
}

const props = withDefaults(
  defineProps<{
    images: GalleryImage[];
    /** Names the lightbox, and any tile whose image has no alt text. */
    label?: string;
    closeLabel?: string;
    prevLabel?: string;
    nextLabel?: string;
  }>(),
  {
    label: 'Galerie',
    closeLabel: 'Schliessen',
    prevLabel: 'Vorheriges Bild',
    nextLabel: 'Nächstes Bild',
  },
);

const activeIndex = ref<number | null>(null);
const dialog = ref<HTMLDialogElement | null>(null);

const active = computed(() =>
  activeIndex.value === null ? null : (props.images[activeIndex.value] ?? null),
);

/** "3 / 8", announced when stepping so screen readers know the image changed. */
const position = computed(() =>
  activeIndex.value === null ? '' : `${activeIndex.value + 1} / ${props.images.length}`,
);

/**
 * A tile is a link wrapping only its image, so an image with empty alt text
 * would leave an unnamed link. Name those by position instead.
 */
function tileLabel(image: GalleryImage, index: number) {
  return image.alt.trim() ? undefined : `${props.label} ${index + 1} / ${props.images.length}`;
}

/*
 * Built on the native <dialog>: the top layer, the backdrop, Escape-to-close and
 * focus containment all come from the platform. No focus-trap code; the page
 * behind is scroll-locked in CSS (`:root:has(.lightbox[open])`).
 *
 * Tiles are links to the full image, so without JavaScript (or before the
 * island hydrates) they still open the picture. Once hydrated, the click is
 * intercepted and opens the lightbox instead.
 */
async function openAt(index: number) {
  activeIndex.value = index;
  await nextTick();
  dialog.value?.showModal();
}

/** Plain clicks open the lightbox; Cmd/Ctrl/Shift-click keep the link's own behaviour. */
function onTileClick(event: MouseEvent, index: number) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
    return;
  }
  event.preventDefault();
  void openAt(index);
}

function close() {
  dialog.value?.close();
  activeIndex.value = null;
}

function step(delta: number) {
  if (activeIndex.value === null || props.images.length === 0) return;
  activeIndex.value = (activeIndex.value + delta + props.images.length) % props.images.length;
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    step(1);
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault();
    step(-1);
  }
}

/** Clicking the backdrop means the click target is the dialog element itself. */
function onDialogClick(event: MouseEvent) {
  if (event.target === dialog.value) close();
}
</script>

<template>
  <ul v-if="props.images.length" class="gallery" role="list">
    <!-- Keyed by position: the same photo can legitimately appear twice. -->
    <li v-for="(image, index) in props.images" :key="index" class="gallery__item">
      <a
        class="gallery__trigger"
        :href="image.src"
        :aria-label="tileLabel(image, index)"
        @click="onTileClick($event, index)"
      >
        <img :src="image.thumb ?? image.src" :alt="image.alt" loading="lazy" decoding="async" />
      </a>
    </li>
  </ul>

  <dialog
    ref="dialog"
    class="lightbox"
    :aria-label="active?.alt.trim() || props.label"
    @close="activeIndex = null"
    @keydown="onKeydown"
    @click="onDialogClick"
  >
    <div v-if="active" class="lightbox__inner">
      <button class="lightbox__close" type="button" @click="close">
        <span class="visually-hidden">{{ props.closeLabel }}</span>
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
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      <p class="visually-hidden" aria-live="polite">{{ position }}</p>

      <figure class="lightbox__figure">
        <img :src="active.src" :alt="active.alt" />
        <figcaption v-if="active.caption" class="lightbox__caption">
          {{ active.caption }}
        </figcaption>
      </figure>

      <template v-if="props.images.length > 1">
        <button class="lightbox__nav lightbox__nav--prev" type="button" @click="step(-1)">
          <span class="visually-hidden">{{ props.prevLabel }}</span>
          <svg
            viewBox="0 0 24 24"
            width="28"
            height="28"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          >
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <button class="lightbox__nav lightbox__nav--next" type="button" @click="step(1)">
          <span class="visually-hidden">{{ props.nextLabel }}</span>
          <svg
            viewBox="0 0 24 24"
            width="28"
            height="28"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </template>
    </div>
  </dialog>
</template>
