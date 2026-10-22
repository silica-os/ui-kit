<script setup>
import SButton from './SButton.vue'

/**
 * Dialog footer: buttons at the right, 8 pt apart, the primary last (Save, Open…). The `leading` slot is a button at the left
 * (New Folder). Labels from props, or the default slot for your own <SButton>s. Emits `primary` and `secondary`.
 */
defineProps({
  primary: { type: String, default: 'OK' },
  secondary: { type: String, default: 'Cancel' },
  primaryVariant: { type: String, default: 'primary' },
  primaryDisabled: Boolean,
})
const emit = defineEmits(['primary', 'secondary'])
</script>

<template>
  <div class="s-dialog-footer">
    <slot name="leading" />
    <span class="s-dialog-footer__spacer" />
    <slot>
      <SButton v-if="secondary" variant="secondary" @click="emit('secondary')">{{ secondary }}</SButton>
      <SButton v-if="primary" :variant="primaryVariant" :disabled="primaryDisabled" @click="emit('primary')">{{ primary }}</SButton>
    </slot>
  </div>
</template>

<style>
.s-dialog-footer { display: flex; align-items: center; gap: 8px; min-height: 28px; flex: none; }
.s-dialog-footer__spacer { flex: 1 1 0; }
.s-dialog-footer .s-button { min-width: 72px; }
</style>
