<template>
  <q-item v-if="formIsVisible">
    <q-item-section>
      <q-card
        bordered
        :class="props.interaction ? 'q-pa-sm bg-light-blue-1' : 'q-pa-sm bg-green-1'"
      >
        <q-form @submit.prevent="submitForm" class="q-gutter-xs">
          <q-input
            dense
            hide-bottom-space
            v-model="interaction.date"
            label="Interaction Date"
            type="date"
            lazy-rules
            :rules="[(val) => !!val || 'Cannot be blank']"
          />
          <q-select
            dense
            hide-bottom-space
            v-model="interaction.type"
            :options="interactionTypeOptions"
            label="Type of Interaction"
            lazy-rules
            :rules="[(val) => !!val || 'Cannot be blank']"
          />
          <q-input
            dense
            hide-bottom-space
            v-model="interaction.with"
            label="With (Person/Group)"
            lazy-rules
            :rules="[(val) => !!val || 'Cannot be blank']"
          />
          <q-input
            dense
            hide-bottom-space
            v-model="interaction.description"
            label="Summary of Interaction"
            type="textarea"
            lazy-rules
            :rules="[(val) => !!val || 'Cannot be blank']"
          />
          <q-input
            dense
            hide-bottom-space
            v-model="interaction.followUpAction"
            label="Follow-up Actions"
            type="textarea"
          />
          <q-input
            dense
            hide-bottom-space
            v-model="interaction.followUpByDate"
            label="Follow-up Date"
            type="date"
          />
          <q-select
            dense
            hide-bottom-space
            v-model="interaction.followUpAssignedTo"
            :options="employees"
            label="Follow-up Assigned To"
          />

          <q-card-actions>
            <q-btn label="Submit" type="submit" color="teal" />
            <q-btn label="Cancel" flat class="q-ml-sm" @click="formIsVisible = false" />
            <q-space />
            <span v-if="props.interaction">
              <q-btn round color="red" icon="delete" @click="emit('deleteInteraction')">
                <q-tooltip>Delete Interaction Record</q-tooltip>
              </q-btn>
            </span>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-item-section>
  </q-item>

  <q-item v-if="!formIsVisible && props.interaction">
    <q-item-section>
      <q-item-label overline>
        {{ interaction.date }} - {{ interaction.type }} with {{ interaction.with }}
      </q-item-label>
      <q-item-label caption>{{ interaction.description }}</q-item-label>
      <q-item-label caption v-if="interaction.followUpCompleted"
        >Follow-up: {{ interaction.followUpAction }} (completed)</q-item-label
      >
      <q-card
        bordered
        class="bg-grey-2 q-pa-sm q-mt-sm"
        v-if="interaction.followUpAction && !interaction.followUpCompleted"
      >
        <div v-if="interaction.followUpAction">
          <span class="text-bold">Follow-up:</span> {{ interaction.followUpAction }}
        </div>
        <div v-if="interaction.followUpAssignedTo">
          <span class="text-bold">Assigned to:</span> {{ interaction.followUpAssignedTo }}
        </div>
        <div v-if="interaction.followUpByDate" class="text-weight-bold text-red">
          Follow-up By: {{ interaction.followUpByDate }}
        </div>
        <!-- This button should only be visible to the assigned person and admins -->
        <q-btn
          size="xs"
          icon="check"
          color="green"
          label="Mark Complete"
          @click="interaction.followUpCompleted = true"
        />
      </q-card>
    </q-item-section>
    <q-item-section side bottom>
      <q-btn flat round color="grey" icon="edit" @click="formIsVisible = true" />
    </q-item-section>
  </q-item>

  <q-item dense v-if="!formIsVisible && !props.interaction">
    <q-btn
      rounded
      color="green"
      icon="add_box"
      label="Add New Interaction"
      class="q-mb-md"
      @click="formIsVisible = true"
    />
  </q-item>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { CustomerInteraction } from './models';

const props = defineProps({
  interaction: {
    type: Object as () => CustomerInteraction,
  },
});

const emit = defineEmits<{
  addInteraction: [interaction: object];
  deleteInteraction: [];
}>();

const interaction = ref(
  props.interaction || {
    id: Date.now(),
    date: '',
    type: '',
    with: '',
    description: '',
    followUpAction: '',
    followUpByDate: '',
    followUpCompleted: false,
  },
);

const interactionTypeOptions = ['Phone Call', 'Email', 'Meeting', 'Virtual Meeting', 'Other'];

const formIsVisible = ref(false);

const submitForm = () => {
  if (props.interaction) {
    // Update the database
  } else {
    emit('addInteraction', interaction.value);
    interaction.value = {
      id: Date.now(), // Reset for a new entry
      date: '',
      type: '',
      with: '',
      description: '',
      followUpAction: '',
      followUpByDate: '',
      followUpAssignedTo: '',
      followUpCompleted: false,
    };
  }
  formIsVisible.value = false;
};

const employees = [
  {
    value: '1',
    label: 'Merrill Gee',
  },
  { value: '2', label: 'Ryan Hyer' },
  {
    value: '3',
    label: 'Alona MacGregor',
  },
  {
    value: '4',
    label: 'Matthew MacGregor',
  },
  {
    value: '5',
    label: 'Frank Strickland',
  },
];
</script>
