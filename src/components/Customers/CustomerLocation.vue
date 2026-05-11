<!-- TODO: Figure out how to use Transition to "slide" in the form -->
<template>
  <q-item v-if="formIsVisible">
    <q-item-section>
      <q-card bordered :class="props.location ? 'q-pa-sm bg-light-blue-1' : 'q-pa-sm bg-green-1'">
        <q-form @submit="submitForm" class="q-gutter-xs">
          <q-input dense hide-bottom-space v-model="location.name" label="Facility Name" />
          <q-input
            dense
            hide-bottom-space
            v-model="location.address1"
            label="Address Line 1"
            lazy-rules
            :rules="[(val) => !!val || 'Cannot be blank']"
          />
          <q-input
            dense
            hide-bottom-space
            v-model="location.address2"
            label="Address Line 2 (optional)"
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
            v-model="location.state"
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
          <q-toggle v-model="location.isPrimary" label="Primary Location" />

          <q-card-actions>
            <q-btn label="Submit" type="submit" color="teal" />
            <q-btn label="Cancel" flat class="q-ml-sm" @click="formIsVisible = false" />
            <q-space />
            <span v-if="props.location">
              <q-btn round color="grey-7" icon="archive" @click="emit('archiveLocation')">
                <q-tooltip>Archive Location</q-tooltip>
              </q-btn>
              <q-btn
                v-if="authStore.isAdmin"
                round
                color="red"
                icon="delete"
                @click="emit('deleteLocation')"
              >
                <q-tooltip>Delete Location</q-tooltip>
              </q-btn>
            </span>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-item-section>
  </q-item>

  <q-card bordered class="q-ma-sm" v-if="!formIsVisible && props.location">
    <q-toolbar class="q-py-sm q-pl-md">
      <q-item-label>
        <div v-if="location.name || location.isPrimary" class="row items-center q-gutter-xs">
          <span v-if="location.name" class="text-bold">{{ location.name }}</span>
          <q-badge v-if="location.isPrimary" color="teal" label="Primary" />
        </div>
        <div style="white-space: pre">{{ location.address1 }}</div>
        <div v-if="location.address2" style="white-space: pre">{{ location.address2 }}</div>
        <div>
          {{ location.city }}, {{ location.state }}
          {{ location.zipCode }}
        </div>
        <div>{{ location.country }}</div>
        <div v-if="location.phone">{{ location.phone }}</div>
      </q-item-label>
      <q-space />
      <q-btn
        v-if="location.notes"
        flat
        round
        :color="notesVisible ? 'teal' : 'primary'"
        icon="sticky_note_2"
        @click="notesVisible = !notesVisible"
      >
        <q-tooltip>{{ notesVisible ? 'Hide Notes' : 'Show Notes' }}</q-tooltip>
      </q-btn>
      <q-btn flat round color="primary" icon="location_pin" :href="mapUrl" target="_blank">
        <q-tooltip>View on Map</q-tooltip>
      </q-btn>
      <q-btn v-if="!props.archived" flat round color="primary" icon="edit" @click="formIsVisible = true">
        <q-tooltip>Edit Location</q-tooltip>
      </q-btn>
    </q-toolbar>
    <q-card-section v-if="notesVisible && location.notes" class="q-pt-none text-body2">
      <div class="text-bold">Notes:</div>
      <div style="white-space: pre-wrap">{{ location.notes }}</div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { CustomerLocation } from './models';
import { useAuthStore } from 'src/stores/auth-store';

const authStore = useAuthStore();

const props = defineProps<{
  location?: CustomerLocation;
  archived?: boolean;
}>();

const emit = defineEmits<{
  addLocation: [location: object];
  deleteLocation: [];
  archiveLocation: [];
}>();

const location = ref(
  props.location || {
    id: Date.now(), // Simulate an ID for the new location
    customerId: 0,
    name: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
    isPrimary: false,
    notes: '',
  },
);

const formIsVisible = ref(false);
const notesVisible = ref(false);

const mapUrl = computed(() => {
  const parts = [
    location.value.address1,
    location.value.address2,
    location.value.city,
    location.value.state,
    location.value.zipCode,
    location.value.country,
  ]
    .filter(Boolean)
    .join(' ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parts)}`;
});

defineExpose({
  show: () => {
    formIsVisible.value = true;
  },
});

const submitForm = () => {
  if (props.location) {
    // Update the database
  } else {
    emit('addLocation', location.value);
    location.value = {
      id: Date.now(), // Reset for a new entry
      customerId: 0,
      name: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      phone: '',
      isPrimary: false,
      notes: '',
    };
  }
  formIsVisible.value = false;
};
</script>
