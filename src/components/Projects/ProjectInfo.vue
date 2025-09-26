<template>
  <q-list separator>
    <q-item>
      <q-item-section>
        <q-item-label overline>Job Number</q-item-label>
        <q-item-label class="q-pl-md">{{ project.number }}</q-item-label>
      </q-item-section>
      <q-item-section side bottom>
        <q-btn flat round color="grey" icon="edit">
          <q-popup-edit
            buttons
            v-model="project.number"
            auto-save
            v-slot="scope"
            anchor="center end"
            self="center start"
          >
            <q-input v-model="scope.value" dense autofocus @keyup.enter="scope.set" />
          </q-popup-edit>
        </q-btn>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-item-label overline>Start Date</q-item-label>
        <q-item-label class="q-pl-md">{{ project.startDate }}</q-item-label>
      </q-item-section>
      <q-item-section side bottom>
        <q-btn flat round color="grey" icon="edit">
          <q-popup-edit
            v-model="project.startDate"
            auto-save
            anchor="center end"
            self="center start"
          >
            <template v-slot="scope">
              <q-date v-model="scope.value" minimal flat>
                <div class="row items-center justify-center">
                  <q-btn label="Cancel" color="primary" flat @click="scope.cancel" v-close-popup />
                  <q-btn label="Set" color="primary" flat @click="scope.set" v-close-popup />
                </div>
              </q-date>
            </template>
          </q-popup-edit>
        </q-btn>
      </q-item-section>
    </q-item>
    <!-- TODO: This should be a dropdown with values taken from Customers -->
    <q-item>
      <q-item-section>
        <q-item-label overline>Customer</q-item-label>
        <q-item-label class="q-pl-md">{{ project.customer }}</q-item-label>
      </q-item-section>
      <q-item-section side bottom>
        <q-btn flat round color="grey" icon="edit">
          <q-popup-edit
            buttons
            v-model="project.customer"
            auto-save
            v-slot="scope"
            anchor="center end"
            self="center start"
          >
            <q-input v-model="scope.value" dense autofocus @keyup.enter="scope.set" />
          </q-popup-edit>
        </q-btn>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-item-label overline>Description</q-item-label>
        <q-item-label class="q-pl-md">
          <span v-html="project.description"></span>
        </q-item-label>
      </q-item-section>
      <q-item-section side bottom>
        <q-btn flat round color="grey" icon="edit">
          <q-popup-edit
            buttons
            v-model="project.description"
            auto-save
            v-slot="scope"
            anchor="center end"
            self="center start"
          >
            <q-editor v-model="scope.value" autofocus @keyup.enter.stop :toolbar="[]" />
          </q-popup-edit>
        </q-btn>
      </q-item-section>
    </q-item>
    <!-- TODO: This should be some kind of modal to select one or more standards (borrow from New Project form) -->
    <q-item>
      <q-item-section>
        <q-item-label overline>Standards</q-item-label>
        <q-item-label class="q-pl-md" v-for="standard in project.standards" :key="standard">
          {{ standard }}
        </q-item-label>
        <q-item-label class="q-pl-md" v-if="!project.standards || project.standards.length == 0"
          >None</q-item-label
        >
      </q-item-section>
      <q-item-section side bottom>
        <q-btn flat round color="grey" icon="edit">
          <q-popup-edit
            buttons
            v-model="project.standards"
            auto-save
            v-slot="scope"
            anchor="center end"
            self="center start"
          >
            <q-select
              filled
              v-model="scope.value"
              use-chips
              multiple
              emit-value
              options-dense
              label="Standards"
              :options="dummyStandardsFiltered"
              class="q-mb-md"
              style="min-width: 250px"
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
          </q-popup-edit>
        </q-btn>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-item-label overline>Purchase Order</q-item-label>
        <q-item-label class="q-pl-md">{{ project.purchaseOrder || 'None' }}</q-item-label>
      </q-item-section>
      <q-item-section side bottom>
        <q-btn flat round color="grey" icon="edit">
          <q-popup-edit
            buttons
            v-model="project.purchaseOrder"
            auto-save
            v-slot="scope"
            anchor="center end"
            self="center start"
          >
            <q-input v-model="scope.value" dense autofocus @keyup.enter="scope.set" />
          </q-popup-edit>
        </q-btn>
      </q-item-section>
    </q-item>
    <!--
        TODO: This should be a dropdown with values taken from Personnel
        The list should be filtered to only show employees supervised by the current user, or limited to admins only
        In fact, most of the app should be like that in the end
        -->
    <q-item>
      <q-item-section>
        <q-item-label overline>Assigned To</q-item-label>
        <q-item-label class="q-pl-md">{{ project.assignedTo || 'None' }}</q-item-label>
      </q-item-section>
      <q-item-section side bottom>
        <q-btn flat round color="grey" icon="edit">
          <q-popup-edit
            buttons
            v-model="project.assignedTo"
            auto-save
            v-slot="scope"
            anchor="center end"
            self="center start"
          >
            <q-input v-model="scope.value" dense autofocus @keyup.enter="scope.set" />
          </q-popup-edit>
        </q-btn>
      </q-item-section>
    </q-item>
    <!-- TODO: I might decide to use other means of determining project completion (such as uploading a report or something) -->
    <q-item>
      <q-item-section>
        <q-item-label overline>Completed Date</q-item-label>
        <q-item-label class="q-pl-md">{{ project.completeDate || 'Not Complete' }}</q-item-label>
      </q-item-section>
      <q-item-section side bottom>
        <q-btn flat round color="grey" icon="edit">
          <q-popup-edit
            v-model="project.completeDate"
            auto-save
            anchor="center end"
            self="center start"
          >
            <template v-slot="scope">
              <q-date v-model="scope.value" minimal flat>
                <div class="row items-center justify-center">
                  <q-btn label="Cancel" color="primary" flat @click="scope.cancel" v-close-popup />
                  <q-btn label="Set" color="primary" flat @click="scope.set" v-close-popup />
                </div>
              </q-date>
            </template>
          </q-popup-edit>
        </q-btn>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-item-label overline>Supporting Documents</q-item-label>
        <q-item-label class="q-pl-md"
          >List of docs here, linked for viewing, and some option to delete or add
          more</q-item-label
        >
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Project } from './models';

const project = ref<Project>({
  id: 1,
  number: 'LS2500311',
  customer: 'Alpha Systems',
  description: 'Listing Addition',
  startDate: '2023/10/01',
  purchaseOrder: '',
  assignedTo: 'Ryan Hyer',
  completeDate: '',
});

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

const filterStandardsInput = ref('');

const dummyStandardsFiltered = computed(() => {
  const needle: string = filterStandardsInput.value || '';
  return dummyStandards.filter((v) => v.label.toLowerCase().indexOf(needle.toLowerCase()) > -1);
});
</script>
