<template>
  <JourneySideCard class="overflow-hidden">
    <div class="d-flex align-center ga-2 mb-2">
      <v-icon color="orange-darken-1">mdi-map</v-icon>
      <p class="font-weight-bold text-body-1 text-orange">地圖總覽</p>
    </div>
    <div class="map-container rounded-lg overflow-hidden">
      <LeafletMap :items="props.items" :active-item-id="activeMapItem" />
    </div>
    <div class="d-flex flex-wrap ga-1 mt-2">
      <v-chip
        v-for="item in locatedItems"
        :key="item.id"
        size="x-small"
        variant="tonal"
        color="orange-darken-1"
        class="cursor-pointer"
        @click="activeMapItem = item.id"
      >
        {{ item.title }}
      </v-chip>
    </div>
  </JourneySideCard>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { JourneyItem } from '../../types'
import LeafletMap from '../LeafletMap.vue'
import JourneySideCard from './JourneySideCard.vue'

const props = defineProps<{
  items: JourneyItem[]
}>()

const activeMapItem = ref<string | null>(null)
const locatedItems = computed(() => props.items.filter(item => item.lat != null && item.lng != null))
</script>

<style lang="scss" scoped>
.map-container {
  height: 200px;
  width: 100%;
}
</style>
