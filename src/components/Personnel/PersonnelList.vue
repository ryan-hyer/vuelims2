<template>
  <q-page padding>
    <div class="page-header">Personnel</div>
    <q-list bordered separator>
      <q-item
        clickable
        v-ripple
        v-for="employee in employees"
        :key="employee.id"
        :to="{
          name: 'personnel-info',
          params: { employeeId: employee.id },
        }"
      >
        <q-item-section>
          <q-item-label>{{ employee.name }}</q-item-label>
          <q-item-label caption v-for="title in employee.titles" :key="title">{{
            title
          }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <q-btn
      round
      color="green"
      icon="add"
      class="fixed-bottom-right q-ma-md"
      :to="{ name: 'personnel-new' }"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const employees = ref([
  {
    id: 1,
    name: 'Merrill Gee',
    titles: ['Quality Manager', 'Technician - TEi-TS Analytical'],
  },
  { id: 2, name: 'Ryan Hyer', titles: ['Listing Compliance Engineer'] },
  {
    id: 3,
    name: 'Alona MacGregor',
    titles: ['Director Human Resources', 'Executive Director TEi-LS', 'TEi-IS Inspector'],
  },
  {
    id: 4,
    name: 'Matthew MacGregor',
    titles: ['President and CEO', 'Executive Director TEi-TS'],
  },
  {
    id: 5,
    name: 'Frank Strickland',
    titles: ['Director TEi-TS Stone & Tile'],
  },
]);
</script>
