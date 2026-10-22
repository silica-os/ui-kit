<script setup>
import { computed, inject, ref, useId } from 'vue'
import SIcon from './SIcon.vue'
import SMenu from './SMenu.vue'

/**
 * One item of the <SMenuBar>: a `label` (bold for the app name), a glyph (`icon`) or both (battery: "84%" then the glyph). With
 * <SMenuItem>s in the default slot it opens an <SMenu> below on click (`align="end"` right-aligns it, for the status cluster).
 * Without a menu it is a plain button that emits `click`. Outside a menu bar it works alone (`v-model:active`).
 */
const props = defineProps({
  label: { type: String, default: '' },
  icon: { type: String, default: '' },
  value: { type: String, default: '' },
  bold: Boolean,
  menu: { type: Boolean, default: undefined },
  align: { type: String, default: 'start', validator: (v) => ['start', 'end'].includes(v) },
  /** the highlight is shown (the menu is open): for use outside a menu bar and the showcase */
  active: { type: Boolean, default: false },
  menuWidth: { type: Number, default: 0 },
})
const emit = defineEmits(['click', 'update:active'])
const bar = inject('s-menubar', null)
const auto = useId()
const id = computed(() => props.value || props.label || auto)
const local = ref(false)
const isOpen = computed(() => props.active || (bar ? bar.open === id.value : local.value))
const hasMenu = computed(() => props.menu !== false)
function toggle() {
  if (bar) bar.set(isOpen.value ? '' : id.value)
  else { local.value = !isOpen.value; emit('update:active', local.value) }
  emit('click')
}
function hover() { if (bar && bar.open && bar.open !== id.value && hasMenu.value) bar.set(id.value) }
function close() { if (bar) bar.set(''); else { local.value = false; emit('update:active', false) } }
</script>

<template>
  <div class="s-mbwrap" @mouseenter="hover">
    <button type="button" class="s-control s-mbitem" :class="{ 'is-active': isOpen, 'is-bold': bold }" :data-value="id" :aria-haspopup="hasMenu ? 'menu' : undefined" :aria-expanded="hasMenu ? isOpen : undefined" @click="toggle">
      <span v-if="label" class="s-mbitem__label">{{ label }}</span>
      <SIcon v-if="icon" :name="icon" :size="20" />
    </button>
    <SMenu v-if="isOpen && $slots.default" class="s-mbwrap__menu" :class="`s-mbwrap__menu--${align}`" :width="menuWidth" @close="close"><slot /></SMenu>
  </div>
</template>

<style>
.s-mbwrap { position: relative; flex: none; }
.s-mbitem {
  position: relative; display: flex; align-items: center; justify-content: center; gap: 4px; height: 28px; min-width: 36px; padding: 0 8px; margin: 0; border: 0; border-radius: 14px;
  background: none; color: var(--text-primary); font: var(--font-body); cursor: default; white-space: nowrap;
}
.s-mbitem.is-bold .s-mbitem__label { font: var(--font-headline); }
.s-mbitem:is(.is-active, :focus-visible) { background: var(--menu-bar-selection); }
.s-mbwrap__menu { position: absolute; top: calc(100% + 10px); z-index: 50; }
.s-mbwrap__menu--start { left: 0; }
.s-mbwrap__menu--end { right: 0; }
</style>
