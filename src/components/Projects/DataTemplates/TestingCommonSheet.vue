<template>
  <div>
    <div class="text-subtitle2 q-mb-sm">Samples Received</div>
    <q-list v-if="samples.length" bordered separator class="rounded-borders q-mb-sm">
      <q-item v-for="(sample, i) in samples" :key="sample.id ?? `new-${i}`">
        <q-item-section>
          <q-item-label>
            <span class="text-bold">{{ sample.number }}</span> · {{ sample.description }}
          </q-item-label>
          <q-item-label caption>
            Received {{ sample.dateReceived }}
            <template v-if="sample.receivedBy"> by {{ sample.receivedBy }}</template>
            <template v-if="sample.shippedVia"> · via {{ sample.shippedVia }}</template>
          </q-item-label>
        </q-item-section>
        <q-item-section v-if="!readonly" side>
          <q-btn flat round dense icon="delete" color="red-5" @click="removeSample(i)">
            <q-tooltip>Remove Sample</q-tooltip>
          </q-btn>
        </q-item-section>
      </q-item>
    </q-list>
    <div v-else class="text-grey-6 text-italic q-mb-sm">No samples received yet.</div>

    <q-expansion-item
      v-if="!readonly"
      v-model="addingSample"
      dense
      icon="add"
      label="Log Sample Receipt"
      header-class="text-primary"
      class="q-mb-md"
    >
      <div class="q-pa-sm q-gutter-sm">
        <div class="row q-col-gutter-sm">
          <q-input
            v-model="newSample.number"
            filled
            dense
            label="Sample Number"
            class="col-12 col-sm-4"
          />
          <DateInput
            v-model="newSample.dateReceived"
            label="Date Received (yyyy/mm/dd)"
            class="col-12 col-sm-4"
          />
          <q-input
            v-model="newSample.receivedBy"
            filled
            dense
            label="Received By"
            class="col-12 col-sm-4"
          />
        </div>
        <q-input v-model="newSample.shippedVia" filled dense label="Shipped Via" />
        <q-input v-model="newSample.description" filled dense label="Sample Description" />
        <div class="row justify-end">
          <q-btn
            color="primary"
            size="sm"
            label="Add Sample"
            :disable="!canAddSample"
            @click="addSample"
          />
        </div>
      </div>
    </q-expansion-item>

    <q-separator spaced />
    <div class="text-subtitle2 q-mb-sm row items-center">
      Manufacturer
      <q-space />
      <q-btn
        v-if="!readonly"
        flat
        dense
        no-caps
        size="sm"
        icon="content_copy"
        color="primary"
        label="Copy from Customer"
        :loading="loadingCustomer"
        @click="onCopyClick"
      >
        <q-menu v-if="customerLocations.length > 1" v-model="locationMenuOpen" auto-close>
          <q-list dense>
            <q-item-label header>Which location?</q-item-label>
            <q-item
              v-for="loc in customerLocations"
              :key="loc.id"
              clickable
              @click="copyFromCustomer(loc)"
            >
              <q-item-section>
                <q-item-label>{{
                  loc.name ?? (loc.isPrimary ? 'Primary' : 'Location')
                }}</q-item-label>
                <q-item-label caption
                  >{{ loc.address1 }}, {{ loc.city }}, {{ loc.state }}</q-item-label
                >
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>
    <div class="row q-col-gutter-sm q-mb-sm">
      <q-input
        v-model="data.manufacturer.name"
        filled
        label="Company Name"
        :readonly="readonly"
        class="col-12"
      />
      <q-input
        v-model="data.manufacturer.address1"
        filled
        label="Address"
        :readonly="readonly"
        class="col-12 col-sm-6"
      />
      <q-input
        v-model="data.manufacturer.address2"
        filled
        label="Address Line 2 (optional)"
        :readonly="readonly"
        class="col-12 col-sm-6"
      />
      <q-input
        v-model="data.manufacturer.city"
        filled
        label="City"
        :readonly="readonly"
        class="col-12 col-sm-3"
      />
      <q-input
        v-model="data.manufacturer.state"
        filled
        label="State / Province"
        :readonly="readonly"
        class="col-6 col-sm-3"
      />
      <q-input
        v-model="data.manufacturer.zipCode"
        filled
        label="Postal Code"
        :readonly="readonly"
        class="col-6 col-sm-3"
      />
      <q-input
        v-model="data.manufacturer.country"
        filled
        label="Country"
        :readonly="readonly"
        class="col-12 col-sm-3"
      />
      <q-input
        v-model="data.manufacturer.phone"
        filled
        type="tel"
        label="Telephone"
        :readonly="readonly"
        class="col-12 col-sm-6"
      />
      <q-input
        v-model="data.manufacturer.website"
        filled
        type="url"
        label="Website"
        :readonly="readonly"
        class="col-12 col-sm-6"
      />
    </div>
    <div v-if="copyNote" class="text-caption text-grey-7 q-mb-sm">{{ copyNote }}</div>

    <q-separator spaced />
    <div class="text-subtitle2 q-mb-sm">Sample Information</div>
    <q-input
      v-model="data.sampleDescription"
      filled
      type="textarea"
      autogrow
      label="Sample Description"
      :readonly="readonly"
      class="q-mb-sm"
    />
    <q-input
      v-model="data.samplePlan"
      filled
      type="textarea"
      autogrow
      label="Sampling Plan"
      :readonly="readonly"
      class="q-mb-sm"
    />
    <div class="row q-col-gutter-sm">
      <DateInput
        v-model="data.samplingDate"
        label="Sampling Date (yyyy/mm/dd)"
        optional
        :readonly="readonly"
        class="col-12 col-sm-6"
      />
      <q-input
        v-model="data.samplingLocation"
        filled
        label="Sampling Location"
        :readonly="readonly"
        class="col-12 col-sm-6"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { date } from 'quasar';
