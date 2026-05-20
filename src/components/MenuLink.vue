<template>
  <q-item clickable tag="a" :to="{ name: link, query }">
    <q-item-section v-if="icon" avatar>
      <q-icon :color="color ? color : 'grey'" :name="icon" />
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
  color?: string;
  icon?: string;
  query?: Record<string, string>;
}

withDefaults(defineProps<MenuLinkProps>(), {
  link: '#',
  color: 'grey',
  icon: '',
});
</script>
