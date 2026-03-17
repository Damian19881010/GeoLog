import PublicLayout from '@/layouts/PublicLayout.vue'

export const publicRoutes = [
  {
    path: '/login',
    component: PublicLayout,
    meta: {
      allowAnonymous: true,
      guestOnly: true,
    },
    children: [
      {
        path: '',
        name: 'login',
        meta: {
          title: 'Login',
        },
        component: () => import('@/views/auth/LoginView.vue'),
      },
    ],
  },
]
