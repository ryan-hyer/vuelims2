<template>
  <q-page padding>
    <div class="page-header">Projects</div>
    <q-table
      flat
      bordered
      dense
      :rows="projects"
      :columns="columns"
      row-key="id"
      :loading="loading"
      :filter="filter"
      :table-row-class-fn="rowClassFn"
      @row-click="onRowClick"
    >
      <template v-slot:top>
        <q-toolbar>
          <q-input v-model="filter" placeholder="Search projects..." dense outlined clearable />
          <q-space />
          <q-btn round color="green" icon="add" class="q-ma-sm" :to="{ name: 'project-new' }">
            <q-tooltip>Add New Project</q-tooltip>
          </q-btn>
        </q-toolbar>
        <div class="text-caption text-italic">Click a row to view more details</div>
      </template>
      <template v-slot:body-cell-description="props">
        <q-td :props="props" style="max-width: fit-content">
          {{ props.row.description.substring(0, 30) }}
          <span v-if="props.row.description.length > 30">...</span>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
//import type { Project } from './models';
import type { QTableColumn } from 'quasar';
import { useRouter, useRoute } from 'vue-router';
import { useProjectStore } from 'src/stores/store';

const router = useRouter();
const route = useRoute();
const store = useProjectStore();

const projects = ref([]);
const filter = ref('');
const loading = ref(false);

onMounted(() => {
  loading.value = true;
  store
    .fetchProjects()
    .then(() => {
      projects.value = store.projects;
      loading.value = false;
    })
    .catch(() => {
      console.log('Houston, we have a problem');
      loading.value = false;
    });
});

const columns: QTableColumn[] = [
  {
    name: 'jobNumber',
    label: 'Job Number',
    field: 'number',
    align: 'left',
    sortable: true,
  },
  {
    name: 'startDate',
    label: 'Start Date',
    field: 'startDate',
    align: 'left',
    sortable: true,
  },
  {
    name: 'customer',
    label: 'Customer',
    field: 'customer',
    align: 'left',
  },
  {
    name: 'description',
    label: 'Description',
    field: 'description',
    align: 'left',
  },
  {
    name: 'completeDate',
    label: 'Completed Date',
    field: 'completeDate',
    align: 'left',
    sortable: true,
  },
];

const onRowClick = (evt: Event, row: { [key: string]: string }) => {
  void router.push({ name: 'project-detail', params: { projectId: row.id } });
};

const rowClassFn = (row: { [key: string]: string }) => {
  // Make a newly added row flash yellow for a couple of seconds
  // TODO: Make this actually work; for some reason the background-color property doesn't work on tr, even though it does on td?
  if (route.query.flash && row.id == route.query.flash) {
    setTimeout(() => {
      void router.replace({ name: 'project-list', query: {} });
    }, 2000);
    return 'flash';
  }
  return row.completeDate ? 'text-weight-light text-italic' : '';
};
</script>

<style scoped>
@keyframes highlight-new {
  from {
    background-color: #fafa5c;
  }
  to {
    background-color: inherit;
  }
}

.flash {
  animation: highlight-new 2s ease;
}
</style>
