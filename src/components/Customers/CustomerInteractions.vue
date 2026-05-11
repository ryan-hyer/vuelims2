<template>
  <q-card bordered class="q-mt-md">
    <q-toolbar class="bg-grey-4">
      <div class="text-h6">Interaction Log</div>
      <q-space />
      <q-btn v-if="!isArchived" round color="green" size="sm" icon="add" @click="newInteractionForm?.show()">
        <q-tooltip>Add New Interaction</q-tooltip>
      </q-btn>
    </q-toolbar>
    <q-list separator>
      <CustomerInteractionForm
        v-if="!isArchived"
        ref="newInteractionForm"
        :key="'new-interaction'"
        @add-interaction="addInteraction"
      />
      <q-item v-if="interactions.length == 0">
        <q-item-section class="text-grey-6">No interactions entered</q-item-section>
      </q-item>
      <CustomerInteractionForm
        v-for="(interaction, index) in interactions"
        :interaction="interaction"
        :key="interaction.id"
        :archived="isArchived"
        @delete-interaction="deleteInteraction(index)"
      />
    </q-list>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Customer, CustomerInteraction } from './models';
import CustomerInteractionForm from './CustomerInteraction.vue';
import { useCustomerStore } from 'src/stores/customer-store';

const store = useCustomerStore();
const isArchived = computed(() => !!store.customer.archivedAt);

const newInteractionForm = ref<InstanceType<typeof CustomerInteractionForm> | null>(null);

const props = defineProps<{
  customer: Customer;
}>();

const interactions = ref<CustomerInteraction[]>(props.customer.interactions || []);

const addInteraction = (newInteraction: object) => {
  interactions.value.unshift(newInteraction as CustomerInteraction);
};

const deleteInteraction = (index: number) => {
  interactions.value.splice(index, 1);
};
</script>
