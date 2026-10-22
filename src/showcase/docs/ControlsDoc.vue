<script>
export const meta = { title: 'Slider, Stepper, Progress', order: 40 }
</script>

<script setup>
import { computed, reactive, ref } from 'vue'
import SSlider from '../../lib/SSlider.vue'
import SStepper from '../../lib/SStepper.vue'
import SProgress from '../../lib/SProgress.vue'
import STextField from '../../lib/STextField.vue'
import DocPage from '../DocPage.vue'
import Stage from '../Stage.vue'
import Code from '../Code.vue'
import CompareMatrix from '../CompareMatrix.vue'

const cap = (s) => s[0].toUpperCase() + s.slice(1)
const volume = ref(60)
const vertical = ref(40)
const qty = ref(3)
const pr = reactive({ value: 60, indeterminate: false })
const code = computed(
  () => `<SSlider v-model="volume" :min="0" :max="100" ticks min-icon="volume-0" max-icon="volume-2" />
<SStepper v-model="qty" :min="0" :max="10" />
<SProgress :value="${pr.indeterminate ? 'null' : pr.value}" />
<SProgress kind="spinner" />`,
)

const sliderStates = [
  { key: 'Rest', label: 'Rest', force: '' }, { key: 'Hover', label: 'Hover', force: 'hover' }, { key: 'Pressed', label: 'Pressed', force: 'pressed' },
  { key: 'Focused', label: 'Focused', force: 'focus' }, { key: 'Disabled', label: 'Disabled', force: '', disabled: true },
]
const sliderRows = [...sliderStates, { key: 'Dragging', label: 'Dragging', force: 'drag' }]
const sliderCols = [{ key: 'Plain', label: 'Plain' }, { key: 'Ticks', label: 'Ticks' }, { key: 'Glyphs', label: 'Glyphs' }]
const sliderKit = (r, c) => (r.key === 'Dragging' ? (c.key === 'Plain' ? 'Sliders/Horizontal/Dragging/Pressed' : null) : `Sliders/Horizontal/${c.key}/${r.key}`)

const stepStates = ['Rest', 'Hover Up', 'Hover Down', 'Pressed Up', 'Pressed Down', 'Focused', 'Disabled'].map((k) => ({
  key: k, label: k, force: k === 'Focused' ? 'focus' : k.includes('Up') || k.includes('Down') ? k.toLowerCase().replace(' ', '-') : '', disabled: k === 'Disabled',
}))
const stepCols = ['mini', 'small', 'regular', 'large'].map((s) => ({ key: s, label: s }))

const sizeCols = ['small', 'regular', 'large'].map((s) => ({ key: s, label: s }))
const detRows = [{ key: '25', label: '25%', v: 25 }, { key: '60', label: '60%', v: 60 }, { key: '100', label: '100%', v: 100 }, { key: 'Disabled', label: 'Disabled', v: 60, disabled: true }]
// the kit freezes the sliding segment at 0, 64 and 132 pt of a 200 pt bar (segment 72 pt wide, clipped by the end): 0.265 / 0.5 / 0.75 of the sweep
const indRows = [{ key: 'Phase 1', label: 'Phase 1', phase: 0.2647 }, { key: 'Phase 2', label: 'Phase 2', phase: 0.5 }, { key: 'Phase 3', label: 'Phase 3', phase: 0.75 }, { key: 'Disabled', label: 'Disabled', disabled: true, phase: 0.2647 }]
const spinRows = [{ key: 'Rest', label: 'Rest' }, { key: 'Disabled', label: 'Disabled', disabled: true }]
</script>

