<script>
export const meta = { title: 'Sidebars in windows', order: 82 }
</script>

<script setup>
import { computed, reactive, ref } from 'vue'
import SWindow from '../../lib/SWindow.vue'
import STitlebarPiece from '../../lib/STitlebarPiece.vue'
import STitlebarTitle from '../../lib/STitlebarTitle.vue'
import SSidebar from '../../lib/SSidebar.vue'
import SSidebarGroup from '../../lib/SSidebarGroup.vue'
import SSidebarItem from '../../lib/SSidebarItem.vue'
import SGroupBox from '../../lib/SGroupBox.vue'
import SCheckbox from '../../lib/SCheckbox.vue'
import SSlider from '../../lib/SSlider.vue'
import DocPage from '../DocPage.vue'
import Stage from '../Stage.vue'
import Code from '../Code.vue'

const view = ref('list')
const views = [{ value: 'list', icon: 'list-bullet' }, { value: 'grid', icon: 'square-grid-2x2' }]
const query = ref('')
const place = ref('documents')
const places = [
  { title: 'Favourites', items: [{ value: 'recents', icon: 'clock', label: 'Recents' }, { value: 'documents', icon: 'folder', label: 'Documents', badge: '12' }, { value: 'downloads', icon: 'download', label: 'Downloads' }] },
  { title: 'Library', items: [{ value: 'photos', icon: 'photo', label: 'Photos' }, { value: 'music', icon: 'folder', label: 'Music' }] },
]
const files = ['Lemon cake.recipe', 'Orange tart.recipe', 'Almond biscuits.recipe', 'Focaccia.recipe', 'Shopping list.txt', 'Menu.pdf']
const lorem = 'Whisk the eggs with sugar until pale, fold in the flour, then the lemon zest and juice. Bake for forty minutes and let it cool before slicing.'

// playground
const pg = reactive({ sidebar: true, inspector: true, resizable: true, toolbar: 'split' })
const tab = ref('info')
const tabs = [{ value: 'info', icon: 'info' }, { value: 'tag', icon: 'tag' }, { value: 'sliders', icon: 'sliders' }]
const code = computed(() => `<SWindow toolbar="${pg.toolbar}" title="Documents" v-model:sidebar-open="sidebar" v-model:inspector-open="inspector"${pg.resizable ? ' resizable' : ''}>
  <template #toolbar-sidebar><!-- pieces that belong to the sidebar: gone with it --></template>
  <template #toolbar="{ toggleSidebar, toggleInspector }"><!-- the content's own pieces --></template>
  <template #toolbar-inspector><!-- pieces that belong to the inspector --></template>
  <template #sidebar><SSidebar v-model="place">…</SSidebar></template>
  Content
  <template #inspector>…</template>
</SWindow>`)

// the four states of a window
const states = reactive([
  { label: 'Both panes open', s: true, i: true }, { label: 'Sidebar folded', s: false, i: true },
  { label: 'Inspector folded', s: true, i: false }, { label: 'Both folded', s: false, i: false },
])

// mail-like three columns
const mail = reactive({ s: true, i: true })
const msg = ref(0)
const msgs = [
  { from: 'Marta Rossi', subject: 'Lemon cake for Sunday', text: 'Could you bring the lemon cake? I will take care of the coffee.' },
  { from: 'Luca Bianchi', subject: 'Amalfi trip', text: 'The ferry leaves at nine, we should be at the harbour by half past eight.' },
  { from: 'Giulia Esposito', subject: 'Photos from the coast', text: 'I shared the album with you. The sunset ones came out well.' },
  { from: 'Silica', subject: 'Your weekly summary', text: 'Seven recipes saved, three shared, one cake very much loved.' },
]
const box = ref('inbox')

// unified
const uni = reactive({ s: true })

// editor with inspector only
const ed = reactive({ i: true })
const style = ref('text')
const styleTabs = [{ value: 'text', icon: 'text-size' }, { value: 'arrange', icon: 'square-grid-2x2' }]
const size = ref(14)
</script>

