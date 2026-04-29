<template>
  <q-page padding>
    <div class="page-header">Personnel</div>
    <q-table
      flat
      bordered
      ref="employeeTable"
      :rows="employees"
      :columns="columns"
      row-key="id"
      :loading="loading"
      :filter="filter"
      v-model:pagination="pagination"
      @request="onRequest"
      @row-click="onRowClick"
    >
      <template v-slot:top>
        <q-toolbar>
          <q-input v-model="filter" placeholder="Search personnel..." dense outlined clearable />
          <q-space />
          <q-btn round color="green" icon="add" class="q-ma-sm" :to="{ name: 'personnel-new' }">
            <q-tooltip>Add New Employee</q-tooltip>
          </q-btn>
        </q-toolbar>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
/*
TODO:
- Display former employees differently (greyed out and/or italicized?), or have a separate page to access them
- Then, employees should be sorted by termination date first, then by name (ideally last name, so add a last name field to the model)
*/
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePersonnelStore } from 'src/stores/personnel-store';
import type { Employee } from './models';
import type { QTableColumn } from 'quasar';

const router = useRouter();
const store = usePersonnelStore();

const employees = ref<Employee[]>([]);
const employeeTable = ref();
const filter = ref('');
const loading = ref(false);

onMounted(() => {
  employeeTable.value.requestServerInteraction();
});

const columns: QTableColumn[] = [
  {
    name: 'employeeName',
    label: 'Employee',
    field: (row: Employee) => `${row.firstName} ${row.lastName}`,
    align: 'left',
  },
];

const pagination = ref({
  sortBy: 'lastName',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 100, // doesn't matter initially, this gets updated on first load
});

const onRowClick = (evt: Event, row: { [key: string]: string }) => {
  void router.push({ name: 'personnel-detail', params: { employeeId: row.id } });
};

async function onRequest(props: {
  pagination: {
    sortBy: string;
    descending: boolean;
    page: number;
    rowsPerPage: number;
    rowsNumber?: number;
  };
  filter?: any;
  getCellValue: (col: any, row: any) => any;
}) {
  const { page, rowsPerPage, sortBy, descending } = props.pagination;
  const filter = props.filter;

  loading.value = true;

  // get all rows if "All" (0) is selected
  const fetchCount = rowsPerPage === 0 ? store.totalEmployeeCount : rowsPerPage;

  // calculate starting row of data
  const startRow = (page - 1) * rowsPerPage;

  // fetch data from "server"
  await store.fetchPersonnel(startRow, fetchCount, filter, sortBy, descending).then(() => {
    // clear out existing data and add new
    employees.value = store.employees;

    // don't forget to update local pagination object
    pagination.value.page = page;
    pagination.value.rowsPerPage = rowsPerPage;
    pagination.value.sortBy = sortBy;
    pagination.value.descending = descending;
    pagination.value.rowsNumber = store.filteredEmployeeCount;

    // ...and turn off loading indicator
    loading.value = false;
  });
}
</script>
