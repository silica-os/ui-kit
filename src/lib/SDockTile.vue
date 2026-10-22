<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import SIcon from './SIcon.vue'
import SMenu from './SMenu.vue'
import SDockCallout from './SDockCallout.vue'

/**
 * One 64 x 80 Dock slot (kit Dock/Tile): a 60 pt icon at (2, 10), a 4 pt running dot at (30, 72), and a label bubble above
 * the tile on hover or focus. The app icon is a placeholder (the kit's are bitmaps): a rounded square of `color`
 * (any CSS colour, default a grey) with a white `glyph`; put an <img> in the default slot for a real icon. `missing` is the
 * kit's Missing tile (a 48 pt grey tile with the glyph, for an app whose icon is gone). `badge` is a red count on the icon.
 * Click emits `click` and bounces the icon once; a right click (or Shift+F10) opens the context menu from the `menu`
 * slot (<SMenuItem>s). `force`: `hover` (magnified + label) | `label` (label only) | `menu`.
 */
const props = defineProps({
  label: { type: String, default: '' },
  glyph: { type: String, default: '' },
  color: { type: String, default: '' },
  running: Boolean,
  missing: Boolean,
  badge: { type: [String, Number], default: '' },
  force: { type: String, default: '' },
})
const emit = defineEmits(['click'])
const root = ref(null)
const menuOpen = ref(false)
const bounce = ref(false)
const menuShown = computed(() => (menuOpen.value || props.force === 'menu'))
let t
function onClick(e) { bounce.value = false; requestAnimationFrame(() => { bounce.value = true; clearTimeout(t); t = setTimeout(() => (bounce.value = false), 1100) }); emit('click', e) }
function openMenu(e) { e.preventDefault(); menuOpen.value = true; setTimeout(() => document.addEventListener('pointerdown', onDoc)) }
function onDoc(e) { if (!root.value?.contains(e.target)) { menuOpen.value = false; document.removeEventListener('pointerdown', onDoc) } }
onBeforeUnmount(() => { document.removeEventListener('pointerdown', onDoc); clearTimeout(t) })
const bg = computed(() => props.color ? `linear-gradient(180deg, color-mix(in srgb, ${props.color} 82%, #fff), ${props.color} 62%, color-mix(in srgb, ${props.color} 88%, #000))` : '')
</script>

<template>
  <div ref="root" class="s-dock-tile" :class="[{ 'is-running': running, 'is-menu': menuShown, 'is-missing': missing, 'is-bounce': bounce }, force && `is-${force}`]" @contextmenu="openMenu">
    <button type="button" class="s-control s-dock-tile__btn" :aria-label="label" @click="onClick" @keydown.shift.f10.prevent="openMenu">
      <span class="s-dock-tile__icon">
        <slot><span class="s-dock-tile__ph" :style="bg && !missing ? { background: bg } : null"><SIcon v-if="glyph" :name="glyph" :size="28" /></span></slot>
        <span v-if="badge !== ''" class="s-dock-tile__badge">{{ badge }}</span>
      </span>
    </button>
    <span v-if="running" class="s-dock-tile__dot" />
    <SDockCallout v-if="label && !menuShown" class="s-dock-tile__label"><span class="s-dock-tile__text">{{ label }}</span></SDockCallout>
    <SDockCallout v-if="menuShown && $slots.menu" class="s-dock-tile__menu" :radius="12" :inset="4"><SMenu plain :width="192" @close="menuOpen = false"><slot name="menu" /></SMenu></SDockCallout>
  </div>
</template>

<style>
.s-dock-tile { position: relative; flex: none; width: 64px; height: 80px; }
.s-dock-tile__btn { position: absolute; left: 2px; top: 10px; width: 60px; height: 60px; padding: 0; margin: 0; border: 0; background: none; border-radius: 14px; cursor: default; transform-origin: 50% 100%; transition: transform var(--spring-snappy); }
.s-dock-tile__btn:focus-visible { box-shadow: 0 0 0 3px var(--line-focus); }
.s-dock-tile:is(:hover, .is-hover) .s-dock-tile__btn { transform: scale(1.1); }
.s-dock-tile__btn:active { filter: brightness(0.82); transition: transform var(--spring-snappy), filter var(--fade-instant); }
.s-dock-tile.is-bounce .s-dock-tile__btn { animation: s-dock-bounce 1.05s cubic-bezier(0.3, 0, 0.4, 1) 1; }
@keyframes s-dock-bounce { 0%, 100% { translate: 0 0 } 18% { translate: 0 -16px } 36% { translate: 0 0 } 54% { translate: 0 -9px } 72% { translate: 0 0 } 86% { translate: 0 -3px } }
.s-dock-tile__icon { position: relative; display: block; width: 100%; height: 100%; }
.s-dock-tile__icon > img { width: 100%; height: 100%; display: block; }
/* placeholder of a bitmap app icon: 60 pt squircle (r 14) */
.s-dock-tile__ph {
  display: grid; place-items: center; width: 100%; height: 100%; box-sizing: border-box; border-radius: 14px; color: var(--text-on-accent);
  background: var(--text-tertiary);
  box-shadow: inset 0 0 0 1px #0000001f, inset 0 1px 0 #ffffff59, var(--elevation-1);
}
.s-dock-tile__ph .s-icon { filter: drop-shadow(0 1px 1px #0000002e); }
.is-missing .s-dock-tile__ph {
  width: 48px; height: 48px; margin: 6px; border-radius: 12px; box-shadow: none;
  background: color-mix(in srgb, var(--text-tertiary) 24%, transparent); border: 1px solid color-mix(in srgb, var(--text-primary) 8%, transparent); color: var(--text-tertiary);
}
.is-missing .s-dock-tile__ph .s-icon { filter: none; }
.s-dock-tile__badge {
  position: absolute; right: -4px; top: -4px; min-width: 18px; height: 18px; padding: 0 5px; box-sizing: border-box; border-radius: 9px; background: var(--palette-terracotta); color: var(--text-on-accent);
  font: 600 12px/18px var(--font-family, inherit); text-align: center; box-shadow: 0 0 0 1px #0000001f;
}
.s-dock-tile__dot { position: absolute; left: 30px; top: 72px; width: 4px; height: 4px; border-radius: 2px; background: var(--text-secondary); }
/* label bubble: kit Dock/Label, its arrow tip sits 8 pt below the top of the tile */
.s-dock-tile__label, .s-dock-tile__menu { position: absolute; left: 50%; bottom: calc(100% - 8px); translate: -50% 0; z-index: 5; pointer-events: none; opacity: 0; transition: opacity var(--fade-quick), translate var(--spring-snappy); }
.s-dock-tile__text { display: block; min-width: 32px; padding: 5px 16px; white-space: nowrap; font: var(--font-body); font-weight: 500; line-height: 18px; text-align: center; color: var(--text-primary); }
.s-dock-tile:is(:hover, :focus-within, .is-hover, .is-label):not(.is-menu) .s-dock-tile__label { opacity: 1; transition-delay: 120ms, 0s; }
.s-dock-tile:is(:hover, :focus-within, .is-hover) .s-dock-tile__label { translate: -50% -5px; }
.s-dock-tile__menu { z-index: 20; opacity: 1; pointer-events: auto; }
.s-dock-tile__menu .s-menu { min-width: 192px; padding: 0; }
</style>
