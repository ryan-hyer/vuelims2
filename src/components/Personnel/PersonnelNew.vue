<template>
  <q-page padding>
    <div class="page-header">Personnel</div>
    <div class="page-subheader q-pa-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Personnel List" :to="{ name: 'personnel-list' }" />
        <q-breadcrumbs-el label="Add New Employee" />
      </q-breadcrumbs>
    </div>

    <q-separator />

    <div class="q-pa-md">
      <p>All fields are required</p>
      <q-form @submit="submitForm" class="q-gutter-sm">
        <q-input
          filled
          autofocus
          v-model="newEmployee.firstName"
          label="First Name"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Cannot be blank']"
        />
        <q-input
          filled
          v-model="newEmployee.lastName"
          label="Last Name"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Cannot be blank']"
        />

        <q-input
          filled
          type="textarea"
          rows="2"
          v-model="newEmployee.homeAddress"
          label="Home Address"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Cannot be blank']"
        />

        <q-input
          filled
          type="tel"
          v-model="newEmployee.homePhone"
          label="Personal Phone (home or cell)"
          mask="phone"
          lazy-rules
          :rules="[(val) => (val && val.length == 16) || 'Enter a valid phone number']"
        />

        <q-input
          filled
          v-model="newEmployee.emergencyContact"
          label="Emergency Contact Name"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Cannot be blank']"
        />

        <q-input
          filled
          type="tel"
          v-model="newEmployee.emergencyPhone"
          label="Emergency Contact Phone"
          mask="phone"
          lazy-rules
          :rules="[(val) => (val && val.length == 16) || 'Enter a valid phone number']"
        />
        <q-input
          filled
          v-model="newEmployee.hireDate"
          mask="date"
          label="Hire Date (yyyy/mm/dd)"
          :rules="[(val) => !!val || 'Cannot be blank']"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                <q-date v-model="newEmployee.hireDate">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <div class="row items-center q-gutter-sm q-pa-sm">
          <q-icon name="attach_file" size="sm" :color="resumeFile ? 'teal' : 'grey'" />
          <div class="col">
            <div class="text-caption text-grey-7">Resume / CV (optional)</div>
            <div class="text-body2">{{ resumeFile ? resumeFile.name : 'No file selected' }}</div>
          </div>
          <q-btn outline color="primary" label="Attach File" @click="resumeInputRef?.click()" />
        </div>
        <div class="row items-center q-gutter-sm q-pa-sm">
          <q-icon name="attach_file" size="sm" :color="agreementFile ? 'teal' : 'grey'" />
          <div class="col">
            <div class="text-caption text-grey-7">Personnel Agreement (optional)</div>
            <div class="text-body2">{{ agreementFile ? agreementFile.name : 'No file selected' }}</div>
          </div>
          <q-btn outline color="primary" label="Attach File" @click="agreementInputRef?.click()" />
        </div>
        <input ref="resumeInputRef" type="file" accept=".pdf" style="display: none" @change="onResumeSelected" />
        <input ref="agreementInputRef" type="file" accept=".pdf" style="display: none" @change="onAgreementSelected" />
        <q-separator />
        <div>
          <q-btn label="Add Employee" type="submit" color="teal" />
          <q-btn label="Cancel" flat class="q-ml-sm" :to="{ name: 'personnel-list' }" />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePersonnelStore } from 'src/stores/personnel-store';
import type { Employee } from 'src/components/Personnel/models';

const router = useRouter();
const store = usePersonnelStore();

const newEmployee = ref({
  firstName: '',
  lastName: '',
  homeAddress: '',
  homePhone: '',
  emergencyContact: '',
  emergencyPhone: '',
  hireDate: '',
});

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

const submitForm = () => {
  const id = store.addEmployee({ id: 0, ...newEmployee.value } as Employee);
  void router.push({ name: 'personnel-detail', params: { employeeId: id } });
};
</script>
