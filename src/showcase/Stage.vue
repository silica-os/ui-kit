<script setup>
import { theme } from './theme.js'

/** A themed surface for live components: the tokens inside follow the showcase theme. */
defineProps({ glass: Boolean, pad: { type: Number, default: 24 } })
</script>

<template>
  <div class="stage s-root" :data-theme="theme" :class="{ glass }" :style="{ padding: pad + 'px' }"><slot /></div>
</template>

<style scoped>
.stage { background: var(--surface-window); border: 1px solid var(--line-separator); border-radius: 14px; display: flex; flex-wrap: wrap; gap: 16px; align-items: center; color: var(--text-primary); }
.stage.glass { border: 0; }
.stage.glass[data-theme='light'] { background: repeating-linear-gradient(45deg, #0000000d 0 12px, #ffffff40 12px 24px), linear-gradient(135deg, #ffd29c, #f7a6cb 40%, #8ec2f5 70%, #9fe0b5); }
.stage.glass[data-theme='dark'] { background: repeating-linear-gradient(45deg, #0004 0 12px, #fff1 12px 24px), linear-gradient(135deg, #3a1d6e, #0b2a55 50%, #064b4a); }
/* audit mode (tools/audit): flat backgrounds, so live and kit are compared over identical pixels */
:global(:root[data-flat]) .stage.glass { background: var(--surface-window) !important; }
</style>
