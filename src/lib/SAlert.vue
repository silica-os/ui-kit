<script setup>
import { useId } from 'vue'
import SButton from './SButton.vue'
import SCheckbox from './SCheckbox.vue'
import SGlassPanel from './SGlassPanel.vue'
import SIcon from './SIcon.vue'

/**
 * Alert (280 pt wide): an icon, a title, a message, up to three stacked buttons, and optionally a suppression checkbox
 * (`suppress` = its label, `v-model:suppressed`) or any accessory (a text field…) in the `accessory` slot.
 *  - `buttons`: [{ value, label, variant }] drawn as <SButton>, first on top; `action` fires with the value. Or use the
 *    `buttons` slot with your own <SButton>s.
 *  - `variant`: default | critical (terracotta warning badge on the icon) | glass (the blurred material).
 *  - the `icon` slot takes the 56 pt app icon.
 */
const props = defineProps({
  title: { type: String, default: '' },
  message: { type: String, default: '' },
  variant: { type: String, default: 'default', validator: (v) => ['default', 'critical', 'glass'].includes(v) },
  buttons: { type: Array, default: () => [] },
  suppress: { type: String, default: '' },
  suppressed: { type: Boolean, default: false },
})
const emit = defineEmits(['action', 'update:suppressed'])
const id = useId()
</script>

<template>
  <component :is="variant === 'glass' ? SGlassPanel : 'div'" v-bind="variant === 'glass' ? { thick: true, radius: 20 } : {}" class="s-alert" :class="`s-alert--${variant}`" role="alertdialog" :aria-labelledby="`${id}-t`" :aria-describedby="`${id}-m`">
    <div v-if="$slots.icon || variant === 'critical'" class="s-alert__icon">
      <slot name="icon" />
      <span v-if="variant === 'critical'" class="s-alert__badge"><SIcon name="warning" :size="16" /></span>
    </div>
    <div :id="`${id}-t`" class="s-alert__title">{{ title }}</div>
    <div v-if="message || $slots.default" :id="`${id}-m`" class="s-alert__message"><slot>{{ message }}</slot></div>
    <SCheckbox v-if="suppress" class="s-alert__suppress" :model-value="suppressed" @update:model-value="emit('update:suppressed', $event)">{{ suppress }}</SCheckbox>
    <div v-if="$slots.accessory" class="s-alert__accessory"><slot name="accessory" /></div>
    <div class="s-alert__buttons">
      <slot name="buttons">
        <SButton v-for="(b, i) in buttons" :key="b.value ?? i" :variant="b.variant ?? (i === 0 ? 'primary' : 'secondary')" @click="emit('action', b.value ?? i)">{{ b.label }}</SButton>
      </slot>
    </div>
  </component>
</template>

<style>
.s-alert {
  position: relative; display: flex; flex-direction: column; align-items: center; width: 280px; box-sizing: border-box; padding: 24px 20px 20px; text-align: center;
  border-radius: var(--radius-sheetalert); color: var(--text-primary); font: var(--font-body);
}
.s-alert--default, .s-alert--critical { background: var(--surface-raised); box-shadow: inset 0 0 0 1px var(--line-border), var(--elevation-3); }
.s-alert__icon { position: relative; width: 56px; height: 56px; margin-bottom: 16px; display: grid; place-items: center; }
.s-alert__icon > img, .s-alert__icon > svg { width: 56px; height: 56px; }
.s-alert__badge {
  position: absolute; left: 40px; top: 36px; width: 24px; height: 24px; border-radius: 12px; display: grid; place-items: center; box-sizing: border-box;
  background: var(--surface-raised); box-shadow: inset 0 0 0 1px var(--line-border); color: var(--palette-terracotta);
}
.s-alert__title { font: var(--font-title-3); width: 100%; margin-bottom: 8px; }
.s-alert__message { font: var(--font-callout); color: var(--text-secondary); width: 100%; margin-bottom: 20px; }
.s-alert__suppress { margin: -4px 0 20px; }
.s-alert__accessory { width: 100%; margin: -4px 0 20px; }
.s-alert__buttons { display: flex; flex-direction: column; gap: 8px; width: 100%; }
.s-alert__buttons .s-button { width: 100%; }
</style>
