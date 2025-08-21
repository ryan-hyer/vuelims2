<template>
  <q-item>
    <q-item-section>
      <q-card bordered class="q-pa-sm" v-if="formIsVisible">
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
            <q-btn round color="red" icon="delete" @click="emit('deleteContact')" />
          </q-card-actions>
        </q-form>
      </q-card>
      <q-item-label v-else>
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
    <q-item-section side bottom v-if="!formIsVisible">
      <q-btn flat round color="grey" icon="edit" @click="formIsVisible = true" />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { CustomerContact } from './models';

const props = defineProps({
  contact: {
    type: Object as () => CustomerContact,
    required: true,
  },
});

const emit = defineEmits<{
  deleteContact: [];
}>();

const contact = ref(props.contact);

const formIsVisible = ref(false);

const submitForm = () => {
  // Update the database
  formIsVisible.value = false;
  console.log(contact.value);
};
</script>
