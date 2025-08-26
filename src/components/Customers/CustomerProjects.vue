<template>
  <q-tab-panel name="projects">
    <!-- TODO: Work in progress. This whole thing will likely change significantly once I get the main Projects and Invoices modules finished -->
    <q-list separator>
      <q-item v-for="project in projects" :key="project.id">
        <q-item-section>
          <q-item-label class="text-bold">{{ project.number }}</q-item-label>
          <q-item-label>{{ project.description }}</q-item-label>
          <q-item-label caption>
            Start: {{ project.startDate }} | Complete: {{ project.completeDate }} | Invoice:
            {{ project.invoiceDate }} (${{ project.invoiceAmount }}) | Paid:
            {{ project.invoicePaid ? project.invoicePaid : 'Unpaid' }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-tab-panel>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Production data should be sorted so that unfinished projects are at the top, then by start date descending
const projects = ref([
  {
    id: 3,
    number: 'LS2500347',
    description: 'Listing Addition - Composite Sinks, models 6, 7, 8',
    startDate: '2023-11-01',
    completeDate: '2023-12-01',
    invoiceDate: '2023-11-15',
    invoiceAmount: 4000,
    invoicePaid: null,
  },
  {
    id: 2,
    number: 'LS2500346',
    description: 'Listing Addition - Metal Sinks, models 1, 2',
    startDate: '2023-10-01',
    completeDate: '2023-11-01',
    invoiceDate: '2023-10-15',
    invoiceAmount: 3000,
    invoicePaid: null,
  },
  {
    id: 1,
    number: 'LS2500345',
    description: 'Listing Addition - Plastic Sinks, models 3, 4, 5',
    startDate: '2023-09-15',
    completeDate: '2023-10-15',
    invoiceDate: '2023-10-01',
    invoiceAmount: 2500,
    invoicePaid: '2023-12-11',
  },
]);
</script>
