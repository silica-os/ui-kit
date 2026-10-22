# ui-kit

Tokens and components of **Silica 1.0 Amalfi**, exported from the Sketch source
(`Silica 1.0 Amalfi UI Kit.sketch`) and browsable in a small Vite + Vue app. Built to help the Rust
implementation: exact tokens as `.rs`, every component drawn from its kit layer tree, components you can
hover, press and toggle with the real motion tokens, and a lab that turns a tuned spring or fade into Rust.

```
tokens/      tokens.json, tokens.css, tokens.rs (generated); raw Sketch exports; static.json
kit/         symbol masters of the UI Kit as JSON layer trees, one bundle per category; index.json, deps.json
src/         the app: renderer, morph engine, views, motion maths
rust/        silica_motion.rs (springs, beziers, tracks), animations.rs (generated)
animations/  animations saved from the Animation Lab (JSON)
tools/       export and generator scripts
```

## Run

```
npm install
npm run dev        # http://localhost:5173; `npm run sync` runs first and copies the icon fonts from ../symbols
npm run build      # static site in dist/
```

The icon glyphs in the kit are text in the **Silica Symbols** font. `tools/sync-symbols.mjs` takes it from
`../symbols` (or `SYMBOLS_DIR`), else clones [`silica-os/symbols`](https://github.com/silica-os/symbols).

## What is in the app

- **Foundations**: colours (light and dark), typography, glass, spacing/radii/shadows, motion tokens.
- **Components**: open one from the sidebar.
  - The stage is interactive: hover, press, focus it, click to switch On/Off. The variant changes with the
    motion token you pick (springs and fades from the tokens), tweened property by property.
  - Controls pick Appearance, Variant, Size, Value, State; Zoom and Background help with glass.
  - **Composition**: what the current variant is built from (nested components, linked) and which components
    embed it. *Nested components → Outline* draws their bounds on the stage. Components are reused by
    reference, as in Sketch: nothing is flattened in the data.
  - **Transition**: choose a From and a To variant and Play; the table lists every property that changes
    (the values to animate in code). Copy it as JSON, or copy the Rust driver.
  - **All variants**: every master of the component.
- **Animation Lab**: move a whole component with a spring or curve, copy the result as Rust or JSON.

Not in the kit repo on purpose: app screens (Apps), Brand, Widgets, and full screens (Lock Screen, Desktop). The Status
Bar masters are kept as an internal dependency (Menu Bar and Control Center embed them) but not listed.
Layout follows Sketch: stack layouts become flexbox, layers keep their sizing (fixed, fit, fill, relative) and pins, so
resized instances (a button stretched to 240 pt) lay out as in the kit. `#/preview/<master name>/<zoom>` shows one master
alone. Icons are drawn from their codepoint and cannot be selected.
Approximations: smooth corners are plain rounded corners, glass lens blur is a backdrop blur, bitmaps (app icons) are a
grey placeholder.

## Tokens and Rust

- Colours, typography and glass come from Sketch swatches, text styles and shared layer styles. Spacing, control
  heights, radii, shadows and motion are not in Sketch: `tokens/static.json`, carried over from
  `silica-desktop/docs/design/amalfi`.
- `python3 tools/build-tokens.py` regenerates `tokens.json`, `tokens.css` and `tokens.rs`.
- In Rust: `mod silica_motion; mod tokens;` in the same crate. `tokens::light::ACCENT_AMALFI`,
  `tokens::text::BODY`, `tokens::spring::SNAPPY`, `tokens::fade::QUICK`. Animations from the Lab: save the JSON in
  `animations/`, run `python3 tools/gen-animations.py`, evaluate with `ANIM.value(Prop::Scale, elapsed_ms)`.
  The maths is the same as `src/motion.js`.

## Regenerate from Sketch

With the UI Kit open in Sketch (MCP enabled), read-only:

1. Tokens: `tools/export-tokens.js` (+ `tools/grab.py`), then `python3 tools/build-tokens.py`.
2. Masters: run `tools/export-masters.js` in batches of 500 (`start` 0 … 3000), convert each batch with
   `silica-design/tools/ingest.sh <scratch> b<start>`, then `python3 tools/assemble-kit.py <scratch>/stage <date>`
   and `python3 tools/build-deps.py`.

## Licence

Design data (`tokens/`, `kit/`) is [CC BY-SA 4.0](LICENSE), like `silica-design`. Code (`src/`, `tools/`, `rust/`) is
MIT OR Apache-2.0. The Silica logo is a trademark, not covered by these licences.
