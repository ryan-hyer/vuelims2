<template>
  <div class="q-mt-md">
    <div class="text-subtitle2 q-mb-sm">
      Documents
      <span class="text-grey-6 text-caption q-ml-xs">(optional)</span>
    </div>
    <q-list v-if="draftDocs.length" bordered separator class="rounded-borders q-mb-sm">
      <q-item v-for="(doc, i) in draftDocs" :key="i">
        <q-item-section>
          <q-item-label>{{ doc.title }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn flat round dense icon="delete" color="red-5" @click="removeDoc(i)" />
        </q-item-section>
      </q-item>
    </q-list>
    <div class="q-gutter-sm">
      <q-input v-model="newDocTitle" outlined dense label="Document Title" />
      <div class="row items-center q-gutter-sm">
        <q-icon name="attach_file" size="sm" :color="newDocFile ? 'teal' : 'grey'" />
        <div class="col">
          <div class="text-body2">
            {{ newDocFile ? newDocFile.name : 'No file attached' }}
          </div>
          <div v-if="docFileError" class="text-caption text-negative">A file is required</div>
          <div v-else class="text-caption text-grey">PDF, PNG, or JPG</div>
        </div>
        <q-btn
          outline
          color="primary"
          label="Attach File"
          size="sm"
          @click="docFileInputRef?.click()"
        />
      </div>
      <div class="row items-center q-gutter-sm">
        <q-btn
          color="primary"
          label="Add Document"
          size="sm"
          :disable="!newDocTitle.trim()"
          @click="addDoc"
        />
        <span v-if="pendingDocPartial" class="text-caption text-negative">
          Complete or clear the pending entry before submitting.
        </span>
      </div>
    </div>
    <input
      ref="docFileInputRef"
      type="file"
      accept=".pdf,.png,.jpg,.jpeg"
      style="display: none"
      @change="onDocFileSelected"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from 'src/stores/auth-store';
import type { ProjectDocument } from './models';

const authStore = useAuthStore();

const draftDocs = ref<ProjectDocument[]>([]);
const newDocTitle = ref('');
const newDocFile = ref<File | null>(null);
const docFileInputRef = ref<HTMLInputElement | null>(null);
const docFileError = ref(false);

const pendingDocPartial = computed(() => !!newDocTitle.value.trim() !== !!newDocFile.value);

function onDocFileSelected(e: Event) {
  newDocFile.value = (e.target as HTMLInputElement).files?.[0] ?? null;
  if (newDocFile.value) docFileError.value = false;
}

function addDoc() {
  if (!newDocTitle.value.trim()) return;
  if (!newDocFile.value) {
    docFileError.value = true;
    return;
  }
  const maxId = draftDocs.value.reduce((max, d) => Math.max(max, d.id), 0);
  draftDocs.value.push({
    id: maxId + 1,
    projectId: 0,
    title: newDocTitle.value.trim(),
    url: URL.createObjectURL(newDocFile.value),
    uploadedAt: new Date(),
    uploadedBy: authStore.user?.id ?? 0,
  });
  newDocTitle.value = '';
  newDocFile.value = null;
  if (docFileInputRef.value) docFileInputRef.value.value = '';
}

function removeDoc(index: number) {
  draftDocs.value.splice(index, 1);
}

defineExpose({
  getDocs: () => draftDocs.value,
  addDocIfReady: () => { if (newDocTitle.value.trim() && newDocFile.value) addDoc(); },
});
</script>
