<template>
  <q-page padding>
    <div class="page-header">Projects</div>
    <div class="page-subheader q-pa-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Project List" :to="{ name: 'project-list' }" />
        <q-breadcrumbs-el label="Add New Project" />
      </q-breadcrumbs>
    </div>

    <q-separator />

    <div class="q-pa-md">
      <form @submit.prevent.stop="submitForm">
        <Transition name="fade" mode="out-in">
          <div v-if="!projectType">
            <q-select
              filled
              options-dense
              v-model="projectType"
              :options="store.projectTypes"
              label="Project Type"
              hint="Select the type of project to add"
            />
          </div>
          <div v-else>
            <!-- Common fields -->
            <q-input
              filled
              v-model="newProject.jobNumber"
              label="Job Number"
              lazy-rules
              :ref="(el) => setFieldRef('jobNumber', el)"
              :rules="[(val) => (val && val.length > 0) || 'Cannot be blank']"
            />
            <DateInput
              v-model="newProject.startDate"
              label="Start Date (yyyy/mm/dd)"
              field-name="startDate"
              :set-field-ref="setFieldRef"
            />

            <q-select
              filled
              v-model="newProject.customerId"
              use-input
              options-dense
              emit-value
              map-options
              input-debounce="200"
              label="Customer"
              :options="filteredCustomers"
              option-value="id"
              :option-label="customerOptionLabel"
              @filter="filterCustomers"
              lazy-rules
              :ref="(el) => setFieldRef('customerId', el)"
              :rules="[(val) => !!val || 'Cannot be blank']"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">No results</q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-input
              filled
              type="textarea"
              v-model="newProject.description"
              label="Project Description"
              lazy-rules
              :ref="(el) => setFieldRef('description', el)"
              :rules="[(val) => (val && val.length > 0) || 'Cannot be blank']"
            />

            <!-- Testing fields -->
            <template v-if="projectCategory === 'testing'">
              <q-separator spaced />
              <div class="text-subtitle2 q-mb-sm">Testing Details</div>

              <q-input
                filled
                v-model="testing.manufacturer"
                label="Manufacturer"
                lazy-rules
                :ref="(el) => setFieldRef('manufacturer', el)"
                :rules="[(val) => (val && val.length > 0) || 'Cannot be blank']"
              />

              <q-select
                filled
                multiple
                use-chips
                use-input
                v-model="testing.standardIds"
                options-dense
                emit-value
                map-options
                input-debounce="200"
                label="Standards"
                hint="Type to search by standard number"
                :options="filteredStandards"
                option-value="id"
                option-label="label"
                @filter="filterStandards"
                lazy-rules
                :ref="(el) => setFieldRef('standardIds', el)"
                :rules="[(val) => (val && val.length > 0) || 'Select at least one standard']"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">No results</q-item-section>
                  </q-item>
                </template>
              </q-select>

              <q-input
                filled
                type="textarea"
                v-model="testing.sampleDescription"
                label="Sample Description"
                lazy-rules
                :ref="(el) => setFieldRef('sampleDescription', el)"
                :rules="[(val) => (val && val.length > 0) || 'Cannot be blank']"
              />

              <q-input
                filled
                type="textarea"
                v-model="testing.samplePlan"
                label="Sample Plan"
                lazy-rules
                :ref="(el) => setFieldRef('samplePlan', el)"
                :rules="[(val) => (val && val.length > 0) || 'Cannot be blank']"
              />

              <DateInput
                v-model="testing.samplingDate"
                label="Sampling Date (yyyy/mm/dd)"
                field-name="samplingDate"
                :set-field-ref="setFieldRef"
              />

              <q-input
                filled
                v-model="testing.samplingLocation"
                label="Sampling Location"
                lazy-rules
                :ref="(el) => setFieldRef('samplingLocation', el)"
                :rules="[(val) => (val && val.length > 0) || 'Cannot be blank']"
              />
            </template>

            <!-- Inspection fields -->
            <template v-if="projectCategory === 'inspection'">
              <q-separator spaced />
              <div class="text-subtitle2 q-mb-sm">Inspection Details</div>

              <div>
                <q-select
                  filled
                  options-dense
                  v-model="inspection.inspectionLocation"
                  :options="customerLocations"
                  label="Inspection Location"
                  :disable="!newProject.customerId"
                  lazy-rules
                  :ref="(el) => setFieldRef('inspectionLocation', el)"
                  :rules="[(val) => (val && val.length > 0) || 'Cannot be blank']"
                />
                <q-tooltip v-if="!newProject.customerId">Select a customer above first</q-tooltip>
              </div>

              <q-input
                filled
                v-model="inspection.inspectionType"
                label="Inspection Type"
                lazy-rules
                :ref="(el) => setFieldRef('inspectionType', el)"
                :rules="[(val) => (val && val.length > 0) || 'Cannot be blank']"
              />
            </template>

            <!-- Certification fields -->
            <template v-if="projectCategory === 'certification'">
              <q-separator spaced />
              <div class="text-subtitle2 q-mb-sm">Certification Details</div>

              <q-select
                v-if="selectedCustomerHasListing"
                filled
                options-dense
                emit-value
                map-options
                v-model="certification.projectSubtype"
                :options="certSubtypeOptions"
                label="Project Subtype"
                lazy-rules
                :ref="(el) => setFieldRef('projectSubtype', el)"
                :rules="[(val) => !!val || 'Cannot be blank']"
              />

              <!-- Product types sub-form (new, scope change, redesign subtypes only) -->
              <div v-if="showProjectCategories" class="q-mt-md">
                <div class="text-subtitle2 q-mb-sm">
                  Product Types
                  <span
                    v-if="draftCategories.length === 0"
                    class="text-caption text-negative q-ml-xs"
                  >At least one required</span>
                </div>

                <q-list v-if="draftCategories.length" bordered separator class="rounded-borders q-mb-sm">
                  <q-expansion-item
                    v-for="(cat, i) in draftCategories"
                    :key="i"
                    :label="certProductTypeLabel(cat.certificationProductTypeId)"
                  >
                    <q-card>
                      <q-card-section class="q-pa-sm">
                        <div class="row items-start">
                          <div class="col">
                            <template v-if="cat.newModelNumbers?.length">
                              <div class="text-caption text-grey q-mb-xs">Adding</div>
                              <div class="q-gutter-xs q-mb-sm">
                                <q-chip v-for="mn in cat.newModelNumbers" :key="mn" dense color="green-2" text-color="dark">{{ mn }}</q-chip>
                              </div>
                            </template>
                            <template v-if="cat.affectedModels?.length">
                              <div class="text-caption text-grey q-mb-xs">Affected models</div>
                              <div class="q-gutter-xs q-mb-sm">
                                <q-chip v-for="m in cat.affectedModels" :key="m.id" dense color="blue-grey-2" text-color="dark">{{ m.modelNumber }}</q-chip>
                              </div>
                            </template>
                            <template v-if="cat.removedModels?.length">
                              <div class="text-caption text-grey q-mb-xs">Removing</div>
                              <div class="q-gutter-xs q-mb-sm">
                                <q-chip v-for="m in cat.removedModels" :key="m.id" dense color="red-2" text-color="dark">{{ m.modelNumber }}</q-chip>
                              </div>
                            </template>
                            <div
                              v-if="!cat.newModelNumbers?.length && !cat.affectedModels?.length && !cat.removedModels?.length"
                              class="text-caption text-grey"
                            >No models specified</div>
                          </div>
                          <q-btn flat round dense icon="delete" color="red-5" @click="removeCategory(i)" />
                        </div>
                      </q-card-section>
                    </q-card>
                  </q-expansion-item>
                </q-list>

                <q-card flat bordered class="q-mb-sm">
                  <q-card-section>
                    <div class="text-caption text-grey q-mb-sm">Add Product Type</div>

                    <q-select
                      outlined
                      dense
                      options-dense
                      use-input
                      emit-value
                      map-options
                      input-debounce="200"
                      v-model="draftCategory.certificationProductTypeId"
                      :options="filteredProductTypes"
                      option-value="id"
                      option-label="label"
                      @filter="filterProductTypes"
                      label="Product Type"
                      class="q-mb-sm"
                    >
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">No results</q-item-section>
                        </q-item>
                      </template>
                    </q-select>

                    <!-- New: comma-delimited textarea -->
                    <template v-if="certification.projectSubtype === 'new' || certification.projectSubtype === 'scope change'">
                      <q-input
                        outlined
                        dense
                        type="textarea"
                        rows="2"
                        v-model="draftCategory.newModelNumbersText"
                        :label="certification.projectSubtype === 'scope change' ? 'Models to Add (comma-separated, optional)' : 'Model Numbers (comma-separated)'"
                        class="q-mb-sm"
                      />
                    </template>

                    <!-- Redesign / Scope Change: select existing models -->
                    <template v-if="certification.projectSubtype === 'redesign' || certification.projectSubtype === 'scope change'">
                      <template v-if="draftCategory.certificationProductTypeId">
                        <q-select
                          v-if="existingModelsForDraft.length"
                          outlined
                          dense
                          multiple
                          use-chips
                          options-dense
                          emit-value
                          map-options
                          v-model="draftCategory.selectedExistingModelIds"
                          :options="existingModelsForDraft"
                          option-value="id"
                          option-label="modelNumber"
                          :label="certification.projectSubtype === 'scope change' ? 'Models to Remove' : 'Affected Models'"
                          class="q-mb-sm"
                        />
                        <div v-else class="text-caption text-grey q-mb-sm">No existing models found for this product type.</div>
                      </template>
                      <div v-else class="text-caption text-grey q-mb-sm">Select a product type above to see existing models.</div>
                    </template>

                    <q-btn
                      color="primary"
                      size="sm"
                      label="Add Product Type"
                      :disable="!draftCategory.certificationProductTypeId"
                      @click="addCategory"
                    />
                  </q-card-section>
                </q-card>

                <div v-if="pendingCategoryPartial" class="text-caption text-negative q-mb-sm">
                  Complete or clear the pending product type before submitting.
                </div>
              </div>

              <!-- Facility fields (shown for New and Facility Change subtypes) -->
              <div v-if="certification.projectSubtype === 'facility' || certification.projectSubtype === 'new'" class="q-mt-md">
                <div class="text-subtitle2 q-mb-sm">Facility Details</div>
                <!-- New subtype: multi-select -->
                <q-select
                  v-if="certification.projectSubtype === 'new'"
                  filled
                  multiple
                  use-chips
                  options-dense
                  emit-value
                  map-options
                  v-model="facility.newFacilityIds"
                  :options="facilityNewOptions"
                  option-value="id"
                  option-label="label"
                  label="Facilities"
                  lazy-rules
                  :ref="(el) => setFieldRef('newFacility', el)"
                  :rules="[(val) => (val && val.length > 0) || 'Select at least one facility']"
                >
                  <template v-slot:no-option>
                    <q-item clickable v-close-popup @click="showNewLocationDialog = true">
                      <q-item-section avatar>
                        <q-icon name="add" color="primary" size="sm" />
                      </q-item-section>
                      <q-item-section class="text-primary">Add new location…</q-item-section>
                    </q-item>
                  </template>
                  <template v-slot:after-options>
                    <q-item clickable v-close-popup @click="showNewLocationDialog = true">
                      <q-item-section avatar>
                        <q-icon name="add" color="primary" size="sm" />
                      </q-item-section>
                      <q-item-section class="text-primary">Add new location…</q-item-section>
                    </q-item>
                  </template>
                </q-select>

                <!-- Facility Change subtype: single select + old facility -->
                <template v-else-if="certification.projectSubtype === 'facility'">
                  <q-select
                    filled
                    options-dense
                    emit-value
                    map-options
                    v-model="facility.newFacilityId"
                    :options="facilityNewOptions"
                    option-value="id"
                    option-label="label"
                    label="New Facility"
                    lazy-rules
                    :ref="(el) => setFieldRef('newFacility', el)"
                    :rules="[(val) => !!val || 'Cannot be blank']"
                  >
                    <template v-slot:no-option>
                      <q-item clickable v-close-popup @click="showNewLocationDialog = true">
                        <q-item-section avatar>
                          <q-icon name="add" color="primary" size="sm" />
                        </q-item-section>
                        <q-item-section class="text-primary">Add new location…</q-item-section>
                      </q-item>
                    </template>
                    <template v-slot:after-options>
                      <q-item clickable v-close-popup @click="showNewLocationDialog = true">
                        <q-item-section avatar>
                          <q-icon name="add" color="primary" size="sm" />
                        </q-item-section>
                        <q-item-section class="text-primary">Add new location…</q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                  <q-select
                    filled
                    options-dense
                    emit-value
                    map-options
                    clearable
                    v-model="facility.oldFacilityId"
                    :options="facilityOldOptions"
                    option-value="id"
                    option-label="label"
                    label="Old Facility (optional)"
                  />
                </template>
              </div>

              <!-- Add new customer location dialog -->
              <q-dialog v-model="showNewLocationDialog" persistent>
                <q-card style="min-width: 420px">
                  <q-card-section>
                    <div class="text-h6">Add Customer Location</div>
                  </q-card-section>
                  <q-card-section class="q-pt-none">
                    <q-form ref="newLocationFormRef" @submit.prevent="saveNewLocation">
                      <q-input
                        filled dense
                        v-model="newLocationForm.name"
                        label="Location Name (optional)"
                        class="q-mb-sm"
                      />
                      <q-input
                        filled dense
                        v-model="newLocationForm.address1"
                        label="Address"
                        :rules="[(val) => !!val?.trim() || 'Cannot be blank']"
                        class="q-mb-sm"
                      />
                      <q-input
                        filled dense
                        v-model="newLocationForm.address2"
                        label="Address Line 2 (optional)"
                        class="q-mb-sm"
                      />
                      <div class="row q-gutter-sm q-mb-sm">
                        <q-input
                          filled dense
                          v-model="newLocationForm.city"
                          label="City"
                          :rules="[(val) => !!val?.trim() || 'Cannot be blank']"
                          class="col"
                        />
                        <q-input
                          filled dense
                          v-model="newLocationForm.state"
                          label="State"
                          :rules="[(val) => !!val?.trim() || 'Cannot be blank']"
                          class="col-3"
                        />
                        <q-input
                          filled dense
                          v-model="newLocationForm.zipCode"
                          label="ZIP"
                          :rules="[(val) => !!val?.trim() || 'Cannot be blank']"
                          class="col-3"
                        />
                      </div>
                      <q-input
                        filled dense
                        v-model="newLocationForm.country"
                        label="Country"
                        :rules="[(val) => !!val?.trim() || 'Cannot be blank']"
                        class="q-mb-sm"
                      />
                      <q-input
                        filled dense
                        v-model="newLocationForm.phone"
                        label="Phone (optional)"
                        class="q-mb-sm"
                      />
                    </q-form>
                  </q-card-section>
                  <q-card-actions align="right">
                    <q-btn flat label="Cancel" color="grey" v-close-popup @click="resetNewLocationForm" />
                    <q-btn
                      color="primary"
                      label="Save Location"
                      :loading="savingLocation"
                      @click="saveNewLocation"
                    />
                  </q-card-actions>
                </q-card>
              </q-dialog>
            </template>

            <!-- Library fields -->
            <template v-if="projectCategory === 'library'">
              <q-separator spaced />
              <div class="text-subtitle2 q-mb-sm">Library Details</div>

              <q-select
                filled
                multiple
                use-chips
                use-input
                v-model="library.standardRevisionIds"
                options-dense
                emit-value
                map-options
                input-debounce="200"
                label="Standards"
                hint="Type to search, e.g. UL 1234"
                :options="filteredRevisions"
                option-value="id"
                option-label="label"
                @filter="filterRevisions"
                lazy-rules
                :ref="(el) => setFieldRef('standardRevisionIds', el)"
                :rules="[(val) => (val && val.length > 0) || 'Select at least one standard']"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">No results</q-item-section>
                  </q-item>
                </template>
              </q-select>

              <DateInput
                v-model="library.checkoutDate"
                label="Checkout Date (yyyy/mm/dd)"
                field-name="checkoutDate"
                :set-field-ref="setFieldRef"
              />

            </template>

            <DocumentsSubForm ref="docsRef" />

            <div class="row justify-end q-gutter-sm q-mt-md">
              <q-btn flat label="Cancel" color="red" :to="{ name: 'project-list' }" />
              <q-btn
                type="submit"
                label="Create Project"
                color="primary"
                :loading="submitting"
                :disable="submitting"
              />
            </div>
          </div>
        </Transition>
      </form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { date } from 'quasar';
