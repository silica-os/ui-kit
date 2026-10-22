<script setup>
import SIcon from './SIcon.vue'

/** One tab of an <STabBar>: leading glyph slot, label, a close button that shows on hover. Emits `select` and `close`. */
defineProps({
  label: { type: String, default: '' },
  icon: { type: String, default: '' },
  selected: Boolean,
  closable: { type: Boolean, default: true },
  force: { type: String, default: '' },
})
const emit = defineEmits(['select', 'close'])
</script>

<template>
  <div class="s-tab" :class="[{ 'is-selected': selected }, force && `is-${force}`]" role="tab" :aria-selected="selected" :tabindex="selected ? 0 : -1" @click="emit('select')" @keydown.enter.prevent="emit('select')" @keydown.space.prevent="emit('select')">
    <span class="s-tab__lead"><slot name="icon"><SIcon v-if="icon" :name="icon" :size="12" /></slot></span>
    <span class="s-tab__label">{{ label }}</span>
    <span class="s-tab__close">
      <button v-if="closable" type="button" class="s-control s-tab__x" aria-label="Close tab" tabindex="-1" @click.stop="emit('close')"><SIcon name="xmark" :size="12" /></button>
    </span>
  </div>
</template>

<style>
.s-tab {
  position: relative; display: flex; align-items: center; gap: 4px; flex: 1 1 0; min-width: 0; max-width: 240px; height: 28px; padding: 0 8px; box-sizing: border-box; border-radius: 9px;
  cursor: default; user-select: none; -webkit-user-select: none; outline: none; color: var(--text-secondary); font: var(--font-body-emphasis); font-weight: 400;
}
.s-tab__lead { display: inline-flex; width: 12px; height: 12px; flex: none; align-items: center; justify-content: center; }
.s-tab__label { flex: 1; min-width: 0; text-align: left; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font: var(--font-body); font-weight: 500; }
.s-tab__close { display: inline-flex; width: 12px; height: 12px; flex: none; color: var(--text-secondary); }
.s-tab__x { display: grid; place-items: center; width: 12px; height: 12px; padding: 0; border: 0; background: none; color: inherit; cursor: default; opacity: 0; }
.s-tab:is(:hover, .is-hover) { background: var(--accent-amalfi-soft); }
.s-tab:is(:hover, .is-hover, :focus-visible) .s-tab__x, .s-tab.is-selected .s-tab__x { opacity: 1; }
.s-tab.is-selected { background: var(--surface-raised); color: var(--text-primary); box-shadow: inset 0 0 0 1px var(--line-border), var(--elevation-1); }
.s-tab:focus-visible { box-shadow: 0 0 0 3px var(--line-focus); }
.s-tab.is-selected:focus-visible { box-shadow: inset 0 0 0 1px var(--line-border), 0 0 0 3px var(--line-focus); }
</style>
