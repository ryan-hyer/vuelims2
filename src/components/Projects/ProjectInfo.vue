<template>
  <q-tab-panel name="identity">
    <q-card bordered>
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
            <q-item-label class="q-pl-md">{{ project.description }}</q-item-label>
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
                <q-input v-model="scope.value" dense autofocus @keyup.enter="scope.set" />
              </q-popup-edit>
            </q-btn>
          </q-item-section>
        </q-item>
        <!-- TODO: This should be some kind of modal to select one or more standards (perhaps with chips similar to the Group assignment in Discourse profiles) -->
        <q-item>
          <q-item-section>
            <q-item-label overline>Standards</q-item-label>
            <q-item-label class="q-pl-md">{{ project.standards || 'None' }}</q-item-label>
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
                <q-input v-model="scope.value" dense autofocus @keyup.enter="scope.set" />
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
            <q-item-label class="q-pl-md">{{
              project.completeDate || 'Not Complete'
            }}</q-item-label>
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
    </q-card>
  </q-tab-panel>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Project } from './models';

const project = ref<Project>({
  id: 1,
  number: 'LS2500311',
  customer: 'Alpha Systems',
  description: 'Listing Addition',
  startDate: '2023/10/01',
  standards: 'Standard A (2015), Standard B (2022)',
  purchaseOrder: '',
  assignedTo: 'Ryan Hyer',
  completeDate: '',
});
</script>
