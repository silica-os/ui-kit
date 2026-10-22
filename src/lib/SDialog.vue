<script setup>
import { onMounted, ref, useId } from 'vue'
import SDialogFooter from './SDialogFooter.vue'

/**
 * A dialog surface (raised, 20 pt corners, large shadow): title, body in the default slot, footer buttons. As a sheet it goes in
 * the `sheet` slot of an <SWindow>. `size="panel"` is the tighter padding of the open / save panels. `footer` slot replaces the
 * default <SDialogFooter> (props `primary`, `secondary`); Esc emits `close`; Enter on a field presses the primary button.
 * Emits `primary` and `secondary` (the footer buttons).
 */
const props = defineProps({
  title: { type: String, default: '' },
  width: { type: [Number, String], default: 400 },
  size: { type: String, default: 'form', validator: (v) => ['form', 'panel'].includes(v) },
  primary: { type: String, default: 'OK' },
  secondary: { type: String, default: 'Cancel' },
  primaryDisabled: Boolean,
  /** no footer at all */
  bare: Boolean,
  autofocus: Boolean,
})
const emit = defineEmits(['primary', 'secondary', 'close'])
const id = useId()
const root = ref(null)
onMounted(() => { if (props.autofocus) root.value.querySelector('input, textarea, select')?.focus() })
function onEnter(e) { if (e.target.matches('input:not([type=checkbox]):not([type=radio])') && !props.primaryDisabled) emit('primary') }
</script>

<template>
  <section ref="root" class="s-dialog" :class="`s-dialog--${size}`" role="dialog" aria-modal="true" :aria-labelledby="title ? `${id}-t` : undefined" :style="{ width: typeof width === 'number' ? width + 'px' : width }" @keydown.esc.stop="emit('close')" @keydown.enter="onEnter">
    <h2 v-if="title || $slots.title" :id="`${id}-t`" class="s-dialog__title"><slot name="title">{{ title }}</slot></h2>
    <div class="s-dialog__body"><slot /></div>
    <slot v-if="!bare" name="footer"><SDialogFooter :primary="primary" :secondary="secondary" :primary-disabled="primaryDisabled" @primary="emit('primary')" @secondary="emit('secondary')"><template v-if="$slots.leading" #leading><slot name="leading" /></template></SDialogFooter></slot>
  </section>
</template>

<style>
.s-dialog {
  display: flex; flex-direction: column; gap: 20px; box-sizing: border-box; padding: 26px 24px 24px; max-width: 100%;
  background: var(--surface-raised); border-radius: var(--radius-sheetalert); box-shadow: inset 0 0 0 1px var(--line-border), var(--elevation-3); color: var(--text-primary); font: var(--font-body);
}
.s-dialog--panel { gap: 12px; padding: 22px 20px 20px; }
.s-dialog__title { margin: 0; font: var(--font-title-3); color: var(--text-primary); }
.s-dialog__body { display: flex; flex-direction: column; gap: 12px; min-height: 0; }
</style>
