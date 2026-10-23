<script>
export const meta = { title: 'Window and title bar', order: 100 }
</script>

<script setup>
import { computed, reactive, ref } from 'vue'
import SWindow from '../../lib/SWindow.vue'
import STitlebar from '../../lib/STitlebar.vue'
import STitlebarTitle from '../../lib/STitlebarTitle.vue'
import STitlebarPiece from '../../lib/STitlebarPiece.vue'
import STrafficLights from '../../lib/STrafficLights.vue'
import STabBar from '../../lib/STabBar.vue'
import STab from '../../lib/STab.vue'
import SSidebar from '../../lib/SSidebar.vue'
import SSidebarGroup from '../../lib/SSidebarGroup.vue'
import SSidebarItem from '../../lib/SSidebarItem.vue'
import SIconButton from '../../lib/SIconButton.vue'
import SButton from '../../lib/SButton.vue'
import SAlert from '../../lib/SAlert.vue'
import SSearchField from '../../lib/SSearchField.vue'
import SSegmented from '../../lib/SSegmented.vue'
import SGroupBox from '../../lib/SGroupBox.vue'
import STextField from '../../lib/STextField.vue'
import SCheckbox from '../../lib/SCheckbox.vue'
import DocPage from '../DocPage.vue'
import Stage from '../Stage.vue'
import SidePair from '../SidePair.vue'
import Code from '../Code.vue'
import CompareMatrix from '../CompareMatrix.vue'

const p = reactive({ toolbar: 'unified', sidebar: true, inspector: false, inactive: false, sheet: false })
const nav = ref('recents')
const view = ref('list')
const query = ref('')
const msg = ref('')
const tabs = ref([{ value: 1, label: 'Lemon cake', }, { value: 2, label: 'Orange tart', }, { value: 3, label: 'Focaccia', }])
const tab = ref(1)
function closeTab(v) { tabs.value = tabs.value.filter((t) => t.value !== v); if (tab.value === v) tab.value = tabs.value[0]?.value }
function addTab() { const v = Date.now(); tabs.value.push({ value: v, label: 'Untitled', }); tab.value = v }

const code = computed(() => `<SWindow toolbar="${p.toolbar}" title="Lemon cake"${p.inactive ? ' inactive' : ''} :width="560" :height="400" @close="…">
  <template #toolbar>
    <STitlebarPiece kind="icon" icon="sidebar" label="Sidebar" />
    <STitlebarPiece kind="nav" @action="go" />
    <STitlebarTitle flex title="Lemon cake" />
    <STitlebarPiece kind="views" :items="[…]" v-model="view" />
    <STitlebarPiece kind="search" v-model="query" />
  </template>${p.sidebar ? '\n  <template #sidebar><SSidebar v-model="nav">…</SSidebar></template>' : ''}
  Content${p.inspector ? '\n  <template #inspector>…</template>' : ''}${p.sheet ? '\n  <template #sheet><SAlert …/></template>' : ''}
</SWindow>`)

