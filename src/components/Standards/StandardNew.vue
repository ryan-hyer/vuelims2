<template>
  <q-page padding>
    <div class="page-header">Standards</div>
    <div class="page-subheader q-pa-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Standard List" :to="{ name: 'standard-list' }" />
        <q-breadcrumbs-el label="Add New Standard" />
      </q-breadcrumbs>
    </div>

    <q-separator />

    <div class="q-pa-md">
      <p>All required fields are marked with *</p>
      <q-form @submit="submitForm" class="q-gutter-sm">
        <q-input
          filled
          autofocus
          v-model="form.number"
          label="Standard Number *"
          hint="e.g. ABYC C-7, UL 458, ANSI Z21.10.1 / CSA 4.1"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Cannot be blank']"
        />

        <q-input
          filled
          v-model="form.revision"
          label="Revision *"
          hint="e.g. 2023, 6th (2025), 2011ae1"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Cannot be blank']"
        />

        <q-input
          filled
          v-model="form.title"
          label="Title *"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Cannot be blank']"
        />

        <q-input
          filled
          v-model="form.ics_codes"
          label="ICS Codes"
          hint="Comma-separated, e.g. 29.120.40, 97.100.20"
        />

        <q-input
          filled
          type="url"
          v-model="form.webstore_url"
          label="Webstore URL"
          hint="Link to the standard's webstore page"
        />

        <div class="row items-center q-gutter-sm q-pa-sm">
          <q-icon name="attach_file" size="sm" :color="docFile ? 'teal' : 'grey'" />
          <div class="col">
            <div class="text-caption text-grey-7">Standard Document (optional)</div>
            <div class="text-body2">{{ docFile ? docFile.name : 'No file selected' }}</div>
          </div>
          <q-btn outline color="primary" label="Attach File" @click="docInputRef?.click()" />
        </div>

        <input
          ref="docInputRef"
          type="file"
          accept=".pdf"
          style="display: none"
          @change="onDocSelected"
        />

        <q-separator />

        <div>
          <q-btn label="Add Standard" type="submit" color="teal" />
          <q-btn label="Cancel" flat class="q-ml-sm" :to="{ name: 'standard-list' }" />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStandardStore } from 'src/stores/standard-store';

const router = useRouter();
const store = useStandardStore();

const form = ref({
  number: '',
  revision: '',
  title: '',
  ics_codes: '',
  webstore_url: '',
});

const docInputRef = ref<HTMLInputElement | null>(null);
const docFile = ref<File | null>(null);

const onDocSelected = (e: Event) => {
  docFile.value = (e.target as HTMLInputElement).files?.[0] ?? null;
};

const submitForm = async () => {
  const newId = await store.addStandard({
    number: form.value.number,
    revision: form.value.revision,
    title: form.value.title,
    ics_codes: form.value.ics_codes
      ? form.value.ics_codes
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
    webstore_url: form.value.webstore_url || null,
  });
  if (docFile.value && newId) {
    await store.uploadDoc(newId, docFile.value);
  }
  void router.push({ name: 'standard-list' });
};
</script>
