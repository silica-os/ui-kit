<script>
export const meta = { title: 'Scroll area', order: 160 }
</script>

<script setup>
import { computed, reactive } from 'vue'
import SScrollArea from '../../lib/SScrollArea.vue'
import DocPage from '../DocPage.vue'
import Stage from '../Stage.vue'
import Code from '../Code.vue'
import CompareMatrix from '../CompareMatrix.vue'

const p = reactive({ mode: 'overlay', axis: 'both', disabled: false })
const code = computed(() => `<SScrollArea mode="${p.mode}" axis="${p.axis}"${p.disabled ? ' disabled' : ''} style="width: 264px; height: 180px">
  <div style="width: 480px">…content…</div>
</SScrollArea>`)
const lines = [[192, 4], [152, 8], [200, 4], [120, 8], [176, 4], [140, 8], [196, 4], [100, 8]]
const rows = (n = 3) => Array.from({ length: n }, (_, k) => lines.map(([w, h], i) => ({ k: k * 8 + i, w, h })))
const overlay = [{ key: 'Thin', label: 'Thin', force: 'thin' }, { key: 'Expanded', label: 'Expanded', force: 'expanded' }, { key: 'Dragging', label: 'Dragging', force: 'dragging' }]
const legacy = [{ key: 'Rest', label: 'Rest', force: '' }, { key: 'Hover', label: 'Hover', force: 'hover' }]
</script>

<template>
  <DocPage title="Scroll area" lead="Content scrolls natively; the scrollbars are drawn by the component and stay in sync. Overlay bars float over the content, appear while scrolling or hovering and grow when pointed at; legacy bars keep an always visible 16 pt track. Drag a thumb, click the track to move a page, use the wheel or the keyboard.">
    <h2>Playground</h2>
    <div class="play">
      <Stage :pad="32" class="grow">
        <SScrollArea :mode="p.mode" :axis="p.axis" :disabled="p.disabled" style="width: 264px; height: 180px">
          <div class="copy">
            <p v-for="n in 14" :key="n"><b>Line {{ n }}.</b> The terrace looks over the bay and the lemon groves climb the hill behind the house, row after row of them.</p>
          </div>
        </SScrollArea>
      </Stage>
      <div class="card ctrl">
        <div class="field"><label>Mode</label><div class="seg"><button v-for="s in ['overlay', 'legacy']" :key="s" :class="{ on: p.mode === s }" @click="p.mode = s">{{ s }}</button></div></div>
        <div class="field"><label>Axis</label><div class="seg"><button v-for="s in ['both', 'x', 'y']" :key="s" :class="{ on: p.axis === s }" @click="p.axis = s">{{ s }}</button></div></div>
        <label class="chk"><input v-model="p.disabled" type="checkbox" /> disabled</label>
      </div>
    </div>
    <Code :code="code" />

    <h2>Overlay, compared with the kit</h2>
    <CompareMatrix :rows="overlay" :cols="[{ key: 'x', label: 'Area' }]" :kit="(r) => (r.key === 'Dragging' ? null : `Scrollbars/Area/Overlay/${r.key}`)">
      <template #default="{ row }">
        <SScrollArea mode="overlay" :force="row.force" persistent>
          <div class="lines"><div v-for="(l, i) in lines" :key="i" :style="{ width: l[0] + 'px', height: l[1] + 'px' }" /><div v-for="n in 40" :key="'x' + n" class="gap" /><div style="width: 460px; height: 1px" /></div>
        </SScrollArea>
      </template>
    </CompareMatrix>

    <h2>Legacy, compared with the kit</h2>
    <CompareMatrix :rows="legacy" :cols="[{ key: 'x', label: 'Area' }]" :kit="(r) => `Scrollbars/Area/Legacy/${r.key}`">
      <template #default="{ row }">
        <SScrollArea mode="legacy" :force="row.force">
          <div class="lines"><div v-for="(l, i) in lines" :key="i" :style="{ width: l[0] + 'px', height: l[1] + 'px' }" /><div v-for="n in 40" :key="'x' + n" class="gap" /><div style="width: 460px; height: 1px" /></div>
        </SScrollArea>
      </template>
    </CompareMatrix>
  </DocPage>
</template>

<style scoped>
.play { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 16px; align-items: start; margin-bottom: 8px; }
.grow { justify-content: center; min-height: 240px; }
.ctrl { padding: 16px; display: flex; flex-direction: column; gap: 14px; }
.chk { display: flex; gap: 6px; align-items: center; }
.copy { width: 480px; padding: 12px 16px; font: var(--font-callout); color: var(--text-secondary); }
.copy p { margin: 0 0 8px; }
.lines { display: flex; flex-direction: column; gap: 12px; padding: 20px 16px; width: 460px; }
.lines > div { background: var(--line-border); border-radius: 3px; flex: none; }
.lines > .gap { background: none; height: 24px; }
</style>
