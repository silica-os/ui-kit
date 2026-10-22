// Run in Sketch (MCP run_code) with "Silica 1.0 Amalfi UI Kit" open. Read-only.
// Part 1 -> tokens/sketch-swatches-and-layer-styles.json, part 2 -> tokens/sketch-text-styles.json.
// The result is printed between @@ markers padded past the size limit so it lands in a file;
// extract it with tools/grab.py <saved-result> <out.json>.
const sketch = require('sketch')
const doc = sketch.getDocuments().find((d) => d.id === 'DEB2F9E8-966A-4E25-A6AF-6BAF189DD87E')

// Part 1: swatches and the shared layer styles used on Foundations, Materials and Colors.
const swatches = doc.swatches.map((s) => ({ name: s.name, color: s.color }))
const names = {}
doc.sharedLayerStyles.forEach((s) => { names[s.id] = s.name })
const seen = {}
const styles = []
;['Foundations', 'Materials', 'Colors'].map((n) => doc.pages.find((p) => p.name === n)).forEach((pg) => {
  ;['ShapePath', 'Group', 'Artboard', 'SymbolMaster'].forEach((t) => {
    sketch.find(t, pg).forEach((l) => {
      const id = l.sharedStyleId
      if (!id || seen[id] || !names[id]) return
      seen[id] = 1
      const st = l.style
      const sh = (s) => ({ color: s.color, x: s.x, y: s.y, blur: s.blur, spread: s.spread })
      styles.push({
        name: names[id],
        fills: st.fills.filter((f) => f.enabled).map((f) => ({ color: f.color, swatch: f.swatch && f.swatch.name, type: f.fillType })),
        borders: st.borders.filter((b) => b.enabled).map((b) => ({ color: b.color, thickness: b.thickness, position: b.position })),
        shadows: st.shadows.filter((s) => s.enabled).map(sh),
        innerShadows: st.innerShadows.filter((s) => s.enabled).map(sh),
        blurs: st.blurs.filter((b) => b.enabled).map((b) => ({ type: b.blurType, radius: b.radius, saturation: b.saturation, brightness: b.brightness })),
      })
    })
  })
})
let txt = '@@' + JSON.stringify({ swatches, styles, allStyleNames: Object.values(names) }) + '@@'

// Part 2 (run separately): text styles. Shared text styles carry no properties in the API, so read them
// from the text layers that use them (every page).
//   const want = {}; doc.sharedTextStyles.forEach((s) => { want[s.id] = s.name })
//   const got = {}
//   doc.pages.forEach((p) => sketch.find('Text', p).forEach((l) => {
//     if (l.sharedStyleId && want[l.sharedStyleId] && !got[l.sharedStyleId]) {
//       const s = l.style
//       got[l.sharedStyleId] = { name: want[l.sharedStyleId], family: s.fontFamily, size: s.fontSize, weight: s.fontWeight, lineHeight: s.lineHeight, kerning: s.kerning, color: s.textColor }
//     }
//   }))
//   txt = '@@' + JSON.stringify(Object.values(got)) + '@@'

while (txt.length < 120000) txt += 'x'
console.log(txt)
