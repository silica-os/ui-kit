<script setup>
import { computed } from 'vue'
import SGlassPanel from './SGlassPanel.vue'
import SIcon from './SIcon.vue'
import SSlider from './SSlider.vue'

/**
 * A module of the Control Center on Regular glass. `kind`:
 *  - toggle (140 x 64): a round disc with a glyph, `title`, `subtitle` (the state). The disc turns the module on / off (`v-model`);
 *    the text opens its detail (`detail` event, the chevron shows on hover when `detail` is set).
 *  - tile (64 x 64): a round button with a glyph; accent when on.
 *  - slider (292 x 64): `title`, a slider between two glyphs (`v-model` 0..100) and an optional round `output` button (headphones).
 *  - playing (140 x 140): artwork, `title`, `subtitle` (artist) and previous / play-pause / next; `v-model` is the playing state.
 *  - pill (116 x 24): small label button (Edit Controls), or with `glyph` + `tint` the privacy pill (app tile, label).
 */
const props = defineProps({
  kind: { type: String, default: 'toggle', validator: (v) => ['toggle', 'tile', 'slider', 'playing', 'pill'].includes(v) },
  modelValue: { type: [Boolean, Number], default: false },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  glyph: { type: String, default: '' },
  minGlyph: { type: String, default: '' },
  maxGlyph: { type: String, default: '' },
  output: { type: String, default: '' },
  tint: { type: String, default: '' },
  detail: Boolean,
  /** hover shows the hover look without the pointer (showcase) */
  force: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue', 'detail', 'prev', 'next', 'output', 'click'])
const on = computed(() => props.modelValue === true)
const radius = computed(() => ({ toggle: 32, tile: 32, slider: 28, playing: 36, pill: 12 })[props.kind])
</script>

<template>
  <SGlassPanel smooth class="s-cmod" :class="[`s-cmod--${props.kind}`, { 'is-on': on, 's-cmod--noout': kind === 'slider' && !output }, force && `is-${force}`]" :radius="radius">
    <template v-if="kind === 'toggle'">
      <button type="button" class="s-control s-cmod__disc" role="switch" :aria-checked="on" :aria-label="title" @click="emit('update:modelValue', !on)"><SIcon :name="glyph" :size="24" /></button>
      <button type="button" class="s-control s-cmod__text" @click="emit('detail')">
        <span class="s-cmod__title">{{ title }}</span><span class="s-cmod__sub">{{ subtitle }}</span>
      </button>
      <SIcon v-if="detail" name="chevron-right" :size="16" class="s-cmod__chev" />
    </template>

    <button v-else-if="kind === 'tile'" type="button" class="s-control s-cmod__tile" role="switch" :aria-checked="on" :aria-label="title" @click="emit('update:modelValue', !on)"><SIcon :name="glyph" :size="24" /></button>

    <template v-else-if="kind === 'slider'">
      <span class="s-cmod__title s-cmod__title--top">{{ title }}</span>
      <div class="s-cmod__sliderrow">
        <SIcon :name="minGlyph" :size="20" class="s-cmod__g" />
        <SSlider :model-value="Number(modelValue)" :aria-label="title" @update:model-value="emit('update:modelValue', $event)" />
        <SIcon :name="maxGlyph" :size="20" class="s-cmod__g" />
      </div>
      <button v-if="output" type="button" class="s-control s-cmod__output" :aria-label="output" @click="emit('output')"><SIcon :name="output" :size="20" /></button>
    </template>

    <template v-else-if="kind === 'playing'">
      <span class="s-cmod__art" :style="tint ? { background: tint } : null"><SIcon name="music-note" :size="20" /></span>
      <span class="s-cmod__title s-cmod__title--np">{{ title }}</span>
      <span class="s-cmod__sub s-cmod__sub--np">{{ subtitle }}</span>
      <div class="s-cmod__transport">
        <button type="button" class="s-control s-cmod__t" aria-label="Previous" @click="emit('prev')"><SIcon name="skip-backward" :size="20" /></button>
        <button type="button" class="s-control s-cmod__t" :aria-label="on ? 'Pause' : 'Play'" @click="emit('update:modelValue', !on)"><SIcon :name="on ? 'pause' : 'play'" :size="20" /></button>
        <button type="button" class="s-control s-cmod__t" aria-label="Next" @click="emit('next')"><SIcon name="skip-forward" :size="20" /></button>
      </div>
    </template>

    <button v-else type="button" class="s-control s-cmod__pill" @click="emit('click')">
      <span v-if="glyph" class="s-cmod__app" :style="tint ? { background: tint } : null"><SIcon :name="glyph" :size="12" /></span>
      <span class="s-cmod__pilltext">{{ title }}</span>
    </button>
  </SGlassPanel>
</template>

<style>
.s-cmod { position: relative; box-sizing: border-box; flex: none; color: var(--text-primary); font: var(--font-body); }
.s-cmod--toggle { width: 140px; height: 64px; }
.s-cmod--tile { width: 64px; height: 64px; }
.s-cmod--slider { width: 292px; height: 64px; }
.s-cmod--playing { width: 140px; height: 140px; }
.s-cmod--pill { height: 24px; width: max-content; min-width: 116px; }
:where(.s-cmod) button { font: inherit; color: inherit; border: 0; background: none; padding: 0; margin: 0; cursor: default; }
.s-cmod__title { font: var(--font-headline); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.s-cmod__sub { font: var(--font-caption); color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* toggle */
.s-cmod__disc { position: absolute; left: 16px; top: 14px; display: grid; place-items: center; width: 36px; height: 36px; border-radius: 18px; background: var(--text-tertiary); color: #fff; transition: background var(--fade-quick); }
.s-cmod.is-on > .s-cmod__disc { background: var(--accent-amalfi); }
.s-cmod__disc:focus-visible { box-shadow: 0 0 0 3px var(--line-focus); }
.s-cmod__text { position: absolute; left: 60px; top: 16px; right: 12px; display: flex; flex-direction: column; align-items: flex-start; text-align: left; min-width: 0; }
.s-cmod__text .s-cmod__title, .s-cmod__text .s-cmod__sub { max-width: 100%; }
.s-cmod__chev { position: absolute; right: 12px; top: 24px; color: var(--text-secondary); opacity: 0; transition: opacity var(--fade-quick); }
.s-cmod:is(:hover, .is-hover) > .s-cmod__chev { opacity: 1; }
.s-cmod--toggle:is(:hover, .is-hover) .s-cmod__text { right: 28px; }

/* tile */
.s-cmod__tile { position: absolute; inset: 0; display: grid; place-items: center; border-radius: 32px; color: var(--text-secondary); transition: background var(--fade-quick); }
.s-cmod.is-on > .s-cmod__tile { background: var(--accent-amalfi); color: var(--text-on-accent); }
.s-cmod__tile:focus-visible { box-shadow: 0 0 0 3px var(--line-focus); }

/* slider */
.s-cmod__title--top { position: absolute; left: 16px; top: 8px; width: 200px; }
.s-cmod__sliderrow { position: absolute; left: 16px; top: 34px; display: flex; align-items: center; gap: 4px; height: 20px; }
.s-cmod__sliderrow .s-slider { --s-slider-w: 172px; gap: 0; }
.s-cmod--noout .s-cmod__sliderrow .s-slider { --s-slider-w: 220px; } /* no output button: the slider takes its room (kit: 220 pt) */
.s-cmod__g { color: var(--text-secondary); }
.s-cmod__output { position: absolute; right: 12px; top: 20px; display: grid; place-items: center; width: 28px; height: 28px; border-radius: 14px; background: var(--text-tertiary); color: #fff; }

.s-cmod__sliderrow .s-slider__thumb { opacity: 0; transition: opacity var(--fade-quick); }
.s-cmod__sliderrow .s-slider__body:is(:hover, :focus-visible, .is-dragging) .s-slider__thumb { opacity: 1; }

/* now playing */
.s-cmod__art { position: absolute; left: 12px; top: 12px; display: grid; place-items: center; width: 40px; height: 40px; border-radius: 8px; background: var(--palette-terracotta); color: #fff; }
.s-cmod__title--np { position: absolute; left: 12px; top: 64px; width: 116px; }
.s-cmod__sub--np { position: absolute; left: 12px; top: 84px; width: 116px; }
.s-cmod__transport { position: absolute; left: 0; right: 0; top: 104px; display: flex; justify-content: space-between; padding: 0 20px; }
.s-cmod__t { display: grid; place-items: center; width: 20px; height: 20px; }

/* pill */
.s-cmod__pill { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 0 8px; border-radius: 12px; font: var(--font-label); }
.s-cmod__pill:focus-visible { box-shadow: 0 0 0 3px var(--line-focus); }
.s-cmod__app { display: grid; place-items: center; width: 16px; height: 16px; border-radius: 4px; background: var(--palette-lavanda); color: #fff; }
.s-cmod--pill:has(.s-cmod__app) { min-width: 160px; }
.s-cmod--pill:has(.s-cmod__app) .s-cmod__pill { justify-content: flex-start; } /* kit: tile at 8, text left-aligned at 32 */
.s-cmod--pill .s-cmod__pilltext { padding: 0; }
</style>
