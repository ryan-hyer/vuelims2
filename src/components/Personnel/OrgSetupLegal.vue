<template>
  <q-page padding>
    <q-inner-loading :showing="loading" label="Loading documents..." />
    <div class="page-header">Legal Documents</div>
    <q-list bordered separator>
      <template v-for="doc in docs" :key="doc.id">
        <q-item class="bg-grey-3">
          <q-item-section>
            <q-item-label class="text-h6">{{ doc.title }}</q-item-label>
            <q-item-label caption>{{ doc.description }}</q-item-label>
            <q-item-label caption :class="doc.uploadDate ? '' : 'text-red'">
              {{ doc.uploadDate ? `Last Uploaded: ${formatDate(doc.uploadDate)}` : 'Last Uploaded: Never' }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn round icon="picture_as_pdf" color="red" :disable="!doc.url" @click="viewDoc(doc)">
              <q-tooltip>
                {{ doc.url ? 'View Document' : doc.filename ? 'Not available — please re-upload' : 'No document uploaded' }}
              </q-tooltip>
            </q-btn>
          </q-item-section>
          <q-item-section side>
            <q-btn round icon="upload_file" color="green" @click="openUpload(doc.id)">
              <q-tooltip>{{ doc.filename ? 'Upload New Version' : 'Upload Document' }}</q-tooltip>
            </q-btn>
          </q-item-section>
        </q-item>
        <q-item v-if="uploadingId === doc.id" class="bg-grey-1">
          <q-item-section>
            <div class="row items-center q-gutter-sm q-pa-sm">
              <q-icon name="insert_drive_file" size="md" :color="pendingFile ? 'teal' : 'grey'" />
              <div class="col">
                <div class="text-body2">{{ pendingFile ? pendingFile.name : 'No file selected' }}</div>
                <div class="text-caption text-grey">PDF, PNG, or JPG</div>
              </div>
              <q-btn outline color="primary" label="Choose File" @click="fileInputRef?.click()" />
              <q-btn
                color="teal"
                label="Upload"
                :disable="!pendingFile"
                :loading="uploading"
                @click="confirmUpload(doc.id)"
              />
              <q-btn flat color="red" label="Cancel" @click="cancelUpload" />
            </div>
          </q-item-section>
        </q-item>
      </template>
    </q-list>
    <input
      ref="fileInputRef"
      type="file"
      accept=".pdf,.png,.jpg,.jpeg"
      style="display: none"
      @change="onFileSelected"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { usePersonnelStore } from 'src/stores/personnel-store';
import type { LegalDocument } from './models';

const store = usePersonnelStore();

const loading = ref(false);
const uploading = ref(false);
const uploadingId = ref<number | null>(null);
const pendingFile = ref<File | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);

const docs = computed(() => store.legalDocs);

const formatDate = (dateStr: string) => {
  const parts = dateStr.split(/[-/]/);
  return `${parseInt(parts[1] ?? '1')}/${parseInt(parts[2] ?? '1')}/${parts[0]}`;
};

const viewDoc = (doc: LegalDocument) => {
  if (doc.url) window.open(doc.url, '_blank');
};

const openUpload = (id: number) => {
  uploadingId.value = id;
  pendingFile.value = null;
  if (fileInputRef.value) fileInputRef.value.value = '';
};

const onFileSelected = (event: Event) => {
  const input = event.target as HTMLInputElement;
  pendingFile.value = input.files?.[0] ?? null;
};

const confirmUpload = async (id: number) => {
  if (!pendingFile.value) return;
  uploading.value = true;
  await store.uploadLegalDoc(id, pendingFile.value);
  uploading.value = false;
  cancelUpload();
};

const cancelUpload = () => {
  uploadingId.value = null;
  pendingFile.value = null;
};

onMounted(async () => {
  loading.value = true;
  await store.fetchLegalDocs();
  loading.value = false;
});
</script>
