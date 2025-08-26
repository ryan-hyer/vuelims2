<template>
  <q-tab-panel name="identity">
    <q-card bordered>
      <q-list separator>
        <q-item>
          <q-item-section>
            <q-item-label overline>Company Name</q-item-label>
            <q-item-label class="q-pl-md">{{ customer.name }}</q-item-label>
          </q-item-section>
          <q-item-section side bottom>
            <q-btn flat round color="grey" icon="edit">
              <q-popup-edit
                buttons
                v-model="customer.name"
                auto-save
                v-slot="scope"
                anchor="center end"
                self="center start"
              >
                <q-input v-model="scope.value" dense autofocus @keyup.enter="scope.set" />
              </q-popup-edit>
            </q-btn>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label overline>Company Website</q-item-label>
            <q-item-label class="q-pl-md">{{ customer.website }}</q-item-label>
          </q-item-section>
          <q-item-section side bottom>
            <q-btn flat round color="grey" icon="edit">
              <q-popup-edit
                buttons
                v-model="customer.website"
                auto-save
                v-slot="scope"
                anchor="center end"
                self="center start"
              >
                <q-input v-model="scope.value" dense autofocus @keyup.enter="scope.set" />
              </q-popup-edit>
            </q-btn>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label overline>Locations</q-item-label>
            <q-list separator style="border-left: 5px solid lightgrey">
              <CustomerLocationForm
                v-for="(location, index) in customerLocations"
                :location="location"
                :key="location.id"
                @delete-location="deleteLocation(index)"
              />
              <CustomerLocationForm :key="'new-location'" @add-location="addLocation" />
            </q-list>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label overline>Contacts</q-item-label>
            <q-list separator style="border-left: 5px solid lightgrey">
              <CustomerContactForm
                v-for="(contact, index) in customerContacts"
                :contact="contact"
                :key="contact.id"
                @delete-contact="deleteContact(index)"
              />
              <CustomerContactForm :key="'new-contact'" @add-contact="addContact" />
            </q-list>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label overline>Notes</q-item-label>
            <q-item-label class="q-pl-md">
              <span v-html="customer.notes"></span>
            </q-item-label>
          </q-item-section>
          <q-item-section side bottom>
            <q-btn flat round color="grey" icon="edit">
              <q-popup-edit
                buttons
                v-model="customer.notes"
                auto-save
                v-slot="scope"
                anchor="center end"
                self="center start"
              >
                <q-editor v-model="scope.value" autofocus @keyup.enter.stop :toolbar="[]" />
              </q-popup-edit>
            </q-btn>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-tab-panel>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import type { Customer, CustomerLocation, CustomerContact } from './models';
import CustomerLocationForm from './CustomerLocation.vue';
import CustomerContactForm from './CustomerContact.vue';

const $q = useQuasar();

// Dummy data and functions -- replace with actual API calls or props as needed
const customer = ref<Customer>({
  id: 2,
  name: 'Alpha Systems',
  website: 'https://alphasystems.com',
  notes: 'Notes go here',
});

const customerLocations = ref<CustomerLocation[]>([
  {
    id: 1,
    address: '123 Main St',
    city: 'Anytown',
    customerState: 'CA',
    zipCode: '12345',
    country: 'USA',
    isPrimary: true,
  },
  {
    id: 2,
    name: 'Warehouse',
    address: '456 Elm St',
    city: 'Othertown',
    customerState: 'TX',
    zipCode: '67890',
    country: 'USA',
    isPrimary: false,
  },
]);

const customerContacts = ref<CustomerContact[]>([
  {
    id: 1,
    name: 'John Doe',
    email: 'johndoe@nil.com',
    phone: '555-1234',
    position: 'President',
  },
  {
    id: 2,
    name: 'Jane Smith',
    phone: '555-5678',
    position: 'Plant Manager',
    notes: 'Contact for invoicing',
  },
  {
    id: 3,
    name: 'Alice Johnson',
  },
]);

const addLocation = (newLocation: object) => {
  // Use an actual API call eventually
  customerLocations.value.push(newLocation as CustomerLocation);
};

const deleteLocation = (index: number) => {
  // Use an actual API call eventually
  // Do I want to delete locations? Or just archive them or something?
  customerLocations.value.splice(index, 1);
  $q.notify('Location deleted successfully'); // This doesn't seem to work?
};

const addContact = (newContact: object) => {
  // Use an actual API call eventually
  customerContacts.value.push(newContact as CustomerContact);
};

const deleteContact = (index: number) => {
  // Use an actual API call eventually
  // Do I want to delete locations? Or just archive them or something?
  customerContacts.value.splice(index, 1);
  $q.notify('Contact deleted successfully'); // This doesn't seem to work?
};
</script>
