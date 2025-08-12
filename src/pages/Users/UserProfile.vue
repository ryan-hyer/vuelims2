<template>
  <q-page padding>
    <div class="page-header">Employee Info</div>
    <div>Contact your supervisor to make changes to this information</div>
    <div class="q-pa-md" style="max-width: 500px">
      <q-list bordered separator padding>
        <q-item>
          <q-item-section>
            <q-item-label overline>Full Name</q-item-label>
            <q-item-label>{{ name }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label overline>Hire Date</q-item-label>
            <q-item-label>{{ hireDate }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label overline>Work Phone</q-item-label>
            <q-item-label>{{ workPhone }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label overline>Home Phone (or personal cell)</q-item-label>
            <q-item-label>{{ homePhone }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label overline>Home Address</q-item-label>
            <q-item-label>{{ homeAddress1 }}</q-item-label>
            <q-item-label>{{ homeAddress2 }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label overline>Emergency Contact Name</q-item-label>
            <q-item-label>{{ emergencyContact }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label overline>Emergency Contact Phone</q-item-label>
            <q-item-label>{{ emergencyPhone }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// TODO: Get actual values and insert them here
const name = ref('Ryan Hyer');
const workPhone = ref('801-262-1868');
const homePhone = ref('801-425-3175');
const homeAddress1 = ref('5097 W Alamosa St');
const homeAddress2 = ref('Boise, ID 83703');
const emergencyContact = ref("T'Lesa Meadowcroft");
const emergencyPhone = ref('801-574-1855');
const hireDate = ref('2 / 26 / 2007');
</script>
