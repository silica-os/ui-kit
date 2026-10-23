<script setup>
import { computed, ref } from 'vue'
import { useBoxSize } from './useBoxSize.js'
import { smoothPolygonPath, smoothRectPath } from './smoothPath.js'

let uid = 0

/**
 * The kit's glass surface: tint over a backdrop blur, rim light, drop shadow. Used by segmented tracks, menus, popovers,
 * tooltips and the glass alert. `thick` is the menu/popover material, `regular` the control one. Content goes in the slot.
 *  - `smooth`: draw the surface as the kit does, with continuous corners (smoothing 0.6): a clipped fill, a rim and a shadow that follow
 *    one smooth outline (see smoothPath.js). The default draws a plain rounded box. The outline is also published as `--s-clip`
 *    (`path('…')`) for children that must follow it, e.g. `clip-path: var(--s-clip)`.
 *  - `raised`: the solid raised surface of dialogs and alerts (surface-raised fill, 1 pt border, large shadow) instead of glass.
 */
const props = defineProps({
  tag: { type: String, default: 'div' },
  thick: Boolean,
  radius: { type: [Number, String], default: 12 },
  smooth: Boolean,
  raised: Boolean,
  /** no surface at all: just the element (a full-screen window has no frame) */
  bare: Boolean,
  /** no drop shadow (boxes that sit on a surface) */
  flat: Boolean,
  smoothing: { type: Number, default: 0.6 },
})
const id = `s-glass-${++uid}`
const root = ref(null)
const size = useBoxSize(root)
const r = computed(() => (typeof props.radius === 'number' ? props.radius : parseFloat(props.radius) || 12))
const d = computed(() => (props.smooth ? smoothRectPath(size.value.w, size.value.h, r.value, props.smoothing) : ''))
const strong = computed(() => props.thick || props.raised)
const shadowClip = computed(() => {
  // the shadow shows only outside the surface: "big rectangle minus the outline" (even-odd), the outline moved by the 64 pt margin
  const { w, h } = size.value
  if (!d.value) return 'none'
  const hole = smoothPolygonPath([[64, 64, r.value], [w + 64, 64, r.value], [w + 64, h + 64, r.value], [64, h + 64, r.value]], props.smoothing)
  return `path(evenodd, 'M0,0H${w + 128}V${h + 128}H0Z${hole}')`
})
const style = computed(() => ({ '--s-glass-r': r.value + 'px', ...(d.value ? { '--s-clip': `path('${d.value}')` } : null) }))
const shadow = computed(() => (strong.value ? { dy: 12, sd: 16 } : { dy: 4, sd: 6 }))
</script>

<template>
  <component :is="tag" ref="root" class="s-glass" :class="{ 's-glass--thick': thick, 's-glass--raised': raised, 's-glass--smooth': smooth, 's-glass--bare': bare }" :style="style">
    <template v-if="smooth && d">
      <svg v-if="!flat" class="s-glass__shadow" :style="{ clipPath: shadowClip }" :width="size.w + 128" :height="size.h + 128" :viewBox="`-64 -64 ${size.w + 128} ${size.h + 128}`" aria-hidden="true">
        <defs><filter :id="`${id}-b`" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur :stdDeviation="shadow.sd" /></filter></defs>
        <g :transform="`translate(0 ${shadow.dy})`"><path :d="d" :filter="`url(#${id}-b)`" class="s-glass__shadow-path" /></g>
      </svg>
      <div class="s-glass__fill" :style="{ clipPath: `path('${d}')` }" />
      <svg class="s-glass__rim" :width="size.w" :height="size.h" aria-hidden="true">
        <defs>
          <clipPath :id="`${id}-c`"><path :d="d" /></clipPath>
          <filter :id="`${id}-r`" filterUnits="userSpaceOnUse" :x="-8" :y="-8" :width="size.w + 16" :height="size.h + 16"><feGaussianBlur stdDeviation="0.5" /></filter>
          <filter :id="`${id}-g`" filterUnits="userSpaceOnUse" :x="-8" :y="-8" :width="size.w + 16" :height="size.h + 16"><feGaussianBlur stdDeviation="1.5" /></filter>
        </defs>
        <g :clip-path="`url(#${id}-c)`" fill="none">
          <template v-if="!raised">
            <path :d="d" class="s-glass__glow" stroke-width="6" :filter="`url(#${id}-g)`" />
            <path :d="d" class="s-glass__light" stroke-width="2" transform="translate(0 1)" :filter="`url(#${id}-r)`" />
          </template>
          <path :d="d" class="s-glass__border" stroke-width="2" />
        </g>
      </svg>
    </template>
    <slot />
  </component>
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
/* smooth: the layers are real elements (the outline is an SVG path), the legacy ::before is off */
.s-glass--smooth, .s-glass--bare { border-radius: 0; }
.s-glass.s-glass--smooth::before, .s-glass.s-glass--bare::before { content: none; }
.s-glass__shadow, .s-glass__rim { position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none; }
.s-glass__shadow { z-index: -2; left: -64px; top: -64px; }
.s-glass__rim { z-index: -1; }
.s-glass__shadow-path { fill: var(--shadow-2); }
.s-glass--thick .s-glass__shadow-path, .s-glass--raised .s-glass__shadow-path { fill: var(--shadow-3); }
.s-glass__fill {
  position: absolute; inset: 0; z-index: -1; pointer-events: none;
  background: linear-gradient(var(--glass-tint), var(--glass-tint)), #ffffff03;
  backdrop-filter: var(--s-fx-regular); -webkit-backdrop-filter: var(--s-fx-regular);
}
.s-glass--thick .s-glass__fill { background: linear-gradient(var(--glass-tint-thick), var(--glass-tint-thick)), #ffffff03; backdrop-filter: var(--s-fx-thick); -webkit-backdrop-filter: var(--s-fx-thick); }
.s-glass--raised .s-glass__fill { background: var(--surface-raised); backdrop-filter: none; -webkit-backdrop-filter: none; }
.s-glass__border { stroke: var(--glass-rim-dark); }
.s-glass--raised .s-glass__border { stroke: var(--line-border); }
.s-glass--raised .s-glass__rim { z-index: 20; } /* a solid surface's border sits above regions that paint to the edge (window sidebars, title bars) */
.s-glass__light { stroke: var(--glass-rim-light); }
.s-glass__glow { stroke: var(--s-glow, #ffffff40); }
</style>
