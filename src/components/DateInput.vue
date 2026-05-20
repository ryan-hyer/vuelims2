<template>
  <q-input
    filled
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event as string)"
    mask="date"
    :label="label"
    lazy-rules
    :rules="[(val) => !!val || 'Cannot be blank']"
    :ref="handleRef"
  >
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-date
            :model-value="modelValue"
            @update:model-value="emit('update:modelValue', $event as string)"
          >
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
  label: string;
  fieldName?: string;
  setFieldRef?: (name: string, el: unknown) => void;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

function handleRef(el: unknown) {
  if (props.fieldName) props.setFieldRef?.(props.fieldName, el);
}
</script>
