<template>

  <AppHeader
    class="mt-10"
    @toggle-search="searchOpen = !searchOpen"
    @toggle-menu="menuOpen = !menuOpen"/>
  
  <v-layout class="default-layout ">

    <Menu v-model="menuOpen"/>

    <v-main class="layout-main">
      <router-view />
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/common/AppHeader.vue'
import Menu from '@/components/common/menu.vue'


const route = useRoute()
const searchOpen = ref(false)
const menuOpen = ref(false)

const isContainerized = computed(() => route.meta.containerized !== false)
</script>

<style lang="scss" scoped>
@use '../assets/styles/variables' as *;

.default-layout {
  min-height: 100vh;
  overflow: visible;
  // background: linear-gradient(180deg, #002261 0%, #0f0047 50%, #0f004770 75%, #00072c50 100%);
}





</style>