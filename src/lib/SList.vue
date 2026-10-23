<script>
let uid = 0
</script>

<script setup>
import { computed, inject, nextTick, ref } from 'vue'
import SIcon from './SIcon.vue'
import { useSelection, toArray, fromArray } from './useSelection.js'
import './selection.css'

/**
 * A list (Lists/*): one column of 44 pt rows (60 pt with a second line), a rounded glyph tile in front, an accessory at the end and a
 * hairline between rows that starts under the title. The selected row takes the accent pill, 8 pt in from the edges; in the background
 * (`inactive`, or the list is not the focused control) it turns neutral grey.
 * - `items`: [{ id, title, subtitle?, icon?, tile?, value?, disabled? }] (`tile` is the tile colour, the accent by default; `value` is the
 *   text before the chevron); or `sections`: [{ title, items }] for headers.
 * - `v-model` is the selected id (an array with `multiple`). Arrows, Home / End, Page keys, type-select and Return work as in a table.
 * - `accessory`: 'chevron' (default) or 'none'. Slots: `row` ({ item }) replaces the row's text, `accessory` ({ item }).
 */
const props = defineProps({
  items: { type: Array, default: () => [] },
  sections: { type: Array, default: null },
  modelValue: { type: [Array, String, Number], default: null },
  multiple: Boolean,
  accessory: { type: String, default: 'chevron', validator: (v) => ['chevron', 'none'].includes(v) },
  height: { type: [Number, String], default: 0 },
  inactive: Boolean,
  followFocus: { type: Boolean, default: true },
})
const emit = defineEmits(['update:modelValue', 'action'])
const win = inject('s-window', null)
const id = `s-list-${++uid}`
const root = ref(null)
const focused = ref(false)
const off = computed(() => props.inactive || (win?.inactive ?? false) || (props.followFocus && !focused.value))
const selected = computed(() => toArray(props.modelValue))
const selectedSet = computed(() => new Set(selected.value))

// the rows in display order, each with the section it belongs to
const groups = computed(() => (props.sections ? props.sections : [{ title: '', items: props.items }]))
const flat = computed(() => groups.value.flatMap((g) => g.items))
const byId = computed(() => new Map(flat.value.map((it) => [it.id, it])))
const nextSelected = (it) => selectedSet.value.has(flat.value[flat.value.indexOf(it) + 1]?.id)

const sel = useSelection({
  ids: () => flat.value.map((it) => it.id),
  selected: () => selected.value,
  select: (arr) => emit('update:modelValue', fromArray(arr, props.multiple)),
  multiple: () => props.multiple,
  disabled: (i) => !!byId.value.get(i)?.disabled,
  label: (i) => byId.value.get(i)?.title,
  activate: (i) => emit('action', byId.value.get(i)),
  page: () => Math.floor((root.value?.clientHeight || 280) / 44),
  reveal: (i) => nextTick(() => root.value?.querySelector(`[data-id="${CSS.escape(String(i))}"]`)?.scrollIntoView({ block: 'nearest' })),
})
function onDown(it, e) {
  if (e.button !== 0) return
  root.value?.focus({ preventScroll: true })
  sel.click(it.id, e)
}
function onFocusOut(e) { if (!root.value.contains(e.relatedTarget)) focused.value = false }
const activeId = computed(() => sel.cursor.value ?? selected.value[selected.value.length - 1])
const style = computed(() => ({ height: props.height ? (typeof props.height === 'number' ? props.height + 'px' : props.height) : null }))
</script>

