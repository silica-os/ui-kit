<script>
export const meta = { title: 'Forms, fields and number field', order: 150 }
</script>

<script setup>
import { computed, reactive, ref } from 'vue'
import STextArea from '../../lib/STextArea.vue'
import SSecureField from '../../lib/SSecureField.vue'
import STokenField from '../../lib/STokenField.vue'
import SInlineButtonField from '../../lib/SInlineButtonField.vue'
import SComboButton from '../../lib/SComboButton.vue'
import SNumberField from '../../lib/SNumberField.vue'
import STextField from '../../lib/STextField.vue'
import SForm from '../../lib/SForm.vue'
import SFormSection from '../../lib/SFormSection.vue'
import SFormRow from '../../lib/SFormRow.vue'
import SFormFooter from '../../lib/SFormFooter.vue'
import SPopUpButton from '../../lib/SPopUpButton.vue'
import SCheckbox from '../../lib/SCheckbox.vue'
import SSwitch from '../../lib/SSwitch.vue'
import SButton from '../../lib/SButton.vue'
import DocPage from '../DocPage.vue'
import Stage from '../Stage.vue'
import Code from '../Code.vue'
import CompareMatrix from '../CompareMatrix.vue'

const sizes = ['small', 'regular', 'large']
const cap = (s) => s[0].toUpperCase() + s.slice(1)
const p = reactive({ error: false, disabled: false })
const note = ref('Rooms face the sea.\nBreakfast is served on the terrace until ten.')
const pw = ref('lemon-tree')
const tags = ref(['Travel', 'Food'])
const path = ref('Downloads')
const qty = ref(12)
const form = reactive({ name: 'Ada Rossi', email: 'ada@', region: 'Campania', display: 'Ada', sign: true, remind: false })
const emailError = computed(() => (/^\S+@\S+\.\S+$/.test(form.email) ? '' : 'Enter an address such as name@example.com.'))
const code = computed(
  () => `<STextArea v-model="note" />
<SSecureField v-model="password" revealable />
<STokenField v-model="tags" />
<SNumberField v-model="qty" :min="0" :max="99" />
<SForm title="Account details">
  <SFormSection title="Profile">
    <SFormRow label="Name"><STextField v-model="name" /></SFormRow>
  </SFormSection>
  <SFormFooter><SButton>Cancel</SButton><SButton variant="primary">Save</SButton></SFormFooter>
</SForm>`,
)

const one = [{ key: 'one', label: '' }]
const fieldStates = (names) => names.map((n) => ({ key: n, label: n, force: n === 'Focused' ? 'focus' : '', disabled: n === 'Disabled' }))
const secure = fieldStates(['Placeholder', 'Filled', 'Focused', 'Disabled'])
const inline = fieldStates(['Rest', 'Focused', 'Disabled'])
const combo = [{ key: 'Rest', label: 'Rest' }, { key: 'Pressed', label: 'Pressed', force: 'pressed' }, { key: 'Disabled', label: 'Disabled', disabled: true }]
const sizeCols = sizes.map((s) => ({ key: s, label: s }))
const numStates = fieldStates(['Rest', 'Focused', 'Disabled'])
</script>

