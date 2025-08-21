<!-- TODO: Figure out how to use Transition to "slide" in the form -->
<template>
  <q-item v-if="formIsVisible">
    <q-item-section>
      <q-card bordered :class="props.location ? 'q-pa-sm bg-light-blue-2' : 'q-pa-sm bg-green-2'">
        <q-form @submit="submitForm" class="q-gutter-xs">
          <q-input dense hide-bottom-space v-model="location.name" label="Facility Name" />
          <q-input
            type="textarea"
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
            label="State / Province / Region"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Cannot be blank']"
          />
          <q-input
            dense
            hide-bottom-space
            v-model="location.zipCode"
            label="Zip / Postal Code"
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
          <q-input dense hide-bottom-space v-model="location.phone" label="Main Phone Number" />
          <q-input type="textarea" dense hide-bottom-space v-model="location.notes" label="Notes" />

          <q-card-actions>
            <q-btn label="Submit" type="submit" color="teal" />
            <q-btn label="Cancel" flat class="q-ml-sm" @click="formIsVisible = false" />
            <q-space />
            <span v-if="props">
              <q-btn round color="red" icon="delete" @click="emit('deleteLocation')">
                <q-tooltip>Delete Location</q-tooltip>
              </q-btn>
            </span>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-item-section>
  </q-item>

  <q-item v-if="!formIsVisible && props.location">
    <q-item-section>
      <q-item-label>
        <div v-if="location.name">{{ location.name }}</div>
        <div style="white-space: pre">{{ location.address }}</div>
        <div>
          {{ location.city }}, {{ location.customerState }}
          {{ location.zipCode }}
        </div>
        <div>{{ location.country }}</div>
        <div v-if="location.phone">{{ location.phone }}</div>
        <q-btn flat label="View Notes" size="sm" v-if="location.notes">
          <q-popup-proxy>
            <q-card>
              <q-card-section>
                <div style="white-space: pre">{{ location.notes }}</div>
              </q-card-section>
            </q-card>
          </q-popup-proxy>
        </q-btn>
      </q-item-label>
    </q-item-section>

    <q-item-section side bottom>
      <q-btn flat round color="grey" icon="edit" @click="formIsVisible = true" />
    </q-item-section>
  </q-item>

  <q-item v-if="!formIsVisible && !props.location">
    <q-btn
      color="green"
      icon="add"
      label="Add New Location"
      class="q-ma-xs"
      size="sm"
      @click="formIsVisible = true"
    />
  </q-item>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { CustomerLocation } from './models';

const props = defineProps({
  location: {
    type: Object as () => CustomerLocation,
  },
});

const emit = defineEmits<{
  addLocation: [location: object];
  deleteLocation: [];
}>();

const location = ref(
  props.location || {
    id: Date.now(), // Simulate an ID for the new location
    name: '',
    address: '',
    city: '',
    customerState: '',
    zipCode: '',
    country: '',
    phone: '',
    notes: '',
  },
);

const formIsVisible = ref(false);

const submitForm = () => {
  if (props.location) {
    // Update the database
  } else {
    emit('addLocation', location.value);
    location.value = {
      id: Date.now(), // Reset for a new entry
      name: '',
      address: '',
      city: '',
      customerState: '',
      zipCode: '',
      country: '',
      phone: '',
      notes: '',
    };
  }
  formIsVisible.value = false;
};
</script>
