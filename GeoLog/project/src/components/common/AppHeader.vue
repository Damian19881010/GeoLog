<template>
  <v-container class="header pa-0 d-flex align-center" fluid>
    <v-toolbar class="px-8 centerpart" density="compact" height="90" rounded="pill">
      <template #prepend>
        <v-btn class="menu-toggle-btn" icon="mdi-menu" color="orange21" variant="text" @click="emit('toggle-menu')" />
        <v-img class="logo" :src="geminiLogo" width="60" height="60"/>
        <v-toolbar-title class="title text-orange21 font-weight-bold">
          <span >GeoLog</span>
          <span class="text-blue-grey-lighten-3 ms-2 text-h6">日誌系統</span>
        </v-toolbar-title>
      </template>


      <template #append>
        <div class="d-flex ga-3">
          <!-- <v-btn class="border border-opacity-100 border-orange21" size="small" variant="text" color="orange21" icon="mdi-magnify"  @click="emit('toggle-search')" /> -->
          <v-btn class="border border-opacity-100 border-orange21" size="small" variant="tonal" color="white" icon="mdi-cog-outline"></v-btn>
          <v-btn class="border border-opacity-100 border-orange21" size="small" variant="tonal" color="yellow" icon="mdi-bell"></v-btn>
          <v-btn class="border border-opacity-100 border-orange21" size="small" variant="tonal" color="orange21" icon="mdi-account"></v-btn>
        </div>
      </template>
    </v-toolbar>
  </v-container>
</template>

<script setup lang="ts">
import geminiLogo from '@/assets/images/gemini.svg'

const emit = defineEmits<{
  (e: 'toggle-search'): void
  (e: 'toggle-menu'): void
}>()
</script>

<style scoped>
.menu-toggle-btn {
  display: none;
}

@media (max-width: 768px) {
  .menu-toggle-btn {
    display: inline-grid;
  }
}
</style>
