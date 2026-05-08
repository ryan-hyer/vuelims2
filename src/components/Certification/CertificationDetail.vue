<template>
  <div style="position: relative; min-height: 120px">
    <q-inner-loading :showing="loading" label="Loading certification data..." />

    <div v-if="!loading && !certCustomer" class="text-center q-pa-lg text-grey-6">
      No certification record found for this customer.
    </div>

    <template v-if="!loading && certCustomer">
      <q-card bordered>
        <q-toolbar class="bg-cyan-1 q-py-sm q-pl-md">
          <q-item-label>
            <div class="text-h6">Company Information</div>
            <div class="text-caption">
              Official use for contracts and certificates -- may be different than company info
              presented elsewhere
            </div>
            <div class="text-caption">Altering this info requires a listing amendment</div>
          </q-item-label>
          <q-space />
          <!-- Actions button and menu should only be displayed for active listings -->
          <q-btn round flat color="primary" icon="more_horiz">
            <q-tooltip>Actions</q-tooltip>
            <q-menu anchor="top left" self="top right">
              <q-list style="min-width: 100px">
                <q-item clickable v-close-popup>
                  <q-item-section>Generate Listing Sheet</q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section>Create Amendment Project</q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section>Create New Surveillance</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup>
                  <q-item-section class="text-red">Suspend Certification</q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section class="text-red">Terminate Certification</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
          <q-btn round flat color="primary" icon="notes">
            <q-tooltip>Notes</q-tooltip>
            <q-badge color="grey-7" floating>{{ certCustomer.notes?.length ?? 0 }}</q-badge>
          </q-btn>
          <q-btn round flat color="primary" icon="description">
            <q-tooltip>Documents</q-tooltip>
            <q-badge color="grey-7" floating>{{ certCustomer.documents?.length ?? 0 }}</q-badge>
          </q-btn>
        </q-toolbar>
        <q-list separator>
          <q-item>
            <q-item-section>
              <q-item-label overline>Company Name</q-item-label>
              <q-item-label class="q-pl-md">{{ certCustomer.companyName }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline>Address</q-item-label>
              <div class="q-pl-md">
                <div>{{ certCustomer.address1 }}</div>
                <div v-if="certCustomer.address2">{{ certCustomer.address2 }}</div>
                <div>
                  {{ certCustomer.city }}, {{ certCustomer.state }} {{ certCustomer.zipCode }}
                </div>
                <div>{{ certCustomer.country }}</div>
              </div>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline>Phone Number</q-item-label>
              <q-item-label class="q-pl-md">{{ certCustomer.phone ?? 'N/A' }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline>Website</q-item-label>
              <q-item-label class="q-pl-md">
                <a v-if="certCustomer.website" :href="certCustomer.website" target="_blank">
                  {{ certCustomer.website }}
                </a>
                <span v-else>N/A</span>
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline>Primary Contact</q-item-label>
              <q-item-label class="q-pl-md">{{
                certCustomer.primaryContact?.name ?? 'N/A'
              }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item class="bg-grey-2">
            <q-item-section>
              <q-item-label overline>
                Listing Status:
                <span :class="[statusColor, 'text-bold']">{{
                  certCustomer.status.toUpperCase()
                }}</span>
              </q-item-label>
              <template
                v-if="certCustomer.status !== 'pending' && certCustomer.status !== 'canceled'"
              >
                <q-item-label class="q-pl-md">
                  <span class="text-overline">Listing Number:</span>
                  <span class="text-bold"> {{ certCustomer.listingNumber }}</span>
                </q-item-label>
                <q-item-label class="q-pl-md">
                  <span class="text-overline">Effective Date:</span>
                  {{ formatDate(certCustomer.effectiveDate) }}
                </q-item-label>
              </template>
              <template v-if="isTerminated">
                <q-item-label class="q-pl-md">
                  <span class="text-overline">Termination Date:</span>
                  {{ formatDate(certCustomer.terminationDate) }}
                </q-item-label>
                <q-item-label class="q-pl-md">
                  <span class="text-overline">Termination Reason:</span>
                  {{ certCustomer.terminationReason ?? 'N/A' }}
                </q-item-label>
              </template>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>

      <q-card bordered class="q-mt-md">
        <q-list separator>
          <q-item header class="bg-cyan-1">
            <q-item-label>
              <div class="text-h6">Approved Listings</div>
            </q-item-label>
          </q-item>
          <q-item v-if="approvedListings.length === 0">
            <q-item-section class="text-grey-6">No approved listings.</q-item-section>
          </q-item>
          <q-card bordered class="q-ma-sm" v-for="listing in approvedListings" :key="listing.id">
            <q-toolbar class="bg-grey-3">
              <div class="text-bold">{{ listing.displayLabel }}</div>
              <q-space />
              <q-btn round flat color="primary" icon="notes">
                <q-tooltip>Notes</q-tooltip>
              </q-btn>
              <q-btn round flat color="primary" icon="description">
                <q-tooltip>Documents</q-tooltip>
              </q-btn>
            </q-toolbar>
            <div class="row">
              <div class="col-xs-12 col-md-10">
                <q-list separator>
                  <q-item>
                    <q-item-section>
                      <q-item-label overline>Standards</q-item-label>
                      <q-item-label class="q-pl-md">
                        {{ listing.standardRevisionsApproved.join(', ') || 'N/A' }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label overline>Product Description</q-item-label>
                      <q-item-label class="q-pl-md">{{ listing.description }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label overline>Model Numbers</q-item-label>
                      <q-item-label class="q-pl-md">
                        {{ listing.models.map((m) => m.modelNumber).join(', ') || 'N/A' }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item v-if="listing.listingConditions.length">
                    <q-item-section>
                      <q-item-label overline>Listing Conditions</q-item-label>
                      <ol class="q-pl-lg q-mt-xs q-mb-xs">
                        <li v-for="(condition, i) in listing.listingConditions" :key="i">
                          {{ condition }}
                        </li>
                      </ol>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
              <q-separator />
              <div class="col-xs-12 col-md-2">
                <q-list separator>
                  <q-item>
                    <q-item-section>
                      <q-item-label overline>Certification Mark</q-item-label>
                      <div>Image of mark goes here</div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </q-card>
          <q-expansion-item
            v-if="archivedListings.length"
            label="Archived Listings"
            caption="Expand to view"
            class="bg-red-1"
          >
            <q-card bordered class="q-ma-xs" v-for="listing in archivedListings" :key="listing.id">
              <q-toolbar class="bg-grey-3">
                <div class="text-bold">{{ listing.displayLabel }}</div>
                <q-space />
                <q-btn round flat color="primary" icon="notes">
                  <q-tooltip>Notes</q-tooltip>
                </q-btn>
                <q-btn round flat color="primary" icon="description">
                  <q-tooltip>Documents</q-tooltip>
                </q-btn>
              </q-toolbar>
            </q-card>
          </q-expansion-item>
        </q-list>
      </q-card>

      <q-card bordered class="q-mt-md">
        <q-list separator>
          <q-item header class="bg-cyan-1">
            <q-item-label>
              <div class="text-h6">Approved Manufacturing Facilities</div>
            </q-item-label>
          </q-item>
          <q-item v-if="approvedLocations.length === 0">
            <q-item-section class="text-grey-6">No approved facilities.</q-item-section>
          </q-item>
          <q-card bordered class="q-ma-sm" v-for="location in approvedLocations" :key="location.id">
            <q-list separator>
              <q-toolbar class="bg-grey-3">
                <div class="text-bold">{{ location.name }}</div>
                <q-space />
                <q-btn round flat color="primary" icon="notes">
                  <q-tooltip>Notes</q-tooltip>
                </q-btn>
                <q-btn round flat color="primary" icon="description">
                  <q-tooltip>Documents</q-tooltip>
                </q-btn>
              </q-toolbar>
              <q-item>
                <q-item-section>
                  <q-item-label overline>Address</q-item-label>
                  <div class="q-pl-md">
                    <div>{{ location.address }}</div>
                    <div>{{ location.city }}, {{ location.state }} {{ location.zipCode }}</div>
                    <div>{{ location.country }}</div>
                  </div>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label overline>Phone Number</q-item-label>
                  <q-item-label class="q-pl-md">{{ location.phone ?? 'N/A' }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label overline>Primary Contact (at this location)</q-item-label>
                  <q-item-label class="q-pl-md">{{ location.contactName ?? 'N/A' }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
          <q-expansion-item
            v-if="archivedLocations.length"
            label="Archived Facilities"
            caption="Expand to view"
            class="bg-red-1"
          >
            <q-card
              bordered
              class="q-ma-xs"
              v-for="location in archivedLocations"
              :key="location.id"
            >
              <q-toolbar class="bg-grey-3">
                <div class="text-bold">{{ location.name }}</div>
                <q-space />
                <q-btn round flat color="primary" icon="notes">
                  <q-tooltip>Notes</q-tooltip>
                </q-btn>
                <q-btn round flat color="primary" icon="description">
                  <q-tooltip>Documents</q-tooltip>
                </q-btn>
              </q-toolbar>
            </q-card>
          </q-expansion-item>
        </q-list>
      </q-card>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useCertificationStore } from 'src/stores/certification-store';

const props = defineProps<{
  customerId: number;
}>();

const certStore = useCertificationStore();
const loading = ref(true);

const certCustomer = computed(() => certStore.certCustomer);

const isTerminated = computed(() => certCustomer.value?.status === 'terminated');

const statusColor = computed(() => {
  switch (certCustomer.value?.status) {
    case 'active':
      return 'text-green-6';
    case 'suspended':
      return 'text-orange-6';
    case 'terminated':
    case 'canceled':
      return 'text-red-6';
    default:
      return 'text-grey-6';
  }
});

const approvedListings = computed(
  () => certCustomer.value?.listings.filter((l) => l.status === 'approved') ?? [],
);
const archivedListings = computed(
  () => certCustomer.value?.listings.filter((l) => l.status === 'archived') ?? [],
);
const approvedLocations = computed(
  () => certCustomer.value?.locations.filter((l) => l.status === 'approved') ?? [],
);
const archivedLocations = computed(
  () => certCustomer.value?.locations.filter((l) => l.status === 'archived') ?? [],
);

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

onMounted(async () => {
  try {
    await certStore.fetchCertificationCustomer(props.customerId);
  } finally {
    loading.value = false;
  }
});
</script>