<template>
  <div
    ref="root" class="s-list" :class="{ 'is-inactive': off }" :style="style" role="listbox" tabindex="0" :aria-multiselectable="multiple || undefined"
    :aria-activedescendant="activeId != null ? `${id}-${activeId}` : undefined" @keydown="sel.keydown" @focusin="focused = true" @focusout="onFocusOut"
  >
    <template v-for="(g, gi) in groups" :key="gi">
      <div v-if="g.title" class="s-list__header" role="presentation">{{ g.title }}</div>
      <div
        v-for="it in g.items" :id="`${id}-${it.id}`" :key="it.id" class="s-list__row" role="option" :data-id="it.id"
        :class="{ 'is-selected': selectedSet.has(it.id), 'is-disabled': it.disabled, 'has-subtitle': !!it.subtitle, 'has-icon': !!it.icon, 'before-selected': nextSelected(it) }" :aria-selected="selectedSet.has(it.id)" :aria-disabled="it.disabled || undefined"
        @mousedown="onDown(it, $event)" @dblclick="!it.disabled && emit('action', it)"
      >
        <span v-if="it.icon" class="s-list__tile" :style="it.tile ? { background: it.tile } : null"><SIcon :name="it.icon" :size="16" /></span>
        <span class="s-list__text"><slot name="row" :item="it"><span class="s-list__title">{{ it.title }}</span><span v-if="it.subtitle" class="s-list__subtitle">{{ it.subtitle }}</span></slot></span>
        <slot name="accessory" :item="it">
          <span v-if="it.value" class="s-list__value">{{ it.value }}</span>
          <SIcon v-if="accessory === 'chevron'" name="chevron-right" :size="12" class="s-list__chevron" />
        </slot>
      </div>
    </template>
  </div>
</template>

<style>
.s-list { position: relative; box-sizing: border-box; min-height: 0; overflow: auto; background: var(--surface-raised); color: var(--text-primary); font: var(--font-body); outline: none; }
.s-list:focus-visible { box-shadow: inset 0 0 0 2px var(--line-focus); }
.s-list__header { height: 28px; padding: 2px 16px 0; box-sizing: border-box; display: flex; align-items: center; font: var(--font-headline); color: var(--text-secondary); }
.s-list__row { position: relative; display: flex; align-items: center; gap: 12px; min-height: 44px; padding: 0 8px; box-sizing: border-box; cursor: default; }
.s-list__row.has-subtitle { min-height: 60px; }
.s-list__row > * { position: relative; z-index: 1; }
/* the hairline starts under the title and goes away next to the selection */
.s-list__row::after { content: ''; position: absolute; left: 56px; right: 8px; bottom: 0; height: 1px; background: var(--line-separator); }
.s-list__row:is(.is-selected, .before-selected)::after { display: none; }
.s-list__row::before { content: ''; position: absolute; left: 8px; right: 8px; top: 0; bottom: 0; border-radius: 8px; transition: background var(--fade-quick); }
.s-list__row.is-selected::before { background: var(--accent-amalfi); }
.s-list__row.is-selected { color: var(--text-on-accent); }
.s-list__tile { flex: none; display: grid; place-items: center; width: 28px; height: 28px; margin-left: 8px; border-radius: 7px; background: var(--accent-amalfi); color: var(--text-on-accent); }
.s-list__row:not(.has-icon) .s-list__text:first-child { margin-left: 8px; }
.s-list__text { flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.s-list__row.has-subtitle .s-list__text { padding-bottom: 2px; } /* the kit's two lines start 11 pt from the top, not 12 */
.s-list__title, .s-list__subtitle { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.s-list__subtitle { font: var(--font-callout); color: var(--text-secondary); }
.s-list__value { flex: none; font: var(--font-body); color: var(--text-secondary); }
.s-list__chevron { flex: none; margin-right: 12px; color: var(--text-tertiary); }
.s-list__row.is-selected :is(.s-list__subtitle, .s-list__value, .s-list__chevron) { color: var(--text-on-accent); }
.s-list__row.is-selected .s-list__tile { background: #ffffff40; }
.s-list__row.is-disabled { color: var(--text-tertiary); }
.s-list__row.is-disabled .s-list__tile { background: var(--text-tertiary); }
.s-list__row.is-disabled :is(.s-list__subtitle, .s-list__value) { color: var(--text-tertiary); }
.s-list.is-inactive .s-list__row.is-selected::before { background: var(--s-sel-off); }
.s-list.is-inactive .s-list__row.is-selected { color: var(--text-primary); }
.s-list.is-inactive .s-list__row.is-selected :is(.s-list__subtitle, .s-list__value) { color: var(--text-secondary); }
.s-list.is-inactive .s-list__row.is-selected .s-list__chevron { color: var(--text-tertiary); }
.s-list.is-inactive .s-list__row.is-selected .s-list__tile { background: var(--accent-amalfi); }
</style>
