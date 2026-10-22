<script>
export const meta = { title: 'Alert', order: 70 }
</script>

<script setup>
import { computed, reactive, ref } from 'vue'
import SAlert from '../../lib/SAlert.vue'
import SButton from '../../lib/SButton.vue'
import STextField from '../../lib/STextField.vue'
import DocPage from '../DocPage.vue'
import Stage from '../Stage.vue'
import Code from '../Code.vue'
import CompareMatrix from '../CompareMatrix.vue'

const variants = ['default', 'critical', 'glass']
const p = reactive({ variant: 'default', title: 'Save changes to “Lemon cake”?', message: 'Your edits will be lost if you close without saving.', buttons: 3, suppress: false, field: false })
const all = [{ value: 'save', label: 'Save' }, { value: 'discard', label: 'Don’t Save', variant: 'secondary' }, { value: 'cancel', label: 'Cancel', variant: 'secondary' }]
const buttons = computed(() => all.slice(0, p.buttons).map((b, i) => (p.variant === 'critical' && i === 0 ? { ...b, variant: 'destructive' } : b)))
const chosen = ref('')
const hide = ref(false)
const text = ref('')
const code = computed(() => `<SAlert variant="${p.variant}" title="${p.title}" message="${p.message}"
  :buttons="[${buttons.value.map((b) => `{ value: '${b.value}', label: '${b.label}' }`).join(', ')}]"${p.suppress ? '\n  suppress="Do not ask again" v-model:suppressed="hide"' : ''} @action="…">
  <template #icon><img src="notes.png" /></template>${p.field ? '\n  <template #accessory><STextField v-model="name" /></template>' : ''}
</SAlert>`)

const rows = [
  { key: 'One Button', label: 'One button', variant: 'default', title: 'Import complete', message: 'Twelve pictures were added to your library.', buttons: [{ label: 'OK' }] },
  { key: 'Two Buttons', label: 'Two buttons + checkbox', variant: 'default', title: 'Empty the outbox?', message: 'Messages waiting to be sent will be sent now.', buttons: [{ label: 'Send' }, { label: 'Cancel' }], suppress: 'Do not ask again' },
  { key: 'Three Buttons', label: 'Three buttons', variant: 'default', title: 'Save changes to “Lemon cake”?', message: 'Your edits will be lost if you close without saving.', buttons: [{ label: 'Save' }, { label: 'Don’t Save' }, { label: 'Cancel' }] },
  { key: 'With Field', label: 'With field', variant: 'default', title: 'Name the note', message: 'Choose a short name you will recognise later.', buttons: [{ label: 'Save' }, { label: 'Cancel' }], field: true },
  { key: 'Critical', label: 'Critical', variant: 'critical', title: 'Delete this list?', message: 'All reminders in it will be removed for good.', buttons: [{ label: 'Delete', variant: 'destructive' }, { label: 'Cancel' }] },
  { key: 'Glass', label: 'Glass', variant: 'glass', title: 'Event moved', message: 'Lunch with Marta now starts at 13:30.', buttons: [{ label: 'OK' }] },
]
const col = [{ key: 'Rest', label: 'Live over kit' }]
// a plain tile in place of the app icon (the kit uses the Notifications app icons)
const tile = { Photos: '#E5338A', Notes: '#FFC21A', Mail: '#0E77E6', Reminders: '#F0562E', Calendar: '#34A853' }
const tileFor = { 'One Button': 'Photos', 'Two Buttons': 'Mail', 'Three Buttons': 'Notes', 'With Field': 'Notes', Critical: 'Reminders', Glass: 'Calendar' }
</script>

<template>
  <DocPage title="Alert" lead="The 280 pt alert: icon, title, message, up to three stacked buttons, an optional suppression checkbox or any accessory (a text field). Buttons and checkbox are the real SButton and SCheckbox.">
    <h2>Playground</h2>
    <div class="play">
      <Stage :glass="p.variant === 'glass'" :pad="40" class="grow">
        <SAlert :variant="p.variant" :title="p.title" :message="p.message" :buttons="buttons" :suppress="p.suppress ? 'Do not ask again' : ''" v-model:suppressed="hide" @action="chosen = $event">
          <template #icon><span class="tile" style="background: #FFC21A" /></template>
          <template v-if="p.field" #accessory><STextField v-model="text" placeholder="Name" /></template>
        </SAlert>
        <span class="muted">{{ chosen ? `chose: ${chosen}` : 'press a button' }}{{ p.suppress ? ` · don't ask again: ${hide}` : '' }}</span>
      </Stage>
      <div class="card ctrl">
        <div class="field"><label>Variant</label><div class="seg"><button v-for="v in variants" :key="v" :class="{ on: p.variant === v }" @click="p.variant = v">{{ v }}</button></div></div>
        <div class="field"><label>Buttons</label><div class="seg"><button v-for="n in [1, 2, 3]" :key="n" :class="{ on: p.buttons === n }" @click="p.buttons = n">{{ n }}</button></div></div>
        <div class="field"><label>Title</label><input v-model="p.title" type="text" /></div>
        <div class="field"><label>Message</label><input v-model="p.message" type="text" /></div>
        <label class="chk"><input v-model="p.suppress" type="checkbox" /> suppression checkbox</label>
        <label class="chk"><input v-model="p.field" type="checkbox" /> accessory field</label>
      </div>
    </div>
    <Code :code="code" />

    <h2>Variants, compared with the kit</h2>
    <p class="muted">The kit's alerts carry an app icon; here a flat tile stands in for it, so compare the layout, not the picture.</p>
    <CompareMatrix glass :rows="rows" :cols="col" :kit="(r) => `Alerts/Alert/${r.key}/Rest`">
      <template #default="{ row }">
        <SAlert :variant="row.variant" :title="row.title" :message="row.message" :buttons="row.buttons" :suppress="row.suppress" :suppressed="false">
          <template #icon><span class="tile" :style="{ background: tile[tileFor[row.key]] }" /></template>
          <template v-if="row.field" #accessory><STextField model-value="" placeholder="Name" /></template>
        </SAlert>
      </template>
    </CompareMatrix>
  </DocPage>
</template>

<style scoped>
.play { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 16px; align-items: stretch; }
.grow { min-height: 200px; justify-content: center; }
.ctrl { padding: 16px; display: flex; flex-direction: column; gap: 14px; }
.chk { display: flex; gap: 6px; align-items: center; }
.tile { display: block; width: 56px; height: 56px; border-radius: 13px; box-shadow: inset 0 0 0 1px #0000001f; }
</style>
