<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'

/**
 * Scroll area (Scrollbars/Area): content scrolls natively (wheel, touch, keyboard, find) while the platform scrollbars are hidden and
 * replaced by drawn ones kept in sync. `mode="overlay"` floats thin thumbs over the content that appear while scrolling or hovering and
 * grow into a track when you point at them; `mode="legacy"` reserves 16 pt for an always visible track (and a corner when both show).
 * Drag a thumb, or click the track to scroll by a page. Size it with a width / height on the element (class or style).
 */
const props = defineProps({
  mode: { type: String, default: 'overlay', validator: (v) => ['overlay', 'legacy'].includes(v) },
  /** x | y | both: which directions can scroll */
  axis: { type: String, default: 'both', validator: (v) => ['x', 'y', 'both'].includes(v) },
  /** overlay: thin | expanded | dragging, legacy: hover. Shows that look without a pointer (documentation). */
  force: { type: String, default: '' },
  /** keep the overlay thumbs visible */
  persistent: Boolean,
  disabled: Boolean,
})
const view = ref(null)
const m = reactive({ st: 0, sl: 0, ch: 0, cw: 0, sh: 0, sw: 0 })
const shown = ref(false)
const hoverArea = ref(false)
const hoverBar = ref('')
const drag = ref('')
let hideTimer = 0
let ro

const canY = computed(() => props.axis !== 'x' && m.sh > m.ch + 1)
const canX = computed(() => props.axis !== 'y' && m.sw > m.cw + 1)
const both = computed(() => canX.value && canY.value)
// the track length: overlay bars stop 12 short of the other bar when both show, legacy ones 16 (the corner)
const trackLen = (full, other) => full - (other ? (props.mode === 'legacy' ? 16 : 12) : 0)
function thumbOf(client, scroll, pos, other) {
  const len = trackLen(client, other)
  const size = Math.max(24, Math.min(len, (client / scroll) * len))
  const max = scroll - client
  return { size, off: max > 0 ? (pos / max) * (len - size) : 0, len }
}
const ty = computed(() => thumbOf(m.ch, m.sh, m.st, canX.value))
const tx = computed(() => thumbOf(m.cw, m.sw, m.sl, canY.value))

function measure() {
  const v = view.value
  if (!v) return
  Object.assign(m, { st: v.scrollTop, sl: v.scrollLeft, ch: v.clientHeight, cw: v.clientWidth, sh: v.scrollHeight, sw: v.scrollWidth })
}
function reveal() {
  shown.value = true
  clearTimeout(hideTimer)
  hideTimer = setTimeout(() => (shown.value = false), 900)
}
function onScroll() { measure(); reveal() }
onMounted(() => {
  measure()
  ro = new ResizeObserver(measure)
  ro.observe(view.value)
  for (const c of view.value.children) ro.observe(c)
  nextTick(measure)
})
onBeforeUnmount(() => { ro?.disconnect(); clearTimeout(hideTimer) })

