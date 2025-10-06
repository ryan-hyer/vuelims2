<template>
  <q-card bordered v-if="customer">
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
            <q-inner-loading :showing="loadingLocations" />
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
            <q-inner-loading :showing="loadingContacts" />

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
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Customer, CustomerLocation, CustomerContact } from './models';
import CustomerLocationForm from './CustomerLocation.vue';
import CustomerContactForm from './CustomerContact.vue';
import { useCustomerStore } from 'src/stores/store';
const store = useCustomerStore();

const props = defineProps<{
  customer: Customer;
}>();

const customer = ref(props.customer || {});
const customerContacts = ref<CustomerContact[]>(props.customer.contacts || []);
const customerLocations = ref<CustomerLocation[]>(props.customer.locations || []);

const loadingContacts = ref(false);
const loadingLocations = ref(false);

const addLocation = (newLocation: object) => {
  store.addLocation(newLocation as CustomerLocation);
};

const deleteLocation = (index: number) => {
  customerLocations.value.splice(index, 1);
};

const addContact = (newContact: object) => {
  store.addContact(newContact as CustomerContact);
};

const deleteContact = (index: number) => {
  store.deleteContact(index);
};
</script>
