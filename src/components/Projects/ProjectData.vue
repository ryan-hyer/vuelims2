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

    <q-expansion-item
      v-for="sheet in standardSheets"
      :key="sheet.id"
      v-model="sheetExpanded[sheet.id]!"
      bordered
      class="rounded-borders q-mt-md"
      header-class="bg-grey-2"
    >
      <template v-slot:header>
        <q-item-section avatar>
          <q-icon v-bind="sheetIcon(sheet)" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-subtitle2 row items-center">
            {{ standardLabel(sheet.standardId) }} ({{ revisionLabel(sheet.standardRevisionId) }})
            <q-btn
              v-if="!isLocked && revisionsFor(sheet.standardId).length > 1"
              flat
              dense
              round
              size="sm"
              icon="history"
              color="grey-6"
              class="q-ml-xs"
              @click.stop
            >
              <q-tooltip>Use a different revision</q-tooltip>
              <q-menu auto-close>
                <q-list dense>
                  <q-item
                    v-for="rev in revisionsFor(sheet.standardId)"
                    :key="rev.id"
                    clickable
                    :active="rev.id === sheet.standardRevisionId"
                    @click="changeRevision(sheet, rev.id)"
                  >
                    <q-item-section>{{ rev.revision }}</q-item-section>
                    <q-item-section v-if="rev.id === latestRevisionId(sheet.standardId)" side>
                      <q-item-label caption>latest</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-item-label>
          <q-item-label caption>{{ sheetSummary(sheet) }}</q-item-label>
        </q-item-section>
      </template>
      <q-separator />
      <div class="q-pa-md">
        <StandardSheet
          v-if="templateFor(sheet)"
          v-model:data="sheet.data as unknown as StandardSheetData"
          :template="templateFor(sheet)!"
          :samples="testedSamples"
          :equipment="store.equipment"
          :readonly="isLocked"
        />
        <div v-else class="text-grey-6 text-italic">
          Datasheet template for this standard revision not built yet.
        </div>
      </div>
    </q-expansion-item>

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
import StandardSheet from './DataTemplates/StandardSheet.vue';
import {
  clauseStatus,
  findStandardTemplate,
  normalizeSheetData,
  sheetContext,
  sheetMissing,
} from './DataTemplates/standards';
import type { StandardSheetData } from './DataTemplates/standards/types';
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
    modelNumber: s.modelNumber ?? '',
    dateReceived: s.dateReceived,
    description: s.description,
    shippedVia: s.shippedVia,
    receivedBy: s.receivedBy,
  };
}

// Snapshot of the drafts as loaded, after filling in defaults; compared to detect changes
const baseline = ref('');
const snapshot = () => JSON.stringify([draftSheets.value, draftSamples.value]);

watch(
  () => store.projectData,
  (bundle) => {
    const sheets = JSON.parse(JSON.stringify(bundle?.sheets ?? [])) as DataSheet[];
    draftSamples.value = (bundle?.samples ?? []).map(toDraftSample);
    draftSheets.value = sheets.map(normalizeSheet);
    baseline.value = snapshot();
  },
);

// Samples are identified by sample number in each datasheet's results
const sampleKeys = computed(() => draftSamples.value.map((s) => s.number));
const testedSamples = computed(() =>
  draftSamples.value.map((s) => ({ key: s.number, model: s.modelNumber })),
);

// A newly logged sample gets an empty column of results in each datasheet
watch(sampleKeys, () => {
  for (const sheet of standardSheets.value) {
    if (templateFor(sheet)) Object.assign(sheet, normalizeSheet(sheet));
  }
});

const isDirty = computed(() => !!store.projectData && snapshot() !== baseline.value);

function normalizeSheet(sheet: DataSheet): DataSheet {
  if (sheet.kind === 'testing-common') {
    const data = sheet.data as unknown as TestingCommonData;
    data.modelNumbers ??= [];
    return sheet;
  }
  const template = templateFor(sheet);
  if (!template) return sheet;
  const data = normalizeSheetData(template, sheet.data, sampleKeys.value);
  return { ...sheet, data: data as unknown as Record<string, unknown> };
}

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
const SAMPLE_LABELS: Record<
  Exclude<keyof TestingCommonData, 'manufacturer' | 'modelNumbers'>,
  string
> = {
  sampleDescription: 'sample description',
  samplePlan: 'sampling plan',
  samplingDate: 'sampling date',
  samplingLocation: 'sampling location',
};

