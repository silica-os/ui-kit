<script setup>
import SControlModule from './SControlModule.vue'

/**
 * The Control Center grid: 292 pt wide, four 64 pt columns 12 pt apart. Drop <SControlModule>s in the default slot (toggles take two
 * columns, tiles one, sliders four, the now-playing module two columns and two rows). The `footer` slot is the Edit Controls pill.
 */
defineProps({ edit: { type: String, default: 'Edit Controls' } })
const emit = defineEmits(['edit'])
</script>

<template>
  <div class="s-cpanel">
    <div class="s-cpanel__grid"><slot /></div>
    <div v-if="edit || $slots.footer" class="s-cpanel__footer"><slot name="footer"><SControlModule kind="pill" :title="edit" @click="emit('edit')" /></slot></div>
  </div>
</template>

<style>
.s-cpanel { display: flex; flex-direction: column; align-items: center; gap: 16px; width: 292px; }
.s-cpanel__grid { display: grid; grid-template-columns: repeat(4, 64px); grid-auto-rows: 64px; gap: 12px; }
.s-cpanel__grid > .s-cmod--toggle { grid-column: span 2; width: auto; }
.s-cpanel__grid > .s-cmod--slider { grid-column: span 4; width: auto; }
.s-cpanel__grid > .s-cmod--playing { grid-column: span 2; grid-row: span 2; width: auto; height: auto; }
.s-cpanel__grid > .s-cmod--slider .s-cmod__title--top { width: calc(100% - 92px); }
</style>
