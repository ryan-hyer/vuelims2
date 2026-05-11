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
            label="Interaction Date (yyyy/mm/dd)"
            mask="date"
            lazy-rules
            :rules="[(val) => !!val || 'Cannot be blank']"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="interaction.date">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
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
          <!-- TODO: There should be some logic for these follow-up fields - they either all need to be filled in, or none of them - but I'm not sure how to do that -->
          <q-input
            dense
            hide-bottom-space
            v-model="interaction.followUpAction"
            label="Follow-up Actions (optional)"
            type="textarea"
          />
          <q-input
            dense
            hide-bottom-space
            v-model="interaction.followUpByDate"
            label="Follow-up Date (yyyy/mm/dd) (optional)"
            mask="date"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="interaction.followUpByDate">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-select
            dense
            hide-bottom-space
            v-model="interaction.followUpAssignedTo"
            :options="personnelStore.personnelList"
            option-value="id"
            option-label="name"
            emit-value
            map-options
            label="Follow-up Assigned To (optional)"
          />

          <q-card-actions>
            <q-btn label="Submit" type="submit" color="teal" />
            <q-btn label="Cancel" flat class="q-ml-sm" @click="formIsVisible = false" />
            <q-space />
            <span v-if="props.interaction && authStore.isAdmin">
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
      <q-item-label caption
        ><div style="white-space: pre-wrap">{{ interaction.description }}</div></q-item-label
      >
      <q-item-label caption v-if="interaction.followUpCompleted"
        >Follow-up: {{ interaction.followUpAction }} (completed)</q-item-label
      >
      <q-card
        bordered
        class="bg-grey-2 q-pa-sm q-mt-sm"
        v-if="interaction.followUpAction && !interaction.followUpCompleted"
      >
        <div v-if="interaction.followUpAction" style="white-space: pre-wrap">
          <div class="text-h6">Follow-up:</div>
          <div>{{ interaction.followUpAction }}</div>
        </div>
        <div v-if="interaction.followUpAssignedTo">
          <span class="text-bold">Assigned to:</span> {{ assignedToName }}
        </div>
        <div v-if="interaction.followUpByDate" class="text-weight-bold text-red">
          Follow-up By: {{ interaction.followUpByDate }}
        </div>
        <q-btn
          v-if="authStore.isAdmin || interaction.followUpAssignedTo === authStore.user?.employeeId"
          size="xs"
          icon="check"
          color="green"
          label="Mark Complete"
          @click="interaction.followUpCompleted = true"
        />
      </q-card>
    </q-item-section>
    <q-item-section v-if="!props.archived" side bottom>
      <q-btn flat round color="grey" icon="edit" @click="formIsVisible = true" />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { CustomerInteraction } from './models';
import { usePersonnelStore } from 'src/stores/personnel-store';
import { useAuthStore } from 'src/stores/auth-store';

const personnelStore = usePersonnelStore();
const authStore = useAuthStore();

const props = defineProps<{
  interaction?: CustomerInteraction;
  archived?: boolean;
}>();

const emit = defineEmits<{
  addInteraction: [interaction: object];
  deleteInteraction: [];
}>();

const interaction = ref(
  props.interaction || {
    id: Date.now(),
    customerId: 0,
    date: '',
    type: '',
    with: '',
    description: '',
    followUpAction: '',
    followUpByDate: '',
    followUpAssignedTo: undefined as number | undefined,
    followUpCompleted: false,
  },
);

const interactionTypeOptions = ['Phone Call', 'Email', 'Meeting', 'Virtual Meeting', 'Other'];

const assignedToName = computed(() => {
  if (!interaction.value.followUpAssignedTo) return '';
  return (
    personnelStore.personnelList.find((p) => p.id === interaction.value.followUpAssignedTo)?.name ??
    ''
  );
});

const formIsVisible = ref(false);

defineExpose({
  show: () => {
    formIsVisible.value = true;
  },
});

onMounted(async () => {
  if (!personnelStore.personnelList.length) {
    await personnelStore.fetchAllPersonnel();
  }
});

const submitForm = () => {
  if (props.interaction) {
    // Update the database
  } else {
    emit('addInteraction', interaction.value);
    interaction.value = {
      id: Date.now(), // Reset for a new entry
      customerId: 0,
      date: '',
      type: '',
      with: '',
      description: '',
      followUpAction: '',
      followUpByDate: '',
      followUpAssignedTo: undefined as number | undefined,
      followUpCompleted: false,
    };
  }
  formIsVisible.value = false;
};
</script>
