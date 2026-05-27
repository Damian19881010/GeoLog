<template>
  <div class="auth-card-wrapper">
    <!-- Logo / Brand -->
    <div class="auth-brand">
      <!-- <span class="auth-brand__icon">🌍</span> -->
      <v-img :src="geminiLogo" width="92" height="92" class="auth-brand__icon"/>
      <span class="auth-brand__name">GeoLog</span>
    </div>

    <v-card class="auth-card" rounded="xl" elevation="16">
      <!-- ── Tab Switcher ── -->
      <div class="auth-tabs" v-if="panel !== 'forgot'">
        <button
          class="auth-tab"
          :class="{ 'auth-tab--active': panel === 'login' }"
          @click="switchPanel('login')">
          登入
        </button>
        <button
          class="auth-tab"
          :class="{ 'auth-tab--active': panel === 'register' }"
          @click="switchPanel('register')"
        >
          註冊會員
        </button>
        <div class="auth-tab-indicator" :class="`auth-tab-indicator--${panel}`"></div>
      </div>

      <!-- ── Panels ── -->
      <transition :name="transitionName" mode="out-in">

        <!-- ════════ LOGIN ════════ -->
        <div v-if="panel === 'login'" key="login" class="auth-panel">
          <p class="auth-eyebrow">GeoLog Access</p>
          <h1 class="auth-title">歡迎回來</h1>
          <p class="auth-subtitle">登入後繼續探索您的旅途記錄</p>

          <v-form @submit.prevent="handleLogin" class="auth-form">
            <div class="auth-field-group">
              <label class="auth-label">電子信箱</label>
              <v-text-field
                v-model="loginForm.account"
                variant="outlined"
                placeholder="name@example.com"
                autocomplete="username"
                prepend-inner-icon="mdi-email-outline"
                hide-details="auto"
                :error-messages="loginErrors.account"
                density="comfortable"
                bg-color="rgba(255,255,255,0.04)"
                class="auth-input"
              />
            </div>

            <div class="auth-field-group">
              <div class="auth-label-row">
                <label class="auth-label">密碼</label>
                <button type="button" class="auth-link-btn" @click="switchPanel('forgot')">
                  忘記密碼？
                </button>
              </div>
              <v-text-field
                v-model="loginForm.password"
                variant="outlined"
                placeholder="••••••••"
                :type="showLoginPwd ? 'text' : 'password'"
                autocomplete="current-password"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="showLoginPwd ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                @click:append-inner="showLoginPwd = !showLoginPwd"
                hide-details="auto"
                :error-messages="loginErrors.password"
                density="comfortable"
                bg-color="rgba(255,255,255,0.04)"
                class="auth-input"
              />
            </div>

            <v-alert
              v-if="loginErrors.general"
              type="error"
              variant="tonal"
              density="compact"
              class="mb-4"
              rounded="lg"
            >
              {{ loginErrors.general }}
            </v-alert>

            <div class="auth-login-actions">
              <v-btn
                block
                type="submit"
                :loading="isLoading && loginAction === 'standard'"
                :disabled="isLoading"
                class="auth-submit-btn"
                size="large"
              >
                <v-icon left class="mr-2">mdi-login</v-icon>
                登入
              </v-btn>

              <div class="auth-direct-login">
                <div class="auth-direct-login__divider">
                  <span>或使用管理身分</span>
                </div>

                <v-btn
                  block
                  type="button"
                  variant="outlined"
                  :loading="isLoading && loginAction === 'admin'"
                  :disabled="isLoading"
                  class="auth-admin-btn"
                  size="large"
                  @click="handleAdminLogin"
                >
                  <v-icon left class="mr-2">mdi-shield-crown-outline</v-icon>
                  總管理直接登入
                </v-btn>

                <p class="auth-direct-login__hint">免輸入帳號密碼，直接進入管理主頁。</p>
              </div>
            </div>
          </v-form>

          <p class="auth-footer-text">
            還沒有帳號？
            <button type="button" class="auth-link-btn" @click="switchPanel('register')">立即註冊</button>
          </p>
        </div>

        <!-- ════════ FORGOT PASSWORD ════════ -->
        <div v-else-if="panel === 'forgot'" key="forgot" class="auth-panel">
          <button type="button" class="auth-back-btn" @click="switchPanel('login')">
            <v-icon size="18">mdi-arrow-left</v-icon>
            返回登入
          </button>

          <div class="auth-icon-hero">
            <v-icon size="40" color="#ffb26b">mdi-lock-reset</v-icon>
          </div>

          <h1 class="auth-title">忘記密碼</h1>
          <p class="auth-subtitle">
            輸入您的電子信箱，我們將傳送重設密碼連結給您。
          </p>

          <v-form @submit.prevent="handleForgot" class="auth-form">
            <div class="auth-field-group">
              <label class="auth-label">電子信箱</label>
              <v-text-field
                v-model="forgotEmail"
                variant="outlined"
                placeholder="name@example.com"
                autocomplete="email"
                prepend-inner-icon="mdi-email-outline"
                hide-details="auto"
                :error-messages="forgotError"
                density="comfortable"
                bg-color="rgba(255,255,255,0.04)"
                class="auth-input"
              />
            </div>

            <transition name="fade">
              <v-alert
                v-if="forgotSuccess"
                type="success"
                variant="tonal"
                density="compact"
                class="mb-4"
                rounded="lg"
              >
                重設連結已發送！請查看您的信箱。
              </v-alert>
            </transition>

            <v-btn
              block
              type="submit"
              :loading="isLoading"
              :disabled="forgotSuccess"
              class="auth-submit-btn"
              size="large"
            >
              <v-icon left class="mr-2">mdi-send-outline</v-icon>
              發送重設連結
            </v-btn>
          </v-form>
        </div>

        <!-- ════════ REGISTER ════════ -->
        <div v-else-if="panel === 'register'" key="register" class="auth-panel">
          <p class="auth-eyebrow">加入 GeoLog</p>
          <h1 class="auth-title">建立帳號</h1>
          <p class="auth-subtitle">開始記錄您的每一段旅途故事</p>

          <v-form @submit.prevent="handleRegister" class="auth-form">
            <div class="auth-field-row">
              <div class="auth-field-group">
                <label class="auth-label">姓名 <span class="auth-required">*</span></label>
                <v-text-field
                  v-model="registerForm.name"
                  variant="outlined"
                  placeholder="王小明"
                  prepend-inner-icon="mdi-account-outline"
                  hide-details="auto"
                  :error-messages="registerErrors.name"
                  density="comfortable"
                  bg-color="rgba(255,255,255,0.04)"
                  class="auth-input"
                />
              </div>
              <div class="auth-field-group">
                <label class="auth-label">暱稱 <span class="auth-required">*</span></label>
                <v-text-field
                  v-model="registerForm.nickname"
                  variant="outlined"
                  placeholder="旅行者"
                  prepend-inner-icon="mdi-badge-account-outline"
                  hide-details="auto"
                  :error-messages="registerErrors.nickname"
                  density="comfortable"
                  bg-color="rgba(255,255,255,0.04)"
                  class="auth-input"
                />
              </div>
            </div>

            <div class="auth-field-group">
              <label class="auth-label">電子信箱 <span class="auth-required">*</span></label>
              <v-text-field
                v-model="registerForm.email"
                variant="outlined"
                placeholder="name@example.com"
                autocomplete="email"
                prepend-inner-icon="mdi-email-outline"
                hide-details="auto"
                :error-messages="registerErrors.email"
                density="comfortable"
                bg-color="rgba(255,255,255,0.04)"
                class="auth-input"
              />
            </div>

            <div class="auth-field-group">
              <label class="auth-label">密碼 <span class="auth-required">*</span></label>
              <v-text-field
                v-model="registerForm.password"
                variant="outlined"
                placeholder="至少 8 個字元"
                :type="showRegPwd ? 'text' : 'password'"
                autocomplete="new-password"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="showRegPwd ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                @click:append-inner="showRegPwd = !showRegPwd"
                hide-details="auto"
                :error-messages="registerErrors.password"
                density="comfortable"
                bg-color="rgba(255,255,255,0.04)"
                class="auth-input"
              />
              <!-- Password strength -->
              <div class="pwd-strength-bar mt-2" v-if="registerForm.password">
                <div
                  v-for="i in 4"
                  :key="i"
                  class="pwd-strength-bar__segment"
                  :class="getPwdStrengthClass(i)"
                ></div>
                <span class="pwd-strength-bar__label">{{ pwdStrengthLabel }}</span>
              </div>
            </div>

            <div class="auth-field-group">
              <label class="auth-label">再次確認密碼 <span class="auth-required">*</span></label>
              <v-text-field
                v-model="registerForm.confirmPassword"
                variant="outlined"
                placeholder="••••••••"
                :type="showRegConfirmPwd ? 'text' : 'password'"
                autocomplete="new-password"
                prepend-inner-icon="mdi-lock-check-outline"
                :append-inner-icon="showRegConfirmPwd ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                @click:append-inner="showRegConfirmPwd = !showRegConfirmPwd"
                hide-details="auto"
                :error-messages="registerErrors.confirmPassword"
                density="comfortable"
                bg-color="rgba(255,255,255,0.04)"
                class="auth-input"
              />
            </div>

            <v-alert
              v-if="registerErrors.general"
              type="error"
              variant="tonal"
              density="compact"
              class="mb-4"
              rounded="lg"
            >
              {{ registerErrors.general }}
            </v-alert>

            <v-btn
              block
              type="submit"
              :loading="isLoading"
              class="auth-submit-btn"
              size="large"
            >
              <v-icon left class="mr-2">mdi-account-plus-outline</v-icon>
              建立帳號
            </v-btn>
          </v-form>

          <p class="auth-footer-text">
            已有帳號？
            <button type="button" class="auth-link-btn" @click="switchPanel('login')">立即登入</button>
          </p>
        </div>

      </transition>
    </v-card>

    <!-- Bottom decoration -->
    <p class="auth-bottom-note">© 2026 GeoLog · 探索每一段旅途的故事</p>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { persistAuthSession } from '@/utils/auth'
