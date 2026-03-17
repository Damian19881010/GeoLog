import DefaultLayout from '@/layouts/DefaultLayout.vue'

export const privateRoutes = [
  {
    path: '/',
    component: DefaultLayout,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        name: 'home',
        meta: {
          title: 'Home',
          containerized: true,
        },
        component: () => import('@/views/HomeView.vue'),
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        meta: {
          title: 'Dashboard',
          containerized: true,
        },
        component: () => import('@/views/DashboardView.vue'),
      },
      {
        path: 'book',
        name: 'book',
        meta: {
          title: 'Book',
          containerized: false,
        },
        component: () => import('@/views/book/index.vue'),
      },
    ],
  },
]
