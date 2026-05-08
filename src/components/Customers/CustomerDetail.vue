<template>
  <q-page padding>
    <q-inner-loading :showing="!customer" label="Loading customer data..." />

    <div class="page-header">Customers</div>
    <div class="page-subheader q-pa-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Customer List" :to="{ name: 'customer-list' }" />
        <q-breadcrumbs-el :label="customer?.name" />
      </q-breadcrumbs>
    </div>
    <q-separator />

    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      narrow-indicator
      mobile-arrows
    >
      <q-tab name="identity" label="Company Info" />
      <q-tab name="interactions" label="Interaction Log" />
      <!-- Only show if customer has active, suspended, or terminated certifications -->
      <q-tab name="certifications" label="Certifications" />
      <q-tab name="projects" label="Projects / Invoices" disable />
    </q-tabs>
    <q-separator />

    <q-tab-panels v-if="customer" v-model="tab" animated>
      <q-tab-panel name="identity"> <CustomerInfo :customer="customer" /></q-tab-panel>
      <q-tab-panel name="interactions"> <CustomerInteractions :customer="customer" /></q-tab-panel>
      <q-tab-panel name="certifications"> <CertificationDetail :customerId="customer!.id" /></q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
/*
TODO:
Once Personnel module is completed, pull employee list for interaction dropdown from API
Look into easy ways of populating addresses, e.g. Google Places API
Once Projects and Invoicing modules are completed, finish Projects / Invoices tab
*/
import { ref, onMounted } from 'vue';
import type { Customer } from './models';
import { useCustomerStore } from 'src/stores/customer-store';
import CustomerInfo from './CustomerInfo.vue';
import CustomerInteractions from './CustomerInteractions.vue';
import CertificationDetail from '../Certification/CertificationDetail.vue';

const store = useCustomerStore();
const customer = ref<Customer>();

const props = defineProps<{
  customerId: string;
}>();

const tab = ref('identity');

onMounted(() => {
  store
    .fetchCustomer(parseInt(props.customerId))
    .then(() => {
      customer.value = store.customer;
    })
    .catch((error) => {
      console.log('Error fetching customer:', error);
    });
});
</script>
