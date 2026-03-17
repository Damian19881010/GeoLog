<template>
  <v-container class="header pa-0 d-flex align-center" fluid>
    <v-toolbar class="px-2 centerpart" density="compact" elevation="5" height="72" rounded="pill">
      <template #prepend>
        <v-btn icon="mdi-menu" color="orange21" variant="text" @click="emit('toggle-menu')" />
        <v-toolbar-title class="title text-orange21 font-weight-bold">
          GeoLog
        </v-toolbar-title>
      </template>


      <template #append>
        <v-btn icon="mdi-magnify" color="orange21" variant="text" @click="emit('toggle-search')" />
      </template>
    </v-toolbar>

    <v-card class="d-flex align-center ga-3 bottompart px-5" elevation="0" rounded="pill">
      <v-btn class="border border-opacity-100 border-orange21" variant="tonal" color="orange21" icon="mdi-bell"></v-btn>
      <v-btn class="border border-opacity-100 border-orange21" variant="tonal" color="orange21" icon="mdi-account"></v-btn>
    </v-card>
  </v-container>


</template>

<script setup lang="ts">
// import logoUrl from '@/assets/01.svg'

const emit = defineEmits<{
  (e: 'toggle-search'): void
  (e: 'toggle-menu'): void
}>()
</script>
