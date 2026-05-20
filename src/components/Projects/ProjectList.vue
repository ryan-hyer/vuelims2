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
        <div class="full-width q-pa-sm">
          <div class="row wrap q-col-gutter-sm">
            <div class="col-12 col-sm">
              <q-input
                v-model="filter"
                placeholder="Search projects..."
                dense
                outlined
                clearable
                debounce="300"
                class="full-width"
              />
            </div>
            <div class="col-12 col-sm-auto">
              <q-select
                v-model="typeFilter"
                :options="typeOptions"
                label="Filter by Type"
                dense
                outlined
                clearable
                emit-value
                map-options
                options-dense
                class="full-width"
                style="min-width: 200px"
              />
            </div>
            <div class="col-12 col-sm-auto flex items-center">
              <q-toggle v-model="showCompleted" label="Show completed" />
            </div>
          </div>
        </div>
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
import { ref, computed, watch, onMounted } from 'vue';
import type { QTableColumn } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import { useProjectStore } from 'src/stores/project-store';

const route = useRoute();
const router = useRouter();
const store = useProjectStore();

const queryType = Array.isArray(route.query.type) ? route.query.type[0] : route.query.type;
const filter = ref((route.query.q as string) ?? '');
const showCompleted = ref(route.query.completed === '1');
const typeFilter = ref<string | null>(queryType ?? null);
const loading = ref(false);
const openSearch = ref(!!(filter.value || typeFilter.value || showCompleted.value));

const typeOptions = computed(() => [{ label: 'All Types', value: null }, ...store.projectTypes]);

const projects = computed(() => {
  let result = store.projects;
  if (!showCompleted.value) result = result.filter((p) => !p.completeDate);
  if (typeFilter.value) result = result.filter((p) => p.jobNumber.startsWith(typeFilter.value!));
  return result;
});

watch([filter, showCompleted, typeFilter], ([q, completed, type]) => {
  void router.replace({
    query: {
      ...(q ? { q } : {}),
      ...(completed ? { completed: '1' } : {}),
      ...(type ? { type } : {}),
    },
  });
});

onMounted(async () => {
  loading.value = true;
  await Promise.all([
    store.fetchProjects(),
    store.projectTypes.length === 0 ? store.fetchProjectLookups() : Promise.resolve(),
  ]);
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