import geminiLogo from '@/assets/images/gemini.svg'

type Panel = 'login' | 'register' | 'forgot'
type LoginAction = 'standard' | 'admin'

const router = useRouter()
const route = useRoute()

// ── Panel state ──
const panel = ref<Panel>('login')
const transitionName = ref('slide-left')
const isLoading = ref(false)
const loginAction = ref<LoginAction | null>(null)

const panelOrder: Panel[] = ['login', 'register']
function switchPanel(target: Panel) {
  if (target === 'forgot') {
    transitionName.value = 'slide-up'
  } else {
    const from = panel.value === 'forgot' ? 'login' : panel.value
    const fromIdx = panelOrder.indexOf(from)
    const toIdx = panelOrder.indexOf(target)
    transitionName.value = toIdx >= fromIdx ? 'slide-left' : 'slide-right'
  }
  panel.value = target
  // reset success states
  forgotSuccess.value = false
  forgotError.value = ''
}

// ── LOGIN ──
const loginForm = reactive({ account: '', password: '' })
const showLoginPwd = ref(false)
const loginErrors = reactive({ account: '', password: '', general: '' })

function clearLoginErrors() {
  loginErrors.account = ''
  loginErrors.password = ''
  loginErrors.general = ''
}

function resolvePostLoginRedirect(fallback = '/') {
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : fallback
  return redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : fallback
}

