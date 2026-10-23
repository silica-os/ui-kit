<script>
export const meta = { title: 'Tables and Lists', order: 84 }
</script>

<script setup>
import { computed, reactive, ref } from 'vue'
import STable from '../../lib/STable.vue'
import SOutline from '../../lib/SOutline.vue'
import SList from '../../lib/SList.vue'
import SGrid from '../../lib/SGrid.vue'
import DocPage from '../DocPage.vue'
import Stage from '../Stage.vue'
import SidePair from '../SidePair.vue'
import Code from '../Code.vue'
import CompareMatrix from '../CompareMatrix.vue'
import kitIndex from '../../../kit/index.json'

const names = new Set(kitIndex.symbols.map((s) => s.name))
const exists = (n) => (names.has(`${n}/Light`) ? n : null)

// ---- the panels of the kit (same data, same sizes) ---------------------------------------------------------------------------
const kitCols = [{ key: 'name', label: 'Name', sortable: true }, { key: 'kind', label: 'Kind', width: 96 }, { key: 'date', label: 'Date Modified', width: 140 }]
const kitRows = [
  { id: 1, icon: 'folder', name: 'Documents', kind: 'Folder', date: 'Today, 09:41' },
  { id: 2, icon: 'doc-text', name: 'Lemon cake.recipe', kind: 'Recipe', date: 'Today, 09:12' },
  { id: 3, icon: 'doc-text', name: 'Focaccia.recipe', kind: 'Recipe', date: 'Yesterday' },
  { id: 4, icon: 'doc-text', name: 'Limoncello notes.txt', kind: 'Text', date: '12 Oct 2026' },
  { id: 5, icon: 'photo', name: 'Amalfi.heic', kind: 'Image', date: '3 Oct 2026' },
  { id: 6, icon: 'doc-text', name: 'Menu.pdf', kind: 'PDF', date: '28 Sep 2026' },
]
const kitSort = { key: 'name', dir: 'asc' }
const outCols = [{ key: 'name', label: 'Name' }, { key: 'size', label: 'Size', width: 96, align: 'end' }]
const outRows = [
  { id: 'recipes', icon: 'folder', name: 'Recipes', size: '12 items', children: [
    { id: 'lemon', icon: 'doc-text', name: 'Lemon cake.recipe', size: '4 KB' },
    { id: 'focaccia', icon: 'doc-text', name: 'Focaccia.recipe', size: '5 KB' },
  ] },
  { id: 'photos', icon: 'folder', name: 'Photos', size: '248 items', children: [{ id: 'amalfi', icon: 'photo', name: 'Amalfi.heic', size: '2 MB' }] },
  { id: 'notes', icon: 'folder', name: 'Notes', size: '3 items', children: [
    { id: 'shopping', icon: 'doc-text', name: 'Shopping list.txt', size: '1 KB' },
    { id: 'menu', icon: 'doc-text', name: 'Menu.pdf', size: '212 KB', indent: 1 },
  ] },
]
const kitSingle = [
  { id: 1, title: 'Lemon cake', icon: 'doc-text' }, { id: 2, title: 'Focaccia', icon: 'doc-text' }, { id: 3, title: 'Tiramisu', icon: 'doc-text' },
  { id: 4, title: 'Amalfi menu', icon: 'doc-text' }, { id: 5, title: 'Limoncello notes', icon: 'doc-text', disabled: true },
]
const kitTwo = [
  { id: 1, title: 'Lemon cake', subtitle: 'Recipe · edited today', icon: 'doc-text' }, { id: 2, title: 'Focaccia', subtitle: 'Recipe · yesterday', icon: 'doc-text' },
  { id: 3, title: 'Tiramisu', subtitle: 'Recipe · 12 Oct', icon: 'doc-text' }, { id: 4, title: 'Amalfi menu', subtitle: 'PDF · 3 Oct', icon: 'doc-text' },
]
const kitSections = (items) => [{ title: 'Recents', items }]
const kitIcons = ['Lemon cake', 'Focaccia', 'Tiramisu', 'Amalfi menu', 'Notes', 'Limoncello', 'Photos', 'Recipes'].map((label, i) => ({ id: i + 1, label }))
const kitThumbs = Array.from({ length: 6 }, (_, i) => ({ id: i + 1, label: 'Photo ' + (i + 1) }))

