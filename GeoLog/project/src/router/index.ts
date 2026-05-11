import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '@/utils/auth'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import PublicLayout from '@/layouts/PublicLayout.vue'

const DEFAULT_PRIVATE_ROUTE = { name: 'home' }
const DEFAULT_PUBLIC_ROUTE = { name: 'login' }

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    // ── Public ──
    {
      path: '/login',
      component: PublicLayout,
      meta: { allowAnonymous: true, guestOnly: true },
      children: [
        {
          path: '',
          name: 'login',
          meta: { title: 'Login' },
          component: () => import('@/views/auth/LoginView.vue'),
        },
      ],
    },

    // ── Private ──
    {
      path: '/',
      component: DefaultLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'home',
          meta: { title: 'Home', containerized: true },
          component: () => import('@/views/HomeView.vue'),
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          meta: { title: 'Dashboard', containerized: true },
          component: () => import('@/views/DashboardView.vue'),
        },
        {
          path: 'book',
          name: 'book',
          meta: { title: 'Book', containerized: false },
          component: () => import('@/views/book/index.vue'),
        },
      ],
    },

    // ── Catch-all ──
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      meta: { allowAnonymous: true, title: 'Page Not Found' },
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

// ── Navigation Guards ──
router.beforeEach((to) => {
  const requiresAuth = to.matched.some((r) => r.meta?.requiresAuth)
  const guestOnly = to.matched.some((r) => r.meta?.guestOnly)
  const authed = isAuthenticated()

  if (requiresAuth && !authed) {
    return { ...DEFAULT_PUBLIC_ROUTE, query: { redirect: to.fullPath } }
  }
  if (guestOnly && authed) {
    return DEFAULT_PRIVATE_ROUTE
  }
  return true
})

router.afterEach((to) => {
  document.title = to.meta?.title ? `${to.meta.title} | GeoLog` : 'GeoLog'
})

export default router