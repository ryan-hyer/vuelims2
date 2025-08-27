<template>
  <q-page padding>
    <div class="page-header">Projects</div>
    <q-table
      flat
      bordered
      dense
      :rows="projects"
      :columns="columns"
      row-key="id"
      @row-click="onRowClick"
    >
      <template v-slot:top>
        <q-toolbar>
          <q-input v-model="search" placeholder="Search projects..." dense outlined clearable />
          <q-space />
          <q-btn round color="green" icon="add" class="q-ma-sm">
            <q-tooltip>Add New Project</q-tooltip>
          </q-btn>
        </q-toolbar>
        <div class="text-caption text-italic">Click a record to view more details</div>
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
  },
  {
    name: 'startDate',
    label: 'Start Date',
    field: 'startDate',
    align: 'left',
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
];

const router = useRouter();

const onRowClick = (evt: Event, row: { [key: string]: string }) => {
  void router.push({ name: 'project-info', params: { projectId: row.id } });
};

// Production data should be sorted so that open projects are at the top, then by start date descending
const projects = ref<Project[]>([
  {
    id: 1,
    number: 'LS2500311',
    customer: 'Alpha Systems',
    description: 'Listing Addition',
    startDate: '2023-10-01',
    standards: 'Standard A (2015), Standard B (2022)',
  },
  {
    id: 2,
    number: 'A2500312',
    customer: 'Beta Corp',
    description: 'Flow',
    startDate: '2023-11-15',
    standards: 'Standard C (2018)',
    purchaseOrder: 'PO12345',
  },
  {
    id: 3,
    number: 'P2500313',
    customer: 'Gamma LLC',
    description: 'Plastic shower pans',
    startDate: '2024-01-20',
    standards: 'Standard A (2015), Standard D (2020)',
  },
  {
    id: 4,
    number: 'I2500314',
    customer: 'Delta Inc',
    description: 'RFI 2024',
    startDate: '2024-02-10',
    standards: 'Standard E (2019)',
    completeDate: '2024-04-15',
  },
  {
    id: 5,
    number: 'LS2500315',
    customer: 'Epsilon Partners',
    description: 'Energy Efficiency Upgrade',
    startDate: '2024-03-05',
    standards: 'Standard F (2021), Standard B (2022)',
    purchaseOrder: 'PO54321',
  },
]);
</script>