// ---- playground ------------------------------------------------------------------------------------------------------------
const folders = ['Documents', 'Downloads', 'Library', 'Music', 'Photos', 'Recipes', 'Shopping', 'Tiramisu']
const files = [
  ...folders.map((n, i) => ({ id: 'f' + i, icon: 'folder', name: n, kind: 'Folder', size: 0, date: `${20 - i} Oct 2026` })),
  { id: 'a', icon: 'doc-text', name: 'Lemon cake.recipe', kind: 'Recipe', size: 4, date: 'Today, 09:12' },
  { id: 'b', icon: 'doc-text', name: 'Focaccia.recipe', kind: 'Recipe', size: 5, date: 'Yesterday' },
  { id: 'c', icon: 'doc-text', name: 'Limoncello notes.txt', kind: 'Text', size: 1, date: '12 Oct 2026' },
  { id: 'd', icon: 'photo', name: 'Amalfi.heic', kind: 'Image', size: 2048, date: '3 Oct 2026' },
  { id: 'e', icon: 'doc-text', name: 'Menu.pdf', kind: 'PDF', size: 212, date: '28 Sep 2026' },
]
const tCols = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'kind', label: 'Kind', width: 100, sortable: true },
  { key: 'size', label: 'Size', width: 80, align: 'end', sortable: true },
  { key: 'date', label: 'Date Modified', width: 140 },
]
const t = reactive({ sel: ['a'], sort: { key: 'name', dir: 'asc' }, striped: true, multiple: true, inactive: false, last: '' })
const tCode = computed(() => `<STable
  :columns="columns" :rows="files"${t.multiple ? '' : ' :multiple="false"'}${t.striped ? '' : ' :striped="false"'}${t.inactive ? ' inactive' : ''}
  v-model="selected" v-model:sort="sort" :height="320" @action="open" />`)

const treeRows = [
  { id: 'recipes', icon: 'folder', name: 'Recipes', size: '12 items', children: [
    { id: 'lemon', icon: 'doc-text', name: 'Lemon cake.recipe', size: '4 KB' },
    { id: 'focaccia', icon: 'doc-text', name: 'Focaccia.recipe', size: '5 KB' },
    { id: 'old', icon: 'folder', name: 'Old', size: '2 items', children: [{ id: 'tart', icon: 'doc-text', name: 'Orange tart.recipe', size: '3 KB' }, { id: 'biscuits', icon: 'doc-text', name: 'Almond biscuits.recipe', size: '6 KB' }] },
  ] },
  { id: 'photos', icon: 'folder', name: 'Photos', size: '248 items', children: [
    { id: 'y2026', icon: 'folder', name: '2026', size: '2 items', children: [{ id: 'amalfi', icon: 'photo', name: 'Amalfi.heic', size: '2 MB' }, { id: 'harbour', icon: 'photo', name: 'Harbour.heic', size: '3 MB' }] },
    { id: 'market', icon: 'photo', name: 'Market.heic', size: '1 MB' },
  ] },
  { id: 'notes', icon: 'folder', name: 'Notes', size: '2 items', children: [{ id: 'shopping', icon: 'doc-text', name: 'Shopping list.txt', size: '1 KB' }, { id: 'menu', icon: 'doc-text', name: 'Menu.pdf', size: '212 KB' }] },
  { id: 'readme', icon: 'doc-text', name: 'Readme.txt', size: '1 KB' },
]
const tree = reactive({ sel: ['lemon'], open: ['recipes'], last: '' })
const lst = reactive({ sel: 2, last: '' })
const listSections = [
  { title: 'Recents', items: [{ id: 1, title: 'Lemon cake', subtitle: 'Recipe · edited today', icon: 'doc-text' }, { id: 2, title: 'Focaccia', subtitle: 'Recipe · yesterday', icon: 'doc-text' }, { id: 3, title: 'Tiramisu', subtitle: 'Recipe · 12 Oct', icon: 'doc-text' }] },
  { title: 'Shared', items: [{ id: 4, title: 'Amalfi menu', subtitle: 'PDF · 3 Oct', icon: 'doc-text', value: 'Marta' }, { id: 5, title: 'Limoncello notes', subtitle: 'Text · 28 Sep', icon: 'doc-text', disabled: true }] },
]
const gradients = ['linear-gradient(135deg,#ffe38a,#ff9f4d)', 'linear-gradient(135deg,#a8e6cf,#3aa6b9)', 'linear-gradient(135deg,#ffd3e0,#e0709a)', 'linear-gradient(135deg,#cfe0ff,#5b7fe6)']
const g = reactive({ sel: ['2'], variant: 'icons', last: '' })
const gridItems = computed(() => Array.from({ length: 18 }, (_, i) => ({ id: String(i + 1), label: ['Lemon cake', 'Focaccia', 'Tiramisu', 'Amalfi menu', 'Notes', 'Limoncello'][i % 6] + (i > 5 ? ' ' + (Math.floor(i / 6) + 1) : ''), image: g.variant === 'thumbnails' ? gradients[i % 4] : undefined })))

