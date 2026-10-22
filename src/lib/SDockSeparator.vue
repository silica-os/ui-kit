<template><div class="s-dock-sep" role="separator" aria-orientation="vertical" /></template>

<style>
.s-dock-sep { position: relative; flex: none; width: 28px; height: 80px; }
.s-dock-sep::after { content: ''; position: absolute; left: 14px; top: 10px; width: 1px; height: 60px; background: color-mix(in srgb, var(--text-primary) 35%, transparent); }
</style>
