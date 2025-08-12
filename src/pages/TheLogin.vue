<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">
    <q-header elevated class="bg-white text-grey-8 q-py-xs" height-hint="58">
      <q-toolbar>
        <q-btn flat no-caps no-wrap class="q-ml-xs" :to="{ name: 'login' }">
          <q-icon name="img:logo.gif" size="28px" />
          <q-toolbar-title shrink class="text-weight-bold"> TEi LIMS </q-toolbar-title>
        </q-btn>

        <q-space />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="flex flex-center bg-blue-grey-1">
        <div class="column">
          <div class="q-pl-md text-h4"><p>Please Log In</p></div>
          <div class="q-pa-md" style="max-width: 500px">
            <q-form @submit="onSubmit" class="q-gutter-md">
              <q-input
                outlined
                v-model="username"
                label="Username"
                lazy-rules
                :rules="[(val) => (val && val.length > 0) || 'Username must not be blank']"
              />

              <q-input
                outlined
                type="password"
                v-model="password"
                label="Password"
                lazy-rules
                :rules="[(val) => (val && val.length > 0) || 'Password must not be blank']"
              />

              <div>
                <q-btn label="Submit" type="submit" color="primary" />
              </div>
            </q-form>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { ref } from 'vue';

const $q = useQuasar();

const username = ref(null);
const password = ref(null);

function onSubmit() {
  $q.notify({
    color: 'green-4',
    textColor: 'white',
    icon: 'cloud_done',
    message: 'Submitted',
  });
}
</script>

<style lang="sass">
.YL

  &__toolbar-input-container
    min-width: 200px

  &__toolbar-input-btn
    border-radius: 0
    border-style: solid
    border-width: 1px 1px 1px 0
    border-color: rgba(0,0,0,.24)
    max-width: 60px
    width: 100%
</style>
