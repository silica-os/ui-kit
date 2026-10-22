<script setup>
import SSidebar from './SSidebar.vue'
import SSidebarGroup from './SSidebarGroup.vue'
import SSidebarItem from './SSidebarItem.vue'

/**
 * The two-pane file browser of the open and save panels: places on the left (sidebar rows), the files of the selected place on the right.
 * `places` is [{ value, label, icon }], `files` [{ value, label, icon }]; `v-model:place` and `v-model` (the selected file); double
 * click or Enter on a file emits `open`. Height 152 as in the kit, set `height` for more.
 */
defineProps({
  places: { type: Array, default: () => [] },
  place: { type: [String, Number], default: null },
  files: { type: Array, default: () => [] },
  modelValue: { type: [String, Number], default: null },
  placesTitle: { type: String, default: 'Favourites' },
  height: { type: Number, default: 152 },
})
const emit = defineEmits(['update:place', 'update:modelValue', 'open'])
</script>

<template>
  <div class="s-filebrowser" :style="{ height: height + 'px' }">
    <div class="s-filebrowser__places">
      <SSidebar :model-value="place" @update:model-value="emit('update:place', $event)">
        <SSidebarGroup :title="placesTitle"><SSidebarItem v-for="p in places" :key="p.value" v-bind="p" /></SSidebarGroup>
      </SSidebar>
    </div>
    <div class="s-filebrowser__files" role="listbox">
      <SSidebar :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
        <SSidebarItem v-for="f in files" :key="f.value" v-bind="f" @dblclick="emit('open', f.value)" @keydown.enter="emit('open', f.value)" />
      </SSidebar>
    </div>
  </div>
</template>

<style>
.s-filebrowser { display: flex; gap: 16px; min-height: 0; }
.s-filebrowser__places, .s-filebrowser__files { box-sizing: border-box; overflow: auto; padding: 8px; box-shadow: inset 0 0 0 1px var(--line-border); }
.s-filebrowser__places { flex: none; width: 216px; background: var(--surface-sidebar); border-radius: 14px; }
.s-filebrowser__files { flex: 1 1 0; min-width: 0; background: var(--surface-raised); border-radius: 12px; }
.s-filebrowser .s-sidebar { width: 100%; min-height: 0; padding: 0; background: none; }
.s-filebrowser .s-sidebar__group { margin-bottom: 0; }
</style>
