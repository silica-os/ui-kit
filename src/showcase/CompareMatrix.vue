<script setup>
import { ref } from 'vue'
import Stage from './Stage.vue'
import KitRef from './KitRef.vue'

/**
 * Rows × states grid: the live component (default slot, gets { row, col }) and, under it, the kit's render
 * of the same state, so differences are visible at a glance.
 */
defineProps({
  rows: { type: Array, required: true },
  cols: { type: Array, required: true },
  /** (row, col) => master name without the appearance, or null */
  kit: { type: Function, default: null },
  glass: Boolean,
  scale: { type: Number, default: 1 },
})
const show = ref(true)
</script>

<template>
  <div>
    <label v-if="kit" class="chk"><input v-model="show" type="checkbox" /> show the kit's render under each live component</label>
    <Stage :glass="glass" :pad="20" class="matrix" :style="{ gridTemplateColumns: `110px repeat(${cols.length}, minmax(0, 1fr))` }">
      <div class="head" />
      <div v-for="c in cols" :key="c.key" class="head">{{ c.label }}</div>
      <template v-for="r in rows" :key="r.key">
        <div class="head row">{{ r.label }}</div>
        <div v-for="c in cols" :key="c.key" class="cell">
          <slot :row="r" :col="c" />
          <KitRef v-if="kit && show && kit(r, c)" :name="kit(r, c)" :scale="scale" />
        </div>
      </template>
    </Stage>
  </div>
</template>

<style scoped>
.chk { display: flex; gap: 6px; align-items: center; margin-bottom: 10px; }
.matrix { display: grid; gap: 0; align-items: stretch; }
.head { font-size: 11px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: var(--text-tertiary); padding: 0 0 10px; }
.head.row { padding: 14px 0 0; }
.cell { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; padding: 12px 8px 12px 0; border-top: 1px solid var(--line-separator); min-width: 0; }
</style>