<template>
  <DocPage title="Sidebars in windows" lead="Real windows have a sidebar on the left, an inspector on the right, or both, and the toolbar is cut into sections that follow them. Everything here is live: fold the panes with the toolbar buttons, with Ctrl-Cmd-S and Alt-Cmd-I, or drag their inner edge.">
    <h2>Playground</h2>
    <div class="play">
      <Stage :pad="44" class="col scroll">
        <SWindow :toolbar="pg.toolbar" title="Documents" v-model:sidebar-open="pg.sidebar" v-model:inspector-open="pg.inspector" :resizable="pg.resizable" :width="920" :height="440">
          <template #toolbar="{ toggleSidebar }">
            <STitlebarPiece v-if="pg.toolbar === 'unified'" kind="icon" icon="sidebar" :label="pg.sidebar ? 'Hide sidebar' : 'Show sidebar'" @click="toggleSidebar" />
            <STitlebarPiece kind="nav" />
            <STitlebarTitle flex title="Documents" :subtitle="`${files.length} items`" />
            <STitlebarPiece kind="views" :items="views" v-model="view" />
            <STitlebarPiece kind="search" v-model="query" :width="140" />
          </template>
          <template #toolbar-inspector><STitlebarPiece kind="views" :items="tabs" v-model="tab" /></template>
          <template #sidebar>
            <SSidebar v-model="place">
              <SSidebarGroup v-for="g in places" :key="g.title" :title="g.title"><SSidebarItem v-for="it in g.items" :key="it.value" v-bind="it" /></SSidebarGroup>
            </SSidebar>
          </template>
          <div class="files"><div v-for="f in files" :key="f" class="file">{{ f }}</div></div>
          <template #inspector>
            <div class="insp"><b>Lemon cake.recipe</b><span class="muted">Recipe · 4 KB</span><SGroupBox><SCheckbox model-value>Locked</SCheckbox><SCheckbox>Hide extension</SCheckbox></SGroupBox></div>
          </template>
        </SWindow>
      </Stage>
      <div class="card ctrl">
        <div class="field"><label>Toolbar</label><div class="seg"><button v-for="m in ['split', 'unified']" :key="m" :class="{ on: pg.toolbar === m }" @click="pg.toolbar = m">{{ m }}</button></div></div>
        <label class="chk"><input v-model="pg.sidebar" type="checkbox" /> sidebar open</label>
        <label class="chk"><input v-model="pg.inspector" type="checkbox" /> inspector open</label>
        <label class="chk"><input v-model="pg.resizable" type="checkbox" /> resizable (drag the edges)</label>
        <p class="muted small">Split: the controls and the toggles are handled by the window. Unified: the bar stays whole, the toggle is yours (<code>toggleSidebar</code> comes with the slot).</p>
      </div>
    </div>
    <Code :code="code" />

    <h2>The toolbar splits with the panes</h2>
    <div class="rules">
      <div class="rule"><b>Sidebar section</b><p>As wide as the sidebar and translucent like it. Holds the window controls (always the same place) and, at its trailing edge, the sidebar toggle. Pieces that only make sense for the sidebar (new folder, filter) go here and fold away with it.</p></div>
      <div class="rule"><b>List section</b><p>Only in three-column windows. It is the toolbar of the list (title, sort, compose) and has its own width.</p></div>
      <div class="rule"><b>Content section</b><p>Fills what is left. Navigation, title, view switch, search, actions. When the sidebar is folded it makes room for the window controls and takes the sidebar toggle as its first piece; the inspector toggle is its last piece when the inspector is folded.</p></div>
      <div class="rule"><b>Inspector section</b><p>As wide as the inspector. Holds the inspector's own pieces (its tabs) and the inspector toggle at the trailing edge, which keeps its place at the window's edge whether the pane is open or not.</p></div>
    </div>

    <h2>The four states</h2>
    <Stage :pad="44" class="col scroll">
      <div v-for="st in states" :key="st.label" class="state">
        <div class="lab">{{ st.label }}</div>
        <SWindow toolbar="split" title="Documents" v-model:sidebar-open="st.s" v-model:inspector-open="st.i" :sidebar-width="190" :inspector-width="200" :width="720" :height="260">
          <template #toolbar>
            <STitlebarPiece kind="nav" />
            <STitlebarTitle flex title="Documents" />
                      </template>
          <template #sidebar>
            <SSidebar model-value="documents">
              <SSidebarGroup title="Favourites"><SSidebarItem value="recents" icon="clock" label="Recents" /><SSidebarItem value="documents" icon="folder" label="Documents" /></SSidebarGroup>
            </SSidebar>
          </template>
          <div class="files"><div v-for="f in files.slice(0, 4)" :key="f" class="file">{{ f }}</div></div>
          <template #inspector><div class="insp"><b>Inspector</b></div></template>
        </SWindow>
      </div>
    </Stage>

    <h2>Three columns: sidebar, list, content</h2>
    <p class="muted note">Each column has its own toolbar section. The list's pieces stay put when the sidebar goes; only the content section moves to make room for the controls once the list is the first column.</p>
    <Stage :pad="44" class="col scroll">
      <SWindow toolbar="split" v-model:sidebar-open="mail.s" v-model:inspector-open="mail.i" :sidebar-width="190" :list-width="270" :inspector-width="210" :width="920" :height="440">
        <template #toolbar-list><STitlebarTitle flex title="Inbox" :subtitle="`${msgs.length} messages`" /><STitlebarPiece kind="icon" icon="compose" label="New message" /></template>
        <template #toolbar>
          <STitlebarTitle flex :title="msgs[msg].subject" />
          <STitlebarPiece kind="group" :items="[{ value: 'archive', icon: 'archive' }, { value: 'trash', icon: 'trash' }]" />
          <STitlebarPiece kind="icon" icon="reply" label="Reply" />
        </template>
        <template #toolbar-inspector><STitlebarTitle flex title="Details" /></template>
        <template #sidebar>
          <SSidebar v-model="box">
            <SSidebarGroup title="Mailboxes"><SSidebarItem value="inbox" icon="tray" label="Inbox" badge="4" /><SSidebarItem value="sent" icon="arrow-up" label="Sent" /><SSidebarItem value="archive" icon="archive" label="Archive" /></SSidebarGroup>
          </SSidebar>
        </template>
        <template #list>
          <button v-for="(m, i) in msgs" :key="m.subject" type="button" class="msg" :class="{ on: msg === i }" @click="msg = i"><b>{{ m.from }}</b><span>{{ m.subject }}</span><small>{{ m.text }}</small></button>
        </template>
        <div class="cnt"><h1>{{ msgs[msg].subject }}</h1><p class="muted">From {{ msgs[msg].from }}</p><p>{{ msgs[msg].text }}</p></div>
        <template #inspector><div class="insp"><b>{{ msgs[msg].from }}</b><span class="muted">Contact</span></div></template>
      </SWindow>
    </Stage>

    <h2>Unified toolbar</h2>
    <p class="muted note">One bar over the whole window: nothing splits, so nothing moves when the sidebar folds. Put the toggle where the window expects it, right after the controls, and use the slot's <code>toggleSidebar</code>.</p>
    <Stage :pad="44" class="col scroll">
      <SWindow toolbar="unified" v-model:sidebar-open="uni.s" :sidebar-width="220" :width="760" :height="340">
        <template #toolbar="{ sidebarOpen, toggleSidebar }">
          <STitlebarPiece kind="icon" icon="sidebar" :label="sidebarOpen ? 'Hide sidebar' : 'Show sidebar'" @click="toggleSidebar" />
          <STitlebarPiece kind="nav" />
          <STitlebarTitle flex title="Lemon cake" />
          <STitlebarPiece kind="icon" icon="share" label="Share" />
        </template>
        <template #sidebar>
          <SSidebar model-value="documents">
            <SSidebarGroup v-for="g in places" :key="g.title" :title="g.title"><SSidebarItem v-for="it in g.items" :key="it.value" v-bind="it" /></SSidebarGroup>
          </SSidebar>
        </template>
        <div class="cnt"><h1>Lemon cake</h1><p>{{ lorem }}</p></div>
      </SWindow>
    </Stage>

    <h2>Inspector only</h2>
    <p class="muted note">Editors and design tools: no sidebar, the right pane carries the controls. Its tabs live in the inspector section; the toggle that opens it is the last piece of the content section.</p>
    <Stage :pad="44" class="col scroll">
      <SWindow toolbar="split" v-model:inspector-open="ed.i" :inspector-width="260" :width="760" :height="340">
        <template #toolbar><STitlebarTitle flex title="Lemon cake.recipe" subtitle="Edited" /><STitlebarPiece kind="icon" icon="share" label="Share" /></template>
        <template #toolbar-inspector><STitlebarPiece kind="views" :items="styleTabs" v-model="style" /></template>
        <div class="cnt"><h1>Lemon cake</h1><p>{{ lorem }}</p></div>
        <template #inspector>
          <div class="insp">
            <template v-if="style === 'text'"><b>Text</b><SGroupBox><SSlider v-model="size" :min="8" :max="40" /><span class="muted">Size {{ size }} pt</span></SGroupBox></template>
            <template v-else><b>Arrange</b><SGroupBox><SCheckbox model-value>Wrap text</SCheckbox><SCheckbox>Move with text</SCheckbox></SGroupBox></template>
          </div>
        </template>
      </SWindow>
    </Stage>

    <h2>Rules</h2>
    <ul class="list">
      <li>The sidebar toggle is the pane's own piece: trailing edge of the sidebar section while it is open, first piece of the content section while it is folded. Never duplicate it.</li>
      <li>The window controls never move. The section next to them makes room.</li>
      <li>A piece belongs to the section whose pane it acts on. Sidebar pieces fold with the sidebar; inspector pieces fold with the inspector.</li>
      <li>The inspector toggle stays at the window's trailing edge in both states.</li>
      <li>Panes fold by width (426 ms panel spring), their contents keep their size and are clipped, so nothing reflows while it moves.</li>
      <li>Dragging a pane well below its minimum folds it; dragging it out unfolds it. Folded panes are <code>inert</code>.</li>
      <li>Keyboard: Ctrl-Cmd-S toggles the sidebar, Alt-Cmd-I the inspector, while the window has focus.</li>
    </ul>
  </DocPage>
