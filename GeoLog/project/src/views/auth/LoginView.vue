<template>
  <v-card class="login-card" rounded="xl" elevation="16">
    <p class="login-card__eyebrow mb-3">GeoLog Access</p>
    <h1 class="text-h4 font-weight-bold mb-2">登入系統</h1>
    <p class="text-medium-emphasis mb-6">
      目前先提供示範登入流程，後續可直接接上 API 與 Pinia session store。
    </p>

    <v-form @submit.prevent="handleLogin">
      <v-text-field
        v-model="form.account"
        class="mb-3"
        label="帳號"
        variant="outlined"
        autocomplete="username"
        prepend-inner-icon="mdi-account-outline"
        hide-details="auto"
      />

      <v-text-field
        v-model="form.password"
        class="mb-2"
        label="密碼"
        type="password"
        variant="outlined"
        autocomplete="current-password"
        prepend-inner-icon="mdi-lock-outline"
        hide-details="auto"
      />

      <div class="d-flex justify-space-between align-center mb-6 text-body-2">
        <span class="text-medium-emphasis">Demo 帳號可直接登入</span>
        <RouterLink class="login-card__link" to="/">回首頁</RouterLink>
      </div>

      <v-btn
        block
        color="deep-orange-darken-1"
        size="large"
        type="submit"
      >
        登入
      </v-btn>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { persistAuthSession } from '@/utils/auth'

const router = useRouter()
const route = useRoute()

const form = reactive({
  account: 'demo@geolog.app',
  password: 'password',
})

const handleLogin = async () => {
  persistAuthSession(`${form.account}-session`)

  const redirect = typeof route.query.redirect === 'string'
    ? route.query.redirect
    : '/'

  // 防止 Open Redirect：只允許相對路徑
  const safeRedirect = redirect.startsWith('/') && !redirect.startsWith('//')
    ? redirect
    : '/'

  await router.replace(safeRedirect)
}
</script>

<style lang="scss" scoped>
.login-card {
  padding: 32px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(7, 13, 28, 0.84);
  backdrop-filter: blur(14px);
  color: #f7f8fb;
}

.login-card__eyebrow {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(255, 111, 0, 0.14);
  color: #ffb26b;
  font-size: 0.875rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.login-card__link {
  color: #ffb26b;
  text-decoration: none;
}
</style>
