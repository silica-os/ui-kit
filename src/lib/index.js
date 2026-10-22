// Silica UI components. Import a component file directly (import SButton from './SButton.vue'), or install them all.
import './ui.css'

const modules = import.meta.glob('./S*.vue', { eager: true })

export default {
  install(app) {
    for (const [path, m] of Object.entries(modules)) app.component(path.replace('./', '').replace('.vue', ''), m.default)
  },
}
