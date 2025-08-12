<template>
  <q-tab-panel name="identity">
    <q-card bordered>
      <q-list separator>
        <q-item>
          <q-item-section>
            <q-item-label overline>Full Name</q-item-label>
            <q-item-label class="q-pl-md">{{ employee.name }}</q-item-label>
          </q-item-section>
          <q-item-section side bottom>
            <q-btn flat round color="grey" icon="edit">
              <q-popup-edit
                buttons
                v-model="employee.name"
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
            <q-item-label class="q-pl-md">{{ employee.homeAddress }}</q-item-label>
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

        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label overline>Resume / CV</q-item-label>
            <q-item-label caption class="text-italic q-pl-md"> Click to view </q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-icon color="red" name="fas fa-file-pdf"></q-icon>
          </q-item-section>
        </q-item>
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
              <q-uploader
                flat
                bordered
                auto-upload
                label="Select a PDF file to upload"
                accept="application/pdf"
                url="http://localhost:4444/upload"
                style="width: 100%"
              />
            </q-card-section>
          </q-card>
        </q-expansion-item>
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
    </q-card>
  </q-tab-panel>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const employee = ref({
  id: 2,
  name: 'Ryan Hyer',
  homeAddress: '5097 W Alamosa St<br />Boise, ID 83703',
  homePhone: '801-425-3175',
  emergencyContact: "T'Lesa Meadowcroft",
  emergencyPhone: '801-574-1855',
  hireDate: '2007/02/26',
  terminationDate: null,
});
</script>
