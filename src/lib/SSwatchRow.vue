<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import SSwatchChip from './SSwatchChip.vue'
import { resolveColor, watchTheme } from './color.js'

/**
 * A row of colour chips (Wells/Swatch Row). `swatches` is [{ name, color }] (colour as hex or var(--token)); v-model is the chosen colour as hex.
 * ← → move between chips. Emits `pick` with the swatch.
 */
const props = defineProps({
  swatches: { type: Array, default: () => [] },
  modelValue: { type: String, default: '' },
  /** index of the chip shown selected when v-model is not used (documentation) */
  selected: { type: Number, default: -1 },
})
const emit = defineEmits(['update:modelValue', 'pick'])
const root = ref(null)
const resolved = ref([])
function resolve() { resolved.value = props.swatches.map((s) => resolveColor(root.value, s.color)) }
let stop = () => {}
onMounted(() => { resolve(); stop = watchTheme(resolve) }) // token colours change with the theme
onBeforeUnmount(() => stop())
watch(() => props.swatches, resolve)
const isSel = (i) => (props.selected >= 0 ? props.selected === i : !!props.modelValue && resolved.value[i]?.toUpperCase() === props.modelValue.toUpperCase())
function pick(s, i) {
  emit('update:modelValue', resolved.value[i])
  emit('pick', s)
}
function onKey(e) {
  const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key]
  if (!k) return
  const list = [...root.value.querySelectorAll('button')]
  list[(list.indexOf(document.activeElement) + k + list.length) % list.length]?.focus()
  e.preventDefault()
}
</script>

<template>
  <div ref="root" class="s-swatchrow" role="group" @keydown="onKey">
    <SSwatchChip v-for="(s, i) in swatches" :key="s.name" :color="s.color" :label="s.name" :selected="isSel(i)" @click="pick(s, i)" />
  </div>
</template>

<style>
.s-swatchrow { display: flex; align-items: center; gap: 8px; padding: 4px; }
</style>
