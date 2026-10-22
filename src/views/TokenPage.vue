<script setup>
import { computed } from 'vue'
import TokenColors from '../docs/TokenColors.vue'
import TokenType from '../docs/TokenType.vue'
import TokenGlass from '../docs/TokenGlass.vue'
import TokenLayout from '../docs/TokenLayout.vue'
import MotionTokens from '../docs/MotionTokens.vue'

const props = defineProps({ page: String })
const pages = {
  colors: { title: 'Colors', text: 'Swatches from the Sketch kit, light and dark. Click a swatch to copy its CSS variable.', c: TokenColors },
  typography: { title: 'Typography', text: 'Text styles with their colour roles. Inter for the interface, JetBrains Mono for code.', c: TokenType },
  glass: { title: 'Glass', text: 'The glass materials over a colourful backdrop: tint, rim, shadow and background blur.', c: TokenGlass },
  layout: { title: 'Spacing, radii, shadows', text: 'Every measure sits on a 4 pt grid.', c: TokenLayout },
  motion: { title: 'Motion', text: 'Spring and fade tokens. The curve shows progress over time; press Replay to see them move.', c: MotionTokens },
}
const p = computed(() => pages[props.page])
</script>

<template>
  <div class="page">
    <template v-if="p">
      <h1>{{ p.title }}</h1>
      <p class="muted">{{ p.text }}</p>
      <component :is="p.c" />
    </template>
    <template v-else><h1>Not found</h1></template>
  </div>
</template>

<style scoped>.page { padding: 36px; max-width: 1200px; }</style>
