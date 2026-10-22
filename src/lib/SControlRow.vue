<script setup>
import SIcon from './SIcon.vue'
import SSlider from './SSlider.vue'

/**
 * A row of a Control Center detail pane (280 pt). `kind`:
 *  - item: a round glyph disc (accent when `active`) and a label (a sound output, a Focus mode); emits `click`
 *  - network: like item, with a lock (`secure`) and the signal glyph (`signal`: wifi-0…wifi-2)
 *  - slider: small glyph, slider (`v-model` 0..100), large glyph
 *  - section: the small grey section title (a chevron when `collapsible`)
 *  - footer: the "Settings…" line
 */
defineProps({
  kind: { type: String, default: 'item', validator: (v) => ['item', 'network', 'slider', 'section', 'footer'].includes(v) },
  label: { type: String, default: '' },
  glyph: { type: String, default: 'wifi' },
  active: Boolean,
  secure: Boolean,
  signal: { type: String, default: 'wifi-2' },
  modelValue: { type: Number, default: 0 },
  minGlyph: { type: String, default: '' },
  maxGlyph: { type: String, default: '' },
  collapsible: Boolean,
  open: { type: Boolean, default: true },
  force: { type: String, default: '' },
})
const emit = defineEmits(['click', 'update:modelValue', 'update:open'])
</script>

<template>
  <button v-if="kind === 'item' || kind === 'network'" type="button" class="s-control s-crow" :class="[`s-crow--${kind}`, { 'is-active': active }, force && `is-${force}`]" @click="emit('click')">
    <span class="s-crow__disc"><SIcon :name="glyph" :size="20" /></span>
    <span class="s-crow__label">{{ label }}</span>
    <SIcon v-if="kind === 'network' && secure" name="lock" :size="16" class="s-crow__lock" />
    <SIcon v-if="kind === 'network'" :name="signal" :size="20" class="s-crow__signal" />
  </button>
  <div v-else-if="kind === 'slider'" class="s-crow s-crow--slider">
    <SIcon :name="minGlyph" :size="20" class="s-crow__g" />
    <SSlider :model-value="modelValue" :aria-label="label" @update:model-value="emit('update:modelValue', $event)" />
    <SIcon :name="maxGlyph" :size="20" class="s-crow__g" />
  </div>
  <component :is="collapsible ? 'button' : 'div'" v-else-if="kind === 'section'" class="s-crow s-crow--section" :class="{ 's-control': collapsible }" :type="collapsible ? 'button' : undefined" @click="collapsible && emit('update:open', !open)">
    <span>{{ label }}</span><SIcon v-if="collapsible" :name="open ? 'chevron-down' : 'chevron-right'" :size="16" />
  </component>
  <button v-else type="button" class="s-control s-crow s-crow--footer" @click="emit('click')">{{ label }}</button>
</template>

<style>
.s-crow { display: flex; align-items: center; box-sizing: border-box; width: 100%; padding: 0; margin: 0; border: 0; background: none; color: var(--text-primary); font: var(--font-body); text-align: left; cursor: default; transition: background var(--fade-quick), color var(--fade-quick); }
.s-crow--item, .s-crow--network { height: 32px; gap: 12px; border-radius: 8px; }
.s-crow--network { padding-right: 8px; } /* kit: signal glyph 8 pt from the edge, the lock 8 pt before it */
.s-crow__disc { display: grid; place-items: center; flex: none; width: 28px; height: 28px; border-radius: 14px; background: var(--text-tertiary); color: #fff; transition: background var(--fade-quick); }
.s-crow.is-active .s-crow__disc { background: var(--accent-amalfi); }
.s-crow__label { flex: 1 1 0; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.s-crow__lock { color: var(--text-secondary); margin-right: -4px; }
.s-crow__signal { color: var(--text-primary); margin-right: 0; }
.s-crow--item:is(:hover, .is-hover) .s-crow__label, .s-crow--network:is(:hover, .is-hover) .s-crow__label { color: var(--text-primary); }
.s-crow--item:is(:hover, .is-hover), .s-crow--network:is(:hover, .is-hover) { background: var(--accent-amalfi-soft); }
.s-crow--item:focus-visible, .s-crow--network:focus-visible { box-shadow: 0 0 0 3px var(--line-focus); }
.s-crow--slider { height: 32px; gap: 8px; }
.s-crow--slider .s-slider { --s-slider-w: 220px; gap: 0; }
.s-crow__g { color: var(--text-secondary); flex: none; }
.s-crow--slider .s-crow__g:last-child { margin-left: -4px; } /* the kit leaves 4 pt, not 8, before the large glyph */
.s-crow--slider .s-slider__thumb { opacity: 0; transition: opacity var(--fade-quick); }
.s-crow--slider .s-slider__body:is(:hover, :focus-visible, .is-dragging) .s-slider__thumb { opacity: 1; }
.s-crow--section > .s-icon { color: var(--text-secondary); }
.s-crow--section { height: 20px; justify-content: space-between; font: var(--font-label); color: var(--text-tertiary); align-items: flex-start; padding-top: 2px; }
.s-crow--footer { height: 24px; border-radius: 6px; }
.s-crow--footer:is(:hover, :focus-visible) { color: var(--accent-amalfi); }
</style>
