<script setup>
import { inject } from 'vue'
import SIcon from './SIcon.vue'

/**
 * The title of a window: headline, optional grey `subtitle` under it, or the document proxy (file glyph before, chevron after).
 * It greys out in an inactive window. `flex` makes it take the free space of a toolbar row (`align` start | center).
 */
const props = defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  document: Boolean,
  flex: Boolean,
  align: { type: String, default: 'start', validator: (v) => ['start', 'center'].includes(v) },
  inactive: { type: Boolean, default: undefined },
})
const win = inject('s-window', null)
const off = () => props.inactive ?? win?.inactive ?? false
</script>

<template>
  <div class="s-tbtitle" :class="[{ 'is-inactive': off(), 'is-flex': flex }, `s-tbtitle--${align}`]">
    <SIcon v-if="document" name="doc" :size="16" class="s-tbtitle__doc" />
    <div class="s-tbtitle__text">
      <span class="s-tbtitle__title"><slot>{{ title }}</slot></span>
      <span v-if="subtitle" class="s-tbtitle__sub">{{ subtitle }}</span>
    </div>
    <SIcon v-if="document" name="chevron-down" :size="12" class="s-tbtitle__chevron" />
  </div>
</template>

<style>
.s-tbtitle { display: flex; align-items: center; gap: 4px; flex: none; min-width: 0; padding: 0 8px; color: var(--text-primary); }
.s-tbtitle.is-flex { flex: 1 1 0; }
.s-tbtitle--center { justify-content: center; text-align: center; }
.s-tbtitle__text { display: flex; flex-direction: column; min-width: 0; }
.s-tbtitle--center .s-tbtitle__text { align-items: center; }
.s-tbtitle__title { font: var(--font-headline); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 600; }
.s-tbtitle__sub { font: var(--font-caption); color: var(--text-tertiary); white-space: nowrap; }
.s-tbtitle__doc { color: var(--text-secondary); }
.s-tbtitle__chevron { color: var(--text-tertiary); }
.s-tbtitle.is-inactive .s-tbtitle__title, .s-tbtitle.is-inactive .s-tbtitle__doc { color: var(--text-tertiary); }
</style>
