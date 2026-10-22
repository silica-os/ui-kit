<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { calloutPath, ARROW_H } from './dockCallout.js'

/**
 * The glass callout of the Dock (label bubble above a tile, tile menu): thick glass cut to a single path that includes the
 * arrow pointing down at the tile. The content goes in the slot; the arrow is centred and sits below it.
 */
defineProps({ radius: { type: Number, default: 8 }, inset: { type: Number, default: 0 } })
const root = ref(null)
const w = ref(64), h = ref(34)
let ro
function measure() { if (root.value) { w.value = root.value.offsetWidth; h.value = root.value.offsetHeight } }
onMounted(() => { measure(); ro = new ResizeObserver(measure); ro.observe(root.value) })
onBeforeUnmount(() => ro?.disconnect())
const P = 64 // room around the shape for the drop shadow
</script>

<template>
  <div ref="root" class="s-dock-callout" :style="{ '--s-dock-callout-arrow': ARROW_H + 'px' }">
    <i class="s-dock-callout__shadow" aria-hidden="true" :style="{ clipPath: `path(evenodd, 'M0,0H${w + 2 * P}V${h + 2 * P}H0Z ${calloutPath(w, h, radius).replace(/(-?[\d.]+),(-?[\d.]+)/g, (m, x, y) => `${+x + P},${+y + P}`)}')` }"><svg :width="w + 2 * P" :height="h + 2 * P"><path :d="calloutPath(w, h, radius)" :transform="`translate(${P} ${P})`" /></svg></i>
    <i class="s-dock-callout__glass" aria-hidden="true" :style="{ clipPath: `path('${calloutPath(w, h, radius)}')` }" />
    <svg class="s-dock-callout__rim" aria-hidden="true" :width="w" :height="h" :style="{ clipPath: `path('${calloutPath(w, h, radius)}')` }"><path class="hi" :d="calloutPath(w, h, radius)" transform="translate(0 1)" /><path class="rim" :d="calloutPath(w, h, radius)" /></svg>
    <div class="s-dock-callout__body" :style="inset ? { padding: inset + 'px' } : null"><slot /></div>
  </div>
</template>

<style>
.s-dock-callout { position: relative; width: max-content; padding-bottom: var(--s-dock-callout-arrow); box-sizing: content-box; }
.s-dock-callout__body { position: relative; }
.s-dock-callout__shadow { position: absolute; left: -64px; top: -64px; pointer-events: none; }
.s-dock-callout__shadow svg { display: block; overflow: visible; filter: drop-shadow(var(--elevation-3)); }
.s-dock-callout__shadow path { fill: #000; }
.s-dock-callout__glass {
  position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(var(--glass-tint-thick), var(--glass-tint-thick)), #ffffff03;
  backdrop-filter: var(--s-fx-thick); -webkit-backdrop-filter: var(--s-fx-thick);
}
.s-dock-callout__rim { position: absolute; left: 0; top: 0; pointer-events: none; overflow: visible; fill: none; }
.s-dock-callout__rim .rim { stroke: var(--glass-rim-dark); stroke-width: 2; }
.s-dock-callout__rim .hi { stroke: var(--glass-rim-light); stroke-width: 2; }
</style>
