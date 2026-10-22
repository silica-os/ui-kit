<script>
export const meta = { title: 'Menu bar and Dock', order: 110 }
</script>

<script setup>
import { computed, ref } from 'vue'
import SMenuBar from '../../lib/SMenuBar.vue'
import SMenuBarItem from '../../lib/SMenuBarItem.vue'
import SStatusItem from '../../lib/SStatusItem.vue'
import SMenuItem from '../../lib/SMenuItem.vue'
import SMenuSeparator from '../../lib/SMenuSeparator.vue'
import SDock from '../../lib/SDock.vue'
import SDockTile from '../../lib/SDockTile.vue'
import SDockSeparator from '../../lib/SDockSeparator.vue'
import DocPage from '../DocPage.vue'
import Stage from '../Stage.vue'
import KitRef from '../KitRef.vue'
import SidePair from '../SidePair.vue'
import Code from '../Code.vue'
import CompareMatrix from '../CompareMatrix.vue'

const open = ref('')
const chosen = ref('')
const wifi = ref(true)
const code = computed(() => `<SMenuBar app-name="Recipes" v-model:open="open">
  <template #app><SMenuItem label="About Recipes" /></template>
  <SMenuBarItem label="File">
    <SMenuItem label="New" shortcut="⌘N" @click="…" />
    <SMenuSeparator />
    <SMenuItem label="Close" shortcut="⌘W" />
  </SMenuBarItem>
  <template #status>
    <SStatusItem icon="wifi" /><SStatusItem icon="battery" label="84%" /><SStatusItem label="Fri 16 Oct  09:41" />
  </template>
</SMenuBar>

<SDock>
  <SDockTile label="Mail" glyph="…" color="…" running />
  <SDockSeparator />
  <SDockTile label="Trash" glyph="trash" />
</SDock>`)

const apps = [
  { label: 'Launchpad', glyph: 'circle-grid-3x3', color: 'var(--text-tertiary)' },
  { label: 'Mail', glyph: 'message-ellipsis', color: 'var(--accent-amalfi)', running: true },
  { label: 'Reminders', glyph: 'checklist', color: 'var(--palette-terracotta)' },
  { label: 'Photos', glyph: 'photo', color: 'var(--palette-bouganville)' },
  { label: 'Notes', glyph: 'doc-text', color: 'var(--palette-limone)' },
  { label: 'Terminal', glyph: 'terminal', color: 'var(--text-primary)', running: true },
  { label: 'Settings', glyph: 'gear', color: 'var(--text-secondary)' },
]
const items = [{ key: 'Menu/Rest', label: 'Menu, rest', text: 'File' }, { key: 'Menu/Active', label: 'Menu, open', text: 'File', active: true }, { key: 'Name/Rest', label: 'App name', text: 'Recipes', bold: true }, { key: 'Silica/Rest', label: 'Silica mark', mark: true }]
const one = [{ key: 'x', label: 'Live over kit' }]
const tiles = [
  { key: 'Mail/Rest', label: 'Mail', glyph: 'message-ellipsis', color: 'var(--accent-amalfi)' }, { key: 'Mail/Running', label: 'Mail, running', glyph: 'message-ellipsis', color: 'var(--accent-amalfi)', running: true },
  { key: 'Notes/Rest', label: 'Notes', glyph: 'doc-text', color: 'var(--palette-limone)' }, { key: 'Trash Empty/Rest', label: 'Trash', glyph: 'trash' }, { key: 'Missing/Rest', label: 'Missing app', glyph: 'question' },
]
</script>

