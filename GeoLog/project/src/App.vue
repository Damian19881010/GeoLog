<template>
  <v-app class="app">
    <AppHeader
      @toggle-search="searchOpen = !searchOpen"
      @toggle-menu="menuOpen = !menuOpen"
    />
    <Menu v-model="menuOpen" />
    <router-view />
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from '@/components/common/AppHeader.vue'
import Menu from '@/components/common/menu.vue'

const searchOpen = ref(false)
const menuOpen = ref(false)
</script>