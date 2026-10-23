import { onBeforeUnmount, onMounted, ref } from 'vue'

/** The border-box size of an element ref, kept up to date with a ResizeObserver (measured at mount so the first paint is right). */
export function useBoxSize(root) {
  const size = ref({ w: 0, h: 0 })
  let ro = null
  onMounted(() => {
    const el = root.value
    if (!el) return
    size.value = { w: el.offsetWidth, h: el.offsetHeight }
    ro = new ResizeObserver(([e]) => {
      const b = e.borderBoxSize?.[0]
      size.value = b ? { w: b.inlineSize, h: b.blockSize } : { w: el.offsetWidth, h: el.offsetHeight }
    })
    ro.observe(el)
  })
  onBeforeUnmount(() => ro?.disconnect())
  return size
}