<template>
  <DocPage title="Menu bar and Dock" lead="The 32 pt menu bar (Silica mark, bold app name, menus that open an SMenu, a status cluster on the right) and the dock (a thin-glass shelf of 64 x 80 tiles with running dots, tooltips and a context menu).">
    <h2>Playground: menu bar</h2>
    <Stage glass :pad="0" class="stack">
      <SMenuBar v-model:open="open" app-name="Recipes" glass style="width: 100%">
        <template #system><SMenuItem label="About Silica" @click="chosen = 'About Silica'" /><SMenuItem label="Settings…" @click="chosen = 'Settings'" /><SMenuSeparator /><SMenuItem label="Log Out…" @click="chosen = 'Log out'" /></template>
        <template #app><SMenuItem label="About Recipes" @click="chosen = 'About'" /><SMenuSeparator /><SMenuItem label="Quit Recipes" shortcut="⌘Q" @click="chosen = 'Quit'" /></template>
        <SMenuBarItem label="File">
          <SMenuItem label="New Recipe" shortcut="⌘N" @click="chosen = 'New'" /><SMenuItem label="Open…" shortcut="⌘O" @click="chosen = 'Open'" /><SMenuSeparator /><SMenuItem label="Close" shortcut="⌘W" @click="chosen = 'Close'" />
        </SMenuBarItem>
        <SMenuBarItem label="Edit">
          <SMenuItem label="Undo" shortcut="⌘Z" /><SMenuItem label="Redo" shortcut="⇧⌘Z" disabled /><SMenuSeparator /><SMenuItem label="Copy" shortcut="⌘C" />
        </SMenuBarItem>
        <SMenuBarItem label="View"><SMenuItem label="Show Sidebar" checked /><SMenuItem label="Enter Full Screen" shortcut="⌃⌘F" /></SMenuBarItem>
        <SMenuBarItem label="Window" :menu="false" />
        <SMenuBarItem label="Help" :menu="false" />
        <template #status>
          <SStatusItem icon="bluetooth" :menu="false" />
          <SStatusItem :icon="wifi ? 'wifi' : 'wifi-slash'"><SMenuItem :label="wifi ? 'Turn Wi-Fi Off' : 'Turn Wi-Fi On'" @click="wifi = !wifi" /><SMenuSeparator /><SMenuItem label="Wi-Fi Settings…" /></SStatusItem>
          <SStatusItem icon="volume" /><SStatusItem icon="search" />
          <SStatusItem icon="battery" label="84%"><SMenuItem header label="Battery" /><SMenuItem label="84 % charged" disabled /><SMenuSeparator /><SMenuItem label="Battery Settings…" /></SStatusItem>
          <SStatusItem label="Fri 16 Oct  09:41" /><SStatusItem icon="control-center" />
        </template>
      </SMenuBar>
      <div class="area muted">{{ chosen ? `chose: ${chosen}` : 'click a menu, move across the bar, press Esc' }}</div>
    </Stage>
    <Code :code="code" />

    <h2>Menu bar, compared with the kit</h2>
    <Stage glass :pad="20" class="col">
      <SidePair label="closed" kit="Menu Bar/Bar/Closed/Rest" stack>
        <SMenuBar app-name="Recipes" style="width: 960px">
          <SMenuBarItem label="File" :menu="false" /><SMenuBarItem label="Edit" :menu="false" /><SMenuBarItem label="View" :menu="false" /><SMenuBarItem label="Window" :menu="false" /><SMenuBarItem label="Help" :menu="false" />
          <template #status><SStatusItem icon="bluetooth" /><SStatusItem icon="wifi" /><SStatusItem icon="volume" /><SStatusItem icon="battery" label="84%" /><SStatusItem icon="search" /><SStatusItem label="Fri 16 Oct  09:41" /><SStatusItem icon="control-center" /></template>
        </SMenuBar>
      </SidePair>
    </Stage>
    <CompareMatrix glass :rows="items.map((i) => ({ key: i.key, label: i.label }))" :cols="one" :kit="(r) => `Menu Bar/Item/${r.key}`">
      <template #default="{ row }">
        <template v-for="i in items.filter((x) => x.key === row.key)" :key="i.key">
          <SMenuBarItem v-if="i.mark" icon="silica" :menu="false" />
          <SMenuBarItem v-else :label="i.text" :bold="i.bold" :active="i.active" :menu="false" />
        </template>
      </template>
    </CompareMatrix>
    <Stage glass :pad="20" class="col">
      <SidePair label="status cluster, battery open" kit="Control Center/Status/Battery" stack>
        <div style="width: 340px; height: 160px">
          <SMenuBar :mark="false" glass><template #status><SStatusItem icon="wifi" :menu="false" /><SStatusItem icon="bluetooth" :menu="false" /><SStatusItem icon="battery" active :menu-width="232"><SMenuItem header label="Battery" /><SMenuItem label="78 % charged" disabled /><SMenuItem label="Power Source: Battery" disabled /><SMenuSeparator /><SMenuItem label="Battery Settings…" /></SStatusItem></template></SMenuBar>
        </div>
      </SidePair>
    </Stage>

    <h2>Playground: dock</h2>
    <Stage glass :pad="40" class="stack dockarea">
      <SDock>
        <SDockTile v-for="a in apps" :key="a.label" v-bind="a" @click="chosen = a.label">
          <template #menu><SMenuItem label="Options" submenu /><SMenuItem label="Show in Finder" /><SMenuItem label="Hide" /><SMenuItem label="Quit" /></template>
        </SDockTile>
        <SDockSeparator />
        <SDockTile label="Downloads" glyph="download" color="var(--palette-mare)" />
        <SDockTile label="Trash" glyph="trash" />
      </SDock>
      <span class="muted">hover a tile for the label, right-click for its menu · last click: {{ chosen || '–' }}</span>
    </Stage>

    <h2>Dock, compared with the kit</h2>
    <Stage glass :pad="20" class="col">
      <SidePair label="shelf" kit="Dock/Shelf/Default/Rest" stack>
        <SDock style="width: 620px">
          <SDockTile label="Launchpad" glyph="circle-grid-3x3" color="var(--text-tertiary)" /><SDockTile label="Mail" glyph="message-ellipsis" color="var(--accent-amalfi)" running /><SDockTile label="Reminders" glyph="checklist" color="var(--palette-terracotta)" />
          <SDockTile label="Photos" glyph="photo" color="var(--palette-bouganville)" /><SDockTile label="Notes" glyph="doc-text" color="var(--palette-limone)" /><SDockTile label="Terminal" glyph="terminal" color="var(--text-primary)" running />
          <SDockTile label="Settings" glyph="gear" color="var(--text-secondary)" /><SDockSeparator /><SDockTile label="Downloads" glyph="download" color="var(--palette-mare)" /><SDockTile label="Trash" glyph="trash" />
        </SDock>
      </SidePair>
      <SidePair label="with label" kit="Dock/Shelf/With Label/Rest" stack>
        <div style="padding-top: 26px"><SDock style="width: 620px"><SDockTile label="Launchpad" glyph="circle-grid-3x3" color="var(--text-tertiary)" /><SDockTile label="Mail" glyph="message-ellipsis" color="var(--accent-amalfi)" running force="hover" /></SDock></div>
      </SidePair>
    </Stage>
    <CompareMatrix glass :rows="tiles.map((t) => ({ key: t.key, label: t.label }))" :cols="one" :kit="(r) => `Dock/Tile/${r.key}`">
      <template #default="{ row }"><SDockTile v-bind="tiles.find((t) => t.key === row.key)" /></template>
    </CompareMatrix>
  </DocPage>
</template>

<style scoped>
.stack { flex-direction: column; align-items: stretch; gap: 0; flex-wrap: nowrap; }
.col { flex-direction: column; flex-wrap: nowrap; align-items: flex-start; overflow-x: auto; }
.area { padding: 80px 24px 100px; }
.dockarea { align-items: center; gap: 24px; padding-top: 80px; }
</style>
