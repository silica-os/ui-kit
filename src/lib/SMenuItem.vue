<script setup>
import { inject, ref, useSlots } from 'vue'
import SIcon from './SIcon.vue'

/**
 * A menu row: label, optional checkmark, glyph (`icon`), `shortcut` text and a submenu chevron. `destructive` highlights in
 * terracotta. With `header` it is a small section title instead. Put an <SMenu> in the `submenu` slot for a cascade: it opens
 * on hover, Enter or →. Emits `click` unless disabled.
 */
const props = defineProps({
  label: { type: String, default: '' },
  icon: { type: String, default: '' },
  shortcut: { type: String, default: '' },
  checked: Boolean,
  destructive: Boolean,
  disabled: Boolean,
  header: Boolean,
  /** shows the chevron even without a submenu slot */
  submenu: Boolean,
  /** hover | focus to show the highlight without the pointer (showcase) */
  force: { type: String, default: '' },
})
const emit = defineEmits(['click'])
const menu = inject('s-menu', null)
const el = ref(null)
const open = ref(false)
const slots = useSlots()

function onClick(e) {
  if (props.disabled) return
  if (slots.submenu) { open.value = true; return }
  emit('click', e)
  menu?.activated(e)
}
function onKey(e) {
  if (e.key === 'ArrowRight' && slots.submenu) { open.value = true; e.preventDefault(); e.stopPropagation(); requestAnimationFrame(() => el.value.querySelector('.s-menu__item:not(:disabled)')?.focus()) }
  else if (e.key === 'ArrowLeft' && open.value) { open.value = false; e.preventDefault(); e.stopPropagation(); el.value.querySelector(':scope > .s-menu__item')?.focus() }
}
function onEnter(e) { if (!props.disabled) e.currentTarget.querySelector(':scope > .s-menu__item')?.focus({ preventScroll: true }); if (!props.disabled) open.value = true }
</script>

<template>
  <div v-if="header" class="s-menu__header" role="presentation"><slot>{{ label }}</slot></div>
  <div v-else ref="el" class="s-menu__row" @mouseenter="onEnter" @mouseleave="open = false" @keydown="onKey">
    <button
      type="button" role="menuitem" class="s-control s-menu__item" :class="[{ 's-menu__item--destructive': destructive, 'has-icon': icon && !checked }, force && `is-${force}`]"
      :disabled="disabled" :aria-checked="checked || undefined" :aria-haspopup="submenu || $slots.submenu ? 'menu' : undefined" @click="onClick"
    >
      <span v-if="icon && !checked" class="s-menu__lead"><SIcon :name="icon" :size="20" /></span>
      <span v-else class="s-menu__check"><SIcon v-if="checked" name="checkmark" :size="12" /></span>
      <span v-if="icon && checked" class="s-menu__app"><SIcon :name="icon" :size="16" /></span>
      <span class="s-menu__label"><slot>{{ label }}</slot></span>
      <span v-if="shortcut" class="s-menu__shortcut">{{ shortcut }}</span>
      <span v-if="submenu || $slots.submenu" class="s-menu__chevron"><SIcon name="chevron-right" :size="16" /></span>
    </button>
    <div v-if="$slots.submenu && open" class="s-menu__cascade"><slot name="submenu" /></div>
  </div>
</template>

<style>
.s-menu__row { position: relative; flex: none; }
.s-menu__item {
  position: relative; display: flex; align-items: center; gap: 4px; width: 100%; height: 24px; padding: 0 8px; margin: 0; border: 0; border-radius: 7px;
  background: none; text-align: left; cursor: default; white-space: nowrap; font: var(--font-body); color: var(--text-primary); box-sizing: border-box;
}
.s-menu__item:disabled { opacity: 0.35; }
.s-menu__check { display: inline-flex; width: 12px; height: 12px; flex: none; align-items: center; justify-content: center; }
.s-menu__lead { display: inline-flex; flex: none; width: 20px; height: 20px; margin-right: 4px; }
.s-menu__app { display: inline-flex; flex: none; margin-left: 0; }
.s-menu__label { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.s-menu__shortcut { flex: none; color: var(--text-secondary); text-align: right; padding-left: 12px; }
.s-menu__chevron { display: inline-flex; flex: none; color: var(--text-secondary); margin-right: 0; }

/* highlighted (hover, keyboard focus): the accent fill of the kit; destructive uses terracotta */
.s-menu__item:is(:hover, :focus-visible, :focus, .is-hover, .is-focus):not(:disabled) { background: var(--accent-amalfi); color: var(--text-on-accent); }
.s-menu__item--destructive:is(:hover, :focus-visible, :focus, .is-hover, .is-focus):not(:disabled) { background: var(--palette-terracotta); }
.s-menu__item:is(:hover, :focus-visible, :focus, .is-hover, .is-focus):not(:disabled) :is(.s-menu__shortcut, .s-menu__chevron) { color: var(--text-on-accent); }

.s-menu__header { height: 24px; padding: 4px 8px 0 12px; box-sizing: border-box; font: var(--font-label); color: var(--text-tertiary); display: flex; align-items: center; flex: none; }

.s-menu__cascade { position: absolute; left: calc(100% - 4px); top: -4px; z-index: 10; }
</style>
