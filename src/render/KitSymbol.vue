<script setup>
import { computed, ref, watch } from 'vue'
import { ensureMaster, getMaster } from '../kit.js'
import { flattenMaster } from './flatten.js'
import FlatStage from './FlatStage.vue'
import { stageBackground, treeHasBlur } from './style.js'

const props = defineProps({
  name: { type: String, required: true },
  scale: { type: Number, default: 1 },
  /** 'auto' picks a light or dark panel from the symbol name; anything else is a CSS background. */
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

const tree = computed(() => (ready.value ? flattenMaster(props.name) : null))
const bg = computed(() => (props.backdrop !== 'auto' ? props.backdrop : stageBackground(props.name.endsWith('/Dark'), !!tree.value && treeHasBlur(tree.value))))
</script>

<template>
  <div class="kit-symbol" :style="{ background: bg, padding: padding + 'px' }">
    <FlatStage v-if="tree" :tree="tree" :scale="scale" />
    <span v-else class="kit-symbol-error">{{ error || 'Loading…' }}</span>
  </div>
</template>

<style scoped>
.kit-symbol { display: inline-block; border-radius: 8px; vertical-align: top; }
.kit-symbol-error { font: 12px system-ui; color: #888; }
</style>
