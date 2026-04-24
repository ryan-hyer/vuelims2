<template>
  <q-page padding>
    <div class="page-header">My Profile</div>

    <div class="q-pa-md" style="max-width: 500px">

      <!-- Account card -->
      <q-card flat bordered class="q-mb-lg">
        <q-card-section>
          <div class="text-overline text-grey-6">Account</div>
          <div class="text-h6">{{ authStore.fullName }}</div>
          <div class="text-caption text-grey-6">{{ authStore.user?.email }}</div>
          <q-badge
            class="q-mt-xs"
            :color="roleBadgeColor"
            :label="authStore.user?.role"
          />
        </q-card-section>
        <q-separator />
        <q-card-actions>
          <q-btn flat dense no-caps color="primary" :to="{ name: 'change-password' }" icon="lock" label="Change Password" />
        </q-card-actions>
      </q-card>

      <!-- Employee info (only if account is linked to an employee record) -->
      <template v-if="authStore.user?.employeeId">
        <div class="text-subtitle1 q-mb-xs">Employee Information</div>
        <div class="text-caption text-grey-6 q-mb-md">Contact your supervisor to make changes</div>

        <div v-if="loading" class="flex flex-center q-pa-lg">
          <q-spinner color="primary" size="2em" />
        </div>

        <q-list v-else-if="employee" bordered separator padding>
          <q-item>
            <q-item-section>
              <q-item-label overline>Full Name</q-item-label>
              <q-item-label>{{ employee.firstName }} {{ employee.lastName }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline>Hire Date</q-item-label>
              <q-item-label>{{ employee.hireDate }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline>Home Phone (or personal cell)</q-item-label>
              <q-item-label>{{ employee.homePhone }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline>Home Address</q-item-label>
              <q-item-label v-for="(line, i) in addressLines" :key="i">{{ line }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline>Emergency Contact Name</q-item-label>
              <q-item-label>{{ employee.emergencyContact }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline>Emergency Contact Phone</q-item-label>
              <q-item-label>{{ employee.emergencyPhone }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </template>

      <!-- No employee record linked -->
      <template v-else>
        <q-banner rounded class="bg-blue-1 text-blue-9">
          <template v-slot:avatar>
            <q-icon name="info" color="blue-7" />
          </template>
          No employee record is linked to this account.
        </q-banner>
      </template>

    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from 'src/stores/auth-store';
import { usePersonnelStore } from 'src/stores/personnel-store';

const authStore = useAuthStore();
const personnelStore = usePersonnelStore();
const loading = ref(false);

const employee = computed(() => personnelStore.employee);

const addressLines = computed(() =>
  employee.value?.homeAddress
    ? employee.value.homeAddress.split('<br />').map((l) => l.trim()).filter(Boolean)
    : [],
);

const roleBadgeColor = computed(() => {
  switch (authStore.user?.role) {
    case 'admin': return 'deep-orange';
    case 'auditor': return 'teal';
    default: return 'primary';
  }
});

onMounted(async () => {
  if (authStore.user?.employeeId) {
    loading.value = true;
    await personnelStore.fetchEmployee(authStore.user.employeeId);
    loading.value = false;
  }
});
</script>
