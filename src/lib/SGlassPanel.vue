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
/* The kit's glass differs per theme (Light/Glass/*, Dark/Glass/*): blur radius, saturation and the inner glow. Set once here as variables
   that every glass in the library reads (SThinGlass, SCallout, SDockCallout, toolbar buttons). */
:root, [data-theme='light'] { --s-glow: #ffffff40; --s-fx-regular: blur(10px) saturate(1.6); --s-fx-thick: blur(18px) saturate(1.7); --s-fx-thin: blur(4px) saturate(1.5); }
[data-theme='dark'] { --s-glow: #ffffff17; --s-fx-regular: blur(12px) saturate(1.25); --s-fx-thick: blur(20px) saturate(1.2); --s-fx-thin: blur(5px) saturate(1.4); }
@media (prefers-color-scheme: dark) { :root:not([data-theme]) { --s-glow: #ffffff17; --s-fx-regular: blur(12px) saturate(1.25); --s-fx-thick: blur(20px) saturate(1.2); --s-fx-thin: blur(5px) saturate(1.4); } }
.s-glass { position: relative; isolation: isolate; border-radius: var(--s-glass-r, 12px); }
.s-glass::before {
  content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: -1;
  background: linear-gradient(var(--glass-tint), var(--glass-tint)), #ffffff03;
  box-shadow: inset 0 0 0 1px var(--glass-rim-dark), inset 0 1px 1px var(--glass-rim-light), inset 0 0 3px var(--s-glow), var(--elevation-2);
  backdrop-filter: var(--s-fx-regular); -webkit-backdrop-filter: var(--s-fx-regular);
}
.s-glass--thick::before {
  background: linear-gradient(var(--glass-tint-thick), var(--glass-tint-thick)), #ffffff03;
  box-shadow: inset 0 0 0 1px var(--glass-rim-dark), inset 0 1px 1px var(--glass-rim-light), inset 0 0 3px var(--s-glow), var(--elevation-3);
  backdrop-filter: var(--s-fx-thick); -webkit-backdrop-filter: var(--s-fx-thick);
}
</style>
