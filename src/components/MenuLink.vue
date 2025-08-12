<template>
  <q-item clickable tag="a" :to="{ name: link }">
    <q-item-section v-if="icon" avatar>
      <q-icon color="grey" :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
export interface MenuLinkProps {
  title: string;
  link?: string;
  icon?: string;
}

withDefaults(defineProps<MenuLinkProps>(), {
  link: '#',
  icon: '',
});
</script>