const modes = ['plain', 'title', 'compact', 'unified', 'split']
const views = [{ value: 'list', icon: 'list-bullet' }, { value: 'grid', icon: 'square-grid-2x2' }]
const mk = (names) => names.map((n) => ({ key: n, label: n }))
const act = [{ key: 'Active', label: 'Active' }, { key: 'Inactive', label: 'Inactive' }]
const one = [{ key: 'x', label: 'Live over kit' }]
const lorem = 'Whisk the eggs with sugar until pale, fold in the flour, then the lemon zest and juice. Bake for forty minutes and let it cool before slicing.'
const g2 = [{ value: 'a', icon: 'plus' }, { value: 'b', icon: 'tag' }]
const g3 = [...g2, { value: 'c', icon: 'star' }]
const g4 = [...g3, { value: 'd', icon: 'flag' }]
const stext = [{ value: 'w', label: 'World' }, { value: 'a', label: 'Alarms' }, { value: 's', label: 'Stopwatch' }, { value: 't', label: 'Timers' }]
const world = ref('w')
const seg2 = ref('list')
const pm = ref('one')
const pieces = [
  { key: 'Nav', kind: 'nav' }, { key: 'Sidebar Toggle', kind: 'icon', icon: 'sidebar' }, { key: 'Share', kind: 'icon', icon: 'share' }, { key: 'More', kind: 'icon', icon: 'ellipsis' },
  { key: 'Doc Info', kind: 'icon', icon: 'info' }, { key: 'Segmented', kind: 'views' }, { key: 'Search', kind: 'search' }, { key: 'Item Group 2', kind: 'group', items: g2 },
  { key: 'Item Group 3', kind: 'group', items: g3 }, { key: 'Item Group 4', kind: 'group', items: g4 }, { key: 'Segmented Text', kind: 'tabs', items: stext }, { key: 'Mail Send', kind: 'primary' },
]
const barRows = [
  ...['Active', 'Inactive'].flatMap((st) => [
    { key: `Plain ${st}`, label: `Plain, ${st.toLowerCase()}`, v: 'plain', off: st === 'Inactive', kit: `Titlebars/Title Bar/Plain/${st}` },
    { key: `Subtitle ${st}`, label: `Subtitle, ${st.toLowerCase()}`, v: 'plain', sub: true, off: st === 'Inactive', kit: `Titlebars/Title Bar/Subtitle/${st}` },
    { key: `Document ${st}`, label: `Document, ${st.toLowerCase()}`, v: 'plain', doc: true, off: st === 'Inactive', kit: `Titlebars/Title Bar/Document/${st}` },
    { key: `Compact ${st}`, label: `Compact, ${st.toLowerCase()}`, v: 'compact', off: st === 'Inactive', kit: `Titlebars/Bar/Compact/${st}` },
    { key: `Title ${st}`, label: `Title only, ${st.toLowerCase()}`, v: 'title', off: st === 'Inactive', kit: `Titlebars/Bar/Title Only/${st}` },
    { key: `Unified ${st}`, label: `Unified, ${st.toLowerCase()}`, v: 'unified', off: st === 'Inactive', kit: `Titlebars/Bar/Unified/Full Inset 16/${st}` },
  ]),
]
const tabCols = [{ key: 'Rest', label: 'Rest' }, { key: 'Hover', label: 'Hover', force: 'hover' }, { key: 'Selected', label: 'Selected', selected: true }]
</script>

