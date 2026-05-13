<template>
  <q-card bordered :class="archived ? 'q-ma-xs' : 'q-ma-sm'">
    <q-list separator>
      <q-toolbar class="bg-grey-3">
        <div :class="['text-bold', { 'text-grey-7': archived }]">{{ location.name }}</div>
        <q-space />
        <template v-if="archived">
          <q-badge color="grey-6" label="Archived" class="q-mr-sm" />
        </template>
        <template v-else>
          <q-btn flat round color="primary" icon="location_pin" :href="mapUrl" target="_blank">
            <q-tooltip>View on Map</q-tooltip>
          </q-btn>
          <q-btn round flat color="primary" icon="edit_note" @click="$emit('openNotes')">
            <q-tooltip>Edit Notes</q-tooltip>
          </q-btn>
          <q-btn round flat color="primary" icon="file_present">
            <q-tooltip>Documents</q-tooltip>
          </q-btn>
        </template>
      </q-toolbar>
      <q-item>
        <q-item-section>
          <q-item-label overline>Address</q-item-label>
          <div class="q-pl-md">
            <div>{{ location.address1 }}</div>
            <div v-if="location.address2">{{ location.address2 }}</div>
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
      <q-item v-if="location.notes?.length">
        <q-item-section>
          <q-item-label overline>Notes</q-item-label>
          <ul class="q-pl-lg q-mt-xs q-mb-xs">
            <li v-for="(note, i) in location.notes" :key="i">{{ note }}</li>
          </ul>
        </q-item-section>
      </q-item>
    </q-list>
  </q-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { CertificationLocation } from './models';

const props = defineProps<{
  location: CertificationLocation;
  archived?: boolean;
}>();

defineEmits<{
  openNotes: [];
}>();

const mapUrl = computed(() => {
  const parts = [
    props.location.address1,
    props.location.address2,
    props.location.city,
    props.location.state,
    props.location.zipCode,
    props.location.country,
  ]
    .filter(Boolean)
    .join(' ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parts)}`;
});
</script>
