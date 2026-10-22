// Copies the Silica Symbols fonts (the kit's icon glyphs are text in that font) into public/fonts and their
// codepoints into tokens/symbol-codepoints.json (browsers measure the ligature text "chevron-left" as 0 wide,
// so the renderer draws the single codepoint instead).
// Source: SYMBOLS_DIR, else ../symbols, else a shallow clone of silica-os/symbols in .cache/symbols.
import { cpSync, existsSync, mkdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
let src = process.env.SYMBOLS_DIR || resolve(root, '../symbols')
if (!existsSync(join(src, 'fonts'))) {
  src = join(root, '.cache/symbols')
  if (!existsSync(src)) {
    mkdirSync(dirname(src), { recursive: true })
    execFileSync('git', ['clone', '--depth', '1', 'https://github.com/silica-os/symbols.git', src], { stdio: 'inherit' })
  }
}
mkdirSync(join(root, 'public/fonts'), { recursive: true })
for (const w of ['Light', 'Regular', 'Semibold']) {
  cpSync(join(src, 'fonts', `SilicaSymbols-${w}.woff2`), join(root, 'public/fonts', `SilicaSymbols-${w}.woff2`))
}
cpSync(join(src, 'fonts/codepoints.json'), join(root, 'tokens/symbol-codepoints.json'))
console.log('fonts and codepoints synced from', src)
