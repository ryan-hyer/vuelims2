<template>
  <q-layout view="hHh LpR fFf" class="bg-grey-1">
    <q-header elevated class="bg-white text-grey-8 q-py-xs">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-btn flat no-caps no-wrap class="q-ml-xs" :to="{ name: 'home' }">
          <q-icon name="img:/logo.gif" size="28px" />
          <q-toolbar-title shrink class="text-weight-bold"> TEi LIMS </q-toolbar-title>
        </q-btn>

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn round dense flat color="grey-8" icon="search">
            <q-menu>
              <div class="toolbar-input-container row no-wrap">
                <q-input
                  dense
                  outlined
                  square
                  v-model="search"
                  placeholder="Search"
                  class="bg-white col"
                />
                <q-btn
                  class="toolbar-input-btn"
                  color="grey-3"
                  text-color="grey-8"
                  icon="search"
                  unelevated
                />
              </div>
            </q-menu>
            <q-tooltip>Search</q-tooltip>
          </q-btn>

          <q-btn round flat>
            <q-menu>
              <q-list>
                <q-item clickable v-ripple v-close-popup :to="{ name: 'user-profile' }">
                  <q-item-section avatar>
                    <q-icon color="grey-8" name="face"></q-icon>
                  </q-item-section>
                  <q-item-section>My Employee Info</q-item-section>
                </q-item>
                <q-item clickable v-ripple v-close-popup :to="{ name: 'change-password' }">
                  <q-item-section avatar>
                    <q-icon color="grey-8" name="message">
                      <q-badge color="red" text-color="white" floating>572</q-badge>
                    </q-icon>
                  </q-item-section>
                  <q-item-section>Messages</q-item-section>
                </q-item>
                <q-item clickable v-ripple v-close-popup :to="{ name: 'change-password' }">
                  <q-item-section avatar>
                    <q-icon color="grey-8" name="notifications">
                      <q-badge color="red" text-color="white" floating>812</q-badge>
                    </q-icon>
                  </q-item-section>
                  <q-item-section>Notifications</q-item-section>
                </q-item>
                <q-item clickable v-ripple v-close-popup :to="{ name: 'change-password' }">
                  <q-item-section avatar>
                    <q-icon color="grey-8" name="manage_accounts"></q-icon>
                  </q-item-section>
                  <q-item-section>User Settings</q-item-section>
                </q-item>
                <q-item clickable v-ripple v-close-popup :to="{ name: 'change-password' }">
                  <q-item-section avatar>
                    <q-icon color="grey-8" name="help"></q-icon>
                  </q-item-section>
                  <q-item-section>Help</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-ripple v-close-popup :to="{ name: 'login' }">
                  <!-- TODO: Actually log out the user when this is clicked, then navigate back to the login screen -->
                  <q-item-section avatar>
                    <q-icon color="grey-8" name="logout"></q-icon>
                  </q-item-section>
                  <q-item-section>Log Out</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
            <q-avatar size="26px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
              <q-badge rounded floating color="red" text-color="white">6,954</q-badge>
            </q-avatar>
            <q-tooltip>Account</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-grey-2">
      <q-scroll-area class="fit">
        <q-list padding>
          <MenuLink v-for="link in linksList" :key="link.title" v-bind="link" />
          <q-separator class="q-my-xs" />

          <MenuLinkSection
            v-for="section in linkSectionList"
            :key="section.title"
            v-bind="section"
          />
          <q-separator class="q-my-xs" />
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MenuLink, { type MenuLinkProps } from 'src/components/MenuLink.vue';
import MenuLinkSection, { type MenuLinkSectionProps } from 'src/components/MenuLinkSection.vue';

const search = ref('');

const linksList: MenuLinkProps[] = [
  {
    title: 'Dashboard',
    icon: 'home',
    link: 'home',
  },
  {
    title: 'Projects',
    icon: 'work',
    link: 'project-list',
  },
  {
    title: 'Customers',
    icon: 'people',
    link: 'customer-list',
  },
  {
    title: 'Invoicing',
    icon: 'receipt_long',
    link: 'home',
  },
];

const linkSectionList: MenuLinkSectionProps[] = [
  {
    title: 'Organization',
    icon: 'apartment',
    linksList: [
      { icon: 'policy', title: 'Legal Documents', link: 'home' },
      { icon: 'account_tree', title: 'Org Structure & Roles', link: 'home' },
      { icon: 'engineering', title: 'Personnel', link: 'personnel-list' },
    ],
  },
  {
    title: 'Quality System',
    icon: 'fact_check',
    linksList: [
      { icon: 'description', title: 'Quality Documents', link: 'home' },
      { icon: 'gpp_maybe', title: 'Risk Management', link: 'home' },
      { icon: 'list', title: 'Corrective/Preventive Actions', link: 'home' },
      { icon: 'thumb_down_alt', title: 'Complaints/Appeals', link: 'home' },
      { icon: 'dangerous', title: 'Nonconforming Work', link: 'home' },
      { icon: 'local_shipping', title: 'External Providers', link: 'home' },
      { icon: 'checklist', title: 'Internal Audits', link: 'home' },
      { icon: 'grading', title: 'Management Reviews', link: 'home' },
    ],
  },
  {
    title: 'Quality Control',
    icon: 'insights',
    linksList: [
      { icon: 'quiz', title: 'Proficiency Testing', link: 'home' },
      { icon: 'help', title: 'TBD-QC', link: 'home' },
    ],
  },
  {
    title: 'Testing',
    icon: 'science',
    linksList: [
      { icon: 'construction', title: 'Equipment', link: 'home' },
      { icon: 'help', title: 'TBD-TS', link: 'home' },
    ],
  },
  {
    title: 'Certification',
    icon: 'verified',
    linksList: [{ icon: 'help', title: 'TBD-LS', link: 'home' }],
  },
  {
    title: 'Inspection',
    icon: 'badge',
    linksList: [{ icon: 'help', title: 'TBD-IS', link: 'home' }],
  },
  {
    title: 'Library',
    icon: 'local_library',
    linksList: [
      { icon: 'library_books', title: 'Standards', link: 'home' },
      { icon: 'help', title: 'TBD-LibSvcs', link: 'home' },
    ],
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
