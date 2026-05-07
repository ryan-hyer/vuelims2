<template>
  <q-dialog v-model="open" @hide="resetForm">
    <q-card style="min-width: 350px; max-width: 500px; width: 90vw">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ isEditing ? 'Edit Entry' : 'Add New Entry' }}</div>
        <q-space />
        <q-btn flat round dense icon="close" v-close-popup />
      </q-card-section>
      <q-card-section>
        <q-form ref="formRef" class="q-gutter-sm">
          <q-select
            filled
            v-model="form.type"
            :options="typeOptions"
            label="Element Type *"
            emit-value
            map-options
            :rules="[(val) => !!val || 'Required']"
            lazy-rules
            :disable="isEditing"
            @update:model-value="form.parentId = null"
          />
          <q-select
            v-if="form.type === 'category'"
            filled
            v-model="form.schemeId"
            :options="schemeOptions"
            label="Scheme *"
            emit-value
            map-options
            :rules="[(val) => !!val || 'Required']"
            lazy-rules
            :disable="isEditing"
          />
          <q-select
            v-if="form.type === 'subcategory'"
            filled
            v-model="form.parentId"
            :options="categoryOptions"
            label="Parent Category *"
            emit-value
            map-options
            :rules="[(val) => !!val || 'Required']"
            lazy-rules
            :disable="isEditing"
          />
          <q-select
            v-if="form.type === 'product'"
            filled
            v-model="form.parentId"
            :options="subcategoryOptions"
            label="Parent Subcategory *"
            emit-value
            map-options
            :rules="[(val) => !!val || 'Required']"
            lazy-rules
            :disable="isEditing"
          />
          <q-input
            filled
            v-model="form.code"
            label="Code *"
            :rules="[(val) => !!val || 'Required']"
            lazy-rules
          />
          <q-input
            filled
            v-model="form.description"
            label="Description *"
            :rules="[(val) => !!val || 'Required']"
            lazy-rules
          />
          <q-input
            filled
            v-model.number="form.fee"
            type="number"
            label="Fee *"
            prefix="$"
            :rules="[(val) => (val !== null && val >= 0) || 'Required']"
            lazy-rules
          />
          <q-select
            v-if="form.type === 'product'"
            filled
            v-model="form.standardIds"
            :options="filteredStandardOptions"
            label="Applicable Standards"
            multiple
            use-chips
            use-input
            input-debounce="0"
            emit-value
            map-options
            @filter="filterStandards"
          />
        </q-form>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          color="teal"
          :label="isEditing ? 'Save' : 'Add'"
          :loading="saving"
          @click="submitForm"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { QForm } from 'quasar';
import { useCertificationStore } from 'src/stores/certification-store';
import type { FlatCertRow } from 'src/stores/certification-store';
import { useStandardStore } from 'src/stores/standard-store';

const store = useCertificationStore();
const standardStore = useStandardStore();

const open = ref(false);
const saving = ref(false);
const formRef = ref<QForm | null>(null);
const editingId = ref<number | null>(null);
const isEditing = computed(() => editingId.value !== null);

const emptyForm = () => ({
  type: null as 'category' | 'subcategory' | 'product' | null,
  schemeId: null as number | null,
  parentId: null as number | null,
  code: '',
  description: '',
  fee: null as number | null,
  standardIds: [] as number[],
});
const form = ref(emptyForm());

const typeOptions = [
  { label: 'Category', value: 'category' },
  { label: 'Subcategory', value: 'subcategory' },
  { label: 'Product Type', value: 'product' },
];

const standardOptions = computed(() =>
  standardStore.latestStandards.map((s) => ({
    value: s.id,
    label: `${s.number} (${s.revision})`,
  })),
);

const filteredStandardOptions = ref<{ value: number; label: string }[]>([]);

function filterStandards(val: string, update: (fn: () => void) => void) {
  update(() => {
    const needle = val.toLowerCase();
    filteredStandardOptions.value = needle
      ? standardOptions.value.filter((o) => o.label.toLowerCase().includes(needle))
      : standardOptions.value.slice();
  });
}

const schemeOptions = computed(() =>
  store.schemes.map((s) => ({ label: s.description, value: s.id })),
);

const categoryOptions = computed(() =>
  store.categories.map((c) => {
    const scheme = store.schemes.find((s) => s.id === c.schemeId);
    return { label: `(${scheme?.code ?? '?'}) ${c.code} — ${c.description}`, value: c.id };
  }),
);

const subcategoryOptions = computed(() =>
  store.subcategories.map((s) => {
    const cat = store.categories.find((c) => c.id === s.categoryId);
    const scheme = store.schemes.find((sc) => sc.id === cat?.schemeId);
    return { label: `(${scheme?.code ?? '?'}) ${cat?.code ?? ''}${s.code} — ${s.description}`, value: s.id };
  }),
);

function openAdd() {
  filteredStandardOptions.value = standardOptions.value.slice();
  editingId.value = null;
  open.value = true;
}

function openEdit(row: FlatCertRow) {
  filteredStandardOptions.value = standardOptions.value.slice();
  editingId.value = row.id;
  if (row.rowType === 'category') {
    const cat = store.categories.find((c) => c.id === row.id)!;
    form.value = { type: 'category', schemeId: cat.schemeId, parentId: null, code: cat.code, description: cat.description, fee: cat.fee, standardIds: [] };
  } else if (row.rowType === 'subcategory') {
    const sub = store.subcategories.find((s) => s.id === row.id)!;
    form.value = { type: 'subcategory', schemeId: null, parentId: sub.categoryId, code: sub.code, description: sub.description, fee: sub.fee, standardIds: [] };
  } else if (row.rowType === 'product') {
    const pt = store.productTypes.find((p) => p.id === row.id)!;
    form.value = { type: 'product', schemeId: null, parentId: pt.subcategoryId, code: pt.code, description: pt.description, fee: pt.fee, standardIds: pt.standardIds };
  }
  open.value = true;
}

function resetForm() {
  editingId.value = null;
  form.value = emptyForm();
  formRef.value?.resetValidation();
}

async function submitForm() {
  const valid = await formRef.value?.validate();
  if (!valid) return;
  saving.value = true;
  try {
    if (isEditing.value) {
      if (form.value.type === 'category') {
        await store.updateCategory({ id: editingId.value!, schemeId: form.value.schemeId!, code: form.value.code, description: form.value.description, fee: form.value.fee! });
      } else if (form.value.type === 'subcategory') {
        await store.updateSubcategory({ id: editingId.value!, categoryId: form.value.parentId!, code: form.value.code, description: form.value.description, fee: form.value.fee! });
      } else {
        await store.updateProductType({ id: editingId.value!, subcategoryId: form.value.parentId!, code: form.value.code, description: form.value.description, fee: form.value.fee!, standardIds: form.value.standardIds });
      }
    } else {
      if (form.value.type === 'category') {
        await store.addCategory({ schemeId: form.value.schemeId!, code: form.value.code, description: form.value.description, fee: form.value.fee! });
      } else if (form.value.type === 'subcategory') {
        await store.addSubcategory({ categoryId: form.value.parentId!, code: form.value.code, description: form.value.description, fee: form.value.fee! });
      } else {
        await store.addProductType({ subcategoryId: form.value.parentId!, code: form.value.code, description: form.value.description, fee: form.value.fee!, standardIds: form.value.standardIds });
      }
    }
    open.value = false;
  } finally {
    saving.value = false;
  }
}

defineExpose({ openAdd, openEdit });
</script>
