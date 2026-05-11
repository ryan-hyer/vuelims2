<template>
  <q-page padding>
    <div class="page-header row items-center no-wrap">
      <div class="col">Projects</div>
      <q-btn round color="primary" icon="search" class="q-mr-md" @click="openSearch = !openSearch">
        <q-tooltip>Search and Filter</q-tooltip>
      </q-btn>
      <q-btn round color="green" icon="add" class="q-mr-md" :to="{ name: 'project-new' }">
        <q-tooltip>Add New Project</q-tooltip>
      </q-btn>
    </div>
    <q-table
      flat
      bordered
      :rows="projects"
      :columns="columns"
      row-key="id"
      :loading="loading"
      :filter="filter"
      :pagination="{ sortBy: 'startDate' }"
      :table-row-class-fn="rowClassFn"
      @row-click="onRowClick"
    >
      <template v-slot:top v-if="openSearch">
        <q-toolbar>
          <q-input
            v-model="filter"
            placeholder="Search projects..."
            dense
            outlined
            clearable
            debounce="300"
            class="col"
          />
          <q-toggle v-model="showCompleted" label="Show completed" class="q-ml-md" />
        </q-toolbar>
      </template>
      <template v-slot:body-cell-description="props">
        <q-td :props="props" style="max-width: fit-content">
          {{ props.row.description?.substring(0, 30) }}
          <span v-if="(props.row.description?.length ?? 0) > 30">...</span>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { QTableColumn } from 'quasar';
import { useRouter } from 'vue-router';
import { useProjectStore } from 'src/stores/project-store';

const router = useRouter();
const store = useProjectStore();

const filter = ref('');
const loading = ref(false);
const showCompleted = ref(false);
const openSearch = ref(false);

const projects = computed(() =>
  showCompleted.value ? store.projects : store.projects.filter((p) => !p.completeDate),
);

onMounted(async () => {
  loading.value = true;
  await store.fetchProjects();
  loading.value = false;
});

const columns: QTableColumn[] = [
  {
    name: 'jobNumber',
    label: 'Job Number',
    field: 'jobNumber',
    align: 'left',
    sortable: true,
  },
  {
    name: 'startDate',
    label: 'Start Date',
    field: 'startDate',
    align: 'left',
    sortable: true,
    sort: (a: string, b: string, rowA: { jobNumber: string }, rowB: { jobNumber: string }) => {
      const byDate = a.localeCompare(b);
      return byDate !== 0
        ? byDate
        : rowA.jobNumber.localeCompare(rowB.jobNumber, undefined, {
            numeric: true,
            sensitivity: 'base',
          });
    },
  },
  {
    name: 'customer',
    label: 'Customer',
    field: 'customerName',
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

const onRowClick = (_evt: Event, row: { [key: string]: string }) => {
  void router.push({ name: 'project-detail', params: { projectId: row.id } });
};

const rowClassFn = (row: { [key: string]: string }) => {
  return row.completeDate ? 'text-weight-light text-italic' : '';
};
</script>
