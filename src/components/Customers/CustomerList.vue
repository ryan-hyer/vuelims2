<template>
  <q-page padding>
    <div class="page-header">Customers</div>
    <q-table
      flat
      bordered
      dense
      :rows="customers"
      :columns="columns"
      row-key="id"
      :loading="loading"
      hide-header
      @row-click="onRowClick"
    >
      <template v-slot:top>
        <q-toolbar>
          <q-input v-model="search" placeholder="Search customers..." dense outlined clearable />
          <q-space />
          <q-btn round color="green" icon="add" class="q-ma-sm" :to="{ name: 'customer-list' }">
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
import { useCustomerStore } from 'src/stores/store';
import type { Customer } from './models';
import type { QTableColumn } from 'quasar';

const router = useRouter();
const store = useCustomerStore();

const customers = ref<Customer[]>([{ id: 0, name: 'Loading...' }]);
const search = ref('');
const loading = ref(false);

onMounted(() => {
  loading.value = true;
  store
    .fetchCustomers()
    .then(() => {
      customers.value = store.customers;
      loading.value = false;
    })
    .catch((error) => {
      console.log('Error fetching customers:', error);
      loading.value = false;
    });
});

const columns: QTableColumn[] = [
  {
    name: 'name',
    label: 'Customer Name',
    field: 'name',
    align: 'left',
  },
];

const onRowClick = (evt: Event, row: { [key: string]: string }) => {
  void router.push({ name: 'customer-info', params: { customerId: row.id } });
};
</script>
