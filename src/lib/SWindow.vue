<script setup>
import { computed, provide } from 'vue'
import STitlebar from './STitlebar.vue'

/**
 * A window: title bar or toolbar, optional sidebar / list / inspector regions, content. Regions are separated by 1 pt lines, only the
 * window has a shadow. `toolbar` picks the top: plain (48 title bar, title centred), title (32 strip), compact (40), unified (52,
 * one bar over everything) or split (one 52 pt toolbar per column, the sidebar one carries the controls) or none.
 * Slots: `titlebar` (replaces the bar), `toolbar` (pieces of the unified / compact bar, or the content column's toolbar in split),
 * `toolbar-sidebar`, `toolbar-list`, `toolbar-inspector`, `sidebar`, `list`, default (content), `inspector`, `sheet` (an attached
 * sheet: dims the window under the bar and drops the slot content in), `menubar` (with `fullscreen`).
 * `kind="utility"` is the small 14 pt-cornered palette. The window gives `inactive` to its bars through provide/inject.
 */
const props = defineProps({
  kind: { type: String, default: 'window', validator: (v) => ['window', 'utility'].includes(v) },
  toolbar: { type: String, default: 'plain', validator: (v) => ['none', 'plain', 'title', 'compact', 'unified', 'split'].includes(v) },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  document: Boolean,
  inactive: Boolean,
  /** the strip of a full-screen window: no frame, no shadow, a menu bar above the toolbar */
  fullscreen: Boolean,
  width: { type: [Number, String], default: 0 },
  height: { type: [Number, String], default: 0 },
  sidebarWidth: { type: Number, default: 240 },
  listWidth: { type: Number, default: 320 },
  inspectorWidth: { type: Number, default: 260 },
})
const emit = defineEmits(['close', 'minimise', 'zoom'])
provide('s-window', { get inactive() { return props.inactive } })
const px = (v) => (typeof v === 'number' ? v + 'px' : v)
const style = computed(() => ({
  width: props.width ? px(props.width) : null, height: props.height ? px(props.height) : null,
  '--w-sidebar': props.sidebarWidth + 'px', '--w-list': props.listWidth + 'px', '--w-inspector': props.inspectorWidth + 'px',
}))
const barVariant = computed(() => (props.kind === 'utility' ? 'title' : props.toolbar))
</script>

<template>
  <section class="s-window" :class="[`s-window--${kind}`, { 'is-inactive': inactive, 's-window--fullscreen': fullscreen, 'is-sheeted': $slots.sheet }]" :style="style">
    <div v-if="fullscreen && $slots.menubar" class="s-window__menubar"><slot name="menubar" /></div>

    <template v-if="toolbar !== 'split' || kind === 'utility'">
      <slot name="titlebar">
        <STitlebar
          v-if="toolbar !== 'none'" :variant="barVariant" :title="kind === 'utility' ? '' : title" :subtitle="subtitle" :document="document" class="s-window__bar" :class="{ 's-window__bar--utility': kind === 'utility' }"
          @close="emit('close')" @minimise="emit('minimise')" @zoom="emit('zoom')"
        >
          <template v-if="kind === 'utility'" #default><span class="s-window__utitle">{{ title }}</span></template>
          <template v-else-if="$slots.toolbar" #default><slot name="toolbar" /></template>
          <template v-if="$slots['toolbar-trailing']" #trailing><slot name="toolbar-trailing" /></template>
        </STitlebar>
      </slot>
      <div v-if="toolbar === 'unified' || toolbar === 'compact'" class="s-window__rule" />
      <div class="s-window__body">
        <aside v-if="$slots.sidebar" class="s-window__sidebar"><slot name="sidebar" /></aside>
        <main class="s-window__content"><slot /></main>
        <aside v-if="$slots.inspector" class="s-window__inspector"><slot name="inspector" /></aside>
      </div>
    </template>

    <div v-else class="s-window__split">
      <div v-if="$slots.sidebar || $slots['toolbar-sidebar']" class="s-window__col s-window__col--sidebar">
        <STitlebar region="sidebar" @close="emit('close')" @minimise="emit('minimise')" @zoom="emit('zoom')"><slot name="toolbar-sidebar" /></STitlebar>
        <aside class="s-window__sidebar"><slot name="sidebar" /></aside>
      </div>
      <div v-if="$slots.list" class="s-window__col s-window__col--list">
        <STitlebar region="list" :controls="false"><slot name="toolbar-list" /></STitlebar>
        <div class="s-window__list"><slot name="list" /></div>
      </div>
      <div class="s-window__col s-window__col--content">
        <STitlebar region="content" :controls="!($slots.sidebar || $slots['toolbar-sidebar'])" :title="title" @close="emit('close')" @minimise="emit('minimise')" @zoom="emit('zoom')"><slot name="toolbar" /></STitlebar>
        <main class="s-window__content"><slot /></main>
      </div>
      <div v-if="$slots.inspector" class="s-window__col s-window__col--inspector">
        <STitlebar region="inspector" :controls="false"><slot name="toolbar-inspector" /></STitlebar>
        <aside class="s-window__inspector-body"><slot name="inspector" /></aside>
      </div>
    </div>

    <template v-if="$slots.sheet">
      <div class="s-window__scrim" />
      <div class="s-window__sheet"><slot name="sheet" /></div>
    </template>
  </section>
