<template>
  <q-tab-panel name="interactions">
    <CustomerInteractionForm :key="'new-interaction'" @add-interaction="addInteraction" />
    <q-separator size="5px" />
    <q-list separator>
      <CustomerInteractionForm
        v-for="(interaction, index) in interactions"
        :interaction="interaction"
        :key="interaction.id"
        @delete-interaction="deleteInteraction(index)"
      />
    </q-list>
  </q-tab-panel>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { CustomerInteraction } from './models';
import CustomerInteractionForm from './CustomerInteraction.vue';

const interactions = ref<CustomerInteraction[]>([
  // In production, these should be sorted so that unfinished follow-ups are at the top, then by date descending
  {
    id: 1,
    date: '2023-10-05',
    type: 'Meeting',
    with: 'John Doe',
    description: 'Discussed project updates and next steps.',
    followUpAction: 'Send project report by end of week.',
    followUpByDate: '2023-10-07',
    followUpAssignedTo: 'Alona MacGregor', // User ID
  },
  {
    id: 2,
    date: '2023-10-01',
    type: 'Email',
    with: 'Jane Smith',
    description: 'Reviewed contract terms and conditions.',
    followUpAction: 'Email revised contract for approval.',
    followUpAssignedTo: 'Ryan Hyer', // User ID
    followUpCompleted: true,
  },
  {
    id: 3,
    date: '2023-09-28',
    type: 'Phone Call',
    with: 'Mike Johnson',
    description: 'Initial outreach and introduction.',
  },
]);

const addInteraction = (newInteraction: object) => {
  // Use an actual API call eventually
  interactions.value.unshift(newInteraction as CustomerInteraction);
};

const deleteInteraction = (index: number) => {
  // Use an actual API call eventually
  // Do I want to delete interactions?
  interactions.value.splice(index, 1);
};
</script>