async function finalizeLogin(sessionToken: string, fallbackRedirect = '/') {
  persistAuthSession(sessionToken)
  await router.replace(resolvePostLoginRedirect(fallbackRedirect))
}

function validateLogin(): boolean {
  clearLoginErrors()
  let ok = true
  if (!loginForm.account) { loginErrors.account = '請輸入電子信箱'; ok = false }
  if (!loginForm.password) { loginErrors.password = '請輸入密碼'; ok = false }
  return ok
}

const handleLogin = async () => {
  if (!validateLogin()) return
  loginAction.value = 'standard'
  isLoading.value = true
  try {
    await new Promise(r => setTimeout(r, 800)) // simulate API
    await finalizeLogin(`${loginForm.account}-session`)
  } finally {
    isLoading.value = false
    loginAction.value = null
  }
}

const handleAdminLogin = async () => {
  clearLoginErrors()
  loginAction.value = 'admin'
  isLoading.value = true
  try {
    await new Promise(r => setTimeout(r, 350))
    await finalizeLogin('super-admin-session', '/dashboard')
  } finally {
    isLoading.value = false
    loginAction.value = null
  }
}

// ── FORGOT PASSWORD ──
const forgotEmail = ref('')
const forgotError = ref('')
const forgotSuccess = ref(false)

const handleForgot = async () => {
  forgotError.value = ''
  if (!forgotEmail.value) { forgotError.value = '請輸入電子信箱'; return }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail.value)) {
    forgotError.value = '請輸入有效的電子信箱格式'
    return
  }
  isLoading.value = true
  await new Promise(r => setTimeout(r, 1000))
  isLoading.value = false
  forgotSuccess.value = true
}

// ── REGISTER ──
const registerForm = reactive({
  name: '',
  nickname: '',
  email: '',
  password: '',
  confirmPassword: '',
})
const showRegPwd = ref(false)
const showRegConfirmPwd = ref(false)
const registerErrors = reactive({
  name: '',
  nickname: '',
  email: '',
  password: '',
  confirmPassword: '',
  general: '',
})

