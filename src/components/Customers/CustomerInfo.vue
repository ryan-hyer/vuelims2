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
            <q-list separator>
              <q-item v-for="location in customerLocations" :key="location.id">
                <q-item-section>
                  <q-item-label overline v-if="location.isPrimary">(Primary)</q-item-label>
                  <q-form @submit="submitForm" class="q-gutter-xs">
                    <q-input
                      dense
                      hide-bottom-space
                      v-model="location.address"
                      label="Street Address"
                      lazy-rules
                      :rules="[(val) => !!val || 'Cannot be blank']"
                    />
                    <q-input
                      dense
                      hide-bottom-space
                      v-model="location.city"
                      label="City"
                      lazy-rules
                      :rules="[(val) => (val && val.length > 0) || 'Cannot be blank']"
                    />
                    <q-input
                      dense
                      hide-bottom-space
                      v-model="location.customerState"
                      label="State"
                      lazy-rules
                      :rules="[(val) => (val && val.length > 0) || 'Cannot be blank']"
                    />
                    <q-input
                      dense
                      hide-bottom-space
                      v-model="location.zipCode"
                      label="Zip Code"
                      lazy-rules
                      :rules="[(val) => (val && val.length > 0) || 'Cannot be blank']"
                    />
                    <q-input
                      dense
                      hide-bottom-space
                      v-model="location.country"
                      label="Country"
                      lazy-rules
                      :rules="[(val) => (val && val.length > 0) || 'Cannot be blank']"
                    />

                    <q-card-actions>
                      <q-btn label="Submit" type="submit" color="teal" />
                      <q-btn label="Cancel" flat class="q-ml-sm" />
                    </q-card-actions>
                  </q-form>
                  <q-item-label>
                    {{ location.address }}<br />{{ location.city }}, {{ location.customerState }}
                    {{ location.zipCode }}<br />{{ location.country }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side bottom>
                  <q-btn flat round color="grey" icon="edit"> </q-btn>
                </q-item-section>
              </q-item>
            </q-list>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label overline>Contacts</q-item-label>
            <q-item-label class="q-pl-md">
              <div v-for="contact in customerContacts" :key="contact.id">
                {{ contact.name }} - {{ contact.email }} - {{ contact.phone }}
              </div>
            </q-item-label>
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
import type { Customer, CustomerLocation, CustomerContact } from './models';

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
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'janesmith@nil.com',
    phone: '555-5678',
  },
]);

const submitForm = () => {
  console.log('Form submitted');
};
</script>
