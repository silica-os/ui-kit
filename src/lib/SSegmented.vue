<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, provide, ref, watch } from 'vue'
import SGlassPanel from './SGlassPanel.vue'
import SSegment from './SSegment.vue'

/**
 * Segmented control on a glass capsule.
 *  - single select (default): `v-model` is the selected value, a thumb slides to it; arrows move and select.
 *  - `multiple`: `v-model` is an array of selected values.
 *  - `action`: no selection, each item just fires `action(value)` (back/forward pairs, formatting buttons).
 * Items come from `items` ([{ value, label, icon, disabled }]) and/or <SSegment> children. An item with both an icon and a label
 * stacks them (the 96 x 44 "icon + label" item) unless `stacked` is set explicitly.
 */
const props = defineProps({
  modelValue: { type: [String, Number, Boolean, Array], default: null },
  items: { type: Array, default: () => [] },
  size: { type: String, default: 'regular', validator: (v) => ['mini', 'small', 'regular', 'large'].includes(v) },
  multiple: Boolean,
  action: Boolean,
  stacked: { type: Boolean, default: undefined },
  disabled: Boolean,
  /** pressed shows the enlarged lens thumb without the pointer */
  force: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue', 'action'])

const sizes = {
  // control height, item height, font, glyph size, action item width (text / icon), action separator height
  mini: { h: 20, item: 12, font: 'var(--font-caption)', icon: 14, aw: 40, ai: 20, sep: 12 },
  small: { h: 24, item: 16, font: 'var(--font-label)', icon: 16, aw: 44, ai: 24, sep: 12 },
  regular: { h: 28, item: 20, font: 'var(--font-body)', icon: 20, aw: 52, ai: 28, sep: 16 },
  large: { h: 32, item: 24, font: 'var(--font-body)', icon: 20, aw: 56, ai: 36, sep: 16 },
}
const isStacked = computed(() => props.stacked ?? props.items.some((i) => i.icon && i.label))
const m = computed(() => {
  const s = sizes[props.size]
  const iconOnly = props.items.length > 0 && props.items.every((i) => i.icon && !i.label)
  if (props.action) return { ...s, h: props.size === 'large' ? 36 : s.h, item: props.size === 'large' ? 36 : s.h, w: iconOnly ? s.ai : s.aw }
  if (isStacked.value) return { ...s, h: 52, item: 44, w: 96, font: 'var(--font-caption)', icon: 20 }
  const w = iconOnly ? s.item + 8 : { mini: 44, small: 56, regular: 72, large: 88 }[props.size]
  return { ...s, w }
})
const style = computed(() => ({
  '--seg-h': m.value.h + 'px', '--seg-item-h': m.value.item + 'px', '--seg-w': m.value.w + 'px', '--seg-font': m.value.font,
  '--seg-pad': props.action ? '0px' : '4px', '--seg-action-inset': props.action ? '4px' : '0px', '--seg-sep-h': m.value.sep + 'px',
}))
const radius = computed(() => m.value.h / 2)

const values = computed(() => (props.modelValue === null ? [] : Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue]))
function isSelected(v) { return values.value.includes(v) }
function select(v) {
  if (props.disabled) return
  if (props.action) return emit('action', v)
  if (props.multiple) emit('update:modelValue', isSelected(v) ? values.value.filter((x) => x !== v) : [...values.value, v])
  else if (!isSelected(v)) emit('update:modelValue', v)
}
const pressedValue = ref(null)
function press(v, on) { pressedValue.value = on && !props.action ? v : null; nextTick(measure) }

const root = ref(null)
const rootEl = () => root.value?.$el
const tabStop = computed(() => {
  const all = enabledValues()
  return all.find((v) => isSelected(v)) ?? all[0]
})
function enabledValues() { return [...(rootEl()?.querySelectorAll('.s-segment:not(:disabled)') ?? [])].map((b) => parseValue(b)) }
function parseValue(b) { const raw = b.dataset.value; const item = props.items.find((i) => String(i.value) === raw); return item ? item.value : raw }
function isTabStop(v) { return tabStop.value === v || tabStop.value === undefined }
function onKey(e, v) {
  const dir = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]
  if (!dir) return
  e.preventDefault()
  const btns = [...rootEl().querySelectorAll('.s-segment:not(:disabled)')]
  const i = btns.findIndex((b) => b === e.currentTarget)
  const next = btns[(i + dir + btns.length) % btns.length]
  next.focus()
  if (!props.multiple && !props.action) select(parseValue(next))
}

provide('s-segmented', {
  get action() { return props.action }, get multiple() { return props.multiple },
  iconSize: computed(() => m.value.icon), isSelected, select, press, onKey, isTabStop,
})