<template>
  <DocPage title="Forms, fields and number field" lead="The remaining fields (text area, secure field, token field, inline button, combo button), the number field (a text field with a stepper) and the form layout pieces: a form card, titled sections, rows with a label column, and a footer.">
    <h2>Playground</h2>
    <div class="play">
      <Stage :pad="32" class="grow">
        <div class="col">
          <STextArea v-model="note" :error="p.error" :disabled="p.disabled" placeholder="Write a note" />
          <SSecureField v-model="pw" revealable :error="p.error" :disabled="p.disabled" />
          <STokenField v-model="tags" :error="p.error" :disabled="p.disabled" />
          <SInlineButtonField v-model="path" :disabled="p.disabled" />
          <SNumberField v-model="qty" :min="0" :max="99" :error="p.error" :disabled="p.disabled" />
          <span class="muted">tags {{ tags.join(', ') || 'none' }} · number {{ qty }}</span>
        </div>
      </Stage>
      <div class="card ctrl">
        <label class="chk"><input v-model="p.error" type="checkbox" /> error</label>
        <label class="chk"><input v-model="p.disabled" type="checkbox" /> disabled</label>
        <span class="muted">Token field: Enter or comma adds, Backspace twice removes the last. Number field: type, press ↑ ↓, or use the stepper.</span>
      </div>
    </div>
    <Code :code="code" />

    <h2>Form</h2>
    <div class="play">
      <Stage :pad="24" class="grow">
        <SForm title="Account details">
          <SFormSection title="Profile">
            <SFormRow label="Name"><STextField v-model="form.name" /></SFormRow>
            <SFormRow label="Email" :error="emailError"><STextField v-model="form.email" :error="!!emailError" /></SFormRow>
            <SFormRow label="Region"><SPopUpButton v-model="form.region" :options="['Campania', 'Liguria', 'Sicilia']" /></SFormRow>
          </SFormSection>
          <SFormSection title="Preferences">
            <SFormRow label="Sign in"><SCheckbox v-model="form.sign">Keep me signed in</SCheckbox></SFormRow>
            <SFormRow label="Reminders"><SSwitch v-model="form.remind" /></SFormRow>
            <SFormRow label="Display name" help="This name is shown to people you share with."><STextField v-model="form.display" /></SFormRow>
          </SFormSection>
          <SFormFooter><SButton>Cancel</SButton><SButton variant="primary">Save</SButton></SFormFooter>
        </SForm>
      </Stage>
    </div>

    <h2>Form layout, compared with the kit</h2>
    <CompareMatrix :rows="one" :cols="[{ key: 'x', label: 'Full' }]" :kit="() => 'Forms/Layout/Full/Rest'">
      <template #default>
        <SForm title="Account details">
          <SFormSection title="Profile">
            <SFormRow label="Name:"><STextField model-value="Marta Esposito" /></SFormRow>
            <SFormRow label="Email:"><STextField model-value="marta@example.it" /></SFormRow>
            <SFormRow label="Region:"><SPopUpButton model-value="Lemon" :options="['Lemon']" /></SFormRow>
          </SFormSection>
          <SFormSection title="Validation">
            <SFormRow label="Display name:" help="This name is shown to people you share with."><STextField model-value="Marta" /></SFormRow>
            <SFormRow label="Email:" error="Enter an address such as name@example.com."><STextField model-value="marta@example" error /></SFormRow>
          </SFormSection>
          <SFormFooter><SButton>Cancel</SButton><SButton variant="primary">Save</SButton></SFormFooter>
        </SForm>
      </template>
    </CompareMatrix>
    <h3>Sections and rows</h3>
    <CompareMatrix :rows="[{ key: 'Preferences', label: 'Preferences' }]" :cols="[{ key: 'x', label: 'Section' }]" :kit="(r) => `Forms/Section/${r.key}/Rest`">
      <template #default>
        <SFormSection title="Preferences" style="width: 352px">
          <SFormRow label="Options:"><SCheckbox :model-value="true">Send me updates</SCheckbox></SFormRow>
          <SFormRow label=""><SCheckbox :model-value="true">Keep me signed in</SCheckbox></SFormRow>
        </SFormSection>
      </template>
    </CompareMatrix>
    <CompareMatrix :rows="[{ key: 'Switch', label: 'Switch' }, { key: 'Popup', label: 'Popup' }]" :cols="[{ key: 'x', label: 'Row' }]" :kit="(r) => `Forms/Row/${r.key}/Rest`">
      <template #default="{ row }">
        <SFormRow label="Label" style="width: 328px"><span v-if="row.key === 'Switch'" class="swrow"><span>Sync across devices</span><SSwitch :model-value="true" /></span><SPopUpButton v-else model-value="Lemon" :options="['Lemon']" /></SFormRow>
      </template>
    </CompareMatrix>

    <h2>Text area, compared with the kit</h2>
    <CompareMatrix :rows="secure" :cols="[{ key: 'x', label: 'Regular' }]" :kit="(r) => `Fields/Text Area/Regular/${r.key}`">
      <template #default="{ row }">
        <STextArea :model-value="row.key === 'Placeholder' ? '' : note" placeholder="Write a note" :force="row.force" :disabled="row.disabled" />
      </template>
    </CompareMatrix>

    <h2>Secure field, compared with the kit</h2>
    <CompareMatrix :rows="secure" :cols="[{ key: 'x', label: 'Regular' }]" :kit="(r) => `Fields/Secure Field/Regular/${r.key}`">
      <template #default="{ row }">
        <SSecureField :model-value="row.key === 'Placeholder' ? '' : 'password'" :force="row.force" :disabled="row.disabled" />
      </template>
    </CompareMatrix>

    <h2>Token field and token</h2>
    <CompareMatrix :rows="[{ key: 'Rest', label: 'Rest' }, { key: 'Focused', label: 'Focused', force: 'focus', sel: 1 }]" :cols="[{ key: 'x', label: 'Regular' }]" :kit="(r) => `Fields/Token Field/Regular/${r.key}`">
      <template #default="{ row }"><STokenField :model-value="['Travel', 'Coast']" :force="row.force" :selected="row.sel ?? -1" /></template>
    </CompareMatrix>

    <h2>Inline button, compared with the kit</h2>
    <CompareMatrix :rows="inline" :cols="[{ key: 'x', label: 'Regular' }]" :kit="(r) => `Fields/Inline Button/Regular/${r.key}`">
      <template #default="{ row }"><SInlineButtonField model-value="Downloads" :force="row.force" :disabled="row.disabled" /></template>
    </CompareMatrix>

    <h2>Combo button, compared with the kit</h2>
    <CompareMatrix :rows="combo" :cols="sizeCols" :kit="(r, c) => `Fields/Combo Button/${cap(c.key)}/${r.key}`">
      <template #default="{ row, col }"><SComboButton :size="col.key" :force="row.force" :disabled="row.disabled" /></template>
    </CompareMatrix>

    <h2>Number field, compared with the kit</h2>
    <CompareMatrix :rows="numStates" :cols="[{ key: 'w', label: 'With field' }, { key: 'v', label: 'Value field' }]" :kit="(r, c) => `Steppers/${c.key === 'w' ? 'With' : 'Value'} Field/Regular/${r.key}`">
      <template #default="{ row, col }"><SNumberField :model-value="12" :stepper="col.key === 'w'" :force="row.force" :disabled="row.disabled" /></template>
    </CompareMatrix>
  </DocPage>
</template>

<style scoped>
.play { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 16px; align-items: start; margin-bottom: 8px; }
.play:has(.s-form) { grid-template-columns: 1fr; }
.grow { justify-content: center; }
.col { display: flex; flex-direction: column; gap: 14px; align-items: flex-start; }
.ctrl { padding: 16px; display: flex; flex-direction: column; gap: 14px; }

.swrow { display: flex; align-items: center; justify-content: space-between; width: 204px; height: 32px; }
.chk { display: flex; gap: 6px; align-items: center; }
</style>
