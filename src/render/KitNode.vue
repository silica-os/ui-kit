<script setup>
import { computed } from 'vue'
import { getMaster, masterNameBySymbolId } from '../kit.js'
import { boxStyle, textStyle, radius, justify } from './style.js'

const props = defineProps({
  node: { type: Object, required: true },
  parent: { type: Object, default: null },
  overrides: { type: Array, default: () => [] },
})

const own = computed(() => {
  const o = {}
  for (const x of props.overrides) if (x.path === props.node.id) o[x.property] = x.value
  return o
})

const frame = computed(() => {
  const f = props.node.frame
  return { left: `${f.x}px`, top: `${f.y}px`, width: `${f.w}px`, height: `${f.h}px` }
})

const hidden = computed(() => own.value.isVisible === '0' || own.value.isVisible === 'false')

const transform = computed(() => {
  const t = props.node.transform
  if (!t) return undefined
  return `${t.rotation ? `rotate(${-t.rotation}deg)` : ''} ${t.flipH ? 'scaleX(-1)' : ''} ${t.flipV ? 'scaleY(-1)' : ''}`.trim()
})

const base = computed(() => ({ position: 'absolute', ...frame.value, transform: transform.value }))

const shapeCss = computed(() => {
  const n = props.node
  const css = { ...base.value, ...boxStyle(n, own.value) }
  if (n.shapeType === 'Oval') css.borderRadius = '50%'
  else if (n.shapeType === 'Rectangle') css.borderRadius = radius(n.style.corners, n.frame.w, n.frame.h)
  return css
})

const isCustom = computed(() => props.node.type === 'ShapePath' && !['Rectangle', 'Oval'].includes(props.node.shapeType))
const svgPaint = computed(() => {
  const st = props.node.style
  const fill = own.value['color:fill-0'] || st.fills[0]?.color || (st.fills[0]?.gradient && st.fills[0].gradient.stops[0][1]) || 'none'
  const b = st.borders[0]
  return { fill, stroke: own.value['color:border-0'] || b?.color || 'none', strokeWidth: b ? b.thickness : 0, opacity: st.opacity }
})

const groupCss = computed(() => ({ ...base.value, ...boxStyle(props.node, own.value), borderRadius: radius(props.node.style.corners, props.node.frame.w, props.node.frame.h) }))

const textCss = computed(() => {
  const n = props.node
  return { ...base.value, ...textStyle(n, own.value), display: 'flex', flexDirection: 'column', justifyContent: justify(n.font.verticalAlign), opacity: n.style.opacity === 1 ? undefined : n.style.opacity }
})
const text = computed(() => own.value.stringValue ?? props.node.text)

const instance = computed(() => {
  const n = props.node
  if (n.type !== 'SymbolInstance') return null
  let name = n.master
  if (own.value.symbolID) name = masterNameBySymbolId(own.value.symbolID) || name
  const master = name && getMaster(name)
  if (!master) return { master: null }
  const nested = [...n.overrides, ...props.overrides.filter((o) => o.path.startsWith(n.id + '/')).map((o) => ({ ...o, path: o.path.slice(n.id.length + 1) }))]
  const sx = n.frame.w / master.frame.w
  const sy = n.frame.h / master.frame.h
  const scale = Math.abs(sx - 1) > 0.001 || Math.abs(sy - 1) > 0.001 ? `scale(${sx}, ${sy})` : ''
  return { master, nested, scale }
})
</script>

<template>
  <template v-if="!hidden">
    <div v-if="node.type === 'ShapePath' && !isCustom" :style="shapeCss" :title="node.name" />
    <svg v-else-if="isCustom" :style="{ ...base, left: 0, top: 0, width: parent ? parent.frame.w + 'px' : '1px', height: parent ? parent.frame.h + 'px' : '1px', overflow: 'visible', pointerEvents: 'none' }">
      <path :d="node.svg" :fill="svgPaint.fill" :stroke="svgPaint.stroke" :stroke-width="svgPaint.strokeWidth" :opacity="svgPaint.opacity" fill-rule="evenodd" />
    </svg>
    <div v-else-if="node.type === 'Text'" :style="textCss"><span>{{ text }}</span></div>
    <div v-else-if="node.type === 'Group'" :style="groupCss">
      <KitNode v-for="(c, i) in node.children" :key="i" :node="c" :parent="node" :overrides="overrides" />
    </div>
    <div v-else-if="node.type === 'Image'" :style="{ ...base, background: 'repeating-conic-gradient(#8884 0 25%, #0000 0 50%) 0 0 / 8px 8px', borderRadius: radius(node.style.corners, node.frame.w, node.frame.h) }" :title="node.name" />
    <div v-else-if="instance" :style="{ ...base, transform: [base.transform, instance.scale].filter(Boolean).join(' ') || undefined, transformOrigin: '0 0' }" :title="node.name">
      <template v-if="instance.master">
        <KitNode v-for="(c, i) in instance.master.children" :key="i" :node="c" :parent="instance.master" :overrides="instance.nested" />
      </template>
    </div>
  </template>
</template>
