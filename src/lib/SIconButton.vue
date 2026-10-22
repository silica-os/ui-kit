<script setup>
import SIcon from './SIcon.vue'

/** Button with only a glyph. `icon` is a Silica Symbols name; `label` is its accessible name. */
defineProps({
  icon: { type: String, required: true },
  label: { type: String, default: '' },
  shape: { type: String, default: 'round', validator: (v) => ['round', 'square'].includes(v) },
  size: { type: String, default: 'regular', validator: (v) => ['mini', 'small', 'regular', 'large'].includes(v) },
  disabled: Boolean,
  force: { type: String, default: '' },
})
const GLYPH = { mini: 14, small: 16, regular: 20, large: 20 }
</script>

<template>
  <button class="s-control s-iconbutton" :class="[`s-iconbutton--${shape}`, `s-iconbutton--${size}`, force && `is-${force}`]" type="button" :aria-label="label || icon" :disabled="disabled">
    <slot><SIcon :name="icon" :size="GLYPH[size]" /></slot>
  </button>
</template>

<style>
.s-iconbutton {
  --s-d: var(--control-regular); --s-r: calc(var(--s-d) / 2);
  position: relative; display: inline-grid; place-items: center; flex: none; padding: 0; border: 0; margin: 0; cursor: pointer;
  width: var(--s-d); height: var(--s-d); border-radius: var(--s-r); background: none; color: var(--text-primary);
}
.s-iconbutton--mini { --s-d: var(--control-mini); } .s-iconbutton--small { --s-d: var(--control-small); } .s-iconbutton--large { --s-d: var(--control-large); }
.s-iconbutton--square.s-iconbutton--mini { --s-r: 6px; } .s-iconbutton--square.s-iconbutton--small { --s-r: 7px; }
.s-iconbutton--square.s-iconbutton--regular { --s-r: 9px; } .s-iconbutton--square.s-iconbutton--large { --s-r: 10px; }
.s-iconbutton::before, .s-iconbutton::after { content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; transition: background var(--fade-quick), box-shadow var(--fade-quick); }
.s-iconbutton::before { background: var(--surface-control); box-shadow: inset 0 0 0 1px var(--line-border), var(--elevation-1); }
.s-iconbutton > * { position: relative; z-index: 1; }
/* held down: the button grows until the pointer is released (as on macOS) */
.s-iconbutton { transition: transform var(--spring-snappy); }
.s-iconbutton:is(:active, .is-pressed) { transform: scale(var(--press-scale-icon, 1.05)); }
.s-iconbutton:is(:hover, .is-hover):not(:active, .is-pressed)::after { background: var(--accent-amalfi-soft); }
.s-iconbutton:is(:active, .is-pressed)::before { background: var(--surface-control-pressed); }
.s-iconbutton:is(:focus-visible, .is-focus)::after { box-shadow: 0 0 0 3px var(--line-focus); }

/* reduced motion: springs become the short fade (same as --fade-quick), no overshoot or scale */
@media (prefers-reduced-motion: reduce) {
  .s-iconbutton { transition-duration: 150ms !important; transition-timing-function: cubic-bezier(0.2, 0, 0, 1) !important; }
}
@media (prefers-reduced-motion: reduce) { .s-iconbutton:is(:active, .is-pressed) { transform: none; } }
</style>
