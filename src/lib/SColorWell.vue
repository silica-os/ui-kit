<script setup>
import { computed, ref } from 'vue'
import SIcon from './SIcon.vue'
import SPopover from './SPopover.vue'
import SColorPanel from './SColorPanel.vue'

/**
 * Colour well (Wells/Color Well): shows the colour and opens a colour panel in a popover. v-model is a hex string.
 * `variant`: default (swatch and chevron), expanded (swatch, name and eyedropper; the eyedropper uses the browser EyeDropper when it exists)
 * or minimal (just the swatch).
 */
const props = defineProps({
  modelValue: { type: String, default: '#0E77E6' },
  variant: { type: String, default: 'default', validator: (v) => ['default', 'expanded', 'minimal'].includes(v) },
  /** the name shown by the expanded variant (the hex when empty) */
  name: { type: String, default: '' },
  disabled: Boolean,
  /** hover | focus, and `open` to show the panel without clicking */
  force: { type: String, default: '' },
  open: Boolean,
  /** the panel shows swatches only */
  swatchesOnly: Boolean,
})
const emit = defineEmits(['update:modelValue'])
const isOpen = ref(props.open)
const label = computed(() => props.name || props.modelValue)
async function pipette() {
  if (!('EyeDropper' in window)) return
  try { emit('update:modelValue', (await new window.EyeDropper().open()).sRGBHex.toUpperCase()) } catch { /* cancelled */ }
}
</script>

<template>
  <SPopover v-model:open="isOpen" placement="top-start" :arrow="false" :padding="12">
    <template #trigger>
      <div class="s-wellwrap s-colorwell" :class="[`s-colorwell--${variant}`, force && `is-${force}`, { 'is-open': isOpen, 'is-disabled': disabled }]">
        <button type="button" class="s-control s-colorwell__btn" :disabled="disabled" aria-haspopup="dialog" :aria-expanded="isOpen" aria-label="Colour" @click="isOpen = !isOpen">
          <span class="s-colorwell__colour" :style="{ background: modelValue }" />
          <span v-if="variant === 'expanded'" class="s-colorwell__name">{{ label }}</span>
          <SIcon v-if="variant === 'default'" class="s-colorwell__chevron" name="chevron-down" :size="16" />
        </button>
        <button v-if="variant === 'expanded'" type="button" class="s-control s-colorwell__eye" :disabled="disabled" aria-label="Pick from screen" @click="pipette"><SIcon name="eyedropper" :size="20" /></button>
      </div>
    </template>
    <SColorPanel :model-value="modelValue" :swatches-only="swatchesOnly" @update:model-value="emit('update:modelValue', $event)" />
  </SPopover>
</template>

<style>
.s-colorwell { position: relative; display: inline-flex; align-items: center; flex: none; height: 28px; border-radius: 9px; background: var(--surface-raised); box-shadow: inset 0 0 0 1px var(--line-border); transition: box-shadow var(--fade-quick); }
.s-colorwell::after { content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; transition: background var(--fade-quick), box-shadow var(--fade-quick); }
.s-colorwell:is(:hover, .is-hover):not(.is-disabled)::after { background: var(--accent-amalfi-soft); }
.s-colorwell:has(.s-colorwell__btn:focus-visible)::after, .s-colorwell.is-focus::after { box-shadow: 0 0 0 3px var(--line-focus); }
.s-colorwell.is-disabled { opacity: 0.35; }
.s-colorwell__btn { display: inline-flex; align-items: center; gap: 4px; height: 100%; padding: 0 8px 0 4px; border: 0; background: none; color: var(--text-primary); font: var(--font-body); cursor: pointer; outline: none; border-radius: 9px; }
.s-colorwell__colour { flex: none; width: 44px; height: 20px; border-radius: 6px; box-shadow: inset 0 0 0 1px var(--line-border); }
.s-colorwell__chevron { color: var(--text-secondary); }
.s-colorwell--expanded { width: 188px; }
.s-colorwell--expanded .s-colorwell__btn { flex: 1; gap: 8px; min-width: 0; padding-right: 0; }
.s-colorwell--expanded .s-colorwell__colour { width: 28px; }
.s-colorwell__name { flex: 1; min-width: 0; text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.s-colorwell__eye { flex: none; display: grid; place-items: center; width: 28px; height: 28px; margin-right: 0; padding: 0; border: 0; background: none; color: var(--text-secondary); cursor: pointer; border-radius: 9px; }
.s-colorwell--minimal { height: 24px; border-radius: 8px; }
.s-colorwell--minimal .s-colorwell__btn { padding: 0 4px; }
.s-colorwell--minimal .s-colorwell__colour { width: 36px; height: 16px; border-radius: 5px; }
.s-colorwell--minimal::after { border-radius: 8px; }
</style>
