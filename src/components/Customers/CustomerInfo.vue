<template v-if="customer">
  <q-card bordered>
    <q-toolbar class="bg-grey-4 q-py-sm q-pl-md">
      <q-item-label>
        <div class="row items-center q-gutter-xs">
          <span class="text-h6">Company Information</span>
          <q-badge v-if="isArchived" color="grey-6" label="Archived" />
        </div>
      </q-item-label>
      <q-space />
      <q-btn v-if="isArchived" flat round color="grey-7" icon="unarchive" @click="restoreCustomer">
        <q-tooltip>Restore Customer</q-tooltip>
      </q-btn>
      <q-btn v-if="!isArchived" flat round color="primary" icon="edit" @click="openEditForm">
        <q-tooltip>Edit Customer</q-tooltip>
      </q-btn>
    </q-toolbar>
    <div v-if="editingCompanyInfo" class="q-pa-sm bg-light-blue-1">
      <q-form @submit="submitEdit" class="q-gutter-xs">
        <q-input
          dense
          hide-bottom-space
          v-model="editDraft.name"
          label="Company Name"
          lazy-rules
          :rules="[(val) => !!val || 'Cannot be blank']"
        />
        <q-input dense hide-bottom-space v-model="editDraft.website" label="Company Website" />
        <q-input dense hide-bottom-space v-model="editDraft.relevance" label="Relevance" />
        <q-input type="textarea" dense hide-bottom-space v-model="editDraft.notes" label="Notes" />
        <q-card-actions>
          <q-btn label="Save" type="submit" color="teal" />
          <q-btn label="Cancel" flat class="q-ml-sm" @click="editingCompanyInfo = false" />
          <q-space />
          <q-btn round color="grey-7" icon="archive" @click="archiveCustomer">
            <q-tooltip>Archive Customer</q-tooltip>
          </q-btn>
        </q-card-actions>
      </q-form>
    </div>
    <q-list separator v-else>
      <q-item>
        <q-item-section>
          <q-item-label overline>Company Name</q-item-label>
          <q-item-label class="q-pl-md">{{ customer.name }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label overline>Company Website</q-item-label>
          <q-item-label class="q-pl-md">{{ customer.website }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label overline>Relevance</q-item-label>
          <q-item-label class="q-pl-md">{{ customer.relevance }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-if="customer.notes">
        <q-item-section>
          <q-item-label overline>Notes</q-item-label>
          <q-item-label class="q-pl-md">{{ customer.notes }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-card>

  <q-card bordered class="q-mt-md">
    <q-toolbar class="bg-grey-4">
      <div class="text-h6">Locations</div>
      <q-space />
      <q-btn v-if="!isArchived" round color="green" size="sm" icon="add" @click="newLocationForm?.show()">
        <q-tooltip>Add New Location</q-tooltip>
      </q-btn>
    </q-toolbar>
    <q-list separator>
      <q-item v-if="activeLocations.length == 0 && !loadingLocations">
        <q-item-section class="text-grey-6">No locations entered</q-item-section>
      </q-item>
      <q-inner-loading :showing="loadingLocations" />
      <CustomerLocationForm
        v-if="!isArchived"
        ref="newLocationForm"
        :key="'new-location'"
        @add-location="addLocation"
      />
      <CustomerLocationForm
        v-for="location in activeLocations"
        :location="location"
        :key="location.id"
        :archived="isArchived"
        @delete-location="deleteLocation(location.id)"
        @archive-location="archiveLocation(location.id)"
      />
    </q-list>

    <div v-if="archivedLocations.length > 0" class="q-px-sm q-pb-sm">
      <q-btn
        flat
        dense
        size="sm"
        :icon="showArchived ? 'expand_less' : 'expand_more'"
        :label="`${showArchived ? 'Hide' : 'Show'} ${archivedLocations.length} archived location${archivedLocations.length > 1 ? 's' : ''}`"
        color="grey-7"
        @click="showArchived = !showArchived"
      />
      <q-list v-if="showArchived" separator class="q-mt-xs">
        <q-item v-for="location in archivedLocations" :key="location.id" class="bg-grey-2">
          <q-item-section>
            <q-item-label class="text-grey-7">
              <div v-if="location.name || location.isPrimary" class="row items-center q-gutter-xs">
                <span v-if="location.name" class="text-bold">{{ location.name }}</span>
                <q-badge color="grey-6" label="Archived" />
              </div>
              <q-badge v-if="!location.name" color="grey-6" label="Archived" class="q-mb-xs" />
              <div>{{ location.address1 }}</div>
              <div v-if="location.address2">{{ location.address2 }}</div>
              <div>{{ location.city }}, {{ location.state }} {{ location.zipCode }}</div>
              <div>{{ location.country }}</div>
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn flat round color="grey-7" icon="unarchive" @click="restoreLocation(location.id)">
              <q-tooltip>Restore Location</q-tooltip>
            </q-btn>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-card>

  <q-card bordered class="q-mt-md">
    <q-toolbar class="bg-grey-4">
      <div class="text-h6">Contacts</div>
      <q-space />
      <q-btn v-if="!isArchived" round color="green" size="sm" icon="add" @click="newContactForm?.show()">
        <q-tooltip>Add New Contact</q-tooltip>
      </q-btn>
    </q-toolbar>
    <q-list separator>
      <q-item v-if="activeContacts.length == 0 && !loadingContacts">
        <q-item-section class="text-grey-6">No contacts entered</q-item-section>
      </q-item>
      <q-inner-loading :showing="loadingContacts" />
      <CustomerContactForm v-if="!isArchived" ref="newContactForm" :key="'new-contact'" @add-contact="addContact" />
      <CustomerContactForm
        v-for="contact in activeContacts"
        :contact="contact"
        :key="contact.id"
        :archived="isArchived"
        @delete-contact="deleteContact(contact.id)"
        @archive-contact="archiveContact(contact.id)"
      />
    </q-list>

    <div v-if="archivedContacts.length > 0" class="q-px-sm q-pb-sm">
      <q-btn
        flat
        dense
        size="sm"
        :icon="showArchivedContacts ? 'expand_less' : 'expand_more'"
        :label="`${showArchivedContacts ? 'Hide' : 'Show'} ${archivedContacts.length} archived contact${archivedContacts.length > 1 ? 's' : ''}`"
        color="grey-7"
        @click="showArchivedContacts = !showArchivedContacts"
      />
      <q-list v-if="showArchivedContacts" separator class="q-mt-xs">
        <q-item v-for="contact in archivedContacts" :key="contact.id" class="bg-grey-2">
          <q-item-section>
            <q-item-label class="text-grey-7">
              <div class="row items-center q-gutter-xs">
                <span class="text-bold">{{ contact.name }}</span>
                <span v-if="contact.position">({{ contact.position }})</span>
                <q-badge color="grey-6" label="Archived" />
              </div>
              <div v-if="contact.phone">{{ contact.phone }}</div>
              <div v-if="contact.email">{{ contact.email }}</div>
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn flat round color="grey-7" icon="unarchive" @click="restoreContact(contact.id)">
              <q-tooltip>Restore Contact</q-tooltip>
            </q-btn>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Customer, CustomerLocation, CustomerContact } from './models';
import CustomerLocationForm from './CustomerLocation.vue';
import CustomerContactForm from './CustomerContact.vue';
import { useCustomerStore } from 'src/stores/customer-store';
const store = useCustomerStore();

const props = defineProps<{
  customer: Customer;
}>();

const customer = computed(() => props.customer);
const isArchived = computed(() => !!store.customer.archivedAt);
const allContacts = computed(() => props.customer.contacts || []);
const activeContacts = computed(() => allContacts.value.filter((c) => !c.archivedAt));
const archivedContacts = computed(() => allContacts.value.filter((c) => !!c.archivedAt));
const showArchivedContacts = ref(false);
const allLocations = computed(() => props.customer.locations || []);
const activeLocations = computed(() => allLocations.value.filter((l) => !l.archivedAt));
const archivedLocations = computed(() => allLocations.value.filter((l) => !!l.archivedAt));
const showArchived = ref(false);

const editingCompanyInfo = ref(false);
const editDraft = ref<Customer>({ ...props.customer });

const openEditForm = () => {
  editDraft.value = {
    ...customer.value,
    website: customer.value.website ?? '',
    relevance: customer.value.relevance ?? '',
    notes: customer.value.notes ?? '',
  };
  editingCompanyInfo.value = true;
};

const submitEdit = () => {
  store.updateCustomer(editDraft.value);
  editingCompanyInfo.value = false;
};

const newLocationForm = ref<InstanceType<typeof CustomerLocationForm> | null>(null);
const newContactForm = ref<InstanceType<typeof CustomerContactForm> | null>(null);

const loadingContacts = ref(false);
const loadingLocations = ref(false);

const addLocation = (newLocation: object) => {
  store.addLocation(newLocation as CustomerLocation);
};

const deleteLocation = (id: number) => {
  const index = (props.customer.locations || []).findIndex((l) => l.id === id);
  if (index !== -1) store.deleteLocation(index);
};

const archiveLocation = (id: number) => {
  store.archiveLocation(id);
};

const restoreLocation = (id: number) => {
  store.restoreLocation(id);
};

const addContact = (newContact: object) => {
  store.addContact(newContact as CustomerContact);
};

const deleteContact = (id: number) => {
  const index = (props.customer.contacts || []).findIndex((c) => c.id === id);
  if (index !== -1) store.deleteContact(index);
};

const archiveContact = (id: number) => {
  store.archiveContact(id);
};

const restoreContact = (id: number) => {
  store.restoreContact(id);
};

const archiveCustomer = () => {
  void store.archiveCustomer(props.customer.id);
  editingCompanyInfo.value = false;
};

const restoreCustomer = () => {
  void store.restoreCustomer(props.customer.id);
};
</script>
