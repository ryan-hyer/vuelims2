<template>
  <q-page padding>
    <div class="page-header">Projects</div>
    <div class="page-subheader q-pa-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Project List" :to="{ name: 'project-list' }" />
        <q-breadcrumbs-el :label="store.project?.jobNumber ?? props.projectId" />
      </q-breadcrumbs>
    </div>

    <q-separator />

    <q-card flat>
      <div v-if="loading" class="q-pa-xl text-center">
        <q-spinner size="2em" />
      </div>
      <div v-else-if="!store.project" class="q-pa-md text-grey text-italic">Project not found.</div>

      <q-expansion-item
        v-else
        bordered
        class="q-mt-md rounded-borders"
        header-class="bg-grey-4"
        label="Project Information"
        :caption="`${store.project.jobNumber} · ${store.project.customerName} · (Expand to view more)`"
      >
        <q-separator />
        <q-list separator>
          <q-item>
            <q-item-section>
              <q-item-label overline>Job Number</q-item-label>
              <q-item-label class="q-pl-md">{{ store.project.jobNumber }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline>Start Date</q-item-label>
              <q-item-label class="q-pl-md">{{ store.project.startDate }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline>Customer</q-item-label>
              <q-item-label class="q-pl-md">{{ store.project.customerName }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline>
                Project Description
                <q-icon
                  name="edit"
                  size="xs"
                  class="q-ml-xs cursor-pointer text-primary"
                  @click.stop="descPopup?.show()"
                />
              </q-item-label>
              <q-item-label class="q-pl-md" style="white-space: pre-line">
                {{ store.project.description || '—' }}
                <q-popup-edit
                  ref="descPopup"
                  v-model="descEdit"
                  @save="saveDescription"
                  v-slot="scope"
                >
                  <q-input v-model="scope.value" label="Project Description" autofocus dense />
                  <div class="row justify-end q-mt-sm q-gutter-sm">
                    <q-btn flat dense color="grey" label="Cancel" v-close-popup />
                    <q-btn
                      flat
                      dense
                      color="primary"
                      label="Save"
                      :loading="saving"
                      @click="scope.set"
                    />
                  </div>
                </q-popup-edit>
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-if="store.project.completeDate">
            <q-item-section>
              <q-item-label overline>Completed Date</q-item-label>
              <q-item-label class="q-pl-md">{{ store.project.completeDate }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline>
                Documents
                <q-btn
                  round
                  dense
                  size="xs"
                  icon="add"
                  color="green"
                  class="q-ml-xs"
                  @click="openDocsDialog"
                >
                  <q-tooltip>Manage Documents</q-tooltip>
                </q-btn>
              </q-item-label>
              <div class="q-pl-md q-mt-xs">
                <span v-if="!store.project.documents?.length" class="text-grey text-italic"
                  >None</span
                >
                <q-list v-else bordered separator class="rounded-borders">
                  <q-item v-for="doc in store.project.documents" :key="doc.id">
                    <q-item-section>
                      <q-item-label>{{ doc.title }}</q-item-label>
                      <q-item-label caption
                        >{{ docAuthor(doc.uploadedBy) }} ·
                        {{ formatDate(doc.uploadedAt) }}</q-item-label
                      >
                    </q-item-section>
                    <q-item-section side>
                      <q-btn
                        flat
                        round
                        dense
                        icon="open_in_new"
                        color="primary"
                        @click="viewDoc(doc.url)"
                      >
                        <q-tooltip>View Document</q-tooltip>
                      </q-btn>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-expansion-item>
    </q-card>

    <q-card flat bordered class="q-mt-md">
      <q-toolbar class="bg-grey-4 q-py-sm q-pl-md">
        <q-item-label>
          <div class="row items-center q-gutter-xs">
            <span class="text-h6">Project Data</span>
          </div>
        </q-item-label>
      </q-toolbar>
    </q-card>

    <q-dialog v-model="docsDialogOpen" persistent>
      <q-card style="min-width: 480px; max-width: 600px">
        <q-toolbar class="bg-grey-3">
          <q-toolbar-title>
            <div class="text-subtitle1 text-bold">Documents</div>
            <div class="text-caption">{{ store.project?.jobNumber }}</div>
          </q-toolbar-title>
          <q-btn flat round icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section>
          <q-list bordered separator class="rounded-borders q-mb-md" v-if="draftDocs.length">
            <q-item v-for="(doc, i) in draftDocs" :key="doc.id">
              <q-item-section>
                <q-item-label>{{ doc.title }}</q-item-label>
                <q-item-label caption
                  >{{ docAuthor(doc.uploadedBy) }} · {{ formatDate(doc.uploadedAt) }}</q-item-label
                >
              </q-item-section>
              <q-item-section side>
                <q-btn
                  flat
                  round
                  dense
                  icon="open_in_new"
                  color="primary"
                  @click="viewDoc(doc.url)"
                >
                  <q-tooltip>View Document</q-tooltip>
                </q-btn>
              </q-item-section>
              <q-item-section side>
                <q-btn flat round dense icon="delete" color="red-5" @click="removeDoc(i)" />
              </q-item-section>
            </q-item>
          </q-list>
          <div v-else class="text-grey-6 q-mb-md">No documents on file.</div>
          <q-separator class="q-mb-md" />
          <div class="q-gutter-sm">
            <q-input v-model="newDocTitle" outlined dense label="Title" />
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
            <q-btn
              color="primary"
              label="Add Document"
              size="sm"
              :disable="!newDocTitle.trim()"
              @click="addDoc"
            />
          </div>
          <input
            ref="docFileInputRef"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            style="display: none"
            @change="onDocFileSelected"
          />
        </q-card-section>
        <q-card-actions align="right">
          <div v-if="pendingDocPartial" class="text-caption text-negative q-mr-auto q-pl-sm">
            Complete or clear the pending entry before saving.
          </div>
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            color="primary"
            label="Save"
            :disable="pendingDocPartial"
            :loading="savingDocs"
            @click="saveDocs"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useProjectStore } from 'src/stores/project-store';
import { useAuthStore } from 'src/stores/auth-store';
import type { ProjectDocument } from './models';

const props = defineProps<{ projectId: string }>();

const store = useProjectStore();
const authStore = useAuthStore();
const loading = ref(false);
const saving = ref(false);
const descEdit = ref('');
const descPopup = ref<{ show: () => void } | null>(null);

watch(
  () => store.project,
  (val) => {
    if (val) descEdit.value = val.description ?? '';
  },
);

onMounted(async () => {
  loading.value = true;
  store.$patch({ project: null });
  await store.fetchProject(Number(props.projectId));
  if (store.allCustomers.length === 0) {
    await store.fetchProjectLookups();
  }
  loading.value = false;
});

async function saveDescription(val: string) {
  if (!store.project) return;
  saving.value = true;
  await store.updateProject({ ...store.project, description: val });
  saving.value = false;
}

// Documents dialog
const docsDialogOpen = ref(false);
const savingDocs = ref(false);
const draftDocs = ref<ProjectDocument[]>([]);
const newDocTitle = ref('');
const newDocFile = ref<File | null>(null);
const docFileInputRef = ref<HTMLInputElement | null>(null);
const docFileError = ref(false);

const pendingDocPartial = computed(() => !!newDocTitle.value.trim() !== !!newDocFile.value);

function openDocsDialog() {
  draftDocs.value = (store.project?.documents ?? []).map((d) => ({ ...d }));
  newDocTitle.value = '';
  newDocFile.value = null;
  docFileError.value = false;
  docsDialogOpen.value = true;
}

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
    projectId: store.project!.id,
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

async function saveDocs() {
  if (newDocTitle.value.trim() && newDocFile.value) addDoc();
  if (!store.project) return;
  savingDocs.value = true;
  await store.updateProject({ ...store.project, documents: draftDocs.value });
  savingDocs.value = false;
  docsDialogOpen.value = false;
}

function viewDoc(url: string) {
  window.open(url, '_blank');
}

function docAuthor(userId: number): string {
  if (userId === authStore.user?.id) return authStore.fullName;
  return `User #${userId}`;
}

function formatDate(dateVal: string | Date | undefined): string {
  if (!dateVal) return 'N/A';
  const s = typeof dateVal === 'string' ? dateVal : (dateVal.toISOString().split('T')[0] ?? '');
  const parts = s.split('-');
  const y = parseInt(parts[0] ?? '0', 10);
  const m = parseInt(parts[1] ?? '0', 10);
  const d = parseInt(parts[2] ?? '0', 10);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
</script>
