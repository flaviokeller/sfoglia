<script setup lang="ts">
import { computed } from 'vue';
import type { ResponsiveImage } from '../types';

export interface TeamMember {
  name: string;
  role?: string;
  bio?: string;
  /**
   * Already resolved by the caller (Astro's image pipeline cannot run inside a
   * Vue component), so this is plain attributes for an <img>.
   */
  photo?: ResponsiveImage;
}

const props = withDefaults(
  defineProps<{
    members: TeamMember[];
    title?: string;
    /** h1 when the grid is the page itself (Team), h2 as a section of a longer page. */
    as?: 'h1' | 'h2';
    surface?: boolean;
  }>(),
  { as: 'h2', surface: false },
);

/*
 * If nobody has a photo the cards stay text-only. If only some do, the rest get
 * an initials tile of the same shape, so one missing upload does not leave a
 * ragged grid.
 */
const withPhotos = computed(() => props.members.some((member) => member.photo));

/** "Dr. med. dent. Anna Meier" -> "AM". Abbreviated titles are skipped. */
function initials(name: string) {
  const words = name.split(/\s+/).filter((word) => word && !word.endsWith('.'));
  const picked = words.length > 1 ? [words[0], words.at(-1)] : words;
  return picked
    .map((word) => word?.[0] ?? '')
    .join('')
    .toUpperCase();
}
</script>

<template>
  <section v-if="members.length" class="team" :class="{ 'section--surface': surface }">
    <div class="container stack">
      <component :is="as" v-if="title" :class="as === 'h1' ? 'heading-1' : 'heading-2'">{{
        title
      }}</component>
      <ul class="team__list">
        <li v-for="member in members" :key="member.name" class="team__member card">
          <template v-if="withPhotos">
            <img
              v-if="member.photo"
              class="team__photo"
              :src="member.photo.src"
              :srcset="member.photo.srcset"
              :width="member.photo.width"
              :height="member.photo.height"
              :alt="member.photo.alt ?? ''"
              loading="lazy"
            />
            <div v-else class="team__photo team__photo--initials" aria-hidden="true">
              {{ initials(member.name) }}
            </div>
          </template>
          <component :is="as === 'h1' ? 'h2' : 'h3'" class="heading-4">{{ member.name }}</component>
          <p v-if="member.role" class="team__role">{{ member.role }}</p>
          <p v-if="member.bio" class="team__bio">{{ member.bio }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>
