/**
 * The outline of the Dock's callouts (label bubble, tile menu) as ONE path, like the kit's ShapePath: a rounded rectangle of
 * w x (h - arrow) with a 12 x 6 arrow (corner radii 3 at the base, 2 at the tip) centred under it at `ax`; built by calloutPath.js.
 * Kit: label 64x34 (radius 8, arrow 26..38), menu 200x110 (radius 12, arrow 94..106).
 */
import { calloutPath as outline } from './calloutPath.js'

export const ARROW_W = 12
export const ARROW_H = 6

export function calloutPath(w, h, r = 8, ax = w / 2, ox = 0, oy = 0) {
  // the same outline builder as the popovers and tooltips (circular corners, the kit's arrow edge), arrow 12 x 6 with radii 3 / 2
  return outline({ w, h, radius: r, edge: 'bottom', pos: ax, aw: ARROW_W, ah: ARROW_H, ar: 3, tr: 2, ox, oy })
}
