import { createRouter, createWebHistory } from 'vue-router'
import { publicRoutes } from './routes/publicRoutes'
import { privateRoutes } from './routes/privateRoutes'
import { registerAuthGuards } from './guards'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    ...publicRoutes,
    ...privateRoutes,
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      meta: {
        allowAnonymous: true,
        title: 'Page Not Found',
      },
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

registerAuthGuards(router)

export default router