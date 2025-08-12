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
          v-model="newEmployee.name"
          label="Full name"
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
        <q-field filled label="Upload Resume / CV" stack-label style="padding-bottom: 20px">
          <template v-slot:control>
            <q-uploader
              flat
              bordered
              auto-upload
              label="Select a PDF file to upload"
              accept="application/pdf"
              url="http://localhost:4444/upload"
              style="width: 100%"
            />
          </template>
        </q-field>
        <q-field filled label="Upload Personnel Agreement" stack-label style="padding-bottom: 20px">
          <template v-slot:control>
            <q-uploader
              flat
              bordered
              auto-upload
              label="Select a PDF file to upload"
              accept="application/pdf"
              url="http://localhost:4444/upload"
              style="width: 100%"
            />
          </template>
        </q-field>
        <q-select
          filled
          v-model="newEmployee.selectedRole"
          :options="roles"
          label="Select the Primary Role"
          hint="Additional roles can be assigned later"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please select a role']"
        />
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

const newEmployee = ref({
  name: null,
  homeAddress: null,
  homePhone: null,
  emergencyContact: null,
  emergencyPhone: null,
  hireDate: null,
  selectedRole: null,
});

const roles = [
  'Listing Compliance Engineer',
  'Quality Manager',
  'Executive Director - TEi-TS',
  'President and CEO',
  'Lab Technician - TEi-TS Stone & Tile',
];

const submitForm = () => {
  console.log('Form submitted');
};
</script>
