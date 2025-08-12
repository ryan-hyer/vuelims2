<template>
  <q-tab-panel name="authorizations">
    <q-card bordered class="q-mb-md" v-for="role in roles" :key="role.id">
      <q-list separator>
        <q-expansion-item>
          <template v-slot:header>
            <q-item-section>
              <q-item-label class="text-h6">
                {{ role.title }}
              </q-item-label>
              <q-item-label caption>Expand to view all details</q-item-label>
            </q-item-section>
          </template>
          <q-card>
            <q-list separator>
              <q-item>
                <q-item-section>
                  <q-item-label overline>Supervisor</q-item-label>
                  <q-item-label class="q-pl-md">{{ role.supervisor }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label overline>Role Description</q-item-label>
                  <q-item-label class="q-pl-md">{{ role.roleDescription }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label overline>Key Duties</q-item-label>
                  <q-item-label>{{ role.keyDuties }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </q-expansion-item>
        <q-item>
          <q-item-section>
            <q-item-label overline>Authorizations</q-item-label>
            <q-item-label>{{ role.authorizations }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <q-separator />
      <q-card-actions align="right">
        <q-btn flat rounded color="red" size="sm" @click="confirmRemoveRole(role)">
          Unassign this role
        </q-btn>
      </q-card-actions>
    </q-card>
    <div v-if="addRoleFormIsVisible">
      <q-select
        filled
        v-model="selectedNewRole"
        :options="allRoles"
        label="Select an Additional Role"
        class="q-pb-md"
      />
      <q-btn label="Assign Role" type="submit" color="teal" @click="addRole" />
      <q-btn label="Cancel" flat class="q-ml-sm" @click="addRoleFormIsVisible = false" />
    </div>
    <q-btn
      v-else
      rounded
      color="green"
      icon="add_box"
      label="Assign New Role"
      @click="addRoleFormIsVisible = true"
    />

    <!--     <q-dialog v-model="removeRoleConfirmation" persistent>
      <q-card>
        <q-item>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white" class="float-left">?</q-avatar>
          </q-item-section>
          <q-item-section>
            Are you sure you want unassign the role
            {{ roleToRemove.title }} from Ryan Hyer?
          </q-item-section>
        </q-item>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup @click="roleToRemove.value = null" />
          <q-btn flat label="Confirm" color="primary" v-close-popup @click="removeRole" />
        </q-card-actions>
      </q-card>
    </q-dialog> -->
  </q-tab-panel>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// TODO: Change these from HTML formatted to, perhaps, an array that gets converted to list items in an 'each' loop within the component
const roles = ref([
  {
    id: 1,
    title: 'Listing Compliance Engineer',
    supervisor: 'Alona MacGregor',
    roleDescription:
      'The Listing Compliance Engineer (LCE) supplies the basic technical knowledge of the products and standards involved in the TEi-LS certification programs, coordinates certification evaluation activities, and performs the evaluation review and certification decision.',
    keyDuties:
      '<ul><li>Monitors and manages the day-to-day operations of certification files, including reviewing applications, reports, manuals, standards, codes and other documents in accordance with TEi-LS policies and procedures.</li><li>Plans and coordinates the evaluation of certification applications and amendments. Selects applicable standards for evaluation of products. Creates and manages certification projects. Schedules and arranges periodic surveillance activities of certification clients.</li><li>Reviews standards and codes as they apply to TEi-LS, its clients, and supported regulatory bodies and industry organizations. Maintains up-to-date knowledge of applicable standards and revisions of standards.</li><li>Assists in development and implementation of TEi-LS policies and procedures. Recommends revisions to the TEi Quality Management System documents as appropriate.</li><li>Participates in industry events and standards-writing bodies, in order to stay on the forefront of upcoming information as well as to build and maintain relationships with key players in those organizations.</li></ul>',
    authorizations:
      '<ul><li>Arrange for certification evaluation activities to take place, and review the results</li><li>Perform evaluation review</li><li>Make certification decisions</li></ul>',
  },
  {
    id: 2,
    title: 'Quality Manager',
    supervisor: 'Matthew MacGregor',
    roleDescription:
      'The TEi corporate Quality Manager is responsible for the TEi Quality Management System and reports directly to TEi top management.',
    keyDuties:
      '<ul><li>Performs Internal Audits of all TEi operations in accordance with policies and procedures. Performs follow-up and miscellaneous audits as necessary.</li><li>Ensures good customer relations by tracking and acting to resolve customer complaints and appeals.</li><li>Approves new quality system documents and forms, and revisions to the same.</li><li>Plans, coordinates, tracks, and implements quality improvement projects, including corrective and preventive actions.</li></ul>',
    authorizations:
      '<ul><li>Establish, implement, maintain, and improve the TEi Quality Management System process and procedures</li><li>Identify deviations from the Quality Management System or from established procedures</li><li>Initiate actions to prevent or minimize deviations</li><li>Report to TEi top management on the performance of the Quality Management System and any need for improvement</li><li>Ensure the effectiveness of all TEi activities</li><li>Ensure that the integrity of the Quality Management System is maintained even when changes are planned and implemented</li></ul>',
  },
]);

const allRoles = [
  'Listing Compliance Engineer',
  'Quality Manager',
  'Executive Director - TEi-TS',
  'President and CEO',
  'Lab Technician - TEi-TS Stone & Tile',
];

const roleToRemove = ref({});

const confirmRemoveRole = (role: object) => {
  roleToRemove.value = role;
  removeRoleConfirmation.value = true;
};
/* TODO: Fix this
const removeRole = () => {
  roles.value = roles.value.filter((role) => role.id !== roleToRemove.value.id);
  roleToRemove.value = null;
};
*/
const removeRoleConfirmation = ref(false);

const addRoleFormIsVisible = ref(false);

const selectedNewRole = ref('');

const addRole = () => {
  alert('Adding role: ' + selectedNewRole.value);
  selectedNewRole.value = '';
  addRoleFormIsVisible.value = false;
};
</script>
