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
        <q-stepper
          alternative-labels
          active-icon="none"
          v-model="step"
          ref="stepper"
          color="primary"
          animated
        >
          <q-step :name="1" prefix="1" title="Project Type" :done="newProject.number != ''">
            <q-select filled v-model="projectType" :options="jobTypes" label="Project Type" />

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
                @click="
                  newProject.number = newNumber;
                  step = 2;
                "
              />
              <q-btn
                color="red"
                label="No"
                icon="close"
                size="xs"
                class="q-ml-sm"
                @click="
                  newProject.number = projectType.value;
                  step = 2;
                "
              />
            </q-card>
          </q-step>
          <q-step :name="2" title="Basic Info" prefix="2" :done="step > 2">
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
              fill-input
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
          </q-step>

          <q-step :name="3" prefix="3" title="Additional Info" :done="step > 3">
            <div class="text-caption bg-light-blue-2 q-mb-md q-pa-sm">
              {{ newProject.number }} - {{ customerName }}
            </div>
            <!-- Which fields appear here will depend on the project type -->
            <q-select
              filled
              v-model="newProject.standards"
              use-chips
              multiple
              emit-value
              label="Standards"
              :options="dummyStandardsFiltered"
              class="q-mb-md"
            >
              <template v-slot:before-options>
                <q-input
                  outlined
                  clearable
                  dense
                  v-model="filterStandardsInput"
                  label="Search Standards..."
                  debounce="200"
                />
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> No results </q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-input
              filled
              v-model="newProject.purchaseOrder"
              label="Customer PO Number"
              class="q-mb-md"
            />
          </q-step>

          <q-step :name="4" prefix="4" title="Assignment">
            <div class="text-caption bg-light-blue-2 q-mb-md q-pa-sm">
              {{ newProject.number }} - {{ customerName }}
            </div>
            <q-select
              filled
              v-model="newProject.assignedTo"
              label="Assign Project To"
              :options="dummyEmployees"
              option-value="employeeId"
              option-label="name"
              class="q-mb-md"
            />

            <q-separator />
          </q-step>
          <template v-slot:navigation>
            <q-stepper-navigation>
              <q-btn
                v-if="step > 1"
                @click="handleNext"
                color="primary"
                :label="step === 4 ? 'Finish' : 'Next'"
                :disable="step == 2 && (!newProject.customer || !newProject.description)"
              >
                <q-tooltip
                  anchor="top left"
                  self="bottom left"
                  v-if="step == 2 && (!newProject.customer || !newProject.description)"
                  >Please enter required information before proceeding</q-tooltip
                >
              </q-btn>
              <q-btn
                v-if="step > 1"
                flat
                color="primary"
                @click="($refs.stepper as QStepper).previous()"
                label="Back"
                class="q-ml-sm"
              />
              <q-btn flat color="red" :to="{ name: 'project-list' }" label="Cancel" />
            </q-stepper-navigation>
          </template>
        </q-stepper>
      </q-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, useTemplateRef } from 'vue';
import { date } from 'quasar';
import type { Project } from './models';
import type { QSelect, QStepper } from 'quasar';
import { useRouter } from 'vue-router';
const router = useRouter();

const step = ref(1);
const stepper = useTemplateRef('stepper');

const handleNext = () => {
  if (step.value == 4) {
    // submit the form
    console.log('Form submitted: ', newProject.value);
    /* eslint-disable-next-line @typescript-eslint/no-floating-promises */
    router.push({ name: 'project-list', query: { flash: 1 } });
  } else {
    // progress to the next step
    step.value += 1;
  }
};

const newProject = ref<Project>({
  id: Date.now(),
  number: '',
  customer: '',
  description: '',
  startDate: date.formatDate(Date.now(), 'YYYY/MM/DD'),
  standards: [],
  purchaseOrder: '',
  assignedTo: '',
  completeDate: '',
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

const customerName = computed<string>(() => {
  if (newProject.value.customer) {
    //return JSON.parse(newProject.value.customer).name;
    return newProject.value.customer;
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

const filterStandardsInput = ref(null);

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

const dummyStandards = [
  {
    value: 'ANSI Z124 / CSA B45.5 (2017)',
    label: 'ANSI Z124 / CSA B45.5 (2017) - Plastic plumbing fixtures',
  },
  {
    value: 'ASSE 1051 (2009)',
    label:
      'ASSE 1051 (2009) - Individual and Branch Type Air Admittance Valves for Sanitary Drainage Systems',
  },
  {
    value: 'CSA C22.2 No. 107.1 (2021)',
    label: 'CSA C22.2 No. 107.1 (2021) - Power conversion equipment',
  },
  {
    value: 'IAPMO TS 30 (1997e1)',
    label: 'IAPMO TS 30 (1997e1) - Termination valves for use in recreational vehicles',
  },
  {
    value: 'UL 174 (11th)',
    label: 'UL 174 (11th) - Household Electric Storage Tank Water Heaters',
  },
];

const dummyCustomersRef = ref(dummyCustomers);

const dummyStandardsFiltered = computed(() => {
  const needle: string = filterStandardsInput.value || '';
  return dummyStandards.filter((v) => v.label.toLowerCase().indexOf(needle.toLowerCase()) > -1);
});

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

const submitForm = () => {
  console.log('New project created:', newProject.value);
};
</script>
