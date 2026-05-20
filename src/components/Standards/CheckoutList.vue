<template>
  <q-page padding>
    <div class="page-header">Library Checkout</div>
    <q-table
      flat
      bordered
      :rows="checkouts"
      :columns="columns"
      row-key="id"
      :loading="loading"
      :filter="filter"
    >
      <template v-slot:top>
        <q-toolbar>
          <q-input v-model="filter" placeholder="Search by customer..." dense outlined clearable />
          <q-toggle v-model="hideReturned" label="Hide returned" class="q-ml-md" />
          <q-space />
          <q-btn round color="green" icon="add" class="q-ma-sm" :to="{ name: 'checkout-new' }">
            <q-tooltip>Add New Checkout</q-tooltip>
          </q-btn>
        </q-toolbar>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props" :class="rowClassFn(props.row)">
          <q-td key="expand" :props="props">
            <q-btn
              round
              flat
              dense
              :icon="expandedId === props.row.id ? 'close' : 'info'"
              :color="expandedId === props.row.id ? 'red' : 'blue-5'"
              @click="toggleExpand(props.row)"
            >
              <q-tooltip>{{ expandedId === props.row.id ? 'Close Details' : 'Open Details' }}</q-tooltip>
            </q-btn>
          </q-td>
          <q-td key="customer" :props="props">{{ props.row.customerName }}</q-td>
          <q-td key="standards" :props="props">
            {{ props.row.standardRevisionIds.length }}
            {{ props.row.standardRevisionIds.length === 1 ? 'revision' : 'revisions' }}
          </q-td>
          <q-td key="checkoutDate" :props="props">{{ props.row.checkoutDate }}</q-td>
          <q-td key="returnDate" :props="props">{{ props.row.returnDate ?? '—' }}</q-td>
        </q-tr>
        <q-tr v-if="expandedId === props.row.id" :props="props">
          <q-td colspan="100%" class="q-pa-md bg-grey-1">
            <div class="row q-col-gutter-lg">
              <div class="col-12 col-sm-7">
                <div class="text-subtitle2 q-mb-sm">Revisions Checked Out</div>
                <q-list dense bordered separator>
                  <q-item v-for="sid in props.row.standardRevisionIds" :key="sid">
                    <q-item-section>{{ standardLabel(sid) }}</q-item-section>
                  </q-item>
                </q-list>
              </div>
              <div class="col-12 col-sm-5">
                <div class="text-subtitle2 q-mb-sm">Return Date</div>
                <q-input
                  dense
                  outlined
                  v-model="returnDateInputs[props.row.id]"
                  mask="date"
                  label="yyyy/mm/dd"
                  clearable
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="returnDateInputs[props.row.id]">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <div class="q-mt-sm row justify-end">
                  <q-btn
                    color="primary"
                    label="Save"
                    size="sm"
                    :loading="savingId === props.row.id"
                    @click="saveReturnDate(props.row)"
                  />
                </div>
              </div>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue';
import type { QTableColumn } from 'quasar';
import { useCheckoutStore } from 'src/stores/checkout-store';
import type { ProjectLibraryWithDetails } from 'src/stores/checkout-store';

const store = useCheckoutStore();

const filter = ref('');
const loading = ref(false);
const hideReturned = ref(true);
const expandedId = ref<number | null>(null);
const savingId = ref<number | null>(null);
const returnDateInputs = reactive<Record<number, string>>({});

const checkouts = computed(() =>
  hideReturned.value ? store.checkouts.filter((c) => !c.returnDate) : store.checkouts,
);

onMounted(async () => {
  loading.value = true;
  await store.fetchCheckouts();
  loading.value = false;
});

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
    name: 'customer',
    label: 'Customer',
    field: 'customerName',
    align: 'left',
    sortable: true,
  },
  {
    name: 'standards',
    label: 'Standards',
    field: (row: ProjectLibraryWithDetails) => row.standardRevisionIds.length,
    align: 'left',
  },
  {
    name: 'checkoutDate',
    label: 'Checkout Date',
    field: 'checkoutDate',
    align: 'left',
    sortable: true,
  },
  {
    name: 'returnDate',
    label: 'Return Date',
    field: 'returnDate',
    align: 'left',
    sortable: true,
  },
];

function standardLabel(id: number): string {
  return store.allRevisions.find((r) => r.id === id)?.label ?? `Revision #${id}`;
}

function toggleExpand(row: ProjectLibraryWithDetails) {
  if (expandedId.value === row.id) {
    expandedId.value = null;
  } else {
    expandedId.value = row.id;
    returnDateInputs[row.id] = row.returnDate ?? '';
  }
}

async function saveReturnDate(row: ProjectLibraryWithDetails) {
  savingId.value = row.id;
  await store.updateCheckout({
    ...row,
    returnDate: returnDateInputs[row.id] || null,
  });
  savingId.value = null;
}

const rowClassFn = (row: ProjectLibraryWithDetails) => {
  return row.returnDate ? 'text-weight-light text-italic' : '';
};
</script>
