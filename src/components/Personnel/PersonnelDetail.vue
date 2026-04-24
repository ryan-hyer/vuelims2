<template>
  <q-page padding>
    <q-inner-loading :showing="!employee" label="Loading employee data..." />
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
      <q-tab name="roles" label="Roles & Competency" />
      <q-tab name="training" label="Training" />
      <q-tab name="reviews" label="Performance Reviews" />
      <q-tab name="docs" label="Documentation" />
    </q-tabs>
    <q-separator />

    <q-tab-panels v-if="employee" v-model="tab" animated>
      <q-tab-panel name="identity"> <PersonnelInfo /></q-tab-panel>
      <q-tab-panel name="roles"> <PersonnelRoles :employee="employee" /></q-tab-panel>
      <q-tab-panel name="training"> <PersonnelTraining :employee="employee" /></q-tab-panel>
      <q-tab-panel name="reviews"> <PersonnelReviews :employee="employee" /></q-tab-panel>
      <q-tab-panel name="docs"> <PersonnelDocs :employee="employee" /></q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Employee } from './models';
import { usePersonnelStore } from 'src/stores/personnel-store';
import PersonnelInfo from './PersonnelInfo.vue';
import PersonnelRoles from './PersonnelRoles.vue';
import PersonnelTraining from './PersonnelTraining.vue';
import PersonnelReviews from './PersonnelReviews.vue';
import PersonnelDocs from './PersonnelDocs.vue';

const store = usePersonnelStore();
const employee = ref<Employee>();

const props = defineProps<{
  employeeId: string;
}>();

const tab = ref('identity');

onMounted(() => {
  store
    .fetchEmployee(parseInt(props.employeeId))
    .then(() => {
      employee.value = store.employee ?? undefined;
    })
    .catch((error) => {
      console.log('Error fetching employee:', error);
    });
});
</script>