<template>
  <DocPage title="Slider, Stepper, Progress" lead="Value controls. The slider is a role=slider you can drag or drive with the keyboard, the stepper a spin button with hold-to-repeat, and progress a bar, ring or spinner.">
    <h2>Playground</h2>
    <div class="play">
      <Stage :pad="48" class="grow">
        <div class="col">
          <SSlider v-model="volume" ticks min-icon="volume-0" max-icon="volume-2" aria-label="Volume" />
          <div class="row">
            <SSlider v-model="volume" aria-label="Volume" /><STextField :model-value="String(volume)" size="small" style="--s-field-w: 48px" readonly />
          </div>
          <div class="row">
            <STextField :model-value="String(qty)" style="--s-field-w: 56px" readonly /><SStepper v-model="qty" :min="0" :max="10" aria-label="Quantity" />
          </div>
          <SProgress :value="pr.indeterminate ? null : pr.value" />
          <div class="row"><SProgress kind="circular" :value="pr.indeterminate ? null : pr.value" /><SProgress kind="spinner" /></div>
        </div>
        <SSlider v-model="vertical" vertical aria-label="Level" />
      </Stage>
      <div class="card ctrl">
        <div class="field"><label>Progress value</label><input v-model.number="pr.value" type="range" min="0" max="100" /></div>
        <label class="chk"><input v-model="pr.indeterminate" type="checkbox" /> indeterminate</label>
        <p class="muted">Drag the sliders, click or hold the stepper halves, or focus them and use the arrow keys, Home and End.</p>
      </div>
    </div>
    <Code :code="code" />

    <h2>Slider, compared with the kit</h2>
    <CompareMatrix :rows="sliderRows" :cols="sliderCols" :kit="sliderKit">
      <template #default="{ row, col }">
        <SSlider
          v-if="row.key !== 'Dragging' || col.key === 'Plain'" :model-value="60" :ticks="col.key === 'Ticks'" :min-icon="col.key === 'Glyphs' ? 'volume-0' : ''"
          :max-icon="col.key === 'Glyphs' ? 'volume-2' : ''" :force="row.force" :disabled="row.disabled"
          :style="row.key === 'Dragging' ? { height: '28px' } : null"
        />
      </template>
    </CompareMatrix>
    <h3>Vertical</h3>
    <CompareMatrix :rows="[{ key: 'v', label: 'Plain' }]" :cols="sliderStates" :kit="(r, c) => `Sliders/Vertical/Plain/${c.key}`">
      <template #default="{ col }"><SSlider :model-value="60" vertical :force="col.force" :disabled="col.disabled" /></template>
    </CompareMatrix>

    <h2>Stepper, compared with the kit</h2>
    <CompareMatrix :rows="stepStates" :cols="stepCols" :kit="(r, c) => `Steppers/Stepper/${cap(c.key)}/${r.key}`">
      <template #default="{ row, col }"><SStepper :size="col.key" :force="row.force" :disabled="row.disabled" /></template>
    </CompareMatrix>

    <h2>Progress bar, compared with the kit</h2>
    <CompareMatrix :rows="detRows" :cols="sizeCols" :kit="(r, c) => `Progress/Bar/Determinate/${cap(c.key)}/${r.key}`">
      <template #default="{ row, col }"><SProgress :value="row.v" :size="col.key" :disabled="row.disabled" /></template>
    </CompareMatrix>
    <h3>Indeterminate (live is animated, the kit shows three frames)</h3>
    <CompareMatrix :rows="indRows" :cols="sizeCols" :kit="(r, c) => `Progress/Bar/Indeterminate/${cap(c.key)}/${r.key}`">
      <template #default="{ row, col }"><SProgress :size="col.key" :disabled="row.disabled" :phase="row.phase" /></template>
    </CompareMatrix>

    <h2>Circular, compared with the kit</h2>
    <CompareMatrix :rows="detRows" :cols="sizeCols" :kit="(r, c) => `Progress/Circular/Determinate/${cap(c.key)}/${r.key}`">
      <template #default="{ row, col }"><SProgress kind="circular" :value="row.v" :size="col.key" :disabled="row.disabled" /></template>
    </CompareMatrix>

    <h2>Spinner, compared with the kit</h2>
    <CompareMatrix :rows="spinRows" :cols="sizeCols" :kit="(r, c) => `Progress/Spinner/${cap(c.key)}/${r.key}`">
      <template #default="{ row, col }"><SProgress kind="spinner" :size="col.key" :disabled="row.disabled" paused /></template>
    </CompareMatrix>
  </DocPage>
</template>

<style scoped>
.play { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 16px; align-items: stretch; }
.grow { min-height: 260px; justify-content: center; gap: 48px; }
.col { display: flex; flex-direction: column; gap: 18px; align-items: flex-start; }
.row { display: flex; gap: 12px; align-items: center; }
.ctrl { padding: 16px; display: flex; flex-direction: column; gap: 14px; }
.chk { display: flex; gap: 6px; align-items: center; }
</style>
