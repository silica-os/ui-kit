<script setup>
import { onBeforeUnmount, ref } from 'vue'
import SIcon from './SIcon.vue'
import SGlassPanel from './SGlassPanel.vue'
import SMenu from './SMenu.vue'

/**
 * One 64 x 80 dock slot: a 60 pt icon, a dot under it when `running`, and a label tooltip on hover or focus. The app icon is a
 * placeholder, a rounded square of `color` (any CSS colour, default a grey) with a white `glyph`; put an <img> in the default slot for a real icon.
 * Clicking emits `click`; a right click (or Shift+F10) opens the context menu from the `menu` slot (an <SMenu> content: <SMenuItem>s).
 */
const props = defineProps({
  label: { type: String, default: '' },
  glyph: { type: String, default: '' },
  color: { type: String, default: '' },
  running: Boolean,
  /** the label is shown without the pointer (showcase) */
  force: { type: String, default: '' },
})
const emit = defineEmits(['click'])
const root = ref(null)
const menuOpen = ref(false)
function openMenu(e) { e.preventDefault(); menuOpen.value = true; setTimeout(() => document.addEventListener('pointerdown', onDoc)) }
function onDoc(e) { if (!root.value?.contains(e.target)) { menuOpen.value = false; document.removeEventListener('pointerdown', onDoc) } }
onBeforeUnmount(() => document.removeEventListener('pointerdown', onDoc))
</script>

<template>
  <div ref="root" class="s-dock-tile" :class="[{ 'is-running': running, 'is-menu': menuOpen }, force && `is-${force}`]" @contextmenu="openMenu">
    <button type="button" class="s-control s-dock-tile__btn" :aria-label="label" @click="emit('click', $event)" @keydown.shift.f10.prevent="openMenu">
      <span class="s-dock-tile__icon"><slot><span class="s-dock-tile__ph" :style="color ? { background: color } : null"><SIcon v-if="glyph" :name="glyph" :size="28" /></span></slot></span>
    </button>
    <span v-if="running" class="s-dock-tile__dot" />
    <SGlassPanel v-if="label && !menuOpen" class="s-dock-tile__label" thick :radius="8">{{ label }}</SGlassPanel>
    <SMenu v-if="menuOpen && $slots.menu" class="s-dock-tile__menu" width="200" @close="menuOpen = false"><slot name="menu" /></SMenu>
  </div>
</template>

<style>
.s-dock-tile { position: relative; flex: none; width: 64px; height: 80px; }
.s-dock-tile__btn { position: absolute; left: 2px; top: 10px; width: 60px; height: 60px; padding: 0; margin: 0; border: 0; background: none; border-radius: 14px; cursor: default; transform-origin: 50% 100%; transition: transform var(--spring-snappy); }
.s-dock-tile__btn:focus-visible { box-shadow: 0 0 0 3px var(--line-focus); }
.s-dock-tile:hover .s-dock-tile__btn, .s-dock-tile.is-hover .s-dock-tile__btn { transform: scale(1.18) translateY(-3px); }
.s-dock-tile__btn:active { filter: brightness(0.85); }
.s-dock-tile__icon { display: block; width: 100%; height: 100%; }
.s-dock-tile__icon > img { width: 100%; height: 100%; display: block; }
.s-dock-tile__ph {
  display: grid; place-items: center; width: 100%; height: 100%; border-radius: 14px; color: #fff; background: var(--text-tertiary);
  box-shadow: inset 0 0 0 1px #00000014, inset 0 1px 0 #ffffff40, var(--elevation-1);
}
.s-dock-tile__dot { position: absolute; left: 30px; top: 72px; width: 4px; height: 4px; border-radius: 2px; background: var(--text-secondary); }
.s-dock-tile__label {
  position: absolute; left: 50%; bottom: calc(100% - 4px); transform: translateX(-50%); z-index: 5; padding: 4px 12px; white-space: nowrap; font: var(--font-body); color: var(--text-primary);
  pointer-events: none; opacity: 0; transition: opacity var(--fade-quick);
}
.s-dock-tile__label::after { content: ''; position: absolute; left: 50%; bottom: -4px; width: 8px; height: 8px; margin-left: -4px; transform: rotate(45deg); background: var(--glass-tint-thick); border-radius: 0 0 2px 0; box-shadow: 1px 1px 0 var(--glass-rim-dark); z-index: -1; }
.s-dock-tile:is(:hover, :focus-within, .is-hover) .s-dock-tile__label { opacity: 1; transition-delay: 150ms; }
.s-dock-tile__menu { position: absolute; left: 50%; bottom: calc(100% + 4px); transform: translateX(-50%); z-index: 20; }
</style>