<template>
  <DocPage title="Window and title bar" lead="SWindow assembles a title bar or toolbar (STitlebar with STitlebarPiece, STitlebarTitle, STrafficLights), a sidebar, content and an inspector. Regions are split by 1 pt lines; only the window has a shadow.">
    <h2>Playground</h2>
    <div class="play">
      <Stage :pad="24" class="col scroll">
        <SWindow :toolbar="p.toolbar" :title="p.toolbar === 'split' ? 'Lemon cake' : 'Lemon cake'" :inactive="p.inactive" :width="560" :height="400" @close="msg = 'close'" @minimise="msg = 'minimise'" @zoom="msg = 'zoom'">
          <template #toolbar>
            <template v-if="p.toolbar === 'unified' || p.toolbar === 'split'">
              <STitlebarPiece v-if="p.toolbar === 'unified'" kind="icon" icon="sidebar" label="Sidebar" @click="p.sidebar = !p.sidebar" />
              <STitlebarPiece kind="nav" @action="msg = $event" />
              <STitlebarTitle flex title="Lemon cake" />
              <STitlebarPiece kind="views" :items="views" v-model="view" />
              <STitlebarPiece kind="search" v-model="query" :width="p.toolbar === 'split' ? 140 : 0" />
            </template>
            <template v-else-if="p.toolbar === 'compact'">
              <STitlebarPiece><button class="nb" @click="msg = 'back'">‹</button></STitlebarPiece>
              <STitlebarTitle flex title="Lemon cake" />
            </template>
          </template>
          <template v-if="p.sidebar" #sidebar>
            <SSidebar v-model="nav">
              <SSidebarGroup title="Favourites"><SSidebarItem value="recents" icon="clock" label="Recents" /><SSidebarItem value="documents" icon="folder" label="Documents" badge="12" /><SSidebarItem value="downloads" icon="download" label="Downloads" /></SSidebarGroup>
              <SSidebarGroup title="Library"><SSidebarItem value="photos" icon="photo" label="Photos" /><SSidebarItem value="music" icon="folder" label="Music" /></SSidebarGroup>
            </SSidebar>
          </template>
          <div class="cnt"><h1>Lemon cake</h1><p>{{ lorem }}</p><SButton variant="primary" @click="p.sheet = true">Done…</SButton></div>
          <template v-if="p.inspector" #inspector><div class="insp"><b>Inspector</b><SCheckbox model-value>Show ruler</SCheckbox></div></template>
          <template v-if="p.sheet" #sheet><SAlert title="Save changes to “Lemon cake”?" message="Your edits will be lost if you close without saving." :buttons="[{ value: 'save', label: 'Save' }, { value: 'cancel', label: 'Cancel' }]" @action="p.sheet = false"><template #icon><span class="tile" /></template></SAlert></template>
        </SWindow>
        <span class="muted">{{ msg ? `event: ${msg}` : 'click the window controls, the buttons of the toolbar' }}</span>
      </Stage>
      <div class="card ctrl">
        <div class="field"><label>Toolbar</label><div class="seg"><button v-for="m in modes" :key="m" :class="{ on: p.toolbar === m }" @click="p.toolbar = m">{{ m }}</button></div></div>
        <label class="chk"><input v-model="p.sidebar" type="checkbox" /> sidebar</label>
        <label class="chk"><input v-model="p.inspector" type="checkbox" /> inspector</label>
        <label class="chk"><input v-model="p.inactive" type="checkbox" /> inactive window</label>
        <label class="chk"><input v-model="p.sheet" type="checkbox" /> attached sheet</label>
      </div>
    </div>
    <Code :code="code" />

    <h2>Window controls, compared with the kit</h2>
    <CompareMatrix :rows="mk(['Rest', 'Hover', 'Inactive'])" :cols="[{ key: 'x', label: 'Live over kit' }]" :kit="(r) => `Titlebars/Controls/${r.key}`">
      <template #default="{ row }"><STrafficLights :inactive="row.key === 'Inactive'" :force="row.key === 'Hover' ? 'hover' : ''" /></template>
    </CompareMatrix>

    <h2>Title bars, compared with the kit</h2>
    <CompareMatrix :rows="barRows" :cols="one" :kit="(r) => r.kit">
      <template #default="{ row }">
        <STitlebar v-if="row.v === 'plain'" variant="plain" :inactive="row.off" :title="row.doc ? 'Lemon cake.recipe' : 'Lemon cake'" :subtitle="row.sub ? 'Edited today at 09:41' : ''" :document="row.doc" class="bar520" />
        <STitlebar v-else-if="row.v === 'title'" variant="title" :inactive="row.off" title="Lemon cake" class="bar520" />
        <STitlebar v-else-if="row.v === 'compact'" variant="compact" :inactive="row.off" class="bar520">
          <SIconButton size="small" icon="chevron-left" /><SIconButton size="small" icon="chevron-right" />
          <STitlebarTitle flex title="Lemon cake" />
          <SIconButton size="small" icon="share" /><SIconButton size="small" icon="ellipsis" />
        </STitlebar>
        <STitlebar v-else variant="unified" :inactive="row.off" class="bar760">
          <STitlebarPiece kind="icon" icon="sidebar" label="Sidebar" />
          <STitlebarPiece kind="nav" />
          <STitlebarTitle flex title="Lemon cake" />
          <STitlebarPiece kind="views" :items="views" v-model="seg2" />
          <STitlebarPiece kind="search" />
        </STitlebar>
      </template>
    </CompareMatrix>

    <h2>Toolbar pieces, compared with the kit</h2>
    <p class="muted">Each piece is a 52 pt slot with 4 pt side padding. Buttons are 36 pt glass; inactive windows grey the glyphs only.</p>
    <CompareMatrix :rows="pieces.map((x) => ({ key: x.key, label: x.key }))" :cols="[{ key: 'Active', label: 'Active' }, { key: 'Inactive', label: 'Inactive' }]" :kit="(r, c) => (c.key === 'Active' || ['Nav', 'Sidebar Toggle', 'Share', 'More', 'Segmented', 'Search', 'Item Group 2', 'Item Group 3', 'Item Group 4', 'Segmented Text'].includes(r.key) ? `Titlebars/Piece/${r.key}/${c.key}` : null)">
      <template #default="{ row, col }">
        <STitlebar variant="unified" :controls="false" :inactive="col.key === 'Inactive'" class="hug" style="padding: 0; background: none">
          <STitlebarPiece v-if="pieces.find((x) => x.key === row.key).kind === 'views'" kind="views" :items="views" v-model="seg2" />
          <STitlebarPiece v-else-if="pieces.find((x) => x.key === row.key).kind === 'tabs'" kind="tabs" :items="stext" v-model="world" />
          <STitlebarPiece v-else v-bind="pieces.find((x) => x.key === row.key)" />
        </STitlebar>
      </template>
    </CompareMatrix>

    <h2>Tabs, compared with the kit</h2>
    <CompareMatrix :rows="[{ key: 'Tab', label: 'Tab' }]" :cols="tabCols" :kit="(r, c) => `Titlebars/Tab/${c.key}`">
      <template #default="{ col }"><div style="width: 160px"><STab label="Lemon cake" :selected="!!col.selected" :force="col.force" /></div></template>
    </CompareMatrix>
    <CompareMatrix :rows="[{ key: 'Three Tabs', label: 'Three tabs' }]" :cols="[{ key: 'Rest', label: 'Rest' }]" :kit="(r) => `Titlebars/Tab Bar/${r.key}/Rest`">
      <template #default>
        <div style="width: 560px"><STabBar v-model="tab" :tabs="tabs" @close="closeTab" @new="addTab" /></div>
      </template>
    </CompareMatrix>

    <h2>Windows, compared with the kit</h2>
    <h3>Document, panel, utility, sheet</h3>
    <Stage :pad="24" class="col scroll">
      <SidePair label="Document" kit="Windows/Window/Document/Active">
      <SWindow title="Lemon cake.recipe" document :width="540" :height="400"><div class="cnt page"><h1>Lemon cake</h1><p>{{ lorem }}</p><SGroupBox title="Notifications" class="opts"><SCheckbox model-value>Show banners</SCheckbox><SCheckbox model-value>Play sound</SCheckbox><SCheckbox>Show on lock screen</SCheckbox></SGroupBox><SButton class="done" variant="primary">Done</SButton></div></SWindow>
      </SidePair>
      <SidePair label="Sheet attached" kit="Windows/Window/Sheet Attached/Active">
      <SWindow title="Lemon cake.recipe" document :width="540" :height="400">
        <div class="cnt page"><h1>Lemon cake</h1><p>{{ lorem }}</p><SGroupBox title="Notifications" class="opts"><SCheckbox model-value>Show banners</SCheckbox><SCheckbox model-value>Play sound</SCheckbox><SCheckbox>Show on lock screen</SCheckbox></SGroupBox><SButton class="done" variant="primary">Done</SButton></div>
        <template #sheet><SAlert title="Empty the outbox?" message="Messages waiting to be sent will be sent now." suppress="Do not ask again" :buttons="[{ label: 'Send' }, { label: 'Cancel' }]"><template #icon><span class="tile" /></template></SAlert></template>
      </SWindow>
      </SidePair>
      <SidePair label="Panel" kit="Windows/Window/Panel/Active">
      <SWindow title="Style" :width="300" :height="380"><div class="cnt panel"><SSegmented v-model="pm" :items="[{ value: 'one', label: 'One' }, { value: 'two', label: 'Two' }, { value: 'three', label: 'Three' }]" style="width: 224px" /><SGroupBox style="width: 224px"><STextField model-value="Amalfi coast" /><SCheckbox model-value>Remember this name</SCheckbox></SGroupBox><div class="chlist"><span>Browsing</span><SCheckbox mixed>Select all</SCheckbox><SCheckbox model-value>Show hidden files</SCheckbox><SCheckbox>Open folders in tabs</SCheckbox></div></div></SWindow>
      </SidePair>
      <SidePair label="Utility" kit="Windows/Window/Utility/Active">
      <SWindow kind="utility" title="Quick find" :width="260" :height="196"><div class="cnt util"><SSearchField /><SCheckbox model-value>Match case</SCheckbox><SCheckbox>Whole words</SCheckbox><SButton class="find" variant="primary" size="small">Find</SButton></div></SWindow>
      </SidePair>
    </Stage>

    <h3>Toolbar layouts</h3>
    <Stage :pad="24" class="col scroll">
      <SidePair label="Compact toolbar" kit="Windows/Compact Toolbar/Active">
      <SWindow toolbar="compact" title="Lemon cake" :width="520" :height="320">
        <template #toolbar><SIconButton size="small" icon="chevron-left" /><SIconButton size="small" icon="chevron-right" /><STitlebarTitle flex title="Lemon cake" /><SIconButton size="small" icon="share" /><SIconButton size="small" icon="ellipsis" /></template>
        <div class="cnt cmp"><h1>Lemon cake</h1><p>{{ lorem }}</p></div>
      </SWindow>
      </SidePair>

      <SidePair stack label="Unified toolbar and sidebar" kit="Windows/Unified Toolbar Sidebar/Active">
      <SWindow toolbar="unified" :width="960" :height="600">
        <template #toolbar>
          <STitlebarPiece kind="icon" icon="sidebar" label="Sidebar" /><STitlebarPiece kind="nav" /><STitlebarTitle flex title="Lemon cake" />
          <STitlebarPiece kind="views" :items="views" v-model="seg2" /><STitlebarPiece kind="search" />
        </template>
        <template #sidebar>
          <SSidebar v-model="nav">
            <SSidebarGroup title="Favourites"><SSidebarItem value="recents" icon="clock" label="Recents" /><SSidebarItem value="documents" icon="folder" label="Documents" badge="12" /><SSidebarItem value="downloads" icon="download" label="Downloads" /></SSidebarGroup>
            <SSidebarGroup title="Library"><SSidebarItem value="photos" icon="photo" label="Photos" /><SSidebarItem value="music" icon="folder" label="Music" /></SSidebarGroup>
          </SSidebar>
        </template>
        <div class="cnt"><h1>Lemon cake</h1><p>{{ lorem }}</p></div>
      </SWindow>
      </SidePair>

      <SidePair stack label="Split toolbar (sidebar | content)" kit="Windows/Split Toolbar/Active">
      <SWindow toolbar="split" :width="960" :height="600">
        <template #toolbar><STitlebarPiece kind="nav" /><STitlebarTitle flex title="Lemon cake" /><STitlebarPiece kind="group" :items="g2" /><STitlebarPiece kind="views" :items="views" v-model="seg2" /><STitlebarPiece kind="search" /></template>
        <template #sidebar>
          <SSidebar v-model="nav">
            <SSidebarGroup title="Favourites"><SSidebarItem value="recents" icon="clock" label="Recents" /><SSidebarItem value="documents" icon="folder" label="Documents" badge="12" /><SSidebarItem value="downloads" icon="download" label="Downloads" /></SSidebarGroup>
            <SSidebarGroup title="Library"><SSidebarItem value="photos" icon="photo" label="Photos" /><SSidebarItem value="music" icon="folder" label="Music" /></SSidebarGroup>
          </SSidebar>
        </template>
        <div class="cnt"><h1>Lemon cake</h1><p>{{ lorem }}</p></div>
      </SWindow>
      </SidePair>

      <SidePair stack label="Split toolbar, three columns" kit="Windows/Split Toolbar Three Columns/Active">
      <SWindow toolbar="split" :width="1280" :height="600">
        <template #toolbar-list><STitlebarTitle flex title="Recipes" /><STitlebarPiece kind="group" :items="g2" /></template>
        <template #toolbar><STitlebarPiece kind="nav" /><STitlebarTitle flex title="Lemon cake" /><STitlebarPiece kind="views" :items="views" v-model="seg2" /><STitlebarPiece kind="search" /></template>
        <template #sidebar>
          <SSidebar v-model="nav">
            <SSidebarGroup title="Favourites"><SSidebarItem value="recents" icon="clock" label="Recents" /><SSidebarItem value="documents" icon="folder" label="Documents" badge="12" /></SSidebarGroup>
          </SSidebar>
        </template>
        <template #list>
          <div v-for="r in ['Lemon cake', 'Orange tart', 'Almond biscuits']" :key="r" class="li"><b>{{ r }}</b><span>Whisk the eggs with sugar until pale.</span></div>
        </template>
        <div class="cnt"><h1>Lemon cake</h1><p>{{ lorem }}</p></div>
      </SWindow>
      </SidePair>

      <SidePair stack label="Unified, sidebar and inspector" kit="Windows/Window/Sidebar Inspector/Active">
      <SWindow toolbar="unified" :width="1000" :height="580">
        <template #toolbar>
          <STitlebarPiece kind="icon" icon="sidebar" label="Sidebar" /><STitlebarPiece kind="nav" /><STitlebarTitle flex title="Lemon cake" />
          <STitlebarPiece kind="views" :items="views" v-model="seg2" /><STitlebarPiece kind="search" />
        </template>
        <template #sidebar>
          <SSidebar v-model="nav">
            <SSidebarGroup title="Favourites"><SSidebarItem value="recents" icon="clock" label="Recents" /><SSidebarItem value="documents" icon="folder" label="Documents" badge="12" /><SSidebarItem value="downloads" icon="download" label="Downloads" /></SSidebarGroup>
          </SSidebar>
        </template>
        <div class="cnt"><h1>Lemon cake</h1><p>{{ lorem }}</p></div>
        <template #inspector><div class="insp"><b>Inspector</b></div></template>
      </SWindow>
      </SidePair>

      <SidePair stack label="Inactive window" kit="Windows/Window/Inactive/Inactive">
      <SWindow toolbar="unified" inactive :width="760" :height="440">
        <template #toolbar>
          <STitlebarPiece kind="icon" icon="sidebar" label="Sidebar" /><STitlebarPiece kind="nav" /><STitlebarTitle flex title="Lemon cake" />
          <STitlebarPiece kind="views" :items="views" v-model="seg2" /><STitlebarPiece kind="search" />
        </template>
        <template #sidebar>
          <SSidebar inactive model-value="recents">
            <SSidebarGroup title="Favourites"><SSidebarItem value="recents" icon="clock" label="Recents" /><SSidebarItem value="documents" icon="folder" label="Documents" badge="12" /><SSidebarItem value="downloads" icon="download" label="Downloads" /></SSidebarGroup>
            <SSidebarGroup title="Library"><SSidebarItem value="photos" icon="photo" label="Photos" /><SSidebarItem value="music" icon="folder" label="Music" /></SSidebarGroup>
          </SSidebar>
        </template>
        <div class="cnt dim"><h1>Lemon cake</h1><p>{{ lorem }}</p></div>
      </SWindow>
      </SidePair>
    </Stage>
  </DocPage>
