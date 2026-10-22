<script>
export const meta = { title: 'Menu, Popover, Tooltip', order: 60 }
</script>

<script setup>
import { computed, reactive, ref } from 'vue'
import SMenu from '../../lib/SMenu.vue'
import SMenuItem from '../../lib/SMenuItem.vue'
import SMenuSeparator from '../../lib/SMenuSeparator.vue'
import SPopover from '../../lib/SPopover.vue'
import STooltip from '../../lib/STooltip.vue'
import SButton from '../../lib/SButton.vue'
import SIconButton from '../../lib/SIconButton.vue'
import SLink from '../../lib/SLink.vue'
import STextField from '../../lib/STextField.vue'
import DocPage from '../DocPage.vue'
import Stage from '../Stage.vue'
import Code from '../Code.vue'
import CompareMatrix from '../CompareMatrix.vue'
import kitIndex from '../../../kit/index.json'
import { theme } from '../theme.js'

const names = new Set(kitIndex.symbols.map((s) => s.name))
const exists = (n) => (names.has(`${n}/Light`) ? n : null)

// ---- playground
const menuOpen = ref(false)
const autosave = ref(true)
const last = ref('')
const placement = ref('top-center')
const placements = ['top-center', 'top-start', 'top-end', 'bottom-center', 'leading-center', 'trailing-center']
const popOpen = ref(false)
const name = ref('Lemon cake')

// ---- items
const itemStates = [{ key: 'Rest', label: 'Rest', force: '' }, { key: 'Highlighted', label: 'Highlighted', force: 'hover' }, { key: 'Checked', label: 'Checked', force: '', checked: true }, { key: 'Disabled', label: 'Disabled', force: '', disabled: true }]
const itemRows = [
  { key: 'Plain', label: 'Plain', props: {} },
  { key: 'Checkmark', label: 'Checkmark', props: { checked: true } },
  { key: 'Icon', label: 'Icon', props: { icon: 'share' } },
  { key: 'Shortcut', label: 'Shortcut', props: { shortcut: '⌘N' } },
  { key: 'Submenu', label: 'Submenu', props: { submenu: true } },
  { key: 'Destructive', label: 'Destructive', props: { destructive: true } },
]
const itemKit = (r, c) => exists(`Menus/Item/${r.key}/${c.key}`)

// ---- whole menus
const menuRows = [{ key: 'Simple', label: 'Simple' }, { key: 'Context', label: 'Context' }, { key: 'Full', label: 'Full' }, { key: 'Submenu', label: 'Submenu' }]
const menuCol = [{ key: 'Rest', label: 'Live over kit' }]

// ---- popovers
const popCols = [{ key: 'Bottom Center', label: 'Bottom Center', place: 'bottom-center' }, { key: 'Detached', label: 'Detached', place: 'detached' }]
const popRows = [{ key: 'Text', label: 'Text' }, { key: 'Form', label: 'Form' }, { key: 'List', label: 'List' }]

// ---- tooltips
const tipRows = [{ key: 'One Line', label: 'One line' }, { key: 'Shortcut', label: 'Shortcut' }, { key: 'Two Lines', label: 'Two lines' }]
const tipText = { 'One Line': 'Add to favourites', Shortcut: 'Duplicate', 'Two Lines': 'Shows the recipe in a new window so you can keep this one open.' }
const placeRows = [{ key: 'Above', label: 'Above', w: 120, h: 60, t: [46, 32] }, { key: 'Below', label: 'Below', w: 120, h: 60, t: [46, 0] }, { key: 'Leading', label: 'Leading', w: 152, h: 28, t: [124, 0] }, { key: 'Trailing', label: 'Trailing', w: 152, h: 28, t: [0, 0] }]
const tipDemo = ref(0)

const code = computed(() => `<SPopover v-model:open="open" placement="${placement.value}">
  <template #trigger><SButton @click="open = !open">Show</SButton></template>
  <SMenu><SMenuItem label="Duplicate" shortcut="⌘D" @click="…" /></SMenu>
</SPopover>
<STooltip text="Add to favourites" shortcut="⌘D"><SIconButton icon="plus" /></STooltip>`)
</script>