const commonMissing = computed(() => {
  const common = commonSheet.value?.data as TestingCommonData | undefined;
  if (!common) return [];
  const result: string[] = [];
  if (!common.modelNumbers?.length) result.push('models covered');
  if (!draftSamples.value.length) result.push('at least one sample');
  if (draftSamples.value.some((s) => !common.modelNumbers?.includes(s.modelNumber))) {
    result.push('model for each sample');
  }
  for (const [key, label] of Object.entries(MANUFACTURER_LABELS)) {
    if (!common.manufacturer[key as keyof ManufacturerInfo].trim()) result.push(label);
  }
  for (const [key, label] of Object.entries(SAMPLE_LABELS)) {
    if (!common[key as keyof typeof SAMPLE_LABELS].trim()) result.push(label);
  }
  return result;
});

const missing = computed(() => [
  ...commonMissing.value,
  ...standardSheets.value
    .filter((sheet) => sheetMissingFor(sheet).length)
    .map((sheet) => `${standardLabel(sheet.standardId)} (${sheetMissingFor(sheet).join(', ')})`),
]);

const commonSummary = computed(() => {
  const count = commonMissing.value.length;
  if (count) return `${count} field${count === 1 ? '' : 's'} still needed`;
  const common = commonSheet.value?.data as TestingCommonData | undefined;
  const samples = draftSamples.value.length;
  return `${common?.manufacturer.name} · ${samples} sample${samples === 1 ? '' : 's'} · Complete`;
});

// Collapsed once complete, so attention moves to the standard datasheets
const commonExpanded = ref(true);

// --- Standard datasheets ---
const sheetExpanded = ref<Record<number, boolean>>({});

function templateFor(sheet: DataSheet) {
  const number = standardStore.standards.find((s) => s.id === sheet.standardId)?.number;
  const revision = revisionLabel(sheet.standardRevisionId);
  return number ? findStandardTemplate(number, revision) : undefined;
}

function sheetMissingFor(sheet: DataSheet): string[] {
  const template = templateFor(sheet);
  if (!template) return [];
  return sheetMissing(template, sheet.data as unknown as StandardSheetData, sampleKeys.value);
}

function failingClauses(sheet: DataSheet) {
  const template = templateFor(sheet);
  if (!template) return [];
  const data = sheet.data as unknown as StandardSheetData;
  const ctx = sheetContext(template, data, sampleKeys.value);
  return template.clauses.filter(
    (c) => clauseStatus(c, data.clauses[c.number]!, ctx) === 'does-not-comply',
  );
}

function sheetIcon(sheet: DataSheet) {
  if (!templateFor(sheet)) return { name: 'construction', color: 'grey-5' };
  if (failingClauses(sheet).length) return { name: 'cancel', color: 'negative' };
  return sheetMissingFor(sheet).length
    ? { name: 'pending', color: 'orange' }
    : { name: 'check_circle', color: 'positive' };
}

function sheetSummary(sheet: DataSheet) {
  if (!templateFor(sheet)) return 'No datasheet template yet';
  const missingSections = sheetMissingFor(sheet);
  if (missingSections.length) return `Still needed: ${missingSections.join(', ')}`;
  const failures = failingClauses(sheet);
  return failures.length
    ? `Complete · ${failures.length} section${failures.length === 1 ? '' : 's'} DOES NOT COMPLY`
    : 'Complete · Complies';
}

// Keeps whatever data still matches the new revision's template (by clause number and field key)
function changeRevision(sheet: DataSheet, revisionId: number) {
  sheet.standardRevisionId = revisionId;
  Object.assign(sheet, normalizeSheet(sheet));
}

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
  // Standards first: picking each sheet's datasheet template (and its defaults) needs them
  await Promise.all([
    standardStore.standards.length ? Promise.resolve() : standardStore.fetchStandards(),
    store.equipment.length ? Promise.resolve() : store.fetchEquipment(),
  ]);
  await store.fetchProjectData(props.project.id);
  await nextTick(); // let the drafts populate from the fetched data
  commonExpanded.value = commonMissing.value.length > 0;
  for (const sheet of standardSheets.value) {
    sheetExpanded.value[sheet.id] = sheetMissingFor(sheet).length > 0;
  }
  loading.value = false;
});
</script>

<style scoped>
.notes div {
  padding-bottom: 10px;
}
</style>
