<script>
export const meta = { title: 'Switch, Checkbox, Radio', order: 20 }
</script>

<script setup>
import { computed, ref } from 'vue'
import SSwitch from '../../lib/SSwitch.vue'
import SCheckbox from '../../lib/SCheckbox.vue'
import SRadio from '../../lib/SRadio.vue'
import DocPage from '../DocPage.vue'
import Stage from '../Stage.vue'
import Code from '../Code.vue'
import CompareMatrix from '../CompareMatrix.vue'

const on = ref(true)
const sw = ref(false)
const checks = ref({ a: true, b: false })
const parent = computed({
  get: () => (checks.value.a && checks.value.b ? true : false),
  set: (v) => { checks.value = { a: v, b: v } },
})
const mixed = computed(() => checks.value.a !== checks.value.b)
const choice = ref('name')

const states = [
  { key: 'Rest', label: 'Rest', force: '' }, { key: 'Hover', label: 'Hover', force: 'hover' }, { key: 'Pressed', label: 'Pressed', force: 'pressed' },
  { key: 'Focused', label: 'Focused', force: 'focus' }, { key: 'Disabled', label: 'Disabled', force: '', disabled: true },
]
const rowsOnOff = [{ key: 'Off', label: 'Off' }, { key: 'On', label: 'On' }]
const rowsCheck = [{ key: 'Off', label: 'Off' }, { key: 'On', label: 'On' }, { key: 'Mixed', label: 'Mixed' }]
const size = ref('regular')
const cap = (s) => s[0].toUpperCase() + s.slice(1)
const switchStates = [...states.slice(0, 1), states[1], states[2], states[3], states[4]]
</script>

<template>
  <DocPage title="Switch, Checkbox, Radio" lead="Toggles. The checkbox and radio are native inputs (keyboard, forms, labels); the switch is a role=switch button you can also drag.">
    <h2>Try them</h2>
    <Stage :pad="28">
      <div class="col">
        <SSwitch v-model="on" /><span class="muted">switch is {{ on ? 'on' : 'off' }} · drag it</span>
      </div>
      <div class="col">
        <SCheckbox v-model="parent" :mixed="mixed" @update:mixed="() => {}">Select all</SCheckbox>
        <SCheckbox v-model="checks.a">First item</SCheckbox>
        <SCheckbox v-model="checks.b">Second item</SCheckbox>
      </div>
      <div class="col">
        <SRadio v-model="choice" value="name" name="sort">Sort by name</SRadio>
        <SRadio v-model="choice" value="date" name="sort">Sort by date</SRadio>
        <SRadio v-model="choice" value="size" name="sort">Sort by size</SRadio>
      </div>
    </Stage>
    <Code code="<SSwitch v-model=&quot;on&quot; />
<SCheckbox v-model=&quot;checked&quot;>Label</SCheckbox>
<SRadio v-model=&quot;choice&quot; value=&quot;name&quot; name=&quot;sort&quot;>Sort by name</SRadio>" />

    <h2>Switch, compared with the kit</h2>
    <div class="seg bar"><button v-for="s in ['mini', 'small', 'regular']" :key="s" :class="{ on: size === s }" @click="size = s">{{ s }}</button></div>
    <CompareMatrix :rows="rowsOnOff" :cols="[...switchStates, { key: 'Dragging', label: 'Dragging', force: 'drag' }]" :kit="(r, c) => `Toggles/Switch/${r.key}/${cap(size)}/${c.key}`">
      <template #default="{ row, col }"><SSwitch :model-value="row.key === 'On'" :size="size" :force="col.force === 'drag' ? '' : col.force" :disabled="col.disabled" /></template>
    </CompareMatrix>

    <h2>Checkbox, compared with the kit</h2>
    <CompareMatrix :rows="rowsCheck" :cols="states" :kit="(r, c) => `Toggles/Checkbox/${r.key}/${cap(size === 'mini' ? 'small' : size)}/${c.key}`">
      <template #default="{ row, col }"><SCheckbox :model-value="row.key === 'On'" :mixed="row.key === 'Mixed'" :size="size === 'mini' ? 'small' : size === 'regular' ? 'regular' : 'small'" :force="col.force" :disabled="col.disabled" /></template>
    </CompareMatrix>

    <h2>Radio, compared with the kit</h2>
    <CompareMatrix :rows="rowsOnOff" :cols="states" :kit="(r, c) => `Toggles/Radio/${r.key}/${cap(size === 'mini' ? 'small' : size)}/${c.key}`">
      <template #default="{ row, col }"><SRadio :model-value="row.key === 'On' ? 1 : 0" :value="1" :size="size === 'regular' ? 'regular' : 'small'" :force="col.force" :disabled="col.disabled" /></template>
    </CompareMatrix>
  </DocPage>
</template>

<style scoped>
.col { display: flex; flex-direction: column; gap: 10px; align-items: flex-start; min-width: 180px; }
.bar { margin-bottom: 12px; }
</style>
