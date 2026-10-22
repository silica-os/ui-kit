<script>
export const meta = { title: 'Disclosure group, Dial', order: 180 }
</script>

<script setup>
import { computed, reactive, ref } from 'vue'
import SDisclosureGroup from '../../lib/SDisclosureGroup.vue'
import SDisclosureTriangle from '../../lib/SDisclosureTriangle.vue'
import SDial from '../../lib/SDial.vue'
import DocPage from '../DocPage.vue'
import Stage from '../Stage.vue'
import Code from '../Code.vue'
import CompareMatrix from '../CompareMatrix.vue'

const p = reactive({ disabled: false })
const open = ref(true)
const open2 = ref(false)
const angle = ref(62.5)
const code = computed(() => `<SDisclosureGroup v-model:open="open" title="Advanced options">Content…</SDisclosureGroup>
<SDial v-model="angle" :min="0" :max="100"${p.disabled ? ' disabled' : ''} />`)
const dialStates = [
  { key: 'Rest', label: 'Rest' }, { key: 'Hover', label: 'Hover', force: 'hover' }, { key: 'Pressed', label: 'Pressed', force: 'pressed' },
  { key: 'Focused', label: 'Focused', force: 'focus' }, { key: 'Disabled', label: 'Disabled', disabled: true },
]
const tri = [{ key: 'Rest', label: 'Rest', force: '' }, { key: 'Hover', label: 'Hover', force: 'hover' }, { key: 'Pressed', label: 'Pressed', force: 'pressed' }, { key: 'Disabled', label: 'Disabled', disabled: true }]
const text = 'The content of the group sits below its header and is indented to line up with the title.'
</script>

<template>
  <DocPage title="Disclosure group, Dial" lead="A collapsible section with an animated height, and a circular dial you turn by dragging around the ring. The dial has no glass lens in the kit (its pressed state is the pressed round thumb), so there is no lens to replace the thumb.">
    <h2>Playground</h2>
    <div class="play">
      <Stage :pad="32" class="grow">
        <div class="col">
          <SDisclosureGroup v-model:open="open" title="Advanced options" :disabled="p.disabled">{{ text }}</SDisclosureGroup>
          <SDisclosureGroup v-model:open="open2" title="More"><p style="margin: 0">Another section.</p><p style="margin: 4px 0 0">With two paragraphs.</p></SDisclosureGroup>
          <div class="row"><SDial v-model="angle" :disabled="p.disabled" /><span class="muted">{{ angle }}</span></div>
        </div>
      </Stage>
      <div class="card ctrl"><label class="chk"><input v-model="p.disabled" type="checkbox" /> disabled</label><span class="muted">Dial: drag around the ring, or focus it and use arrows, PageUp/PageDown, Home, End.</span></div>
    </div>
    <Code :code="code" />

    <h2>Disclosure group, compared with the kit</h2>
    <CompareMatrix :rows="[{ key: 'Closed', label: 'Closed' }, { key: 'Open', label: 'Open' }]" :cols="[{ key: 'x', label: 'Rest' }]" :kit="(r) => `Disclosure/Group/${r.key}/Rest`">
      <template #default="{ row }"><SDisclosureGroup title="Advanced options" :open="row.key === 'Open'">{{ text }}</SDisclosureGroup></template>
    </CompareMatrix>
    <h3>Header hover</h3>
    <CompareMatrix :rows="[{ key: 'Closed', label: 'Closed' }, { key: 'Open', label: 'Open' }]" :cols="[{ key: 'x', label: 'Hover' }]" :kit="(r) => `Disclosure/Group Header/${r.key}/Hover`">
      <template #default="{ row }"><SDisclosureGroup title="Advanced options" :open="row.key === 'Open'" force="hover" /></template>
    </CompareMatrix>

    <h2>Triangle, compared with the kit</h2>
    <CompareMatrix :rows="[{ key: 'Collapsed', label: 'Collapsed' }, { key: 'Expanded', label: 'Expanded' }]" :cols="tri" :kit="(r, c) => `Disclosure/Triangle/${r.key}/${c.key}`">
      <template #default="{ row, col }"><SDisclosureTriangle :expanded="row.key === 'Expanded'" :force="col.force" :disabled="col.disabled" /></template>
    </CompareMatrix>

    <h2>Dial, compared with the kit</h2>
    <CompareMatrix :rows="[{ key: 'one', label: 'Dial' }]" :cols="dialStates" :kit="(r, c) => `Sliders/Circular/Dial/${c.key}`">
      <template #default="{ col }"><SDial :model-value="62.5" :force="col.force" :disabled="col.disabled" /></template>
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
</style>
