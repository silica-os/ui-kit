<script setup>
import { nextTick, onMounted, ref } from 'vue'
import { library } from './registry.js'

/** Renders one docs/*Doc.vue, optionally only the sections whose <h2> starts with one of `include`. */
const props = defineProps({ doc: String, include: { type: Array, default: null } })
const entry = library.find((e) => e.key === props.doc)
const root = ref(null)

function filter() {
  const doc = root.value?.querySelector('.doc')
  if (!doc) return
  const wanted = props.include?.map((s) => s.toLowerCase())
  let show = !wanted
  for (const el of doc.children) {
    if (el.tagName === 'HEADER') { el.style.display = 'none'; continue }
    if (!wanted) continue
    if (el.tagName === 'H2') show = wanted.some((w) => el.textContent.trim().toLowerCase().startsWith(w))
    el.style.display = show ? '' : 'none'
  }
}
onMounted(() => nextTick(filter))
</script>

<template>
  <div ref="root" class="part"><component :is="entry.doc" v-if="entry" /></div>
</template>

<style scoped>
.part :deep(.doc) { padding: 0; max-width: none; }
.part :deep(.doc > h2:first-of-type) { margin-top: 8px; }
</style>
