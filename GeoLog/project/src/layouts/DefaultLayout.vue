<template>
  <v-layout class="default-layout">
    <AppHeader
      @toggle-search="searchOpen = !searchOpen"
      @toggle-menu="menuOpen = !menuOpen"
    />
    <Menu v-model="menuOpen" />

    <v-main class="layout-main">
      <v-container
        v-if="isContainerized"
        class="layout-container py-6"
      >
        <section class="page-content">
          <router-view />
        </section>
      </v-container>

      <section v-else class="page-content page-content--fluid">
        <router-view />
      </section>
    </v-main>
  </v-layout>
</template>

<script setup>
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
/* 【 設置RWD 】*/
@mixin breakpoint($point) {
  @media screen and (max-width: $point) {
    @content;
  }
}

.default-layout {
  min-height: 100vh;
}

.layout-main {
  padding: 0 0 48px;
}

.layout-container {
  max-width: 1200px;
  min-height: 100vh;

  @include breakpoint(1200px) {
    max-width: 80% !important;
  }
}

.page-content {
  padding-top: 120px;
}

.page-content--fluid {
  min-height: 100vh;
  padding-top: 0;
}
</style>