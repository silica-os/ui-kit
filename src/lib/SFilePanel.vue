<script setup>
import SDialogFooter from './SDialogFooter.vue'
import SFileBrowser from './SFileBrowser.vue'
import SFormRow from './SFormRow.vue'
import STextField from './STextField.vue'
import SPopUpButton from './SPopUpButton.vue'
import SSegmented from './SSegmented.vue'
import SSearchField from './SSearchField.vue'
import SIconButton from './SIconButton.vue'
import SSidebar from './SSidebar.vue'
import SSidebarGroup from './SSidebarGroup.vue'
import SSidebarItem from './SSidebarItem.vue'
import STrafficLights from './STrafficLights.vue'
import SButton from './SButton.vue'

/**
 * The save and open panels in the Finder's layout (Dialogs/Dialog/Save Panel, Open Panel, Save Panel Compact): a sidebar of places
 * the full height of the panel on the left; on the right the title and the "Save As:" and "Tags:" fields (save panel), a toolbar
 * (back / forward, the view switch, the location pop-up, the expand button in the save panel, search), the striped file list and the
 * button row (New Folder at the left of the save panel). `expanded` false collapses the save panel to its compact form: the fields,
 * the "Where:" pop-up with the expand button, Cancel and Save.
 * `places` is [{ title, items: [{ value, label, icon }] }]. `v-model:name`, `v-model:location`, `v-model:place`, `v-model` (the
 * selected file), `v-model:view`, `v-model:search`, `v-model:expanded`, `v-model:tags`. Emits `primary`, `secondary`, `close`,
 * `new-folder`, `navigate` ('back' | 'forward').
 */
const props = defineProps({
  mode: { type: String, default: 'save', validator: (v) => ['save', 'open'].includes(v) },
  expanded: { type: Boolean, default: true },
  title: { type: String, default: '' },
  name: { type: String, default: '' },
  tags: { type: String, default: '' },
  location: { type: String, default: '' },
  locations: { type: Array, default: () => [] },
  places: { type: Array, default: () => [] },
  place: { type: [String, Number], default: null },
  files: { type: Array, default: () => [] },
  modelValue: { type: [String, Number], default: null },
  view: { type: String, default: 'icons' },
  search: { type: String, default: '' },
  primary: { type: String, default: '' },
  secondary: { type: String, default: 'Cancel' },
  width: { type: [Number, String], default: 0 },
})
const emit = defineEmits(['update:name', 'update:tags', 'update:location', 'update:place', 'update:modelValue', 'update:view', 'update:search', 'update:expanded', 'primary', 'secondary', 'close', 'new-folder', 'navigate'])
const views = [{ value: 'icons', icon: 'square-grid-2x2' }, { value: 'list', icon: 'list-bullet' }, { value: 'gallery', icon: 'gallery' }]
const nav = [{ value: 'back', icon: 'chevron-left' }, { value: 'forward', icon: 'chevron-right' }]
const compact = () => props.mode === 'save' && !props.expanded
const w = () => (props.width ? (typeof props.width === 'number' ? props.width + 'px' : props.width) : compact() ? '440px' : '720px')
</script>

