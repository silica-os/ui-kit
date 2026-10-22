<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import SButton from './SButton.vue'
import SIcon from './SIcon.vue'
import SMenu from './SMenu.vue'
import SMenuItem from './SMenuItem.vue'

/**
 * Pop-up button: shows the current choice with the up/down chevrons and opens a menu of `options` (strings, or { label, value, icon? }).
 * v-model is the chosen value. With `pull-down` it is the pull-down button instead: a fixed `label` and a single chevron, and the
 * options are actions (`@select` fires with the value; nothing is marked as current).
 * Like macOS, the pop-up menu opens over the button with the current choice on the button; the pull-down menu opens just under it.
 * An option object may carry `checked` and `force: 'hover'` (to show a row highlighted, documentation).
 */
const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  options: { type: Array, default: () => [] },
  size: { type: String, default: 'regular', validator: (v) => ['mini', 'small', 'regular', 'large'].includes(v) },
  pullDown: Boolean,
  /** the label of a pull-down button, or the text shown when nothing is chosen */
  label: { type: String, default: '' },
  /** minimum width in pt (the kit's buttons are 92 to 148 wide) */
  width: { type: Number, default: 0 },
  disabled: Boolean,
  /** hover | pressed | focus, and `open` to show the menu without clicking */
  force: { type: String, default: '' },
  open: Boolean,
})
const emit = defineEmits(['update:modelValue', 'select'])
const isOpen = ref(props.open)
const items = computed(() => props.options.map((o) => (typeof o === 'object' ? o : { label: String(o), value: o })))
const current = computed(() => items.value.find((o) => o.value === props.modelValue))
const text = computed(() => (props.pullDown ? props.label : current.value?.label ?? props.label))
const MIN = { mini: 92, small: 108, regular: 124, large: 148 }

function pick(o) {
  if (!props.pullDown) emit('update:modelValue', o.value)
  emit('select', o.value)
  isOpen.value = false
}
function toggle() { if (!props.disabled) isOpen.value = !isOpen.value }

const root = ref(null)
const w = computed(() => props.width || MIN[props.size])
const menuWidth = computed(() => Math.max(props.pullDown ? w.value - 4 : w.value, 120))
// pop-up: 12 pt left of the button, the current row centred on it; pull-down: 5 pt left, 3 pt below (Buttons/Pop-up/Open, Buttons/Pull-down/Open)
const menuStyle = computed(() => {
  if (props.pullDown) return { left: '-5px', top: 'calc(100% + 3px)' }
  const i = Math.max(0, items.value.findIndex((o) => o.value === props.modelValue))
  return { left: '-12px', top: `calc(50% - ${16 + 24 * i}px)` }
})
function onDoc(e) { if (!root.value?.contains(e.target)) isOpen.value = false }
function onKey(e) { if (e.key === 'Escape') isOpen.value = false }
watch(isOpen, (v) => {
  if (v) { setTimeout(() => document.addEventListener('pointerdown', onDoc)); document.addEventListener('keydown', onKey) }
  else { document.removeEventListener('pointerdown', onDoc); document.removeEventListener('keydown', onKey) }
}, { immediate: true })
onBeforeUnmount(() => { document.removeEventListener('pointerdown', onDoc); document.removeEventListener('keydown', onKey) })
</script>

<template>
  <span ref="root" class="s-popup-anchor">
    <SButton
      class="s-popup" :class="`s-popup--${size}`" :size="size" :disabled="disabled" :force="isOpen ? 'pressed' : force"
      :style="{ minWidth: w + 'px' }" aria-haspopup="menu" :aria-expanded="isOpen" @click="toggle"
    >
      <span class="s-popup__text">{{ text }}</span>
      <SIcon class="s-popup__chevron" :name="pullDown ? 'chevron-down' : 'chevron-up-down'" :size="16" />
    </SButton>
    <SMenu v-if="isOpen" class="s-popup__menu" :width="menuWidth" :style="menuStyle" @close="isOpen = false">
      <SMenuItem
        v-for="o in items" :key="o.value" :label="o.label" :icon="o.icon" :force="o.force" :checked="o.checked ?? (!pullDown && o.value === modelValue)" @click="pick(o)"
      />
    </SMenu>
  </span>
</template>

<style>
.s-popup.s-button { justify-content: flex-start; padding: 0 8px 0 12px; }
.s-popup--mini.s-button, .s-popup--small.s-button { padding: 0 4px 0 8px; }
.s-popup--regular.s-button, .s-popup--large.s-button { font: var(--font-body); }
.s-popup .s-button__label { display: flex; flex: 1; align-items: center; gap: 4px; min-width: 0; }
.s-popup__text { flex: 1; min-width: 0; text-align: left; overflow: hidden; text-overflow: ellipsis; }
.s-popup__chevron { color: var(--text-secondary); }
.s-popup-anchor { position: relative; display: inline-flex; }
.s-popup__menu { position: absolute; z-index: 20; }
</style>
