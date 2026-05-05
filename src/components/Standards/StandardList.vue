<template>
  <q-page padding>
    <div class="page-header bg-purple-2">Standards</div>
    <q-table
      :grid="$q.screen.xs"
      flat
      bordered
      :rows="latestStandards"
      :columns="columns"
      row-key="id"
      :loading="loading"
      :filter="filter"
      :pagination="{ sortBy: 'standardNumber' }"
    >
      <template v-slot:top>
        <q-toolbar>
          <q-input v-model="filter" placeholder="Search standards..." dense outlined clearable />
          <q-space />
          <q-btn round color="green" icon="add" class="q-ma-sm" :to="{ name: 'standard-new' }">
            <q-tooltip>Add New Standard</q-tooltip>
          </q-btn>
        </q-toolbar>
        <div class="text-caption text-italic">
          Click the icons to view more information or open the document
        </div>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="expand" :props="props">
            <q-btn
              round
              flat
              dense
              :icon="expandedId === props.row.id ? 'close' : 'info'"
              :color="expandedId === props.row.id ? 'red' : 'blue-5'"
              @click="toggleExpand(props.row.id)"
            >
              <q-tooltip>{{
                expandedId === props.row.id ? 'Close Details' : 'Open Details'
              }}</q-tooltip>
            </q-btn>
          </q-td>
          <q-td key="standardNumber" :props="props">{{ props.row.number }}</q-td>
          <q-td key="revision" :props="props">{{ props.row.revision }}</q-td>
          <q-td key="title" :props="props">{{ props.row.title }}</q-td>
          <q-td key="actions" :props="props">
            <q-btn
              v-if="props.row.url"
              round
              flat
              color="red"
              icon="picture_as_pdf"
              @click="viewDoc(props.row.url)"
            >
              <q-tooltip>View Document</q-tooltip>
            </q-btn>
            <q-btn
              v-else
              round
              flat
              color="grey"
              icon="upload_file"
              @click="openUpload(props.row.id)"
            >
              <q-tooltip>Upload Document</q-tooltip>
            </q-btn>
            <q-btn
              v-if="props.row.webstore_url"
              round
              flat
              color="teal"
              icon="language"
              @click="viewDoc(props.row.webstore_url)"
            >
              <q-tooltip>Open Webstore</q-tooltip>
            </q-btn>
            <q-btn
              v-if="store.revisionsByNumber(props.row.number).length > 1"
              round
              flat
              color="blue-grey"
              icon="history"
              @click="openRevisions(props.row.number)"
            >
              <q-tooltip>Prior Revisions</q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
        <q-tr v-if="expandedId === props.row.id" :props="props">
          <q-td colspan="100%" class="q-pa-none">
            <StandardDetailPanel
              :row="props.row"
              :is-editing="editingId === props.row.id"
              @start-edit="editingId = props.row.id"
              @cancel-edit="cancelEdit"
              @save="submitEdit"
            />
          </q-td>
        </q-tr>
      </template>

      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
          <q-card bordered flat>
            <q-card-section>
              <div class="row items-start no-wrap">
                <div class="col">
                  <div class="text-subtitle2">{{ props.row.number }}</div>
                  <div class="text-caption text-grey">Revision {{ props.row.revision }}</div>
                </div>
                <div class="col-auto">
                  <q-btn
                    round
                    flat
                    dense
                    :icon="expandedId === props.row.id ? 'close' : 'info'"
                    :color="expandedId === props.row.id ? 'red' : 'blue-5'"
                    @click="toggleExpand(props.row.id)"
                  >
                    <q-tooltip>{{
                      expandedId === props.row.id ? 'Close Details' : 'Open Details'
                    }}</q-tooltip>
                  </q-btn>
                  <q-btn
                    v-if="props.row.url"
                    round
                    flat
                    dense
                    color="red"
                    icon="picture_as_pdf"
                    @click="viewDoc(props.row.url)"
                  >
                    <q-tooltip>View Document</q-tooltip>
                  </q-btn>
                  <q-btn
                    v-else
                    round
                    flat
                    dense
                    color="grey"
                    icon="upload_file"
                    @click="openUpload(props.row.id)"
                  >
                    <q-tooltip>Upload Document</q-tooltip>
                  </q-btn>
                  <q-btn
                    v-if="props.row.webstore_url"
                    round
                    flat
                    dense
                    color="teal"
                    icon="language"
                    @click="viewDoc(props.row.webstore_url)"
                  >
                    <q-tooltip>Open Webstore</q-tooltip>
                  </q-btn>
                  <q-btn
                    v-if="store.revisionsByNumber(props.row.number).length > 1"
                    round
                    flat
                    dense
                    color="blue-grey"
                    icon="history"
                    @click="openRevisions(props.row.number)"
                  >
                    <q-tooltip>Prior Revisions</q-tooltip>
                  </q-btn>
                </div>
              </div>
              <div class="text-body2 q-mt-sm" style="white-space: normal; word-break: break-word">
                {{ props.row.title }}
              </div>
            </q-card-section>
            <q-card-section v-if="expandedId === props.row.id" class="q-pa-none">
              <StandardDetailPanel
                :row="props.row"
                :is-editing="editingId === props.row.id"
                :click-tooltips="true"
                @start-edit="editingId = props.row.id"
                @cancel-edit="cancelEdit"
                @save="submitEdit"
              />
            </q-card-section>
          </q-card>
        </div>
      </template>
    </q-table>

    <q-dialog v-model="revisionsDialog">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Prior Revisions</div>
          <q-space />
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>
        <q-card-section class="text-subtitle2 text-grey q-pt-xs">
          {{ revisionsDialogNumber }}
        </q-card-section>
        <q-card-section>
          <q-list bordered separator>
            <q-item v-for="rev in dialogRevisions" :key="rev.id" class="items-center">
              <q-item-section>
                <q-item-label>{{ rev.revision }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  v-if="rev.url"
                  round
                  flat
                  color="red"
                  icon="picture_as_pdf"
                  @click="viewDoc(rev.url!)"
                >
                  <q-tooltip>View Document</q-tooltip>
                </q-btn>
                <q-btn
                  v-else
                  round
                  flat
                  color="grey"
                  icon="upload_file"
                  @click="openUpload(rev.id)"
                >
                  <q-tooltip>Upload Document</q-tooltip>
                </q-btn>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="uploadDialog" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Upload Standard Document</div>
        </q-card-section>
        <q-card-section>
          <div class="row items-center q-gutter-sm">
            <q-icon name="attach_file" size="sm" :color="pendingFile ? 'teal' : 'grey'" />
            <div class="col">
              <div class="text-body2">
                {{ pendingFile ? pendingFile.name : 'No file selected' }}
              </div>
              <div class="text-caption text-grey">PDF files only</div>
            </div>
            <q-btn outline color="primary" label="Choose File" @click="fileInputRef?.click()" />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" @click="cancelUpload" />
          <q-btn
            color="teal"
            label="Upload"
            :loading="uploading"
            :disable="!pendingFile"
            @click="submitUpload"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <input
      ref="fileInputRef"
      type="file"
      accept=".pdf"
      style="display: none"
      @change="onFileSelected"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { QTableColumn } from 'quasar';
import { useStandardStore } from 'src/stores/standard-store';
import type { Standard } from 'src/components/Standards/models';
import StandardDetailPanel from 'src/components/Standards/StandardDetailPanel.vue';

const store = useStandardStore();

const filter = ref('');
const loading = ref(false);
const uploadDialog = ref(false);
const uploading = ref(false);
const uploadingId = ref<number | null>(null);
const pendingFile = ref<File | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);
const revisionsDialog = ref(false);
const revisionsDialogNumber = ref('');
const expandedId = ref<number | null>(null);
const editingId = ref<number | null>(null);

