<template>
  <q-page padding>
    <q-inner-loading :showing="loading" label="Loading employee data..." />
    <div class="page-header">Personnel</div>
    <div class="page-subheader q-pa-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Personnel List" :to="{ name: 'personnel-list' }" />
        <q-breadcrumbs-el :label="employee ? `${employee.firstName} ${employee.lastName}` : ''" />
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
      <q-tab name="identity" label="Employee Info" />
      <q-tab name="roles">
        <div class="row items-center q-gutter-xs no-wrap">
          <span>Roles &amp; Competency</span>
          <q-icon v-if="hasUnverifiedRoles" name="warning" color="warning" size="xs" />
        </div>
      </q-tab>
      <q-tab name="training" label="Training" />
      <q-tab name="reviews" label="Performance Reviews" />
      <q-tab name="docs">
        <div class="row items-center q-gutter-xs no-wrap">
          <span>Documentation</span>
          <q-icon v-if="hasNoDocs" name="warning" color="warning" size="xs" />
        </div>
      </q-tab>
    </q-tabs>
    <q-separator />

    <q-banner v-if="notFound" rounded class="bg-negative text-white q-ma-md">
      <template v-slot:avatar>
        <q-icon name="error" />
      </template>
      Employee record not found.
      <template v-slot:action>
        <q-btn flat label="Back to Personnel List" :to="{ name: 'personnel-list' }" />
      </template>
    </q-banner>
    <q-tab-panels v-else-if="employee" v-model="tab" animated>
      <q-tab-panel name="identity"> <PersonnelInfo /></q-tab-panel>
      <q-tab-panel name="roles"> <PersonnelRoles :employee="employee" /></q-tab-panel>
      <q-tab-panel name="training"> <PersonnelTraining :employee="employee" /></q-tab-panel>
      <q-tab-panel name="reviews"> <PersonnelReviews :employee="employee" /></q-tab-panel>
      <q-tab-panel name="docs"> <PersonnelDocs :employee="employee" /></q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Employee } from './models';
import { usePersonnelStore } from 'src/stores/personnel-store';
import PersonnelInfo from './PersonnelInfo.vue';
import PersonnelRoles from './PersonnelRoles.vue';
import PersonnelTraining from './PersonnelTraining.vue';
import PersonnelReviews from './PersonnelReviews.vue';
import PersonnelDocs from './PersonnelDocs.vue';

const store = usePersonnelStore();
const employee = ref<Employee>();
const loading = ref(true);
const notFound = ref(false);

const props = defineProps<{
  employeeId: string;
}>();

const tab = ref('identity');

const hasUnverifiedRoles = computed(() =>
  (employee.value?.assignedRoles ?? []).some(
    (ar) => !ar.qualifications_verified_date || !ar.probation_verified_date,
  ),
);

const hasNoDocs = computed(() => store.employeeDocs.length === 0);

onMounted(() => {
  store
    .fetchEmployee(parseInt(props.employeeId))
    .then(() => {
      employee.value = store.employee ?? undefined;
      if (!employee.value) notFound.value = true;
    })
    .catch((error) => {
      console.log('Error fetching employee:', error);
      notFound.value = true;
    })
    .finally(() => {
      loading.value = false;
    });
});
</script>
