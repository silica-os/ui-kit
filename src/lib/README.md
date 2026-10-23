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

## Glass materials

Four materials, each with a tint token and a blur variable (`--s-fx-*`, set per theme in `SGlassPanel.vue`):

| Material | Tint | Blur | Used by |
|---|---|---|---|
| Thin | `--glass-tint-thin` | `--s-fx-thin` | the small controls: `SSegmented` track (`<SGlassPanel thin>`), toolbar buttons and segments (`STitlebarPiece`), `SButton variant="glass"` at rest, glass `STextField` / `SSearchField`, `SStepper`; also `SThinGlass` (Dock, Control Center tiles) |
| Regular | `--glass-tint` | `--s-fx-regular` | `SGlassPanel` default, `SButton variant="glass"` hovered or pressed, banners |
| Thick | `--glass-tint-thick` | `--s-fx-thick` | menus, popovers, tooltips, alerts, `SCallout` (`thick`) |
| Lens | none | `--s-fx-lens` | the dragged switch / slider thumb and the pressed segmented thumb (`.is-lens`) |

Thin is the default for a control; Regular is its active step; the lens only ever appears over a thin control, while it is pressed or dragged.
It is called Lens, not Clear, on purpose: Apple's `clear` variant is a static, more transparent glass for media overlays, a different thing.

Rules (after Apple's public Liquid Glass guidance): glass is for the controls and navigation layer floating above content, never for the content itself
(lists, tables, media); never glass on glass (what sits on a glass surface is a plain fill or a selection pill, not a second blur); do not mix levels in
one group of controls; a control is only `interactive` when it can be pressed.

## Window panes

`SWindow` folds its side panes: `v-model:sidebar-open` / `v-model:inspector-open` (animated by width, contents keep their size and are clipped, folded panes are `inert`), `v-model:sidebar-width` / `inspector-width` with `resizable` drag handles (pulling a pane well under its minimum folds it) and Ctrl-Cmd-S / Alt-Cmd-I. Every toolbar slot receives `{ sidebarOpen, inspectorOpen, toggleSidebar, toggleInspector }`. In the split toolbar the sections follow the panes: the window controls are one element over the columns, the toggles (`panelToggles`) sit at the pane's trailing edge while it is open and move into the first remaining column (list, else content) when it is folded, and that column clears the controls. The unified toolbar is one bar: the toggle is yours. The page "Sidebars in Windows" shows every case live.

## Tables, outlines, lists and grids

`STable`, `SOutline` (a table with `tree`), `SList` and `SGrid` share one selection model, `useSelection.js`, written after AppKit: click selects, Cmd/Ctrl-click toggles, Shift-click selects the range from the anchor; arrows move (Shift extends), Home / End and Page Up / Down jump, Cmd-A selects all, typing selects the next row that starts with the typed text, Return and double click emit `action`. In an outline Right opens a row or steps into it, Left closes it or steps out, Alt does every level below. The selected rows take the accent pill (8 pt in from the edges, 8 pt radius, neighbouring rows merge); it turns neutral grey when the window is inactive (`inactive`, or the `s-window` the control is in) or the control does not have focus (`follow-focus`, on by default). The kit's masters are `Tables/*`, `Outlines/*`, `Lists/*`, `Grids/*` (page "Tables and Lists"); the page of the same name in the library shows them next to the live components.

- `STable`: `columns` ([{ key, label, width?, align?, sortable? }]), `rows`, `v-model` (the selected ids), `v-model:sort`, `striped`, `height`. The stripes are the body's own background, they carry on below the last row. Rows slide when a sort moves them and when an outline row opens or closes.
- `SOutline`: rows with `children`, `v-model:expanded` (the open ids). Closing a row that holds the selection moves the selection to it.
- `SList`: `items` or `sections`, 44 pt rows (60 with a subtitle), glyph tile, chevron or value, hairline under the title.
- `SGrid`: `variant` icons (96 × 116, plate and name pill) or thumbnails (112, accent ring and check badge); the arrows follow the columns the width allows.
