<template>
  <q-page padding>
    <div class="page-header">Personnel</div>
    <q-table
      flat
      bordered
      dense
      :rows="dummyEmployees"
      :columns="columns"
      row-key="employeeId"
      hide-header
    >
      <template v-slot:top>
        <q-toolbar>
          <q-input v-model="search" placeholder="Search personnel..." dense outlined clearable />
          <q-space />
          <q-btn round color="green" icon="add" class="q-ma-sm" :to="{ name: 'personnel-new' }">
            <q-tooltip>Add New Employee</q-tooltip>
          </q-btn>
        </q-toolbar>
      </template>
      <template v-slot:body-cell="props">
        <q-td>
          <q-item
            clickable
            :key="props.row.id"
            :to="{ name: 'personnel-info', params: { employeeId: props.row.employeeId } }"
          >
            <q-item-section>
              <q-item-label>{{ props.row.name }}</q-item-label>
              <q-item-label caption v-for="title in props.row.titles" :key="title">
                {{ title }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { QTableColumn } from 'quasar';

const search = ref('');

const columns: QTableColumn[] = [
  {
    name: 'employeeName',
    label: 'Employee Name',
    field: 'name',
    align: 'left',
  },
];

const dummyEmployees = ref([
  {
    employeeId: 1,
    name: 'Merrill Gee',
    titles: ['Quality Manager', 'Technician - TEi-TS Analytical'],
  },
  { employeeId: 2, name: 'Ryan Hyer', titles: ['Listing Compliance Engineer'] },
  {
    employeeId: 3,
    name: 'Alona MacGregor',
    titles: ['Director Human Resources', 'Executive Director TEi-LS', 'TEi-IS Inspector'],
  },
  {
    employeeId: 4,
    name: 'Matthew MacGregor',
    titles: ['President and CEO', 'Executive Director TEi-TS'],
  },
  {
    employeeId: 5,
    name: 'Frank Strickland',
    titles: ['Director TEi-TS Stone & Tile'],
  },
]);
</script>
