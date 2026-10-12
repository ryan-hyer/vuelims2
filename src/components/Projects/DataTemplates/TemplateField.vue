<template>
  <div class="row items-center no-wrap q-gutter-x-sm">
    <template v-if="field.type === 'requirement' || field.type === 'yesno'">
      <div v-if="!compact" class="col">{{ field.label }}</div>
      <q-btn-toggle
        :model-value="modelValue"
        @update:model-value="(v: FieldValue) => emit('update:modelValue', v)"
        :options="toggleOptions"
        :readonly="readonly"
        clearable
        dense
        no-caps
        unelevated
        toggle-color="primary"
        color="grey-3"
        text-color="grey-9"
        size="sm"
      >
        <template v-for="opt in toggleOptions" :key="opt.slot" v-slot:[opt.slot]>
          <q-tooltip v-if="compact">{{ opt.tooltip }}</q-tooltip>
        </template>
      </q-btn-toggle>
    </template>

    <q-select
      v-else-if="field.type === 'select'"
      :model-value="modelValue"
      @update:model-value="(v: FieldValue) => emit('update:modelValue', v)"
      :options="field.options ?? []"
      :label="compact ? undefined : field.label"
      :readonly="readonly"
      emit-value
      map-options
      filled
      dense
      options-dense
      class="col"
    />

    <q-input
      v-else
      :model-value="modelValue ?? ''"
      @update:model-value="onInput"
      :type="field.type === 'number' ? 'number' : 'text'"
      :label="compact ? undefined : field.label + (field.optional ? ' (optional)' : '')"
      :suffix="unitLabel(field, units)"
      :readonly="readonly"
      :input-class="compact ? 'text-right' : ''"
      filled
      dense
      class="col"
      :class="{ 'cell-input': compact }"
    />

    <div v-if="limit && !compact" class="text-caption text-grey-7 limit">{{ limit.text }}</div>
    <q-icon
      v-if="status && field.type === 'number'"
      :name="status === 'pass' ? 'check_circle' : 'error'"
      :color="status === 'pass' ? 'positive' : 'negative'"
      size="sm"
    >
      <q-tooltip>{{
        status === 'pass' ? 'Meets requirement' : 'Does not meet requirement'
      }}</q-tooltip>
    </q-icon>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { fieldStatus, unitLabel } from './standards';
import type { FieldDef, FieldValue, UnitSystem, Values } from './standards/types';

const props = defineProps<{
  field: FieldDef;
  modelValue: FieldValue;
  inputs: Values;
  units: UnitSystem;
  values?: Values;
  readonly?: boolean;
  compact?: boolean; // table cell: no label or limit text (the row header shows them)
}>();

const emit = defineEmits<{ 'update:modelValue': [value: FieldValue] }>();

const toggleOptions = computed(() => {
  if (props.field.type === 'yesno') {
    return [
      { label: 'Yes', value: 'yes', slot: 'yes', tooltip: 'Yes' },
      { label: 'No', value: 'no', slot: 'no', tooltip: 'No' },
    ];
  }
  const options = [
    { label: 'Complies', icon: 'check', value: 'complies', toggleColor: 'positive' },
    { label: 'Does Not Comply', icon: 'close', value: 'does-not-comply', toggleColor: 'negative' },
    ...(props.field.allowNA
      ? [{ label: 'N/A', icon: undefined, value: 'n/a', toggleColor: 'grey-7' }]
      : []),
  ];
  // Compact cells show icons only, with the label as a tooltip
  return options.map(({ label, icon, ...rest }) => ({
    ...rest,
    slot: rest.value,
    tooltip: label,
    ...(props.compact && icon ? { icon } : { label }),
  }));
});

const limit = computed(
  () => props.field.limit?.(props.inputs, props.values ?? {}, props.units) ?? null,
);
const status = computed(() =>
  fieldStatus(props.field, props.modelValue, props.inputs, props.values ?? {}, props.units),
);

function onInput(v: string | number | null) {
  if (props.field.type !== 'number') return emit('update:modelValue', v);
  emit('update:modelValue', v === '' || v === null ? null : Number(v));
}
</script>

<style scoped>
.limit {
  min-width: 7em;
  text-align: right;
}
.cell-input {
  min-width: 7em;
}
</style>
