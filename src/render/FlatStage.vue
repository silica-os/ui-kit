<script setup>
import { computed } from 'vue'
import FlatNode from './FlatNode.vue'

const props = defineProps({ tree: { type: Object, required: true }, scale: { type: Number, default: 1 } })
const frame = computed(() => (props.tree.type === 'Cross' ? props.tree.b : props.tree).frame)
</script>

<template>
  <div class="flat-stage" :style="{ width: frame.w * scale + 'px', height: frame.h * scale + 'px' }">
    <div :style="{ width: frame.w + 'px', height: frame.h + 'px', transform: `scale(${scale})`, transformOrigin: '0 0' }">
      <FlatNode :node="tree" :root="true" />
    </div>
  </div>
</template>

<style scoped>
.flat-stage, .flat-stage * { user-select: none; -webkit-user-select: none; }
</style>