</template>

<style scoped>
.play { display: flex; flex-direction: column; gap: 12px; }
.col { flex-direction: column; flex-wrap: nowrap; align-items: flex-start; gap: 16px; }
.scroll { overflow-x: auto; }
.ctrl { padding: 14px 16px; display: flex; flex-flow: row wrap; align-items: center; gap: 12px 24px; }
.chk { display: flex; gap: 6px; align-items: center; }
.small { font-size: 12px; margin: 0; flex-basis: 100%; }
.note { max-width: 680px; margin: -4px 0 12px; }
.lab { font-size: 11px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: var(--text-tertiary); margin-bottom: 8px; }
.state { display: flex; flex-direction: column; }
.rules { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; margin-bottom: 8px; }
.rule { padding: 14px 16px; border-radius: 12px; background: var(--surface-control, transparent); box-shadow: inset 0 0 0 1px var(--line-border); }
.rule b { font: var(--font-headline); }
.rule p { margin: 6px 0 0; font: var(--font-callout); color: var(--text-secondary); }
.list { max-width: 720px; padding-left: 20px; font: var(--font-body); color: var(--text-secondary); display: flex; flex-direction: column; gap: 6px; }
.files { display: flex; flex-direction: column; }
.file { padding: 10px 24px; border-bottom: 1px solid var(--line-separator); font: var(--font-body); }
.insp { padding: 20px 16px; display: flex; flex-direction: column; gap: 12px; font: var(--font-headline); }
.cnt { padding: 24px; }
.cnt h1 { margin: 0 0 8px; font: var(--font-title-1); color: var(--text-primary); }
.cnt p { margin: 0 0 12px; font: var(--font-body); color: var(--text-secondary); max-width: none; }
.msg { display: flex; flex-direction: column; gap: 2px; width: 100%; padding: 12px 24px; border: 0; border-bottom: 1px solid var(--line-separator); background: none; text-align: left; font: var(--font-headline); color: var(--text-primary); cursor: default; }
.msg span { font: var(--font-body); }
.msg small { font: var(--font-callout); color: var(--text-tertiary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.msg.on { background: var(--accent-amalfi); color: var(--text-on-accent); }
.msg.on small { color: inherit; opacity: 0.8; }
</style>
