<script setup>
import SThinGlass from './SThinGlass.vue'
import SDockTile from './SDockTile.vue'
import SDockSeparator from './SDockSeparator.vue'

/**
 * The Dock shelf (kit Dock/Shelf): thin glass, 80 pt high, 24 pt corners, 8 pt side padding, hugging its tiles
 * (64 x 80 <SDockTile>, 28 x 80 <SDockSeparator>). Content comes from the default slot or from `items`:
 * [{ label, glyph, color, running, missing, badge, separator: true }]. Put it over a wallpaper to see the blur.
 */
defineProps({ items: { type: Array, default: () => [] } })
const emit = defineEmits(['select'])
</script>

<template>
  <SThinGlass class="s-dock" :radius="24" role="toolbar" aria-label="Dock">
    <template v-for="(it, i) in items" :key="it.key ?? it.label ?? i">
      <SDockSeparator v-if="it.separator" />
      <SDockTile v-else v-bind="it" @click="emit('select', it)" />
    </template>
    <slot />
  </SThinGlass>
</template>

<style>
.s-dock { display: inline-flex; align-items: flex-start; height: 80px; padding: 0 8px; box-sizing: border-box; }
[data-theme='dark'] .s-dock.s-glass--thin::before { backdrop-filter: blur(5px) saturate(1.4); -webkit-backdrop-filter: blur(5px) saturate(1.4); }
@media (prefers-color-scheme: dark) { :root:not([data-theme]) .s-dock.s-glass--thin::before { backdrop-filter: blur(5px) saturate(1.4); -webkit-backdrop-filter: blur(5px) saturate(1.4); } }
</style>
