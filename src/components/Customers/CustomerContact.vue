<template>
  <q-item v-if="formIsVisible">
    <q-item-section>
      <q-card bordered :class="props.contact ? 'q-pa-sm bg-light-blue-1' : 'q-pa-sm bg-green-1'">
        <q-form @submit="submitForm" class="q-gutter-xs">
          <q-input
            dense
            hide-bottom-space
            v-model="contact.name"
            label="Full Name"
            lazy-rules
            :rules="[(val) => !!val || 'Cannot be blank']"
          />
          <q-input
            dense
            hide-bottom-space
            v-model="contact.position"
            label="Position in Their Company"
          />
          <q-input dense hide-bottom-space v-model="contact.phone" label="Best Phone Number" />
          <q-input dense hide-bottom-space v-model="contact.email" label="Email Address" />
          <q-input type="textarea" dense hide-bottom-space v-model="contact.notes" label="Notes" />

          <q-card-actions>
            <q-btn label="Submit" type="submit" color="teal" />
            <q-btn label="Cancel" flat class="q-ml-sm" @click="formIsVisible = false" />
            <q-space />
            <span v-if="props.contact" class="q-gutter-xs">
              <q-btn round color="grey-7" icon="archive" @click="emit('archiveContact')">
                <q-tooltip>Archive Contact</q-tooltip>
              </q-btn>
              <q-btn v-if="authStore.isAdmin" round color="red" icon="delete" @click="emit('deleteContact')">
                <q-tooltip>Delete Contact</q-tooltip>
              </q-btn>
            </span>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-item-section>
  </q-item>

  <q-card bordered class="q-ma-sm" v-if="!formIsVisible && props.contact">
    <q-toolbar class="q-py-sm q-pl-md">
      <q-item-label>
        <div>
          {{ contact.name }} <span v-if="contact.position">({{ contact.position }})</span>
        </div>
        <div v-if="contact.phone">{{ contact.phone }}</div>
        <div v-if="contact.email">{{ contact.email }}</div>
      </q-item-label>
      <q-space />
      <q-btn
        v-if="contact.notes"
        flat
        round
        :color="notesVisible ? 'teal' : 'primary'"
        icon="sticky_note_2"
        @click="notesVisible = !notesVisible"
      >
        <q-tooltip>{{ notesVisible ? 'Hide Notes' : 'Show Notes' }}</q-tooltip>
      </q-btn>
      <q-btn v-if="!props.archived" flat round color="primary" icon="edit" @click="formIsVisible = true">
        <q-tooltip>Edit Contact</q-tooltip>
      </q-btn>
    </q-toolbar>
    <q-card-section v-if="notesVisible && contact.notes" class="q-pt-none text-body2">
      <div class="text-bold">Notes:</div>
      <div style="white-space: pre-wrap">{{ contact.notes }}</div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { CustomerContact } from './models';
import { useAuthStore } from 'src/stores/auth-store';

const authStore = useAuthStore();

const props = defineProps<{
  contact?: CustomerContact;
  archived?: boolean;
}>();

const emit = defineEmits<{
  addContact: [contact: object];
  deleteContact: [];
  archiveContact: [];
}>();

const contact = ref<CustomerContact>(
  props.contact || {
    id: Date.now(),
    customerId: 0,
    name: '',
    position: '',
    phone: '',
    email: '',
    notes: '',
  },
);

const formIsVisible = ref(false);
const notesVisible = ref(false);

defineExpose({
  show: () => {
    formIsVisible.value = true;
  },
});

const submitForm = () => {
  if (props.contact) {
    // Update the database
  } else {
    emit('addContact', contact.value);
    contact.value = {
      id: Date.now(), // Reset for a new entry
      customerId: 0,
      name: '',
      position: '',
      phone: '',
      email: '',
      notes: '',
    };
  }
  formIsVisible.value = false;
};
</script>
