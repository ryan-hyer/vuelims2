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
            <span v-if="props.contact">
              <q-btn round color="red" icon="delete" @click="emit('deleteContact')">
                <q-tooltip>Delete Contact</q-tooltip>
              </q-btn>
            </span>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-item-section>
  </q-item>

  <q-item v-if="!formIsVisible && props.contact">
    <q-item-section>
      <q-item-label>
        <div>
          {{ contact.name }} <span v-if="contact.position">({{ contact.position }})</span>
        </div>
        <div v-if="contact.phone">{{ contact.phone }}</div>
        <div v-if="contact.email">{{ contact.email }}</div>
        <q-btn flat label="View Notes" size="sm" v-if="contact.notes">
          <q-popup-proxy>
            <q-card>
              <q-card-section>
                <div style="white-space: pre">{{ contact.notes }}</div>
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

  <q-item v-if="!formIsVisible && !props.contact">
    <q-btn
      color="green"
      icon="add"
      label="Add New Contact"
      class="q-ma-xs"
      size="sm"
      @click="formIsVisible = true"
    />
  </q-item>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { CustomerContact } from './models';

const props = defineProps({
  contact: {
    type: Object as () => CustomerContact,
  },
});

const emit = defineEmits<{
  addContact: [contact: object];
  deleteContact: [];
}>();

const contact = ref(
  props.contact || {
    id: Date.now(),
    name: '',
    position: '',
    phone: '',
    email: '',
    notes: '',
  },
);

const formIsVisible = ref(false);

const submitForm = () => {
  if (props.contact) {
    // Update the database
  } else {
    emit('addContact', contact.value);
    contact.value = {
      id: Date.now(), // Reset for a new entry
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
