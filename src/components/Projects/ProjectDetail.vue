<template>
  <q-page padding>
    <div class="page-header">Projects</div>
    <div class="page-subheader q-pa-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Project List" :to="{ name: 'project-list' }" />
        <q-breadcrumbs-el :label="props.projectId" />
        <!-- TODO: Replace this with the job number once data is coming from the backend -->
      </q-breadcrumbs>
    </div>

    <q-separator />

    <q-expansion-item
      expand-separator
      icon="looks_one"
      label="Project Information"
      class="bg-grey-3 q-my-md"
    >
      <q-card>
        <q-card-section>
          <ProjectInfo />
        </q-card-section>
      </q-card>
    </q-expansion-item>

    <!-- TODO: There needs to be some logic here to disable this tab if project info is missing, particularly a checklist or standards -->
    <q-expansion-item
      expand-separator
      icon="looks_two"
      label="Enter Data"
      class="bg-grey-3 q-my-md"
    >
      <q-card>
        <q-card-section>
          <ProjectData />
        </q-card-section>
      </q-card>
    </q-expansion-item>

    <q-expansion-item
      expand-separator
      icon="looks_3"
      label="Generate Deliverables"
      caption="Cannot generate deliverables - Data not yet entered"
      class="bg-red-1 q-my-md"
    >
      <q-card>
        <q-card-section>
          <ProjectDeliverables />
        </q-card-section>
      </q-card>
    </q-expansion-item>

    <q-expansion-item
      expand-separator
      icon="looks_4"
      label="Record Invoice"
      caption="Cannot be invoiced - Project not yet complete"
      class="bg-red-1 q-my-md"
    >
      <q-card>
        <q-card-section>
          <ProjectInvoicing />
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </q-page>
</template>

<script setup lang="ts">
import ProjectInfo from './ProjectInfo.vue';
import ProjectData from './ProjectData.vue';
import ProjectDeliverables from './ProjectDeliverables.vue';
import ProjectInvoicing from './ProjectInvoicing.vue';

const props = defineProps<{
  projectId: string;
}>();
</script>
