<script setup>
import KitSymbol from '../render/KitSymbol.vue'
import { theme } from './theme.js'

/** The kit's own rendering of a master, for comparing with the live component. `name` omits the appearance. */
defineProps({ name: String, scale: { type: Number, default: 1 } })
</script>

<template><KitSymbol :name="`${name}/${theme === 'dark' ? 'Dark' : 'Light'}`" :scale="scale" :padding="0" backdrop="transparent" /></template>