const latestStandards = computed(() => store.latestStandards);
const dialogRevisions = computed(() =>
  revisionsDialogNumber.value ? store.revisionsByNumber(revisionsDialogNumber.value).slice(1) : [],
);

onMounted(async () => {
  loading.value = true;
  await store.fetchStandards();
  loading.value = false;
});

function toggleExpand(id: number) {
  if (expandedId.value === id) {
    expandedId.value = null;
    cancelEdit();
  } else {
    expandedId.value = id;
    cancelEdit();
  }
}

function cancelEdit() {
  editingId.value = null;
}

async function submitEdit(updated: Standard) {
  await store.updateStandard(updated);
  cancelEdit();
}

function viewDoc(url: string) {
  window.open(url, '_blank');
}

function openUpload(id: number) {
  uploadingId.value = id;
  pendingFile.value = null;
  uploadDialog.value = true;
}

function openRevisions(number: string) {
  revisionsDialogNumber.value = number;
  revisionsDialog.value = true;
}

function onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  pendingFile.value = input.files?.[0] ?? null;
}

function cancelUpload() {
  uploadDialog.value = false;
  uploadingId.value = null;
  pendingFile.value = null;
  if (fileInputRef.value) fileInputRef.value.value = '';
}

async function submitUpload() {
  if (!uploadingId.value || !pendingFile.value) return;
  uploading.value = true;
  await store.uploadDoc(uploadingId.value, pendingFile.value);
  uploading.value = false;
  cancelUpload();
}

const columns: QTableColumn[] = [
  {
    name: 'expand',
    label: '',
    field: '',
    align: 'center',
    sortable: false,
    style: 'width: 40px;',
  },
  {
    name: 'standardNumber',
    label: 'Standard Number',
    field: 'number',
    align: 'left',
    sort: (a: string, b: string) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }),
  },
  {
    name: 'revision',
    label: 'Revision',
    field: 'revision',
    align: 'left',
  },
  {
    name: 'title',
    label: 'Title',
    field: 'title',
    align: 'left',
    style: 'white-space: normal; word-break: break-word; max-width: 400px;',
  },
  {
    name: 'actions',
    label: '',
    field: '',
    align: 'center',
    sortable: false,
    style: 'width: 150px;',
  },
];
</script>
