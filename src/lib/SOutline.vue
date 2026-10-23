<script setup>
import STable from './STable.vue'

/**
 * An outline (Outlines/*): a table whose first column nests. Rows with `children` get a disclosure chevron, the children indent 20 pt
 * per level, and the rows slide in and out as a row opens or closes. It is STable with `tree` and no stripes; every prop, `v-model`,
 * `v-model:expanded` and slot of STable works here. Right opens a row or steps into it, Left closes it or steps out to the parent,
 * Alt with either (or Alt-click on the chevron) does it for every level below.
 */
defineOptions({ inheritAttrs: false })
</script>

<template>
  <STable :striped="false" v-bind="$attrs" tree>
    <template v-for="(_, name) in $slots" #[name]="slotProps"><slot :name="name" v-bind="slotProps ?? {}" /></template>
  </STable>
</template>
