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
                <q-item clickable v-close-popup @click="generateListingSheet">
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
          <q-btn round flat color="primary" icon="edit_note" @click="openCustomerNotesDialog">
            <q-tooltip>Show/Edit Notes</q-tooltip>
            <q-badge color="grey-7" floating>{{ certCustomer.notes?.length ?? 0 }}</q-badge>
          </q-btn>
          <q-btn round flat color="primary" icon="file_present" @click="openCustomerDocsDialog">
            <q-tooltip>Show/Edit Documents</q-tooltip>
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
              <q-item-label
                class="q-pl-md"
                v-if="certCustomer.status !== 'pending' && certCustomer.status !== 'canceled'"
              >
                <span class="text-overline">Listing Number:</span>
                <span class="text-bold"> {{ certCustomer.listingNumber }}</span>
                <br />
                <span class="text-overline">Effective Date:</span>
                {{ formatDate(certCustomer.effectiveDate) }}
              </q-item-label>
              <q-item-label class="q-pl-md" v-if="isTerminated">
                <span class="text-overline">Termination Date:</span>
                {{ formatDate(certCustomer.terminationDate) }}
                <br />
                <span class="text-overline">Termination Reason:</span>
                {{ certCustomer.terminationReason ?? 'N/A' }}
              </q-item-label>
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
          <CertificationListingCard
            v-for="listing in approvedListings"
            :key="listing.id"
            :listing="listing"
            :listing-number="certCustomer.listingNumber"
            @open-notes="openListingNotesDialog(listing)"
          />
          <div v-if="archivedListings.length" class="q-px-sm q-pb-sm">
            <q-btn
              flat
              dense
              size="sm"
              :icon="showArchivedListings ? 'expand_less' : 'expand_more'"
              :label="`${showArchivedListings ? 'Hide' : 'Show'} ${archivedListings.length} archived listing${archivedListings.length > 1 ? 's' : ''}`"
              color="grey-7"
              @click="showArchivedListings = !showArchivedListings"
            />
            <template v-if="showArchivedListings">
              <CertificationListingCard
                v-for="listing in archivedListings"
                :key="listing.id"
                :listing="listing"
                :listing-number="certCustomer.listingNumber"
                archived
              />
            </template>
          </div>
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
          <CertificationLocationCard
            v-for="location in approvedLocations"
            :key="location.id"
            :location="location"
            @open-notes="openLocationNotesDialog(location)"
          />
          <div v-if="archivedLocations.length" class="q-px-sm q-pb-sm">
            <q-btn
              flat
              dense
              size="sm"
              :icon="showArchivedLocations ? 'expand_less' : 'expand_more'"
              :label="`${showArchivedLocations ? 'Hide' : 'Show'} ${archivedLocations.length} archived facilit${archivedLocations.length > 1 ? 'ies' : 'y'}`"
              color="grey-7"
              @click="showArchivedLocations = !showArchivedLocations"
            />
            <template v-if="showArchivedLocations">
              <CertificationLocationCard
                v-for="location in archivedLocations"
                :key="location.id"
                :location="location"
                archived
              />
            </template>
          </div>
        </q-list>
      </q-card>
    </template>
  </div>

  <q-dialog v-model="customerDocsDialogOpen" persistent>
    <q-card style="min-width: 480px; max-width: 600px">
      <q-toolbar class="bg-cyan-1">
        <q-toolbar-title>
          <div class="text-subtitle1 text-bold">Documents</div>
          <div class="text-caption">{{ certCustomer?.companyName }}</div>
        </q-toolbar-title>
        <q-btn flat round icon="close" v-close-popup />
      </q-toolbar>
      <q-card-section>
        <q-list bordered separator class="rounded-borders q-mb-md" v-if="draftCustomerDocs.length">
          <q-item v-for="(doc, i) in draftCustomerDocs" :key="doc.id">
            <q-item-section>
              <q-item-label>{{ doc.description }}</q-item-label>
              <q-item-label caption
                >{{ noteAuthor(doc.uploadedBy) }} · {{ formatDate(doc.uploadedAt) }}</q-item-label
              >
            </q-item-section>
            <q-item-section side>
              <q-btn flat round dense icon="open_in_new" color="primary" @click="viewDoc(doc.url)">
                <q-tooltip>View Document</q-tooltip>
              </q-btn>
            </q-item-section>
            <q-item-section side>
              <q-btn flat round dense icon="delete" color="red-5" @click="removeCustomerDoc(i)" />
            </q-item-section>
          </q-item>
        </q-list>
        <div v-else class="text-grey-6 q-mb-md">No documents on file.</div>
        <q-separator class="q-mb-md" />
        <div class="q-gutter-sm">
          <q-input v-model="newDocDescription" outlined dense label="Description" />
          <div class="row items-center q-gutter-sm">
            <q-icon name="attach_file" size="sm" :color="newDocFile ? 'teal' : 'grey'" />
            <div class="col">
              <div class="text-body2">{{ newDocFile ? newDocFile.name : 'No file attached' }}</div>
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
            :disable="!newDocDescription.trim()"
            @click="addCustomerDoc"
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
          @click="saveCustomerDocs"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="customerNotesDialogOpen" persistent>
    <q-card style="min-width: 480px; max-width: 600px">
      <q-toolbar class="bg-cyan-1">
        <q-toolbar-title>
          <div class="text-subtitle1 text-bold">Notes</div>
          <div class="text-caption">{{ certCustomer?.companyName }}</div>
        </q-toolbar-title>
        <q-btn flat round icon="close" v-close-popup />
      </q-toolbar>
      <q-card-section>
        <q-list bordered separator class="rounded-borders q-mb-md" v-if="draftCustomerNotes.length">
          <q-item v-for="(note, i) in draftCustomerNotes" :key="note.id">
            <q-item-section>
              <q-item-label>{{ note.note }}</q-item-label>
              <q-item-label caption
                >{{ noteAuthor(note.createdBy) }} · {{ formatDate(note.createdAt) }}</q-item-label
              >
            </q-item-section>
            <q-item-section side>
              <q-btn flat round dense icon="delete" color="red-5" @click="removeCustomerNote(i)" />
            </q-item-section>
          </q-item>
        </q-list>
        <div v-else class="text-grey-6 q-mb-md">No notes yet.</div>
        <div class="row items-center q-gutter-sm">
          <q-input
            v-model="newCustomerNoteText"
            outlined
            dense
            placeholder="Add a note..."
            class="col"
            @keyup.enter="addCustomerNote"
          />
          <q-btn
            flat
            round
            icon="add"
            color="primary"
            :disable="!newCustomerNoteText.trim()"
            @click="addCustomerNote"
          />
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn color="primary" label="Save" @click="saveCustomerNotes" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="notesDialogOpen" persistent>
    <q-card style="min-width: 480px; max-width: 600px">
      <q-toolbar class="bg-cyan-1">
        <q-toolbar-title>
          <div class="text-subtitle1 text-bold">Edit Notes</div>
          <div class="text-caption">{{ notesDialogSubtitle }}</div>
        </q-toolbar-title>
        <q-btn flat round icon="close" v-close-popup />
      </q-toolbar>
      <q-card-section>
        <q-list bordered separator class="rounded-borders q-mb-md" v-if="draftNotes.length">
          <q-item v-for="(note, i) in draftNotes" :key="i">
            <q-item-section>{{ note }}</q-item-section>
            <q-item-section side>
              <q-btn flat round dense icon="delete" color="red-5" @click="removeNote(i)" />
            </q-item-section>
          </q-item>
        </q-list>
        <div v-else class="text-grey-6 q-mb-md">No notes yet.</div>
        <div class="row items-center q-gutter-sm">
          <q-input
            v-model="newNoteText"
            outlined
            dense
            placeholder="Add a note..."
            class="col"
            @keyup.enter="addNote"
          />
          <q-btn
            flat
            round
            icon="add"
            color="primary"
            :disable="!newNoteText.trim()"
            @click="addNote"
          />
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn color="primary" label="Save" @click="saveNotes" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCertificationStore } from 'src/stores/certification-store';
import { useAuthStore } from 'src/stores/auth-store';
import type {
  CertificationLocation,
  CertificationListingDetail,
  CertificationNote,
  CertificationDocument,
} from './models';
import CertificationListingCard from './CertificationListingCard.vue';
import CertificationLocationCard from './CertificationLocationCard.vue';

