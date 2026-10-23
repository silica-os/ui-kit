# Silica UI components (Vue)

Real, reusable components that look like the Amalfi kit: `SButton`, `SSwitch`, `SCheckbox`, `SRadio`, `SIcon`…
They are plain Vue 3 SFCs styled with the CSS variables of `tokens/tokens.css` (never hard-code a colour, font size
that exists as a token, or a shadow). Light/dark comes from `data-theme` on `<html>` or any ancestor.

```vue
<SButton variant="primary" @click="save">Save</SButton>
<SSwitch v-model="wifi" />
```

## Conventions (follow them, new components must look the same in code)

- One file per component, `S<Name>.vue`, with its CSS in a non-scoped `<style>` block using BEM classes `s-<name>`,
  `s-<name>--<modifier>`, `s-<name>__<part>`. Shared bits live in `ui.css`.
- Real semantics: a button is a `<button>`, a checkbox a native `<input type=checkbox>` (hidden, drawn by a sibling),
  a text field a native `<input>`. v-model is `modelValue` / `update:modelValue`. Disabled is the `disabled` prop.
- Every interactive control has class `s-control` (no text selection, no tap highlight, disabled look).
- States are CSS pseudo-classes AND forced classes so the showcase can show them without a pointer:
  `:is(:hover, .is-hover)`, `:is(:active, .is-pressed)`, `:is(:focus-visible, .is-focus)`; the component has a
  `force` prop (`hover | pressed | focus`) that adds `is-<force>`. Hover and press are drawn as overlays (`::after`
  with `--state-hover-overlay`, `--accent-amalfi-soft`…) or colour swaps, exactly as the kit does. The focus halo is
  3 pt outside the shape in `--line-focus`.
- Animate with the tokens: `transition: … var(--fade-quick)`, or a spring: `transition: left var(--spring-snappy)`.
- Components reuse each other (an alert contains `SButton`s, a menu contains `SMenuItem`s…): import the SFC, do not copy CSS.
- Icons are `<SIcon name="checkmark" :size="12" />` (Silica Symbols font, names from `tokens/symbol-codepoints.json`).
- Sizes are the kit's: mini 20, small 24, regular 28, large 32 (controls), spacing on a 4 pt grid.
- Text is never selectable inside controls; the page chrome around them is not part of the component.

## How to build one from the kit

1. Find the masters: `python3 tools/dump.py "Buttons/Push/Primary/Regular/Rest/Light"` prints the layer tree with
   frames, token names of fills/borders (`Light/Accent/Amalfi` → `--accent-amalfi`), shadows, blur, radii, fonts,
   stack and sizing. Dump Rest, Hover, Pressed, Focused, Disabled, each size and variant, and the Dark one.
   Text style names (`Light/Body Emphasis/Primary`) map to `--font-body-emphasis` + `--text-primary`.
2. Write `S<Name>.vue`. Measures come from the dump; colours only from tokens.
3. Write `src/showcase/docs/<Name>Doc.vue` (it appears in the sidebar by itself): `export const meta = { title, order }`
   in a normal `<script>` block, then a Playground (live component + controls + copyable code) and
   `<CompareMatrix>` blocks that put the live component over the kit's own render of the same state
   (see `ButtonDoc.vue`, `TogglesDoc.vue`). Differences between the two rows are bugs in the component.
4. Look at it: `npm run build`, serve `dist/` (`python3 -m http.server 6108` inside it) and screenshot the page with
   `tools/snap` (macOS, no browser needed): `swiftc -O tools/snap.swift -o /tmp/snap` then
   `/tmp/snap "http://localhost:6108/#/lib/<name>" out.png 1300 1500 5 ["<js to run first>" <seconds>]`.
   Do not drive the user's Safari. Compare the two rows, fix, repeat; check Light and Dark (theme toggle on the page:
   run `localStorage.setItem('silica-ui-theme','dark')` as the js argument and reload, or click the Dark button).

## Corners

`smoothPath.js` draws rounded outlines with the kit's continuous corners (`radii.cornerStyle: smooth, smoothing 0.6`): `smoothRectPath(w, h, r, smoothing = 0.6)` for a rectangle and `smoothPolygonPath([[x, y, r], …], smoothing)` for any polygon (SVG path, also valid as `clip-path: path('…')`). Each rounded point is a reduced circular arc plus two cubic Béziers with tangent length `(1 + smoothing) · r / tan(θ/2)`, at any angle; neighbouring points share their edge and lose smoothing before radius when it is short (a capsule stays a capsule).

Surfaces that are not capsules use it through `<SGlassPanel smooth>` (one outline for fill, rim and shadow; the outline is also published as `--s-clip` so a child can `clip-path: var(--s-clip)`): `SCallout` (popovers, tooltips, Dock callouts), `SMenu`, `SDialog`, `SAlert`, `SFilePanel`, `SWindow`, `SForm`, `SFormSection`, `SGroupBox`, the notifications, the control modules, details and the Dock (`SThinGlass`). `raised` is the solid surface of dialogs and windows, `flat` drops the shadow. Capsule controls (buttons, fields, switches, tracks) keep plain `border-radius`: a capsule has no smoothing to show.
