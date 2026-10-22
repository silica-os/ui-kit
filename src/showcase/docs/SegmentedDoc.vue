<script>
export const meta = { title: 'Segmented control', order: 50 }
</script>

<script setup>
import { computed, reactive, ref } from 'vue'
import SSegmented from '../../lib/SSegmented.vue'
import DocPage from '../DocPage.vue'
import Stage from '../Stage.vue'
import Code from '../Code.vue'
import CompareMatrix from '../CompareMatrix.vue'

const sizes = ['mini', 'small', 'regular', 'large']
const kinds = ['text', 'icon', 'icon + label']
const modes = ['one', 'any', 'action']
const cap = (s) => s[0].toUpperCase() + s.slice(1)

const textItems = (n) => ['Day', 'Week', 'Month', 'Year', 'All', 'Custom'].slice(0, n).map((l) => ({ value: l.toLowerCase(), label: l }))
const iconNames = ['sidebar', 'folder', 'gear', 'share', 'plus', 'trash']
const iconItems = (n) => iconNames.slice(0, n).map((i) => ({ value: i, icon: i }))
const stackItems = (n) => [['General', 'gear'], ['Folders', 'folder'], ['Sharing', 'share'], ['Layout', 'sidebar'], ['New', 'plus'], ['Bin', 'trash']].slice(0, n).map(([l, i]) => ({ value: l.toLowerCase(), label: l, icon: i }))
const itemsFor = (kind, n) => (kind === 'text' ? textItems(n) : kind === 'icon' ? iconItems(n) : stackItems(n))

