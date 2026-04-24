<template>
  <q-page padding>
    <div class="page-header">Change Password</div>
    <div class="q-pa-md" style="max-width: 500px">
      <q-form @submit="onSubmit" class="q-gutter-md">
        <q-input
          outlined
          type="password"
          v-model="currentPassword"
          label="Current Password"
          lazy-rules
          :rules="[(val: string) => !!val || 'Must not be blank']"
        />

        <q-input
          outlined
          type="password"
          v-model="newPassword"
          label="New Password"
          lazy-rules
          :rules="[
            (val: string) => !!val || 'Must not be blank',
            (val: string) => val.length >= 8 || 'Password must be at least 8 characters',
          ]"
        />

        <q-input
          outlined
          type="password"
          v-model="confirmPassword"
          label="New Password Again"
          lazy-rules
          :rules="[(val: string) => val === newPassword || 'Passwords do not match']"
        />

        <div>
          <q-btn label="Change Password" type="submit" color="primary" :loading="loading" />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth-store';

const $q = useQuasar();
const authStore = useAuthStore();

const loading = ref(false);
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

async function onSubmit() {
  loading.value = true;
  try {
    await authStore.changePassword(currentPassword.value, newPassword.value);
    $q.notify({ type: 'positive', icon: 'check', message: 'Password changed successfully.' });
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
  } catch (err) {
    $q.notify({
      type: 'negative',
      icon: 'warning',
      message: err instanceof Error ? err.message : 'Password change failed.',
    });
  } finally {
    loading.value = false;
  }
}
</script>
