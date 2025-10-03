<template>
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
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Customer, CustomerInteraction } from './models';
import CustomerInteractionForm from './CustomerInteraction.vue';

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
