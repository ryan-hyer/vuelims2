<template>
  <div v-if="!store.project" class="text-grey text-italic">Loading project...</div>
  <div v-else-if="project">
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
                    <q-btn
                      label="Cancel"
                      color="primary"
                      flat
                      @click="scope.cancel"
                      v-close-popup
                    />
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
          <q-item-label overline>Customer</q-item-label>
          <q-item-label class="q-pl-md">{{ customerName }}</q-item-label>
        </q-item-section>
        <q-item-section side bottom>
          <q-btn flat round color="grey" icon="edit">
            <q-popup-edit
              buttons
              v-model="project.customerId"
              auto-save
              v-slot="scope"
              anchor="center end"
              self="center start"
            >
              <q-select
                v-model="scope.value"
                :options="store.allCustomers"
                option-value="id"
                option-label="name"
                emit-value
                map-options
                dense
                autofocus
                style="min-width: 220px"
              />
            </q-popup-edit>
          </q-btn>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label overline>Description</q-item-label>
          <q-item-label class="q-pl-md" style="white-space: pre-line">{{
            project.description
          }}</q-item-label>
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
              <q-input
                v-model="scope.value"
                type="textarea"
                dense
                autofocus
                autogrow
                style="min-width: 300px"
              />
            </q-popup-edit>
          </q-btn>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label overline>Standards</q-item-label>
          <q-item-label class="q-pl-md" v-for="s in project.standards" :key="s">{{
            s
          }}</q-item-label>
          <q-item-label class="q-pl-md" v-if="!project.standards?.length">None</q-item-label>
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
              @hide="standardsFilter = ''"
            >
              <q-select
                filled
                v-model="scope.value"
                use-chips
                multiple
                emit-value
                options-dense
                label="Standards"
                :options="standardsFiltered"
                style="min-width: 300px"
              >
                <template v-slot:before-options>
                  <q-input
                    outlined
                    clearable
                    dense
                    v-model="standardsFilter"
                    label="Search..."
                    debounce="200"
                  />
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

      <q-item>
        <q-item-section>
          <q-item-label overline>Assigned To</q-item-label>
          <q-item-label class="q-pl-md">{{ assignedEmployeeName }}</q-item-label>
        </q-item-section>
        <q-item-section side bottom>
          <q-btn flat round color="grey" icon="edit">
            <q-popup-edit
              buttons
              v-model="project.assignedEmployeeId"
              auto-save
              v-slot="scope"
              anchor="center end"
              self="center start"
            >
              <q-select
                v-model="scope.value"
                :options="store.allEmployees"
                option-value="id"
                option-label="name"
                emit-value
                map-options
                dense
                autofocus
                style="min-width: 180px"
              />
            </q-popup-edit>
          </q-btn>
        </q-item-section>
      </q-item>

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
                    <q-btn
                      label="Cancel"
                      color="primary"
                      flat
                      @click="scope.cancel"
                      v-close-popup
                    />
                    <q-btn label="Set" color="primary" flat @click="scope.set" v-close-popup />
                  </div>
                </q-date>
              </template>
            </q-popup-edit>
          </q-btn>
        </q-item-section>
      </q-item>
    </q-list>

    <!-- TODO: Why is this button here? I thought each field individually updated and saved automatically? -->
    <q-card-actions class="q-mt-sm">
      <q-btn color="primary" label="Save Changes" :loading="saving" @click="saveProject" />
    </q-card-actions>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useProjectStore } from 'src/stores/project-store';
import type { Project, ProjectWithDetails } from './models';

const store = useProjectStore();
const saving = ref(false);

const project = ref<ProjectWithDetails | null>(store.project ? { ...store.project } : null);

watch(
  () => store.project,
  (val) => {
    if (val) project.value = { ...val };
  },
);

const customerName = computed(
  () => store.allCustomers.find((c) => c.id === project.value?.customerId)?.name ?? 'Unknown',
);

const assignedEmployeeName = computed(
  () => store.allEmployees.find((e) => e.id === project.value?.assignedEmployeeId)?.name ?? 'None',
);

// TODO: Eventually we'll want a database table for standards, and a place to add/edit/delete them. For now, hardcoding a list of common standards to choose from.
const standardsList = [
  'ANSI Z124 / CSA B45.5 (2017)',
  'ASSE 1051 (2009)',
  'CSA C22.2 No. 107.1 (2021)',
  'IAPMO TS 30 (1997e1)',
  'UL 174 (11th)',
];

const standardsFilter = ref('');

const standardsFiltered = computed(() => {
  const needle = standardsFilter.value.toLowerCase();
  return standardsList.filter((s) => s.toLowerCase().includes(needle));
});

const saveProject = async () => {
  if (!project.value) return;
  saving.value = true;
  await store.updateProject({ ...project.value } as Project);
  saving.value = false;
};
</script>