import type { QSelect, QForm } from 'quasar';
import { useRouter } from 'vue-router';
import { useProjectStore } from 'src/stores/project-store';
import DateInput from 'src/components/DateInput.vue';
import DocumentsSubForm from './DocumentsSubForm.vue';
import type { Project, ProjectCertificationCategories } from './models';
import type { CustomerLocation } from '../Customers/models';

const router = useRouter();
const store = useProjectStore();

// --- Field ref collection for validation ---
type FieldInstance = { validate: () => Promise<boolean>; hasError: boolean };
const fieldRefs: Record<string, FieldInstance | null> = {};

function setFieldRef(name: string, el: unknown) {
  fieldRefs[name] = el ? (el as FieldInstance) : null;
}

const COMMON_FIELDS = ['jobNumber', 'startDate', 'customerId', 'description'];
const CATEGORY_FIELDS: Record<string, string[]> = {
  testing: ['manufacturer', 'standardIds', 'sampleDescription', 'samplePlan', 'samplingDate', 'samplingLocation'],
  inspection: ['inspectionLocation', 'inspectionType'],
  certification: ['projectSubtype', 'newFacility'],
  library: ['standardRevisionIds', 'checkoutDate'],
};

// --- Common fields ---
const newProject = ref({
  jobNumber: '',
  customerId: null as number | null,
  description: '',
  startDate: date.formatDate(Date.now(), 'YYYY/MM/DD'),
});

