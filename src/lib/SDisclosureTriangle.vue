<script setup>
import SIcon from './SIcon.vue'

/** The bare disclosure chevron (Disclosure/Triangle): points right, turns down when `expanded`. v-model:expanded. */
defineProps({ expanded: Boolean, disabled: Boolean, force: { type: String, default: '' }, tag: { type: String, default: 'button' } })
defineEmits(['update:expanded'])
</script>

<template>
  <component
    :is="tag" class="s-triangle" :class="[force && `is-${force}`, { 's-control': tag === 'button', 'is-expanded': expanded }]" :type="tag === 'button' ? 'button' : undefined"
    :disabled="tag === 'button' ? disabled : undefined" :aria-expanded="tag === 'button' ? expanded : undefined" @click="tag === 'button' && $emit('update:expanded', !expanded)"
  ><SIcon class="s-triangle__glyph" name="chevron-right" :size="12" /></component>
</template>

<style>
.s-triangle { display: inline-grid; place-items: center; flex: none; width: 24px; height: 24px; padding: 0; border: 0; border-radius: 7px; background: none; color: var(--text-secondary); cursor: pointer; transition: background var(--fade-quick), color var(--fade-quick); }
.s-triangle__glyph { transition: transform var(--spring-snappy); }
.s-triangle.is-expanded .s-triangle__glyph { transform: rotate(90deg); }
.s-triangle:is(:hover, .is-hover):not(:disabled) { background: var(--accent-amalfi-soft); color: var(--text-primary); }
.s-triangle:is(:active, .is-pressed):not(:disabled) { background: var(--surface-control-pressed); color: var(--text-primary); }
.s-triangle:is(:focus-visible, .is-focus) { box-shadow: 0 0 0 3px var(--line-focus); }
.s-triangle:disabled { opacity: 0.35; }

/* reduced motion: springs become the short fade (same as --fade-quick), no overshoot or scale */
@media (prefers-reduced-motion: reduce) {
  .s-triangle__glyph { transition-duration: 150ms !important; transition-timing-function: cubic-bezier(0.2, 0, 0, 1) !important; }
}
</style>