const p = reactive({ size: 'regular', kind: 'text', mode: 'one', count: 3 })
const items = computed(() => itemsFor(p.kind, p.count))
const one = ref('day')
const any = ref(['day'])
const last = ref('')
const value = computed({
  get: () => (p.mode === 'any' ? any.value : one.value),
  set: (v) => (p.mode === 'any' ? (any.value = v) : (one.value = v)),
})
// the models hold values of the current kind: reset when the items change
function reset() { one.value = items.value[0].value; any.value = [items.value[0].value] }
const code = computed(() => `<SSegmented v-model="${p.mode === 'any' ? 'selection' : 'view'}" size="${p.size}"${p.mode === 'any' ? ' multiple' : ''}${p.mode === 'action' ? ' action' : ''}
  :items="[${items.value.slice(0, 2).map((i) => `{ value: '${i.value}'${i.label ? `, label: '${i.label}'` : ''}${i.icon ? `, icon: '${i.icon}'` : ''}`).join(' }, ')} }, …]" />`)

const cols = [{ key: 'Rest', label: 'Rest', force: '' }, { key: 'Pressed', label: 'Pressed', force: 'pressed' }, { key: 'Disabled', label: 'Disabled', force: '', disabled: true }]
const size = ref('regular')
const rows = [
  { key: 'One 3 Text', label: 'One, text', kind: 'text', mode: 'one', n: 3 },
  { key: 'One 3 Icon', label: 'One, icon', kind: 'icon', mode: 'one', n: 3 },
  { key: 'Any 3 Text', label: 'Any, text', kind: 'text', mode: 'any', n: 3 },
  { key: 'Any 3 Icon', label: 'Any, icon', kind: 'icon', mode: 'any', n: 3 },
]
const kitName = (r, c) => {
  if (size.value === 'mini' && (c.key !== 'Rest' || r.mode === 'any')) return null
  if (r.mode === 'any' && (size.value !== 'regular' || c.key !== 'Rest')) return null
  return `Segments/Control/${r.key}/${cap(size.value)}/${c.key}`
}
const anyOf = (r) => (r.mode === 'any' ? itemsFor(r.kind, r.n).map((i) => i.value).filter((_, i) => i !== 1) : itemsFor(r.kind, r.n)[0].value)

const stackedRows = [{ key: 'One 3 Icon + Label', label: 'Icon + label' }]
const actionRows = [
  { key: 'Text 2', label: 'Back / Next', items: [{ value: 'back', label: 'Back' }, { value: 'next', label: 'Next' }] },
  { key: 'Icon 2', label: 'Chevrons', items: [{ value: 'back', icon: 'chevron-left' }, { value: 'next', icon: 'chevron-right' }] },
]
const actionCols = [{ key: 'Rest', label: 'Rest', force: '' }, { key: 'Hover', label: 'Hover', force: 'hover' }, { key: 'Pressed', label: 'Pressed', force: 'pressed' }, { key: 'Disabled', label: 'Disabled', force: '', disabled: true }]
const alignItems = ['text-align-left', 'text-align-center', 'text-align-right', 'text-justify'].map((i) => ({ value: i, icon: i }))
const align = ref('text-align-left')
</script>

<template>
  <DocPage title="Segmented control" lead="A glass capsule with a thumb that slides to the selected item. Single or multiple selection, or an action group that only fires clicks. Arrow keys move through the items.">
    <h2>Playground</h2>
    <div class="play">
      <Stage glass :pad="48" class="grow">
        <SSegmented v-model="value" :items="items" :size="p.size" :multiple="p.mode === 'any'" :action="p.mode === 'action'" @action="last = $event" />
        <span class="muted">{{ p.mode === 'action' ? `last action: ${last || '–'}` : JSON.stringify(value) }}</span>
      </Stage>
      <div class="card ctrl">
        <div class="field"><label>Size</label><div class="seg"><button v-for="s in sizes" :key="s" :class="{ on: p.size === s }" @click="p.size = s">{{ s }}</button></div></div>
        <div class="field"><label>Items</label><div class="seg"><button v-for="k in kinds" :key="k" :class="{ on: p.kind === k }" @click="p.kind = k; reset()">{{ k }}</button></div></div>
        <div class="field"><label>Selection</label><div class="seg"><button v-for="m in modes" :key="m" :class="{ on: p.mode === m }" @click="p.mode = m; reset()">{{ m }}</button></div></div>
        <div class="field"><label>Count</label><div class="seg"><button v-for="n in [2, 3, 4, 5, 6]" :key="n" :class="{ on: p.count === n }" @click="p.count = n; reset()">{{ n }}</button></div></div>
      </div>
    </div>
    <Code :code="code" />

    <h2>Controls, compared with the kit</h2>
    <div class="seg bar"><button v-for="s in sizes" :key="s" :class="{ on: size === s }" @click="size = s">{{ s }}</button></div>
    <CompareMatrix glass :rows="rows" :cols="cols" :kit="kitName">
      <template #default="{ row, col }">
        <SSegmented :model-value="anyOf(row)" :items="itemsFor(row.kind, row.n)" :size="size" :multiple="row.mode === 'any'" :force="col.force" :disabled="col.disabled" />
      </template>
    </CompareMatrix>

    <h2>Icon and label</h2>
    <CompareMatrix glass :rows="stackedRows" :cols="[cols[0]]" :kit="(r) => `Segments/Control/${r.key}`">
      <template #default><SSegmented model-value="general" :items="stackItems(3)" /></template>
    </CompareMatrix>

    <h2>Action segments</h2>
    <CompareMatrix glass :rows="actionRows" :cols="actionCols" :kit="(r, c) => `Segments/Action/${r.key}/${cap(size)}/${c.key}`">
      <template #default="{ row, col }"><SSegmented action :items="row.items.map((i, k) => ({ ...i, force: k === 0 ? col.force : '' }))" :size="size" :disabled="col.disabled" /></template>
    </CompareMatrix>

    <h2>Text alignment</h2>
    <Stage glass :pad="24"><SSegmented v-model="align" :items="alignItems" size="small" /></Stage>
  </DocPage>
</template>

<style scoped>
.play { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 16px; align-items: stretch; }
.grow { min-height: 200px; justify-content: center; }
.ctrl { padding: 16px; display: flex; flex-direction: column; gap: 14px; }
.bar { margin-bottom: 12px; }
</style>
