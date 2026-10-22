<script setup>
import { ref } from 'vue'
import SDialogFooter from './SDialogFooter.vue'
import SFileBrowser from './SFileBrowser.vue'
import SFormRow from './SFormRow.vue'
import STextField from './STextField.vue'
import SPopUpButton from './SPopUpButton.vue'
import SSegmented from './SSegmented.vue'
import SSearchField from './SSearchField.vue'
import SButton from './SButton.vue'

/**
 * The save and open panels (Dialogs/Dialog/Save Panel, Open Panel), laid out like the Finder's: no title; the save panel starts with
 * a "Save As:" field and a "Where:" pop-up; then a toolbar (back / forward, the view switch, the location pop-up in the open panel,
 * search), the flush file browser and the button row (New Folder on the left of the save panel). `v-model:name`, `v-model:location`,
 * `v-model:place`, `v-model` (selected file), `v-model:view`, `v-model:search`. Emits `primary`, `secondary`, `close`, `new-folder`,
 * `navigate` ('back' | 'forward').
 */
const props = defineProps({
  mode: { type: String, default: 'save', validator: (v) => ['save', 'open'].includes(v) },
  name: { type: String, default: '' },
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
  width: { type: [Number, String], default: 600 },
})
const emit = defineEmits(['update:name', 'update:location', 'update:place', 'update:modelValue', 'update:view', 'update:search', 'primary', 'secondary', 'close', 'new-folder', 'navigate'])
const views = [{ value: 'icons', icon: 'square-grid-2x2' }, { value: 'list', icon: 'list-bullet' }, { value: 'gallery', icon: 'gallery' }]
const nav = [{ value: 'back', icon: 'chevron-left' }, { value: 'forward', icon: 'chevron-right' }]
const root = ref(null)
</script>

<template>
  <section ref="root" class="s-dialog s-dialog--file" role="dialog" aria-modal="true" :aria-label="mode === 'save' ? 'Save' : 'Open'" :style="{ width: typeof width === 'number' ? width + 'px' : width }" @keydown.esc.stop="emit('close')">
    <div v-if="mode === 'save'" class="s-filepanel__fields">
      <SFormRow label="Save As:"><STextField :model-value="name" style="width: 204px" @update:model-value="emit('update:name', $event)" /></SFormRow>
      <SFormRow label="Where:"><SPopUpButton :model-value="location" :options="locations" @update:model-value="emit('update:location', $event)" /></SFormRow>
    </div>
    <div class="s-filepanel__toolbar">
      <SSegmented action :items="nav" @action="emit('navigate', $event)" />
      <SSegmented :model-value="view" :items="views" @update:model-value="emit('update:view', $event)" />
      <SPopUpButton v-if="mode === 'open'" :model-value="location" :options="locations" :width="220" @update:model-value="emit('update:location', $event)" />
      <span class="s-filepanel__spacer" />
      <SSearchField :model-value="search" style="width: 160px" @update:model-value="emit('update:search', $event)" />
    </div>
    <SFileBrowser class="s-filepanel__browser" :places="places" :place="place" :files="files" :model-value="modelValue" @update:place="emit('update:place', $event)" @update:model-value="emit('update:modelValue', $event)" @open="emit('primary')" />
    <SDialogFooter :primary="primary || (mode === 'save' ? 'Save' : 'Open')" :secondary="secondary" @primary="emit('primary')" @secondary="emit('secondary')">
      <template v-if="mode === 'save'" #leading><SButton variant="secondary" @click="emit('new-folder')">New Folder</SButton></template>
    </SDialogFooter>
  </section>
</template>

<style>
.s-dialog--file { gap: 12px; padding: 20px; overflow: hidden; }
.s-filepanel__fields { display: flex; flex-direction: column; gap: 8px; margin-bottom: 4px; }
.s-filepanel__toolbar { display: flex; align-items: center; gap: 12px; }
.s-filepanel__spacer { flex: 1 1 0; }
.s-filepanel__browser { margin-inline: -20px; }
</style>
