<script>
let uid = 0
</script>

<script setup>
import { computed, inject, nextTick, ref } from 'vue'
import SIcon from './SIcon.vue'
import { useSelection, toArray, fromArray } from './useSelection.js'
import './selection.css'

/**
 * A table (Tables/*): a 28 pt header with the column titles, dividers and the sort chevron, over 28 pt rows that may alternate with a
 * 10% tint (the tint carries on through the empty space). The selected rows take the accent pill, 8 pt in from the edges and rounded
 * to 8 pt; neighbours merge into one block. In a window in the background, or when the table is not the focused control, the pill is
 * neutral grey (`follow-focus`, `inactive`).
 * - `columns`: [{ key, label, width?, align?: 'start' | 'end', sortable? }]; the first column takes the space left, the others 120 pt
 *   unless `width` says otherwise. `rows`: [{ id, icon?, disabled?, children?, indent?, <key>: value }] (`indent` nests a row visually
 *   without a parent).
 * - `v-model` is the selected ids (an array, or the one id with `:multiple="false"`); `v-model:sort` is { key, dir: 'asc' | 'desc' } and
 *   the table sorts its own rows (`manual-sort` leaves that to you, a column's `compare` replaces the default comparison).
 * - `tree` turns the first column into an outline: rows with `children` get a disclosure chevron and the children indent 20 pt;
 *   `v-model:expanded` is the ids of the open rows. This is what SOutline is.
 * - Mouse and keyboard work as in AppKit (see useSelection.js); in a tree Right opens a row or steps into it, Left closes it or steps
 *   out, Alt with either does it for every level below. `action` is a double click or Return.
 * - Slots `cell-<key>` and `cell` ({ row, value, column }) draw a cell; the first column's icon and chevron stay.
 */
const props = defineProps({
  columns: { type: Array, default: () => [{ key: 'name', label: 'Name' }] },
  rows: { type: Array, default: () => [] },
  modelValue: { type: [Array, String, Number], default: () => [] },
  multiple: { type: Boolean, default: true },
  sort: { type: Object, default: null },
  manualSort: Boolean,
  striped: { type: Boolean, default: true },
  bordered: Boolean,
  header: { type: Boolean, default: true },
  tree: Boolean,
  height: { type: [Number, String], default: 0 },
  inactive: Boolean,
  followFocus: { type: Boolean, default: true },
  idKey: { type: String, default: 'id' },
  iconKey: { type: String, default: 'icon' },
})
const emit = defineEmits(['update:modelValue', 'update:sort', 'action'])
const open = defineModel('expanded', { type: Array, default: () => [] })
const win = inject('s-window', null)

const id = `s-table-${++uid}`
const root = ref(null)
const body = ref(null)
const focused = ref(false)
const off = computed(() => props.inactive || (win?.inactive ?? false) || (props.followFocus && !focused.value))
const selected = computed(() => toArray(props.modelValue))
const selectedSet = computed(() => new Set(selected.value))
const idOf = (r) => r[props.idKey]

// ---- rows: sorted, then flattened by the open set -----------------------------------------------------------------------------
const sortState = computed(() => props.sort || null)
function compareFor(col) {
  if (col?.compare) return col.compare
  return (a, b) => {
    const x = a[col.key], y = b[col.key]
    if (typeof x === 'number' && typeof y === 'number') return x - y
    return String(x ?? '').localeCompare(String(y ?? ''), undefined, { numeric: true, sensitivity: 'base' })
  }
}
function sorted(list) {
  const s = sortState.value
  const col = s && props.columns.find((c) => c.key === s.key)
  if (!col || props.manualSort) return list
  const cmp = compareFor(col)
  return [...list].sort((a, b) => (s.dir === 'desc' ? -cmp(a, b) : cmp(a, b)))
}
const openSet = computed(() => new Set(open.value))
const entries = computed(() => {
  const out = []
  const walk = (list, level, parent) => {
    for (const row of sorted(list)) {
      const kids = props.tree && Array.isArray(row.children) && row.children.length ? row.children : null
      const isOpen = !!kids && openSet.value.has(idOf(row))
      out.push({ id: idOf(row), row, level: level + (row.indent || 0), parent, hasChildren: !!kids, isOpen })
      if (kids && isOpen) walk(kids, level + 1, idOf(row))
    }
  }
  walk(props.rows, 0, null)
  return out
})
const byId = computed(() => new Map(entries.value.map((e) => [e.id, e])))
const mergedTop = (i) => selectedSet.value.has(entries.value[i]?.id) && selectedSet.value.has(entries.value[i - 1]?.id)
const mergedBottom = (i) => selectedSet.value.has(entries.value[i]?.id) && selectedSet.value.has(entries.value[i + 1]?.id)

