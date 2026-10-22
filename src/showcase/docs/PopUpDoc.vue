<script>
export const meta = { title: 'Pop-up and pull-down buttons', order: 140 }
</script>

<script setup>
import { computed, reactive, ref } from 'vue'
import SPopUpButton from '../../lib/SPopUpButton.vue'
import SPullDownButton from '../../lib/SPullDownButton.vue'
import SGradientButton from '../../lib/SGradientButton.vue'
import SHelpButton from '../../lib/SHelpButton.vue'
import DocPage from '../DocPage.vue'
import Stage from '../Stage.vue'
import Code from '../Code.vue'
import CompareMatrix from '../CompareMatrix.vue'

const sizes = ['mini', 'small', 'regular', 'large']
const cap = (s) => s[0].toUpperCase() + s.slice(1)
const p = reactive({ size: 'regular', disabled: false })
const fruit = ref('Lemon')
const fruits = ['Orange', 'Lemon', 'Olive', 'Fig']
// the Open masters show the generic Simple menu: Olive highlighted; the pull-down one has a checked row
const openFruits = fruits.map((f) => ({ label: f, value: f, force: f === 'Olive' ? 'hover' : '' }))
const openActions = [{ label: 'New window', value: 'new' }, { label: 'Lemon', value: 'lem', checked: true }, { label: 'Rename', value: 'ren' }, { label: 'Delete', value: 'del' }]
const actions = [{ label: 'Duplicate', value: 'dup' }, { label: 'Rename', value: 'ren' }, { label: 'Delete', value: 'del' }]
const last = ref('')
const items = ref(['One', 'Two'])
const code = computed(
  () => `<SPopUpButton v-model="fruit" :options="fruits" size="${p.size}"${p.disabled ? ' disabled' : ''} />
<SPullDownButton label="Actions" :options="actions" @select="run" />
<SGradientButton @add="add" @remove="remove" />
<SHelpButton @click="showHelp" />`,
)
const cols = sizes.map((s) => ({ key: s, label: s }))
const states = [
  { key: 'Rest', label: 'Rest', force: '' }, { key: 'Hover', label: 'Hover', force: 'hover' }, { key: 'Pressed', label: 'Pressed', force: 'pressed' },
  { key: 'Focused', label: 'Focused', force: 'focus' }, { key: 'Disabled', label: 'Disabled', disabled: true },
]
const noSize = [{ key: 'one', label: '' }]
</script>

<template>
  <DocPage title="Pop-up and pull-down buttons" lead="A pop-up button shows the current choice and opens a menu to change it; a pull-down button has a fixed label and its menu holds actions. Both reuse the push button and the menu. The gradient button is the add/remove pair under a list, the help button the round question mark.">
    <h2>Playground</h2>
    <div class="play">
      <Stage :pad="48" class="grow">
        <div class="col">
          <div class="row">
            <SPopUpButton v-model="fruit" :options="fruits" :size="p.size" :disabled="p.disabled" />
            <SPullDownButton :options="actions" :size="p.size" :disabled="p.disabled" @select="last = $event" />
            <SHelpButton :disabled="p.disabled" />
          </div>
          <div class="row">
            <SGradientButton :disabled="p.disabled" :remove-disabled="items.length === 0" @add="items.push('Item ' + (items.length + 1))" @remove="items.pop()" />
            <span class="muted">{{ items.length }} items</span>
          </div>
          <span class="muted">pop-up “{{ fruit }}” · action “{{ last }}”</span>
        </div>
      </Stage>
      <div class="card ctrl">
        <div class="field"><label>Size</label><div class="seg"><button v-for="s in sizes" :key="s" :class="{ on: p.size === s }" @click="p.size = s">{{ s }}</button></div></div>
        <label class="chk"><input v-model="p.disabled" type="checkbox" /> disabled</label>
      </div>
    </div>
    <Code :code="code" />

    <h2>Pop-up button, compared with the kit</h2>
    <CompareMatrix :rows="states" :cols="cols" :kit="(r, c) => `Buttons/Pop-up/${cap(c.key)}/${r.key}`">
      <template #default="{ row, col }"><SPopUpButton model-value="Lemon" :options="fruits" :size="col.key" :force="row.force" :disabled="row.disabled" /></template>
    </CompareMatrix>

    <h2>Pull-down button, compared with the kit</h2>
    <CompareMatrix :rows="states" :cols="cols" :kit="(r, c) => `Buttons/Pull-down/${cap(c.key)}/${r.key}`">
      <template #default="{ row, col }"><SPullDownButton :options="actions" :size="col.key" :force="row.force" :disabled="row.disabled" /></template>
    </CompareMatrix>

    <h2>Open</h2>
    <CompareMatrix :rows="[{ key: 'Pop-up', label: 'Pop-up' }, { key: 'Pull-down', label: 'Pull-down' }]" :cols="[{ key: 'x', label: 'regular' }]" :kit="(r) => `Buttons/${r.key}/Open/Rest`">
      <template #default="{ row }">
        <div class="openbox" :class="row.key === 'Pop-up' ? 'openbox--popup' : 'openbox--pulldown'">
          <SPopUpButton v-if="row.key === 'Pop-up'" model-value="Lemon" :options="openFruits" open />
          <SPullDownButton v-else :options="openActions" open />
        </div>
      </template>
    </CompareMatrix>

    <h2>Gradient and help buttons, compared with the kit</h2>
    <CompareMatrix :rows="states" :cols="[{ key: 'g', label: 'Gradient' }, { key: 'h', label: 'Help' }]" :kit="(r, c) => (c.key === 'g' ? `Buttons/Gradient/Add Remove/${r.key}` : `Buttons/Help/${r.key}`)">
      <template #default="{ row, col }">
        <SGradientButton v-if="col.key === 'g'" :force="row.force" :disabled="row.disabled" />
        <SHelpButton v-else :force="row.force" :disabled="row.disabled" />
      </template>
    </CompareMatrix>
  </DocPage>
</template>

<style scoped>
.play { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 16px; align-items: stretch; }
.grow { min-height: 240px; justify-content: center; }
.col { display: flex; flex-direction: column; gap: 14px; align-items: flex-start; }
.row { display: flex; gap: 12px; align-items: center; }
.ctrl { padding: 16px; display: flex; flex-direction: column; gap: 14px; }
.chk { display: flex; gap: 6px; align-items: center; }
.openbox { position: relative; }
/* the kit's Open masters: 136 x 104 with the button at (12, 26), and 129 x 135 with the button at (5, 0) */
.openbox--popup { width: 136px; height: 104px; padding: 26px 0 0 12px; }
.openbox--pulldown { width: 129px; height: 135px; padding-left: 5px; }
</style>
