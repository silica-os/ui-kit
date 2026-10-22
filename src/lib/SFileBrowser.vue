<script setup>
import SSidebar from './SSidebar.vue'
import SSidebarGroup from './SSidebarGroup.vue'
import SSidebarItem from './SSidebarItem.vue'

/**
 * The file browser of the open and save panels (Dialogs/Browser/Files): a sidebar of places on the left, flush with the edges, and
 * the file list with a column header on the right; hairlines above and below. `places` is [{ value, label, icon, badge }], `files`
 * [{ value, label, icon, date }]; `v-model:place` and `v-model` (the selected file); double click or Enter on a file emits `open`.
 * Height 192 as in the kit, set `height` for more.
 */
defineProps({
  places: { type: Array, default: () => [] },
  place: { type: [String, Number], default: null },
  files: { type: Array, default: () => [] },
  modelValue: { type: [String, Number], default: null },
  placesTitle: { type: String, default: 'Places' },
  nameTitle: { type: String, default: 'Name' },
  dateTitle: { type: String, default: 'Date Modified' },
  height: { type: Number, default: 192 },
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
    <div class="s-filebrowser__files">
      <div class="s-filebrowser__head" aria-hidden="true"><span class="s-filebrowser__name">{{ nameTitle }}</span><span class="s-filebrowser__date">{{ dateTitle }}</span></div>
      <div class="s-filebrowser__list" role="listbox">
        <SSidebar :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
          <div v-for="f in files" :key="f.value" class="s-filebrowser__row">
            <SSidebarItem :value="f.value" :label="f.label" :icon="f.icon" @dblclick="emit('open', f.value)" @keydown.enter="emit('open', f.value)" />
            <span v-if="f.date" class="s-filebrowser__date">{{ f.date }}</span>
          </div>
        </SSidebar>
      </div>
    </div>
  </div>
</template>

<style>
.s-filebrowser { display: flex; min-height: 0; box-sizing: border-box; border-block: 1px solid var(--line-separator); background: var(--surface-raised); color: var(--text-primary); }
.s-filebrowser__places { flex: none; box-sizing: border-box; width: 193px; padding: 8px; overflow: auto; background: var(--surface-sidebar); border-right: 1px solid var(--line-separator); }
.s-filebrowser__files { flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; }
.s-filebrowser__head { position: relative; flex: none; height: 28px; box-sizing: border-box; border-bottom: 1px solid var(--line-separator); font: var(--font-caption); color: var(--text-secondary); }
.s-filebrowser__head > span { position: absolute; top: 7px; line-height: 14px; }
.s-filebrowser__head .s-filebrowser__name { left: 44px; }
.s-filebrowser__head .s-filebrowser__date { left: 277px; }
.s-filebrowser__list { flex: 1 1 0; min-height: 0; overflow: auto; padding: 7px 8px 8px; }
.s-filebrowser__row { position: relative; }
.s-filebrowser__row > .s-filebrowser__date { position: absolute; left: 269px; top: 7px; font: var(--font-body); line-height: 18px; color: var(--text-secondary); pointer-events: none; white-space: nowrap; }
.s-filebrowser .s-sidebar { width: 100%; min-height: 0; padding: 0; background: none; }
.s-filebrowser .s-sidebar__group { margin-bottom: 0; }
.s-filebrowser .s-sidebar__row:not(.is-selected) .s-sidebar__icon { color: var(--text-secondary); } /* the kit's rest rows: grey icons, accent only when selected */
</style>
