<script setup>
import { onBeforeUnmount, onMounted, provide, ref } from 'vue'
import SMenuBarItem from './SMenuBarItem.vue'

/**
 * The menu bar (32 pt): the Silica mark, the bold app name, the app's menus on the left, the status cluster (`status` slot) on the right.
 * Put <SMenuBarItem label="File"> with <SMenuItem>s inside in the default slot; one menu is open at a time, hovering another item
 * while one is open moves to it, a click outside or Esc closes. `v-model:open` is the value of the open item (or ''). `glass`
 * paints the bar on the glass material, the default is transparent (over the wallpaper).
 */
const props = defineProps({
  appName: { type: String, default: '' },
  open: { type: String, default: '' },
  glass: Boolean,
  mark: { type: Boolean, default: true },
})
const emit = defineEmits(['update:open'])
const root = ref(null)
provide('s-menubar', {
  get open() { return props.open },
  set: (v) => emit('update:open', v),
})
function onDoc(e) { if (props.open && !root.value?.contains(e.target)) emit('update:open', '') }
function onKey(e) {
  if (!props.open) return
  if (e.key === 'Escape') { emit('update:open', ''); return }
  const items = [...root.value.querySelectorAll('.s-mbitem')]
  const i = items.findIndex((b) => b.dataset.value === props.open)
  const dir = { ArrowRight: 1, ArrowLeft: -1 }[e.key]
  if (dir && i >= 0 && !document.activeElement?.closest('.s-menu__cascade')) { const n = items[(i + dir + items.length) % items.length]; emit('update:open', n.dataset.value); n.focus() }
}
onMounted(() => document.addEventListener('pointerdown', onDoc))
onBeforeUnmount(() => document.removeEventListener('pointerdown', onDoc))
</script>

<template>
  <nav ref="root" class="s-menubar" :class="{ 's-menubar--glass': glass }" aria-label="Menu bar" @keydown="onKey">
    <template v-if="mark">
      <SMenuBarItem v-if="$slots.system" value="__mark" icon="silica" class="s-mbitem--mark"><slot name="system" /></SMenuBarItem>
      <SMenuBarItem v-else value="__mark" icon="silica" :menu="false" class="s-mbitem--mark" />
    </template>
    <template v-if="appName">
      <SMenuBarItem v-if="$slots.app" value="__app" :label="appName" bold><slot name="app" /></SMenuBarItem>
      <SMenuBarItem v-else value="__app" :label="appName" bold :menu="false" />
    </template>
    <slot />
    <span class="s-menubar__spacer" />
    <div class="s-menubar__status"><slot name="status" /></div>
  </nav>
</template>

<style>
.s-menubar { position: relative; display: flex; align-items: center; height: 32px; padding: 0 8px; box-sizing: border-box; color: var(--text-primary); font: var(--font-body); }
.s-menubar--glass { background: linear-gradient(var(--glass-tint), var(--glass-tint)); backdrop-filter: blur(10px) saturate(1.6); -webkit-backdrop-filter: blur(10px) saturate(1.6); }
.s-menubar__spacer { flex: 1 1 0; min-width: 8px; }
.s-menubar__status { display: flex; align-items: center; }
</style>
