<script setup>
import { ref, watch } from 'vue'
import SDisclosureTriangle from './SDisclosureTriangle.vue'

/**
 * Collapsible section (Disclosure/Group): a header row with the triangle and a `title`, and content indented to line up with the title.
 * v-model:open; the height animates. Space/Enter on the header toggle it. The `title` slot replaces the title text.
 */
const props = defineProps({
  title: { type: String, default: '' },
  open: { type: Boolean, default: false },
  disabled: Boolean,
  force: { type: String, default: '' },
})
const emit = defineEmits(['update:open'])
const isOpen = ref(props.open)
watch(() => props.open, (v) => (isOpen.value = v))
const uid = `s-dg-${Math.random().toString(36).slice(2, 8)}`
function toggle() {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  emit('update:open', isOpen.value)
}
</script>

<template>
  <section class="s-dgroup" :class="{ 'is-open': isOpen }">
    <button type="button" class="s-control s-dgroup__header" :class="force && `is-${force}`" :aria-expanded="isOpen" :aria-controls="uid" :disabled="disabled" @click="toggle">
      <SDisclosureTriangle tag="span" :expanded="isOpen" />
      <span class="s-dgroup__title"><slot name="title">{{ title }}</slot></span>
    </button>
    <div :id="uid" class="s-dgroup__body" :inert="!isOpen || undefined"><div class="s-dgroup__clip"><div class="s-dgroup__content"><slot /></div></div></div>
  </section>
</template>

<style>
.s-dgroup { display: flex; flex-direction: column; width: var(--s-dgroup-w, 280px); color: var(--text-primary); }
.s-dgroup__header { display: flex; align-items: center; gap: 4px; width: 100%; height: 28px; padding: 0 12px 0 4px; border: 0; border-radius: 9px; background: none; text-align: left; cursor: pointer; font: var(--font-headline); color: var(--text-primary); transition: background var(--fade-quick); }
.s-dgroup__header:is(:hover, .is-hover):not(:disabled) { background: var(--accent-amalfi-soft); }
.s-dgroup__header:is(:hover, .is-hover) .s-triangle { color: var(--text-secondary); }
.s-dgroup__header:is(:focus-visible, .is-focus) { box-shadow: 0 0 0 3px var(--line-focus); }
.s-dgroup__header:disabled { opacity: 0.35; cursor: default; }
.s-dgroup__title { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.s-dgroup .s-triangle { pointer-events: none; }
.s-dgroup.is-open .s-triangle { transform: none; }
.s-dgroup__body { display: grid; grid-template-rows: 0fr; transition: grid-template-rows var(--fade-standard); }
.s-dgroup.is-open > .s-dgroup__body { grid-template-rows: 1fr; }
.s-dgroup__clip { overflow: hidden; min-height: 0; }
.s-dgroup__content { padding: 4px 0 4px 32px; font: var(--font-callout); color: var(--text-secondary); }
.s-dgroup__content:empty { padding: 0; }
</style>
