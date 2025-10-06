<template>
  <q-page padding>
    <div class="page-header">Customers</div>
    <div class="page-subheader q-pa-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Customer List" :to="{ name: 'customer-list' }" />
        <q-breadcrumbs-el label="Add New Customer" />
      </q-breadcrumbs>
    </div>

    <q-separator />

    <div class="q-pa-md">
      <q-form @submit.prevent="submitForm">
        <q-input
          filled
          v-model="newCustomer.name"
          label="Company Name"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Cannot be blank']"
        />
        <q-input
          filled
          v-model="newCustomer.website"
          label="Company Website (optional)"
          class="q-mb-md"
        />
        <q-input filled v-model="newCustomer.notes" type="textarea" label="Notes (optional)" />
        <div class="row justify-end q-gutter-sm q-mt-md">
          <q-btn flat label="Cancel" color="red" :to="{ name: 'customer-list' }" />
          <q-btn type="submit" label="Add Customer" color="primary" :disable="!newCustomer.name" />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
import { useCustomerStore } from 'src/stores/store';
const store = useCustomerStore();
import type { Customer } from './models';

const newCustomer = ref<Customer>({
  id: -1,
  name: '',
  website: '',
  notes: '',
});

const submitForm = () => {
  console.log('Form submitted: ', newCustomer.value);
  const customerId = store.addCustomer(newCustomer.value);
  /* eslint-disable-next-line @typescript-eslint/no-floating-promises */
  router.push({ name: 'customer-detail', params: { customerId } });
};
</script>