</template>

<style scoped>
.play { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 16px; align-items: stretch; }
.col { flex-direction: column; flex-wrap: nowrap; align-items: flex-start; gap: 8px; }
.scroll { overflow-x: auto; }
.ctrl { padding: 16px; display: flex; flex-direction: column; gap: 14px; }
.chk { display: flex; gap: 6px; align-items: center; }
.lab { font-size: 11px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: var(--text-tertiary); margin-top: 12px; }
.lab:first-child { margin-top: 0; }
.bar520 { width: 520px; }
.bar760 { width: 760px; }
.hug { width: max-content; }
.cnt { padding: 24px; }
.cnt.page { padding: 28px; }
.cnt.cmp { padding: 24px 16px; }
.cnt h1 { margin: 0 0 12px; font: var(--font-title-1); color: var(--text-primary); }
.cnt p { margin: 0 0 16px; font: var(--font-body); color: var(--text-secondary); max-width: none; }
.cnt.panel { display: flex; flex-direction: column; gap: 20px; padding: 16px 40px 16px 36px; }
.cnt.panel :deep(.s-segmented) { margin-left: 4px; }
.chlist { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; padding: 10px 8px 8px; margin-left: 4px; font: var(--font-headline); }
.cnt.util { display: flex; flex-direction: column; gap: 8px; padding: 4px 30px; }
.cnt.util :deep(.s-check) { margin-left: 2px; }
.cnt.util :deep(.s-check:first-of-type) { margin-top: 12px; }
.cnt.util :deep(.find) { align-self: flex-end; margin-top: 4px; }
.cnt.dim h1, .cnt.dim p { color: var(--text-tertiary); }
.cnt.page :deep(.done) { position: absolute; right: 32px; bottom: 24px; }
.cnt.page :deep(.opts) { width: 192px; margin-top: 36px; }
.insp { padding: 20px 16px; display: flex; flex-direction: column; gap: 12px; font: var(--font-headline); }
.li { display: flex; flex-direction: column; gap: 4px; padding: 12px 24px; border-bottom: 1px solid var(--line-separator); font: var(--font-headline); }
.li span { font: var(--font-callout); color: var(--text-tertiary); }
.tile { display: block; width: 56px; height: 56px; border-radius: 13px; background: var(--palette-limone); box-shadow: inset 0 0 0 1px #0000001f; }
.ib { display: block; width: 24px; height: 24px; border-radius: 12px; background: var(--surface-control); box-shadow: inset 0 0 0 1px var(--line-border); }
.nb { border: 0; background: none; font-size: 20px; }
.fill { flex: 1 1 0; }
</style>