const projectType = ref<{ label: string; value: string } | null>(null);
const submitting = ref(false);

// --- Project category detection ---
const TESTING_CODES = new Set(['A', 'E', 'F', 'M', 'P', 'ST']);
const projectCategory = computed(() => {
  if (!projectType.value) return null;
  const code = projectType.value.value;
  if (TESTING_CODES.has(code)) return 'testing';
  if (code === 'I') return 'inspection';
  if (code === 'LS') return 'certification';
  if (code === 'LIB') return 'library';
  return null;
});

watch(projectType, async (type) => {
  newProject.value.jobNumber = type ? await store.fetchNextJobNumber(type.value) : '';
});

// --- Customer filter ---
function customerOptionLabel(opt: { id: number; name: string; listingNumber?: string }) {
  if (projectCategory.value === 'certification' && opt.listingNumber) {
    return `${opt.name} (${opt.listingNumber})`;
  }
  return opt.name;
}

const filteredCustomers = ref([...store.allCustomers].sort((a, b) => a.name.localeCompare(b.name)));
const filterCustomers = (
  val: string,
  update: (callbackFn: () => void, afterFn?: (ref: QSelect) => void) => void,
) => {
  update(() => {
    const needle = val.toLowerCase();
    filteredCustomers.value = store.allCustomers
      .filter((c) => c.name.toLowerCase().includes(needle))
      .sort((a, b) => a.name.localeCompare(b.name));
  });
};