<template>
  <section class="s-dialog s-dialog--file" :class="{ 'is-compact': compact(), 'is-open': mode === 'open' }" role="dialog" aria-modal="true" :aria-label="title || (mode === 'save' ? 'Save' : 'Open')" :style="{ width: w() }" @keydown.esc.stop="emit('close')">
    <aside v-if="!compact()" class="s-filepanel__sidebar">
      <STrafficLights v-if="mode === 'save'" class="s-filepanel__lights" @close="emit('close')" />
      <SSidebar :model-value="place" @update:model-value="emit('update:place', $event)">
        <SSidebarGroup v-for="g in places" :key="g.title" :title="g.title" :collapsible="false"><SSidebarItem v-for="p in g.items" :key="p.value" v-bind="p" /></SSidebarGroup>
      </SSidebar>
    </aside>
    <div class="s-filepanel__main">
      <h2 v-if="mode === 'save'" class="s-filepanel__title">{{ title || 'Save' }}</h2>
      <div v-if="mode === 'save'" class="s-filepanel__fields">
        <SFormRow label="Save As:"><STextField :model-value="name" style="width: 204px" @update:model-value="emit('update:name', $event)" /></SFormRow>
        <SFormRow label="Tags:"><STextField :model-value="tags" style="width: 204px" @update:model-value="emit('update:tags', $event)" /></SFormRow>
        <SFormRow v-if="compact()" label="Where:">
          <div class="s-filepanel__where"><SPopUpButton :model-value="location" :options="locations" @update:model-value="emit('update:location', $event)" /><SIconButton icon="chevron-down" label="Show more options" shape="square" @click="emit('update:expanded', true)" /></div>
        </SFormRow>
      </div>
      <template v-if="!compact()">
        <div class="s-filepanel__toolbar">
          <SSegmented action :items="nav" @action="emit('navigate', $event)" />
          <SSegmented :model-value="view" :items="views" @update:model-value="emit('update:view', $event)" />
          <SPopUpButton :model-value="location" :options="locations" class="s-filepanel__location" @update:model-value="emit('update:location', $event)" />
          <SIconButton v-if="mode === 'save'" icon="chevron-up" label="Hide options" shape="square" class="s-filepanel__expand" @click="emit('update:expanded', false)" />
          <SSearchField :model-value="search" class="s-filepanel__search" @update:model-value="emit('update:search', $event)" />
        </div>
        <SFileBrowser :files="files" :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" @open="emit('primary')" />
      </template>
      <SDialogFooter :primary="primary || (mode === 'save' ? 'Save' : 'Open')" :secondary="secondary" @primary="emit('primary')" @secondary="emit('secondary')">
        <template v-if="mode === 'save' && !compact()" #leading><SButton variant="secondary" @click="emit('new-folder')">New Folder</SButton></template>
      </SDialogFooter>
    </div>
  </section>
</template>

<style>
.s-dialog--file { display: flex; flex-direction: row; gap: 0; padding: 0; overflow: hidden; }
.s-filepanel__sidebar { flex: none; position: relative; box-sizing: border-box; width: 177px; padding: 12px 0 0; background: var(--surface-sidebar); border-right: 1px solid var(--line-separator); }
.s-dialog--file:not(.is-open) .s-filepanel__sidebar { padding-top: 48px; }
.s-filepanel__lights { position: absolute; left: 16px; top: 16px; }
.s-filepanel__sidebar .s-sidebar { width: 100%; min-height: 0; padding: 0 8px; background: none; }
.s-filepanel__sidebar .s-sidebar__header { padding-inline: 12px; }
.s-filepanel__main { flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; gap: 12px; padding: 16px 0 12px; }
.s-filepanel__main > :is(.s-dialog-footer, .s-filepanel__toolbar, .s-filepanel__fields, .s-filepanel__title) { margin-inline: 16px; }
.s-dialog--file:not(.is-open) .s-filepanel__main { padding-top: 14px; }
.s-filepanel__title { margin: 0 16px; font: var(--font-body-emphasis); line-height: 18px; color: var(--text-primary); }
.s-filepanel__fields { display: flex; flex-direction: column; gap: 8px; }
.s-filepanel__toolbar { display: flex; align-items: center; gap: 12px; margin-top: 4px; }
.s-dialog--file.is-open .s-filepanel__toolbar { margin-top: 0; }
.s-filepanel__location { flex: 1 1 0; min-width: 0; }
.s-filepanel__expand { margin-left: -4px; }
.s-filepanel__search { flex: none; width: 108px; }
.s-dialog--file:not(.is-open) .s-filepanel__search { width: 106px; margin-left: -4px; }
.s-filepanel__where { display: flex; align-items: center; gap: 8px; }
/* collapsed: only the fields and the buttons */
.s-dialog--file.is-compact .s-filepanel__main { padding: 14px 20px 20px; gap: 12px; }
.s-dialog--file.is-compact .s-filepanel__main > :is(.s-dialog-footer, .s-filepanel__fields, .s-filepanel__title) { margin-inline: 0; }
.s-dialog--file.is-compact .s-filepanel__title { margin: 0; }
.s-dialog--file.is-compact .s-dialog-footer { margin-top: 8px; }
</style>
