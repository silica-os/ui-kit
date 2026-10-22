<script setup>
/**
 * The kit's glass surface: tint over a backdrop blur, rim light, drop shadow. Used by segmented tracks, menus, popovers,
 * tooltips and the glass alert. `thick` is the menu/popover material, `regular` the control one. Content goes in the slot.
 */
defineProps({
  tag: { type: String, default: 'div' },
  thick: Boolean,
  radius: { type: [Number, String], default: 12 },
})
</script>

<template>
  <component :is="tag" class="s-glass" :class="{ 's-glass--thick': thick }" :style="{ '--s-glass-r': typeof radius === 'number' ? radius + 'px' : radius }"><slot /></component>
</template>

<style>
.s-glass { position: relative; isolation: isolate; border-radius: var(--s-glass-r, 12px); }
.s-glass::before {
  content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: -1;
  background: linear-gradient(var(--glass-tint), var(--glass-tint)), #ffffff03;
  box-shadow: inset 0 0 0 1px var(--glass-rim-dark), inset 0 1px 1px var(--glass-rim-light), inset 0 0 3px #ffffff40, var(--elevation-2);
  backdrop-filter: blur(10px) saturate(1.6); -webkit-backdrop-filter: blur(10px) saturate(1.6);
}
.s-glass--thick::before {
  background: linear-gradient(var(--glass-tint-thick), var(--glass-tint-thick)), #ffffff03;
  box-shadow: inset 0 0 0 1px var(--glass-rim-dark), inset 0 1px 1px var(--glass-rim-light), inset 0 0 3px #ffffff40, var(--elevation-3);
  backdrop-filter: blur(18px) saturate(1.7); -webkit-backdrop-filter: blur(18px) saturate(1.7);
}
</style>
