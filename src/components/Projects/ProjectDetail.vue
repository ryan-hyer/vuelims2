<template>
  <q-page padding>
    <div class="page-header">Projects</div>
    <div class="page-subheader q-pa-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Project List" :to="{ name: 'project-list' }" />
        <q-breadcrumbs-el :label="store.project?.number ?? props.projectId" />
      </q-breadcrumbs>
    </div>

    <q-separator />

    <!-- TODO: Not entirely sure I like this layout, but it does need to be an ordered flow. Think on it more. -->

    <q-expansion-item
      expand-separator
      icon="looks_one"
      label="Project Information"
      class="bg-grey-3 q-my-md"
      default-opened
    >
      <q-card>
        <q-card-section>
          <ProjectInfo />
        </q-card-section>
      </q-card>
    </q-expansion-item>

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
      class="bg-grey-3 q-my-md"
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
      class="bg-grey-3 q-my-md"
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
import { onMounted } from 'vue';
import { useProjectStore } from 'src/stores/project-store';
import ProjectInfo from './ProjectInfo.vue';
import ProjectData from './ProjectData.vue';
import ProjectDeliverables from './ProjectDeliverables.vue';
import ProjectInvoicing from './ProjectInvoicing.vue';

const props = defineProps<{ projectId: string }>();

const store = useProjectStore();

onMounted(async () => {
  await store.fetchProject(Number(props.projectId));
  if (store.allCustomers.length === 0 || store.allEmployees.length === 0) {
    await store.fetchProjectLookups();
  }
});
</script>
