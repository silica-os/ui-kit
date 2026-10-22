<script setup>
import { ref, watch } from 'vue'
import SIcon from './SIcon.vue'

/** A titled group of sidebar rows. With `collapsible` (default) the header has a disclosure chevron and the rows fold away. */
const props = defineProps({
  title: { type: String, default: '' },
  open: { type: Boolean, default: true },
  collapsible: { type: Boolean, default: true },
})
const emit = defineEmits(['update:open'])
const isOpen = ref(props.open)
watch(() => props.open, (v) => (isOpen.value = v))
function toggle() { isOpen.value = !isOpen.value; emit('update:open', isOpen.value) }
</script>

<template>
  <section class="s-sidebar__group" role="group" :aria-label="title">
    <button v-if="collapsible" type="button" class="s-control s-sidebar__header" :aria-expanded="isOpen" @click="toggle">
      <span class="s-sidebar__title">{{ title }}</span>
      <SIcon name="chevron-down" :size="12" class="s-sidebar__disclosure" :class="{ 'is-closed': !isOpen }" />
    </button>
    <div v-else class="s-sidebar__header s-sidebar__header--plain"><span class="s-sidebar__title">{{ title }}</span></div>
    <div class="s-sidebar__fold" :class="{ 'is-open': isOpen || !collapsible }"><div class="s-sidebar__rows" :inert="!(isOpen || !collapsible)"><slot /></div></div>
  </section>
</template>

<style>
.s-sidebar__group { display: flex; flex-direction: column; margin-bottom: 8px; }
.s-sidebar__header {
  display: flex; align-items: center; gap: 4px; width: 100%; height: 28px; padding: 8px 12px 0; margin: 0; border: 0; background: none; box-sizing: border-box;
  font: var(--font-sidebar-header); color: var(--text-tertiary); text-align: left; cursor: default; border-radius: 8px;
}
.s-sidebar__title { flex: 1; min-width: 0; }
.s-sidebar__disclosure { flex: none; transition: transform var(--spring-snappy); }
.s-sidebar__disclosure.is-closed { transform: rotate(-90deg); }
.s-sidebar__fold { display: grid; grid-template-rows: 0fr; transition: grid-template-rows var(--spring-panel); }
.s-sidebar__fold.is-open { grid-template-rows: 1fr; }
button.s-sidebar__header:focus-visible { box-shadow: inset 0 0 0 2px var(--line-focus); }
.s-sidebar__rows { display: flex; flex-direction: column; min-height: 0; overflow: hidden; }
@media (prefers-reduced-motion: reduce) { .s-sidebar__fold, .s-sidebar__disclosure { transition: none; } }
</style>