// ---- columns ----------------------------------------------------------------------------------------------------------------
const template = computed(() => props.columns.map((c, i) => (c.width ? c.width + 'px' : i === 0 ? 'minmax(0, 1fr)' : '120px')).join(' '))
function toggleSort(col) {
  if (!col.sortable) return
  const s = sortState.value
  emit('update:sort', { key: col.key, dir: s && s.key === col.key && s.dir === 'asc' ? 'desc' : 'asc' })
}

// ---- selection --------------------------------------------------------------------------------------------------------------
const sel = useSelection({
  ids: () => entries.value.map((e) => e.id),
  selected: () => selected.value,
  select: (arr) => emit('update:modelValue', fromArray(arr, props.multiple)),
  multiple: () => props.multiple,
  disabled: (id) => !!byId.value.get(id)?.row.disabled,
  label: (id) => byId.value.get(id)?.row[props.columns[0].key],
  activate: (id) => emit('action', byId.value.get(id).row),
  page: () => Math.floor((body.value?.clientHeight || 280) / 28),
  reveal: (id) => nextTick(() => body.value?.querySelector(`[data-id="${CSS.escape(String(id))}"]`)?.scrollIntoView({ block: 'nearest' })),
})

function descendants(entry) {
  const out = []
  const walk = (row) => (row.children || []).forEach((c) => { out.push(idOf(c)); walk(c) })
  walk(entry.row)
  return out
}
function setOpen(entry, value, deep) {
  const ids = [idOf(entry.row), ...(deep ? descendants(entry).filter((id) => byAll(id)?.children?.length) : [])]
  const next = new Set(open.value)
  ids.forEach((id) => (value ? next.add(id) : next.delete(id)))
  open.value = [...next]
  if (!value) {
    // rows that were hidden by closing cannot stay selected: the closed row takes the selection
    const hidden = new Set(descendants(entry))
    const left = selected.value.filter((id) => !hidden.has(id))
    if (left.length !== selected.value.length) emit('update:modelValue', fromArray(left.length ? left : [entry.id], props.multiple))
  }
}
function byAll(id) {
  let found = null
  const walk = (list) => list.some((r) => (idOf(r) === id ? ((found = r), true) : walk(r.children || [])))
  walk(props.rows)
  return found
}

function onKey(e) {
  if (props.tree) {
    const list = entries.value
    const i = list.findIndex((x) => x.id === sel.cursor.value) >= 0 ? list.findIndex((x) => x.id === sel.cursor.value) : list.findIndex((x) => selectedSet.value.has(x.id))
    const cur = list[i]
    if (cur && (e.key === 'ArrowRight' || e.key === 'ArrowLeft') && !e.metaKey && !e.ctrlKey) {
      e.preventDefault()
      if (e.key === 'ArrowRight') {
        if (cur.hasChildren && !cur.isOpen) setOpen(cur, true, e.altKey)
        else if (cur.hasChildren && cur.isOpen && !e.altKey) sel.go(i + 1, false)
        else if (cur.hasChildren && e.altKey) setOpen(cur, true, true)
      } else if (cur.hasChildren && cur.isOpen) setOpen(cur, false, e.altKey)
      else if (cur.parent !== null) sel.go(list.findIndex((x) => x.id === cur.parent), false)
      return
    }
  }
  sel.keydown(e)
}
function onDown(entry, e) {
  if (e.button !== 0) return
  root.value?.focus({ preventScroll: true })
  sel.click(entry.id, e)
}
function onFocusOut(e) { if (!root.value.contains(e.relatedTarget)) focused.value = false }

