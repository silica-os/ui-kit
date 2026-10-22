<script setup>
import AnimationLab from '../docs/AnimationLab.vue'
</script>

<template>
  <div class="page">
    <h1>Animation Lab</h1>
    <p class="muted">Move a whole component (position, scale, rotation, opacity) with a spring or a curve, tune it, then copy it as Rust or JSON. For state changes (hover, press, on/off) open the component and use <b>Transition</b>.</p>
    <AnimationLab />
  </div>
</template>

<style scoped>.page { padding: 36px; max-width: 1280px; }</style>
