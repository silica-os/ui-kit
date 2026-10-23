<script>
let uid = 0
</script>

<script setup>
import { computed, inject, nextTick, ref } from 'vue'
import SIcon from './SIcon.vue'
import { useSelection, toArray, fromArray } from './useSelection.js'
import './selection.css'

/**
 * A grid of items on a regular lattice (Grids/*). `variant`:
 *  - icons: 96 × 116 items, the file (a white card with a glyph, or your own via the `icon` slot) on a 80 pt plate and its name below. The
 *    selected item gets a soft plate and an accent pill under the name; in the background both are neutral.
 *  - thumbnails: 112 pt images with rounded corners; the selected one is ringed in accent with a check badge.
 * `items`: [{ id, label, icon?, image?, disabled? }] (`image` is a url or any CSS background). `v-model` is the selected ids (an array, or
 * the one id with `:multiple="false"`). Arrows move across the rows and the columns, Shift extends, Home / End, Page keys, type-select and
 * Return work as in a table. `action` is a double click or Return.
 */
const props = defineProps({
  items: { type: Array, default: () => [] },
  modelValue: { type: [Array, String, Number], default: () => [] },
  multiple: { type: Boolean, default: true },
  variant: { type: String, default: 'icons', validator: (v) => ['icons', 'thumbnails'].includes(v) },
  height: { type: [Number, String], default: 0 },
  inactive: Boolean,
  followFocus: { type: Boolean, default: true },
})
const emit = defineEmits(['update:modelValue', 'action'])
const win = inject('s-window', null)
const id = `s-grid-${++uid}`
const root = ref(null)
const focused = ref(false)
const off = computed(() => props.inactive || (win?.inactive ?? false) || (props.followFocus && !focused.value))
const selected = computed(() => toArray(props.modelValue))
const selectedSet = computed(() => new Set(selected.value))
const byId = computed(() => new Map(props.items.map((it) => [it.id, it])))

// how many items fit in a row, read from the layout (the first row is the items that share the first one's top)
function perRow() {
  const els = root.value ? [...root.value.querySelectorAll('.s-grid__item')] : []
  if (!els.length) return 1
  const top = els[0].offsetTop
  const n = els.findIndex((el) => el.offsetTop !== top)
  return n < 0 ? els.length : n
}
const sel = useSelection({
  ids: () => props.items.map((it) => it.id),
  selected: () => selected.value,
  select: (arr) => emit('update:modelValue', fromArray(arr, props.multiple)),
  multiple: () => props.multiple,
  disabled: (i) => !!byId.value.get(i)?.disabled,
  label: (i) => byId.value.get(i)?.label,
  activate: (i) => emit('action', byId.value.get(i)),
  step: (dir, i) => ({ left: i - 1, right: i + 1, up: i - perRow(), down: i + perRow() }[dir]),
  page: () => perRow() * Math.max(1, Math.floor((root.value?.clientHeight || 280) / (props.variant === 'icons' ? 124 : 120))),
  reveal: (i) => nextTick(() => root.value?.querySelector(`[data-id="${CSS.escape(String(i))}"]`)?.scrollIntoView({ block: 'nearest' })),
})
function onDown(it, e) {
  if (e.button !== 0) return
  root.value?.focus({ preventScroll: true })
  sel.click(it.id, e)
}
function onFocusOut(e) { if (!root.value.contains(e.relatedTarget)) focused.value = false }
const css = (img) => (/^(https?:|\/|data:|\.)/.test(img) ? `center / cover url("${img}")` : img)
const activeId = computed(() => sel.cursor.value ?? selected.value[selected.value.length - 1])
const style = computed(() => ({ height: props.height ? (typeof props.height === 'number' ? props.height + 'px' : props.height) : null }))
</script>

