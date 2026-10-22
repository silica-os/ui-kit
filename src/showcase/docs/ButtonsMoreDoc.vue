<script>
export const meta = { title: 'Icon button, Link, Disclosure', order: 15 }
</script>

<script setup>
import { ref } from 'vue'
import SIconButton from '../../lib/SIconButton.vue'
import SDisclosureButton from '../../lib/SDisclosureButton.vue'
import SLink from '../../lib/SLink.vue'
import SGroupBox from '../../lib/SGroupBox.vue'
import SCheckbox from '../../lib/SCheckbox.vue'
import DocPage from '../DocPage.vue'
import Stage from '../Stage.vue'
import Code from '../Code.vue'
import CompareMatrix from '../CompareMatrix.vue'
import KitRef from '../KitRef.vue'

const expanded = ref(false)
const a = ref(true)
const b = ref(false)
const states = [
  { key: 'Rest', label: 'Rest', force: '' }, { key: 'Hover', label: 'Hover', force: 'hover' }, { key: 'Pressed', label: 'Pressed', force: 'pressed' },
  { key: 'Focused', label: 'Focused', force: 'focus' }, { key: 'Disabled', label: 'Disabled', force: '', disabled: true },
]
const sizes = ['mini', 'small', 'regular', 'large'].map((s) => ({ key: s, label: s }))
const cap = (s) => s[0].toUpperCase() + s.slice(1)
const shape = ref('round')
</script>

<template>
  <DocPage title="Icon button, Link, Disclosure, Group box" lead="Small controls that other components build on: a glyph-only button, a text link, the expand chevron and the box that groups controls.">
    <h2>Try them</h2>
    <Stage :pad="28">
      <SIconButton icon="plus" label="Add" /><SIconButton icon="gear" shape="square" label="Settings" />
      <SLink href="#/lib/buttonsmore">Learn more</SLink>
      <SDisclosureButton v-model:expanded="expanded" /><span class="muted">{{ expanded ? 'expanded' : 'collapsed' }}</span>
      <SGroupBox title="Notifications" style="width: 220px"><SCheckbox v-model="a">Show banners</SCheckbox><SCheckbox v-model="b">Play sound</SCheckbox></SGroupBox>
    </Stage>
    <Code code="<SIconButton icon=&quot;plus&quot; label=&quot;Add&quot; />
<SLink href=&quot;/help&quot;>Learn more</SLink>
<SDisclosureButton v-model:expanded=&quot;open&quot; />
<SGroupBox title=&quot;Notifications&quot;><SCheckbox v-model=&quot;a&quot;>Show banners</SCheckbox></SGroupBox>" />

    <h2>Icon button, compared with the kit</h2>
    <div class="seg bar"><button v-for="s in ['round', 'square']" :key="s" :class="{ on: shape === s }" @click="shape = s">{{ s }}</button></div>
    <CompareMatrix :rows="sizes" :cols="states" :kit="(r, c) => `Buttons/Icon/${cap(shape)}/${cap(r.key)}/${c.key}`">
      <template #default="{ row, col }"><SIconButton icon="plus" :shape="shape" :size="row.key" :force="col.force" :disabled="col.disabled" /></template>
    </CompareMatrix>

    <h2>Disclosure button and link</h2>
    <CompareMatrix :rows="[{ key: 'Collapsed', label: 'Collapsed' }, { key: 'Expanded', label: 'Expanded' }]" :cols="states.filter((s) => s.key !== 'Focused')" :kit="(r, c) => `Disclosure/Button/${r.key}/${c.key}`">
      <template #default="{ row, col }"><SDisclosureButton :expanded="row.key === 'Expanded'" :force="col.force" :disabled="col.disabled" /></template>
    </CompareMatrix>
    <div class="gap" />
    <CompareMatrix :rows="[{ key: 'Link', label: 'Link' }]" :cols="states" :kit="(r, c) => `Buttons/Link/Link/${c.key}`">
      <template #default="{ col }"><SLink :force="col.force" :disabled="col.disabled">Learn more</SLink></template>
    </CompareMatrix>

    <h2>Group box, compared with the kit</h2>
    <div class="two">
      <Stage :pad="28"><SGroupBox title="Notifications" style="width: 192px"><SCheckbox v-model="b">Show banners</SCheckbox><SCheckbox v-model="a">Play sound</SCheckbox><SCheckbox>Lock screen</SCheckbox></SGroupBox></Stage>
      <Stage :pad="28"><KitRef name="Group Boxes/Box/Titled/Rest" /></Stage>
    </div>
  </DocPage>
</template>

<style scoped>
.bar { margin-bottom: 12px; }
.gap { height: 16px; }
.two { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
</style>