// --- Testing ---
const testing = ref({
  manufacturer: '',
  standardIds: [] as number[],
  sampleDescription: '',
  samplePlan: '',
  samplingDate: '',
  samplingLocation: '',
});

const filteredStandards = ref(store.allStandards.slice());
const filterStandards = (val: string, update: (callbackFn: () => void) => void) => {
  update(() => {
    const needle = val.toLowerCase();
    filteredStandards.value = store.allStandards.filter((s) =>
      s.label.toLowerCase().includes(needle),
    );
  });
};

// --- Inspection ---
const inspection = ref({
  inspectionLocation: '',
  inspectionType: '',
});

const customerLocations = ref<string[]>([]);

watch(
  () => newProject.value.customerId,
  async (customerId) => {
    if (projectCategory.value !== 'inspection') return;
    inspection.value.inspectionLocation = '';
    customerLocations.value = [];
    if (!customerId) return;
    const locs = (await store.fetchCustomerLocations(customerId)) as CustomerLocation[];
    customerLocations.value = locs.map(
      (l) => `${l.name ?? 'Primary'} — ${l.address1}, ${l.city}, ${l.state}`,
    );
  },
);

// --- Certification ---
const certSubtypeOptions = [
  { label: 'Scope Change', value: 'scope change' },
  { label: 'Redesign', value: 'redesign' },
  { label: 'Facility Change', value: 'facility' },
  { label: 'Other', value: 'other' },
];

