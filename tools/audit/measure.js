(() => {
  const main = document.querySelector('main')
  const rect = (el) => { const r = el.getBoundingClientRect(); return { x: r.left, y: r.top + window.scrollY, w: r.width, h: r.height } }
  const union = (els) => {
    const rs = els.map(rect).filter((r) => r.w > 0 || r.h > 0)
    if (!rs.length) return null
    const x0 = Math.min(...rs.map((r) => r.x)), y0 = Math.min(...rs.map((r) => r.y))
    const x1 = Math.max(...rs.map((r) => r.x + r.w)), y1 = Math.max(...rs.map((r) => r.y + r.h))
    return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }
  }
  const cells = []
  for (const el of document.querySelectorAll('[data-audit]')) {
    const kitEl = el.querySelector('.flat-stage')
    let live
    if (el.dataset.audit === 'pair') live = union([...el.children].filter((c) => !c.classList.contains('kit-symbol')))
    else {
      const first = el.querySelector('.side')
      live = union([...first.children].filter((c) => !c.classList.contains('lab')))
    }
    if (!kitEl || !live) continue
    let section = el.closest('.part')?.previousElementSibling
    let h2 = el; while (h2 && !(h2.tagName === 'H2')) { h2 = h2.previousElementSibling || h2.parentElement; if (h2 === main || !h2) break }
    cells.push({ cell: el.dataset.cell || '', kit: el.dataset.kit, live, ref: rect(kitEl), h2: h2 && h2.tagName === 'H2' ? h2.textContent.trim() : '' })
  }
  return JSON.stringify({ h: Math.ceil(document.documentElement.scrollHeight), cells })
})()
