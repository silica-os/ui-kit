<script setup>
import { computed, inject } from 'vue'
import { boxStyle, textStyle, radius, justify } from './style.js'

const props = defineProps({
  node: { type: Object, required: true },
  parent: { type: Object, default: null },
  opacityMul: { type: Number, default: 1 },
  root: { type: Boolean, default: false },
})

const outline = inject('outlineComponents', { value: false })

/** In a stack the visual order follows the layers' positions in the kit, not the array order. */
const ordered = computed(() => {
  const n = props.node
  const st = n.stack
  if (!st || n.type !== 'Group') return n.children
  const key = st.direction === 0 ? 'x' : 'y'
  const out = n.children.filter((c) => c.ignore)
  const items = n.children.filter((c) => !c.ignore)
  const idx = new Map(items.map((c, i) => [c, i]))
  items.sort((a, b) => a.frame[key] - b.frame[key] || idx.get(a) - idx.get(b))
  return [...out, ...items]
})

const px = (v) => `${v}px`
const pct = (v) => `${(v * 100).toFixed(4)}%`
const JUSTIFY = { 0: 'flex-start', 1: 'center', 2: 'flex-end', 3: 'space-between', 4: 'space-around', 5: 'space-evenly' }
const ALIGN = { 0: 'flex-start', 1: 'center', 2: 'flex-end', 3: 'stretch', 5: 'flex-start' }

/** Absolute placement inside a parent that is not a stack, following the layer's pins (Min 1, Max 4, All 5). */
function axis(start, size, total, pins, sizing, lo, hi, dim) {
  const p = pins ?? 1
  const min = p & 1
  const max = p & 4
  if (min && max) return { [lo]: px(start), [hi]: px(total - start - size) }
  if (max) return { [hi]: px(total - start - size), [dim]: px(size) }
  if (min) return { [lo]: px(start), [dim]: px(size) }
  return { [lo]: pct(start / total), [dim]: sizing === 3 ? pct(size / total) : px(size) }
}

/** Size of a stack item along one axis from its sizing (0 Fixed, 1 Fit, 2 Fill, 3 Relative). */
function itemAxis(sizing, size, isMain, dim, fitCss) {
  if (sizing === 2) return isMain ? { flex: '1 1 0', [dim === 'width' ? 'minWidth' : 'minHeight']: 0 } : { alignSelf: 'stretch' }
  if (sizing === 1 && fitCss) return { [dim]: fitCss }
  return { [dim]: px(size) }
}

const placement = computed(() => {
  const n = props.node
  const f = n.frame
  const par = props.parent
  const tf = n.transform
  const transform = tf ? `${tf.rotation ? `rotate(${-tf.rotation}deg)` : ''} ${tf.flipH ? 'scaleX(-1)' : ''} ${tf.flipV ? 'scaleY(-1)' : ''}`.trim() || undefined : undefined
  if (props.root) return { position: 'relative', width: px(f.w), height: px(f.h) }
  if (par && par.stack && !n.ignore) {
    const row = par.stack.direction === 0
    const fit = n.type === 'Text' ? 'max-content' : n.type === 'Group' && n.stack ? 'auto' : null
    return {
      position: 'relative', flex: 'none', boxSizing: 'border-box', transform,
      ...itemAxis(n.hs, f.w, row, 'width', fit),
      ...itemAxis(n.vs, f.h, !row, 'height', fit),
    }
  }
  const o = (par && (par.orig || par.frame)) || f
  return { position: 'absolute', transform, ...axis(f.x, f.w, o.w, n.hp, n.hs, 'left', 'right', 'width'), ...axis(f.y, f.h, o.h, n.vp, n.vs, 'top', 'bottom', 'height') }
})

const withOpacity = (css) => {
  if (props.opacityMul === 1) return css
  css.opacity = (css.opacity ?? 1) * props.opacityMul
  return css
}

const shapeCss = computed(() => {
  const n = props.node
  const css = { ...placement.value, ...boxStyle(n) }
  if (n.shapeType === 'Oval') css.borderRadius = '50%'
  else if (n.shapeType === 'Rectangle') css.borderRadius = radius(n.style.corners, n.frame.w, n.frame.h)
  return withOpacity(css)
})
const isCustom = computed(() => props.node.type === 'ShapePath' && !['Rectangle', 'Oval'].includes(props.node.shapeType))
const paint = computed(() => {
  const st = props.node.style
  const f = st.fills[0]
  const b = st.borders[0]
  return { fill: f ? f.color || f.gradient.stops[0][1] : 'none', stroke: b ? b.color : 'none', width: b ? b.thickness : 0, opacity: st.opacity * props.opacityMul }
})
const groupCss = computed(() => {
  const n = props.node
  const css = { ...placement.value, ...boxStyle(n), borderRadius: radius(n.style.corners, n.frame.w, n.frame.h), boxSizing: 'border-box' }
  const st = n.stack
  if (st) {
    const pad = typeof st.padding === 'object' ? st.padding : { top: st.padding, bottom: st.padding, left: st.padding, right: st.padding }
    Object.assign(css, {
      display: 'flex', flexDirection: st.direction === 0 ? 'row' : 'column', gap: px(st.gap || 0),
      justifyContent: JUSTIFY[st.justify] || 'flex-start', alignItems: ALIGN[st.align] || 'flex-start',
      padding: `${pad.top || 0}px ${pad.right || 0}px ${pad.bottom || 0}px ${pad.left || 0}px`,
    })
  }
  if (outline.value && n.component) {
    css.outline = '1px dashed #e5338a'
    css.outlineOffset = '1px'
  }
  return withOpacity(css)
})
const textCss = computed(() => {
  const n = props.node
  return withOpacity({ ...placement.value, ...textStyle(n), display: 'flex', flexDirection: 'column', justifyContent: justify(n.font.verticalAlign), opacity: n.style.opacity === 1 ? undefined : n.style.opacity, userSelect: 'none', WebkitUserSelect: 'none' })
})
</script>

<template>
  <template v-if="node.type === 'Cross'">
    <FlatNode :node="node.a" :parent="parent" :opacity-mul="opacityMul * (1 - node.t)" />
    <FlatNode :node="node.b" :parent="parent" :opacity-mul="opacityMul * node.t" />
  </template>
  <div v-else-if="node.type === 'ShapePath' && !isCustom" :style="shapeCss" />
  <svg v-else-if="isCustom" :style="{ position: 'absolute', left: 0, top: 0, width: ((parent && (parent.orig || parent.frame)) ? (parent.orig || parent.frame).w : 1) + 'px', height: ((parent && (parent.orig || parent.frame)) ? (parent.orig || parent.frame).h : 1) + 'px', overflow: 'visible', pointerEvents: 'none' }">
    <path :d="node.svg" :fill="paint.fill" :stroke="paint.stroke" :stroke-width="paint.width" :opacity="paint.opacity" fill-rule="evenodd" />
  </svg>
  <div v-else-if="node.type === 'Text'" :style="textCss"><span>{{ node.text }}</span></div>
  <div v-else-if="node.type === 'Group'" :style="groupCss" :title="outline.value && node.component ? node.component : undefined">
    <FlatNode v-for="(c, i) in ordered" :key="i" :node="c" :parent="node" />
  </div>
  <div v-else-if="node.type === 'Image'" :style="{ ...placement, background: '#8882', borderRadius: '22%', boxShadow: 'inset 0 0 0 1px #8883' }" title="Bitmap (not exported)" />
</template>
