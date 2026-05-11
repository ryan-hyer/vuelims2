<template>
  <q-page padding>
    <div class="page-header row items-center no-wrap">
      <div class="col">Customers</div>
      <q-btn round color="primary" icon="search" class="q-mr-md" @click="openSearch = !openSearch">
        <q-tooltip>Search and Filter</q-tooltip>
      </q-btn>
      <q-btn round color="green" icon="add" class="q-mr-md" :to="{ name: 'customer-new' }">
        <q-tooltip>Add New Customer</q-tooltip>
      </q-btn>
    </div>

    <q-table
      flat
      bordered
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
      <template v-slot:top v-if="openSearch">
        <q-toolbar>
          <q-input
            v-model="filter"
            placeholder="Search customers..."
            dense
            outlined
            clearable
            debounce="300"
            class="col"
          />
          <q-toggle
            v-model="showArchived"
            label="Show Archived"
            class="q-ml-md"
            @update:model-value="customerTable.requestServerInteraction()"
          />
        </q-toolbar>
      </template>
      <template v-slot:body-cell-name="props">
        <q-td :props="props">
          <span :class="props.row.archivedAt ? 'text-grey-6' : ''">{{ props.row.name }}</span>
          <q-badge v-if="props.row.archivedAt" color="grey-5" label="Archived" class="q-ml-sm" />
        </q-td>
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
const openSearch = ref(false);
const showArchived = ref(false);

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
  await store.fetchCustomers(startRow, fetchCount, filter, sortBy, descending, showArchived.value).then(() => {
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
