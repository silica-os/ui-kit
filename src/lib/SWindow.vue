<script setup>
import { computed, provide, ref } from 'vue'
import STitlebar from './STitlebar.vue'
import STitlebarPiece from './STitlebarPiece.vue'
import STrafficLights from './STrafficLights.vue'
import SGlassPanel from './SGlassPanel.vue'

/**
 * A window: title bar or toolbar, optional sidebar / list / inspector regions, content. Regions are separated by 1 pt lines, only the
 * window has a shadow. `toolbar` picks the top: plain (48 title bar, title centred), title (32 strip), compact (40), unified (52,
 * one bar over everything) or split (one 52 pt toolbar per column, the sidebar one carries the controls) or none.
 * Slots: `titlebar` (replaces the bar), `toolbar` (pieces of the unified / compact bar, or the content column's toolbar in split),
 * `toolbar-sidebar`, `toolbar-list`, `toolbar-inspector`, `sidebar`, `list`, default (content), `inspector`, `sheet` (an attached
 * sheet: dims the window under the bar and drops the slot content in), `menubar` (with `fullscreen`).
 * `kind="utility"` is the small 14 pt-cornered palette. The window gives `inactive` to its bars through provide/inject.
 *
 * Side panes. `v-model:sidebarOpen` / `v-model:inspectorOpen` fold the left and the right pane away (animated, the content takes the
 * space); `v-model:sidebarWidth` / `inspectorWidth` are their widths, and `resizable` adds the drag handle on their inner edge
 * (dragging a pane well below its minimum folds it, like macOS). Every toolbar slot receives `{ sidebarOpen, inspectorOpen,
 * toggleSidebar, toggleInspector }`. In the split toolbar the sections follow the panes like tracking separators do: the section above
 * a pane is exactly as wide as the pane and goes with it, the window controls stay put and the content section makes room for them,
 * and the two toggles (`panelToggles`) sit at the pane's trailing edge when it is open and move into the content section when it is
 * folded. Ctrl-Cmd-S / Alt-Cmd-I toggle the panes while the window has focus.
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
  listWidth: { type: Number, default: 320 },
  /** drag handles on the inner edge of the sidebar and the inspector */
  resizable: Boolean,
  /** split toolbar only: the window adds the sidebar / inspector toggles itself */
  panelToggles: { type: Boolean, default: true },
  /** Ctrl-Cmd-S / Alt-Cmd-I */
  shortcuts: { type: Boolean, default: true },
})
const sidebarOpen = defineModel('sidebarOpen', { type: Boolean, default: true })
const inspectorOpen = defineModel('inspectorOpen', { type: Boolean, default: true })
const sidebarWidth = defineModel('sidebarWidth', { type: Number, default: 240 })
const inspectorWidth = defineModel('inspectorWidth', { type: Number, default: 260 })
const emit = defineEmits(['close', 'minimise', 'zoom'])
const PANE = { sidebar: { min: 200, max: 360 }, inspector: { min: 240, max: 400 } }
const resizing = ref('')
const toggleSidebar = () => { sidebarOpen.value = !sidebarOpen.value }
const toggleInspector = () => { inspectorOpen.value = !inspectorOpen.value }
const panes = computed(() => ({ sidebarOpen: sidebarOpen.value, inspectorOpen: inspectorOpen.value, toggleSidebar, toggleInspector }))
function onKey(e) {
  if (!props.shortcuts) return
  const k = e.key.toLowerCase()
  if (e.ctrlKey && e.metaKey && k === 's') { e.preventDefault(); toggleSidebar() }
  else if (e.altKey && e.metaKey && (k === 'i' || e.code === 'KeyI')) { e.preventDefault(); toggleInspector() }
}
/** drag the inner edge of a pane: clamp to its range, fold it when pulled well under the minimum, unfold when pulled out again */
function startResize(which, e) {
  e.preventDefault()
  const open = which === 'sidebar' ? sidebarOpen : inspectorOpen
  const width = which === 'sidebar' ? sidebarWidth : inspectorWidth
  const { min, max } = PANE[which]
  const x0 = e.clientX, w0 = width.value, dir = which === 'sidebar' ? 1 : -1
  resizing.value = which
  const move = (ev) => {
    const raw = w0 + (ev.clientX - x0) * dir
    if (raw < min - 56) { open.value = false; return }
    open.value = true
    width.value = Math.round(Math.max(min, Math.min(max, raw)))
  }
  const up = () => { resizing.value = ''; window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up) }
  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', up)
}
provide('s-window', { get inactive() { return props.inactive } })
const px = (v) => (typeof v === 'number' ? v + 'px' : v)
const style = computed(() => ({
  width: props.width ? px(props.width) : null, height: props.height ? px(props.height) : null,
  '--w-sidebar': sidebarWidth.value + 'px', '--w-list': props.listWidth + 'px', '--w-inspector': inspectorWidth.value + 'px',
}))
const barVariant = computed(() => (props.kind === 'utility' ? 'title' : props.toolbar))
</script>