// dragging a thumb
let start = null
function thumbDown(dir, e) {
  if (props.disabled) return
  const t = dir === 'y' ? ty.value : tx.value
  start = { dir, p: dir === 'y' ? e.clientY : e.clientX, pos: dir === 'y' ? m.st : m.sl, t }
  drag.value = dir
  e.currentTarget.setPointerCapture(e.pointerId)
  e.preventDefault()
}
function thumbMove(e) {
  if (!start) return
  const { dir, t } = start
  const delta = (dir === 'y' ? e.clientY : e.clientX) - start.p
  const room = t.len - t.size
  const max = dir === 'y' ? m.sh - m.ch : m.sw - m.cw
  const next = start.pos + (room > 0 ? (delta / room) * max : 0)
  view.value[dir === 'y' ? 'scrollTop' : 'scrollLeft'] = next
}
function thumbUp(e) {
  start = null
  drag.value = ''
  if (e.currentTarget.hasPointerCapture?.(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
  reveal()
}
// clicking the track scrolls a page towards the click
function trackDown(dir, e) {
  if (e.target !== e.currentTarget || props.disabled) return
  const r = e.currentTarget.getBoundingClientRect()
  const t = dir === 'y' ? ty.value : tx.value
  const p = dir === 'y' ? e.clientY - r.top : e.clientX - r.left
  const sign = p < t.off + t.size / 2 ? -1 : 1
  const page = (dir === 'y' ? m.ch : m.cw) * 0.9
  view.value.scrollBy({ [dir === 'y' ? 'top' : 'left']: sign * page, behavior: 'smooth' })
  e.preventDefault()
}

const visible = computed(() => props.persistent || !!props.force || shown.value || hoverArea.value || !!drag.value)
const look = (dir) => {
  if (props.mode === 'legacy') return props.force === 'hover' || hoverBar.value === dir || drag.value === dir ? 'hover' : 'rest'
  if (drag.value === dir || props.force === 'dragging') return 'dragging'
  if (props.force === 'expanded' || hoverBar.value === dir) return 'expanded'
  return 'thin'
}
defineExpose({ el: view, scrollTo: (...a) => view.value?.scrollTo(...a) })
</script>

<template>
  <div
    class="s-scroll" :class="[`s-scroll--${mode}`, { 'is-visible': visible, 'is-disabled': disabled, 'has-y': canY, 'has-x': canX, 'has-both': both }]"
    @pointerenter="hoverArea = true" @pointerleave="hoverArea = false"
  >
    <div ref="view" class="s-scroll__view" :class="`s-scroll__view--${axis}`" tabindex="-1" @scroll.passive="onScroll"><slot /></div>
    <div
      v-if="canY" class="s-scroll__bar s-scroll__bar--y" :class="`is-${look('y')}`" :style="{ height: ty.len + 'px' }" role="scrollbar" aria-orientation="vertical"
      :aria-valuenow="Math.round(m.st)" aria-controls="" @pointerenter="hoverBar = 'y'" @pointerleave="hoverBar = ''" @pointerdown="trackDown('y', $event)"
    >
      <span class="s-scroll__thumb" :style="{ height: ty.size + 'px', transform: `translateY(${ty.off}px)` }" @pointerdown="thumbDown('y', $event)" @pointermove="thumbMove" @pointerup="thumbUp" @pointercancel="thumbUp" />
    </div>
    <div
      v-if="canX" class="s-scroll__bar s-scroll__bar--x" :class="`is-${look('x')}`" :style="{ width: tx.len + 'px' }" role="scrollbar" aria-orientation="horizontal"
      :aria-valuenow="Math.round(m.sl)" @pointerenter="hoverBar = 'x'" @pointerleave="hoverBar = ''" @pointerdown="trackDown('x', $event)"
    >
      <span class="s-scroll__thumb" :style="{ width: tx.size + 'px', transform: `translateX(${tx.off}px)` }" @pointerdown="thumbDown('x', $event)" @pointermove="thumbMove" @pointerup="thumbUp" @pointercancel="thumbUp" />
    </div>
    <span v-if="mode === 'legacy' && both" class="s-scroll__corner" />
  </div>
</template>

<style>
.s-scroll { position: relative; overflow: hidden; width: 264px; height: 180px; border-radius: 12px; background: var(--surface-raised); color: var(--text-primary); }
.s-scroll::after { content: ''; position: absolute; inset: 0; border-radius: inherit; box-shadow: inset 0 0 0 1px var(--line-border); pointer-events: none; z-index: 3; }
.s-scroll.is-disabled { opacity: 0.35; }
.s-scroll__view { position: absolute; inset: 0; overflow: auto; scrollbar-width: none; outline: none; overscroll-behavior: contain; }
.s-scroll__view::-webkit-scrollbar { display: none; }
.s-scroll__view--x { overflow-y: hidden; } .s-scroll__view--y { overflow-x: hidden; }
.s-scroll.is-disabled .s-scroll__view { overflow: hidden; }
.s-scroll--legacy.has-y > .s-scroll__view { right: 16px; }
.s-scroll--legacy.has-x > .s-scroll__view { bottom: 16px; }

.s-scroll__bar { position: absolute; z-index: 2; touch-action: none; user-select: none; -webkit-user-select: none; }
.s-scroll__bar--y { right: 0; top: 0; } .s-scroll__bar--x { left: 0; bottom: 0; }
.s-scroll__thumb { position: absolute; display: block; border-radius: 4px; background: var(--text-tertiary); transition: background var(--fade-quick); }
.s-scroll__bar--y .s-scroll__thumb { top: 0; }
.s-scroll__bar--x .s-scroll__thumb { left: 0; }
/* only the cross-axis geometry (thin <-> expanded) springs; the thumb's length and offset follow the scroll position 1:1 */
.s-scroll__bar--y .s-scroll__thumb { transition: background var(--fade-quick), left var(--spring-snappy), width var(--spring-snappy), border-radius var(--spring-snappy); }
.s-scroll__bar--x .s-scroll__thumb { transition: background var(--fade-quick), top var(--spring-snappy), height var(--spring-snappy), border-radius var(--spring-snappy); }

/* legacy: a 16 pt track, an 8 pt thumb inset 4 */
.s-scroll--legacy .s-scroll__bar--y { width: 16px; } .s-scroll--legacy .s-scroll__bar--x { height: 16px; }
.s-scroll--legacy .s-scroll__bar { background: var(--surface-sunken); }
.s-scroll--legacy .s-scroll__bar--y { box-shadow: inset 1px 0 0 var(--line-separator); }
.s-scroll--legacy .s-scroll__bar--x { box-shadow: inset 0 1px 0 var(--line-separator); }
.s-scroll--legacy .s-scroll__bar--y .s-scroll__thumb { left: 4px; width: 8px; }
.s-scroll--legacy .s-scroll__bar--x .s-scroll__thumb { top: 4px; height: 8px; }
.s-scroll--legacy .s-scroll__bar.is-hover .s-scroll__thumb { background: var(--text-secondary); }
.s-scroll__corner { position: absolute; right: 0; bottom: 0; z-index: 2; width: 16px; height: 16px; background: var(--surface-sunken); box-shadow: inset 0 0 0 1px var(--line-separator); }

/* overlay: 12 pt bars on the edge, hidden until needed; thin 4 pt thumb, an 8 pt thumb in a track when pointed at */
.s-scroll--overlay .s-scroll__bar { opacity: 0; transition: opacity var(--fade-slow), background var(--fade-quick), box-shadow var(--fade-quick); }
.s-scroll--overlay.is-visible .s-scroll__bar { opacity: 1; transition: opacity var(--fade-quick), background var(--fade-quick), box-shadow var(--fade-quick); }
.s-scroll--overlay .s-scroll__bar--y { width: 12px; } .s-scroll--overlay .s-scroll__bar--x { height: 12px; }
.s-scroll--overlay .s-scroll__bar--y .s-scroll__thumb { left: 4px; width: 4px; border-radius: 2px; }
.s-scroll--overlay .s-scroll__bar--x .s-scroll__thumb { top: 4px; height: 4px; border-radius: 2px; }
.s-scroll--overlay .s-scroll__bar:is(.is-expanded, .is-dragging) { background: var(--surface-sunken); box-shadow: inset 0 0 0 1px var(--line-separator); border-radius: 6px; }
.s-scroll--overlay .s-scroll__bar--y:is(.is-expanded, .is-dragging) .s-scroll__thumb { left: 2px; width: 8px; border-radius: 4px; }
.s-scroll--overlay .s-scroll__bar--x:is(.is-expanded, .is-dragging) .s-scroll__thumb { top: 2px; height: 8px; border-radius: 4px; }
.s-scroll--overlay .s-scroll__bar.is-expanded .s-scroll__thumb { background: var(--text-secondary); }
.s-scroll--overlay .s-scroll__bar.is-dragging .s-scroll__thumb { background: var(--text-primary); }

/* reduced motion: springs become the short fade (same as --fade-quick), no overshoot or scale */
@media (prefers-reduced-motion: reduce) {
  .s-scroll__bar--y .s-scroll__thumb, .s-scroll__bar--x .s-scroll__thumb { transition-duration: 150ms !important; transition-timing-function: cubic-bezier(0.2, 0, 0, 1) !important; }
}
</style>
