import { onBeforeUnmount, shallowRef } from 'vue'
import { morph } from '../render/morph.js'
import { progress } from '../motion.js'

/** Animates `shown` from its current look to a target tree with a motion driver (see motion.js). */
export function useMorph(initial) {
  const shown = shallowRef(initial)
  const info = shallowRef({ playing: false, p: 1, ms: 0 })
  let raf = 0
  let from = initial
  let to = initial
  let start = 0
  let driver = null
  let endMs = 0

  const tick = (now) => {
    if (!start) start = now
    const ms = now - start
    const p = progress(driver, ms)
    shown.value = morph(from, to, p)
    const done = ms >= endMs
    info.value = { playing: !done, p, ms }
    if (done) {
      shown.value = to
      return
    }
    raf = requestAnimationFrame(tick)
  }

  function goTo(tree, drv, end) {
    cancelAnimationFrame(raf)
    from = shown.value
    to = tree
    driver = drv
    endMs = end
    start = 0
    raf = requestAnimationFrame(tick)
  }

  function jump(tree) {
    cancelAnimationFrame(raf)
    from = to = tree
    shown.value = tree
    info.value = { playing: false, p: 1, ms: 0 }
  }

  onBeforeUnmount(() => cancelAnimationFrame(raf))
  return { shown, info, goTo, jump }
}