const certification = ref({
  projectSubtype: '',
});

const facility = ref({
  newFacilityId: null as number | null,
  newFacilityIds: [] as number[],
  oldFacilityId: null as number | null,
});
const facilityNewOptions = ref<{ id: number; label: string }[]>([]);
const facilityOldOptions = ref<{ id: number; label: string }[]>([]);

const selectedCustomerHasListing = computed(() =>
  !!store.allCustomers.find((c) => c.id === newProject.value.customerId)?.listingNumber,
);

const showProjectCategories = computed(() =>
  ['new', 'scope change', 'redesign'].includes(certification.value.projectSubtype),
);

watch(
  () => newProject.value.customerId,
  async (customerId) => {
    if (projectCategory.value !== 'certification') return;
    certCustomerProductTypeIds.value = [];
    draftCategories.value = [];
    draftCategory.value = { certificationProductTypeId: null, newModelNumbersText: '', selectedExistingModelIds: [] };
    const hasListing = !!store.allCustomers.find((c) => c.id === customerId)?.listingNumber;
    certification.value.projectSubtype = hasListing ? '' : 'new';
    if (customerId && hasListing) {
      certCustomerProductTypeIds.value = await store.fetchCustomerCertProductTypeIds(customerId);
    }
    filteredProductTypes.value = buildProductTypeList('');
  },
);

