<template>
  <!--
   TODO:
   Decide whether categories can be deleted, and if so how to best handle it
   -->
  <q-page padding>
    <div class="page-header-certification bg-cyan-2 row items-center no-wrap">
      <div class="col">Certification Categories (Fee Schedule)</div>
      <q-btn round color="green" icon="add" class="q-mr-md" @click="dialogRef?.openAdd()">
        <q-tooltip>Add New Entry</q-tooltip>
      </q-btn>
    </div>
    <q-table
      :grid="$q.screen.xs"
      flat
      bordered
      :rows="store.flatRows"
      :columns="columns"
      :row-key="(row: FlatCertRow) => row.rowType + '-' + row.id"
      :loading="loading"
      :pagination="{ rowsPerPage: 0 }"
      hide-bottom
    >
      <template v-slot:body="props">
        <q-tr v-if="props.row.rowType === 'category'" :props="props" class="cert-row-category">
          <q-td key="code" :props="props">{{ props.row.code }}</q-td>
          <q-td key="description" :props="props">{{ props.row.description }}</q-td>
          <q-td key="standards" :props="props" />
          <q-td key="fee" :props="props" class="text-right">{{ formatFee(props.row.fee) }}</q-td>
          <q-td key="actions" :props="props">
            <q-btn flat round dense icon="edit" @click="dialogRef?.openEdit(props.row)">
              <q-tooltip>Edit</q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
        <q-tr
          v-else-if="props.row.rowType === 'subcategory'"
          :props="props"
          class="cert-row-subcategory"
        >
          <q-td key="code" :props="props">{{ props.row.code }}</q-td>
          <q-td key="description" :props="props">{{ props.row.description }}</q-td>
          <q-td key="standards" :props="props" />
          <q-td key="fee" :props="props" class="text-right">{{ formatFee(props.row.fee) }}</q-td>
          <q-td key="actions" :props="props">
            <q-btn flat round dense icon="edit" @click="dialogRef?.openEdit(props.row)">
              <q-tooltip>Edit</q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
        <q-tr v-else :props="props" class="cert-row-product">
          <q-td key="code" :props="props">{{ props.row.code }}</q-td>
          <q-td key="description" :props="props">{{ props.row.description }}</q-td>
          <q-td key="standards" :props="props">
            <ul class="standards-list">
              <li v-for="id in props.row.standardIds" :key="id">{{ standardLabel(id) }}</li>
            </ul>
          </q-td>
          <q-td key="fee" :props="props" class="text-right">
            {{ formatFee(props.row.fee) }}
            <div class="text-caption text-grey-7"><em>(Total: {{ formatFee(props.row.totalFee!) }})</em></div>
          </q-td>
          <q-td key="actions" :props="props">
            <q-btn flat round dense icon="edit" @click="dialogRef?.openEdit(props.row)">
              <q-tooltip>Edit</q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>

      <template v-slot:item="props">
        <div class="col-12">
          <div
            v-if="props.row.rowType === 'category'"
            class="cert-card-category row items-center no-wrap q-px-md q-py-sm"
          >
            <div class="col text-weight-bold">
              {{ props.row.code }} &mdash; {{ props.row.description }}
            </div>
            <div class="text-weight-bold q-ml-sm">{{ formatFee(props.row.fee) }}</div>
            <q-btn flat round dense icon="edit" class="q-ml-xs" @click="dialogRef?.openEdit(props.row)">
              <q-tooltip>Edit</q-tooltip>
            </q-btn>
          </div>
          <div
            v-else-if="props.row.rowType === 'subcategory'"
            class="cert-card-subcategory row items-center no-wrap q-px-md q-py-sm"
          >
            <div class="col">{{ props.row.code }} &mdash; {{ props.row.description }}</div>
            <div class="q-ml-sm">{{ formatFee(props.row.fee) }}</div>
            <q-btn flat round dense icon="edit" class="q-ml-xs" @click="dialogRef?.openEdit(props.row)">
              <q-tooltip>Edit</q-tooltip>
            </q-btn>
          </div>
          <div v-else class="cert-card-product row items-center no-wrap q-px-md q-py-sm">
            <div class="col">
              <div class="text-caption text-grey-7">{{ props.row.code }}</div>
              <div>{{ props.row.description }}</div>
              <ul v-if="props.row.standardIds?.length" class="standards-list q-mt-xs">
                <li v-for="id in props.row.standardIds" :key="id">{{ standardLabel(id) }}</li>
              </ul>
            </div>
            <div class="q-ml-sm text-weight-medium text-right">
              {{ formatFee(props.row.fee) }}
              <div class="text-caption text-grey-7"><em>(Total: {{ formatFee(props.row.totalFee!) }})</em></div>
            </div>
            <q-btn flat round dense icon="edit" class="q-ml-xs" @click="dialogRef?.openEdit(props.row)">
              <q-tooltip>Edit</q-tooltip>
            </q-btn>
          </div>
        </div>
      </template>
    </q-table>
  </q-page>

  <CertificationCategoryDialog ref="dialogRef" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { QTableColumn } from 'quasar';
