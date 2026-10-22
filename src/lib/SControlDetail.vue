<script setup>
import SThinGlass from './SThinGlass.vue'

/**
 * The detail pane that opens from a Control Center module (312 pt, thin glass, 16 pt corners): a title with an optional control at
 * its right (`#accessory`, usually an <SSwitch>), then rows (<SControlRow>) and <SControlSeparator>-style rules in the default slot.
 */
defineProps({ title: { type: String, default: '' } })
</script>

<template>
  <SThinGlass class="s-cdetail" :radius="16" role="region" :aria-label="title">
    <header class="s-cdetail__head"><h2 class="s-cdetail__title">{{ title }}</h2><slot name="accessory" /></header>
    <hr class="s-cdetail__rule" />
    <div class="s-cdetail__body"><slot /></div>
  </SThinGlass>
</template>

<style>
.s-cdetail { box-sizing: border-box; width: 312px; padding: 12px 16px 8px; color: var(--text-primary); font: var(--font-body); }
.s-cdetail__head { display: flex; align-items: flex-start; justify-content: space-between; height: 24px; margin-bottom: 12px; }
.s-cdetail__title { margin: 0; font: var(--font-title-3); }
.s-cdetail__rule, .s-cdetail__body hr { height: 1px; margin: 0; border: 0; background: var(--line-separator); }
.s-cdetail__body { display: flex; flex-direction: column; }
/* the kit's rhythm: a rule sits 4 pt under a row of text (8 pt under a slider or an item list) and 3 pt above the next row */
.s-cdetail__body hr { margin: 4px 0 3px; }
.s-cdetail__rule { margin: 0 0 3px; }
.s-cdetail__body > .s-crow--slider:first-child { margin-top: 4px; }
.s-cdetail__body > :is(.s-crow--slider, .s-crow--item) + hr { margin-top: 8px; }
</style>
