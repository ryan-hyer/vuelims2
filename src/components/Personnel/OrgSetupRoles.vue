<template>
  <q-page padding>
    <q-inner-loading :showing="loading" label="Loading org chart..." />
    <div class="page-header">Organization Structure & Roles</div>
    <div class="row items-center q-mb-xs">
      <div class="text-caption text-italic">Click a role to view/edit details</div>
      <q-space />
      <q-btn round icon="add" color="green" class="q-ma-sm" @click="addingNew = true">
        <q-tooltip>Add New Role</q-tooltip>
      </q-btn>
    </div>
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

  <q-dialog v-model="dialog" position="right" persistent>
    <OrgSetupRole
      v-if="selectedRole || addingNew"
      v-bind="selectedRole ? { role: selectedRole } : {}"
      :isNew="addingNew"
      @close="handleClose"
      @update="handleRoleUpdate"
      @delete="handleRoleDelete"
    />
  </q-dialog>
</template>

<script setup lang="ts">
/*
TODO:
Methods for adding/deleting roles, and a way to change supervisors
*/
import { ref, onMounted, computed } from 'vue';
import { usePersonnelStore } from 'src/stores/personnel-store';
import type { Role } from './models';
import OrgSetupRole from './OrgSetupRole.vue';
const store = usePersonnelStore();

const loading = ref(false);
const treeData = ref<object[]>([]);
const selected = ref<number | null>(null);
const expanded = ref<number[]>([]);
const roles = ref<Role[]>([]);
const addingNew = ref(false);

const dialog = computed(() => {
  return selected.value !== null || addingNew.value;
});

const selectedRole = computed(() => {
  return roles.value.find((role) => role.id === selected.value) ?? null;
});

const handleClose = () => {
  selected.value = null;
  addingNew.value = false;
};

const refreshOrg = async () => {
  await store.fetchOrg();
  treeData.value = store.orgTree;
  roles.value = store.allRoles;
  expanded.value = store.roleList;
};

const handleRoleDelete = async (roleId: number) => {
  await store.deleteRole(roleId);
  selected.value = null;
  await refreshOrg();
};

const handleRoleUpdate = async (updatedRole: Role) => {
  if (addingNew.value) {
    await store.addRole(updatedRole);
    addingNew.value = false;
  } else {
    await store.updateRole(updatedRole);
    const index = roles.value.findIndex((r) => r.id === updatedRole.id);
    if (index !== -1) roles.value[index] = { ...updatedRole };
  }
  await refreshOrg();
};

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
