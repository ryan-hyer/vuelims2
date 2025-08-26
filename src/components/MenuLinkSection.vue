<template>
  <q-expansion-item>
    <template v-slot:header>
      <q-item-section avatar>
        <q-icon color="grey" :name="icon" />
      </q-item-section>
      <q-item-section>{{ title }}</q-item-section>
    </template>
    <MenuLink
      v-for="link in linksList"
      :key="link.title"
      v-bind="link"
      style="margin-left: 5px; border-left: 2px solid black"
    />
  </q-expansion-item>
</template>

<script setup lang="ts">
import MenuLink, { type MenuLinkProps } from 'src/components/MenuLink.vue';

export interface MenuLinkSectionProps {
  title: string;
  icon?: string;
  linksList: Array<MenuLinkProps>;
}

withDefaults(defineProps<MenuLinkSectionProps>(), {
  icon: '',
});
</script>
