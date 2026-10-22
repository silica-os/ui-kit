/**
 * The pages of the live library mirror the pages of the Sketch UI Kit, same names and same order, so a component is
 * found where it is in Sketch. Each page is built from sections of the docs/*Doc.vue files: `include` lists the
 * <h2> headings (case-insensitive prefix match) to show; no `include` shows the whole doc. `kit` lists the kit
 * groups ("Category/Component", or "Category/*") shown as the Sketch renders of the same page.
 */
export const pages = [
  { name: 'Alerts', parts: [{ doc: 'alert' }], kit: ['Alerts/*'] },
  { name: 'Buttons', parts: [{ doc: 'button' }, { doc: 'buttonsmore', include: ['Icon button'] }], kit: ['Buttons/Push', 'Buttons/Icon', 'Buttons/Link'] },
  { name: 'Color Wells', parts: [{ doc: 'wells', include: ['Playground', 'Color well', 'Color panel', 'Swatch'] }], kit: ['Wells/Color Well', 'Wells/Color Panel', 'Wells/Swatch Chip', 'Wells/Swatch Row'] },
  { name: 'Combo Boxes', parts: [{ doc: 'fields', include: ['Combo box'] }, { doc: 'forms', include: ['Combo button'] }], kit: ['Fields/Combo Box', 'Fields/Combo Button'] },
  { name: 'Control Center', parts: [{ doc: 'controlcenter' }], kit: ['Control Center/*'] },
  { name: 'Dialogs', parts: [{ doc: 'dialogs', include: ['Playground: dialog', 'Dialogs'] }], kit: ['Dialogs/*'] },
  { name: 'Disclosure Controls', parts: [{ doc: 'buttonsmore', include: ['Disclosure button'] }, { doc: 'extracontrols', include: ['Playground', 'Disclosure group', 'Triangle'] }], kit: ['Disclosure/*'] },
  { name: 'Forms', parts: [{ doc: 'forms', include: ['Playground', 'Form'] }], kit: ['Forms/*'] },
  { name: 'Group Boxes', parts: [{ doc: 'buttonsmore', include: ['Group box'] }], kit: ['Group Boxes/*'] },
  { name: 'Image Wells', parts: [{ doc: 'wells', include: ['Image well'] }], kit: ['Wells/Image Well'] },
  { name: 'Menu Bar and Dock', parts: [{ doc: 'menubar' }], kit: ['Menu Bar/*', 'Dock/*'] },
  { name: 'Menus', parts: [{ doc: 'menus', include: ['Try them', 'Menu items', 'Menus, compared'] }], kit: ['Menus/*'] },
  { name: 'Notifications', parts: [{ doc: 'dialogs', include: ['Notifications'] }], kit: ['Notifications/*'] },
  { name: 'Pop-up and Pull-down Buttons', parts: [{ doc: 'popup' }], kit: ['Buttons/Pop-up', 'Buttons/Pull-down', 'Buttons/Gradient', 'Buttons/Help'] },
  { name: 'Popovers', parts: [{ doc: 'menus', include: ['Popovers'] }], kit: ['Popovers/*'] },
  { name: 'Progress Indicators', parts: [{ doc: 'controls', include: ['Progress bar', 'Circular', 'Spinner'] }], kit: ['Progress/*'] },
  { name: 'Scrollbars', parts: [{ doc: 'scroll' }], kit: ['Scrollbars/*'] },
  { name: 'Search Fields', parts: [{ doc: 'fields', include: ['Search field'] }], kit: ['Fields/Search Field'] },
  { name: 'Segmented Controls', parts: [{ doc: 'segmented' }], kit: ['Segments/*'] },
  { name: 'Sidebars', parts: [{ doc: 'sidebar' }], kit: ['Sidebars/*'] },
  { name: 'Sliders', parts: [{ doc: 'controls', include: ['Playground', 'Slider'] }, { doc: 'extracontrols', include: ['Dial'] }], kit: ['Sliders/*'] },
  { name: 'Steppers', parts: [{ doc: 'controls', include: ['Stepper'] }, { doc: 'forms', include: ['Number field'] }], kit: ['Steppers/*'] },
  { name: 'Text Fields', parts: [{ doc: 'fields', include: ['Playground', 'Text field'] }, { doc: 'forms', include: ['Text area', 'Secure field', 'Token field', 'Inline button'] }], kit: ['Fields/Text Field', 'Fields/Text Area', 'Fields/Secure Field', 'Fields/Token Field', 'Fields/Token', 'Fields/Inline Button', 'Fields/Clear Button'] },
  { name: 'Titlebars and toolbars', parts: [{ doc: 'windows', include: ['Window controls', 'Title bars', 'Toolbar pieces', 'Tabs'] }], kit: ['Titlebars/*'] },
  { name: 'Toggles - Checkboxes', parts: [{ doc: 'toggles', include: ['Try them', 'Checkbox'] }], kit: ['Toggles/Checkbox', 'Toggles/Checkbox Group'] },
  { name: 'Toggles - Radio Buttons', parts: [{ doc: 'toggles', include: ['Radio'] }], kit: ['Toggles/Radio', 'Toggles/Radio Group'] },
  { name: 'Toggles - Switches', parts: [{ doc: 'toggles', include: ['Switch'] }], kit: ['Toggles/Switch'] },
  { name: 'Tooltips', parts: [{ doc: 'menus', include: ['Tooltips'] }], kit: ['Tooltips/*'] },
  { name: 'Windows', parts: [{ doc: 'windows', include: ['Playground', 'Windows, compared'] }], kit: ['Windows/*'] },
  { name: 'Example: Settings', parts: [{ doc: 'example' }], kit: [], example: true },
].map((p) => ({ ...p, slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }))
