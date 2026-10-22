<script>
let uid = 0
</script>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { calloutPath } from './calloutPath.js'

/**
 * The kit's popover / tooltip bubble as ONE outline: a rounded rectangle whose edge flows into the arrow with rounded transitions.
 * The outline is a single SVG path built from the measured size (ResizeObserver), so the fill (glass tint + backdrop blur, clipped with
 * `clip-path: path()`), the 1 pt inner border, the inner highlights and the shadow all follow the same line, arrow included.
 *  - `edge`: the edge that carries the arrow (`top | bottom | leading | trailing`, `none` = plain rounded box). The arrow adds 8 pt to that side.
 *  - `align`: `start | center | end` (kit: tip 30 pt from the nearer corner) or a number = distance of the tip from the start of the edge.
 *  - `thick`: menu/popover/tooltip material (default); otherwise the thinner control glass.
 * Content goes in the default slot; style the padding with `--s-callout-pad` (default 0) on the element.
 */
const props = defineProps({
  edge: { type: String, default: 'none', validator: (v) => ['none', 'top', 'bottom', 'leading', 'trailing'].includes(v) },
  align: { type: [String, Number], default: 'center' },
  radius: { type: Number, default: 16 },
  arrowWidth: { type: Number, default: 20 },
  arrowHeight: { type: Number, default: 8 },
  thin: Boolean,
  tag: { type: String, default: 'div' },
})
const id = `s-callout-${++uid}`
const root = ref(null)
const size = ref({ w: 0, h: 0 })
let ro = null
onMounted(() => {
  size.value = { w: root.value.offsetWidth, h: root.value.offsetHeight }
  ro = new ResizeObserver(([e]) => {
    const b = e.borderBoxSize?.[0]
    size.value = b ? { w: b.inlineSize, h: b.blockSize } : { w: root.value.offsetWidth, h: root.value.offsetHeight }
  })
  ro.observe(root.value)
})
onBeforeUnmount(() => ro?.disconnect())

const a = computed(() => (props.edge === 'none' ? 0 : props.arrowHeight))
const d = computed(() => calloutPath({ w: size.value.w, h: size.value.h, radius: props.radius, edge: props.edge, pos: props.align, aw: props.arrowWidth, ah: props.arrowHeight }))
const style = computed(() => ({
  paddingTop: props.edge === 'top' ? a.value + 'px' : null, paddingBottom: props.edge === 'bottom' ? a.value + 'px' : null,
  paddingLeft: props.edge === 'leading' ? a.value + 'px' : null, paddingRight: props.edge === 'trailing' ? a.value + 'px' : null,
}))
// the shadow only shows outside the bubble: clip it with an even-odd "big rectangle minus the outline"
const shadowClip = computed(() => {
  const { w, h } = size.value
  const hole = calloutPath({ w, h, radius: props.radius, edge: props.edge, pos: props.align, aw: props.arrowWidth, ah: props.arrowHeight, ox: 64, oy: 64 })
  return hole ? `path(evenodd, 'M0,0H${w + 128}V${h + 128}H0Z${hole}')` : 'none'
})
const glassStyle = computed(() => ({ clipPath: d.value ? `path('${d.value}')` : 'none' }))
</script>

<template>
  <component :is="tag" ref="root" class="s-callout" :class="{ 's-callout--thin': thin }" :style="style">
    <svg v-if="d" class="s-callout__shadow" :style="{ clipPath: shadowClip }" :width="size.w + 128" :height="size.h + 128" :viewBox="`-64 -64 ${size.w + 128} ${size.h + 128}`" aria-hidden="true">
      <defs><filter :id="`${id}-b`" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="16" /></filter></defs>
      <g><g transform="translate(0 12)"><path :d="d" :filter="`url(#${id}-b)`" class="s-callout__shadow-path" /></g></g>
    </svg>
    <div class="s-callout__glass" :style="glassStyle" />
    <svg v-if="d" class="s-callout__rim" :width="size.w" :height="size.h" aria-hidden="true">
      <defs>
        <clipPath :id="`${id}-c`"><path :d="d" /></clipPath>
        <filter :id="`${id}-r`" filterUnits="userSpaceOnUse" :x="-8" :y="-8" :width="size.w + 16" :height="size.h + 16"><feGaussianBlur stdDeviation="0.5" /></filter>
        <filter :id="`${id}-g`" filterUnits="userSpaceOnUse" :x="-8" :y="-8" :width="size.w + 16" :height="size.h + 16"><feGaussianBlur stdDeviation="1.5" /></filter>
      </defs>
      <g :clip-path="`url(#${id}-c)`" fill="none">
        <path :d="d" class="s-callout__glow" stroke-width="6" :filter="`url(#${id}-g)`" />
        <path :d="d" class="s-callout__light" stroke-width="2" transform="translate(0 1)" :filter="`url(#${id}-r)`" />
        <path :d="d" class="s-callout__border" stroke-width="2" />
      </g>
    </svg>
    <div class="s-callout__body"><slot /></div>
  </component>
</template>

<style>
.s-callout { position: relative; isolation: isolate; box-sizing: border-box; }
.s-callout__body { box-sizing: border-box; padding: var(--s-callout-pad, 0); }
.s-callout__shadow, .s-callout__rim { position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none; }
.s-callout__shadow { z-index: -2; left: -64px; top: -64px; }
.s-callout__rim { z-index: -1; }
.s-callout__shadow-path { fill: var(--shadow-3); }
.s-callout__glass {
  position: absolute; inset: 0; z-index: -1; pointer-events: none;
  background: linear-gradient(var(--glass-tint-thick), var(--glass-tint-thick)), #ffffff03;
  backdrop-filter: blur(18px) saturate(1.7); -webkit-backdrop-filter: blur(18px) saturate(1.7);
}
.s-callout--thin .s-callout__glass { background: linear-gradient(var(--glass-tint), var(--glass-tint)), #ffffff03; backdrop-filter: blur(10px) saturate(1.6); -webkit-backdrop-filter: blur(10px) saturate(1.6); }
.s-callout__border { stroke: var(--glass-rim-dark); }
.s-callout__light { stroke: var(--glass-rim-light); }
.s-callout__glow { stroke: #ffffff40; }
</style>
