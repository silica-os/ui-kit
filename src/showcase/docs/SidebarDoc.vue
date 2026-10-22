<script>
export const meta = { title: 'Sidebar', order: 80 }
</script>

<script setup>
import { computed, ref } from 'vue'
import SSidebar from '../../lib/SSidebar.vue'
import SSidebarGroup from '../../lib/SSidebarGroup.vue'
import SSidebarItem from '../../lib/SSidebarItem.vue'
import SIconButton from '../../lib/SIconButton.vue'
import DocPage from '../DocPage.vue'
import Stage from '../Stage.vue'
import Code from '../Code.vue'
import CompareMatrix from '../CompareMatrix.vue'
import kitIndex from '../../../kit/index.json'

const names = new Set(kitIndex.symbols.map((s) => s.name))
const exists = (n) => (names.has(`${n}/Light`) ? n : null)

const selected = ref('recents')
const inactive = ref(false)
const ejected = ref('')
const code = computed(() => `<SSidebar v-model="selected"${inactive.value ? ' inactive' : ''}>
  <SSidebarGroup title="Favourites">
    <SSidebarItem value="recents" icon="clock" label="Recents" />
    <SSidebarItem value="documents" icon="folder" label="Documents" badge="12" />
  </SSidebarGroup>
  <template #footer><SIconButton shape="square" size="small" icon="plus" /></template>
</SSidebar>`)

const cols = [{ key: 'Rest', label: 'Rest' }, { key: 'Hover', label: 'Hover', force: 'hover' }, { key: 'Selected', label: 'Selected', selected: true }]
const cols2 = [{ key: 'Selected Inactive', label: 'Selected, inactive', selected: true, inactive: true }, { key: 'Disabled', label: 'Disabled', disabled: true }, { key: 'Pressed', label: 'Pressed (live only)', force: 'pressed' }]
const rows = [{ key: 'Plain', label: 'Plain' }, { key: 'Badge', label: 'Badge' }, { key: 'Volume', label: 'Volume' }]
const rowProps = { Plain: { icon: 'folder', label: 'Documents' }, Badge: { icon: 'folder', label: 'Documents', badge: '12' }, Volume: { icon: 'drive', label: 'Lemon 2.1', eject: true } }
const hOpen = ref(true)
const hRows = [{ key: 'Open', label: 'Open' }, { key: 'Closed', label: 'Closed' }, { key: 'Plain', label: 'Plain' }]
const hCols = [{ key: 'Rest', label: 'Rest' }]
</script>

<template>
  <DocPage title="Sidebar" lead="A 240 pt sidebar: rows with a coloured glyph, groups with a disclosure chevron that fold away, count badges, volumes with an eject button, a footer toolbar. v-model is the selected row; arrow keys move.">
    <h2>Playground</h2>
    <div class="play">
      <Stage :pad="0" class="grow">
        <SSidebar v-model="selected" :inactive="inactive" class="tall">
          <SSidebarGroup title="Favourites">
            <SSidebarItem value="recents" icon="clock" label="Recents" />
            <SSidebarItem value="documents" icon="folder" label="Documents" badge="12" />
            <SSidebarItem value="downloads" icon="download" label="Downloads" />
          </SSidebarGroup>
          <SSidebarGroup title="Library">
            <SSidebarItem value="photos" icon="photo" label="Photos" />
            <SSidebarItem value="music" icon="folder" label="Music" disabled />
          </SSidebarGroup>
          <SSidebarGroup title="Locations" :open="false">
            <SSidebarItem value="lemon" icon="drive" label="Lemon 2.1" eject @eject="ejected = 'Lemon 2.1'" />
          </SSidebarGroup>
          <template #footer><SIconButton shape="square" size="small" icon="plus" label="Add" /><span class="s-spacer" /><SIconButton shape="square" size="small" icon="gear" label="Settings" /></template>
        </SSidebar>
        <div class="side muted">selected: {{ selected }}<br />{{ ejected && `ejected ${ejected}` }}</div>
      </Stage>
      <div class="card ctrl"><label class="chk"><input v-model="inactive" type="checkbox" /> inactive window</label></div>
    </div>
    <Code :code="code" />

    <h2>Rows, compared with the kit</h2>
    <CompareMatrix :rows="rows" :cols="cols" :kit="(r, c) => exists(`Sidebars/Row/${r.key}/${c.key}`)">
      <template #default="{ row, col }">
        <SSidebar v-if="exists(`Sidebars/Row/${row.key}/${col.key}`) || col.force === 'pressed'" :inactive="col.inactive" class="one"><SSidebarItem v-bind="rowProps[row.key]" :selected="!!col.selected" :force="col.force" :disabled="col.disabled" /></SSidebar>
        <span v-else class="muted">–</span>
      </template>
    </CompareMatrix>

    
    <CompareMatrix :rows="rows" :cols="cols2" :kit="(r, c) => exists(`Sidebars/Row/${r.key}/${c.key}`)">
      <template #default="{ row, col }">
        <SSidebar v-if="exists(`Sidebars/Row/${row.key}/${col.key}`) || col.force === 'pressed'" :inactive="col.inactive" class="one"><SSidebarItem v-bind="rowProps[row.key]" :selected="!!col.selected" :force="col.force" :disabled="col.disabled" /></SSidebar>
        <span v-else class="muted">–</span>
      </template>
    </CompareMatrix>

    <h2>Group headers, compared with the kit</h2>
    <CompareMatrix :rows="hRows" :cols="hCols" :kit="(r) => `Sidebars/Header/${r.key}/Rest`">
      <template #default="{ row }">
        <SSidebar class="one"><SSidebarGroup title="Favourites" :collapsible="row.key !== 'Plain'" :open="row.key !== 'Closed'" /></SSidebar>
      </template>
    </CompareMatrix>

    <h2>Panel, compared with the kit</h2>
    <CompareMatrix :rows="[{ key: 'Active', label: 'Active' }]" :cols="hCols" :kit="() => 'Sidebars/Panel/Active'">
      <template #default>
        <SSidebar model-value="recents" style="height: 460px; min-height: 0">
          <SSidebarGroup title="Favourites">
            <SSidebarItem value="recents" icon="clock" label="Recents" />
            <SSidebarItem value="documents" icon="folder" label="Documents" badge="12" />
            <SSidebarItem value="downloads" icon="folder" label="Downloads" />
          </SSidebarGroup>
          <SSidebarGroup title="Library">
            <SSidebarItem value="photos" icon="folder" label="Photos" />
            <SSidebarItem value="music" icon="folder" label="Music" />
          </SSidebarGroup>
          <SSidebarGroup title="Tags" :open="false" />
          <template #footer><SIconButton shape="square" size="small" icon="plus" label="Add" /><SIconButton shape="square" size="small" icon="gear" label="Settings" /></template>
        </SSidebar>
      </template>
    </CompareMatrix>
  </DocPage>
</template>

<style scoped>
.play { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 16px; align-items: stretch; }
.grow { min-height: 380px; align-items: stretch; flex-wrap: nowrap; gap: 0; overflow: hidden; }
.tall { height: 380px; }
.side { padding: 24px; }
.ctrl { padding: 16px; display: flex; flex-direction: column; gap: 14px; }
.chk { display: flex; gap: 6px; align-items: center; }
.one { width: 216px; min-height: 0; padding: 0; }
.one :deep(.s-sidebar__group) { margin-bottom: 0; }
</style>