watch(
  () => certification.value.projectSubtype,
  async (subtype) => {
    draftCategories.value = [];
    draftCategory.value = { certificationProductTypeId: null, newModelNumbersText: '', selectedExistingModelIds: [] };
    facility.value = { newFacilityId: null, newFacilityIds: [], oldFacilityId: null };
    facilityNewOptions.value = [];
    facilityOldOptions.value = [];
    filteredProductTypes.value = buildProductTypeList('');
    if ((subtype === 'facility' || subtype === 'new') && newProject.value.customerId) {
      const locs = (await store.fetchCustomerLocations(newProject.value.customerId)) as CustomerLocation[];
      facilityNewOptions.value = locs.map((l) => ({
        id: l.id,
        label: `${l.name ?? 'Primary'} — ${l.address1}, ${l.city}, ${l.state}`,
      }));
      if (subtype === 'facility') {
        const certLocs = await store.fetchCustomerApprovedCertLocations(newProject.value.customerId);
        facilityOldOptions.value = certLocs.map((l) => ({
          id: l.id,
          label: `${l.name} — ${l.address1}, ${l.city}, ${l.state}`,
        }));
      }
    }
  },
);

const showNewLocationDialog = ref(false);
const savingLocation = ref(false);
const newLocationFormRef = ref<InstanceType<typeof QForm> | null>(null);
const emptyLocationForm = () => ({ name: '', address1: '', address2: '', city: '', state: '', zipCode: '', country: 'USA', phone: '' });
const newLocationForm = ref(emptyLocationForm());

function resetNewLocationForm() {
  newLocationForm.value = emptyLocationForm();
}

async function saveNewLocation() {
  const valid = await newLocationFormRef.value?.validate();
  if (!valid) return;
  savingLocation.value = true;
  const created = await store.addCustomerLocation({
    customerId: newProject.value.customerId!,
    isPrimary: false,
    address1: newLocationForm.value.address1,
    city: newLocationForm.value.city,
    state: newLocationForm.value.state,
    zipCode: newLocationForm.value.zipCode,
    country: newLocationForm.value.country,
    ...(newLocationForm.value.name.trim() ? { name: newLocationForm.value.name.trim() } : {}),
    ...(newLocationForm.value.address2.trim() ? { address2: newLocationForm.value.address2.trim() } : {}),
    ...(newLocationForm.value.phone.trim() ? { phone: newLocationForm.value.phone.trim() } : {}),
  });
  facilityNewOptions.value.push({
    id: created.id,
    label: `${created.name ?? 'New Location'} — ${created.address1}, ${created.city}, ${created.state}`,
  });
  if (certification.value.projectSubtype === 'new') {
    facility.value.newFacilityIds.push(created.id);
  } else {
    facility.value.newFacilityId = created.id;
  }
  showNewLocationDialog.value = false;
  savingLocation.value = false;
  resetNewLocationForm();
}

