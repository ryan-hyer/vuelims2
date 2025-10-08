import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('src/pages/TheLogin.vue'),
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('pages/TheDashboard.vue'),
      },
    ],
  },
  {
    path: '/user',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'profile',
        name: 'user-profile',
        component: () => import('pages/Users/UserProfile.vue'),
      },
      {
        path: 'changepassword',
        name: 'change-password',
        component: () => import('pages/Users/ChangePassword.vue'),
      },
    ],
  },
  {
    path: '/projects',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'project-list',
        component: () => import('components/Projects/ProjectList.vue'),
        props: true,
      },
      {
        path: 'new',
        name: 'project-new',
        component: () => import('components/Projects/ProjectNew.vue'),
      },
      {
        path: ':projectId',
        name: 'project-detail',
        component: () => import('components/Projects/ProjectDetail.vue'),
        props: true,
      },
    ],
  },
  {
    path: '/customers',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'customer-list',
        component: () => import('components/Customers/CustomerList.vue'),
      },
      {
        path: 'new',
        name: 'customer-new',
        component: () => import('components/Customers/CustomerNew.vue'),
      },
      {
        path: ':customerId',
        name: 'customer-detail',
        component: () => import('components/Customers/CustomerDetail.vue'),
        props: true,
      },
    ],
  },
  {
    path: '/org',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'legal',
        name: 'org-legal',
        component: () => import('components/Personnel/OrgSetupLegal.vue'),
      },
      {
        path: 'roles',
        name: 'org-roles',
        component: () => import('components/Personnel/OrgSetupRoles.vue'),
      },
    ],
  },
  {
    path: '/personnel',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'personnel-list',
        component: () => import('components/Personnel/PersonnelList.vue'),
      },
      {
        path: 'new',
        name: 'personnel-new',
        component: () => import('components/Personnel/PersonnelNew.vue'),
      },
      {
        path: ':employeeId',
        component: () => import('components/Personnel/PersonnelDetail.vue'),
        name: 'personnel-detail',
        props: true,
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