// Password strength
const pwdStrength = computed(() => {
  const p = registerForm.password
  if (!p) return 0
  let score = 0
  if (p.length >= 8) score++
  if (p.length >= 12) score++
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++
  if (/[0-9]/.test(p) && /[^A-Za-z0-9]/.test(p)) score++
  return score
})

const pwdStrengthLabel = computed(() => {
  const labels = ['太弱', '一般', '良好', '強', '非常強']
  return labels[pwdStrength.value] ?? ''
})

function getPwdStrengthClass(segment: number) {
  const s = pwdStrength.value
  const colorMap = ['', 'weak', 'fair', 'good', 'strong']
  return segment <= s ? `pwd-strength-bar__segment--${colorMap[s]}` : ''
}

function validateRegister(): boolean {
  Object.assign(registerErrors, { name: '', nickname: '', email: '', password: '', confirmPassword: '', general: '' })
  let ok = true
  if (!registerForm.name.trim()) { registerErrors.name = '請輸入姓名'; ok = false }
  if (!registerForm.nickname.trim()) { registerErrors.nickname = '請輸入暱稱'; ok = false }
  if (!registerForm.email) { registerErrors.email = '請輸入電子信箱'; ok = false }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email)) { registerErrors.email = '請輸入有效的信箱格式'; ok = false }
  if (!registerForm.password) { registerErrors.password = '請輸入密碼'; ok = false }
  else if (registerForm.password.length < 8) { registerErrors.password = '密碼至少需要 8 個字元'; ok = false }
  if (!registerForm.confirmPassword) { registerErrors.confirmPassword = '請再次輸入密碼'; ok = false }
  else if (registerForm.password !== registerForm.confirmPassword) { registerErrors.confirmPassword = '兩次密碼輸入不一致'; ok = false }
  return ok
}

const handleRegister = async () => {
  if (!validateRegister()) return
  isLoading.value = true
  await new Promise(r => setTimeout(r, 1000))
  // Demo: auto-login after register
  persistAuthSession(`${registerForm.email}-session`)
  await router.replace('/')
  isLoading.value = false
}
</script>

<style lang="scss" scoped>
// ── Wrapper ──
.auth-card-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
}

// ── Brand ──
.auth-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #f7f8fb;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}
.auth-brand__icon {
  font-size: 1.6rem;
  line-height: 1;
}
.auth-brand__name {
  background: linear-gradient(90deg, #ffb26b, #ff6e00);
  font-size: 2rem;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

// ── Card ──
.auth-card {
  width: 100%;
  padding: 32px 36px;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  background: rgba(7, 13, 28, 0.88) !important;
  backdrop-filter: blur(20px);
  color: #f7f8fb;
  overflow: hidden;
}

// ── Tab switcher ──
.auth-tabs {
  position: relative;
  display: flex;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  padding: 4px;
  margin-bottom: 28px;
  overflow: hidden;
}
.auth-tab {
  flex: 1;
  position: relative;
  z-index: 1;
  padding: 8px 0;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.45);
  border-radius: 8px;
  transition: color 0.3s ease;
  &--active {
    color: #fff;
  }
}
.auth-tab-indicator {
  position: absolute;
  top: 4px;
  bottom: 4px;
  width: calc(50% - 4px);
  border-radius: 7px;
  background: linear-gradient(135deg, rgba(255, 140, 0, 0.5), rgba(255, 100, 0, 0.3));
  border: 1px solid rgba(255, 140, 0, 0.3);
  transition: left 0.35s cubic-bezier(0.4, 0, 0.2, 1);

  &--login { left: 4px; }
  &--register { left: calc(50%); }
}

// ── Panels ──
.auth-panel {
  width: 100%;
}

// ── Eyebrow ──
.auth-eyebrow {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 999px;
  background: rgba(255, 111, 0, 0.14);
  color: #ffb26b;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 12px;
}

// ── Title / Subtitle ──
.auth-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #f7f8fb;
  margin-bottom: 6px;
  line-height: 1.2;
}
.auth-subtitle {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 24px;
  line-height: 1.5;
}

// ── Icon hero (forgot) ──
.auth-icon-hero {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background: rgba(255, 140, 0, 0.12);
  border: 1px solid rgba(255, 140, 0, 0.25);
  margin-bottom: 20px;
}

