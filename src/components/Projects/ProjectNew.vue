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
      <q-form @submit.prevent="submitForm" class="q-gutter-sm">
        <q-select
          filled
          v-model="projectType"
          :options="jobTypes"
          label="Project Type"
          v-if="!newProject.number"
        />

        <q-card bordered class="q-pa-sm" v-if="projectType && !newProject.number">
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

        <div v-if="newProject.number">
          <q-input
            filled
            v-model="newProject.number"
            label="Job Number"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Cannot be blank']"
          />

          <q-select
            filled
            v-model="newProject.customer"
            use-input
            hide-selected
            fill-input
            input-debounce="200"
            label="Customer"
            :options="dummyCustomersRef"
            @filter="filterCustomers"
            class="q-mb-md"
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

          <q-input
            filled
            v-model="newProject.startDate"
            label="Project Start Date (yyyy/mm/dd)"
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

          <q-input
            filled
            v-model="newProject.assignedTo"
            label="Assign Project To"
            lazy-rules
            :rules="[(val) => !!val || 'Cannot be blank']"
          />

          <q-field
            filled
            label="Upload Supporting Documents (application forms, shipping documents, etc.)"
            stack-label
            style="padding-bottom: 20px"
          >
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
          <q-separator />
          <div>
            <q-btn label="Create Project" type="submit" color="teal" />
            <q-btn label="Cancel" flat class="q-ml-sm" :to="{ name: 'project-list' }" />
          </div>
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { date } from 'quasar';
import type { Project } from './models';
import type { QSelect } from 'quasar';

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

const submitForm = () => {
  console.log('New project created:', newProject.value);
};
</script>
