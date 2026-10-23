<script setup>
import { onMounted, ref, useId } from 'vue'
import SDialogFooter from './SDialogFooter.vue'
import SGlassPanel from './SGlassPanel.vue'

/**
 * A dialog surface (raised, 20 pt corners, large shadow): title, body in the default slot, footer buttons. As a sheet it goes in
 * the `sheet` slot of an <SWindow>. The body is a plain form: <SFormRow>s (right-aligned labels), `<hr class="s-dialog__rule">`
 * between groups, `.s-dialog__group` for a tight stack of checkboxes. For the open / save panels use <SFilePanel>. `footer` slot replaces the
 * default <SDialogFooter> (props `primary`, `secondary`); Esc emits `close`; Enter on a field presses the primary button.
 * Emits `primary` and `secondary` (the footer buttons).
 */
const props = defineProps({
  title: { type: String, default: '' },
  width: { type: [Number, String], default: 400 },
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
onMounted(() => { if (props.autofocus) (root.value?.$el ?? root.value).querySelector('input, textarea, select')?.focus() })
function onEnter(e) { if (e.target.matches('input:not([type=checkbox]):not([type=radio])') && !props.primaryDisabled) emit('primary') }
</script>

<template>
  <SGlassPanel ref="root" tag="section" raised smooth :radius="20" class="s-dialog" role="dialog" aria-modal="true" :aria-labelledby="title ? `${id}-t` : undefined" :style="{ width: typeof width === 'number' ? width + 'px' : width }" @keydown.esc.stop="emit('close')" @keydown.enter="onEnter">
    <h2 v-if="title || $slots.title" :id="`${id}-t`" class="s-dialog__title"><slot name="title">{{ title }}</slot></h2>
    <div class="s-dialog__body"><slot /></div>
    <slot v-if="!bare" name="footer"><SDialogFooter :primary="primary" :secondary="secondary" :primary-disabled="primaryDisabled" @primary="emit('primary')" @secondary="emit('secondary')"><template v-if="$slots.leading" #leading><slot name="leading" /></template></SDialogFooter></slot>
  </SGlassPanel>
</template>

<style>
.s-dialog {
  display: flex; flex-direction: column; gap: 20px; box-sizing: border-box; padding: 26px 24px 24px; max-width: 100%;
  color: var(--text-primary); font: var(--font-body);
}
.s-dialog__title { margin: 0; font: var(--font-title-3); color: var(--text-primary); }
.s-dialog__body { display: flex; flex-direction: column; gap: 12px; margin-bottom: 4px; min-height: 0; } /* rows 12 apart, 24 to the footer (Dialogs/Dialog/Generic) */
.s-dialog__rule { align-self: stretch; height: 1px; margin: 8px 0 4px; border: 0; background: var(--line-separator); }
.s-dialog__group { display: flex; flex-direction: column; gap: 4px; }

/* In / out with <Transition name="s-dialog"> (dialogs.md: fades in while moving down ~20 pt, no scaling; fades out in place). Nothing animates on first render. */
.s-dialog-enter-active { transition: opacity var(--fade-standard), translate var(--spring-panel); }
.s-dialog-leave-active { transition: opacity var(--fade-instant); }
.s-dialog-enter-from { opacity: 0; translate: 0 -20px; }
.s-dialog-leave-to { opacity: 0; }
@media (prefers-reduced-motion: reduce) { .s-dialog-enter-active { transition: opacity var(--fade-quick); } .s-dialog-enter-from { translate: none; } }
</style>
