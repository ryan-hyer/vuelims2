<template>
  <q-page padding>
    <div class="page-header">Customers</div>
    <q-table
      flat
      bordered
      dense
      ref="customerTable"
      :rows="customers"
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
          <q-input
            v-model="filter"
            placeholder="Search customers..."
            dense
            outlined
            clearable
            debounce="300"
          />
          <q-space />
          <q-btn round color="green" icon="add" class="q-ma-sm" :to="{ name: 'customer-new' }">
            <q-tooltip>Add New Customer</q-tooltip>
          </q-btn>
        </q-toolbar>
        <div class="text-caption text-italic">Click a row to view more details</div>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCustomerStore } from 'src/stores/customer-store';
import type { Customer } from './models';
import type { QTableColumn } from 'quasar';

const router = useRouter();
const store = useCustomerStore();

const customers = ref<Customer[]>([]);
const customerTable = ref();
const filter = ref('');
const loading = ref(false);

onMounted(() => {
  customerTable.value.requestServerInteraction();
});

const columns: QTableColumn[] = [
  {
    name: 'name',
    label: 'Customer Name',
    field: 'name',
    align: 'left',
  },
];

const pagination = ref({
  sortBy: 'name',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10, // doesn't matter initially, this gets updated on first load
});

const onRowClick = (evt: Event, row: { [key: string]: string }) => {
  void router.push({ name: 'customer-detail', params: { customerId: row.id } });
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
  const fetchCount = rowsPerPage === 0 ? store.totalCustomerCount : rowsPerPage;

  // calculate starting row of data
  const startRow = (page - 1) * rowsPerPage;

  // fetch data from "server"
  await store.fetchCustomers(startRow, fetchCount, filter, sortBy, descending).then(() => {
    // clear out existing data and add new
    customers.value = store.customers;

    // don't forget to update local pagination object
    pagination.value.page = page;
    pagination.value.rowsPerPage = rowsPerPage;
    pagination.value.sortBy = sortBy;
    pagination.value.descending = descending;
    pagination.value.rowsNumber = store.filteredCustomerCount;

    // ...and turn off loading indicator
    loading.value = false;
  });
}
</script>
