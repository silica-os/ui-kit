<script setup>
import SNotification from './SNotification.vue'
import SLink from './SLink.vue'
import SGlassPanel from './SGlassPanel.vue'

/**
 * The notification centre panel: a thick-glass column (380 pt) with the "Notifications" header, a Clear link, and sections (Today,
 * Earlier…) of panel cards. `sections` is [{ title, items: [{ id, title, message, time, actions, color, glyph }] }]; or use the default slot.
 * Emits `clear`, `action(id, value)`, `close(id)`.
 */
defineProps({
  title: { type: String, default: 'Notifications' },
  sections: { type: Array, default: () => [] },
  clear: { type: String, default: 'Clear all' },
})
const emit = defineEmits(['clear', 'action', 'close'])
</script>

<template>
  <SGlassPanel class="s-ncentre" thick smooth :radius="24" role="region" :aria-label="title">
    <header class="s-ncentre__head"><h2 class="s-ncentre__title">{{ title }}</h2><SLink v-if="clear" @click="emit('clear')">{{ clear }}</SLink></header>
    <slot>
      <template v-for="s in sections" :key="s.title">
        <h3 class="s-ncentre__section">{{ s.title }}</h3>
        <TransitionGroup name="s-notification" tag="div" class="s-ncentre__list">
          <SNotification v-for="(n, i) in s.items" :key="n.id ?? i" variant="panel" v-bind="n" :closable="false" @action="emit('action', n.id ?? i, $event)" @close="emit('close', n.id ?? i)" />
        </TransitionGroup>
      </template>
    </slot>
  </SGlassPanel>
</template>

<style>
.s-ncentre { display: flex; flex-direction: column; gap: 8px; box-sizing: border-box; width: 380px; min-height: 416px; padding: 16px; color: var(--text-primary); }
.s-ncentre__head { display: flex; align-items: center; justify-content: space-between; height: 24px; padding-left: 4px; }
.s-ncentre__title { margin: 0; font: var(--font-title-3); }
.s-ncentre__section { margin: 0; height: 16px; font: var(--font-label); line-height: 16px; color: var(--text-tertiary); padding-left: 0; }
.s-ncentre__list { position: relative; display: flex; flex-direction: column; gap: 8px; }
.s-ncentre .s-notification--panel { width: auto; }
.s-ncentre .s-notification-leave-active { position: absolute; left: 0; right: 0; } /* leaving cards stop taking room, the others glide up */
</style>
