<template>
  <q-page padding>
    <div class="page-header">Customers</div>
    <div class="page-subheader q-pa-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Customer List" :to="{ name: 'customer-list' }" />
        <q-breadcrumbs-el :label="props.customerId" />
      </q-breadcrumbs>
    </div>

    <q-separator />

    <q-tabs
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      narrow-indicator
      mobile-arrows
    >
      <q-route-tab label="Company Info" :to="{ name: 'customer-info' }" />
      <q-route-tab label="Interactions" :to="{ name: 'customer-interactions' }" />
      <q-route-tab label="Projects / Invoices" :to="{ name: 'customer-projects' }" />
    </q-tabs>
    <q-separator />

    <router-view />
  </q-page>
</template>

<script setup lang="ts">
const props = defineProps<{
  customerId: string;
}>();
</script>
