<script setup>
import SIcon from './SIcon.vue'

/**
 * The window controls (close, minimise, zoom): three 16 pt dots, 8 pt apart. The glyphs appear when the pointer is over
 * the group (as in macOS), `inactive` greys the dots like a background window. Emits `close`, `minimise`, `zoom`.
 */
defineProps({
  inactive: Boolean,
  /** hover shows the glyphs without the pointer (showcase) */
  force: { type: String, default: '' },
})
const emit = defineEmits(['close', 'minimise', 'zoom'])
const dots = [['close', 'xmark', 'Close'], ['minimise', 'minus', 'Minimise'], ['zoom', 'plus', 'Zoom']]
</script>

<template>
  <div class="s-lights" :class="[{ 'is-inactive': inactive }, force && `is-${force}`]" role="group" aria-label="Window controls">
    <button v-for="[k, glyph, label] in dots" :key="k" type="button" class="s-control s-light" :class="`s-light--${k}`" :aria-label="label" :tabindex="inactive ? -1 : 0" @click="emit(k)">
      <SIcon :name="glyph" :size="12" class="s-light__glyph" />
    </button>
  </div>
</template>

<style>
/* The traffic-light colours are not part of tokens/tokens.css (they are the OS window controls): measured from Titlebars/Dot/*. */
.s-light--close { --l-t: #fe6e66; --l-b: #f58b83; --l-ln: #dd4d47; --l-ht: #f97c72; --l-hb: #f97c72; --l-g: #a30000; --l-i1: transparent; --l-i2: transparent; }
.s-light--minimise { --l-t: #fcb82e; --l-b: #fed344; --l-ln: #d08d0b; --l-ht: #ffcf41; --l-hb: #ffcf41; --l-g: #c14400; --l-i1: transparent; --l-i2: transparent; }
.s-light--zoom { --l-t: #62d02e; --l-b: #99d979; --l-ln: #519e32; --l-ht: #8dd969; --l-hb: #8dd969; --l-g: #368800; --l-i1: transparent; --l-i2: transparent; }
[data-theme='dark'] .s-light--close { --l-t: #f8635a; --l-b: #ee6660; --l-ln: #ee5549; --l-ht: #f8635a; --l-hb: #ee6660; --l-g: #8c0000; --l-i1: #fab1a7; --l-i2: #fbada5cc; }
[data-theme='dark'] .s-light--minimise { --l-t: #fab500; --l-b: #fdcd29; --l-ln: #f8b904; --l-ht: #fab500; --l-hb: #fdcd29; --l-g: #a53a00; --l-i1: #fbee5a; --l-i2: #fbf869cc; }
[data-theme='dark'] .s-light--zoom { --l-t: #01bc00; --l-b: #4bc133; --l-ln: #09b901; --l-ht: #01bc00; --l-hb: #4bc133; --l-g: #2d7201; --l-i1: #96fb78; --l-i2: #8bfb76cc; }

.s-lights { display: inline-flex; gap: 8px; height: 16px; flex: none; }
.s-light {
  display: grid; place-items: center; width: 16px; height: 16px; padding: 0; margin: 0; border: 0; border-radius: 50%; cursor: default; color: var(--l-g);
  background: linear-gradient(var(--l-t), var(--l-b));
  box-shadow: inset 0 0 0 0.5px var(--l-ln), inset 0 1px 0 var(--l-i1), inset 0 -1px 0 var(--l-i2);
}
.s-light__glyph { opacity: 0; transition: opacity var(--fade-instant); }
.s-lights:is(:hover, .is-hover, :focus-within):not(.is-inactive) .s-light__glyph { opacity: 1; }
.s-lights:is(:hover, .is-hover):not(.is-inactive) .s-light { background: linear-gradient(var(--l-ht), var(--l-hb)); }
.s-light:focus-visible { box-shadow: 0 0 0 3px var(--line-focus); }

/* inactive: all three go neutral grey */
.s-lights.is-inactive .s-light { --l-t: #f4f4f7; --l-b: #eaebec; --l-ln: #c3c3c7; --l-i1: transparent; --l-i2: transparent; pointer-events: none; }
[data-theme='dark'] .s-lights.is-inactive .s-light { --l-t: #4d4d4d; --l-b: #555555; --l-ln: #999999b3; --l-i1: #999999; --l-i2: #909091cc; }
</style>
