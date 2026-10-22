<script>
export const meta = { title: 'Control Center', order: 130 }
</script>

<script setup>
import { computed, reactive, ref } from 'vue'
import SControlModule from '../../lib/SControlModule.vue'
import SControlPanel from '../../lib/SControlPanel.vue'
import SControlRow from '../../lib/SControlRow.vue'
import SControlDetail from '../../lib/SControlDetail.vue'
import SSwitch from '../../lib/SSwitch.vue'
import SMenu from '../../lib/SMenu.vue'
import SMenuItem from '../../lib/SMenuItem.vue'
import SMenuSeparator from '../../lib/SMenuSeparator.vue'
import DocPage from '../DocPage.vue'
import Stage from '../Stage.vue'
import SidePair from '../SidePair.vue'
import Code from '../Code.vue'
import CompareMatrix from '../CompareMatrix.vue'

const s = reactive({ wifi: true, bt: true, nearby: false, stage: false, mirror: false, dark: false, capture: false, focus: false, playing: true, display: 60, sound: 45 })
const detail = ref('')
const output = ref('speakers')
const net = ref('Silica Net')
const other = ref(true)
const volume = ref(60)
const code = computed(() => `<SControlPanel @edit="…">
  <SControlModule kind="toggle" glyph="wifi" title="Wi-Fi" :subtitle="wifi ? 'Silica Net' : 'Off'" v-model="wifi" detail @detail="open = 'wifi'" />
  <SControlModule kind="tile" glyph="moon" title="Dark Mode" v-model="dark" />
  <SControlModule kind="slider" title="Sound" min-glyph="volume-0" max-glyph="volume-2" output="headphones" v-model="sound" />
</SControlPanel>

<SControlDetail title="Wi-Fi">
  <template #accessory><SSwitch v-model="wifi" /></template>
  <SControlRow kind="section" label="Known networks" />
  <SControlRow kind="network" label="Silica Net" secure active @click="join" />
  <SControlRow kind="footer" label="Wi-Fi Settings…" />
</SControlDetail>`)

const mods = [
  { key: 'Module/Toggle/On', label: 'Toggle on', p: { kind: 'toggle', glyph: 'wifi', title: 'Wi-Fi', subtitle: 'Silica Net', modelValue: true } },
  { key: 'Module/Toggle/Off', label: 'Toggle off', p: { kind: 'toggle', glyph: 'wifi', title: 'Wi-Fi', subtitle: 'Off' } },
  { key: 'Module/Toggle/On Hover', label: 'Toggle hover', p: { kind: 'toggle', glyph: 'wifi', title: 'Wi-Fi', subtitle: 'Silica Net', modelValue: true, detail: true, force: 'hover' } },
  { key: 'Module/Tile/On', label: 'Tile on', p: { kind: 'tile', glyph: 'moon', modelValue: true } },
  { key: 'Module/Tile/Off', label: 'Tile off', p: { kind: 'tile', glyph: 'moon' } },
  { key: 'Module/Slider/Sound', label: 'Slider, sound', p: { kind: 'slider', title: 'Sound', minGlyph: 'volume-0', maxGlyph: 'volume-2', output: 'headphones', modelValue: 51 } },
  { key: 'Module/Slider/Display', label: 'Slider, display', p: { kind: 'slider', title: 'Display', minGlyph: 'sun-min', maxGlyph: 'sun', modelValue: 60 } },
  { key: 'Module/Now Playing/Playing', label: 'Now playing', p: { kind: 'playing', title: 'Lemon Song', subtitle: 'The Zest Band', modelValue: true, tint: 'var(--palette-terracotta)' } },
  { key: 'Module/Edit Button', label: 'Edit button', p: { kind: 'pill', title: 'Edit Controls' } },
  { key: 'Module/Privacy Pill', label: 'Privacy pill', p: { kind: 'pill', title: 'Recorder', glyph: 'mic' } },
]
const one = [{ key: 'x', label: 'Live over kit' }]
const rowsKit = [
  { key: 'Row/Item/Rest', label: 'Item', p: { kind: 'item', label: 'Item' } }, { key: 'Row/Item/Active', label: 'Item, active', p: { kind: 'item', label: 'Item', active: true } },
  { key: 'Row/Network Secure/Rest', label: 'Network, secure', p: { kind: 'network', label: 'Network', secure: true } }, { key: 'Row/Network Open/Rest', label: 'Network, open', p: { kind: 'network', label: 'Network' } },
  { key: 'Row/Section', label: 'Section', p: { kind: 'section', label: 'Section' } }, { key: 'Row/Footer', label: 'Footer', p: { kind: 'footer', label: 'Settings…' } },
  { key: 'Row/Slider', label: 'Slider', p: { kind: 'slider', minGlyph: 'sun-min', maxGlyph: 'sun', modelValue: 60 } },
]
</script>

