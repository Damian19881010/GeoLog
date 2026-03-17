import { isAuthenticated } from '@/utils/auth'

const DEFAULT_PRIVATE_ROUTE = { name: 'home' }
const DEFAULT_PUBLIC_ROUTE = { name: 'login' }

const updateDocumentTitle = (to) => {
  const pageTitle = to.meta?.title ? `${to.meta.title} | GeoLog` : 'GeoLog'
  document.title = pageTitle
}

export const registerAuthGuards = (router) => {
  router.beforeEach((to) => {
    const requiresAuth = to.matched.some((record) => record.meta?.requiresAuth)
    const guestOnly = to.matched.some((record) => record.meta?.guestOnly)
    const authed = isAuthenticated()

    if (requiresAuth && !authed) {
      return {
        ...DEFAULT_PUBLIC_ROUTE,
        query: { redirect: to.fullPath },
      }
    }

    if (guestOnly && authed) {
      return DEFAULT_PRIVATE_ROUTE
    }

    return true
  })

  router.afterEach((to) => {
    updateDocumentTitle(to)
  })
}
