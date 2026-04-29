<template>
  <div v-if="!store.project" class="text-grey text-italic">Loading project...</div>
  <div v-else-if="project">

    <!-- VIEW MODE -->
    <template v-if="!editing">
      <q-list separator>
        <q-item>
          <q-item-section>
            <q-item-label overline>Job Number</q-item-label>
            <q-item-label class="q-pl-md">{{ project.number }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label overline>Start Date</q-item-label>
            <q-item-label class="q-pl-md">{{ project.startDate }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label overline>Customer</q-item-label>
            <q-item-label class="q-pl-md">{{ customerName }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label overline>Description</q-item-label>
            <q-item-label class="q-pl-md" style="white-space: pre-line">{{ project.description }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label overline>Standards</q-item-label>
            <q-item-label class="q-pl-md" v-for="s in project.standards" :key="s">{{ s }}</q-item-label>
            <q-item-label class="q-pl-md" v-if="!project.standards?.length">None</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label overline>Purchase Order</q-item-label>
            <q-item-label class="q-pl-md">{{ project.purchaseOrder || 'None' }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label overline>Assigned To</q-item-label>
            <q-item-label class="q-pl-md">{{ assignedEmployeeName }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label overline>Completed Date</q-item-label>
            <q-item-label class="q-pl-md">{{ project.completeDate || 'Not Complete' }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </template>

    <!-- EDIT MODE -->
    <template v-else>
      <q-card-section>
        <q-form class="q-gutter-sm">
          <q-input filled v-model="project.number" label="Job Number" />
          <q-input filled v-model="project.startDate" mask="date" label="Start Date (yyyy/mm/dd)">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover>
                  <q-date v-model="project.startDate" minimal>
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
            v-model="project.customerId"
            :options="store.allCustomers"
            option-value="id"
            option-label="name"
            emit-value
            map-options
            label="Customer"
          />
          <q-input filled type="textarea" rows="3" v-model="project.description" label="Description" />
          <!-- TODO: Eventually we'll want a database table for standards, and a place to add/edit/delete them. For now, hardcoding a list of common standards to choose from. -->
          <q-select
            filled
            v-model="project.standards"
            use-chips
            use-input
            multiple
            emit-value
            map-options
            options-dense
            label="Standards"
            :options="standardsFiltered"
            option-value="value"
            option-label="value"
            input-debounce="200"
            @filter="filterStandards"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ scope.opt.value }}</q-item-label>
                  <q-item-label caption lines="2">{{ scope.opt.title }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-input filled v-model="project.purchaseOrder" label="Purchase Order" />
          <q-select
            filled
            v-model="project.assignedEmployeeId"
            :options="store.allEmployees"
            option-value="id"
            option-label="name"
            emit-value
            map-options
            label="Assigned To"
          />
          <q-input
            filled
            v-model="project.completeDate"
            mask="date"
            label="Completed Date (yyyy/mm/dd)"
            hint="Leave blank if not yet complete"
          >
            <template v-slot:append>
              <q-icon
                v-if="project.completeDate"
                name="clear"
                class="cursor-pointer"
                @click.stop="clearCompleteDate"
              />
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover>
                  <q-date v-model="project.completeDate" minimal>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-form>
      </q-card-section>
    </template>

    <q-card-actions class="q-mt-sm">
      <template v-if="!editing">
        <q-btn color="primary" icon="edit" label="Edit" @click="startEdit" />
      </template>
      <template v-else>
        <q-btn color="primary" label="Save" :loading="saving" @click="saveProject" />
        <q-btn flat color="grey" label="Cancel" @click="cancelEdit" />
      </template>
    </q-card-actions>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useProjectStore } from 'src/stores/project-store';
import type { Project, ProjectWithDetails } from './models';

const store = useProjectStore();
const saving = ref(false);
const editing = ref(false);

const project = ref<ProjectWithDetails | null>(store.project ? { ...store.project } : null);

watch(
  () => store.project,
  (val) => {
    if (val && !editing.value) project.value = { ...val };
  },
);

const customerName = computed(
  () => store.allCustomers.find((c) => c.id === project.value?.customerId)?.name ?? 'Unknown',
);

const assignedEmployeeName = computed(
  () => store.allEmployees.find((e) => e.id === project.value?.assignedEmployeeId)?.name ?? 'None',
);

const standardsFiltered = ref(store.allStandards);

function filterStandards(val: string, update: (fn: () => void) => void) {
  update(() => {
    const needle = val.toLowerCase();
    standardsFiltered.value = needle
      ? store.allStandards.filter((s) => s.label.toLowerCase().includes(needle))
      : store.allStandards;
  });
}

const clearCompleteDate = () => {
  if (project.value) delete project.value.completeDate;
};

const startEdit = () => {
  standardsFiltered.value = store.allStandards;
  editing.value = true;
};

const cancelEdit = () => {
  if (store.project) project.value = { ...store.project };
  editing.value = false;
};

const saveProject = async () => {
  if (!project.value) return;
  saving.value = true;
  await store.updateProject({ ...project.value } as Project);
  saving.value = false;
  editing.value = false;
};
</script>