<template>
  <DocPage title="Control Center" lead="Modules on thin glass in a 292 pt grid (toggle, tile, slider, now playing, pills), and the 312 pt detail panes with their rows. Everything is live: switches, sliders, taps on a toggle's text open its detail.">
    <h2>Playground</h2>
    <Stage glass :pad="32" class="play">
      <SControlPanel>
        <SControlModule kind="toggle" glyph="wifi" title="Wi-Fi" :subtitle="s.wifi ? 'Silica Net' : 'Off'" v-model="s.wifi" detail @detail="detail = 'wifi'" />
        <SControlModule kind="playing" title="Lemon Song" subtitle="The Zest Band" tint="var(--palette-terracotta)" v-model="s.playing" />
        <SControlModule kind="toggle" glyph="bluetooth" title="Bluetooth" :subtitle="s.bt ? 'On' : 'Off'" v-model="s.bt" />
        <SControlModule kind="toggle" glyph="share-nearby" title="Nearby" :subtitle="s.nearby ? 'Everyone' : 'Off'" v-model="s.nearby" />
        <SControlModule kind="tile" glyph="display-2" title="Stage View" v-model="s.stage" />
        <SControlModule kind="tile" glyph="screen-cast" title="Screen Mirroring" v-model="s.mirror" />
        <SControlModule kind="tile" glyph="moon-stars" title="Dark Mode" v-model="s.dark" />
        <SControlModule kind="tile" glyph="screen-share" title="Screen Capture" v-model="s.capture" />
        <SControlModule kind="toggle" glyph="moon" title="Focus" :subtitle="s.focus ? 'On' : 'Off'" v-model="s.focus" detail @detail="detail = 'sound'" />
        <SControlModule kind="slider" title="Display" min-glyph="sun-min" max-glyph="sun" v-model="s.display" />
        <SControlModule kind="slider" title="Sound" min-glyph="volume-0" max-glyph="volume-2" output="headphones" v-model="s.sound" @output="detail = 'sound'" />
      </SControlPanel>
      <SControlDetail v-if="detail === 'wifi'" title="Wi-Fi">
        <template #accessory><SSwitch v-model="s.wifi" /></template>
        <SControlRow kind="section" label="Known networks" />
        <SControlRow kind="network" label="Silica Net" secure :active="net === 'Silica Net'" signal="wifi-2" glyph="wifi" @click="net = 'Silica Net'" />
        <SControlRow kind="network" label="Casa Nonna" secure :active="net === 'Casa Nonna'" signal="wifi-1" @click="net = 'Casa Nonna'" />
        <hr />
        <SControlRow kind="section" label="Other networks" collapsible v-model:open="other" />
        <template v-if="other"><SControlRow kind="network" label="Bar Gelsomino" signal="wifi-1" :active="net === 'Bar Gelsomino'" @click="net = 'Bar Gelsomino'" /><SControlRow kind="network" label="Hotel Amalfi" secure signal="wifi-0" @click="net = 'Hotel Amalfi'" /></template>
        <hr />
        <SControlRow kind="footer" label="Wi-Fi Settings…" />
      </SControlDetail>
      <SControlDetail v-else-if="detail === 'sound'" title="Sound">
        <SControlRow kind="slider" min-glyph="volume-0" max-glyph="volume-2" v-model="volume" label="Volume" />
        <hr />
        <SControlRow kind="section" label="Output" />
        <SControlRow kind="item" glyph="speaker" label="Speakers" :active="output === 'speakers'" @click="output = 'speakers'" />
        <SControlRow kind="item" glyph="headphones" label="Headphones" :active="output === 'headphones'" @click="output = 'headphones'" />
        <hr />
        <SControlRow kind="footer" label="Sound Settings…" />
      </SControlDetail>
      <div v-else class="muted hint">tap the text of Wi-Fi or Focus, or the headphones, to open a detail pane</div>
    </Stage>
    <Code :code="code" />

    <h2>Panel, compared with the kit</h2>
    <Stage glass :pad="24" class="col">
      <SidePair label="panel" kit="Control Center/Panel/Default">
        <SControlPanel>
          <SControlModule kind="toggle" glyph="wifi" title="Wi-Fi" subtitle="Silica Net" :model-value="true" />
          <SControlModule kind="playing" title="Lemon Song" subtitle="The Zest Band" tint="var(--palette-terracotta)" :model-value="true" />
          <SControlModule kind="toggle" glyph="bluetooth" title="Bluetooth" subtitle="Headphones" :model-value="true" />
          <SControlModule kind="toggle" glyph="share-nearby" title="Nearby" subtitle="Off" />
          <SControlModule kind="tile" glyph="window-stack" /><SControlModule kind="tile" glyph="screen-cast" />
          <SControlModule kind="tile" glyph="moon" /><SControlModule kind="tile" glyph="camera" />
          <SControlModule kind="toggle" glyph="moon" title="Focus" subtitle="Off" />
          <SControlModule kind="slider" title="Display" min-glyph="sun-min" max-glyph="sun" :model-value="60" />
          <SControlModule kind="slider" title="Sound" min-glyph="volume-0" max-glyph="volume-2" output="headphones" :model-value="51" />
        </SControlPanel>
      </SidePair>
    </Stage>

    <h2>Modules, compared with the kit</h2>
    <CompareMatrix glass :rows="mods.map((m) => ({ key: m.key, label: m.label }))" :cols="one" :kit="(r) => `Control Center/${r.key}`">
      <template #default="{ row }"><SControlModule v-bind="mods.find((m) => m.key === row.key).p" /></template>
    </CompareMatrix>

    <h2>Detail panes and rows, compared with the kit</h2>
    <Stage glass :pad="24" class="col">
      <SidePair label="Wi-Fi" kit="Control Center/Detail/Wi-Fi">
        <SControlDetail title="Wi-Fi">
          <template #accessory><SSwitch :model-value="true" /></template>
          <SControlRow kind="section" label="Known networks" />
          <SControlRow kind="network" label="Silica Net" secure active /><SControlRow kind="network" label="Casa Nonna" secure />
          <hr />
          <SControlRow kind="section" label="Other networks" collapsible />
          <SControlRow kind="network" label="Bar Gelsomino" /><SControlRow kind="network" label="Hotel Amalfi" secure />
          <hr /><SControlRow kind="footer" label="Wi-Fi Settings…" />
        </SControlDetail>
      </SidePair>
      <SidePair label="Sound" kit="Control Center/Detail/Sound">
        <SControlDetail title="Sound">
          <SControlRow kind="slider" min-glyph="volume-0" max-glyph="volume-2" :model-value="60" /><hr />
          <SControlRow kind="section" label="Output" />
          <SControlRow kind="item" glyph="speaker" label="Speakers" active /><SControlRow kind="item" glyph="headphones" label="Headphones" />
          <hr /><SControlRow kind="footer" label="Sound Settings…" />
        </SControlDetail>
      </SidePair>
    </Stage>
    <CompareMatrix glass :rows="rowsKit.map((m) => ({ key: m.key, label: m.label }))" :cols="one" :kit="(r) => `Control Center/${r.key}`">
      <template #default="{ row }"><div style="width: 280px"><SControlRow v-bind="rowsKit.find((m) => m.key === row.key).p" /></div></template>
    </CompareMatrix>

    <h2>Status menu</h2>
    <p class="muted">The battery status menu is an SMenu from the menu bar (see Menu bar and Dock); this is the same menu on its own.</p>
    <Stage glass :pad="24" class="col">
      <SidePair label="battery menu" kit="Control Center/Status Menu/Battery">
        <SMenu :width="232"><SMenuItem header label="Battery" /><SMenuItem label="78 % charged" disabled /><SMenuItem label="Power Source: Battery" disabled /><SMenuSeparator /><SMenuItem label="Battery Settings…" /></SMenu>
      </SidePair>
    </Stage>
  </DocPage>
</template>

<style scoped>
.play { gap: 24px; align-items: flex-start; justify-content: center; }
.hint { align-self: center; max-width: 220px; }
.col { flex-direction: column; flex-wrap: nowrap; align-items: flex-start; overflow-x: auto; gap: 8px; }
</style>
