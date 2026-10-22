<script setup>
import { computed } from 'vue'
import codepoints from '../../tokens/symbol-codepoints.json'

/** A Silica Symbols glyph by name ("checkmark", "chevron-left"…). Sized in pt, coloured by `color` or currentColor. */
const props = defineProps({
  name: { type: String, required: true },
  size: { type: Number, default: 16 },
  weight: { type: String, default: 'regular', validator: (v) => ['light', 'regular', 'semibold'].includes(v) },
})
const char = computed(() => (codepoints[props.name] ? String.fromCodePoint(parseInt(codepoints[props.name], 16)) : ''))
const w = { light: 300, regular: 400, semibold: 600 }
</script>

<template>
  <i class="s-icon" :style="{ fontSize: size + 'px', width: size + 'px', height: size + 'px', fontWeight: w[weight] }" aria-hidden="true">{{ char }}</i>
</template>

<style>
.s-icon { display: inline-block; flex: none; font-family: 'Silica Symbols'; font-style: normal; line-height: 1; text-align: center; user-select: none; -webkit-user-select: none; }
</style>
