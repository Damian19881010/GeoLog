<template>
  <v-toolbar class="header px-2" density="compact" elevation="5" height="72" rounded="pill">
    <template #prepend>
      <v-btn
        icon="mdi-menu"
        color="orange21"
        variant="text"
        @click="emit('toggle-menu')"
      />
      <v-toolbar-title class="title text-orange21 font-weight-bold">
        GeoLog
      </v-toolbar-title>
    </template>


    <template #append>
      <v-btn icon="mdi-magnify" color="orange21" variant="text" @click="emit('toggle-search')" />
    </template>
  </v-toolbar>
</template>

<script setup lang="ts">
// import logoUrl from '@/assets/01.svg'

const emit = defineEmits<{
  (e: 'toggle-search'): void
  (e: 'toggle-menu'): void
}>()
</script>

