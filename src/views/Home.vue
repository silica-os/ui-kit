<script setup>
import { groupsByCategory, symbols } from '../kit.js'
import { library } from '../showcase/registry.js'
import { href } from '../router.js'
import tokens from '../../tokens/tokens.json'

const cats = [...groupsByCategory].map(([cat, groups]) => ({ cat, n: groups.length }))
</script>

<template>
  <div class="page">
    <h1>Silica UI Kit</h1>
    <p class="lead muted">The Amalfi 1.0 component library, built to be used: real Vue components on the design tokens, each one compared side by side with the Sketch kit it comes from.</p>

    <div class="grid">
      <a class="card tile" :href="href('lib', library[0].key)"><b>Library</b><span class="muted">{{ library.length }} pages of live components: use them, press them, type in them, drag them. Light and dark.</span></a>
      <a class="card tile" :href="href('colors')"><b>Tokens</b><span class="muted">{{ Object.keys(tokens.colors.light).length }} colours, {{ Object.keys(tokens.typography).length }} text styles, glass, spacing, radii, shadows. Also as CSS and Rust.</span></a>
      <a class="card tile" :href="href('motion')"><b>Motion</b><span class="muted">Spring and fade tokens with their curves and settle times.</span></a>
      <a class="card tile" :href="href('components', 'Buttons')"><b>Kit renders</b><span class="muted">{{ symbols.length }} masters drawn from the Sketch layer trees, with their variants, composition and transitions.</span></a>
      <a class="card tile" :href="href('lab')"><b>Animation Lab</b><span class="muted">Tune a spring or a curve on any component and copy it as Rust.</span></a>
    </div>

    <h2>Using the library</h2>
    <ol class="steps">
      <li>Open a page under <b>Library</b>: the playground has the live component, its props and the code to copy.</li>
      <li>Below it, every state is shown live over the kit's own render of the same state: they should be identical.</li>
      <li>In your Vue app: <code>import SButton from 'src/lib/SButton.vue'</code> and load <code>tokens/tokens.css</code>. Components reuse each other, so an alert is built from buttons.</li>
    </ol>

    <h2>Kit categories</h2>
    <div class="cats"><a v-for="c in cats" :key="c.cat" class="chip" :href="href('components', c.cat)">{{ c.cat }} <small>{{ c.n }}</small></a></div>
  </div>
</template>

<style scoped>
.page { padding: 36px; max-width: 960px; }
.lead { font-size: 16px; max-width: 640px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; margin-top: 24px; }
.tile { padding: 16px; display: flex; flex-direction: column; gap: 6px; color: var(--text); }
.tile:hover { border-color: var(--accent); } .tile span { font-size: 13px; }
.steps { padding-left: 20px; display: flex; flex-direction: column; gap: 6px; }
.cats { display: flex; flex-wrap: wrap; gap: 8px; }
.chip { padding: 4px 12px; border-radius: 99px; border: 1px solid var(--line); background: var(--panel); color: var(--text); } .chip small { color: var(--muted); margin-left: 4px; }
.chip:hover { border-color: var(--accent); }
</style>