import { useCertificationStore } from 'src/stores/certification-store';
import type { FlatCertRow } from 'src/stores/certification-store';
import { useStandardStore } from 'src/stores/standard-store';
import CertificationCategoryDialog from './CertificationCategoryDialog.vue';

const store = useCertificationStore();
const standardStore = useStandardStore();
const loading = ref(false);
const dialogRef = ref<InstanceType<typeof CertificationCategoryDialog> | null>(null);

onMounted(async () => {
  loading.value = true;
  await Promise.all([store.fetchAll(), standardStore.fetchStandards()]);
  loading.value = false;
});

function formatFee(fee: number): string {
  return '$' + fee.toLocaleString();
}

function standardLabel(id: number): string {
  const s = standardStore.standards.find((s) => s.id === id);
  return s ? `${s.number} (${s.revision})` : `#${id}`;
}

const columns: QTableColumn[] = [
  {
    name: 'code',
    label: 'Code',
    field: 'code',
    align: 'left',
    sortable: false,
    style: 'width: 130px;',
  },
  {
    name: 'description',
    label: 'Description',
    field: 'description',
    align: 'left',
    sortable: false,
  },
  {
    name: 'standards',
    label: 'Standards',
    field: 'standardIds',
    align: 'left',
    sortable: false,
  },
  {
    name: 'fee',
    label: 'Fee',
    field: 'fee',
    align: 'right',
    sortable: false,
    style: 'width: 160px;',
    headerStyle: 'text-align: right;',
  },
  {
    name: 'actions',
    label: '',
    field: '',
    align: 'center',
    sortable: false,
    style: 'width: 48px;',
  },
];
</script>

<style scoped>
.cert-row-category td {
  background-color: #1565c0 !important;
  color: white !important;
  font-weight: bold;
}

.cert-row-subcategory td {
  background-color: #90caf9 !important;
  font-weight: 500;
  padding-left: 20px !important;
}

.cert-row-subcategory td:first-child {
  border-left: 4px solid #1565c0 !important;
}

.cert-row-product td {
  background-color: #ffffff;
  padding-left: 36px !important;
}

.cert-row-product td:first-child {
  border-left: 4px solid #1565c0 !important;
  box-shadow: inset 4px 0 0 #90caf9 !important;
}

.standards-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

/* Mobile grid styles */
.cert-card-category {
  background-color: #1565c0;
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.cert-card-subcategory {
  background-color: #90caf9;
  border-left: 4px solid #1565c0;
  margin-left: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.cert-card-product {
  background-color: #ffffff;
  border-left: 4px solid #1565c0;
  box-shadow: inset 4px 0 0 #90caf9;
  margin-left: 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}
</style>
