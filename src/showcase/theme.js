import { ref, watch } from 'vue'

let saved = 'light'
try { saved = localStorage.getItem('silica-ui-theme') || 'light' } catch { /* private mode */ }
/** Theme of the live components in the showcase (the page chrome follows the system). */
export const theme = ref(saved)
watch(theme, (v) => { try { localStorage.setItem('silica-ui-theme', v) } catch { /* ignore */ } })
