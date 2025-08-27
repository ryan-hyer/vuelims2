<template>
  <q-page padding>
    <div class="page-header">Projects</div>
    <div class="page-subheader q-pa-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Project List" :to="{ name: 'project-list' }" />
        <q-breadcrumbs-el :label="props.projectId" />
        <!-- Replace this with the job number once data is coming from the backend -->
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
      <q-route-tab label="Project Info" :to="{ name: 'project-info' }" />
      <q-route-tab label="Enter Data" :to="{ name: 'project-info' }" />
      <q-route-tab label="Deliverables" :to="{ name: 'project-info' }" />
      <q-route-tab label="Invoicing" :to="{ name: 'project-info' }" />
    </q-tabs>
    <q-separator />

    <router-view />
  </q-page>
</template>

<script setup lang="ts">
const props = defineProps<{
  projectId: string;
}>();
</script>