<template>
  <DocPage title="Menu, Popover, Tooltip" lead="Menus are plain glass blocks of items you can place anywhere; a popover anchors any content (or a menu) to a trigger; a tooltip waits 700 ms on the first hover and shows at once when you move between tooltips.">
    <h2>Try them</h2>
    <Stage glass :pad="40" class="try">
      <SPopover v-model:open="menuOpen" placement="top-start" :arrow="false" :padding="0">
        <template #trigger><SButton @click="menuOpen = !menuOpen">File</SButton></template>
        <SMenu :width="232" @close="menuOpen = false">
          <SMenuItem label="New Window" shortcut="⌘N" @click="last = 'New Window'" />
          <SMenuItem label="Open Recent" submenu>
            <template #submenu><SMenu sub><SMenuItem label="Lemon Cake" @click="last = 'Lemon Cake'" /><SMenuItem label="Olive Oil" @click="last = 'Olive Oil'" /><SMenuSeparator /><SMenuItem label="Clear Menu" /></SMenu></template>
          </SMenuItem>
          <SMenuSeparator />
          <SMenuItem header label="Share" />
          <SMenuItem label="Send a Link" icon="share" @click="last = 'Send a Link'" />
          <SMenuItem label="Autosave" :checked="autosave" @click="autosave = !autosave; last = 'Autosave'" />
          <SMenuItem label="Duplicate" shortcut="⌘D" @click="last = 'Duplicate'" />
          <SMenuItem label="Export…" shortcut="⌘E" disabled />
          <SMenuSeparator />
          <SMenuItem label="Move to Trash" destructive @click="last = 'Move to Trash'" />
        </SMenu>
      </SPopover>
      <SPopover v-model:open="popOpen" :placement="placement">
        <template #trigger><SButton variant="primary" @click="popOpen = !popOpen">Popover</SButton></template>
        <div class="pop-text"><b>About this ingredient</b><span>Olive oil keeps the crust tender and adds a peppery note.</span></div>
      </SPopover>
      <STooltip text="Add to favourites" shortcut="⌘D"><SIconButton icon="plus" label="Add" /></STooltip>
      <STooltip text="Settings" placement="below"><SIconButton icon="gear" label="Settings" /></STooltip>
      <span class="muted">{{ last ? `chose: ${last}` : 'open the File menu, use ↑ ↓ Enter Esc · hover the buttons' }}</span>
    </Stage>
    <div class="seg bar"><button v-for="p in placements" :key="p" :class="{ on: placement === p }" @click="placement = p">{{ p }}</button></div>
    <Code :code="code" />

    <h2>Menu items, compared with the kit</h2>
    <CompareMatrix :rows="itemRows" :cols="itemStates" :kit="itemKit">
      <template #default="{ row, col }">
        <div v-if="itemKit(row, col)" class="item188"><SMenuItem label="Menu item" v-bind="row.props" :checked="row.props.checked || col.checked" :force="col.force" :disabled="col.disabled" /></div>
        <span v-else class="muted">–</span>
      </template>
    </CompareMatrix>

    <h2>Menus, compared with the kit</h2>
    <CompareMatrix glass :rows="menuRows" :cols="menuCol" :kit="(r) => `Menus/Menu/${r.key}/Rest`">
      <template #default="{ row }">
        <SMenu v-if="row.key === 'Simple'" :width="200"><SMenuItem label="Orange" /><SMenuItem label="Lemon" checked /><SMenuItem label="Olive" force="hover" /><SMenuItem label="Fig" /></SMenu>
        <SMenu v-else-if="row.key === 'Context'" :width="208">
          <SMenuItem label="Cut" shortcut="⌘X" /><SMenuItem label="Copy" shortcut="⌘C" force="hover" /><SMenuItem label="Paste" shortcut="⌘V" /><SMenuSeparator />
          <SMenuItem label="Look Up" icon="search" /><SMenuItem label="Services" submenu /><SMenuSeparator /><SMenuItem label="Delete" destructive />
        </SMenu>
        <SMenu v-else-if="row.key === 'Full'" :width="232">
          <SMenuItem label="New Window" shortcut="⌘N" /><SMenuItem label="Open Recent" submenu force="hover" /><SMenuSeparator />
          <SMenuItem header label="Share" /><SMenuItem label="Send a Link" icon="share" /><SMenuItem label="Autosave" checked /><SMenuItem label="Duplicate" shortcut="⌘D" />
          <SMenuItem label="Export…" shortcut="⌘E" disabled /><SMenuSeparator /><SMenuItem label="Move to Trash" destructive />
        </SMenu>
        <SMenu v-else :width="188"><SMenuItem label="Lemon Cake" /><SMenuItem label="Fig Jam" force="hover" /><SMenuItem label="Olive Oil" /><SMenuSeparator /><SMenuItem label="Clear Menu" /></SMenu>
      </template>
    </CompareMatrix>

    <h2>Popovers, compared with the kit</h2>
    <CompareMatrix glass :rows="popRows" :cols="popCols" :kit="(r, c) => `Popovers/Popover/${r.key}/${c.key}`">
      <template #default="{ row, col }">
        <SPopover :placement="col.place" :width="row.key === 'List' ? 204 : 264" :padding="row.key === 'List' ? 8 : 16" :arrow="col.place !== 'detached'">
          <div v-if="row.key === 'Text'" class="pop-text"><b>About this ingredient</b><span>Olive oil keeps the crust tender and adds a peppery note. Use a mild, fruity one for sweet bakes.</span><SLink>Learn more</SLink></div>
          <div v-else-if="row.key === 'Form'" class="pop-form"><b>New collection</b><STextField v-model="name" /><div class="pop-buttons"><SButton size="small">Cancel</SButton><SButton variant="primary" size="small">Create</SButton></div></div>
          <SMenu v-else plain class="pop-list"><SMenuItem header label="Open in" /><SMenuItem icon="clock" label="Recents" /><SMenuItem icon="download" label="Downloads" force="hover" /><SMenuItem icon="photo" label="Pictures" /></SMenu>
        </SPopover>
      </template>
    </CompareMatrix>

    <h2>Tooltips, compared with the kit</h2>
    <CompareMatrix glass :rows="tipRows" :cols="[{ key: 'Rest', label: 'Rest' }]" :kit="(r) => `Tooltips/Tooltip/${r.key}/Rest`">
      <template #default="{ row }"><STooltip :text="tipText[row.key]" :shortcut="row.key === 'Shortcut' ? '⌘D' : ''" show class="static-tip"><span /></STooltip></template>
    </CompareMatrix>
    <CompareMatrix glass :rows="placeRows" :cols="[{ key: 'Rest', label: 'With a target' }]" :kit="(r) => `Tooltips/Placement/${r.key}/Rest`">
      <template #default="{ row }">
        <div class="place" :style="{ width: row.w + 'px', height: row.h + 'px' }">
          <STooltip text="Add to favourites" :placement="row.key.toLowerCase()" show class="target" :style="{ left: row.t[0] + 'px', top: row.t[1] + 'px' }"><SIconButton icon="plus" label="Add" /></STooltip>
        </div>
      </template>
    </CompareMatrix>
  </DocPage>
</template>

<style scoped>
.try { gap: 24px; min-height: 340px; align-items: flex-start; }
.bar { margin: 12px 0; flex-wrap: wrap; }
.item188 { width: 188px; }
.pop-text { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; padding-top: 2px; width: 232px; }
.pop-text b { font: var(--font-headline); }
.pop-text span { font: var(--font-callout); color: var(--text-secondary); }
.pop-form { display: flex; flex-direction: column; gap: 8px; padding-top: 2px; width: 228px; }
.pop-form b { font: var(--font-headline); }
.pop-form > :nth-child(2) { width: 100%; }
.pop-buttons { display: flex; justify-content: flex-end; gap: 8px; }
.pop-list { width: 188px; }
.place { position: relative; }
.place .target { position: absolute; }
.static-tip :deep(.s-tooltip) { position: static; transform: none; animation: none; }
</style>