const props = defineProps<{
  customerId: number;
}>();

const router = useRouter();
const certStore = useCertificationStore();
const authStore = useAuthStore();
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
  () => certCustomer.value?.listings.filter((l) => l.status === 'approved' && !l.archivedAt) ?? [],
);
const archivedListings = computed(
  () => certCustomer.value?.listings.filter((l) => !!l.archivedAt) ?? [],
);
const showArchivedListings = ref(false);
const approvedLocations = computed(
  () => certCustomer.value?.locations.filter((l) => l.status === 'approved' && !l.archivedAt) ?? [],
);
const archivedLocations = computed(
  () => certCustomer.value?.locations.filter((l) => !!l.archivedAt) ?? [],
);
const showArchivedLocations = ref(false);

const customerNotesDialogOpen = ref(false);
const draftCustomerNotes = ref<CertificationNote[]>([]);
const newCustomerNoteText = ref('');

function openCustomerNotesDialog() {
  draftCustomerNotes.value = (certCustomer.value?.notes ?? []).map((n) => ({ ...n }));
  newCustomerNoteText.value = '';
  customerNotesDialogOpen.value = true;
}

function addCustomerNote() {
  const text = newCustomerNoteText.value.trim();
  if (!text) return;
  const maxId = draftCustomerNotes.value.reduce((max, n) => Math.max(max, n.id), 0);
  draftCustomerNotes.value.push({
    id: maxId + 1,
    note: text,
    createdAt: new Date(),
    createdBy: authStore.user?.id ?? 0,
  });
  newCustomerNoteText.value = '';
}