<template>
  <SGlassPanel tag="section" raised :smooth="!fullscreen" :bare="fullscreen" :radius="kind === 'utility' ? 14 : 18" class="s-window" :class="[`s-window--${kind}`, { 'is-inactive': inactive, 's-window--fullscreen': fullscreen, 'is-sheeted': $slots.sheet, 'is-sidebar-closed': !sidebarOpen, 'has-list': $slots.list, 'is-inspector-closed': !inspectorOpen, 'is-resizing': resizing }]" :style="style" tabindex="-1" @keydown="onKey">
    <div class="s-window__frame">
    <div v-if="fullscreen && $slots.menubar" class="s-window__menubar"><slot name="menubar" /></div>

    <template v-if="toolbar !== 'split' || kind === 'utility'">
      <slot name="titlebar">
        <STitlebar
          v-if="toolbar !== 'none'" :variant="barVariant" :title="kind === 'utility' ? '' : title" :subtitle="subtitle" :document="document" class="s-window__bar" :class="{ 's-window__bar--utility': kind === 'utility' }"
          @close="emit('close')" @minimise="emit('minimise')" @zoom="emit('zoom')"
        >
          <template v-if="kind === 'utility'" #default><span class="s-window__utitle">{{ title }}</span></template>
          <template v-else-if="$slots.toolbar" #default><slot name="toolbar" v-bind="panes" /></template>
          <template v-if="$slots['toolbar-trailing']" #trailing><slot name="toolbar-trailing" v-bind="panes" /></template>
        </STitlebar>
      </slot>
      <div v-if="toolbar === 'unified' || toolbar === 'compact'" class="s-window__rule" />
      <div class="s-window__body">
        <div v-if="$slots.sidebar" class="s-window__pane s-window__pane--sidebar" :inert="!sidebarOpen" :style="{ width: sidebarOpen ? 'var(--w-sidebar)' : '0px' }">
          <aside class="s-window__sidebar"><slot name="sidebar" /></aside>
          <div v-if="resizable" class="s-window__grip s-window__grip--sidebar" @pointerdown="startResize('sidebar', $event)" />
        </div>
        <main class="s-window__content"><slot /></main>
        <div v-if="$slots.inspector" class="s-window__pane s-window__pane--inspector" :inert="!inspectorOpen" :style="{ width: inspectorOpen ? 'var(--w-inspector)' : '0px' }">
          <aside class="s-window__inspector"><slot name="inspector" /></aside>
          <div v-if="resizable" class="s-window__grip s-window__grip--inspector" @pointerdown="startResize('inspector', $event)" />
        </div>
      </div>
    </template>

    <div v-else class="s-window__split">
      <!-- the window controls are one element over the columns: they do not move when the sidebar goes -->
      <div v-if="$slots.sidebar || $slots['toolbar-sidebar']" class="s-window__lights"><STrafficLights :inactive="inactive" @close="emit('close')" @minimise="emit('minimise')" @zoom="emit('zoom')" /></div>
      <div v-if="$slots.sidebar || $slots['toolbar-sidebar']" class="s-window__col s-window__col--sidebar" :inert="!sidebarOpen" :style="{ width: sidebarOpen ? 'var(--w-sidebar)' : '0px' }">
        <STitlebar region="sidebar" :controls="false">
          <slot name="toolbar-sidebar" v-bind="panes" />
          <template v-if="panelToggles"><span class="s-window__fill" /><STitlebarPiece kind="icon" icon="sidebar" label="Hide sidebar" @click="toggleSidebar" /></template>
        </STitlebar>
        <aside class="s-window__sidebar"><slot name="sidebar" /></aside>
        <div v-if="resizable" class="s-window__grip s-window__grip--sidebar" @pointerdown="startResize('sidebar', $event)" />
      </div>
      <div v-if="$slots.list" class="s-window__col s-window__col--list">
        <STitlebar region="list" :controls="false">
          <div v-if="panelToggles && $slots.sidebar" class="s-window__reveal s-window__reveal--lead" :class="{ 'is-shown': !sidebarOpen }" :inert="sidebarOpen"><STitlebarPiece kind="icon" icon="sidebar" label="Show sidebar" @click="toggleSidebar" /></div>
          <slot name="toolbar-list" v-bind="panes" />
        </STitlebar>
        <div class="s-window__list"><slot name="list" /></div>
      </div>
      <div class="s-window__col s-window__col--content">
        <STitlebar region="content" :controls="!($slots.sidebar || $slots['toolbar-sidebar'])" :title="title" @close="emit('close')" @minimise="emit('minimise')" @zoom="emit('zoom')">
          <div v-if="panelToggles && $slots.sidebar && !$slots.list" class="s-window__reveal s-window__reveal--lead" :class="{ 'is-shown': !sidebarOpen }" :inert="sidebarOpen"><STitlebarPiece kind="icon" icon="sidebar" label="Show sidebar" @click="toggleSidebar" /></div>
          <slot name="toolbar" v-bind="panes" />
          <div v-if="panelToggles && $slots.inspector" class="s-window__reveal" :class="{ 'is-shown': !inspectorOpen }" :inert="inspectorOpen"><STitlebarPiece kind="icon" icon="sidebar-right" label="Show inspector" @click="toggleInspector" /></div>
        </STitlebar>
        <main class="s-window__content"><slot /></main>
      </div>
      <div v-if="$slots.inspector" class="s-window__col s-window__col--inspector" :inert="!inspectorOpen" :style="{ width: inspectorOpen ? 'var(--w-inspector)' : '0px' }">
        <STitlebar region="inspector" :controls="false">
          <slot name="toolbar-inspector" v-bind="panes" />
          <template v-if="panelToggles"><span class="s-window__fill" /><STitlebarPiece kind="icon" icon="sidebar-right" label="Hide inspector" @click="toggleInspector" /></template>
        </STitlebar>
        <aside class="s-window__inspector-body"><slot name="inspector" /></aside>
        <div v-if="resizable" class="s-window__grip s-window__grip--inspector" @pointerdown="startResize('inspector', $event)" />
      </div>
    </div>

    <Transition name="s-veil"><div v-if="$slots.sheet" class="s-window__scrim" /></Transition>
    <Transition name="s-sheet"><div v-if="$slots.sheet" class="s-window__sheet"><slot name="sheet" /></div></Transition>
    </div>
  </SGlassPanel>
