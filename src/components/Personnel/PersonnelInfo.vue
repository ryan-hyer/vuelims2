<template>
  <q-card bordered v-if="employee">
    <q-list separator>
      <q-item>
        <q-item-section>
          <q-item-label overline>First Name</q-item-label>
          <q-item-label class="q-pl-md">{{ employee.firstName }}</q-item-label>
        </q-item-section>
        <q-item-section side bottom>
          <q-btn flat round color="grey" icon="edit">
            <q-popup-edit
              buttons
              v-model="employee.firstName"
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
          <q-item-label overline>Last Name</q-item-label>
          <q-item-label class="q-pl-md">{{ employee.lastName }}</q-item-label>
        </q-item-section>
        <q-item-section side bottom>
          <q-btn flat round color="grey" icon="edit">
            <q-popup-edit
              buttons
              v-model="employee.lastName"
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
          <q-item-label overline>Home Address</q-item-label>
          <q-item-label class="q-pl-md">
            <span v-html="employee.homeAddress"></span>
          </q-item-label>
        </q-item-section>
        <q-item-section side bottom>
          <q-btn flat round color="grey" icon="edit">
            <q-popup-edit
              buttons
              v-model="employee.homeAddress"
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
      <q-item>
        <q-item-section>
          <q-item-label overline>Personal Phone (home or cell)</q-item-label>
          <q-item-label class="q-pl-md">
            {{ employee.homePhone }}
          </q-item-label>
        </q-item-section>
        <q-item-section side bottom>
          <q-btn flat round color="grey" icon="edit">
            <q-popup-edit
              buttons
              v-model="employee.homePhone"
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
          <q-item-label overline>Emergency Contact Name</q-item-label>
          <q-item-label class="q-pl-md">
            {{ employee.emergencyContact }}
          </q-item-label>
        </q-item-section>
        <q-item-section side bottom>
          <q-btn flat round color="grey" icon="edit">
            <q-popup-edit
              buttons
              v-model="employee.emergencyContact"
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
          <q-item-label overline>Emergency Contact Phone</q-item-label>
          <q-item-label class="q-pl-md">
            {{ employee.emergencyPhone }}
          </q-item-label>
        </q-item-section>
        <q-item-section side bottom>
          <q-btn flat round color="grey" icon="edit">
            <q-popup-edit
              buttons
              v-model="employee.emergencyPhone"
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
          <q-item-label overline>Hire Date</q-item-label>
          <q-item-label class="q-pl-md">{{ employee.hireDate }}</q-item-label>
        </q-item-section>
        <q-item-section side bottom>
          <q-btn flat round color="grey" icon="edit">
            <q-popup-edit
              v-model="employee.hireDate"
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

      <!-- TODO: Expand the next two sections to either display the "not found" label and upload field, or if the file exists, an icon to view it (and maybe overwrite it with a new file?) -->
      <q-expansion-item header-class="bg-red-1">
        <template v-slot:header>
          <q-item-section>
            <q-item-label overline>Resume / CV</q-item-label>
            <q-item-label caption class="q-pl-md text-weight-bold text-red">
              File not found! Expand to upload.
            </q-item-label>
          </q-item-section>
        </template>
        <q-separator />
        <q-card>
          <q-card-section>
            <div class="row items-center q-gutter-sm q-pa-sm">
              <q-icon name="attach_file" size="sm" :color="resumeFile ? 'teal' : 'grey'" />
              <div class="col">
                <div class="text-body2">{{ resumeFile ? resumeFile.name : 'No file selected' }}</div>
                <div class="text-caption text-grey">PDF files only</div>
              </div>
              <q-btn outline color="primary" label="Choose File" @click="resumeInputRef?.click()" />
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item header-class="bg-red-1">
        <template v-slot:header>
          <q-item-section>
            <q-item-label overline>Personnel Agreement</q-item-label>
            <q-item-label caption class="q-pl-md text-weight-bold text-red">
              File not found! Expand to upload.
            </q-item-label>
          </q-item-section>
        </template>
        <q-separator />
        <q-card>
          <q-card-section>
            <div class="row items-center q-gutter-sm q-pa-sm">
              <q-icon name="attach_file" size="sm" :color="agreementFile ? 'teal' : 'grey'" />
              <div class="col">
                <div class="text-body2">{{ agreementFile ? agreementFile.name : 'No file selected' }}</div>
                <div class="text-caption text-grey">PDF files only</div>
              </div>
              <q-btn outline color="primary" label="Choose File" @click="agreementInputRef?.click()" />
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
      <input ref="resumeInputRef" type="file" accept=".pdf" style="display: none" @change="onResumeSelected" />
      <input ref="agreementInputRef" type="file" accept=".pdf" style="display: none" @change="onAgreementSelected" />
      <q-item>
        <q-item-section>
          <q-item-label overline>Termination Date</q-item-label>
          <q-item-label class="q-pl-md">
            {{ employee.terminationDate || '(Still employed)' }}
          </q-item-label>
        </q-item-section>
        <q-item-section side bottom>
          <q-btn flat round color="grey" icon="edit">
            <q-popup-edit
              v-model="employee.terminationDate"
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
                    <q-btn
                      label="Clear"
                      color="primary"
                      flat
                      @click="scope.value = null"
                      v-close-popup
                    />
                  </div>
                </q-date>
              </template>
            </q-popup-edit>
          </q-btn>
        </q-item-section>
      </q-item>
    </q-list>
    <q-card-actions class="q-mt-sm">
      <q-btn color="primary" label="Save Changes" :loading="saving" @click="saveEmployee" />
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

const resumeInputRef = ref<HTMLInputElement | null>(null);
const resumeFile = ref<File | null>(null);
const agreementInputRef = ref<HTMLInputElement | null>(null);
const agreementFile = ref<File | null>(null);

const onResumeSelected = (e: Event) => {
  resumeFile.value = (e.target as HTMLInputElement).files?.[0] ?? null;
};
const onAgreementSelected = (e: Event) => {
  agreementFile.value = (e.target as HTMLInputElement).files?.[0] ?? null;
};

const store = usePersonnelStore();
const saving = ref(false);

const employee = ref<Employee | null>(store.employee ? { ...store.employee } : null);

watch(
  () => store.employee,
  (val) => {
    if (val) employee.value = { ...val };
  },
);

const saveEmployee = async () => {
  if (!employee.value) return;
  saving.value = true;
  await store.updateEmployee({ ...employee.value });
  saving.value = false;
};
</script>
