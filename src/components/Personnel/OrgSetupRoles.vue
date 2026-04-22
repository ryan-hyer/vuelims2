<template>
  <q-page padding>
    <q-inner-loading :showing="loading" label="Loading org chart..." />
    <div class="page-header">Organization Structure & Roles</div>
    <div class="text-caption text-italic">Click a role to view/edit details</div>
    <div class="q-pa-md">
      <q-tree
        :nodes="treeData"
        node-key="id"
        label-key="title"
        selected-color="primary"
        v-model:selected="selected"
        v-model:expanded="expanded"
        default-expand-all
      />
    </div>
  </q-page>

  <q-dialog v-model="dialog" position="right">
    <OrgSetupRole v-if="selectedRole" :role="selectedRole" @close="selected = ''" />
  </q-dialog>
</template>

<script setup lang="ts">
/*
TODO:
Make all the data editable
Also need methods for adding/deleting roles
*/
import { ref, onMounted, computed } from 'vue';
import { usePersonnelStore } from 'src/stores/personnel-store';
import type { Role } from './models';
import OrgSetupRole from './OrgSetupRole.vue';
const store = usePersonnelStore();

const loading = ref(false);
const treeData = ref<object[]>([]);
const selected = ref('');
const expanded = ref<string[]>([]);
const roles = ref<Role[]>([]);

const dialog = computed(() => {
  return selected.value !== '';
});

const selectedRole = computed(() => {
  return roles.value.find((role) => role.id === parseInt(selected.value)) || null;
});

onMounted(() => {
  loading.value = true;
  store
    .fetchOrg()
    .then(() => {
      treeData.value = store.orgTree;
      roles.value = store.allRoles;
      loading.value = false;
      expanded.value = store.roleList;
    })
    .catch((error) => {
      console.log('Error loading org chart: ', error);
      loading.value = false;
    });
});
</script>
