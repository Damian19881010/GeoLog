export const AUTH_TOKEN_KEY = 'geolog.auth.token'

export const getAuthToken = (): string | null => window.localStorage.getItem(AUTH_TOKEN_KEY)

export const isAuthenticated = (): boolean => Boolean(getAuthToken())

export const persistAuthSession = (token: string): void => {
  window.localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export const clearAuthSession = (): void => {
  window.localStorage.removeItem(AUTH_TOKEN_KEY)
}