const style = computed(() => ({ '--s-cols': template.value, height: props.height ? (typeof props.height === 'number' ? props.height + 'px' : props.height) : null }))
const activeId = computed(() => (sel.cursor.value ?? selected.value[selected.value.length - 1]))
</script>

<template>
  <div
    ref="root" class="s-table" :class="{ 'is-inactive': off, 's-table--striped': striped, 's-table--bordered': bordered, 's-table--tree': tree }" :style="style"
    :role="tree ? 'treegrid' : 'grid'" tabindex="0" :aria-multiselectable="multiple || undefined" :aria-activedescendant="activeId != null ? `${id}-${activeId}` : undefined"
    @keydown="onKey" @focusin="focused = true" @focusout="onFocusOut"
  >
    <div v-if="header" class="s-table__head" role="row">
      <div
        v-for="c in columns" :key="c.key" class="s-table__th" role="columnheader"
        :class="{ 'is-sortable': c.sortable, 'is-sorted': sortState?.key === c.key, 'is-end': c.align === 'end' }"
        :aria-sort="sortState?.key === c.key ? (sortState.dir === 'asc' ? 'ascending' : 'descending') : undefined" @click="toggleSort(c)"
      >
        <span class="s-table__title">{{ c.label }}</span>
        <SIcon v-if="sortState?.key === c.key" :name="sortState.dir === 'asc' ? 'chevron-up' : 'chevron-down'" :size="12" class="s-table__sort" />
      </div>
    </div>
    <div ref="body" class="s-table__body">
      <TransitionGroup name="s-table-row" tag="div" class="s-table__rows">
        <div
          v-for="(e, i) in entries" :id="`${id}-${e.id}`" :key="e.id" class="s-table__row" role="row" :data-id="e.id"
          :class="{ 'is-selected': selectedSet.has(e.id), 'is-disabled': e.row.disabled, 'is-merged-top': mergedTop(i), 'is-merged-bottom': mergedBottom(i) }"
          :aria-selected="selectedSet.has(e.id)" :aria-level="tree ? e.level + 1 : undefined" :aria-expanded="e.hasChildren ? e.isOpen : undefined"
          @mousedown="onDown(e, $event)" @dblclick="!e.row.disabled && emit('action', e.row)"
        >
          <div
            v-for="(c, ci) in columns" :key="c.key" class="s-table__td" role="gridcell" :class="{ 'is-first': ci === 0, 'is-end': c.align === 'end' }"
            :style="ci === 0 && tree ? { paddingLeft: 4 + e.level * 20 + 'px' } : null"
          >
            <template v-if="ci === 0">
              <button v-if="tree" type="button" class="s-table__disclosure" :class="{ 'is-open': e.isOpen, 'is-leaf': !e.hasChildren }" tabindex="-1" :aria-label="e.isOpen ? 'Collapse' : 'Expand'" @mousedown.stop @click.stop="e.hasChildren && setOpen(e, !e.isOpen, $event.altKey)"><SIcon v-if="e.hasChildren" name="chevron-right" :size="12" /></button>
              <SIcon v-if="e.row[iconKey]" :name="e.row[iconKey]" :size="16" class="s-table__icon" />
            </template>
            <span class="s-table__text"><slot :name="`cell-${c.key}`" :row="e.row" :value="e.row[c.key]" :column="c"><slot name="cell" :row="e.row" :value="e.row[c.key]" :column="c">{{ e.row[c.key] }}</slot></slot></span>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style>
.s-table {
  position: relative; display: flex; flex-direction: column; min-height: 0; box-sizing: border-box; background: var(--surface-raised); color: var(--text-primary);
  font: var(--font-body); outline: none; --s-row: 28px;
}
.s-table--bordered { border-block: 1px solid var(--line-separator); }
.s-table:focus-visible { box-shadow: inset 0 0 0 2px var(--line-focus); }

