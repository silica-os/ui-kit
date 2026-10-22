<script>
export const meta = { title: 'Dialog and Notification', order: 120 }
</script>

<script setup>
import { computed, reactive, ref } from 'vue'
import SDialog from '../../lib/SDialog.vue'
import SDialogFooter from '../../lib/SDialogFooter.vue'
import SFilePanel from '../../lib/SFilePanel.vue'
import SNotification from '../../lib/SNotification.vue'
import SNotificationStack from '../../lib/SNotificationStack.vue'
import SNotificationCentre from '../../lib/SNotificationCentre.vue'
import SButton from '../../lib/SButton.vue'
import STextField from '../../lib/STextField.vue'
import SCheckbox from '../../lib/SCheckbox.vue'
import SAlert from '../../lib/SAlert.vue'
import SGroupBox from '../../lib/SGroupBox.vue'
import SFormRow from '../../lib/SFormRow.vue'
import SPopUpButton from '../../lib/SPopUpButton.vue'
import SWindow from '../../lib/SWindow.vue'
import DocPage from '../DocPage.vue'
import Stage from '../Stage.vue'
import SidePair from '../SidePair.vue'
import Code from '../Code.vue'

const chosen = ref('')
const name = ref('Lemon cake')
const bool = reactive({ a: true, b: false })
const place = ref('documents')
const file = ref('lemon')
const where = ref('Documents')
const view = ref('icons')
const query = ref('')
const dlgOpen = ref(true)
const code = computed(() => `<SDialog title="Share recipe" primary="Share" secondary="Cancel" @primary="…" @secondary="…" @close="…">
  <SFormRow label="Name:"><STextField v-model="name" /></SFormRow>
  <hr class="s-dialog__rule" />
  <div class="s-dialog__group">
    <SFormRow label="Options:"><SCheckbox v-model="allow">Allow editing</SCheckbox></SFormRow>
    <SFormRow><SCheckbox v-model="notify">Notify when opened</SCheckbox></SFormRow>
  </div>
</SDialog>

<SFilePanel mode="save" v-model:name="name" v-model:location="where" :locations="[…]" :places="[…]" :files="[…]" v-model="file" @primary="…" @secondary="…" />

<SNotification title="Recipes" message="Two new recipes…" time="now" color="…" glyph="…"
  :actions="[{ value: 'reply', label: 'Reply' }]" @action="…" @close="…" />`)

const places = [{ value: 'documents', label: 'Documents', icon: 'doc' }, { value: 'downloads', label: 'Downloads', icon: 'download', badge: 3 }, { value: 'pictures', label: 'Pictures', icon: 'photo' }]
const locations = ['Documents', 'Downloads', 'Pictures']
const files = [{ value: 'lemon', label: 'Lemon cake.recipe', icon: 'doc', date: 'Today, 09:41' }, { value: 'focaccia', label: 'Focaccia.recipe', icon: 'doc', date: 'Yesterday' }, { value: 'limoncello', label: 'Limoncello notes.txt', icon: 'doc', date: '12 Oct 2026' }]
const msg = 'Two new recipes were added to Lemon cake. Tap to open them.'
const acts = [{ value: 'reply', label: 'Reply' }, { value: 'mute', label: 'Mute' }]
const items = ref([
  { id: 1, title: 'Recipes', message: msg, color: 'var(--accent-amalfi)', glyph: 'message-ellipsis' },
  { id: 2, title: 'Reminders', message: 'Buy lemons', color: 'var(--palette-terracotta)', glyph: 'checklist' },
  { id: 3, title: 'Notes', message: 'Shopping list updated', color: 'var(--palette-limone)', glyph: 'doc-text' },
])
const sections = ref([
  { title: 'Today', items: [{ id: 'a', title: 'Recipes', message: msg, color: 'var(--accent-amalfi)', glyph: 'message-ellipsis' }, { id: 'b', title: 'Recipes', message: msg, color: 'var(--accent-amalfi)', glyph: 'message-ellipsis', actions: acts }] },
  { title: 'Earlier', items: [{ id: 'c', title: 'Recipes', message: msg, color: 'var(--accent-amalfi)', glyph: 'message-ellipsis' }] },
])
function drop(id) { items.value = items.value.filter((x) => x.id !== id); sections.value = sections.value.map((s) => ({ ...s, items: s.items.filter((x) => x.id !== id) })) }
const nBase = { title: 'Recipes', message: msg, color: 'var(--accent-amalfi)', glyph: 'message-ellipsis' }
</script>