// ---- state compare ---------------------------------------------------------------------------------------------------------
const listRows = [{ key: 'Single', label: 'Single line' }, { key: 'Two Line', label: 'Two lines' }]
const listCols = [{ key: 'Rest', label: 'Rest' }, { key: 'Selected', label: 'Selected', sel: true }]
const listCols2 = [{ key: 'Selected Inactive', label: 'Selected, inactive', sel: true, off: true }, { key: 'Disabled', label: 'Disabled', disabled: true }]
const gridRows = [{ key: 'Icon', label: 'Icon', variant: 'icons' }, { key: 'Thumbnail', label: 'Thumbnail', variant: 'thumbnails' }]
const gridCols = [{ key: 'Rest', label: 'Rest' }, { key: 'Selected', label: 'Selected', sel: true }, { key: 'Selected Inactive', label: 'Selected, inactive', sel: true, off: true }]
const oneItem = (r) => [{ id: 1, label: 'Lemon cake', image: r.variant === 'thumbnails' ? undefined : undefined }]
</script>

<template>
  <DocPage title="Tables and Lists" lead="Tables, outlines, lists and grids with the keyboard and mouse behaviour of AppKit: click, Cmd-click, Shift-click, arrows, Home / End, Page Up / Down, type-select, Return. The selected rows take the accent pill; in the background it turns grey.">
    <h2>Playground: table</h2>
    <div class="play">
      <Stage :pad="0" class="grow">
        <STable
          v-model="t.sel" v-model:sort="t.sort" :columns="tCols" :rows="files" :striped="t.striped" :multiple="t.multiple" :inactive="t.inactive" :height="320" class="fill"
          @action="(r) => (t.last = `action: ${r.name}`)"
        />
      </Stage>
      <div class="card ctrl">
        <label class="chk"><input v-model="t.striped" type="checkbox" /> striped</label>
        <label class="chk"><input v-model="t.multiple" type="checkbox" @change="t.sel = t.sel.slice(0, 1)" /> multiple selection</label>
        <label class="chk"><input v-model="t.inactive" type="checkbox" /> window in the background</label>
        <p class="muted small">Click the table, then try arrows, Shift-arrows, Cmd-A, Home / End, typing “li”, Return. Click a column to sort. Without focus the selection is grey, as in AppKit.</p>
        <p class="muted small">selected: {{ [].concat(t.sel ?? []).join(', ') || 'none' }}<br />sort: {{ t.sort.key }} {{ t.sort.dir }}<br />{{ t.last }}</p>
      </div>
    </div>
    <Code :code="tCode" />

    <h2>Playground: outline</h2>
    <div class="play">
      <Stage :pad="0" class="grow">
        <SOutline
          v-model="tree.sel" v-model:expanded="tree.open" :columns="outCols" :rows="treeRows" :height="280" class="fill"
          @action="(r) => (tree.last = `action: ${r.name}`)"
        />
      </Stage>
      <div class="card ctrl">
        <p class="muted small">Right opens a row or steps into it, Left closes it or steps out. Alt with either does every level; Alt-click on a chevron too. Closing a row that holds the selection moves the selection to it.</p>
        <p class="muted small">selected: {{ [].concat(tree.sel ?? []).join(', ') || 'none' }}<br />open: {{ tree.open.join(', ') || 'none' }}<br />{{ tree.last }}</p>
      </div>
    </div>

    <h2>Playground: list</h2>
    <div class="play">
      <Stage :pad="0" class="grow">
        <SList v-model="lst.sel" :sections="listSections" :height="300" class="fill narrow" @action="(it) => (lst.last = `action: ${it.title}`)" />
      </Stage>
      <div class="card ctrl">
        <p class="muted small">One selected row. The disabled row is skipped by the arrows. Return or double click runs the action.</p>
        <p class="muted small">selected: {{ lst.sel }}<br />{{ lst.last }}</p>
      </div>
    </div>

    <h2>Playground: grid</h2>
    <div class="play">
      <Stage :pad="0" class="grow">
        <SGrid v-model="g.sel" :items="gridItems" :variant="g.variant" :height="340" class="fill" @action="(it) => (g.last = `action: ${it.label}`)" />
      </Stage>
      <div class="card ctrl">
        <div class="field"><label>Variant</label><div class="seg"><button v-for="m in ['icons', 'thumbnails']" :key="m" :class="{ on: g.variant === m }" @click="g.variant = m">{{ m }}</button></div></div>
        <p class="muted small">Arrows move across rows and columns and follow the width of the grid. Drag the window narrower to see them re-flow.</p>
        <p class="muted small">selected: {{ g.sel.join(', ') || 'none' }}<br />{{ g.last }}</p>
      </div>
    </div>

    <h2>Tables, compared with the kit</h2>
    <Stage :pad="24" class="col scroll">
      <SidePair stack label="Striped" kit="Tables/Panel/Striped">
        <STable :columns="kitCols" :rows="kitRows" :sort="kitSort" manual-sort :model-value="[3]" :follow-focus="false" style="width: 544px; height: 196px" />
      </SidePair>
      <SidePair stack label="Plain" kit="Tables/Panel/Plain">
        <STable :columns="kitCols" :rows="kitRows" :sort="kitSort" manual-sort :striped="false" :model-value="[3]" :follow-focus="false" style="width: 544px; height: 196px" />
      </SidePair>
    </Stage>

    <h2>Outlines, compared with the kit</h2>
    <Stage :pad="24" class="col scroll">
      <SidePair stack label="Outline" kit="Outlines/Panel/Rest">
        <SOutline :columns="outCols" :rows="outRows" :expanded="['recipes', 'notes']" :model-value="['focaccia']" :follow-focus="false" style="width: 544px; height: 224px" />
      </SidePair>
    </Stage>

    <h2>Lists, compared with the kit</h2>
    <Stage :pad="24" class="col scroll">
      <SidePair stack label="Single line" kit="Lists/Panel/Single">
        <SList :sections="kitSections(kitSingle)" :model-value="3" :follow-focus="false" style="width: 320px; height: 248px" />
      </SidePair>
      <SidePair stack label="Two lines" kit="Lists/Panel/Two Line">
        <SList :sections="kitSections(kitTwo)" :model-value="3" :follow-focus="false" style="width: 320px; height: 268px" />
      </SidePair>
    </Stage>
    <CompareMatrix :rows="listRows" :cols="listCols" :kit="(r, c) => exists(`Lists/Row/${r.key}/${c.key}`)">
      <template #default="{ row, col }">
        <SList
          :items="[{ id: 1, title: 'Lemon cake', subtitle: row.key === 'Two Line' ? 'Recipe · edited today' : '', icon: 'doc-text', disabled: !!col.disabled }]" :model-value="col.sel ? 1 : null"
          :inactive="!!col.off" :follow-focus="false" style="width: 320px"
        />
      </template>
    </CompareMatrix>

    <CompareMatrix :rows="listRows" :cols="listCols2" :kit="(r, c) => exists(`Lists/Row/${r.key}/${c.key}`)">
      <template #default="{ row, col }">
        <SList
          :items="[{ id: 1, title: 'Lemon cake', subtitle: row.key === 'Two Line' ? 'Recipe · edited today' : '', icon: 'doc-text', disabled: !!col.disabled }]" :model-value="col.sel ? 1 : null"
          :inactive="!!col.off" :follow-focus="false" style="width: 320px"
        />
      </template>
    </CompareMatrix>

    <h2>Grids, compared with the kit</h2>
    <Stage :pad="24" class="col scroll">
      <SidePair stack label="Icons" kit="Grids/Panel/Icons">
        <SGrid :items="kitIcons" :model-value="[3]" :follow-focus="false" style="width: 416px; height: 272px" />
      </SidePair>
      <SidePair stack label="Thumbnails" kit="Grids/Panel/Thumbnails">
        <SGrid :items="kitThumbs" variant="thumbnails" :model-value="[2]" :follow-focus="false" style="width: 384px; height: 264px" />
      </SidePair>
    </Stage>
    <CompareMatrix :rows="gridRows" :cols="gridCols" :kit="(r, c) => exists(`Grids/Item/${r.key}/${c.key}`)">
      <template #default="{ row, col }">
        <SGrid :items="oneItem(row)" :variant="row.variant" :model-value="col.sel ? [1] : []" :inactive="!!col.off" :follow-focus="false" class="one" :class="row.variant" />
      </template>
    </CompareMatrix>
  </DocPage>
</template>

<style scoped>
.play { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 16px; align-items: stretch; }
.grow { align-items: stretch; flex-wrap: nowrap; gap: 0; overflow: hidden; min-height: 200px; }
.fill { flex: 1 1 auto; min-width: 0; }
.narrow { max-width: 360px; }
.col { flex-direction: column; flex-wrap: nowrap; align-items: flex-start; gap: 8px; }
.scroll { overflow-x: auto; }
.ctrl { padding: 16px; display: flex; flex-direction: column; gap: 14px; }
.chk { display: flex; gap: 6px; align-items: center; }
.small { font-size: 12px; margin: 0; }
.one { padding: 0; }
.one.icons { width: 96px; height: 116px; }
.one.thumbnails { width: 112px; height: 112px; }
</style>
