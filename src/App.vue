<script setup>
import { computed } from 'vue'
import { route } from './router.js'
import Sidebar from './components/Sidebar.vue'
import Home from './views/Home.vue'
import CategoryView from './views/CategoryView.vue'
import ComponentView from './views/ComponentView.vue'
import TokenPage from './views/TokenPage.vue'
import LabView from './views/LabView.vue'

const view = computed(() => {
  const [a, b, c] = route.value.parts
  if (!a) return { is: Home }
  if (a === 'components' && b && c) return { is: ComponentView, key: `${b}/${c}`, props: { category: b, comp: c } }
  if (a === 'components' && b) return { is: CategoryView, key: b, props: { category: b } }
  if (a === 'lab') return { is: LabView }
  return { is: TokenPage, key: a, props: { page: a } }
})
</script>

<template>
  <div class="shell">
    <Sidebar />
    <main><component :is="view.is" :key="view.key" v-bind="view.props" /></main>
  </div>
</template>

<style scoped>
.shell { display: flex; height: 100%; }
main { flex: 1; min-width: 0; overflow: auto; }
</style>
