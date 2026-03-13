<template>
  <div class="default-layout">
    <AppHeader />

    <v-main>
      <v-container class="py-6">
        <router-view />
      </v-container>
    </v-main>
  </div>
</template>

<script setup>
import AppHeader from '@/components/common/AppHeader.vue'
</script>