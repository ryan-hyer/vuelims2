<template>
  <q-page padding>
    <div class="page-header">Projects</div>
    <div class="page-subheader q-pa-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Project List" :to="{ name: 'project-list' }" />
        <q-breadcrumbs-el label="Add New Project" />
      </q-breadcrumbs>
    </div>

    <q-separator />

    <div class="q-pa-md">
      <q-form @submit.prevent="submitForm">
        <Transition name="fade" mode="out-in">
          <div v-if="!newProject.number">
            <q-select
              filled
              options-dense
              v-model="projectType"
              :options="jobTypes"
              label="Project Type"
              hint="Select the company this job belongs to"
            />

            <q-card bordered class="q-pa-sm q-mt-sm" v-if="projectType">
              <p>
                Next available number: <span class="text-bold">{{ newNumber }}</span
                >. Use this number for this project?
              </p>
              <q-btn
                color="green"
                label="Yes"
                icon="check"
                size="xs"
                @click="newProject.number = newNumber"
              />
              <q-btn
                color="red"
                label="No"
                icon="close"
                size="xs"
                class="q-ml-sm"
                @click="newProject.number = projectType.value"
              />
            </q-card>
          </div>
          <div v-else>
            <q-input
              filled
              v-model="newProject.number"
              label="Job Number"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Cannot be blank']"
            />
            <q-input
              filled
              v-model="newProject.startDate"
              mask="date"
              label="Start Date (yyyy/mm/dd)"
              lazy-rules
              :rules="[(val) => !!val || 'Cannot be blank']"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="newProject.startDate">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <q-select
              filled
              v-model="newProject.customerId"
              use-input
              options-dense
              emit-value
              map-options
              input-debounce="200"
              label="Customer"
              :options="filteredCustomers"
              option-value="id"
              option-label="name"
              @filter="filterCustomers"
              :rules="[(val) => !!val || 'Cannot be blank']"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">No results</q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-input
              filled
              type="textarea"
              v-model="newProject.description"
              label="Project Description"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Cannot be blank']"
            />

            <q-select
              filled
              v-model="newProject.assignedEmployeeId"
              emit-value
              map-options
              label="Assign Project To"
              :options="store.allEmployees"
              option-value="id"
              option-label="name"
              class="q-mb-md"
            />

            <div class="row justify-end q-gutter-sm q-mt-md">
              <q-btn flat label="Cancel" color="red" :to="{ name: 'project-list' }" />
              <q-btn
                type="submit"
                label="Create Project"
                color="primary"
                :loading="submitting"
                :disable="!newProject.number || !newProject.customerId || !newProject.description"
              />
            </div>
          </div>
        </Transition>
      </q-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { date } from 'quasar';
import type { QSelect } from 'quasar';
import { useRouter } from 'vue-router';
import { useProjectStore } from 'src/stores/project-store';

const router = useRouter();
const store = useProjectStore();

const newProject = ref({
  number: '',
  customerId: null as number | null,
  description: '',
  startDate: date.formatDate(Date.now(), 'YYYY/MM/DD'),
  assignedEmployeeId: null as number | null,
  purchaseOrder: '', // Do we REALLY need to record these? I have it just because it's on some of the Job Number Logs. Ask Alona.
});

const projectType = ref<{ label: string; value: string } | null>(null);
const submitting = ref(false);

const newNumber = computed<string>(() => {
  if (projectType.value) {
    return projectType.value.value.concat(
      new Date().toLocaleDateString('en', { year: '2-digit' }),
      nextNumbers[projectType.value.value as keyof typeof nextNumbers].toString().padStart(5, '0'),
    );
  }
  return '';
});

// TODO: This list should be in a database table, and editable
const jobTypes = [
  { label: '(A) Testing - Analytical', value: 'A' },
  { label: '(E) Testing - Electrical', value: 'E' },
  { label: '(F) Testing - Fire & Smoke', value: 'F' },
  { label: '(M) Testing - Mechanical', value: 'M' },
  { label: '(P) Testing - Plumbing', value: 'P' },
  { label: '(ST) Testing - Stone & Tile', value: 'ST' },
  { label: '(I) Inspection', value: 'I' },
  { label: '(LS) Certification', value: 'LS' },
];

// TODO: In production these sequence numbers come from the backend (max of each prefix + 1)
const nextNumbers = {
  A: 1367,
  E: 311,
  F: 6,
  M: 912,
  P: 1478,
  ST: 2314,
  I: 1306,
  LS: 851,
};

const filteredCustomers = ref(store.allCustomers);

const filterCustomers = (
  val: string,
  update: (callbackFn: () => void, afterFn?: (ref: QSelect) => void) => void,
) => {
  update(() => {
    const needle = val.toLowerCase();
    filteredCustomers.value = store.allCustomers.filter((c) =>
      c.name.toLowerCase().includes(needle),
    );
  });
};

const submitForm = async () => {
  submitting.value = true;
  const projectData = {
    number: newProject.value.number,
    customerId: newProject.value.customerId!,
    description: newProject.value.description,
    startDate: newProject.value.startDate,
    assignedEmployeeId: newProject.value.assignedEmployeeId,
    ...(newProject.value.purchaseOrder ? { purchaseOrder: newProject.value.purchaseOrder } : {}),
  };
  const newId = await store.addProject(projectData);
  submitting.value = false;
  void router.push({ name: 'project-detail', params: { projectId: newId } });
};

onMounted(async () => {
  if (store.allCustomers.length === 0 || store.allEmployees.length === 0) {
    await store.fetchProjectLookups();
  }
  filteredCustomers.value = store.allCustomers;
});
</script>