// sliding thumb, measured from the selected item
const thumb = ref({ left: 0, width: 0, show: false })
const lens = ref({ left: 0, width: 0, top: 0, height: 0, show: false })
function measure() {
  // the pressed item swells into the glass lens (showcase: `force="pressed"` presses the second item)
  const btns = [...(rootEl()?.querySelectorAll('.s-segment') ?? [])]
  const hot = pressedValue.value !== null ? btns.find((b) => b.dataset.value === String(pressedValue.value)) : props.force === 'pressed' ? btns[1] ?? btns[0] : null
  lens.value = hot && !props.action ? { show: true, left: hot.offsetLeft - 8, width: hot.offsetWidth + 16, top: hot.offsetTop - 12, height: hot.offsetHeight + 24 } : { ...lens.value, show: false }
  const sel = rootEl()?.querySelector('.s-segment.is-selected')
  if (!sel || props.multiple || props.action) { thumb.value = { ...thumb.value, show: false }; return }
  thumb.value = { left: sel.offsetLeft, width: sel.offsetWidth, show: true }
}
let ro
onMounted(() => { measure(); ro = new ResizeObserver(measure); ro.observe(rootEl()); document.fonts?.ready.then(measure) })
onBeforeUnmount(() => ro?.disconnect())
watch(() => [props.modelValue, props.items, props.size, props.multiple, props.force], () => nextTick(measure), { deep: true })
const animate = ref(false)
onMounted(() => requestAnimationFrame(() => (animate.value = true)))
</script>

<template>
  <SGlassPanel
    ref="root" class="s-segmented" :radius="radius" :style="style"
    :class="[`s-segmented--${size}`, { 's-segmented--any': multiple, 's-segmented--action': action, 's-segmented--stacked': isStacked, 'is-disabled': disabled }]"
    :role="action ? 'group' : multiple ? 'group' : 'radiogroup'"
  >
    <span v-if="thumb.show" class="s-segmented__thumb" :class="{ 'is-animated': animate }" :style="{ left: thumb.left + 'px', width: thumb.width + 'px' }" />
    <span v-if="lens.show" class="s-segmented__lens" :style="{ left: lens.left + 'px', top: lens.top + 'px', width: lens.width + 'px', height: lens.height + 'px' }" />
    <template v-if="action">
      <template v-for="(it, i) in items" :key="it.value">
        <span v-if="i" class="s-segmented__sep" />
        <SSegment v-bind="it" />
      </template>
    </template>
    <template v-else>
      <SSegment v-for="it in items" :key="it.value" v-bind="it" :disabled="disabled || it.disabled" />
    </template>
    <slot />
  </SGlassPanel>
</template>

<style>
.s-segmented {
  display: inline-grid; grid-auto-flow: column; grid-auto-columns: minmax(var(--seg-w), 1fr); align-items: center; vertical-align: middle;
  height: var(--seg-h); padding: var(--seg-pad); box-sizing: border-box; color: var(--text-primary);
}
.s-segmented.is-disabled { opacity: 0.35; pointer-events: none; }
.s-segmented--action { grid-auto-columns: minmax(var(--seg-w), auto); padding: 0; }
.s-segmented--action .s-segmented__sep { width: 1px; height: var(--seg-sep-h); background: var(--line-separator); }
.s-segmented--action { grid-auto-columns: auto; }
.s-segmented--action .s-segment { min-width: var(--seg-w); height: var(--seg-h); }
.s-segmented--action .s-segment { padding: 0 8px; }

.s-segmented__thumb {
  position: absolute; top: var(--seg-pad); height: var(--seg-item-h); box-sizing: border-box; border-radius: calc(var(--seg-item-h) / 2); pointer-events: none;
  background: var(--surface-control); box-shadow: inset 0 0 0 1px var(--line-border), 0 1px 2px #0000001a;
}
.s-segmented__thumb.is-animated { transition: left var(--spring-snappy), width var(--spring-snappy), transform var(--spring-snappy), box-shadow var(--fade-quick); }
/* pressed: a glass lens swells around the item under the pointer */
.s-segmented__lens {
  position: absolute; box-sizing: border-box; border-radius: calc(var(--seg-item-h) * 1.1); pointer-events: none; z-index: 2;
  box-shadow: inset 0 0 0 1px var(--glass-rim-dark), inset 0 1px 1px var(--glass-rim-light), inset 0 0 3px #ffffff40;
  backdrop-filter: blur(1px) saturate(1.2); -webkit-backdrop-filter: blur(1px) saturate(1.2);
}
.s-segmented--any .s-segmented__thumb { display: none; }
</style>