/* header: 28 pt, a divider before every column but the first, a hairline underneath */
.s-table__head { position: relative; flex: none; display: grid; grid-template-columns: var(--s-cols); height: 28px; padding: 0 8px; box-sizing: border-box; border-bottom: 1px solid var(--line-separator); font: var(--font-caption); color: var(--text-secondary); }
.s-table__th { position: relative; display: flex; align-items: center; gap: 3px; min-width: 0; height: 100%; user-select: none; -webkit-user-select: none; }
.s-table__th:first-child { padding-left: 36px; }
.s-table__th + .s-table__th::before { content: ''; position: absolute; left: -8px; top: 6px; width: 1px; height: 14px; background: var(--line-separator); }
.s-table__th.is-end { justify-content: flex-end; padding-right: 8px; }
.s-table__th.is-sortable { cursor: default; }
.s-table__th.is-sorted { color: var(--text-primary); }
.s-table__title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.s-table__sort { color: var(--text-secondary); flex: none; }
.s-table--tree .s-table__th:first-child { padding-left: 24px; }

/* body: the stripes are the body's own background, so they carry on below the last row and do not move with the rows */
.s-table__body { position: relative; flex: 1 1 auto; min-height: 0; overflow: auto; }
.s-table--striped .s-table__body { background: repeating-linear-gradient(to bottom, transparent 0 var(--s-row), var(--line-separator) var(--s-row) calc(var(--s-row) * 2)); background-attachment: local; }
.s-table__rows { position: relative; }
.s-table__row { position: relative; display: grid; grid-template-columns: var(--s-cols); align-items: center; height: var(--s-row); padding: 0 8px; box-sizing: border-box; overflow: hidden; cursor: default; }
.s-table__row.is-disabled { opacity: 0.45; }
.s-table__td { position: relative; display: flex; align-items: center; gap: 8px; min-width: 0; padding-right: 8px; color: var(--text-secondary); z-index: 1; }
.s-table__td.is-first { padding-left: 12px; color: inherit; }
.s-table__td.is-end { justify-content: flex-end; }
.s-table__text { flex: 0 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.s-table__td.is-first .s-table__text { flex: 1 1 auto; }
.s-table__icon { color: var(--accent-amalfi); flex: none; }
.s-table__disclosure { flex: none; display: grid; place-items: center start; width: 12px; height: 28px; margin: 0; padding: 0; border: 0; background: none; color: var(--text-secondary); cursor: default; }
.s-table__disclosure .s-icon { transition: rotate var(--spring-snappy); }
.s-table__disclosure.is-open .s-icon { rotate: 90deg; }

/* selection: one pill per run of selected rows */
.s-table__row::before { content: ''; position: absolute; left: 8px; right: 8px; top: 0; bottom: 0; border-radius: 8px; background: transparent; transition: background var(--fade-quick); }
.s-table__row.is-selected::before { background: var(--accent-amalfi); }
.s-table__row.is-selected.is-merged-top::before { border-top-left-radius: 0; border-top-right-radius: 0; }
.s-table__row.is-selected.is-merged-bottom::before { border-bottom-left-radius: 0; border-bottom-right-radius: 0; }
.s-table__row.is-selected { color: var(--text-on-accent); }
.s-table__row.is-selected .s-table__td, .s-table__row.is-selected .s-table__icon, .s-table__row.is-selected .s-table__disclosure { color: var(--text-on-accent); }
.s-table.is-inactive .s-table__row.is-selected::before { background: var(--s-sel-off); }
.s-table.is-inactive .s-table__row.is-selected { color: var(--text-primary); }
.s-table.is-inactive .s-table__row.is-selected .s-table__td { color: var(--text-secondary); }
.s-table.is-inactive .s-table__row.is-selected .s-table__td.is-first { color: var(--text-primary); }
.s-table.is-inactive .s-table__row.is-selected .s-table__icon { color: var(--accent-amalfi); }
.s-table.is-inactive .s-table__row.is-selected .s-table__disclosure { color: var(--text-secondary); }

/* rows in and out (a row opening or closing) and sorting (rows glide to their new place) */
.s-table-row-enter-active, .s-table-row-leave-active { transition: height var(--spring-snappy), opacity var(--fade-quick); }
.s-table-row-enter-from, .s-table-row-leave-to { height: 0; opacity: 0; }
.s-table-row-move { transition: transform var(--spring-snappy); }
@media (prefers-reduced-motion: reduce) {
  .s-table-row-enter-active, .s-table-row-leave-active, .s-table-row-move, .s-table__disclosure .s-icon { transition: none; }
}
</style>
