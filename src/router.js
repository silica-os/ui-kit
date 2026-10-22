import { computed, ref } from 'vue'

const hash = ref(location.hash.slice(1) || '/')
window.addEventListener('hashchange', () => {
  hash.value = location.hash.slice(1) || '/'
  document.querySelector('main')?.scrollTo(0, 0)
})

export const route = computed(() => {
  const parts = hash.value.split('/').filter(Boolean).map(decodeURIComponent)
  return { parts, path: '/' + parts.join('/') }
})

export const href = (...parts) => '#/' + parts.map(encodeURIComponent).join('/')
