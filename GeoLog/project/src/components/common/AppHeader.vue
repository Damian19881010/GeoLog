<template>
  <v-container class="header pa-0 d-flex align-center" fluid>
    <v-toolbar class="px-8 centerpart" density="compact" height="80" rounded="pill">
      <template #prepend>
        <v-btn class="menu-toggle-btn" icon="mdi-menu" color="orange21" variant="text" @click="emit('toggle-menu')" />
        <router-link to="/" class="text-decoration-none">
          <v-img class="logo" :src="geminiLogo" width="60" height="60" />
        </router-link>
        <v-toolbar-title class="title text-orange21 font-weight-bold">
          <span>GeoLog</span>
          <span class="text-blue-grey-lighten-3 ms-2 text-h6">旅程紀錄</span>
        </v-toolbar-title>
      </template>

      <template #append>
        <div class="d-flex align-center ga-3">
          <!-- 子選單 -->
          <v-menu location="bottom end" offset="10" transition="scale-transition">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                class="border border-opacity-100 border-orange21 system"
                size="small"
                variant="tonal"
                color="white"
                icon="mdi-cog-outline"
                aria-label="開啟導覽選單"
              />
            </template>

            <v-list class="header-menu" density="compact" nav>
              <v-list-item
                v-for="item in navItems"
                :key="item.value"
                class="header-menu-item"
                :active="item.value === activeNav"
                active-class="header-menu-item--active"
                :prepend-icon="item.icon"
                :to="item.to"
              >
                <v-list-item-title >{{ item.label }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <!-- 系統通知 -->
          <v-menu location="bottom end" offset="10" transition="scale-transition" :close-on-content-click="false">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                class="border border-opacity-100 border-orange21 bell"
                size="small"
                variant="tonal"
                color="white"
                icon="mdi-bell"
                aria-label="開啟系統通知"
              />
            </template>

            <v-list class="header-menu notification-menu" density="compact">
              <div class="menu-panel-heading">
                <div>
                  <p>System</p>
                  <h3>系統通知</h3>
                </div>
                <v-chip class="notification-count" color="orange21" size="small" variant="tonal">
                  {{ unreadNotificationCount }}
                </v-chip>
              </div>

              <v-divider class="my-2" opacity="0.18" />

              <v-list-item
                v-for="notification in notifications"
                :key="notification.id"
                class="notification-item"
                :prepend-icon="notification.icon">
                <v-list-item-title>{{ notification.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ notification.message }}</v-list-item-subtitle>
                <template #append>
                  <span class="notification-time">{{ notification.time }}</span>
                </template>
              </v-list-item>
            </v-list>
          </v-menu>
          <!-- 使用者選單 -->
          <v-menu location="bottom end" offset="10" transition="scale-transition" :close-on-content-click="false">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                class="border border-opacity-100 border-orange21 account"
                size="small"
                variant="tonal"
                color="orange21"
                icon="mdi-account"
                aria-label="開啟使用者選單"
              />
            </template>

            <div class="header-menu user-menu">
              <div class="user-summary">
                <v-avatar class="user-avatar" size="44">
                  <v-icon icon="mdi-account" size="28" />
                </v-avatar>
                <div class="user-summary__text">
                  <h3>{{ currentUser.name }}</h3>
                  <p>{{ currentUser.email }}</p>
                </div>
              </div>

              <div class="user-meta">
                <div>
                  <span>角色</span>
                  <strong>{{ currentUser.role }}</strong>
                </div>
                <div>
                  <span>狀態</span>
                  <strong>{{ currentUser.status }}</strong>
                </div>
              </div>

              <v-divider class="my-3" opacity="0.18" />

              <v-btn
                block
                class="logout-btn"
                color="orange21"
                prepend-icon="mdi-logout"
                variant="tonal"
                @click="handleLogout"
              >
                登出
              </v-btn>
            </div>
          </v-menu>
        </div>
      </template>
    </v-toolbar>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { clearAuthSession } from '@/utils/auth'
import geminiLogo from '@/assets/images/gemini.svg'

const emit = defineEmits<{
  (e: 'toggle-search'): void
  (e: 'toggle-menu'): void
}>()

const route = useRoute()
const router = useRouter()

const navItems = [
  {
    label: '首頁',
    icon: 'mdi-compass-outline',
    to: { name: 'home' },
    value: 'home',
  },
  {
    label: '旅程',
    icon: 'mdi-map-marker-path',
    to: { name: 'book' },
    value: 'book',
  },
  {
    label: '成就',
    icon: 'mdi-trophy-outline',
    to: { name: 'achievements' },
    value: 'achievements',
  },
] as const

const notifications = [
  {
    id: 'achievement-sync',
    title: '成就系統已同步',
    message: '已依照最新旅程資料重新計算解鎖進度。',
    time: '剛剛',
    icon: 'mdi-trophy-outline',
    unread: true,
  },
  {
    id: 'trip-reminder',
    title: '近期旅程提醒',
    message: '雪梨跨年之旅還有 12 天出發。',
    time: '10 分鐘前',
    icon: 'mdi-calendar-clock',
    unread: true,
  },
  {
    id: 'map-ready',
    title: '地圖資料載入完成',
    message: '台灣與日本城市資料已完成更新。',
    time: '今天',
    icon: 'mdi-map-check-outline',
    unread: false,
  },
] as const

const currentUser = {
  name: 'GeoLog Traveler',
  email: 'traveler@geolog.app',
  role: '一般會員',
  status: '已登入',
} as const

const activeNav = computed(() => {
  if (route.name === 'book-detail') {
    return 'book'
  }

  const routeName = typeof route.name === 'string' ? route.name : ''
  return navItems.some((item) => item.value === routeName) ? routeName : 'home'
})

const unreadNotificationCount = computed(() => notifications.filter((item) => item.unread).length)

const handleLogout = async () => {
  clearAuthSession()
  await router.push({ name: 'login' })
}
</script>
