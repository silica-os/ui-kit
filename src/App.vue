<script setup>
import { computed } from 'vue'
import { route } from './router.js'
import Sidebar from './components/Sidebar.vue'
import Home from './views/Home.vue'
import CategoryView from './views/CategoryView.vue'
import ComponentView from './views/ComponentView.vue'
import TokenPage from './views/TokenPage.vue'
import LabView from './views/LabView.vue'
import PreviewView from './views/PreviewView.vue'
import LibraryView from './views/LibraryView.vue'

const view = computed(() => {
  const [a, b, c] = route.value.parts
  if (!a) return { is: Home }
  if (a === 'components' && b && c) return { is: ComponentView, key: `${b}/${c}`, props: { category: b, comp: c } }
  if (a === 'components' && b) return { is: CategoryView, key: b, props: { category: b } }
  if (a === 'lib' && b) return { is: LibraryView, key: b, props: { page: b } }
  if (a === 'lab') return { is: LabView }
  if (a === 'preview') return { is: PreviewView, key: route.value.path, props: { name: route.value.parts.slice(1, -1).join('/'), scale: Number(route.value.parts[route.value.parts.length - 1]) || 3 } }
  return { is: TokenPage, key: a, props: { page: a } }
})
</script>

<template>
  <div class="shell">
    <Sidebar v-if="route.parts[0] !== 'preview'" />
    <main><component :is="view.is" :key="view.key" v-bind="view.props" /></main>
  </div>
</template>

<style scoped>
.shell { display: flex; height: 100%; }
main { flex: 1; min-width: 0; overflow: auto; }
</style>
