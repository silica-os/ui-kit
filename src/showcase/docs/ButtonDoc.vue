<script>
export const meta = { title: 'Button', order: 10 }
</script>

<script setup>
import { computed, reactive, ref } from 'vue'
import SButton from '../../lib/SButton.vue'
import DocPage from '../DocPage.vue'
import Stage from '../Stage.vue'
import Code from '../Code.vue'
import CompareMatrix from '../CompareMatrix.vue'

const variants = ['primary', 'secondary', 'destructive', 'borderless', 'glass']
const sizes = ['mini', 'small', 'regular', 'large']
const cols = [
  { key: 'Rest', label: 'Rest', force: '' }, { key: 'Hover', label: 'Hover', force: 'hover' }, { key: 'Pressed', label: 'Pressed', force: 'pressed' },
  { key: 'Focused', label: 'Focused', force: 'focus' }, { key: 'Disabled', label: 'Disabled', force: '', disabled: true },
]
const rows = variants.map((v) => ({ key: v, label: v }))
const p = reactive({ variant: 'primary', size: 'regular', label: 'Button', disabled: false })
const clicks = ref(0)
const code = computed(() => `<SButton variant="${p.variant}" size="${p.size}"${p.disabled ? ' disabled' : ''}>${p.label}</SButton>`)
const cap = (s) => s[0].toUpperCase() + s.slice(1)
const size = ref('regular')
</script>

<template>
  <DocPage title="Button" lead="Push button in five variants and four sizes. A real <button>: it takes focus, fires click, reacts to hover and press.">
    <h2>Playground</h2>
    <div class="play">
      <Stage :glass="p.variant === 'glass'" :pad="48" class="grow">
        <SButton :variant="p.variant" :size="p.size" :disabled="p.disabled" @click="clicks++">{{ p.label }}</SButton>
        <span class="muted">clicked {{ clicks }}×</span>
      </Stage>
      <div class="card ctrl">
        <div class="field"><label>Variant</label><div class="seg"><button v-for="v in variants" :key="v" :class="{ on: p.variant === v }" @click="p.variant = v">{{ v }}</button></div></div>
        <div class="field"><label>Size</label><div class="seg"><button v-for="s in sizes" :key="s" :class="{ on: p.size === s }" @click="p.size = s">{{ s }}</button></div></div>
        <div class="field"><label>Label</label><input v-model="p.label" type="text" /></div>
        <label class="chk"><input v-model="p.disabled" type="checkbox" /> disabled</label>
      </div>
    </div>
    <Code :code="code" />

    <h2>States, compared with the kit</h2>
    <div class="seg bar"><button v-for="s in sizes" :key="s" :class="{ on: size === s }" @click="size = s">{{ s }}</button></div>
    <CompareMatrix :rows="rows" :cols="cols" :kit="(r, c) => `Buttons/Push/${cap(r.key)}/${cap(size)}/${c.key}`">
      <template #default="{ row, col }"><SButton :variant="row.key" :size="size" :force="col.force" :disabled="col.disabled">Button</SButton></template>
    </CompareMatrix>
  </DocPage>
</template>

<style scoped>
.play { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 16px; align-items: stretch; }
.grow { min-height: 200px; justify-content: center; }
.ctrl { padding: 16px; display: flex; flex-direction: column; gap: 14px; }
.chk { display: flex; gap: 6px; align-items: center; }
.bar { margin-bottom: 12px; }
</style>
