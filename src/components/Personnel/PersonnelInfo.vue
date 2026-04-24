<template>
  <q-card bordered v-if="employee">
    <!-- VIEW MODE -->
    <template v-if="!editing">
      <q-list separator>
        <q-item>
          <q-item-section>
            <q-item-label overline>First Name</q-item-label>
            <q-item-label class="q-pl-md">{{ employee.firstName }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label overline>Last Name</q-item-label>
            <q-item-label class="q-pl-md">{{ employee.lastName }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label overline>Home Address</q-item-label>
            <q-item-label class="q-pl-md">
              <span v-html="employee.homeAddress"></span>
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label overline>Personal Phone (home or cell)</q-item-label>
            <q-item-label class="q-pl-md">{{ employee.homePhone }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label overline>Emergency Contact Name</q-item-label>
            <q-item-label class="q-pl-md">{{ employee.emergencyContact }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label overline>Emergency Contact Phone</q-item-label>
            <q-item-label class="q-pl-md">{{ employee.emergencyPhone }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label overline>Hire Date</q-item-label>
            <q-item-label class="q-pl-md">{{ employee.hireDate }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label overline>Termination Date</q-item-label>
            <q-item-label class="q-pl-md">{{
              employee.terminationDate || '(Still employed)'
            }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </template>

    <!-- EDIT MODE -->
    <template v-else>
      <q-card-section>
        <q-form class="q-gutter-sm">
          <q-input filled v-model="employee.firstName" label="First Name" />
          <q-input filled v-model="employee.lastName" label="Last Name" />
          <!-- TODO: Maybe a q-editor would be better here, to preserve line breaks -->
          <q-input
            filled
            type="textarea"
            rows="2"
            v-model="employee.homeAddress"
            label="Home Address"
          />
          <q-input
            filled
            type="tel"
            v-model="employee.homePhone"
            label="Personal Phone (home or cell)"
            mask="phone"
          />
          <q-input filled v-model="employee.emergencyContact" label="Emergency Contact Name" />
          <q-input
            filled
            type="tel"
            v-model="employee.emergencyPhone"
            label="Emergency Contact Phone"
            mask="phone"
          />
          <q-input filled v-model="employee.hireDate" mask="date" label="Hire Date (yyyy/mm/dd)">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover>
                  <q-date v-model="employee.hireDate" minimal>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input
            filled
            v-model="employee.terminationDate"
            mask="date"
            label="Termination Date (yyyy/mm/dd)"
            hint="Leave blank if still employed"
          >
            <template v-slot:append>
              <q-icon
                v-if="employee.terminationDate"
                name="clear"
                class="cursor-pointer"
                @click.stop="employee.terminationDate = null"
              />
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover>
                  <q-date v-model="employee.terminationDate" minimal>
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
        <q-btn color="primary" label="Save" :loading="saving" @click="saveEmployee" />
        <q-btn flat color="grey" label="Cancel" @click="cancelEdit" />
      </template>
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
/*
TODO:
- The dateLastUpdated should be displayed somewhere, to meet ISO requirements
*/
import { ref, watch } from 'vue';
import { usePersonnelStore } from 'src/stores/personnel-store';
import type { Employee } from './models';

const store = usePersonnelStore();
const saving = ref(false);
const editing = ref(false);

const employee = ref<Employee | null>(store.employee ? { ...store.employee } : null);

watch(
  () => store.employee,
  (val) => {
    if (val && !editing.value) employee.value = { ...val };
  },
);

const startEdit = () => {
  editing.value = true;
};

const cancelEdit = () => {
  if (store.employee) employee.value = { ...store.employee };
  editing.value = false;
};

const saveEmployee = async () => {
  if (!employee.value) return;
  saving.value = true;
  await store.updateEmployee({ ...employee.value });
  saving.value = false;
  editing.value = false;
};
</script>
