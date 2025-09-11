<template>
  <q-page padding>
    <div class="page-header">Projects</div>
    <!-- TODO: I'd really love to flash a newly added row, but table-row-class-fn doesn't seem to work right -->
    <q-table
      flat
      bordered
      dense
      :rows="projects"
      :columns="columns"
      row-key="id"
      :table-row-class-fn="rowClassFn"
      @row-click="onRowClick"
    >
      <template v-slot:top>
        <q-toolbar>
          <q-input v-model="search" placeholder="Search projects..." dense outlined clearable />
          <q-space />
          <q-btn round color="green" icon="add" class="q-ma-sm" :to="{ name: 'project-new' }">
            <q-tooltip>Add New Project</q-tooltip>
          </q-btn>
        </q-toolbar>
        <div class="text-caption text-italic">Click a record to view more details</div>
      </template>
      <template v-slot:body-cell-description="props">
        <q-td :props="props" style="max-width: fit-content">
          {{ props.row.description.substring(0, 30) }}
          <span v-if="props.row.description.length > 30">...</span>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Project } from './models';
import type { QTableColumn } from 'quasar';
import { useRouter } from 'vue-router';

const search = ref('');

const columns: QTableColumn[] = [
  {
    name: 'jobNumber',
    label: 'Job Number',
    field: 'number',
    align: 'left',
    sortable: true,
  },
  {
    name: 'startDate',
    label: 'Start Date',
    field: 'startDate',
    align: 'left',
    sortable: true,
  },
  {
    name: 'customer',
    label: 'Customer',
    field: 'customer',
    align: 'left',
  },
  {
    name: 'description',
    label: 'Description',
    field: 'description',
    align: 'left',
  },
  {
    name: 'completeDate',
    label: 'Completed Date',
    field: 'completeDate',
    align: 'left',
    sortable: true,
  },
];

const router = useRouter();
const onRowClick = (evt: Event, row: { [key: string]: string }) => {
  void router.push({ name: 'project-detail', params: { projectId: row.id } });
};

const rowClassFn = (row: { [key: string]: string }) => {
  return row.completeDate ? 'text-weight-light text-italic' : '';
};

// Production data should be sorted by completion date ascending (putting open jobs at the top), then by start date descending, then by job number ascending
const projects = ref<Project[]>([
  {
    id: 1,
    number: 'LS2500311',
    customer: 'Alpha Systems',
    description: 'Listing Addition',
    startDate: '2023-10-01',
  },
  {
    id: 2,
    number: 'A2500312',
    customer: 'Beta Corp',
    description: 'Flow',
    startDate: '2023-11-15',
    standards: ['Standard C (2018)'],
    purchaseOrder: 'PO12345',
  },
  {
    id: 3,
    number: 'P2500313',
    customer: 'Gamma LLC',
    description: 'Plastic shower pans',
    startDate: '2024-01-20',
    standards: ['Standard A (2015)', 'Standard D (2020)'],
  },
  {
    id: 5,
    number: 'LS2500315',
    customer: 'Epsilon Partners',
    description: 'Energy Efficiency Upgrade\nCan I do two lines?\nDoes it look stupid?',
    startDate: '2024-03-05',
    purchaseOrder: 'PO54321',
  },
  {
    id: 4,
    number: 'I2500314',
    customer: 'Delta Inc',
    description: 'RFI 2024',
    startDate: '2024-02-10',
    completeDate: '2024-04-15',
  },
]);
</script>

<style scoped>
.flash {
  animation-name: highlight-new;
  animation-duration: 2s;
}
</style>