const certCustomerProductTypeIds = ref<number[]>([]);
const filteredProductTypes = ref(store.certProductTypes.slice());

function buildProductTypeList(query: string) {
  const needle = query.toLowerCase();
  const matched = store.certProductTypes.filter(
    (pt) => !needle || pt.label.toLowerCase().includes(needle),
  );
  const subtype = certification.value.projectSubtype;
  if (subtype === 'redesign') {
    return matched.filter((pt) => certCustomerProductTypeIds.value.includes(pt.id));
  }
  if (subtype === 'scope change') {
    const existing = new Set(certCustomerProductTypeIds.value);
    return [
      ...matched.filter((pt) => existing.has(pt.id)).sort((a, b) => a.label.localeCompare(b.label)),
      ...matched.filter((pt) => !existing.has(pt.id)).sort((a, b) => a.label.localeCompare(b.label)),
    ];
  }
  return matched.slice().sort((a, b) => a.label.localeCompare(b.label));
}

const filterProductTypes = (val: string, update: (callbackFn: () => void) => void) => {
  update(() => {
    filteredProductTypes.value = buildProductTypeList(val);
  });
};

const certProductTypeLabel = (id: number) => {
  const pt = store.certProductTypes.find((p) => p.id === id);
  return pt ? pt.label : `Product Type #${id}`;
};

const draftCategories = ref<ProjectCertificationCategories[]>([]);

const draftCategory = ref<{
  certificationProductTypeId: number | null;
  newModelNumbersText: string;
  selectedExistingModelIds: number[];
}>({
  certificationProductTypeId: null,
  newModelNumbersText: '',
  selectedExistingModelIds: [],
});

const existingModelsForDraft = ref<{ id: number; modelNumber: string }[]>([]);

watch(
  () => draftCategory.value.certificationProductTypeId,
  async (productTypeId) => {
    existingModelsForDraft.value = [];
    draftCategory.value.selectedExistingModelIds = [];
    const subtype = certification.value.projectSubtype;
    if (productTypeId && newProject.value.customerId && ['redesign', 'scope change'].includes(subtype)) {
      existingModelsForDraft.value = await store.fetchCustomerProductTypeModels(
        newProject.value.customerId,
        productTypeId,
      );
    }
  },
);

function addCategory() {
  if (!draftCategory.value.certificationProductTypeId) return;
  const maxId = draftCategories.value.reduce((max, c) => Math.max(max, c.id), 0);
  const subtype = certification.value.projectSubtype;
  const newNumbers = draftCategory.value.newModelNumbersText
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const selectedModels = existingModelsForDraft.value.filter((m) =>
    draftCategory.value.selectedExistingModelIds.includes(m.id),
  );
  draftCategories.value.push({
    id: maxId + 1,
    certificationProductTypeId: draftCategory.value.certificationProductTypeId,
    ...(['new', 'scope change'].includes(subtype) && newNumbers.length ? { newModelNumbers: newNumbers } : {}),
    ...(subtype === 'redesign' && selectedModels.length ? { affectedModels: selectedModels } : {}),
    ...(subtype === 'scope change' && selectedModels.length ? { removedModels: selectedModels } : {}),
  });
  draftCategory.value = { certificationProductTypeId: null, newModelNumbersText: '', selectedExistingModelIds: [] };
  existingModelsForDraft.value = [];
}

function removeCategory(index: number) {
  draftCategories.value.splice(index, 1);
}