</template>

<style>
.s-window {
  position: relative; display: flex; flex-direction: column; box-sizing: border-box;
  color: var(--text-primary); font: var(--font-body);
}
/* the surface (fill, border, shadow) is SGlassPanel's smooth outline; the window's regions are clipped to it */
.s-window .s-glass__fill { background: var(--surface-window); }
.s-window__frame { position: relative; display: flex; flex-direction: column; flex: 1 1 0; min-height: 0; min-width: 0; overflow: hidden; background: var(--surface-window); clip-path: var(--s-clip, none); }
.s-window--fullscreen .s-window__frame { background: none; }
.s-window__menubar { flex: none; height: 32px; margin: 0 20px 12px; }

.s-window__rule { flex: none; height: 1px; background: var(--line-separator); }
.s-window__body { flex: 1 1 0; min-height: 0; display: flex; }
.s-window { outline: none; }
/* a pane folds by its width: the column clips a fixed-width child, so nothing reflows while it goes */
.s-window__pane, .s-window__col--sidebar, .s-window__col--inspector { overflow: hidden; transition: width var(--spring-panel); }
.s-window__pane { flex: none; position: relative; }
.s-window.is-resizing :is(.s-window__pane, .s-window__col, .s-titlebar, .s-window__reveal) { transition: none !important; }
.s-window.is-resizing { user-select: none; -webkit-user-select: none; cursor: col-resize; }
.s-window__sidebar { flex: none; width: var(--w-sidebar); height: 100%; box-sizing: border-box; background: var(--surface-sidebar); overflow: auto; }
.s-window__sidebar .s-sidebar { min-height: 100%; width: 100%; padding-top: 8px; background: none; }
.s-window__content { flex: 1 1 0; min-width: 0; min-height: 0; overflow: auto; position: relative; }
.s-window__inspector, .s-window__inspector-body { flex: none; width: var(--w-inspector); height: 100%; box-sizing: border-box; background: var(--surface-sidebar); overflow: auto; position: relative; }
.s-window__inspector::before, .s-window__inspector-body::before, .s-window__col--list::after { content: ''; position: absolute; top: 0; bottom: 0; left: 0; width: 1px; background: var(--line-separator); }
.s-window__col--list { position: relative; }
.s-window__col--list::after { left: auto; right: 0; z-index: 2; }

