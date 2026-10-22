<script setup>
import SIconButton from './SIconButton.vue'
import SSegmented from './SSegmented.vue'
import SSearchField from './SSearchField.vue'
import SIcon from './SIcon.vue'

/**
 * A toolbar piece: a 4 pt-padded slot of a unified title bar. Use the default slot for anything (an SButton, a menu trigger…),
 * or a ready `kind`:
 *  - icon: one 36 pt round glass button (`icon`, `label`): share, more, info… emits `click`
 *  - primary: the accent round button (mail send)
 *  - nav: back / forward action pair (emits `action` 'back' | 'forward')
 *  - group: `items` ([{ value, icon }]) as an action segmented pair/triple/quad, emits `action`
 *  - views: `items` as a single-select segmented switcher, `v-model` on modelValue
 *  - tabs: `items` with labels (World, Alarms…) as a wider single-select segmented control
 *  - search: the 200 pt glass search field, v-model is its text
 */
const props = defineProps({
  kind: { type: String, default: '', validator: (v) => ['', 'icon', 'primary', 'nav', 'group', 'views', 'tabs', 'search'].includes(v) },
  icon: { type: String, default: '' },
  label: { type: String, default: '' },
  items: { type: Array, default: () => [] },
  modelValue: { type: [String, Number, Boolean, Array], default: null },
  placeholder: { type: String, default: 'Search' },
  width: { type: Number, default: 0 },
})
const emit = defineEmits(['click', 'action', 'update:modelValue', 'search'])
const segStyle = (w) => ({ '--seg-h': '36px', '--seg-item-h': '28px', '--seg-w': w + 'px', '--s-glass-r': '18px' })
const nav = [{ value: 'back', icon: 'chevron-left' }, { value: 'forward', icon: 'chevron-right' }]
</script>

<template>
  <div class="s-tbpiece" :class="kind && `s-tbpiece--${kind}`">
    <slot>
      <SIconButton v-if="kind === 'icon'" :icon="icon" :label="label" size="large" @click="emit('click', $event)" />
      <button v-else-if="kind === 'primary'" type="button" class="s-control s-tbpiece__primary" :aria-label="label || icon" @click="emit('click', $event)"><SIcon :name="icon || 'arrow-up'" :size="20" /></button>
      <SSegmented v-else-if="kind === 'nav'" action size="large" :items="nav" @action="emit('action', $event)" />
      <SSegmented v-else-if="kind === 'group'" action size="large" :items="items" @action="emit('action', $event)" />
      <SSegmented v-else-if="kind === 'views'" size="large" class="s-tbpiece__seg" :style="segStyle(36)" :items="items" :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" />
      <SSegmented v-else-if="kind === 'tabs'" size="large" class="s-tbpiece__seg s-tbpiece__seg--text" :style="segStyle(88)" :items="items" :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" />
      <SSearchField v-else-if="kind === 'search'" size="large" class="s-tbpiece__search" :style="width ? { '--s-field-w': width + 'px' } : null" :model-value="modelValue ?? ''" :placeholder="placeholder" @update:model-value="emit('update:modelValue', $event)" @search="emit('search', $event)" />
    </slot>
  </div>
</template>

<style>
.s-tbpiece { display: flex; align-items: center; flex: none; height: 100%; padding: 0 4px; gap: 4px; }
.s-tbpiece--search { flex: 0 1 auto; }

/* unified bars use the 36 pt toolbar size, one step above the kit's large control */
.s-titlebar--unified .s-tbpiece .s-iconbutton { --s-d: var(--control-toolbar); }
.s-tbpiece__seg { --seg-h: 36px; --seg-item-h: 28px; --seg-w: 36px; --s-glass-r: 18px; }
.s-tbpiece__seg--text { --seg-w: 88px; }
.s-tbpiece .s-segmented--action { --s-glass-r: 18px; }
.s-tbpiece__search.s-field--large { --h: 36px; --r: 18px; --s-field-w: 200px; }
.s-tbpiece__search.s-field--large.s-field--glass { --r: 18px; }
.s-tbpiece__primary {
  display: grid; place-items: center; width: 36px; height: 36px; padding: 0; border: 0; border-radius: 18px; background: var(--accent-amalfi); color: var(--text-on-accent);
  box-shadow: inset 0 0 0 1px var(--line-border), var(--elevation-1); cursor: default;
}
.s-tbpiece__primary:active { background: var(--accent-amalfi-pressed); }
</style>
