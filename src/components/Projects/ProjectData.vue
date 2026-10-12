<template>
  <div v-if="loading" class="q-pa-md text-center">
    <q-spinner size="2em" />
  </div>

  <div v-else-if="isTesting">
    <q-banner v-if="isLocked" rounded class="bg-blue-grey-1 q-mb-md">
      <template v-slot:avatar>
        <q-icon name="lock" color="blue-grey" />
      </template>
      Data completed and locked on {{ project.dataLockedAt }}
      <template v-if="store.projectData?.lockedByName">
        by {{ store.projectData.lockedByName }}</template
      >.
      <template v-slot:action>
        <q-btn flat color="primary" label="Reopen for Editing" @click="reopenDialogOpen = true">
          <q-tooltip>Allowed until a deliverable has been generated</q-tooltip>
        </q-btn>
      </template>
    </q-banner>

    <q-expansion-item
      v-if="commonSheet"
      v-model="commonExpanded"
      bordered
      class="rounded-borders"
      header-class="bg-grey-2"
    >
      <template v-slot:header>
        <q-item-section avatar>
          <q-icon
            :name="commonMissing.length ? 'pending' : 'check_circle'"
            :color="commonMissing.length ? 'orange' : 'positive'"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-subtitle2">Samples & Common Data</q-item-label>
          <q-item-label caption>{{ commonSummary }}</q-item-label>
        </q-item-section>
      </template>
      <q-separator />
      <div class="q-pa-md">
        <TestingCommonSheet
          v-model:data="commonSheet.data as unknown as TestingCommonData"
          v-model:samples="draftSamples"
          :job-number="project.jobNumber"
          :customer-id="project.customerId"
          :receiver-name="authStore.fullName"
          :readonly="isLocked"
        />
      </div>
    </q-expansion-item>

    <div v-for="sheet in standardSheets" :key="sheet.id" class="q-mt-lg">
      <q-separator spaced />
      <div class="text-subtitle2 q-mb-sm row items-center">
        {{ standardLabel(sheet.standardId) }}
        <span class="q-ml-xs">({{ revisionLabel(sheet.standardRevisionId) }})</span>
        <q-btn
          v-if="!isLocked && revisionsFor(sheet.standardId).length > 1"
          flat
          dense
          size="sm"
          icon="history"
          color="grey-6"
          class="q-ml-xs"
        >
          <q-tooltip>Use a different revision</q-tooltip>
          <q-menu auto-close>
            <q-list dense>
              <q-item
                v-for="rev in revisionsFor(sheet.standardId)"
                :key="rev.id"
                clickable
                :active="rev.id === sheet.standardRevisionId"
                @click="sheet.standardRevisionId = rev.id"
              >
                <q-item-section>{{ rev.revision }}</q-item-section>
                <q-item-section v-if="rev.id === latestRevisionId(sheet.standardId)" side>
                  <q-item-label caption>latest</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
      <div class="text-grey-6 text-italic">Datasheet template for this standard not built yet.</div>
    </div>

    <q-separator spaced />
    <div v-if="!isLocked" class="row justify-end items-center q-gutter-sm">
      <div v-if="isDirty" class="text-caption text-grey-7 q-mr-auto">Unsaved changes</div>
      <q-btn
        outline
        color="primary"
        label="Save"
        :disable="!isDirty"
        :loading="saving"
        @click="save"
      />
      <div>
        <q-btn
          color="primary"
          icon="lock"
          label="Complete & Lock"
          :disable="missing.length > 0"
          @click="lockDialogOpen = true"
        />
        <q-tooltip v-if="missing.length">Still needed: {{ missing.join(', ') }}</q-tooltip>
      </div>
    </div>

    <q-dialog v-model="lockDialogOpen">
      <q-card style="max-width: 440px">
        <q-card-section class="text-h6">Complete & Lock Data?</q-card-section>
        <q-card-section class="q-pt-none">
          This saves all project data and marks it complete, which enables deliverable generation.
          Once a deliverable has been generated, data can only be changed through a formal revision.
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="primary" label="Complete & Lock" :loading="saving" @click="lock" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="reopenDialogOpen">
      <q-card style="max-width: 440px">
        <q-card-section class="text-h6">Reopen Data for Editing?</q-card-section>
        <q-card-section class="q-pt-none">
          The data will need to be completed and locked again before deliverables can be generated.
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="primary" label="Reopen" :loading="saving" @click="reopen" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>

  <div v-else class="notes">
    <div>
      Enter data here. This will be different for every project type. This component should select
      and display one or more sub-components based on the project type.
    </div>
    <ul>
      <li>LS jobs: Certification Datasheet</li>
      <li>IS jobs: Inspection Checklist, depending on the inspection type selected</li>
      <li>TS jobs: done (common sample data + one datasheet per standard)</li>
    </ul>
    <div>
      If changes to data need to be made, there needs to be a data revision process, which will
      record the user and date related to the change, and then enable generation of a revised
      deliverable. No casual edits after a deliverable has been generated.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import { useProjectStore } from 'src/stores/project-store';
import { useStandardStore } from 'src/stores/standard-store';
import { useAuthStore } from 'src/stores/auth-store';
import TestingCommonSheet from './DataTemplates/TestingCommonSheet.vue';
import type {
  DataSheet,
  DraftSample,
  ManufacturerInfo,
  ProjectWithDetails,
  Sample,
  TestingCommonData,
} from './models';

const props = defineProps<{ project: ProjectWithDetails }>();

