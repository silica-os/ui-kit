<script setup>
import { computed, inject, provide } from 'vue'
import STrafficLights from './STrafficLights.vue'
import STitlebarTitle from './STitlebarTitle.vue'

/**
 * Window title bar / toolbar row. `variant`:
 *  - plain (48): window controls, centred title (+ `subtitle`, or `document` proxy), 1 pt separator under it; `trailing` slot on the right.
 *  - title (32): the compact title-only strip.
 *  - compact (40): controls, then the default slot (pieces: SIconButton small, SSegmented…), the title being a flexible <STitlebarTitle flex>.
 *  - unified (52): controls, then the default slot filled with <STitlebarPiece>s (36 pt buttons).
 * `region` turns a unified bar into one column of a split toolbar: sidebar (translucent, with the controls), list, content, inspector.
 * In an <SWindow> `inactive` comes from the window. `controls=false` leaves the dots out (sections that do not start the window).
 */
const props = defineProps({
  variant: { type: String, default: 'unified', validator: (v) => ['plain', 'title', 'compact', 'unified'].includes(v) },
  region: { type: String, default: '', validator: (v) => ['', 'sidebar', 'list', 'content', 'inspector'].includes(v) },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  document: Boolean,
  controls: { type: Boolean, default: true },
  inactive: { type: Boolean, default: undefined },
})
const emit = defineEmits(['close', 'minimise', 'zoom'])
const win = inject('s-window', null)
const off = computed(() => props.inactive ?? win?.inactive ?? false)
provide('s-window', { get inactive() { return off.value } })
const hasTitleProp = computed(() => props.title !== '')
</script>

<template>
  <header class="s-titlebar" :class="[`s-titlebar--${variant}`, region && `s-titlebar--${region}`, { 'is-inactive': off, 'has-controls': controls }]">
    <div v-if="controls" class="s-titlebar__controls">
      <slot name="controls"><STrafficLights :inactive="off" @close="emit('close')" @minimise="emit('minimise')" @zoom="emit('zoom')" /></slot>
    </div>
    <template v-if="variant === 'plain' || variant === 'title'">
      <div class="s-titlebar__center"><slot><STitlebarTitle align="center" :title="title" :subtitle="subtitle" :document="document" /></slot></div>
      <div class="s-titlebar__trailing"><slot name="trailing" /></div>
    </template>
    <template v-else>
      <slot><STitlebarTitle v-if="hasTitleProp" flex :title="title" :subtitle="subtitle" :document="document" /><span v-else class="s-titlebar__fill" /></slot>
    </template>
  </header>
</template>

<style>
.s-titlebar { position: relative; display: flex; align-items: center; flex: none; box-sizing: border-box; background: var(--surface-window); color: var(--text-primary); min-width: 0; }

/* controls block: the dots are 20 pt from the edge in a 52 pt bar, 8 pt in the compact ones */
.s-titlebar__controls { display: flex; align-items: center; flex: none; height: 100%; }
.s-titlebar--unified .s-titlebar__controls { padding-left: 20px; width: 94px; }
.s-titlebar--compact .s-titlebar__controls, .s-titlebar--title .s-titlebar__controls { padding-left: 8px; width: 78px; }
.s-titlebar--plain .s-titlebar__controls { padding-left: 16px; width: 78px; }
.s-titlebar__fill { flex: 1 1 0; }

.s-titlebar--unified { height: 52px; padding-right: 16px; }
.s-titlebar--unified:not(.has-controls) { padding-left: 12px; }
.s-titlebar--unified.s-titlebar--sidebar, .s-titlebar--unified.s-titlebar--list, .s-titlebar--unified.s-titlebar--content, .s-titlebar--unified.s-titlebar--inspector { padding-right: 8px; }
.s-titlebar--compact { height: 40px; padding-right: 8px; gap: 8px; }
.s-titlebar--compact:not(.has-controls) { padding-left: 8px; }
.s-titlebar--title { height: 32px; display: grid; grid-template-columns: 78px 1fr 78px; }
.s-titlebar--plain { height: 48px; display: grid; grid-template-columns: 78px 1fr 78px; }
.s-titlebar--plain::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 1px; background: var(--line-separator); }
.s-titlebar__center { display: flex; justify-content: center; min-width: 0; grid-column: 2; }
.s-titlebar__trailing { padding-right: 16px; display: flex; justify-content: flex-end; align-items: center; gap: 8px; grid-column: 3; }
.s-titlebar--title .s-titlebar__controls, .s-titlebar--plain .s-titlebar__controls { grid-column: 1; }

.s-titlebar--compact .s-tbtitle { padding: 0; }

/* split-toolbar columns */
.s-titlebar--sidebar { background: color-mix(in srgb, var(--surface-sidebar) 80%, transparent); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
.s-titlebar--inspector { background: var(--surface-sidebar); }

/* inactive window: the glyphs of the toolbar buttons and the titles grey out; the glass pieces stay */
.s-titlebar.is-inactive :is(.s-iconbutton, .s-segmented--action .s-segment) { color: var(--text-tertiary); }
</style>
