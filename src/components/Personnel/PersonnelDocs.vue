<template>
  <div>
    <q-list separator>
      <q-item>
        <q-item-section>
          <q-item-label class="text-h6">Documentation</q-item-label>
          <q-item-label caption
            >Employee non-training-related documents such as resume, personnel agreement, and
            official correspondence.</q-item-label
          >
        </q-item-section>
        <q-item-section side>
          <q-btn
            rounded
            color="green"
            icon="add_box"
            label="Add New"
            @click="newFormVisible = true"
          />
        </q-item-section>
      </q-item>

      <q-item v-if="newFormVisible">
        <q-card bordered style="width: 100%" class="q-pa-sm">
          <q-form @submit="submitDoc" class="q-gutter-sm">
            <q-input
              filled
              autofocus
              v-model="newDoc.title"
              label="Document Title *"
              lazy-rules
              :rules="[(val) => !!val || 'Cannot be blank']"
            />
            <q-input filled type="textarea" rows="2" v-model="newDoc.description" label="Notes (optional)" />
            <div class="row items-center q-gutter-sm q-pa-sm">
              <q-icon name="attach_file" size="sm" :color="pendingFile ? 'teal' : 'grey'" />
              <div class="col">
                <div class="text-body2">
                  {{ pendingFile ? pendingFile.name : 'No file attached' }}
                </div>
                <div v-if="fileError" class="text-caption text-negative">A file is required</div>
                <div v-else class="text-caption text-grey">PDF, PNG, or JPG *</div>
              </div>
              <q-btn outline color="primary" label="Attach File" @click="fileInputRef?.click()" />
            </div>
            <q-card-actions>
              <q-btn label="Add Document" type="submit" color="teal" :loading="adding" />
              <q-btn label="Cancel" flat class="q-ml-sm" @click="cancelNew" />
            </q-card-actions>
          </q-form>
        </q-card>
      </q-item>

      <q-item v-for="doc in store.employeeDocs" :key="doc.id">
        <q-item-section>
          <q-item-label class="text-h6">{{ doc.title }}</q-item-label>
          <q-item-label caption>{{ doc.description }}</q-item-label>
          <q-item-label caption v-if="doc.uploadDate">Uploaded {{ doc.uploadDate }}</q-item-label>
        </q-item-section>
        <q-item-section side v-if="doc.url">
          <q-btn flat round color="red" icon="picture_as_pdf" @click="viewFile(doc.url)">
            <q-tooltip>View Document</q-tooltip>
          </q-btn>
        </q-item-section>
        <q-item-section side v-else-if="doc.filename">
          <q-btn flat round color="grey" icon="picture_as_pdf" disable>
            <q-tooltip>File not available — please re-upload</q-tooltip>
          </q-btn>
        </q-item-section>
        <q-item-section side>
          <q-btn flat round color="negative" icon="delete" @click="confirmDeleteDoc(doc.id, doc.title)">
            <q-tooltip>Delete Document</q-tooltip>
          </q-btn>
        </q-item-section>
      </q-item>

      <q-item v-if="store.employeeDocs.length === 0">
        <q-icon name="warning" color="warning" size="lg" />
        <q-item-section>
          No documents on file! Upload at least a CV and the signed Personnel Agreement!
        </q-item-section>
      </q-item>
    </q-list>

    <input
      ref="fileInputRef"
      type="file"
      accept=".pdf,.png,.jpg,.jpeg"
      style="display: none"
      @change="onFileSelected"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { usePersonnelStore } from 'src/stores/personnel-store';
import type { Employee } from './models';

const props = defineProps<{ employee: Employee }>();

const $q = useQuasar();
const store = usePersonnelStore();

const newFormVisible = ref(false);
const adding = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);
const pendingFile = ref<File | null>(null);

const newDoc = ref({ title: '', description: '' });
const fileError = ref(false);

const viewFile = (url: string | null) => {
  if (url) window.open(url, '_blank');
};

const onFileSelected = (e: Event) => {
  pendingFile.value = (e.target as HTMLInputElement).files?.[0] ?? null;
  if (pendingFile.value) fileError.value = false;
};

const cancelNew = () => {
  newFormVisible.value = false;
  newDoc.value = { title: '', description: '' };
  pendingFile.value = null;
  fileError.value = false;
  if (fileInputRef.value) fileInputRef.value.value = '';
};

const submitDoc = async () => {
  if (!pendingFile.value) {
    fileError.value = true;
    return;
  }
  adding.value = true;
  const url = pendingFile.value ? URL.createObjectURL(pendingFile.value) : null;
  const uploadDate = pendingFile.value ? new Date().toISOString().substring(0, 10) : null;
  await store.addEmployeeDoc({
    employeeId: props.employee.id,
    title: newDoc.value.title,
    description: newDoc.value.description,
    filename: pendingFile.value?.name ?? null,
    uploadDate,
    url,
  });
  adding.value = false;
  cancelNew();
};

const confirmDeleteDoc = (id: number, title: string) => {
  $q.dialog({
    title: 'Delete Document',
    message: `Delete "${title}"? This cannot be undone.`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    void store.deleteEmployeeDoc(id);
  });
};

onMounted(async () => {
  await store.fetchEmployeeDocs(props.employee.id);
});
</script>
