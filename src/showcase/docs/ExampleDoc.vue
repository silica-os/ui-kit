<script>
export const meta = { title: 'Example: Settings', order: 5 }
</script>

<script setup>
import { reactive, ref } from 'vue'
import SSidebar from '../../lib/SSidebar.vue'
import SSidebarItem from '../../lib/SSidebarItem.vue'
import SSidebarGroup from '../../lib/SSidebarGroup.vue'
import SGroupBox from '../../lib/SGroupBox.vue'
import SSwitch from '../../lib/SSwitch.vue'
import SCheckbox from '../../lib/SCheckbox.vue'
import SSlider from '../../lib/SSlider.vue'
import SSegmented from '../../lib/SSegmented.vue'
import STextField from '../../lib/STextField.vue'
import SButton from '../../lib/SButton.vue'
import SAlert from '../../lib/SAlert.vue'
import SProgress from '../../lib/SProgress.vue'
import DocPage from '../DocPage.vue'
import Stage from '../Stage.vue'

const page = ref('general')
const s = reactive({ wifi: true, bluetooth: false, volume: 60, view: 'list', name: 'Lemon cake', banners: true, sound: false })
const reset = ref(false)
const done = ref(false)
function onReset(v) {
  reset.value = false
  if (v === 'reset') { done.value = true; setTimeout(() => (done.value = false), 1600) }
}
</script>

<template>
  <DocPage title="Example: Settings" lead="A small screen built only from library components: sidebar, group boxes, switches, a slider, a segmented control, a text field, buttons and an alert. Everything works.">
    <Stage :pad="0" class="host">
      <div class="win">
        <SSidebar v-model="page" class="side">
          <SSidebarGroup title="Settings">
            <SSidebarItem value="general" icon="gear" label="General" />
            <SSidebarItem value="network" icon="wifi" label="Network" />
            <SSidebarItem value="sound" icon="speaker" label="Sound" :badge="s.sound ? '' : 2" />
          </SSidebarGroup>
        </SSidebar>
        <main class="content">
          <h2>{{ page === 'general' ? 'General' : page === 'network' ? 'Network' : 'Sound' }}</h2>
          <template v-if="page === 'general'">
            <SGroupBox title="Library">
              <STextField v-model="s.name" placeholder="Name" clearable />
              <SSegmented v-model="s.view" :items="[{ value: 'list', label: 'List' }, { value: 'grid', label: 'Grid' }, { value: 'columns', label: 'Columns' }]" />
            </SGroupBox>
            <SGroupBox title="Notifications">
              <SCheckbox v-model="s.banners">Show banners</SCheckbox>
              <SCheckbox v-model="s.sound">Play sound</SCheckbox>
            </SGroupBox>
            <div class="row"><SButton variant="destructive" @click="reset = true">Reset…</SButton><span v-if="done" class="muted">Settings reset</span></div>
          </template>
          <template v-else-if="page === 'network'">
            <SGroupBox><div class="line"><span>Wi-Fi</span><SSwitch v-model="s.wifi" /></div><div class="line"><span>Bluetooth</span><SSwitch v-model="s.bluetooth" /></div></SGroupBox>
            <SProgress v-if="s.wifi" :value="null" kind="bar" />
          </template>
          <template v-else>
            <SGroupBox title="Output volume"><SSlider v-model="s.volume" min-icon="speaker" max-icon="speaker" /><span class="muted">{{ s.volume }} %</span></SGroupBox>
          </template>
        </main>
        <div v-if="reset" class="scrim"><SAlert variant="critical" title="Reset all settings?" message="This cannot be undone." :buttons="[{ value: 'reset', label: 'Reset' }, { value: 'cancel', label: 'Cancel' }]" @action="onReset" /></div>
      </div>
    </Stage>
  </DocPage>
</template>

<style scoped>
.host { display: block; }
.win { position: relative; display: flex; height: 460px; border-radius: 14px; overflow: hidden; }
.side { width: 220px; flex: none; }
.content { flex: 1; padding: 24px; display: flex; flex-direction: column; gap: 16px; overflow: auto; background: var(--surface-window); }
.content h2 { margin: 0; font: var(--font-title-2); color: var(--text-primary); }
.row, .line { display: flex; align-items: center; gap: 12px; }
.line { justify-content: space-between; width: 100%; }
.scrim { position: absolute; inset: 0; display: grid; place-items: center; background: #0006; }
</style>
