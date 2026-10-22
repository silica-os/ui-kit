<script setup>
/** Text link in the accent colour. Renders an <a> when `href` is given, otherwise a <button>. */
defineProps({ href: String, disabled: Boolean, force: { type: String, default: '' } })
</script>

<template>
  <component :is="href ? 'a' : 'button'" class="s-control s-link" :class="[force && `is-${force}`]" :href="href" :type="href ? undefined : 'button'" :disabled="href ? undefined : disabled" :aria-disabled="disabled || undefined">
    <slot />
  </component>
</template>

<style>
.s-link { position: relative; display: inline-flex; align-items: center; height: 24px; padding: 0 4px; border: 0; background: none; border-radius: 7px; color: var(--accent-amalfi); font: var(--font-body); cursor: pointer; text-decoration: none; }
.s-link:is(:active, .is-pressed) { background: var(--accent-amalfi-soft); }
.s-link:is(:focus-visible, .is-focus) { box-shadow: 0 0 0 3px var(--line-focus); }
</style>
