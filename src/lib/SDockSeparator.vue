<template><div class="s-dock-sep" role="separator" aria-orientation="vertical" /></template>

<style>
/* kit Dock/Separator: 28 x 80 slot, a 1 x 60 line at (14, 10), Text Primary at 35 % (30 % in Dark) */
.s-dock-sep { position: relative; flex: none; width: 28px; height: 80px; --s-dock-sep-a: 35%; }
.s-dock-sep::after { content: ''; position: absolute; left: 14px; top: 10px; width: 1px; height: 60px; background: color-mix(in srgb, var(--text-primary) var(--s-dock-sep-a), transparent); }
[data-theme='dark'] .s-dock-sep { --s-dock-sep-a: 30%; }
@media (prefers-color-scheme: dark) { :root:not([data-theme]) .s-dock-sep { --s-dock-sep-a: 30%; } }
</style>
