<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">
    <q-header elevated class="bg-white text-grey-8 q-py-xs" height-hint="58">
      <q-toolbar>
        <q-btn flat no-caps no-wrap class="q-ml-xs">
          <q-icon name="img:/logo.gif" size="28px" />
          <q-toolbar-title shrink class="text-weight-bold"> TEi LIMS </q-toolbar-title>
        </q-btn>
        <q-space />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="flex flex-center bg-blue-grey-1">
        <q-card flat bordered style="min-width: 380px; max-width: 420px" class="q-pa-sm">

          <!-- Login -->
          <template v-if="view === 'login'">
            <q-card-section class="text-center q-pb-sm">
              <div class="text-h5 q-mb-xs">Welcome Back</div>
              <div class="text-caption text-grey-6">Sign in to TEi LIMS</div>
            </q-card-section>

            <q-card-section>
              <q-form @submit="onLogin" class="q-gutter-md">
                <q-input
                  outlined
                  v-model="email"
                  label="Email"
                  type="email"
                  autocomplete="email"
                  :rules="[(val) => !!val || 'Email is required']"
                  lazy-rules
                />
                <q-input
                  outlined
                  type="password"
                  v-model="password"
                  label="Password"
                  autocomplete="current-password"
                  :rules="[(val) => !!val || 'Password is required']"
                  lazy-rules
                  :error="!!loginError"
                  :error-message="loginError"
                />
                <q-btn
                  label="Log In"
                  type="submit"
                  color="primary"
                  class="full-width"
                  :loading="loading"
                />
              </q-form>
            </q-card-section>

            <q-card-section class="text-center q-pt-none">
              <q-btn
                flat dense no-caps
                label="Forgot Password?"
                color="primary"
                @click="goToReset"
              />
            </q-card-section>
          </template>

          <!-- Step 1: Request reset token -->
          <template v-else-if="view === 'reset-request'">
            <q-card-section class="text-center q-pb-sm">
              <div class="text-h5 q-mb-xs">Reset Password</div>
              <div class="text-caption text-grey-6">Enter your email to receive a reset token</div>
            </q-card-section>

            <q-card-section>
              <q-form @submit="onRequestReset" class="q-gutter-md">
                <q-input
                  outlined
                  v-model="resetEmail"
                  label="Email"
                  type="email"
                  :rules="[(val) => !!val || 'Email is required']"
                  lazy-rules
                />
                <q-btn
                  label="Send Reset Token"
                  type="submit"
                  color="primary"
                  class="full-width"
                  :loading="loading"
                />
              </q-form>
            </q-card-section>

            <q-card-section class="text-center q-pt-none row justify-around">
              <q-btn flat dense no-caps label="Back to Login" @click="view = 'login'" />
              <q-btn flat dense no-caps color="primary" label="I already have a token" @click="view = 'reset-confirm'" />
            </q-card-section>
          </template>

          <!-- Step 2: Enter token + new password -->
          <template v-else-if="view === 'reset-confirm'">
            <q-card-section class="text-center q-pb-sm">
              <div class="text-h5 q-mb-xs">Set New Password</div>
              <div class="text-caption text-grey-6">Enter the token from your email and choose a new password</div>
            </q-card-section>

            <q-card-section>
              <q-form @submit="onResetPassword" class="q-gutter-md">
                <q-input
                  outlined
                  v-model="resetEmail"
                  label="Email"
                  type="email"
                  :rules="[(val) => !!val || 'Email is required']"
                  lazy-rules
                />
                <q-input
                  outlined
                  v-model="resetToken"
                  label="Reset Token"
                  :rules="[(val) => !!val || 'Token is required']"
                  :error="!!resetError"
                  :error-message="resetError"
                  lazy-rules
                />
                <q-input
                  outlined
                  type="password"
                  v-model="newPassword"
                  label="New Password"
                  :rules="passwordRules"
                  lazy-rules
                />
                <q-input
                  outlined
                  type="password"
                  v-model="confirmPassword"
                  label="Confirm New Password"
                  :rules="[(val) => val === newPassword || 'Passwords do not match']"
                  lazy-rules
                />
                <q-btn
                  label="Reset Password"
                  type="submit"
                  color="primary"
                  class="full-width"
                  :loading="loading"
                />
              </q-form>
            </q-card-section>

            <q-card-section class="text-center q-pt-none">
              <q-btn flat dense no-caps label="Back to Login" @click="view = 'login'" />
            </q-card-section>
          </template>

        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth-store';

type LoginView = 'login' | 'reset-request' | 'reset-confirm';

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();

const view = ref<LoginView>('login');
const loading = ref(false);

const email = ref('');
const password = ref('');
const loginError = ref('');

const resetEmail = ref('');
const resetToken = ref('');
const resetError = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

const passwordRules = [
  (val: string) => !!val || 'Password is required',
  (val: string) => val.length >= 8 || 'Password must be at least 8 characters',
];

function goToReset() {
  resetEmail.value = email.value;
  resetError.value = '';
  view.value = 'reset-request';
}

async function onLogin() {
  loginError.value = '';
  loading.value = true;
  try {
    await authStore.login(email.value, password.value);
    await router.push({ name: 'home' });
  } catch (err) {
    loginError.value = err instanceof Error ? err.message : 'Login failed';
  } finally {
    loading.value = false;
  }
}

async function onRequestReset() {
  loading.value = true;
  try {
    const result = await authStore.requestPasswordReset(resetEmail.value);
    if (result._mockToken) {
      $q.notify({
        type: 'info',
        icon: 'info',
        timeout: 0,
        multiLine: true,
        message: `[Mock] Your password reset token is: <strong>${result._mockToken}</strong>`,
        html: true,
        caption: 'In production this would be sent to your email address.',
        actions: [{ label: 'Dismiss', color: 'white' }],
      });
    } else {
      $q.notify({
        type: 'positive',
        message: 'If that email is registered, a reset token has been sent.',
      });
    }
    view.value = 'reset-confirm';
  } catch (err) {
    $q.notify({ type: 'negative', message: err instanceof Error ? err.message : 'Request failed' });
  } finally {
    loading.value = false;
  }
}

async function onResetPassword() {
  resetError.value = '';
  loading.value = true;
  try {
    await authStore.resetPassword(resetEmail.value, resetToken.value, newPassword.value);
    $q.notify({ type: 'positive', message: 'Password reset successfully. Please log in.' });
    email.value = resetEmail.value;
    password.value = '';
    view.value = 'login';
  } catch (err) {
    resetError.value = err instanceof Error ? err.message : 'Reset failed';
  } finally {
    loading.value = false;
  }
}
</script>
