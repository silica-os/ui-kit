<script setup>
import { computed, inject } from 'vue'
import SIcon from './SIcon.vue'

/**
 * Sidebar row: coloured glyph, label, optional count `badge`, or an eject button (`eject`, for volumes). Selected comes from the
 * parent's v-model (compare `value`) or from the `selected` prop. Emits `click` and `eject`.
 */
const props = defineProps({
  label: { type: String, default: '' },
  icon: { type: String, default: '' },
  value: { type: [String, Number], default: undefined },
  selected: { type: Boolean, default: undefined },
  badge: { type: [String, Number], default: '' },
  eject: Boolean,
  disabled: Boolean,
  /** hover | pressed | focus to show a state without the pointer (showcase) */
  force: { type: String, default: '' },
})
const emit = defineEmits(['click', 'eject'])
const sb = inject('s-sidebar', null)
const isSelected = computed(() => props.selected ?? (props.value !== undefined && sb?.value === props.value))
function onClick(e) { if (props.value !== undefined) sb?.select(props.value); emit('click', e) }
</script>

<template>
  <div class="s-sidebar__rowwrap">
    <button
      type="button" class="s-control s-sidebar__row" :class="[{ 'is-selected': isSelected, 'is-inactive': sb?.inactive, 'has-eject': eject }, force && `is-${force}`]"
      :disabled="disabled" :aria-current="isSelected ? 'true' : undefined" @click="onClick"
    >
      <SIcon v-if="icon" :name="icon" :size="20" class="s-sidebar__icon" />
      <span class="s-sidebar__label"><slot>{{ label }}</slot></span>
      <span v-if="badge !== ''" class="s-sidebar__badge">{{ badge }}</span>
    </button>
    <button v-if="eject" type="button" class="s-control s-sidebar__eject" aria-label="Eject" :disabled="disabled" @click.stop="emit('eject')"><SIcon name="eject" :size="16" /></button>
  </div>
</template>

<style>
.s-sidebar__rowwrap { position: relative; flex: none; }
.s-sidebar__row {
  position: relative; display: flex; align-items: center; gap: 8px; width: 100%; height: 32px; padding: 0 12px; margin: 0; border: 0; border-radius: 8px;
  background: none; text-align: left; cursor: default; font: var(--font-sidebar); color: var(--text-primary); box-sizing: border-box;
  transition: background var(--fade-quick);
}
.s-sidebar__row.has-eject { padding-right: 40px; }
.s-sidebar__icon { color: var(--accent-amalfi); }
.s-sidebar__label { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.s-sidebar__row:is(:hover, .is-hover):not(.is-selected) { background: var(--line-separator); }
.s-sidebar__row:is(:active, .is-pressed):not(.is-selected) { background: var(--line-border); }
.s-sidebar__row.is-selected { background: var(--accent-amalfi-soft); font: var(--font-sidebar-emphasis); }
.s-sidebar__row.is-selected.is-inactive { background: var(--surface-control-pressed); color: var(--text-secondary); }
.s-sidebar__row.is-selected.is-inactive .s-sidebar__icon { color: var(--text-secondary); }
:where([data-theme='dark']) .s-sidebar__row.is-selected.is-inactive { background: var(--surface-control); } /* the kit uses Control (not Pressed) in dark */
@media (prefers-color-scheme: dark) { :root:not([data-theme]) .s-sidebar__row.is-selected.is-inactive { background: var(--surface-control); } }
.s-sidebar__row:is(:focus-visible, .is-focus) { box-shadow: inset 0 0 0 2px var(--line-focus); }
.s-sidebar__row:disabled { opacity: 0.35; }
.s-sidebar__row:disabled .s-sidebar__icon { color: var(--text-secondary); }
.s-sidebar__badge {
  display: inline-flex; align-items: center; justify-content: center; flex: none; min-width: 26px; height: 16px; padding: 0 6px; box-sizing: border-box; border-radius: 8px;
  background: var(--surface-raised); box-shadow: inset 0 0 0 1px var(--line-border); font: var(--font-caption); color: var(--text-secondary);
}
.s-sidebar__eject { position: absolute; right: 10px; top: 4px; width: 24px; height: 24px; display: grid; place-items: center; border: 0; background: none; border-radius: 7px; color: var(--text-secondary); cursor: default; }
.s-sidebar__eject:hover { background: var(--line-separator); }
.s-sidebar__eject:focus-visible { box-shadow: inset 0 0 0 2px var(--line-focus); }
</style>
