<script>
export const meta = { title: 'Color and image wells', order: 170 }
</script>

<script setup>
import { computed, reactive, ref } from 'vue'
import SColorWell from '../../lib/SColorWell.vue'
import SColorPanel from '../../lib/SColorPanel.vue'
import SImageWell from '../../lib/SImageWell.vue'
import SSwatchChip from '../../lib/SSwatchChip.vue'
import SSwatchRow from '../../lib/SSwatchRow.vue'
import SPopover from '../../lib/SPopover.vue'
import DocPage from '../DocPage.vue'
import Stage from '../Stage.vue'
import Code from '../Code.vue'
import CompareMatrix from '../CompareMatrix.vue'

const cap = (s) => s[0].toUpperCase() + s.slice(1)
const p = reactive({ variant: 'default', disabled: false })
const color = ref('#0E77E6')
const img = ref('')
const code = computed(() => `<SColorWell v-model="color" variant="${p.variant}"${p.disabled ? ' disabled' : ''} />
<SImageWell v-model="image" size="regular" />
<SSwatchRow v-model="color" :swatches="[{ name: 'Amalfi', color: '#0E77E6' }]" />`)
const wellStates = [{ key: 'Rest', label: 'Rest', force: '' }, { key: 'Hover', label: 'Hover', force: 'hover' }, { key: 'Focused', label: 'Focused', force: 'focus' }, { key: 'Disabled', label: 'Disabled', disabled: true }]
const variants = ['default', 'expanded', 'minimal'].map((s) => ({ key: s, label: s }))
const sizes = ['small', 'regular', 'large'].map((s) => ({ key: s, label: s }))
const empty = [{ key: 'Rest', label: 'Rest' }, { key: 'Drag Over', label: 'Drag over', force: 'dragover' }, { key: 'Disabled', label: 'Disabled', disabled: true }]
const filled = [{ key: 'Rest', label: 'Rest' }, { key: 'Focused', label: 'Focused', force: 'focus' }, { key: 'Disabled', label: 'Disabled', disabled: true }]
const row = [
  [['Amalfi', 'var(--accent-amalfi)'], ['Limone', 'var(--palette-limone)'], ['Terracotta', 'var(--palette-terracotta)'], ['Bouganville', 'var(--palette-bouganville)'], ['Ulivo', 'var(--palette-ulivo)'], ['Mare', 'var(--palette-mare)']],
  [['Lavanda', 'var(--palette-lavanda)'], ['Amalfi Pressed', 'var(--accent-amalfi-pressed)'], ['Text Primary', 'var(--text-primary)'], ['Text Secondary', 'var(--text-secondary)'], ['Text Tertiary', 'var(--text-tertiary)'], ['Surface Sunken', 'var(--surface-sunken)']],
].map((r) => r.map(([name, c]) => ({ name, color: c })))
</script>

