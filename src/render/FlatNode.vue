<script setup>
import { computed, inject } from 'vue'
import { boxStyle, textStyle, radius, justify } from './style.js'

const props = defineProps({
  node: { type: Object, required: true },
  parent: { type: Object, default: null },
  opacityMul: { type: Number, default: 1 },
})

const outline = inject('outlineComponents', { value: false })

const base = computed(() => {
  const f = props.node.frame
  const t = props.node.transform
  const tf = t ? `${t.rotation ? `rotate(${-t.rotation}deg)` : ''} ${t.flipH ? 'scaleX(-1)' : ''} ${t.flipV ? 'scaleY(-1)' : ''}`.trim() : ''
  return { position: 'absolute', left: `${f.x}px`, top: `${f.y}px`, width: `${f.w}px`, height: `${f.h}px`, transform: tf || undefined }
})

const withOpacity = (css) => {
  if (props.opacityMul === 1) return css
  css.opacity = (css.opacity ?? 1) * props.opacityMul
  return css
}

const shapeCss = computed(() => {
  const n = props.node
  const css = { ...base.value, ...boxStyle(n) }
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
  const css = { ...base.value, ...boxStyle(n), borderRadius: radius(n.style.corners, n.frame.w, n.frame.h) }
  if (n.scale && (Math.abs(n.scale[0] - 1) > 0.001 || Math.abs(n.scale[1] - 1) > 0.001)) {
    css.transform = [css.transform, `scale(${n.scale[0]}, ${n.scale[1]})`].filter(Boolean).join(' ')
    css.transformOrigin = '0 0'
  }
  if (outline.value && n.component) {
    css.outline = '1px dashed #e5338a'
    css.outlineOffset = '1px'
  }
  return withOpacity(css)
})
const textCss = computed(() => {
  const n = props.node
  return withOpacity({ ...base.value, ...textStyle(n), display: 'flex', flexDirection: 'column', justifyContent: justify(n.font.verticalAlign), opacity: n.style.opacity === 1 ? undefined : n.style.opacity })
})
</script>

<template>
  <template v-if="node.type === 'Cross'">
    <FlatNode :node="node.a" :parent="parent" :opacity-mul="opacityMul * (1 - node.t)" />
    <FlatNode :node="node.b" :parent="parent" :opacity-mul="opacityMul * node.t" />
  </template>
  <div v-else-if="node.type === 'ShapePath' && !isCustom" :style="shapeCss" />
  <svg v-else-if="isCustom" :style="{ position: 'absolute', left: 0, top: 0, width: (parent ? parent.frame.w : 1) + 'px', height: (parent ? parent.frame.h : 1) + 'px', overflow: 'visible', pointerEvents: 'none' }">
    <path :d="node.svg" :fill="paint.fill" :stroke="paint.stroke" :stroke-width="paint.width" :opacity="paint.opacity" fill-rule="evenodd" />
  </svg>
  <div v-else-if="node.type === 'Text'" :style="textCss"><span>{{ node.text }}</span></div>
  <div v-else-if="node.type === 'Group'" :style="groupCss" :title="outline.value && node.component ? node.component : undefined">
    <FlatNode v-for="(c, i) in node.children" :key="i" :node="c" :parent="node" />
  </div>
  <div v-else-if="node.type === 'Image'" :style="{ ...base, background: 'repeating-conic-gradient(#8884 0 25%, #0000 0 50%) 0 0 / 8px 8px' }" />
</template>
