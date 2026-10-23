# ui-kit

**Silica 1.0 Amalfi** as a real component library plus a showcase. The components are Vue 3 SFCs on the design tokens
(`src/lib/`): buttons, switches, checkboxes, radios, text/search/secure/number/token fields, combo and pop-up buttons, slider, dial,
stepper, progress, segmented control, menu, popover, tooltip, alert, dialog, sidebar, scroll area, color and image wells,
forms, window and title bar, menu bar, dock, notifications, Control Center… They are interactive (typing, dragging, keyboard), animated
with the motion tokens, light and dark, and they reuse each other (an alert is built from buttons and a checkbox).
Every state is shown live over the Sketch kit's own render of it, so differences are visible. Tokens and the kit's
layer trees are exported from the Sketch source (`Silica 1.0 Amalfi UI Kit.sketch`) and also as CSS and Rust.

```
src/lib/       the components (S*.vue), read src/lib/README.md for the conventions
src/showcase/  the showcase pages: docs/*Doc.vue, comparison matrix, stage, code box
src/render/    renderer of the kit's layer trees (the "Kit renders" section and the comparison rows)
tokens/        tokens.json, tokens.css, tokens.rs (generated); raw Sketch exports; static.json
kit/           symbol masters of the UI Kit as JSON layer trees, one bundle per category; index.json, deps.json
rust/          silica_motion.rs (springs, beziers, tracks), animations.rs (generated)
animations/    animations saved from the Animation Lab (JSON)
tools/         export and generator scripts, dump.py (a master's specs), snap.swift (macOS page screenshots)
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

- **Library**: one page per component family. A playground (live component, props, code to copy), then every state
  and size compared with the kit. *Example: Settings* is a whole screen made only of library components.
- **Foundations**: colours, typography, glass, spacing/radii/shadows, motion tokens, Animation Lab (tune a spring or
  curve, copy it as Rust).
- **Kit**: the Sketch masters drawn from their layer trees: variants, composition (what a component is built from and
  where it is used), transitions between variants with a table of the changing properties.

Not in the kit repo on purpose: app screens (Apps), Brand, Widgets, and full screens (Lock Screen, Desktop). The Status
Bar masters are kept as an internal dependency (Menu Bar and Control Center embed them) but not listed.

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
   `tools/ingest.sh <scratch> b<start>`, then `python3 tools/assemble-kit.py <scratch>/stage <date>`
   and `python3 tools/build-deps.py`.

## Licence

Design data (`tokens/`, `kit/`) is [CC BY-SA 4.0](LICENSE), like `silica-design`. Code (`src/`, `tools/`, `rust/`) is
MIT OR Apache-2.0. The Silica logo is a trademark, not covered by these licences.