// ── Form ──
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.auth-field-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}
.auth-field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.auth-label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 6px;
}
.auth-required {
  color: #ff6b6b;
}
.auth-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.auth-input {
  :deep(.v-field) {
    border-radius: 10px !important;
    color: #f7f8fb !important;
  }
  :deep(.v-field__outline__start),
  :deep(.v-field__outline__notch),
  :deep(.v-field__outline__end) {
    border-color: rgba(255, 255, 255, 0.12) !important;
  }
  :deep(.v-field:hover .v-field__outline__start),
  :deep(.v-field:hover .v-field__outline__notch),
  :deep(.v-field:hover .v-field__outline__end) {
    border-color: rgba(255, 140, 0, 0.4) !important;
  }
  :deep(.v-field--focused .v-field__outline__start),
  :deep(.v-field--focused .v-field__outline__notch),
  :deep(.v-field--focused .v-field__outline__end) {
    border-color: #ff8c00 !important;
  }
  :deep(.v-field__prepend-inner .v-icon),
  :deep(.v-field__append-inner .v-icon) {
    color: rgba(255, 255, 255, 0.4) !important;
  }
  :deep(input::placeholder) {
    color: rgba(255, 255, 255, 0.25) !important;
  }
  :deep(input) {
    color: #f7f8fb !important;
  }
}

// ── Password Strength Bar ──
.pwd-strength-bar {
  display: flex;
  align-items: center;
  gap: 6px;

  &__segment {
    flex: 1;
    height: 4px;
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.1);
    transition: background 0.3s ease;

    &--weak { background: #ff4d4d; }
    &--fair { background: #ffa64d; }
    &--good { background: #a8d8a8; }
    &--strong { background: #4dff88; }
  }

  &__label {
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.45);
    white-space: nowrap;
    min-width: 40px;
    text-align: right;
  }
}

.auth-login-actions {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 20px;
}

// ── Submit Button ──
.auth-submit-btn {
  background: linear-gradient(135deg, #ff8c00, #ff5500) !important;
  color: #fff !important;
  font-weight: 600 !important;
  letter-spacing: 0.04em !important;
  border-radius: 12px !important;
  box-shadow: 0 4px 20px rgba(255, 100, 0, 0.35) !important;
  transition: transform 0.15s ease, box-shadow 0.15s ease !important;
  margin-bottom: 0;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 28px rgba(255, 100, 0, 0.5) !important;
  }
  &:active {
    transform: translateY(0);
  }
}

.auth-direct-login {
  display: flex;
  flex-direction: column;
  gap: 10px;

  &__divider {
    position: relative;
    text-align: center;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      height: 1px;
      background: rgba(255, 255, 255, 0.08);
    }

    span {
      position: relative;
      display: inline-block;
      padding: 0 12px;
      background: rgba(7, 13, 28, 0.88);
      color: rgba(255, 255, 255, 0.38);
      font-size: 0.75rem;
      letter-spacing: 0.08em;
    }
  }

  &__hint {
    margin: 0;
    text-align: center;
    font-size: 0.78rem;
    color: rgba(255, 255, 255, 0.42);
  }
}

.auth-admin-btn {
  border: 1px solid rgba(255, 178, 107, 0.35) !important;
  background: rgba(255, 178, 107, 0.08) !important;
  color: #ffd6ac !important;
  font-weight: 600 !important;
  letter-spacing: 0.03em !important;
  border-radius: 12px !important;
  transition: transform 0.15s ease, border-color 0.15s ease, background 0.15s ease !important;

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(255, 178, 107, 0.55) !important;
    background: rgba(255, 178, 107, 0.14) !important;
  }
}

// ── Link Button ──
.auth-link-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #ffb26b;
  font-size: inherit;
  padding: 0;
  text-decoration: none;
  transition: color 0.2s;
  &:hover {
    color: #ff8c00;
    text-decoration: underline;
  }
}

// ── Back Button ──
.auth-back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.8125rem;
  padding: 0;
  margin-bottom: 20px;
  transition: color 0.2s;
  &:hover {
    color: #ffb26b;
  }
}

// ── Footer ──
.auth-footer-text {
  text-align: center;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.4);
}
.auth-bottom-note {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.2);
  text-align: center;
}

// ── Transitions ──
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active,
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-left-enter-from { opacity: 0; transform: translateX(40px); }
.slide-left-leave-to   { opacity: 0; transform: translateX(-40px); }

.slide-right-enter-from { opacity: 0; transform: translateX(-40px); }
.slide-right-leave-to   { opacity: 0; transform: translateX(40px); }

.slide-up-enter-from { opacity: 0; transform: translateY(30px); }
.slide-up-leave-to   { opacity: 0; transform: translateY(-20px); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
