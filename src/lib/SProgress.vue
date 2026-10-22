<script setup>
import { computed } from 'vue'

/**
 * Progress indicator (role="progressbar"). `kind`: bar (determinate with `value` 0..100, or indeterminate when `value` is
 * null), circular (ring, same rules) or spinner (twelve spokes, always indeterminate). Sizes follow the kit.
 */
const props = defineProps({
  /** 0..100, or null for indeterminate (bar and circular). */
  value: { type: Number, default: null },
  kind: { type: String, default: 'bar', validator: (v) => ['bar', 'circular', 'spinner'].includes(v) },
  size: { type: String, default: 'regular', validator: (v) => ['small', 'regular', 'large'].includes(v) },
  disabled: Boolean,
  /** Freeze the animation (documentation). A frozen spinner shows the kit's Rest frame (head at 12 o'clock, tail fading clockwise). */
  paused: Boolean,
  /** Indeterminate bar only: freeze the sliding segment at this point of its sweep, 0..1 (the kit's Phase 1/2/3 are 0.265, 0.5, 0.75). */
  phase: { type: Number, default: null },
})
const pct = computed(() => (props.value === null ? null : Math.min(100, Math.max(0, props.value))))
const geom = computed(() => {
  const d = { small: 16, regular: 24, large: 40 }[props.size]
  const sw = { small: 2, regular: 3, large: 4 }[props.size]
  const inset = { small: 1, regular: 2, large: 2 }[props.size]
  return { d, sw, r: d / 2 - inset, c: d / 2 }
})
const circ = computed(() => 2 * Math.PI * geom.value.r)
</script>

<template>
  <div
    class="s-progress" :class="[`s-progress--${kind}`, `s-progress--${size}`, { 's-progress--indeterminate': pct === null || kind === 'spinner', 'is-complete': pct === 100, 'is-disabled': disabled, 'is-paused': paused }]"
    role="progressbar" :aria-valuemin="0" :aria-valuemax="100" :aria-valuenow="pct === null || kind === 'spinner' ? undefined : pct" :aria-disabled="disabled || undefined"
  >
    <template v-if="kind === 'bar'">
      <span class="s-progress__fill" :style="pct === null ? (phase === null ? undefined : { left: `calc(-36% + ${phase} * 136%)`, animation: 'none' }) : { width: pct + '%' }" />
    </template>
    <svg v-else-if="kind === 'circular'" class="s-progress__ring" :width="geom.d" :height="geom.d" :viewBox="`0 0 ${geom.d} ${geom.d}`">
      <circle class="s-progress__ring-track" :cx="geom.c" :cy="geom.c" :r="geom.r" :stroke-width="geom.sw" fill="none" />
      <circle
        class="s-progress__ring-fill" :cx="geom.c" :cy="geom.c" :r="geom.r" :stroke-width="geom.sw" fill="none" stroke-linecap="round"
        :stroke-dasharray="pct === null ? `${circ * 0.25} ${circ}` : `${(circ * pct) / 100} ${circ}`" :transform="`rotate(-90 ${geom.c} ${geom.c})`"
      />
    </svg>
    <template v-else>
      <span v-for="i in 12" :key="i" class="s-progress__spoke" :style="{ '--i': i - 1 }"><span /></span>
    </template>
  </div>
</template>

<style>
.s-progress { position: relative; flex: none; }
.s-progress.is-disabled { opacity: 0.35; }

/* bar */
.s-progress--bar { width: var(--s-progress-w, 200px); height: 8px; border-radius: 3px; background: var(--surface-sunken); box-shadow: inset 0 0 0 1px var(--line-separator); overflow: hidden; }
.s-progress--bar.s-progress--small { height: 4px; border-radius: 2px; }
.s-progress--bar.s-progress--large { border-radius: 4px; }
.s-progress__fill { position: absolute; left: 0; top: 0; bottom: 0; border-radius: inherit; background: var(--accent-amalfi); transition: width var(--spring-snappy), background var(--fade-quick); }
.s-progress--bar.s-progress--indeterminate .s-progress__fill { width: 36%; transition: none; animation: s-progress-slide 1.4s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
@keyframes s-progress-slide { from { left: -36%; } to { left: 100%; } }
.s-progress.is-paused .s-progress__fill, .s-progress.is-paused .s-progress__spoke, .s-progress.is-paused .s-progress__ring { animation-play-state: paused; }
/* a frozen spinner is the kit's frame: spoke 1 on top at full strength, the others rotated clockwise and fading (the running one turns clockwise, tail behind) */
.s-progress--spinner.is-paused .s-progress__spoke { transform: rotate(calc(var(--i) * 30deg)); }
.s-progress--spinner.is-paused .s-progress__spoke > span { animation: none; }

.s-progress.is-complete .s-progress__fill { background: var(--palette-ulivo); }

/* circular */
.s-progress--circular { width: 24px; height: 24px; }
.s-progress--circular.s-progress--small { width: 16px; height: 16px; }
.s-progress--circular.s-progress--large { width: 40px; height: 40px; }
.s-progress__ring { display: block; }
.s-progress__ring-track { stroke: var(--surface-sunken); }
.s-progress__ring-fill { stroke: var(--accent-amalfi); transition: stroke-dasharray var(--spring-snappy), stroke var(--fade-quick); }
.s-progress.is-complete .s-progress__ring-fill { stroke: var(--palette-ulivo); }
.s-progress--circular.s-progress--indeterminate .s-progress__ring { animation: s-progress-spin 1s linear infinite; }
@keyframes s-progress-spin { to { transform: rotate(360deg); } }

/* spinner: twelve spokes fading round, stepped like the system one */
.s-progress--spinner { width: 24px; height: 24px; }
.s-progress--spinner.s-progress--small { width: 16px; height: 16px; }
.s-progress--spinner.s-progress--large { width: 32px; height: 32px; }
.s-progress__spoke { position: absolute; inset: 0; transform: rotate(calc(var(--i) * -30deg)); }
.s-progress__spoke > span {
  position: absolute; left: 50%; top: 0; width: 4px; height: 8px; margin-left: -2px; border-radius: 1.02px; background: var(--text-secondary);
  opacity: calc(1 - var(--i) * 0.075); animation: s-progress-fade 1s steps(1, end) infinite; animation-delay: calc(var(--i) * -83.33ms);
}
.s-progress--spinner.s-progress--small .s-progress__spoke > span { width: 2px; height: 4px; margin-left: -1px; border-radius: 1px; }
.s-progress--spinner.s-progress--large .s-progress__spoke > span { border-radius: 1.36px; margin-left: -2px; }
@keyframes s-progress-fade { 0% { opacity: 1; } 8.33% { opacity: 0.925; } 16.67% { opacity: 0.85; } 25% { opacity: 0.775; } 33.33% { opacity: 0.7; } 41.67% { opacity: 0.625; } 50% { opacity: 0.55; } 58.33% { opacity: 0.475; } 66.67% { opacity: 0.4; } 75% { opacity: 0.325; } 83.33% { opacity: 0.25; } 91.67% { opacity: 0.175; } }

/* reduced motion: springs become the short fade (same as --fade-quick), no overshoot or scale */
@media (prefers-reduced-motion: reduce) {
  .s-progress__fill, .s-progress__ring-fill { transition-duration: 150ms !important; transition-timing-function: cubic-bezier(0.2, 0, 0, 1) !important; }
}
</style>