<template>
  <div
    ref="root" class="s-grid" :class="[`s-grid--${variant}`, { 'is-inactive': off }]" :style="style" role="listbox" tabindex="0" :aria-multiselectable="multiple || undefined"
    :aria-activedescendant="activeId != null ? `${id}-${activeId}` : undefined" @keydown="sel.keydown" @focusin="focused = true" @focusout="onFocusOut"
  >
    <div
      v-for="it in items" :id="`${id}-${it.id}`" :key="it.id" class="s-grid__item" role="option" :data-id="it.id" :title="it.label"
      :class="{ 'is-selected': selectedSet.has(it.id), 'is-disabled': it.disabled }" :aria-selected="selectedSet.has(it.id)" :aria-disabled="it.disabled || undefined"
      @mousedown="onDown(it, $event)" @dblclick="!it.disabled && emit('action', it)"
    >
      <template v-if="variant === 'icons'">
        <div class="s-grid__plate"><slot name="icon" :item="it"><div class="s-grid__file"><SIcon :name="it.icon || 'doc-text'" :size="28" /></div></slot></div>
        <div class="s-grid__name"><span class="s-grid__pill">{{ it.label }}</span></div>
      </template>
      <template v-else>
        <div class="s-grid__image" :style="it.image ? { background: css(it.image) } : null" />
        <span class="s-grid__check"><SIcon name="checkmark" :size="12" /></span>
      </template>
    </div>
  </div>
</template>

<style>
.s-grid { position: relative; box-sizing: border-box; display: grid; justify-content: start; align-content: start; padding: 16px; min-height: 0; overflow: auto; background: var(--surface-raised); color: var(--text-primary); font: var(--font-caption); outline: none; }
.s-grid:focus-visible { box-shadow: inset 0 0 0 2px var(--line-focus); }
.s-grid--icons { grid-template-columns: repeat(auto-fill, 96px); gap: 8px 0; }
.s-grid--thumbnails { grid-template-columns: repeat(auto-fill, 112px); gap: 8px; }
.s-grid__item { position: relative; cursor: default; }
.s-grid--icons .s-grid__item { width: 96px; height: 116px; }
.s-grid--thumbnails .s-grid__item { width: 112px; height: 112px; }
.s-grid__item.is-disabled { opacity: 0.45; }

/* icons: the plate shows only when selected; the pill carries the name */
.s-grid__plate { position: absolute; left: 8px; top: 4px; width: 80px; height: 80px; display: grid; place-items: center; border-radius: 10px; transition: background var(--fade-quick); }
.s-grid__file { display: grid; place-items: center; width: 52px; height: 64px; box-sizing: border-box; border-radius: 8px; background: var(--surface-raised); color: var(--accent-amalfi); box-shadow: inset 0 0 0 1px var(--line-border), 0 2px 6px #0000002e; }
:where([data-theme='dark']) .s-grid__file { background: var(--surface-control); }
@media (prefers-color-scheme: dark) { :root:not([data-theme]) .s-grid__file { background: var(--surface-control); } }
.s-grid__item.is-selected .s-grid__plate { background: var(--line-separator); }
.s-grid__name { position: absolute; left: 4px; right: 4px; top: 90px; height: 20px; display: flex; justify-content: center; }
.s-grid__pill { display: block; max-width: 100%; box-sizing: border-box; padding: 0 8px; border-radius: 6px; line-height: 20px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: center; transition: background var(--fade-quick); }
.s-grid__item.is-selected .s-grid__pill { background: var(--accent-amalfi); color: var(--text-on-accent); }

/* thumbnails: ring and badge */
.s-grid__image { position: absolute; inset: 0; border-radius: 10px; background: linear-gradient(135deg, #ffe38a, #ff9f4d); }
.s-grid__image::after { content: ''; position: absolute; inset: 0; border-radius: 10px; box-shadow: inset 0 0 0 0 var(--accent-amalfi); transition: box-shadow var(--fade-quick); }
.s-grid__item.is-selected .s-grid__image::after { box-shadow: inset 0 0 0 3px var(--accent-amalfi); }
.s-grid__check { position: absolute; right: 8px; bottom: 8px; width: 20px; height: 20px; display: grid; place-items: center; border-radius: 10px; background: var(--accent-amalfi); color: var(--text-on-accent); opacity: 0; scale: 0.6; transition: opacity var(--fade-quick), scale var(--spring-snappy); }
.s-grid__item.is-selected .s-grid__check { opacity: 1; scale: 1; }

/* in the background everything selected goes neutral */
.s-grid.is-inactive .s-grid__item.is-selected .s-grid__pill { background: var(--s-sel-off); color: var(--text-primary); }
.s-grid.is-inactive .s-grid__item.is-selected .s-grid__image::after { box-shadow: inset 0 0 0 3px var(--text-tertiary); }
.s-grid.is-inactive .s-grid__check { background: var(--text-tertiary); }
@media (prefers-reduced-motion: reduce) { .s-grid__check { transition: opacity var(--fade-quick); scale: 1; } }
</style>
