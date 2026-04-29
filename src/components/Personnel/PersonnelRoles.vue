<template>
  <div>
    <q-card bordered class="q-mb-md" v-for="ar in props.employee.assignedRoles" :key="ar.id">
      <q-list separator>
        <q-expansion-item>
          <template v-slot:header>
            <q-item-section>
              <q-item-label class="text-h6">{{ ar.role?.title ?? '(Unknown role)' }}</q-item-label>
              <q-item-label caption>Role Assigned {{ ar.startDate }}</q-item-label>
              <q-item-label caption>Expand to view role information</q-item-label>
            </q-item-section>
          </template>
          <q-card>
            <q-list separator>
              <q-item>
                <q-item-section>
                  <q-item-label overline>Reports To</q-item-label>
                  <q-item-label class="q-pl-md">{{
                    supervisorTitle(ar.role?.supervisor ?? null)
                  }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label overline>Role Description</q-item-label>
                  <q-item-label class="q-pl-md">{{ ar.role?.roleDescription }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label overline>Key Duties</q-item-label>
                  <q-item-label>
                    <ul>
                      <li v-for="item in ar.role?.keyDuties" :key="item">{{ item }}</li>
                    </ul>
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label overline>Authorizations</q-item-label>
                  <q-item-label>
                    <ul>
                      <li v-for="item in ar.role?.authorizations" :key="item">{{ item }}</li>
                    </ul>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </q-expansion-item>
        <q-expansion-item expand-icon-toggle expand-separator>
          <template v-slot:header>
            <q-item-section avatar>
              <q-icon
                :color="ar.qualifications_verified_date ? 'green' : 'orange'"
                :name="ar.qualifications_verified_date ? 'check_circle' : 'warning'"
                size="lg"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>Hiring Qualifications</q-item-label>
              <q-item-label caption>Expand to view details</q-item-label>
              <q-item-label v-if="ar.qualifications_verified_date" caption class="text-green">
                Verified {{ ar.qualifications_verified_date }} by
                {{ ar.qualifications_verified_by }}
              </q-item-label>
              <q-item-label v-else caption>
                <span class="text-red">Not Yet Verified!</span>
                <q-btn
                  v-if="authStore.isSupervisorOf(ar.role?.supervisor) || authStore.isAdmin"
                  label="Verify Now"
                  size="xs"
                  color="primary"
                  class="q-ml-sm"
                  @click.stop="openVerifyQualifications(ar.id)"
                />
              </q-item-label>
            </q-item-section>
          </template>
          <q-item>
            <ul>
              <li v-for="item in ar.role?.hiringQualifications" :key="item">{{ item }}</li>
            </ul>
          </q-item>
        </q-expansion-item>

        <q-expansion-item expand-icon-toggle expand-separator>
          <template v-slot:header>
            <q-item-section avatar>
              <q-icon
                :color="ar.probation_verified_date ? 'green' : 'orange'"
                :name="ar.probation_verified_date ? 'check_circle' : 'warning'"
                size="lg"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>90-Day Probation Targets</q-item-label>
              <q-item-label caption>Expand to view details</q-item-label>
              <q-item-label v-if="ar.probation_verified_date" caption class="text-green">
                Verified {{ ar.probation_verified_date }} by {{ ar.probation_verified_by }}
              </q-item-label>
              <q-item-label v-else caption>
                <span class="text-red">Not Yet Verified!</span>
                <q-btn
                  v-if="authStore.isSupervisorOf(ar.role?.supervisor) || authStore.isAdmin"
                  label="Verify Now"
                  size="xs"
                  color="primary"
                  class="q-ml-sm"
                  @click.stop="openVerifyProbation(ar.id)"
                />
              </q-item-label>
            </q-item-section>
          </template>
          <q-item>
            <ul>
              <li v-for="item in ar.role?.probationTargets" :key="item">{{ item }}</li>
            </ul>
          </q-item>
        </q-expansion-item>
      </q-list>
      <q-separator />
      <q-card-actions v-if="authStore.isAdmin" align="right">
        <q-btn flat rounded color="red" size="sm" @click="confirmRemoveRole(ar)">
          Unassign this role
        </q-btn>
      </q-card-actions>
    </q-card>

    <div v-if="addRoleFormIsVisible" class="q-mt-md">
      <q-select
        filled
        v-model="selectedRoleId"
        :options="availableRoles"
        option-value="id"
        option-label="title"
        emit-value
        map-options
        label="Select a Role to Assign"
        class="q-pb-md"
      />
      <q-btn label="Assign Role" color="teal" :disable="selectedRoleId === null" @click="addRole" />
      <q-btn label="Cancel" flat class="q-ml-sm" @click="addRoleFormIsVisible = false" />
    </div>
    <q-btn
      v-else-if="authStore.isAdmin"
      rounded
      color="green"
      icon="add_box"
      label="Assign New Role"
      class="q-mt-md"
      @click="addRoleFormIsVisible = true"
    />
  </div>
</template>

<script setup lang="ts">
/*
TODO:
- Decide whether I prefer unassignment and archiving of roles, or whether it's fine to just remove roles from people without keeping a record of it.
- If the former, create a section below the New button for "Former Roles" or something.
*/
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { usePersonnelStore } from 'src/stores/personnel-store';
import { useAuthStore } from 'src/stores/auth-store';
import type { Employee, EmployeeRoleWithDetails } from './models';

const props = defineProps<{ employee: Employee }>();

const $q = useQuasar();
const store = usePersonnelStore();
const authStore = useAuthStore();

const addRoleFormIsVisible = ref(false);
const selectedRoleId = ref<number | null>(null);

const supervisorTitle = (supervisorId: number | null | undefined) => {
  if (supervisorId == null) return 'None';
  return store.allRoles.find((r) => r.id === supervisorId)?.title ?? 'Unknown';
};

const openVerifyQualifications = (assignmentId: number) => {
  void store.verifyQualifications(assignmentId, authStore.fullName);
};

const openVerifyProbation = (assignmentId: number) => {
  void store.verifyProbation(assignmentId, authStore.fullName);
};

const availableRoles = computed(() => {
  const assignedIds = new Set((props.employee.assignedRoles ?? []).map((ar) => ar.roleId));
  return store.allRoles
    .filter((r) => !assignedIds.has(r.id))
    .sort((a, b) => a.title.localeCompare(b.title));
});

const addRole = async () => {
  if (selectedRoleId.value === null) return;
  await store.addEmployeeRole(props.employee.id, selectedRoleId.value);
  selectedRoleId.value = null;
  addRoleFormIsVisible.value = false;
};

const confirmRemoveRole = (ar: EmployeeRoleWithDetails) => {
  $q.dialog({
    title: 'Unassign Role',
    message: `Unassign "${ar.role?.title ?? 'this role'}" from ${props.employee.firstName} ${props.employee.lastName}?`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    void store.removeEmployeeRole(ar.id);
  });
};

onMounted(async () => {
  if (store.allRoles.length === 0) {
    await store.fetchOrg();
  }
});
</script>
