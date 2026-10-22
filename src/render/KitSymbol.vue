<script setup>
import { ref, watch, computed } from 'vue'
import { ensureMaster, getMaster } from '../kit.js'
import { boxStyle, radius } from './style.js'
import KitNode from './KitNode.vue'

const props = defineProps({
  name: { type: String, required: true },
  scale: { type: Number, default: 1 },
  /** Draws the checkerboard behind the symbol (glass and translucent fills read better). */
  backdrop: { type: String, default: 'auto' },
  padding: { type: Number, default: 24 },
})

const ready = ref(false)
const error = ref('')

watch(
  () => props.name,
  async (name) => {
    ready.value = false
    error.value = ''
    try {
      await ensureMaster(name)
      ready.value = !!getMaster(name)
      if (!ready.value) error.value = `Unknown symbol ${name}`
    } catch (e) {
      error.value = String(e)
    }
  },
  { immediate: true },
)

const master = computed(() => (ready.value ? getMaster(props.name) : null))
const bg = computed(() => {
  if (props.backdrop !== 'auto') return props.backdrop
  return props.name.endsWith('/Dark') ? '#1b1c1f' : '#f1f2f4'
})
const rootCss = computed(() => ({
  position: 'relative',
  width: master.value.frame.w + 'px',
  height: master.value.frame.h + 'px',
  ...boxStyle(master.value),
  borderRadius: radius(master.value.style.corners, master.value.frame.w, master.value.frame.h),
}))
</script>

<template>
  <div class="kit-symbol" :style="{ background: bg, padding: padding + 'px' }">
    <div v-if="master" :style="{ width: master.frame.w * scale + 'px', height: master.frame.h * scale + 'px' }">
      <div :style="{ ...rootCss, transform: `scale(${scale})`, transformOrigin: '0 0' }">
        <KitNode v-for="(c, i) in master.children" :key="i" :node="c" :parent="master" :overrides="[]" />
      </div>
    </div>
    <span v-else class="kit-symbol-error">{{ error || 'Loading…' }}</span>
  </div>
</template>

<style scoped>
.kit-symbol { display: inline-block; border-radius: 8px; vertical-align: top; }
.kit-symbol-error { font: 12px system-ui; color: #888; }
</style>