const store = useProjectStore();
const standardStore = useStandardStore();
const authStore = useAuthStore();

const TESTING_CODES = new Set(['A', 'E', 'F', 'M', 'P', 'ST']);
const isTesting = computed(() => TESTING_CODES.has(props.project.typeCode));
const isLocked = computed(() => !!props.project.dataLockedAt);

const loading = ref(false);
const saving = ref(false);
const lockDialogOpen = ref(false);
const reopenDialogOpen = ref(false);

// Local drafts, reset whenever the store's copy changes (load, save, lock)
const draftSheets = ref<DataSheet[]>([]);
const draftSamples = ref<DraftSample[]>([]);

function toDraftSample(s: Sample): DraftSample {
  return {
    id: s.id,
    number: s.number,
    dateReceived: s.dateReceived,
    description: s.description,
    shippedVia: s.shippedVia,
    receivedBy: s.receivedBy,
  };
}

watch(
  () => store.projectData,
  (bundle) => {
    draftSheets.value = JSON.parse(JSON.stringify(bundle?.sheets ?? [])) as DataSheet[];
    draftSamples.value = (bundle?.samples ?? []).map(toDraftSample);
  },
);

const isDirty = computed(() => {
  const saved = store.projectData;
  if (!saved) return false;
  const savedSamples = saved.samples.map(toDraftSample);
  return (
    JSON.stringify(draftSheets.value) !== JSON.stringify(saved.sheets) ||
    JSON.stringify(draftSamples.value) !== JSON.stringify(savedSamples)
  );
});

const commonSheet = computed(() => draftSheets.value.find((s) => s.kind === 'testing-common'));
const standardSheets = computed(() =>
  draftSheets.value.filter((s) => s.kind === 'testing-standard'),
);

// Required before locking; datasheets for individual standards add their own once built
const MANUFACTURER_LABELS: Record<Exclude<keyof ManufacturerInfo, 'address2'>, string> = {
  name: 'manufacturer name',
  address1: 'manufacturer address',
  city: 'manufacturer city',
  state: 'manufacturer state/province',
  zipCode: 'manufacturer postal code',
  country: 'manufacturer country',
  phone: 'manufacturer phone',
  website: 'manufacturer website',
};
const SAMPLE_LABELS: Record<Exclude<keyof TestingCommonData, 'manufacturer'>, string> = {
  sampleDescription: 'sample description',
  samplePlan: 'sampling plan',
  samplingDate: 'sampling date',
  samplingLocation: 'sampling location',
};

const commonMissing = computed(() => {
  const common = commonSheet.value?.data as TestingCommonData | undefined;
  if (!common) return [];
  const result: string[] = [];
  if (!draftSamples.value.length) result.push('at least one sample');
  for (const [key, label] of Object.entries(MANUFACTURER_LABELS)) {
    if (!common.manufacturer[key as keyof ManufacturerInfo].trim()) result.push(label);
  }
  for (const [key, label] of Object.entries(SAMPLE_LABELS)) {
    if (!common[key as keyof typeof SAMPLE_LABELS].trim()) result.push(label);
  }
  return result;
});

// Datasheets for individual standards will add their own required fields here once built
const missing = computed(() => commonMissing.value);

const commonSummary = computed(() => {
  const count = commonMissing.value.length;
  if (count) return `${count} field${count === 1 ? '' : 's'} still needed`;
  const common = commonSheet.value?.data as TestingCommonData | undefined;
  const samples = draftSamples.value.length;
  return `${common?.manufacturer.name} · ${samples} sample${samples === 1 ? '' : 's'} · Complete`;
});

// Collapsed once complete, so attention moves to the standard datasheets
const commonExpanded = ref(true);

// --- Standards and revisions ---
function standardLabel(standardId?: number) {
  return standardStore.standards.find((s) => s.id === standardId)?.number ?? 'Unknown standard';
}

function revisionsFor(standardId?: number) {
  const number = standardStore.standards.find((s) => s.id === standardId)?.number;
  return number ? standardStore.revisionsByNumber(number) : [];
}

function latestRevisionId(standardId?: number) {
  return revisionsFor(standardId)[0]?.id;
}

function revisionLabel(revisionId?: number) {
  return standardStore.standardRevisions.find((r) => r.id === revisionId)?.revision ?? '—';
}

// --- Actions ---
async function save() {
  saving.value = true;
  await store.saveProjectData(
    props.project.id,
    draftSheets.value,
    draftSamples.value,
    authStore.user?.id ?? 0,
  );
  saving.value = false;
  if (!commonMissing.value.length) commonExpanded.value = false;
}

async function lock() {
  saving.value = true;
  if (isDirty.value) await save();
  saving.value = true;
  await store.lockProjectData(props.project.id, authStore.user?.id ?? 0);
  saving.value = false;
  lockDialogOpen.value = false;
}

async function reopen() {
  saving.value = true;
  await store.unlockProjectData(props.project.id);
  saving.value = false;
  reopenDialogOpen.value = false;
}

onMounted(async () => {
  loading.value = true;
  store.$patch({ projectData: null });
  await Promise.all([
    store.fetchProjectData(props.project.id),
    standardStore.standards.length ? Promise.resolve() : standardStore.fetchStandards(),
  ]);
  await nextTick(); // let the drafts populate from the fetched data
  commonExpanded.value = commonMissing.value.length > 0;
  loading.value = false;
});
</script>

<style scoped>
.notes div {
  padding-bottom: 10px;
}
</style>
