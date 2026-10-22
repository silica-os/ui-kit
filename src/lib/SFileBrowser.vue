<script setup>
import SSidebar from './SSidebar.vue'
import SSidebarItem from './SSidebarItem.vue'

/**
 * The file list of the open and save panels (Dialogs/Browser/Files): a column header (Name, Kind, Date Modified), 32 pt rows with
 * every second row striped (the stripes carry on through the empty space), hairlines above and below. `files` is
 * [{ value, label, icon, kind, date }]; `v-model` is the selected file; double click or Enter on a row emits `open`. Height 220
 * as in the kit, set `height` for more.
 */
defineProps({
  files: { type: Array, default: () => [] },
  modelValue: { type: [String, Number], default: null },
  nameTitle: { type: String, default: 'Name' },
  kindTitle: { type: String, default: 'Kind' },
  dateTitle: { type: String, default: 'Date Modified' },
  height: { type: Number, default: 220 },
})
const emit = defineEmits(['update:modelValue', 'open'])
</script>

<template>
  <div class="s-filebrowser" :style="{ height: height + 'px' }">
    <div class="s-filebrowser__head" aria-hidden="true">
      <span class="s-filebrowser__name">{{ nameTitle }}</span><span class="s-filebrowser__kind">{{ kindTitle }}</span><span class="s-filebrowser__date">{{ dateTitle }}</span>
    </div>
    <div class="s-filebrowser__list" role="listbox">
      <SSidebar :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
        <div v-for="f in files" :key="f.value" class="s-filebrowser__row">
          <SSidebarItem :value="f.value" :label="f.label" :icon="f.icon" @dblclick="emit('open', f.value)" @keydown.enter="emit('open', f.value)" />
          <span class="s-filebrowser__kind">{{ f.kind }}</span><span class="s-filebrowser__date">{{ f.date }}</span>
        </div>
      </SSidebar>
    </div>
  </div>
</template>

<style>
.s-filebrowser { position: relative; display: flex; flex-direction: column; min-height: 0; box-sizing: border-box; border-block: 1px solid var(--line-separator); background: var(--surface-raised); color: var(--text-primary); overflow: hidden; }
.s-filebrowser__head { position: relative; flex: none; height: 28px; box-sizing: border-box; border-bottom: 1px solid var(--line-separator); font: var(--font-caption); color: var(--text-secondary); }
.s-filebrowser__head > span { position: absolute; top: 6px; line-height: 14px; }
.s-filebrowser__head .s-filebrowser__name { left: 44px; }
.s-filebrowser__head .s-filebrowser__kind { left: 300px; }
.s-filebrowser__head .s-filebrowser__date { left: 396px; }
.s-filebrowser__list { flex: 1 1 0; min-height: 0; overflow: auto; padding: 0 8px; margin: 0 -8px 0 0; padding-right: 8px;
  /* the stripes: every second 32 pt row, also below the last file */
  background: repeating-linear-gradient(to bottom, transparent 0 32px, color-mix(in srgb, var(--line-separator) 55%, transparent) 32px 64px); }
.s-filebrowser__row { position: relative; }
.s-filebrowser__row > span { position: absolute; top: 7px; line-height: 18px; font: var(--font-body); color: var(--text-secondary); pointer-events: none; white-space: nowrap; }
.s-filebrowser__row > .s-filebrowser__kind { left: 292px; }
.s-filebrowser__row > .s-filebrowser__date { left: 388px; }
.s-filebrowser .s-sidebar { width: 100%; min-height: 0; padding: 0; background: none; }
.s-filebrowser .s-sidebar__row:not(.is-selected) .s-sidebar__icon { color: var(--text-secondary); } /* the kit's rest rows: grey icons, accent only when selected */
</style>
