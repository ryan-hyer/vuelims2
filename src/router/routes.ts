import type { RouteRecordRaw } from 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('src/pages/TheLogin.vue'),
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
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
    meta: { requiresAuth: true },
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
    meta: { requiresAuth: true },
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
    meta: { requiresAuth: true },
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
    meta: { requiresAuth: true },
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
    meta: { requiresAuth: true },
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
  {
    path: '/certification',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      /* If I am successful in integrating listing stuff into the larger Customer/Project modules, then I won't need any of these routes
      {
        path: '',
        name: 'certification-list',
        component: () => import('components/Certification/CertificationList.vue'),
      },
      {
        path: 'projects',
        name: 'certification-project-list',
        component: () => import('components/Certification/CertificationProjectList.vue'),
      },
      {
        path: 'project-new',
        name: 'certification-project-new',
        component: () => import('components/Certification/CertificationProjectNew.vue'),
      },
      {
        path: ':projectId',
        name: 'certification-project-detail',
        component: () => import('components/Certification/CertificationProjectDetail.vue'),
        props: true,
      },
      */
      {
        path: 'category-list',
        name: 'certification-category-list',
        component: () => import('components/Certification/CertificationCategoryList.vue'),
      },
    ],
  },
  {
    path: '/standards',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'standard-list',
        component: () => import('components/Standards/StandardList.vue'),
      },
      {
        path: 'new',
        name: 'standard-new',
        component: () => import('components/Standards/StandardNew.vue'),
      },
    ],
  },
  {
    path: '/library',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'checkout-list',
        component: () => import('components/Standards/CheckoutList.vue'),
      },
      {
        path: 'new',
        name: 'checkout-new',
        component: () => import('components/Standards/CheckoutNew.vue'),
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
