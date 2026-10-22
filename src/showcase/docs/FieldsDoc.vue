<script>
export const meta = { title: 'Text fields', order: 30 }
</script>

<script setup>
import { computed, reactive, ref } from 'vue'
import STextField from '../../lib/STextField.vue'
import SSearchField from '../../lib/SSearchField.vue'
import SComboBox from '../../lib/SComboBox.vue'
import DocPage from '../DocPage.vue'
import Stage from '../Stage.vue'
import Code from '../Code.vue'
import CompareMatrix from '../CompareMatrix.vue'

const sizes = ['small', 'regular', 'large']
const cap = (s) => s[0].toUpperCase() + s.slice(1)
const p = reactive({ size: 'regular', placeholder: 'Name', clearable: false, error: false, disabled: false })
const name = ref('Amalfi coast')
const query = ref('')
const fruit = ref('Lemon')
const fruits = ['Orange', 'Lemon', 'Olive', 'Fig']
const submitted = ref('')
const code = computed(
  () => `<STextField v-model="name" size="${p.size}" placeholder="${p.placeholder}"${p.clearable ? ' clearable' : ''}${p.error ? ' error' : ''}${p.disabled ? ' disabled' : ''} />
<SSearchField v-model="query" @search="find" />
<SComboBox v-model="fruit" :options="fruits" />`,
)

const cols = sizes.map((s) => ({ key: s, label: s }))
const textRows = [
  { key: 'Placeholder', label: 'Placeholder', value: '' }, { key: 'Filled', label: 'Filled', value: 'Amalfi coast' },
  { key: 'Focused', label: 'Focused', value: 'Amalfi coast', force: 'focus' }, { key: 'Error', label: 'Error', value: 'Amalfi coast', error: true },
  { key: 'Disabled', label: 'Disabled', value: 'Amalfi coast', disabled: true },
]
const searchRows = [
  { key: 'Empty', label: 'Empty', value: '' }, { key: 'Typing', label: 'Typing', value: 'Limoni' },
  { key: 'Focused', label: 'Focused', value: '', force: 'focus' }, { key: 'Disabled', label: 'Disabled', value: '', disabled: true },
]
const comboRows = [
  { key: 'Rest', label: 'Rest', force: '' }, { key: 'Focused', label: 'Focused', force: 'focus' }, { key: 'Disabled', label: 'Disabled', disabled: true },
]
</script>

<template>
  <DocPage title="Text fields" lead="Single-line fields built on a native input: text field, search field and combo box. They type, focus, clear and, for the combo box, open a list with the keyboard.">
    <h2>Playground</h2>
    <div class="play">
      <Stage :pad="48" class="grow">
        <div class="col">
          <STextField v-model="name" :size="p.size" :placeholder="p.placeholder" :clearable="p.clearable" :error="p.error" :disabled="p.disabled" />
          <SSearchField v-model="query" :size="p.size" :disabled="p.disabled" @search="submitted = $event" />
          <SComboBox v-model="fruit" :options="fruits" :size="p.size" :disabled="p.disabled" :error="p.error" />
          <span class="muted">text “{{ name }}” · search “{{ query }}” · searched “{{ submitted }}” · combo “{{ fruit }}”</span>
        </div>
      </Stage>
      <div class="card ctrl">
        <div class="field"><label>Size</label><div class="seg"><button v-for="s in sizes" :key="s" :class="{ on: p.size === s }" @click="p.size = s">{{ s }}</button></div></div>
        <div class="field"><label>Placeholder</label><input v-model="p.placeholder" type="text" /></div>
        <label class="chk"><input v-model="p.clearable" type="checkbox" /> clearable</label>
        <label class="chk"><input v-model="p.error" type="checkbox" /> error</label>
        <label class="chk"><input v-model="p.disabled" type="checkbox" /> disabled</label>
      </div>
    </div>
    <Code :code="code" />

    <h2>Text field, compared with the kit</h2>
    <CompareMatrix :rows="textRows" :cols="cols" :kit="(r, c) => `Fields/Text Field/${cap(c.key)}/${r.key}`">
      <template #default="{ row, col }">
        <STextField :model-value="row.value" :size="col.key" placeholder="Name" :force="row.force" :error="row.error" :disabled="row.disabled" />
      </template>
    </CompareMatrix>

    <h2>Search field, compared with the kit</h2>
    <CompareMatrix glass :rows="searchRows" :cols="cols" :kit="(r, c) => `Fields/Search Field/${cap(c.key)}/${r.key}`">
      <template #default="{ row, col }">
        <SSearchField :model-value="row.value" :size="col.key" :force="row.force" :disabled="row.disabled" />
      </template>
    </CompareMatrix>

    <h2>Combo box, compared with the kit</h2>
    <CompareMatrix :rows="comboRows" :cols="cols" :kit="(r, c) => `Fields/Combo Box/${cap(c.key)}/${r.key}`">
      <template #default="{ row, col }">
        <SComboBox model-value="Lemon" :options="fruits" :size="col.key" :force="row.force" :disabled="row.disabled" />
      </template>
    </CompareMatrix>
    <h3>Open</h3>
    <CompareMatrix :rows="[{ key: 'Open', label: 'Open' }]" :cols="[{ key: 'regular', label: 'regular' }]" :kit="() => 'Fields/Combo Box/Open/Rest'">
      <template #default><div class="openbox"><SComboBox model-value="Lemon" :options="fruits" open /></div></template>
    </CompareMatrix>
  </DocPage>
</template>

<style scoped>
.play { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 16px; align-items: stretch; }
.grow { min-height: 260px; justify-content: center; }
.col { display: flex; flex-direction: column; gap: 14px; align-items: flex-start; }
.ctrl { padding: 16px; display: flex; flex-direction: column; gap: 14px; }
.chk { display: flex; gap: 6px; align-items: center; }
.openbox { height: 136px; }
</style>