const pendingCategoryPartial = computed(() => {
  if (!showProjectCategories.value) return false;
  const { certificationProductTypeId, newModelNumbersText, selectedExistingModelIds } = draftCategory.value;
  return certificationProductTypeId !== null || !!newModelNumbersText.trim() || selectedExistingModelIds.length > 0;
});

// --- Library ---
const library = ref({
  standardRevisionIds: [] as number[],
  checkoutDate: date.formatDate(Date.now(), 'YYYY/MM/DD'),
});

const filteredRevisions = ref(store.allRevisions.slice());
const filterRevisions = (val: string, update: (callbackFn: () => void) => void) => {
  update(() => {
    const needle = val.toLowerCase();
    filteredRevisions.value = store.allRevisions.filter((r) =>
      r.label.toLowerCase().includes(needle),
    );
  });
};

// --- Documents sub-form ---
const docsRef = ref<InstanceType<typeof DocumentsSubForm> | null>(null);

// --- Submit ---
const submitForm = async () => {
  const category = projectCategory.value;
  if (!category) return;

  const activeFields = [...COMMON_FIELDS, ...(CATEGORY_FIELDS[category] ?? [])];
  await Promise.all(activeFields.map((name) => fieldRefs[name]?.validate() ?? Promise.resolve(true)));
  if (activeFields.some((name) => fieldRefs[name]?.hasError)) return;

  if (category === 'certification' && showProjectCategories.value) {
    if (draftCategories.value.length === 0) return;
    if (pendingCategoryPartial.value) return;
  }

  docsRef.value?.addDocIfReady();
  submitting.value = true;

  const docs = docsRef.value?.getDocs() ?? [];
  const base = {
    jobNumber: newProject.value.jobNumber,
    customerId: newProject.value.customerId!,
    description: newProject.value.description,
    startDate: newProject.value.startDate,
    ...(docs.length ? { documents: docs } : {}),
  };

  let payload: Record<string, unknown> = { ...base };

  if (category === 'testing') {
    payload = {
      ...payload,
      manufacturer: testing.value.manufacturer,
      standardId: testing.value.standardIds,
      sampleDescription: testing.value.sampleDescription,
      samplePlan: testing.value.samplePlan,
      samplingDate: testing.value.samplingDate,
      samplingLocation: testing.value.samplingLocation,
    };
  } else if (category === 'inspection') {
    payload = {
      ...payload,
      inspectionLocation: inspection.value.inspectionLocation,
      inspectionType: inspection.value.inspectionType,
    };
  } else if (category === 'certification') {
    const selectedCustomer = store.allCustomers.find((c) => c.id === newProject.value.customerId);
    payload = {
      ...payload,
      ...(selectedCustomer?.listingNumber ? { listingNumber: selectedCustomer.listingNumber } : {}),
      projectSubtype: certification.value.projectSubtype,
      ...(showProjectCategories.value ? { projectCategories: draftCategories.value } : {}),
      ...(certification.value.projectSubtype === 'new' && facility.value.newFacilityIds.length
        ? { newFacilityIds: facility.value.newFacilityIds }
        : {}),
      ...(certification.value.projectSubtype === 'facility' && facility.value.newFacilityId
        ? { newFacilityId: facility.value.newFacilityId }
        : {}),
      ...(certification.value.projectSubtype === 'facility' && facility.value.oldFacilityId
        ? { oldFacilityId: facility.value.oldFacilityId }
        : {}),
    };
  } else if (category === 'library') {
    payload = {
      ...payload,
      standardRevisionIds: library.value.standardRevisionIds,
      checkoutDate: library.value.checkoutDate,
    };
  }

  const newId = await store.addProject(payload as Omit<Project, 'id'>);
  submitting.value = false;
  void router.push({ name: 'project-detail', params: { projectId: newId } });
};

onMounted(async () => {
  if (store.allCustomers.length === 0 || store.projectTypes.length === 0 || store.certProductTypes.length === 0) {
    await store.fetchProjectLookups();
  }
  filteredCustomers.value = [...store.allCustomers].sort((a, b) => a.name.localeCompare(b.name));
  filteredStandards.value = store.allStandards.slice();
  filteredRevisions.value = store.allRevisions.slice();
  filteredProductTypes.value = store.certProductTypes.slice();
});
</script>
