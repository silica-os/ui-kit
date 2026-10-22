<script setup>
import { ref } from 'vue'
import STextField from './STextField.vue'
import SIcon from './SIcon.vue'

/**
 * Password field: an STextField with the lock glyph and masked text. `revealable` adds an eye button that shows the text while toggled
 * (not in the kit, so off by default). Every other prop and attribute goes to the field.
 */
defineOptions({ inheritAttrs: false })
defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Password' },
  size: { type: String, default: 'regular' },
  revealable: Boolean,
  error: Boolean,
  disabled: Boolean,
  force: { type: String, default: '' },
})
defineEmits(['update:modelValue'])
const shown = ref(false)
</script>

<template>
  <STextField
    v-bind="$attrs" :model-value="modelValue" :type="shown ? 'text' : 'password'" icon="lock" :placeholder="placeholder" :size="size" :error="error"
    :disabled="disabled" :force="force" autocomplete="current-password" @update:model-value="$emit('update:modelValue', $event)"
  >
    <template v-if="revealable && !error" #trailing>
      <button type="button" tabindex="-1" class="s-control s-secure__eye" :aria-label="shown ? 'Hide password' : 'Show password'" :aria-pressed="shown" @pointerdown.prevent @click="shown = !shown">
        <SIcon :name="shown ? 'eye-slash' : 'eye'" :size="16" />
      </button>
    </template>
  </STextField>
</template>

<style>
.s-secure__eye { flex: none; display: inline-grid; place-items: center; width: 20px; height: 20px; padding: 0; border: 0; border-radius: 50%; background: none; color: var(--text-secondary); cursor: pointer; }
.s-secure__eye:hover { color: var(--text-primary); }
</style>
