<script setup>
import SMenuBarItem from './SMenuBarItem.vue'

/**
 * An item of the status cluster (right side of the menu bar): a system glyph (`icon`: wifi, bluetooth, volume, search,
 * control-center…), or text (`label`: the clock "Fri 16 Oct  09:41", battery "84%") with an optional glyph. A menu in the default
 * slot opens right-aligned under it. Reuse of <SMenuBarItem>.
 */
defineProps({
  icon: { type: String, default: '' },
  label: { type: String, default: '' },
  value: { type: String, default: '' },
})
</script>

<template>
  <SMenuBarItem :icon="icon" :label="label" :value="value || icon || label" class="s-status" align="end" :menu="!!$slots.default"><slot /></SMenuBarItem>
</template>

<style>
.s-status .s-mbitem__label { font: var(--font-body-emphasis); font-weight: 600; }
.s-status .s-mbitem { min-width: 36px; }
.s-status .s-mbitem:not(:has(.s-icon)) { min-width: 120px; }
.s-status .s-mbitem:has(.s-mbitem__label):has(.s-icon) .s-mbitem__label { min-width: 32px; text-align: right; }
.s-status.s-mbwrap > .s-mbwrap__menu { top: calc(100% + 6px); }
</style>