/* split toolbar: one column per region, the toolbar sits on top of each column */
.s-window__split { flex: 1 1 0; min-height: 0; display: flex; }
.s-window__col { display: flex; flex-direction: column; min-width: 0; min-height: 0; position: relative; }
.s-window__col--sidebar { flex: none; width: var(--w-sidebar); background: var(--surface-sidebar); }
.s-window__col--sidebar > * { width: var(--w-sidebar); flex: none; box-sizing: border-box; }
.s-window__col--sidebar .s-window__sidebar { flex: 1 1 0; height: auto; background: none; }
.s-window__col--list { flex: none; width: var(--w-list); }
.s-window__list { flex: 1 1 0; min-height: 0; overflow: auto; }
.s-window__col--content { flex: 1 1 0; }
.s-window__col--inspector { flex: none; width: var(--w-inspector); background: var(--surface-sidebar); }
.s-window__col--inspector > * { width: var(--w-inspector); flex: none; box-sizing: border-box; }
.s-window__col--inspector .s-window__inspector-body { flex: 1 1 0; height: auto; background: none; }
.s-window__col--inspector::before { content: ''; position: absolute; top: 0; bottom: 0; left: 0; width: 1px; background: var(--line-separator); z-index: 2; }
.s-window__col--inspector .s-window__inspector-body::before { display: none; }
.s-window__col--sidebar .s-titlebar, .s-window__col--inspector .s-titlebar { background: none; }
.s-window__col--sidebar .s-titlebar--sidebar { backdrop-filter: none; }
.s-window__col .s-titlebar { position: relative; z-index: 1; }

/* drag handles on the inner edge of a pane */
.s-window__grip { position: absolute; top: 0; bottom: 0; width: 8px; z-index: 5; cursor: col-resize; touch-action: none; }
.s-window__grip--sidebar { right: 0; }
.s-window__grip--inspector { left: 0; }
.s-window__col--sidebar > .s-window__grip, .s-window__col--inspector > .s-window__grip { width: 8px; }
.s-window__col--sidebar > .s-window__grip--sidebar { left: calc(var(--w-sidebar) - 8px); right: auto; }

/* split toolbar: the controls are laid over the sidebar section; the content section makes room for them once the sidebar is gone */
.s-window__lights { position: absolute; left: 0; top: 0; z-index: 6; display: flex; align-items: center; height: 52px; padding-left: 20px; }
.s-window .s-window__col--sidebar .s-titlebar--unified.s-titlebar--sidebar { padding-left: 94px; }
.s-window__col--list .s-titlebar, .s-window__col--content .s-titlebar { transition: padding-left var(--spring-panel); }
/* whichever column is first once the sidebar is gone clears the controls: the list in a three-column window, else the content */
.s-window.is-sidebar-closed .s-window__col--list .s-titlebar--unified.s-titlebar--list { padding-left: 94px; }
.s-window.is-sidebar-closed:not(.has-list) .s-window__col--content .s-titlebar--unified.s-titlebar--content { padding-left: 94px; }
.s-window__fill { flex: 1 1 0; }
/* a toggle that appears in the content section when its pane is folded: it takes room and fades in as the pane goes */
.s-window__reveal { display: flex; align-items: center; flex: none; height: 100%; width: 0; overflow: hidden; opacity: 0; transition: width var(--spring-panel), opacity var(--fade-quick); }
.s-window__reveal.is-shown { width: 44px; opacity: 1; }
.s-window__reveal--lead { order: -1; }
.s-window__reveal:not(.is-shown) { visibility: hidden; transition: width var(--spring-panel), opacity var(--fade-quick), visibility 0s linear 0.2s; }
.s-window__col--content .s-titlebar > .s-window__reveal:last-child { margin-left: auto; }

/* utility palette */
.s-window__bar--utility { height: 40px; background: none; }
.s-window__utitle { display: flex; justify-content: center; font: var(--font-label); font-weight: 600; color: var(--text-secondary); }
.s-window__bar--utility .s-titlebar__center { align-items: center; }

/* attached sheet */
.s-window__scrim { position: absolute; left: 0; right: 0; bottom: 0; top: 48px; background: var(--brand-ink); opacity: 0.16; /* the kit's scrim is ink in both themes */ z-index: 10; border-radius: 0 0 var(--radius-window) var(--radius-window); }
.s-window__sheet { position: absolute; top: 40px; left: 50%; transform: translateX(-50%); z-index: 11; }

/* sheet in / out (dialogs.md, appearing and closing): the veil fades, the card fades in moving down 20 pt, no scaling; it fades out in place */
.s-veil-enter-active, .s-veil-leave-active { transition: opacity var(--fade-standard); }
.s-veil-enter-from, .s-veil-leave-to { opacity: 0; }
.s-sheet-enter-active { transition: opacity var(--fade-standard), translate var(--spring-panel); }
.s-sheet-leave-active { transition: opacity var(--fade-instant); }
.s-sheet-enter-from { opacity: 0; translate: 0 -20px; }
.s-sheet-leave-to { opacity: 0; }
@media (prefers-reduced-motion: reduce) { .s-sheet-enter-active { transition: opacity var(--fade-quick); } .s-sheet-enter-from { translate: none; } }
</style>