function removeCustomerNote(index: number) {
  draftCustomerNotes.value.splice(index, 1);
}

async function saveCustomerNotes() {
  await certStore.updateCustomerNotes(draftCustomerNotes.value);
  customerNotesDialogOpen.value = false;
}

function noteAuthor(userId: number): string {
  if (userId === authStore.user?.id) return authStore.fullName;
  return `User #${userId}`;
}

const customerDocsDialogOpen = ref(false);
const draftCustomerDocs = ref<CertificationDocument[]>([]);
const newDocDescription = ref('');
const newDocFile = ref<File | null>(null);
const docFileInputRef = ref<HTMLInputElement | null>(null);
const docFileError = ref(false);

function viewDoc(url: string) {
  window.open(url, '_blank');
}

function openCustomerDocsDialog() {
  draftCustomerDocs.value = (certCustomer.value?.documents ?? []).map((d) => ({ ...d }));
  newDocDescription.value = '';
  newDocFile.value = null;
  docFileError.value = false;
  customerDocsDialogOpen.value = true;
}

function onDocFileSelected(e: Event) {
  newDocFile.value = (e.target as HTMLInputElement).files?.[0] ?? null;
  if (newDocFile.value) docFileError.value = false;
}

function addCustomerDoc() {
  if (!newDocDescription.value.trim()) return;
  if (!newDocFile.value) {
    docFileError.value = true;
    return;
  }
  const maxId = draftCustomerDocs.value.reduce((max, d) => Math.max(max, d.id), 0);
  draftCustomerDocs.value.push({
    id: maxId + 1,
    description: newDocDescription.value.trim(),
    url: URL.createObjectURL(newDocFile.value),
    uploadedAt: new Date(),
    uploadedBy: authStore.user?.id ?? 0,
  });
  newDocDescription.value = '';
  newDocFile.value = null;
  if (docFileInputRef.value) docFileInputRef.value.value = '';
}

function removeCustomerDoc(index: number) {
  draftCustomerDocs.value.splice(index, 1);
}

async function saveCustomerDocs() {
  if (newDocDescription.value.trim() && newDocFile.value) {
    addCustomerDoc();
  }
  await certStore.updateCustomerDocuments(draftCustomerDocs.value);
  customerDocsDialogOpen.value = false;
}

const pendingDocPartial = computed(() => !!newDocDescription.value.trim() !== !!newDocFile.value);

const notesDialogOpen = ref(false);
const notesDialogSubtitle = ref('');
const draftNotes = ref<string[]>([]);
const newNoteText = ref('');
let notesDialogSaveHandler: (notes: string[]) => Promise<void> = async () => {};

function openLocationNotesDialog(location: CertificationLocation) {
  notesDialogSubtitle.value = location.name;
  notesDialogSaveHandler = (notes) => certStore.updateLocationNotes(location.id, notes);
  draftNotes.value = [...(location.notes ?? [])];
  newNoteText.value = '';
  notesDialogOpen.value = true;
}

function openListingNotesDialog(listing: CertificationListingDetail) {
  notesDialogSubtitle.value = listing.displayLabel;
  notesDialogSaveHandler = (notes) => certStore.updateListingNotes(listing.id, notes);
  draftNotes.value = [...(listing.notes ?? [])];
  newNoteText.value = '';
  notesDialogOpen.value = true;
}

function addNote() {
  const text = newNoteText.value.trim();
  if (!text) return;
  draftNotes.value.push(text);
  newNoteText.value = '';
}

function removeNote(index: number) {
  draftNotes.value.splice(index, 1);
}

async function saveNotes() {
  await notesDialogSaveHandler(draftNotes.value);
  notesDialogOpen.value = false;
}

function generateListingSheet() {
  const { href } = router.resolve({
    name: 'certification-listing-sheet',
    params: { customerId: props.customerId },
  });
  window.open(href, '_blank');
}

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
