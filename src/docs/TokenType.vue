<script setup>
import { ref } from 'vue'
import tokens from '../../tokens/tokens.json'

const mode = ref('light')
const sample = ref('The quick brown fox jumps over the lazy dog')
const rows = Object.entries(tokens.typography)
</script>

<template>
  <div :class="['type', mode]">
    <div class="bar">
      <button v-for="m in ['light', 'dark']" :key="m" :class="{ on: mode === m }" @click="mode = m">{{ m }}</button>
      <input v-model="sample" />
    </div>
    <div v-for="[name, t] in rows" :key="name" class="row">
      <div class="meta">
        <b>{{ name }}</b>
        <code>{{ t.family }} · {{ t.size }}/{{ t.lineHeight || 'auto' }} · {{ t.weight }}</code>
      </div>
      <div class="roles">
        <div
          v-for="(hex, role) in t.colors[mode]"
          :key="role"
          :style="{ fontFamily: `'${t.family === 'Inter' ? 'Inter Variable' : t.family + ' Variable'}', '${t.family}', sans-serif`, fontSize: t.size + 'px', lineHeight: t.lineHeight ? t.lineHeight + 'px' : 'normal', fontWeight: t.weight, color: hex }"
        >{{ sample }} <small>{{ role }}</small></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.type { padding: 16px; border-radius: 12px; }
.type.light { background: #fff; color: #1d1e21; } .type.dark { background: #17181a; color: #ececee; }
.bar { display: flex; gap: 8px; margin-bottom: 12px; }
.bar button { padding: 4px 12px; border-radius: 6px; border: 1px solid #8884; background: transparent; color: inherit; cursor: pointer; text-transform: capitalize; font: 13px Inter, sans-serif; }
.bar button.on { background: #0e77e6; color: #fff; border-color: #0e77e6; }
.bar input { flex: 1; padding: 4px 8px; border-radius: 6px; border: 1px solid #8884; background: transparent; color: inherit; }
.row { display: grid; grid-template-columns: 200px 1fr; gap: 16px; padding: 12px 0; border-top: 1px solid #8883; }
.meta { display: flex; flex-direction: column; gap: 2px; font: 13px Inter, sans-serif; } code { font: 11px ui-monospace, monospace; opacity: 0.6; }
small { font: 10px ui-monospace, monospace; opacity: 0.5; margin-left: 8px; }
</style>