import DateInput from 'src/components/DateInput.vue';
import { useProjectStore } from 'src/stores/project-store';
import type { DraftSample, ManufacturerInfo, TestingCommonData } from '../models';
import type { Customer, CustomerLocation } from '../../Customers/models';

const props = defineProps<{
  jobNumber: string;
  customerId: number;
  receiverName: string;
  readonly?: boolean;
}>();

const data = defineModel<TestingCommonData>('data', { required: true });
const samples = defineModel<DraftSample[]>('samples', { required: true });

const addingSample = ref(false);

function emptySample(): DraftSample {
  return {
    number: `${props.jobNumber}-${samples.value.length + 1}`,
    dateReceived: date.formatDate(Date.now(), 'YYYY/MM/DD'),
    description: '',
    shippedVia: '',
    receivedBy: props.receiverName,
  };
}

const newSample = ref<DraftSample>(emptySample());

const canAddSample = computed(
  () =>
    !!newSample.value.number.trim() &&
    !!newSample.value.dateReceived &&
    !!newSample.value.description.trim(),
);

function addSample() {
  if (!canAddSample.value) return;
  samples.value = [...samples.value, { ...newSample.value }];
  newSample.value = emptySample();
  addingSample.value = false;
}

function removeSample(index: number) {
  samples.value = samples.value.filter((_, i) => i !== index);
  newSample.value = emptySample();
}

// --- Copy manufacturer from customer ---
const store = useProjectStore();
const loadingCustomer = ref(false);
const locationMenuOpen = ref(false);
const customer = ref<Customer | null>(null);
const copyNote = ref('');

const customerLocations = computed<CustomerLocation[]>(() =>
  (customer.value?.locations ?? []).filter((l) => !l.archivedAt),
);

async function onCopyClick() {
  if (!customer.value) {
    loadingCustomer.value = true;
    customer.value = (await store.fetchCustomer(props.customerId)) ?? null;
    loadingCustomer.value = false;
    // With several locations, the menu asks which one; it opens on the next click otherwise
    if (customerLocations.value.length > 1) {
      locationMenuOpen.value = true;
      return;
    }
  }
  if (customerLocations.value.length <= 1) copyFromCustomer(customerLocations.value[0]);
}

const FIELD_LABELS: Record<Exclude<keyof ManufacturerInfo, 'address2'>, string> = {
  name: 'company name',
  address1: 'address',
  city: 'city',
  state: 'state/province',
  zipCode: 'postal code',
  country: 'country',
  phone: 'telephone',
  website: 'website',
};

function copyFromCustomer(loc?: CustomerLocation) {
  if (!customer.value) return;
  data.value.manufacturer = {
    name: customer.value.name,
    address1: loc?.address1 ?? '',
    address2: loc?.address2 ?? '',
    city: loc?.city ?? '',
    state: loc?.state ?? '',
    zipCode: loc?.zipCode ?? '',
    country: loc?.country ?? '',
    phone: loc?.phone ?? '',
    website: customer.value.website ?? '',
  };
  const blanks = (Object.keys(FIELD_LABELS) as (keyof typeof FIELD_LABELS)[])
    .filter((key) => !data.value.manufacturer[key])
    .map((key) => FIELD_LABELS[key]);
  copyNote.value = blanks.length
    ? `Copied from customer record. Not on file, please fill in: ${blanks.join(', ')}.`
    : 'Copied from customer record.';
}
</script>
