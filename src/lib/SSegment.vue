<script setup>
import { computed, inject } from 'vue'
import SIcon from './SIcon.vue'

/**
 * One item of an <SSegmented>: a label, an icon, or both. Use it as a child of SSegmented when the `items` prop is not enough;
 * the control tells it its size, whether it is selected and how to select it.
 */
const props = defineProps({
  value: { type: [String, Number, Boolean], required: true },
  label: { type: String, default: '' },
  icon: { type: String, default: '' },
  disabled: Boolean,
  /** hover | pressed | focus, to show a state without the pointer (showcase) */
  force: { type: String, default: '' },
})
const seg = inject('s-segmented')
const selected = computed(() => !seg.action && seg.isSelected(props.value))
const iconSize = computed(() => seg.iconSize.value)
// a single-select control selects on pointer release (see SSegmented); a click with no pointer (keyboard) selects here
function onClick(e) { if (seg.action || seg.multiple || e.detail === 0) seg.select(props.value) }
</script>

<template>
  <button
    type="button" class="s-control s-segment" :class="[{ 'is-selected': selected, 'is-icon': icon && !label && !$slots.default }, force && `is-${force}`]"
    :role="seg.action ? undefined : seg.multiple ? 'checkbox' : 'radio'" :aria-checked="seg.action ? undefined : selected"
    :tabindex="seg.action || seg.isTabStop(value) ? 0 : -1" :disabled="disabled" :data-value="value" :aria-label="icon && !label ? String(value) : undefined"
    @click="onClick" @keydown="seg.onKey($event, value)" @pointerdown="seg.down(value, $event)"
  >
    <SIcon v-if="icon" :name="icon" :size="iconSize" class="s-segment__icon" />
    <span v-if="label || $slots.default" class="s-segment__label"><slot>{{ label }}</slot></span>
  </button>
</template>

<style>
.s-segment {
  position: relative; z-index: 1; display: inline-flex; align-items: center; justify-content: center; gap: 4px; min-width: 0;
  height: var(--seg-item-h); padding: 0 6px; margin: 0; border: 0; background: none; cursor: pointer; white-space: nowrap;
  border-radius: calc(var(--seg-item-h) / 2); color: var(--text-primary); font: var(--seg-font);
}
.s-segment.is-icon { padding: 0; }
.s-segment__label { overflow: hidden; text-overflow: ellipsis; }
.s-segment:is(:focus-visible, .is-focus) { outline: 3px solid var(--line-focus); outline-offset: 0; }
/* hover: a soft pill; selected in "any" mode draws its own raised pill (a single-select control slides one thumb instead) */
.s-segment:is(:hover, .is-hover):not(.is-selected, :active, .is-pressed) { background: var(--line-separator); }
.s-segmented--any .s-segment.is-selected { background: var(--surface-control); box-shadow: inset 0 0 0 1px var(--line-border), 0 1px 2px #0000001a; }
.s-segment { transition: background var(--fade-quick), box-shadow var(--fade-quick); }
.s-segment:is(:active, .is-pressed):not(.is-selected) { background: var(--line-border); }
.s-segmented--stacked .s-segment.is-selected .s-segment__icon { color: var(--accent-amalfi); }

/* icon over label (96 x 44 in the kit) */
.s-segmented--stacked .s-segment { flex-direction: column; gap: 1px; padding: 4px 0; font: var(--font-caption); }
.s-segmented--stacked .s-segment.is-icon { padding: 0; }

/* action segments: a hover pill inset 4 pt, a taller pressed pill */
.s-segmented--action .s-segment { border-radius: calc(var(--seg-item-h) / 2); }
.s-segmented--action .s-segment::before { content: ''; position: absolute; inset: var(--seg-action-inset) 4px; border-radius: inherit; background: none; transition: background var(--fade-quick); }
.s-segmented--action .s-segment:is(:hover, .is-hover)::before { background: var(--line-separator); }
.s-segmented--action .s-segment:is(:active, .is-pressed)::before { background: var(--line-border); }
.s-segmented--action .s-segment:is(:hover, .is-hover):not(:active, .is-pressed) { background: none; }
.s-segmented--action .s-segment > * { position: relative; }
.s-segmented--action .s-segment:disabled { opacity: 0.35; }
</style>
