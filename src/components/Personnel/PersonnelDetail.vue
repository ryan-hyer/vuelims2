<template>
  <q-page padding>
    <div class="page-header">Employees</div>
    <div class="page-subheader q-pa-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Employee List" :to="{ name: 'personnel-list' }" />
        <q-breadcrumbs-el label="Ryan Hyer" />
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
      <q-route-tab label="Basic Info" :to="{ name: 'personnel-info' }" />
      <q-route-tab label="Roles & Authorizations" :to="{ name: 'personnel-roles' }" />
      <q-route-tab label="Competency & Training" :to="{ name: 'personnel-training' }" />
      <q-route-tab label="Performance Reviews" :to="{ name: 'personnel-reviews' }" />
    </q-tabs>
    <q-separator />

    <router-view />
  </q-page>
</template>

<script setup lang="ts">
const employee = {
  name: 'PersonnelDetail',
  props: ['employeeId'],
};
defineExpose({
  employee,
});
</script>
