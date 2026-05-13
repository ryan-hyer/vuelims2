<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" persistent>
    <q-card style="min-width: 480px; max-width: 600px">
      <q-toolbar class="bg-cyan-1">
        <q-toolbar-title>
          <div class="text-subtitle1 text-bold">{{ model.modelNumber }}</div>
          <div class="text-caption">Model Details</div>
        </q-toolbar-title>
        <q-btn flat round icon="close" v-close-popup />
      </q-toolbar>
      <q-card-section>
        <q-input v-model="draftDescription" outlined dense label="Description" class="q-mb-md" />
        <q-separator class="q-mb-sm" />
        <div class="row items-center q-mb-sm">
          <div class="text-overline">Documents</div>
          <q-space />
          <q-btn
            round
            unelevated
            size="xs"
            color="green"
            icon="add"
            @click="showUploadForm = !showUploadForm"
          >
            <q-tooltip>Upload Document</q-tooltip>
          </q-btn>
        </div>
        <q-list bordered separator class="rounded-borders q-mb-md" v-if="draftDocs.length">
          <q-item v-for="(doc, i) in draftDocs" :key="doc.id">
            <q-item-section>
              <q-item-label>{{ doc.description }}</q-item-label>
              <q-item-label caption>
                {{ noteAuthor(doc.uploadedBy) }} · {{ formatDate(doc.uploadedAt) }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn flat round dense icon="open_in_new" color="primary" @click="viewDoc(doc.url)">
                <q-tooltip>View Document</q-tooltip>
              </q-btn>
            </q-item-section>
            <q-item-section side>
              <q-btn flat round dense icon="delete" color="red-5" @click="removeDoc(i)" />
            </q-item-section>
          </q-item>
        </q-list>
        <div v-else class="text-grey-6 q-mb-md">No documents on file.</div>
        <template v-if="showUploadForm">
          <q-separator class="q-mb-md" />
          <div class="q-gutter-sm">
            <q-input v-model="newDocDescription" outlined dense label="New document description" />
            <div class="row items-center q-gutter-sm">
              <q-icon name="attach_file" size="sm" :color="newDocFile ? 'teal' : 'grey'" />
              <div class="col">
                <div class="text-body2">{{ newDocFile ? newDocFile.name : 'No file attached' }}</div>
                <div v-if="docFileError" class="text-caption text-negative">A file is required</div>
                <div v-else class="text-caption text-grey">PDF, PNG, or JPG</div>
              </div>
              <q-btn
                outline
                color="primary"
                label="Attach File"
                size="sm"
                @click="fileInputRef?.click()"
              />
            </div>
            <q-btn
              color="primary"
              label="Add Document"
              size="sm"
              :disable="!newDocDescription.trim()"
              @click="addDoc"
            />
          </div>
        </template>
        <input
          ref="fileInputRef"
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          style="display: none"
          @change="onFileSelected"
        />
      </q-card-section>
      <q-card-actions align="right">
        <div v-if="pendingDocPartial" class="text-caption text-negative q-mr-auto q-pl-sm">
          Complete or clear the pending entry before saving.
        </div>
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn color="primary" label="Save" :disable="pendingDocPartial" @click="save" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import { useCertificationStore } from 'src/stores/certification-store';
import { useAuthStore } from 'src/stores/auth-store';
import type { CertificationModel, CertificationDocument } from './models';

const props = defineProps<{
  modelValue: boolean;
  model: CertificationModel;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const certStore = useCertificationStore();
const authStore = useAuthStore();

const draftDescription = ref('');
const draftDocs = ref<CertificationDocument[]>([]);
const newDocDescription = ref('');
const newDocFile = ref<File | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);
const docFileError = ref(false);
const showUploadForm = ref(false);

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      draftDescription.value = props.model.description ?? '';
      draftDocs.value = (props.model.documents ?? []).map((d) => ({ ...d }));
      newDocDescription.value = '';
      newDocFile.value = null;
      docFileError.value = false;
      showUploadForm.value = false;
    }
  },
  { immediate: true },
);

const pendingDocPartial = computed(() => !!newDocDescription.value.trim() !== !!newDocFile.value);

function viewDoc(url: string) {
  window.open(url, '_blank');
}

function onFileSelected(e: Event) {
  newDocFile.value = (e.target as HTMLInputElement).files?.[0] ?? null;
  if (newDocFile.value) docFileError.value = false;
}

function addDoc() {
  if (!newDocDescription.value.trim()) return;
  if (!newDocFile.value) {
    docFileError.value = true;
    return;
  }
  const maxId = draftDocs.value.reduce((max, d) => Math.max(max, d.id), 0);
  draftDocs.value.push({
    id: maxId + 1,
    description: newDocDescription.value.trim(),
    url: URL.createObjectURL(newDocFile.value),
    uploadedAt: new Date(),
    uploadedBy: authStore.user?.id ?? 0,
  });
  newDocDescription.value = '';
  newDocFile.value = null;
  if (fileInputRef.value) fileInputRef.value.value = '';
}

function removeDoc(index: number) {
  draftDocs.value.splice(index, 1);
}

async function save() {
  if (newDocDescription.value.trim() && newDocFile.value) {
    addDoc();
  }
  await certStore.updateCertificationModel(props.model.id, draftDescription.value.trim(), draftDocs.value);
  emit('update:modelValue', false);
}

function noteAuthor(userId: number): string {
  if (userId === authStore.user?.id) return authStore.fullName;
  return `User #${userId}`;
}

const formatDate = (dateStr: string | Date | undefined) => {
  if (!dateStr) return 'N/A';
  const s = typeof dateStr === 'string' ? dateStr : (dateStr.toISOString().split('T')[0] ?? '');
  const parts = s.split('-');
  const y = parseInt(parts[0] ?? '0', 10);
  const m = parseInt(parts[1] ?? '0', 10);
  const d = parseInt(parts[2] ?? '0', 10);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
</script>
