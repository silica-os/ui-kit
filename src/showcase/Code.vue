<script setup>
import { ref } from 'vue'

const props = defineProps({ code: String })
const done = ref(false)
function copy() {
  navigator.clipboard?.writeText(props.code)
  done.value = true
  setTimeout(() => (done.value = false), 1200)
}
</script>

<template>
  <div class="code"><button class="btn" @click="copy">{{ done ? 'Copied' : 'Copy' }}</button><pre>{{ code }}</pre></div>
</template>

<style scoped>
.code { position: relative; margin-top: 10px; }
pre { margin: 0; padding: 12px 14px; border-radius: 10px; background: var(--panel); border: 1px solid var(--line); overflow: auto; line-height: 1.6; }
button { position: absolute; top: 8px; right: 8px; padding: 2px 10px; font-size: 12px; }
</style>
