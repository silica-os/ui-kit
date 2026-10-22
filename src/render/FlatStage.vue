<script setup>
import { computed } from 'vue'
import FlatNode from './FlatNode.vue'
import { boxStyle, radius } from './style.js'

const props = defineProps({ tree: { type: Object, required: true }, scale: { type: Number, default: 1 } })
const root = computed(() => {
  const t = props.tree.type === 'Cross' ? props.tree.b : props.tree
  const f = t.frame
  return { position: 'relative', width: `${f.w}px`, height: `${f.h}px`, ...boxStyle(t), borderRadius: radius(t.style.corners, f.w, f.h), transform: `scale(${props.scale})`, transformOrigin: '0 0' }
})
</script>

<template>
  <div :style="{ width: tree.frame.w * scale + 'px', height: tree.frame.h * scale + 'px' }">
    <div :style="root">
      <FlatNode v-if="tree.type === 'Cross'" :node="tree" :parent="tree.b" />
      <template v-else><FlatNode v-for="(c, i) in tree.children" :key="i" :node="c" :parent="tree" /></template>
    </div>
  </div>
</template>
