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
            <!-- TODO: Need to check job number uniqueness before allowing form submit -->
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
              label="Start Date (yyyy/mm/dd)"
              lazy-rules
              :rules="[(val) => !!val || 'Cannot be blank']"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qDateProxy"
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
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
              v-model="newProject.customer"
              use-input
              options-dense
              input-debounce="200"
              label="Customer"
              :options="dummyCustomersRef"
              @filter="filterCustomers"
              :rules="[(val) => !!val || 'Cannot be blank']"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> No results </q-item-section>
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
              v-model="newProject.assignedTo"
              label="Assign Project To"
              :options="dummyEmployees"
              option-value="employeeId"
              option-label="name"
              class="q-mb-md"
            />

            <q-field filled label="Supporting Documents (optional)" stack-label>
              <!-- Might be cleaner to do the actual upload along with form submit, and just stage files here -->
              <template v-slot:control>
                <q-uploader
                  flat
                  bordered
                  multiple
                  label="Select file(s) for upload, press Upload when ready"
                  url="http://localhost:4444/upload"
                  style="width: 100%"
                />
              </template>
            </q-field>

            <div class="row justify-end q-gutter-sm q-mt-md">
              <q-btn flat label="Cancel" color="red" :to="{ name: 'project-list' }" />
              <q-btn
                type="submit"
                label="Create Project"
                color="primary"
                :disable="!newProject.number || !newProject.customer || !newProject.description"
              />
            </div>
          </div>
        </Transition>
      </q-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { date } from 'quasar';
import type { Project } from './models';
import type { QSelect } from 'quasar';
import { useRouter } from 'vue-router';
const router = useRouter();

const newProject = ref<Project>({
  id: Date.now(),
  number: '',
  customer: '',
  description: '',
  startDate: date.formatDate(Date.now(), 'YYYY/MM/DD'),
  assignedTo: '',
});

const newNumber = computed<string>(() => {
  if (projectType.value) {
    return projectType.value.value.concat(
      new Date().toLocaleDateString('en', { year: '2-digit' }),
      nextNumbers[projectType.value.value as keyof typeof nextNumbers].toString().padStart(5, '0'),
    );
  }
  return '';
});

const projectType = ref();

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

const filterCustomers = (
  val: string,
  update: (callbackFn: () => void, afterFn?: (ref: QSelect) => void) => void,
) => {
  update(() => {
    const needle: string = val.toLowerCase();
    dummyCustomersRef.value = dummyCustomers.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1,
    );
  });
};

const submitForm = () => {
  console.log('Form submitted: ', newProject.value);
  /* eslint-disable-next-line @typescript-eslint/no-floating-promises */
  router.push({ name: 'project-list', query: { flash: 1 } });
};

//
// In production, everything below here should come from the backend
//
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

const dummyCustomers = [
  { value: 1, label: 'Alpha Systems, LLC' },
  { value: 2, label: 'Camco Manufacturing, LLC' },
  { value: 3, label: 'Elwell Corporation' },
  { value: 4, label: 'Expion360' },
  { value: 5, label: 'Icon Technologies Limited' },
  { value: 6, label: 'N.P.S. Plastics LLC' },
  { value: 7, label: 'Rixens Enterprises' },
  { value: 8, label: 'Seaflo Marine & RV North America, LLC' },
  { value: 9, label: 'Valterra Products Inc.' },
  { value: 10, label: 'Winnebago Industries' },
];

const dummyCustomersRef = ref(dummyCustomers);

const dummyEmployees = ref([
  {
    employeeId: 1,
    name: 'Merrill Gee',
  },
  { employeeId: 2, name: 'Ryan Hyer' },
  {
    employeeId: 3,
    name: 'Alona MacGregor',
  },
  {
    employeeId: 4,
    name: 'Matthew MacGregor',
  },
  {
    employeeId: 5,
    name: 'Frank Strickland',
  },
]);
</script>