</template>

<style>
.s-window {
  position: relative; display: flex; flex-direction: column; box-sizing: border-box; overflow: hidden; border-radius: var(--radius-window);
  background: var(--surface-window); color: var(--text-primary); font: var(--font-body); box-shadow: var(--elevation-3);
}
.s-window::after { content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; box-shadow: inset 0 0 0 1px var(--line-border); z-index: 20; }
.s-window--utility { border-radius: 14px; }
.s-window--fullscreen { border-radius: 0; box-shadow: none; }
.s-window--fullscreen::after { display: none; }
.s-window__menubar { flex: none; height: 32px; margin: 0 20px 12px; }

.s-window__rule { flex: none; height: 1px; background: var(--line-separator); }
.s-window__body { flex: 1 1 0; min-height: 0; display: flex; }
.s-window__sidebar { flex: none; width: var(--w-sidebar); background: var(--surface-sidebar); overflow: auto; }
.s-window__sidebar .s-sidebar { min-height: 100%; width: 100%; padding-top: 8px; background: none; }
.s-window__content { flex: 1 1 0; min-width: 0; min-height: 0; overflow: auto; position: relative; }
.s-window__inspector, .s-window__inspector-body { flex: none; width: var(--w-inspector); background: var(--surface-sidebar); overflow: auto; position: relative; }
.s-window__inspector::before, .s-window__inspector-body::before, .s-window__col--list::after { content: ''; position: absolute; top: 0; bottom: 0; left: 0; width: 1px; background: var(--line-separator); }
.s-window__col--list { position: relative; }
.s-window__col--list::after { left: auto; right: 0; z-index: 2; }

/* split toolbar: one column per region, the toolbar sits on top of each column */
.s-window__split { flex: 1 1 0; min-height: 0; display: flex; }
.s-window__col { display: flex; flex-direction: column; min-width: 0; min-height: 0; position: relative; }
.s-window__col--sidebar { flex: none; width: var(--w-sidebar); background: var(--surface-sidebar); }
.s-window__col--sidebar .s-window__sidebar { flex: 1 1 0; width: auto; background: none; }
.s-window__col--list { flex: none; width: var(--w-list); }
.s-window__list { flex: 1 1 0; min-height: 0; overflow: auto; }
.s-window__col--content { flex: 1 1 0; }
.s-window__col--inspector { flex: none; width: var(--w-inspector); background: var(--surface-sidebar); }
.s-window__col--inspector .s-window__inspector-body { flex: 1 1 0; width: auto; background: none; }
.s-window__col--inspector::before { content: ''; position: absolute; top: 0; bottom: 0; left: 0; width: 1px; background: var(--line-separator); z-index: 2; }
.s-window__col--inspector .s-window__inspector-body::before { display: none; }
.s-window__col--sidebar .s-titlebar, .s-window__col--inspector .s-titlebar { background: none; }
.s-window__col--sidebar .s-titlebar--sidebar { backdrop-filter: none; }
.s-window__col .s-titlebar { position: relative; z-index: 1; }

/* utility palette */
.s-window__bar--utility { height: 40px; background: none; }
.s-window__utitle { display: flex; justify-content: center; font: var(--font-label); font-weight: 600; color: var(--text-secondary); }
.s-window__bar--utility .s-titlebar__center { align-items: center; }

/* attached sheet */
.s-window__scrim { position: absolute; left: 0; right: 0; bottom: 0; top: 48px; background: var(--text-primary); opacity: 0.16; z-index: 10; border-radius: 0 0 var(--radius-window) var(--radius-window); }
.s-window__sheet { position: absolute; top: 40px; left: 50%; transform: translateX(-50%); z-index: 11; }
</style>