<template>
  <DocPage title="Color and image wells" lead="The colour well shows a colour and opens a colour panel (swatches, saturation/brightness pad, hue slider, hex field). The image well takes a dropped or chosen image and clears it. Swatch chips and rows are the pieces of the panel.">
    <h2>Playground</h2>
    <div class="play">
      <Stage :pad="48" class="grow">
        <div class="col">
          <SColorWell v-model="color" :variant="p.variant" :disabled="p.disabled" />
          <div class="row"><SImageWell v-model="img" :disabled="p.disabled" /><SImageWell v-model="img" size="small" :disabled="p.disabled" /></div>
          <span class="muted">colour {{ color }} · {{ img ? 'image set' : 'no image: drop a file or click' }}</span>
        </div>
      </Stage>
      <div class="card ctrl">
        <div class="field"><label>Color well</label><div class="seg"><button v-for="s in variants" :key="s.key" :class="{ on: p.variant === s.key }" @click="p.variant = s.key">{{ s.label }}</button></div></div>
        <label class="chk"><input v-model="p.disabled" type="checkbox" /> disabled</label>
      </div>
    </div>
    <Code :code="code" />

    <h2>Color well, compared with the kit</h2>
    <CompareMatrix :rows="wellStates" :cols="variants" :kit="(r, c) => `Wells/Color Well/${cap(c.key)}/${r.key}`">
      <template #default="{ row, col }"><SColorWell model-value="#0E77E6" :variant="col.key" :name="col.key === 'expanded' ? 'Amalfi blue' : ''" :force="row.force" :disabled="row.disabled" /></template>
    </CompareMatrix>

    <h2>Color panel, compared with the kit</h2>
    <CompareMatrix :rows="[{ key: 'one', label: 'Swatch grid' }]" :cols="[{ key: 'x', label: 'Panel' }]" glass :kit="() => 'Wells/Color Panel/Swatch Grid/Rest'">
      <template #default><SPopover :arrow="false" :padding="12"><SColorPanel model-value="#0E77E6" swatches-only /></SPopover></template>
    </CompareMatrix>
    <h3>Full panel</h3>
    <Stage glass :pad="24"><SPopover :arrow="false" :padding="12"><SColorPanel v-model="color" /></SPopover></Stage>

    <h2>Swatch chip and row, compared with the kit</h2>
    <CompareMatrix :rows="[{ key: 'Rest', label: 'Rest' }, { key: 'Selected', label: 'Selected', selected: true }]" :cols="[{ key: 'x', label: 'Chip' }]" :kit="(r) => `Wells/Swatch Chip/${r.key}`">
      <template #default="{ row }"><SSwatchChip color="var(--accent-amalfi)" :selected="row.selected" /></template>
    </CompareMatrix>
    <CompareMatrix :rows="[{ key: 'Row 1', label: 'Row 1', i: 0, sel: 0 }, { key: 'Row 2', label: 'Row 2', i: 1, sel: -1 }]" :cols="[{ key: 'x', label: 'Row' }]" :kit="(r) => `Wells/Swatch Row/${r.key}/Rest`">
      <template #default="{ row: r }"><SSwatchRow :swatches="row[r.i]" :selected="r.sel" /></template>
    </CompareMatrix>

    <h2>Image well, compared with the kit</h2>
    <h3>Empty</h3>
    <CompareMatrix :rows="empty" :cols="sizes" :kit="(r, c) => `Wells/Image Well/Empty/${cap(c.key)}/${r.key}`">
      <template #default="{ row, col }"><SImageWell :size="col.key" :force="row.force" :disabled="row.disabled" /></template>
    </CompareMatrix>
    <h3>Filled</h3>
    <CompareMatrix :rows="filled" :cols="sizes" :kit="(r, c) => `Wells/Image Well/Filled/${cap(c.key)}/${r.key}`">
      <template #default="{ row, col }">
        <SImageWell :size="col.key" :force="row.force" :disabled="row.disabled">
          <span class="scene"><i class="sun" /><i class="hill" /><i class="sea" /></span>
        </SImageWell>
      </template>
    </CompareMatrix>
  </DocPage>
</template>

<style scoped>
.play { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 16px; align-items: stretch; margin-bottom: 8px; }
.grow { justify-content: center; min-height: 260px; }
.col { display: flex; flex-direction: column; gap: 14px; align-items: flex-start; }
.row { display: flex; gap: 12px; align-items: center; }
.ctrl { padding: 16px; display: flex; flex-direction: column; gap: 14px; }
.chk { display: flex; gap: 6px; align-items: center; }
/* the kit's scene, in percentages of the well: sky, sun, sea, hill */
.scene { position: absolute; inset: 0; background: var(--palette-limone); }
.scene i { position: absolute; display: block; }
.sun { left: 53.3%; top: 20%; width: 23.3%; height: 23.3%; border-radius: 50%; background: var(--palette-terracotta); }
.sea { left: 0; right: 0; bottom: 0; height: 36.7%; background: var(--accent-amalfi); }
.hill { left: 13.3%; top: 50%; width: 40%; height: 13.3%; border-radius: 7px; background: var(--palette-ulivo); }
</style>
