<template>
  <q-page padding>
    <div class="page-header">Change Password</div>
    <div class="q-pa-md" style="max-width: 500px">
      <q-form @submit="onSubmit" class="q-gutter-md">
        <q-input
          outlined
          type="password"
          v-model="oldPassword"
          label="Current Password"
          lazy-rules
          :rules="[(val: string | any[]) => (val && val.length > 0) || 'Must not be blank']"
        />

        <q-input
          outlined
          type="password"
          v-model="newPassword"
          label="New Password"
          lazy-rules
          :rules="[(val: string | any[]) => (val && val.length > 0) || 'Must not be blank']"
        />

        <q-input
          outlined
          type="password"
          v-model="newPasswordConfirm"
          label="New Password Again"
          lazy-rules
          :rules="[(val: string | any[]) => (val && val.length > 0) || 'Must not be blank']"
        />

        <div>
          <q-btn label="Submit" type="submit" color="primary" />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { ref } from 'vue';

export default {
  name: 'ChangePassword',
  setup() {
    const $q = useQuasar();

    const oldPassword = ref(null);
    const newPassword = ref(null);
    const newPasswordConfirm = ref(null);

    return {
      oldPassword,
      newPassword,
      newPasswordConfirm,

      onSubmit() {
        // TODO: Change this from a Notify popup to a validation alert on the field itself
        if (newPassword.value !== newPasswordConfirm.value) {
          $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: 'Passwords do not match',
          });
        } else {
          $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: 'Done!',
          });
        }
      },
    };
  },
};
</script>
