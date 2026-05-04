<template>
  <q-page padding>
    <div class="page-header">Library Checkout</div>
    <div class="page-subheader q-pa-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Checkout List" :to="{ name: 'checkout-list' }" />
        <q-breadcrumbs-el label="Add New Checkout" />
      </q-breadcrumbs>
    </div>

    <q-separator />

    <div class="q-pa-md">
      <q-form @submit.prevent="submitForm">
        <q-input
          filled
          v-model="newCheckout.jobNumber"
          label="Job Number"
          hint="Use LIB prefix, e.g. LIB2600105"
          lazy-rules
          :rules="[(val) => !!val || 'Cannot be blank']"
        />

        <q-select
          filled
          v-model="newCheckout.customerId"
          use-input
          options-dense
          emit-value
          map-options
          input-debounce="200"
          label="Customer"
          :options="filteredCustomers"
          option-value="id"
          option-label="name"
          @filter="filterCustomers"
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
          v-model="newCheckout.startDate"
          mask="date"
          label="Start Date (yyyy/mm/dd)"
          lazy-rules
          :rules="[(val) => !!val || 'Cannot be blank']"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="newCheckout.startDate">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-select
          filled
          multiple
          use-chips
          v-model="newCheckout.standardId"
          use-input
          options-dense
          emit-value
          map-options
          input-debounce="200"
          label="Standards"
          :options="filteredStandards"
          option-value="id"
          option-label="label"
          @filter="filterStandards"
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
          v-model="newCheckout.checkoutDate"
          mask="date"
          label="Checkout Date (yyyy/mm/dd)"
          lazy-rules
          :rules="[(val) => !!val || 'Cannot be blank']"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="newCheckout.checkoutDate">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <div class="row justify-end q-gutter-sm q-mt-md">
          <q-btn flat label="Cancel" color="red" :to="{ name: 'checkout-list' }" />
          <q-btn
            type="submit"
            label="Create Checkout"
            color="primary"
            :loading="submitting"
            :disable="!newCheckout.jobNumber || !newCheckout.customerId || !newCheckout.startDate || newCheckout.standardId.length === 0"
          />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { date } from 'quasar';
import type { QSelect } from 'quasar';
import { useRouter } from 'vue-router';
import { useCheckoutStore } from 'src/stores/checkout-store';

const router = useRouter();
const store = useCheckoutStore();

const newCheckout = ref({
  jobNumber: '',
  customerId: null as number | null,
  startDate: date.formatDate(Date.now(), 'YYYY/MM/DD'),
  standardId: [] as number[],
  checkoutDate: date.formatDate(Date.now(), 'YYYY/MM/DD'),
});

const submitting = ref(false);
const filteredCustomers = ref(store.allCustomers);
const filteredStandards = ref(store.allStandards);

const filterCustomers = (
  val: string,
  update: (callbackFn: () => void, afterFn?: (ref: QSelect) => void) => void,
) => {
  update(() => {
    const needle = val.toLowerCase();
    filteredCustomers.value = store.allCustomers.filter((c) =>
      c.name.toLowerCase().includes(needle),
    );
  });
};

const filterStandards = (
  val: string,
  update: (callbackFn: () => void, afterFn?: (ref: QSelect) => void) => void,
) => {
  update(() => {
    const needle = val.toLowerCase();
    filteredStandards.value = store.allStandards.filter((s) =>
      s.label.toLowerCase().includes(needle),
    );
  });
};

const submitForm = async () => {
  submitting.value = true;
  await store.addCheckout({
    jobNumber: newCheckout.value.jobNumber,
    customerId: newCheckout.value.customerId!,
    startDate: newCheckout.value.startDate,
    standardId: newCheckout.value.standardId,
    checkoutDate: newCheckout.value.checkoutDate,
    returnDate: null,
  });
  submitting.value = false;
  void router.push({ name: 'checkout-list' });
};

onMounted(async () => {
  if (store.allCustomers.length === 0 || store.allStandards.length === 0) {
    await store.fetchLookups();
  }
  filteredCustomers.value = store.allCustomers;
  filteredStandards.value = store.allStandards;
});
</script>
