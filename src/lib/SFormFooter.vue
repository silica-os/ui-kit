<script setup>
/** The button row at the bottom of a form (Forms/Footer): content is pushed to the trailing edge, with 8 pt between buttons. Put a `leading` slot for something on the left. */
</script>

<template>
  <footer class="s-formfooter"><slot name="leading" /><span class="s-formfooter__spacer" /><slot /></footer>
</template>

<style>
.s-formfooter { display: flex; align-items: center; gap: 8px; }
.s-formfooter__spacer { flex: 1; }
</style>
