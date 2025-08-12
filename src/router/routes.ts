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
    path: '/personnel',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'personnel-list',
        component: () => import('components/Personnel/PersonnelList.vue'),
        props: true,
      },
      {
        path: 'new',
        name: 'personnel-new',
        component: () => import('components/Personnel/PersonnelNew.vue'),
      },
      {
        path: ':employeeId',
        component: () => import('components/Personnel/PersonnelDetail.vue'),
        props: true,
        children: [
          {
            path: 'identity',
            name: 'personnel-info',
            component: () => import('components/Personnel/PersonnelInfo.vue'),
            props: true,
          },
          {
            path: 'roles',
            name: 'personnel-roles',
            component: () => import('components/Personnel/PersonnelRoles.vue'),
            props: true,
          },
          {
            path: 'training',
            name: 'personnel-training',
            component: () => import('components/Personnel/PersonnelTraining.vue'),
            props: true,
          },
          {
            path: 'reviews',
            name: 'personnel-reviews',
            component: () => import('components/Personnel/PersonnelReviews.vue'),
            props: true,
          },
        ],
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