<template>
  <DocPage title="Dialog and Notification" lead="SDialog is the raised 20 pt dialog (title, form rows, SDialogFooter with the primary button last) that also serves as a sheet in an SWindow; SFilePanel is the Finder-style open and save panel (toolbar, SFileBrowser, buttons). SNotification is the glass banner (or the card inside SNotificationCentre), SNotificationStack groups them.">
    <h2>Playground: dialog</h2>
    <Stage :pad="32" class="center">
      <Transition name="s-dialog" mode="out-in"><SDialog v-if="dlgOpen" title="Share recipe" primary="Share" secondary="Cancel" @primary="chosen = `share ${name}`; dlgOpen = false" @secondary="chosen = 'cancel'; dlgOpen = false" @close="dlgOpen = false" autofocus>
        <SFormRow label="Name:"><STextField v-model="name" placeholder="Recipe name" /></SFormRow>
        <hr class="s-dialog__rule" />
        <div class="s-dialog__group">
          <SFormRow label="Options:"><SCheckbox v-model="bool.a">Allow editing</SCheckbox></SFormRow>
          <SFormRow><SCheckbox v-model="bool.b">Notify when opened</SCheckbox></SFormRow>
        </div>
      </SDialog>
      <div v-else class="muted">{{ chosen }} <SButton size="small" @click="dlgOpen = true">Show again</SButton></div></Transition>
    </Stage>
    <Code :code="code" />

    <h2>Dialogs, compared with the kit</h2>
    <Stage :pad="24" class="col">
      <SidePair label="Open panel" kit="Dialogs/Dialog/Open Panel/Rest" stack>
        <SFilePanel mode="open" v-model:location="where" :locations="locations" v-model:place="place" v-model="file" v-model:view="view" v-model:search="query" :places="places" :files="files" />
      </SidePair>
      <SidePair label="Save panel" kit="Dialogs/Dialog/Save Panel/Rest" stack>
        <SFilePanel mode="save" v-model:name="name" v-model:location="where" :locations="locations" v-model:place="place" v-model="file" v-model:view="view" v-model:search="query" :places="places" :files="files" />
      </SidePair>
      <SidePair label="Generic" kit="Dialogs/Dialog/Generic/Rest">
        <SDialog title="Share recipe" primary="Save" secondary="Cancel">
          <SFormRow label="Name:"><STextField model-value="Marta Esposito" /></SFormRow>
          <SFormRow label="Email:"><STextField model-value="marta@example.it" /></SFormRow>
          <SFormRow label="Region:"><SPopUpButton model-value="Lemon" :options="['Lemon', 'Orange', 'Olive']" /></SFormRow>
          <hr class="s-dialog__rule" />
          <div class="s-dialog__group">
            <SFormRow label="Options:"><SCheckbox model-value>Send me updates</SCheckbox></SFormRow>
            <SFormRow><SCheckbox model-value>Keep me signed in</SCheckbox></SFormRow>
          </div>
        </SDialog>
      </SidePair>
      <SidePair label="Sheet attached" kit="Windows/Window/Sheet Attached/Active">
        <SWindow title="Lemon cake.recipe" document :width="540" :height="400">
          <div style="padding: 28px"><h1 style="margin: 0 0 12px; font: var(--font-title-1)">Lemon cake</h1><p style="margin: 0 0 36px; font: var(--font-body); color: var(--text-secondary)">Whisk the eggs with sugar until pale, fold in the flour, then the lemon zest and juice. Bake for forty minutes and let it cool before slicing.</p>
            <SGroupBox title="Notifications" style="width: 192px"><SCheckbox model-value>Show banners</SCheckbox><SCheckbox model-value>Play sound</SCheckbox><SCheckbox>Show on lock screen</SCheckbox></SGroupBox></div>
          <SButton variant="primary" style="position: absolute; right: 32px; bottom: 24px">Done</SButton>
          <template #sheet><SAlert title="Empty the outbox?" message="Messages waiting to be sent will be sent now." suppress="Do not ask again" :buttons="[{ label: 'Send' }, { label: 'Cancel' }]"><template #icon><span style="display: block; width: 56px; height: 56px; border-radius: 13px; background: var(--palette-limone); box-shadow: inset 0 0 0 1px #0000001f" /></template></SAlert></template>
        </SWindow>
      </SidePair>
    </Stage>

    <h2>Notifications, compared with the kit</h2>
    <Stage glass :pad="24" class="col">
      <SidePair label="Banner" kit="Notifications/Banner/Basic/Rest"><SNotification v-bind="nBase" /></SidePair>
      <SidePair label="Banner with actions" kit="Notifications/Banner/With Actions/Rest"><SNotification v-bind="nBase" :actions="acts" /></SidePair>
      <SidePair label="Banner, pointer over (close button)" kit="Notifications/Banner/Basic/Rest"><SNotification v-bind="nBase" force="hover" style="margin: 8px" /></SidePair>
      <SidePair label="Panel" kit="Notifications/Banner/Panel/Rest"><SNotification variant="panel" v-bind="nBase" :closable="false" /></SidePair>
      <SidePair label="Panel with actions" kit="Notifications/Banner/Panel With Actions/Rest"><SNotification variant="panel" v-bind="nBase" :actions="acts" :closable="false" /></SidePair>
      <SidePair label="Stack" kit="Notifications/Stack/Grouped/Rest"><SNotificationStack :items="items" /></SidePair>
      <SidePair label="Centre" kit="Notifications/Centre/Panel/Rest"><SNotificationCentre :sections="sections" @clear="sections = []; items = []" @close="drop" @action="(id, v) => (chosen = `${id}: ${v}`)" /></SidePair>
      <span class="muted">{{ chosen }}</span>
    </Stage>
  </DocPage>
</template>

<style scoped>
.center { justify-content: center; min-height: 260px; }
.col { flex-direction: column; flex-wrap: nowrap; align-items: flex-start; overflow-x: auto; gap: 8px; }
</style>
