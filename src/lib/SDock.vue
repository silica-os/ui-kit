<script setup>
import SThinGlass from './SThinGlass.vue'

/**
 * The dock: a shelf of thin glass (80 pt, 24 pt corners) holding <SDockTile>s and <SDockSeparator>s. Pass `label` on a tile to get its
 * tooltip. Put it over a wallpaper or the Stage glass background to see the blur.
 */
</script>

<template><SThinGlass class="s-dock" :radius="24" role="toolbar" aria-label="Dock"><slot /></SThinGlass></template>

<style>
.s-dock { display: inline-flex; align-items: flex-start; height: 80px; padding: 0 8px; box-sizing: border-box; }
</style>
