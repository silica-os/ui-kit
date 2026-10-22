<script setup>
import { computed, ref } from 'vue'
import SIcon from './SIcon.vue'
import './STextField.vue'

/**
 * Image well (Wells/Image Well): a drop target. Drop an image file on it, or click / press Enter to choose one; the image shows as the
 * background and a clear button appears on hover and focus (Delete / Backspace clear too). v-model is the image URL (an object URL for a dropped
 * file; `file` is emitted with the File). Put your own content in the default slot to fill the well without a URL (documentation).
 */
const props = defineProps({
  modelValue: { type: String, default: '' },
  size: { type: String, default: 'regular', validator: (v) => ['small', 'regular', 'large'].includes(v) },
  hint: { type: String, default: 'Drop image' },
  disabled: Boolean,
  /** focus | dragover */
  force: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue', 'file'])
const over = ref(false)
const input = ref(null)
const filled = computed(() => !!props.modelValue)
const hasContent = computed(() => filled.value)
const isOver = computed(() => over.value || props.force === 'dragover')

function take(files) {
  const f = [...(files || [])].find((x) => x.type.startsWith('image/'))
  if (!f) return
  emit('file', f)
  emit('update:modelValue', URL.createObjectURL(f))
}
function onDrop(e) { over.value = false; if (!props.disabled) take(e.dataTransfer?.files) }
function onDragOver(e) { if (!props.disabled) { e.preventDefault(); over.value = true } }
function choose() { if (!props.disabled) input.value?.click() }
function clear() { emit('update:modelValue', '') }
function onKey(e) {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose() }
  else if ((e.key === 'Delete' || e.key === 'Backspace') && filled.value) { e.preventDefault(); clear() }
}
const glyph = { small: 20, regular: 28, large: 36 }
</script>

<template>
  <div
    class="s-imagewell" :class="[`s-imagewell--${size}`, force && `is-${force}`, { 'is-filled': hasContent || $slots.default, 'is-over': isOver, 'is-disabled': disabled }]"
    role="button" :tabindex="disabled ? -1 : 0" :aria-label="filled ? 'Image, press Delete to remove' : hint" :aria-disabled="disabled || undefined"
    @click="choose" @keydown="onKey" @dragover="onDragOver" @dragleave="over = false" @drop.prevent="onDrop"
  >
    <template v-if="!(filled || $slots.default)">
      <SIcon class="s-imagewell__glyph" name="photo" :size="glyph[size]" />
      <span v-if="size !== 'small'" class="s-imagewell__hint">{{ isOver ? 'Release to add' : hint }}</span>
    </template>
    <template v-else>
      <span class="s-imagewell__clip"><img v-if="filled" class="s-imagewell__img" :src="modelValue" alt="" draggable="false" /><slot /></span>
      <button v-if="filled" type="button" tabindex="-1" class="s-control s-field__clear s-imagewell__clear" aria-label="Remove image" @click.stop="clear"><SIcon name="xmark" :size="16" /></button>
    </template>
    <input ref="input" type="file" accept="image/*" hidden @change="take($event.target.files); $event.target.value = ''" />
  </div>
</template>

<style>
.s-imagewell {
  --r: 16px; position: relative; display: inline-flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; flex: none; box-sizing: border-box;
  width: 120px; height: 120px; border-radius: var(--r); background: var(--surface-sunken); box-shadow: inset 0 0 0 1.5px var(--line-border); color: var(--text-secondary);
  cursor: pointer; outline: none; transition: background var(--fade-quick), box-shadow var(--fade-quick);
}
.s-imagewell--small { --r: 12px; width: 72px; height: 72px; gap: 4px; }
.s-imagewell--large { --r: 20px; width: 168px; height: 168px; }
.s-imagewell__hint { font: var(--font-caption); }
.s-imagewell.is-over { background: var(--accent-amalfi-soft); box-shadow: inset 0 0 0 1.5px var(--accent-amalfi); color: var(--accent-amalfi); }
.s-imagewell.is-disabled { opacity: 0.35; cursor: default; }
.s-imagewell__img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.s-imagewell__clip { position: absolute; inset: 0; border-radius: inherit; overflow: hidden; }
.s-imagewell.is-filled { background: none; box-shadow: none; }
/* the rim and the focus halo sit above the content, the halo outside the shape */
.s-imagewell::after { content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 2; }
.s-imagewell.is-filled::after { box-shadow: inset 0 0 0 1px var(--line-border); }
.s-imagewell:is(:focus-visible, .is-focus, .is-over)::after { box-shadow: inset 0 0 0 1.5px var(--accent-amalfi); }
.s-imagewell:is(:focus-visible, .is-focus, .is-over) { box-shadow: 0 0 0 3px var(--line-focus); }
.s-imagewell:not(.is-filled):is(:focus-visible, .is-focus, .is-over) { box-shadow: inset 0 0 0 1.5px var(--accent-amalfi), 0 0 0 3px var(--line-focus); }
.s-imagewell__clear { position: absolute; top: 6px; right: 6px; z-index: 3; opacity: 0; transition: opacity var(--fade-quick); }
.s-imagewell:is(:hover, :focus-visible, .is-focus) .s-imagewell__clear { opacity: 1; }
</style>
