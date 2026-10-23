<script setup>
/**
 * Push button. Variants and sizes follow the kit (Buttons/Push). The label is the default slot; put an
 * <SIcon> in the `icon` slot for a glyph before it.
 */
defineProps({
  variant: { type: String, default: 'secondary', validator: (v) => ['primary', 'secondary', 'destructive', 'borderless', 'glass'].includes(v) },
  size: { type: String, default: 'regular', validator: (v) => ['mini', 'small', 'regular', 'large'].includes(v) },
  disabled: Boolean,
  type: { type: String, default: 'button' },
  /** Shows a state without the pointer (hover | pressed | focus). Used by the showcase to compare with the kit. */
  force: { type: String, default: '' },
})
</script>

<template>
  <button class="s-control s-button" :class="[`s-button--${variant}`, `s-button--${size}`, force && `is-${force}`]" :type="type" :disabled="disabled">
    <span v-if="$slots.icon" class="s-button__icon"><slot name="icon" /></span>
    <span class="s-button__label"><slot /></span>
  </button>
</template>

<style>
.s-button {
  position: relative; display: inline-flex; align-items: center; justify-content: center; flex: none;
  border: 0; background: none; margin: 0; cursor: pointer; white-space: nowrap;
  color: var(--text-primary); font: var(--font-body-emphasis);
  min-width: 72px; height: var(--control-regular); padding: 0 12px; gap: 4px; border-radius: 14px;
}
.s-button--mini { min-width: 56px; height: var(--control-mini); padding: 0 8px; border-radius: 10px; font: var(--font-caption); font-weight: 400; }
.s-button--small { min-width: 56px; height: var(--control-small); padding: 0 8px; border-radius: 12px; font: var(--font-label); }
.s-button--large { min-width: 88px; height: var(--control-large); padding: 0 16px; gap: 8px; border-radius: 16px; font: var(--font-title-3); }

/* background layer, state overlay and focus halo are pseudo elements so the label stays on top */
.s-button::before, .s-button::after { content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; }
.s-button > * { position: relative; z-index: 1; }
.s-button:is(:focus-visible, .is-focus)::after { box-shadow: 0 0 0 3px var(--line-focus); }
.s-button--mini { --s-r: 10px; } .s-button--small { --s-r: 12px; } .s-button--large { --s-r: 16px; }
.s-button--regular { --s-r: 14px; }
.s-button__icon { display: inline-flex; }

.s-button--primary { color: var(--text-on-accent); }
.s-button--primary::before { background: var(--accent-amalfi); }
.s-button--primary:is(:hover, .is-hover):not(:active, .is-pressed)::after { background: var(--state-hover-overlay); }
.s-button--primary:is(:active, .is-pressed)::before { background: var(--accent-amalfi-pressed); }

.s-button--secondary::before { background: var(--surface-control); box-shadow: inset 0 0 0 1px var(--line-border), var(--elevation-1); }
.s-button--secondary:is(:hover, .is-hover):not(:active, .is-pressed)::after { background: var(--accent-amalfi-soft); }
.s-button--secondary:is(:active, .is-pressed)::before { background: var(--surface-control-pressed); }

.s-button--destructive { color: var(--text-on-accent); }
.s-button--destructive::before { background: var(--palette-terracotta); }
.s-button--destructive:is(:hover, .is-hover):not(:active, .is-pressed)::after { background: var(--state-hover-overlay); }
.s-button--destructive:is(:active, .is-pressed)::after { background: var(--state-press-overlay); }

.s-button--borderless { color: var(--accent-amalfi); }
.s-button--borderless:is(:hover, .is-hover)::after, .s-button--borderless:is(:active, .is-pressed)::after { background: var(--accent-amalfi-soft); }

.s-button--glass::before {
  background: linear-gradient(var(--glass-tint), var(--glass-tint)), #ffffff03;
  box-shadow: inset 0 0 0 1px var(--glass-rim-dark), inset 0 1px 1px var(--glass-rim-light), inset 0 0 3px #ffffff40, var(--elevation-glass);
  backdrop-filter: var(--s-fx-regular); -webkit-backdrop-filter: var(--s-fx-regular);
  transition: box-shadow var(--fade-quick);
}
.s-button--glass:is(:active, .is-pressed)::after { background: var(--accent-amalfi-soft); }

.s-button::before, .s-button::after { transition: background var(--fade-quick), box-shadow var(--fade-quick); }
</style>
