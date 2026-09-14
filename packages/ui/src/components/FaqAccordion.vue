<script setup lang="ts">
import { ref } from 'vue';

export interface AccordionItem {
  question: string;
  answer: string;
}

const props = withDefaults(
  defineProps<{
    items: AccordionItem[];
    /** Allow more than one panel open at a time. */
    allowMultiple?: boolean;
    /** Index open on first render; -1 for all closed. */
    initialOpen?: number;
  }>(),
  { allowMultiple: false, initialOpen: -1 },
);

const emit = defineEmits<{ toggle: [{ index: number; open: boolean }] }>();

const open = ref(new Set<number>(props.initialOpen >= 0 ? [props.initialOpen] : []));
/*
 * A plain array ref, NOT useTemplateRef: @vitejs/plugin-react (present for the
 * Keystatic admin) runs its Fast Refresh babel transform over this file and
 * treats any `use*` call as a React hook, injecting `$RefreshSig$`. That makes
 * `astro dev` 500 on every page using this component. The production build is
 * unaffected, so it only shows up in dev. Vue fills this array from the
 * `ref="triggers"` inside the v-for.
 */
const triggers = ref<HTMLButtonElement[]>([]);

function isOpen(index: number) {
  return open.value.has(index);
}

function toggle(index: number) {
  const next = props.allowMultiple ? new Set(open.value) : new Set<number>();
  if (open.value.has(index)) next.delete(index);
  else next.add(index);
  open.value = next;
  emit('toggle', { index, open: next.has(index) });
}

/** Roving arrow-key navigation between triggers, per the WAI-ARIA accordion pattern. */
function onKeydown(event: KeyboardEvent, index: number) {
  const keys = ['ArrowDown', 'ArrowUp', 'Home', 'End'];
  if (!keys.includes(event.key)) return;
  event.preventDefault();

  const count = props.items.length;
  const target =
    event.key === 'ArrowDown'
      ? (index + 1) % count
      : event.key === 'ArrowUp'
        ? (index - 1 + count) % count
        : event.key === 'Home'
          ? 0
          : count - 1;

  triggers.value[target]?.focus();
}
</script>

<template>
  <div class="accordion">
    <div
      v-for="(item, index) in props.items"
      :key="item.question"
      class="accordion__item"
      :data-open="isOpen(index) ? '' : null"
    >
      <h3 class="accordion__heading">
        <button
          :id="`accordion-trigger-${index}`"
          ref="triggers"
          class="accordion__trigger"
          type="button"
          :aria-expanded="isOpen(index) ? 'true' : 'false'"
          :aria-controls="`accordion-panel-${index}`"
          @click="toggle(index)"
          @keydown="onKeydown($event, index)"
        >
          <span>{{ item.question }}</span>
          <svg
            class="accordion__icon"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </h3>
      <div
        :id="`accordion-panel-${index}`"
        class="accordion__panel"
        role="region"
        :aria-labelledby="`accordion-trigger-${index}`"
        :hidden="!isOpen(index)"
      >
        <div class="accordion__content">{{ item.answer }}</div>
      </div>
    </div>
  </div>
</template>
