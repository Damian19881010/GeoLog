export const AUTH_TOKEN_KEY = 'geolog.auth.token'

export const getAuthToken = () => window.localStorage.getItem(AUTH_TOKEN_KEY)

export const isAuthenticated = () => Boolean(getAuthToken())

export const persistAuthSession = (token) => {
  window.localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export const clearAuthSession = () => {
  window.localStorage.removeItem(AUTH_TOKEN_KEY)
}
