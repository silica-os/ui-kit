// Selection and keyboard model shared by STable, SOutline, SList and SGrid. It follows what AppKit's NSTableView / NSOutlineView /
// NSCollectionView do, so the same hands work on every list:
//   click selects, Cmd/Ctrl-click toggles, Shift-click selects the range from the anchor;
//   arrows move (Shift extends from the anchor), Home / End and Page Up / Page Down jump, Cmd-A selects all;
//   typing selects the next row whose label starts with what was typed (the buffer clears after a second);
//   Return and double click run the row's action.
// The caller says how the rows are laid out: `ids()` the selectable ids in display order, `step(dir, index)` where an arrow lands (the
// default is a column: up -1, down +1; a grid adds left / right and rows of N), `page()` how many rows a page is.
import { ref } from 'vue'

export function useSelection(o) {
  const anchor = ref(null)
  const cursor = ref(null)
  let typed = ''
  let typedAt = 0

  const ids = () => o.ids()
  const enabled = (id) => !o.disabled || !o.disabled(id)
  const current = () => o.selected()
  const set = (arr) => o.select(arr)
  const index = (id) => ids().indexOf(id)

  function range(a, b) {
    const list = ids()
    const i = list.indexOf(a), j = list.indexOf(b)
    if (i < 0 || j < 0) return [b]
    const [lo, hi] = i < j ? [i, j] : [j, i]
    return list.slice(lo, hi + 1).filter(enabled)
  }

  function click(id, e = {}) {
    if (!enabled(id)) return
    if (o.multiple() && (e.metaKey || e.ctrlKey)) {
      const sel = current()
      set(sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id])
      anchor.value = id
    } else if (o.multiple() && e.shiftKey && anchor.value != null) {
      set(range(anchor.value, id))
    } else {
      set([id])
      anchor.value = id
    }
    cursor.value = id
    o.reveal?.(id)
  }

  function go(target, extend) {
    const id = ids()[target]
    if (id === undefined) return
    if (!enabled(id)) return
    if (extend && o.multiple() && anchor.value != null) set(range(anchor.value, id))
    else { set([id]); anchor.value = id }
    cursor.value = id
    o.reveal?.(id)
  }

  function at() {
    const c = cursor.value != null ? index(cursor.value) : -1
    if (c >= 0) return c
    const sel = current()
    return sel.length ? index(sel[sel.length - 1]) : -1
  }

  // the nearest enabled row from `from` going `dir`, or -1
  function nearest(from, dir) {
    const list = ids()
    for (let i = from; i >= 0 && i < list.length; i += dir) if (enabled(list[i])) return i
    return -1
  }

  function keydown(e) {
    if (e.defaultPrevented || e.altKey) return
    const list = ids()
    if (!list.length) return
    const i = at()
    const last = list.length - 1
    const meta = e.metaKey || e.ctrlKey
    if (meta && e.key.toLowerCase() === 'a' && o.multiple()) { e.preventDefault(); set(list.filter(enabled)); return }
    if (meta) return
    const dir = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' }[e.key]
    if (dir) {
      if (!o.step && (dir === 'left' || dir === 'right')) return
      const to = o.step ? o.step(dir, i) : (dir === 'down' ? i + 1 : i - 1)
      if (to === null || to === undefined) return // not ours: a tree takes left / right itself
      e.preventDefault()
      const target = Math.max(0, Math.min(last, i < 0 ? (dir === 'up' || dir === 'left' ? last : 0) : to))
      const n = nearest(target, target >= i ? 1 : -1)
      if (n >= 0 && n !== i) go(n, e.shiftKey)
      return
    }
    if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault()
      const n = e.key === 'Home' ? nearest(0, 1) : nearest(last, -1)
      if (n >= 0) go(n, e.shiftKey)
      return
    }
    if (e.key === 'PageUp' || e.key === 'PageDown') {
      e.preventDefault()
      const down = e.key === 'PageDown'
      const page = Math.max(1, (o.page ? o.page() : 10) - 1)
      const n = nearest(Math.max(0, Math.min(last, (i < 0 ? 0 : i) + (down ? page : -page))), down ? -1 : 1)
      if (n >= 0 && n !== i) go(n, e.shiftKey)
      return
    }
    if (e.key === 'Enter' && i >= 0) { e.preventDefault(); o.activate?.(list[i]); return }
    if (e.key.length === 1 && o.label) typeSelect(e.key, i)
  }

  function typeSelect(ch, from) {
    const now = Date.now()
    if (now - typedAt > 1000) typed = ''
    typedAt = now
    typed += ch.toLowerCase()
    const list = ids()
    const find = (prefix, start) => {
      for (let k = 0; k < list.length; k++) {
        const j = (start + k) % list.length
        if (enabled(list[j]) && String(o.label(list[j]) ?? '').toLowerCase().startsWith(prefix)) return j
      }
      return -1
    }
    let j = find(typed, typed.length === 1 ? from + 1 : Math.max(from, 0))
    // a repeated letter ("aa") cycles through the rows that start with it
    if (j < 0 && typed.length > 1 && [...typed].every((c) => c === typed[0])) { typed = typed[0]; j = find(typed, from + 1) }
    if (j >= 0) go(j, false)
  }

  return { anchor, cursor, click, keydown, go }
}

// v-model helpers: an array when `multiple`, else the single id (null for none)
export const toArray = (v) => (Array.isArray(v) ? v : v == null ? [] : [v])
export const fromArray = (arr, multiple) => (multiple ? arr : arr.length ? arr[arr.length - 1] : null)
