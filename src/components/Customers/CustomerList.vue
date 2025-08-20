<template>
  <q-page padding>
    <div class="page-header">Customers</div>
    <q-table flat bordered dense :rows="dummyCustomers" :columns="columns" row-key="id" hide-header>
      <template v-slot:top>
        <q-toolbar>
          <q-input v-model="search" placeholder="Search customers..." dense outlined clearable />
          <q-space />
          <q-btn round color="green" icon="add" class="q-ma-sm" :to="{ name: 'customer-list' }">
            <q-tooltip>Add New Customer</q-tooltip>
          </q-btn>
        </q-toolbar>
      </template>
      <template v-slot:body-cell="props">
        <q-td>
          <q-item
            clickable
            :key="props.row.id"
            :to="{ name: 'customer-info', params: { customerId: props.row.id } }"
          >
            <q-item-section>
              <q-item-label>{{ props.row.customerName }}</q-item-label>
              <q-item-label caption>
                {{ props.row.customerCity }}, {{ props.row.customerState }}
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
    name: 'customerName',
    label: 'Customer Name',
    field: 'customerName',
    align: 'left',
  },
];

const dummyCustomers = ref([
  { id: 1, customerName: 'Customer A', customerCity: 'City X', customerState: 'State Y' },
  { id: 2, customerName: 'Customer B', customerCity: 'City X', customerState: 'State Y' },
  { id: 3, customerName: 'Customer C', customerCity: 'City X', customerState: 'State Y' },
  { id: 4, customerName: 'Customer D', customerCity: 'City X', customerState: 'State Y' },
  { id: 5, customerName: 'Customer E', customerCity: 'City X', customerState: 'State Y' },
  { id: 6, customerName: 'Customer F', customerCity: 'City X', customerState: 'State Y' },
  { id: 7, customerName: 'Customer G', customerCity: 'City X', customerState: 'State Y' },
  { id: 8, customerName: 'Customer H', customerCity: 'City X', customerState: 'State Y' },
  { id: 9, customerName: 'Customer I', customerCity: 'City X', customerState: 'State Y' },
  { id: 10, customerName: 'Customer J', customerCity: 'City X', customerState: 'State Y' },
]);
</script>
