<script setup>
import { groupsByCategory, symbols } from '../kit.js'
import { href } from '../router.js'
import tokens from '../../tokens/tokens.json'

const cats = [...groupsByCategory].map(([cat, groups]) => ({ cat, n: groups.length }))
</script>

<template>
  <div class="page">
    <h1>Silica UI Kit</h1>
    <p class="lead muted">Amalfi 1.0 tokens and components, exported from the Sketch kit. Everything here is drawn from the same layer trees, so geometry and colours are the kit's own.</p>

    <div class="grid">
      <a class="card tile" :href="href('colors')"><b>Tokens</b><span class="muted">{{ Object.keys(tokens.colors.light).length }} colours, {{ Object.keys(tokens.typography).length }} text styles, glass, spacing, radii, shadows. Also as CSS and Rust.</span></a>
      <a class="card tile" :href="href('motion')"><b>Motion</b><span class="muted">Spring and fade tokens with their curves and settle times.</span></a>
      <a class="card tile" :href="href('components', 'Buttons')"><b>Components</b><span class="muted">{{ symbols.length }} masters in {{ cats.length }} categories. Open one to hover, press and toggle it, animated.</span></a>
      <a class="card tile" :href="href('lab')"><b>Animation Lab</b><span class="muted">Tune a spring or a curve on any component and copy it as Rust.</span></a>
    </div>

    <h2>How to try a component</h2>
    <ol class="steps">
      <li>Pick a component in the sidebar, for example <a :href="href('components', 'Toggles', 'Switch')">Toggles › Switch</a>.</li>
      <li>On the stage, hover, press and click it: the variant changes with the motion token you choose on the right.</li>
      <li>In <b>Transition</b> choose a From and a To variant and press Play; the table shows exactly which values change, ready to copy.</li>
    </ol>

    <h2>Categories</h2>
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
