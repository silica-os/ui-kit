<script setup>
import SButton from './SButton.vue'
import SIcon from './SIcon.vue'
import SGlassPanel from './SGlassPanel.vue'

/**
 * A notification: app icon tile (36 pt: `color` + `glyph`, or an <img> in the `icon` slot), title, message (two lines), time, and
 * up to a few action buttons under the text. `variant="banner"` (default) is the glass banner of the screen corner, `panel` the raised
 * card inside the notification centre. A close button shows while the pointer is over it. Emits `action(value)`, `close` and `click`.
 */
const props = defineProps({
  title: { type: String, default: '' },
  message: { type: String, default: '' },
  time: { type: String, default: 'now' },
  variant: { type: String, default: 'banner', validator: (v) => ['banner', 'panel'].includes(v) },
  actions: { type: Array, default: () => [] },
  color: { type: String, default: '' },
  glyph: { type: String, default: '' },
  closable: { type: Boolean, default: true },
  /** hover shows the close button without the pointer (showcase) */
  force: { type: String, default: '' },
})
const emit = defineEmits(['action', 'close', 'click'])
</script>

<template>
  <component :is="variant === 'banner' ? SGlassPanel : 'div'" v-bind="variant === 'banner' ? { radius: 18, smooth: true } : {}" class="s-notification" :class="[`s-notification--${variant}`, force && `is-${force}`]" role="alert" @click="emit('click', $event)">
    <button v-if="closable" type="button" class="s-control s-notification__close" aria-label="Close" @click.stop="emit('close')"><SIcon name="xmark" :size="12" /></button>
    <div class="s-notification__main">
      <span class="s-notification__icon"><slot name="icon"><span class="s-notification__ph" :style="color ? { background: color } : null"><SIcon v-if="glyph" :name="glyph" :size="20" /></span></slot></span>
      <div class="s-notification__text">
        <span class="s-notification__title">{{ title }}</span>
        <span class="s-notification__message">{{ message }}</span>
      </div>
      <span class="s-notification__time">{{ time }}</span>
    </div>
    <div v-if="actions.length" class="s-notification__actions">
      <SButton v-for="a in actions" :key="a.value" size="small" variant="secondary" @click.stop="emit('action', a.value)">{{ a.label }}</SButton>
    </div>
  </component>
</template>

<style>
.s-notification { position: relative; display: flex; flex-direction: column; gap: 8px; box-sizing: border-box; width: 360px; padding: 12px; color: var(--text-primary); font: var(--font-body); }
.s-notification--panel { width: 340px; background: var(--surface-raised); border-radius: 16px; box-shadow: var(--elevation-1); }
.s-notification__main { display: flex; gap: 8px; align-items: flex-start; min-width: 0; min-height: 52px; } /* the kit's content block is 52 pt even with a one-line text */
.s-notification__icon { flex: none; width: 36px; height: 36px; }
.s-notification__icon > img { width: 100%; height: 100%; display: block; }
.s-notification__ph { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 9px; background: var(--text-tertiary); color: #fff; box-shadow: inset 0 0 0 1px #00000014, inset 0 1px 0 #ffffff40; }
.s-notification__text { flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; }
.s-notification__title { font: var(--font-headline); }
.s-notification__message { font: var(--font-callout); color: var(--text-secondary); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.s-notification__time { flex: none; font: var(--font-caption); color: var(--text-tertiary); }
.s-notification__actions { display: flex; gap: 8px; padding-left: 44px; }
.s-notification__close {
  position: absolute; left: -8px; top: -8px; z-index: 2; display: grid; place-items: center; width: 20px; height: 20px; padding: 0; border: 0; border-radius: 10px; cursor: default;
  background: var(--surface-control); color: var(--text-secondary); box-shadow: inset 0 0 0 1px var(--line-border), var(--elevation-1); opacity: 0; transition: opacity var(--fade-quick);
}
.s-notification:is(:hover, :focus-within, .is-hover) > .s-notification__close { opacity: 1; }

/* Enter / leave, used with <Transition name="s-notification"> or <TransitionGroup> (nothing animates on first render).
   Measured (notifications.md): in = slide down + fade.standard (~210 ms), out = fade ~190 ms. */
.s-notification-enter-active { transition: opacity var(--fade-standard), transform var(--fade-standard); }
.s-notification-leave-active { transition: opacity var(--fade-instant), transform var(--fade-instant); }
.s-notification-enter-from { opacity: 0; transform: translateY(-16px); }
.s-notification-leave-to { opacity: 0; transform: translateY(-8px); }
.s-notification-move { transition: transform var(--spring-panel); }
@media (prefers-reduced-motion: reduce) {
  .s-notification-enter-active, .s-notification-leave-active, .s-notification-move { transition: opacity var(--fade-quick); }
  .s-notification-enter-from, .s-notification-leave-to { transform: none; }
}
</style>
