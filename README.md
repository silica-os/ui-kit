# storybook

Tokens and components of **Silica 1.0 Amalfi**, exported from the Sketch source
(`Silica 1.0 Amalfi UI Kit.sketch`) and shown in a Storybook. Built to help the Rust implementation:
exact tokens as `.rs`, every component drawn from its kit layer tree, and an Animation Lab that
turns a tuned spring or fade into Rust.

```
tokens/      tokens.json, tokens.css, tokens.rs (generated); raw Sketch exports; static.json
kit/         every symbol master of the UI Kit as a JSON layer tree, one bundle per category
stories/     Overview, Tokens (colours, type, glass, layout, motion, Animation Lab), Components
src/         renderer (layer tree -> HTML/CSS), token pages, Animation Lab, motion maths
rust/        silica_motion.rs (springs, beziers, tracks), animations.rs (generated)
animations/  animations saved from the Lab (JSON)
tools/       export and generator scripts
```

## Run

```
npm install
npm run dev        # Storybook on :6006; `npm run sync` runs first and copies the icon fonts from ../symbols
npm run build      # static site in dist/
```

The icon glyphs in the kit are text in the **Silica Symbols** font. `tools/sync-symbols.mjs` takes it from
`../symbols` (or `SYMBOLS_DIR`), else clones [`silica-os/symbols`](https://github.com/silica-os/symbols).

## Tokens

- Colours (light, dark, brand, per-app), typography and glass come from the Sketch swatches, text styles
  and shared layer styles. Spacing, control heights, radii, shadows and motion are not in Sketch: they are in
  `tokens/static.json`, carried over from `silica-desktop/docs/design/amalfi`.
- `python3 tools/build-tokens.py` regenerates `tokens.json`, `tokens.css` (custom properties, dark theme via
  `data-theme="dark"` or `prefers-color-scheme`) and `tokens.rs`.
- In Rust: `mod silica_motion; mod tokens;` in the same crate (`tokens.rs` uses `crate::silica_motion`).
  `tokens::light::ACCENT_AMALFI`, `tokens::text::BODY`, `tokens::spring::SNAPPY`, `tokens::fade::QUICK`.

## Components

The stories render the exported layer trees (frames, fills, borders, shadows, blurs, text, nested
symbols with their overrides). Each component group has a story with Variant and Appearance controls and an
"all variants" gallery. Approximations: smooth corners are plain rounded corners, glass lens blur is a backdrop
blur, bitmap fills are placeholders.

## Animation Lab

Tokens → Animation Lab: pick a kit symbol (or a box), a spring or fade token (or your own), the tracks
(x, y, scale, rotate, opacity), watch it play with the curve, settle time and overshoot, then **Copy Rust**
or **Download JSON**. Put the JSON in `animations/` and run `python3 tools/gen-animations.py` to add it to
`rust/animations.rs`. `rust/silica_motion.rs` evaluates it: `ANIM.value(Prop::Scale, elapsed_ms)`.
The maths is the same as `src/motion.js` (springs as damped oscillators, mass 1, k = (2π/response)², c = 2ζ√k).

## Regenerate from Sketch

With the UI Kit open in Sketch (MCP enabled), read-only:

1. Tokens: export swatches, text styles and glass layer styles into `tokens/sketch-*.json`
   (`tools/export-tokens.js`, `tools/grab.py`), then `python3 tools/build-tokens.py`.
2. Masters: run `tools/export-masters.js` in batches of 500 (`start` 0 … 3000), convert with
   `silica-design/tools/ingest.sh <scratch> b<start>`, then `python3 tools/assemble-kit.py <scratch>/stage <date>`.
3. `node tools/gen-stories.mjs`.

## Licence

Design data (`tokens/`, `kit/`) is [CC BY-SA 4.0](LICENSE), like `silica-design`. Code (`src/`, `tools/`,
`rust/`, `stories/`) is MIT OR Apache-2.0. The Silica logo is a trademark, not covered by these licences.
