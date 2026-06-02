<template>
  <JourneySideCard>
    <div class="d-flex justify-space-between align-center mb-2">
      <p class="font-weight-bold text-body-1 text-orange">行程完成度</p>
      <p class="text-caption text-blue-grey-lighten-4">{{ visitedCount }}/{{ props.items.length }}</p>
    </div>
    <v-progress-linear
      :model-value="progressPercent"
      color="orange-darken-1"
      bg-color="rgba(255,140,0,0.15)"
      height="10"
      rounded
    />
    <p class="text-caption text-blue-grey-lighten-4 mt-1 text-right">{{ progressPercent }}%</p>
  </JourneySideCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { JourneyItem } from '../../types'
import JourneySideCard from './JourneySideCard.vue'

const props = defineProps<{
  items: JourneyItem[]
}>()

const visitedCount = computed(() => props.items.filter(item => item.visited).length)
const progressPercent = computed(() => {
  if (!props.items.length) return 0

  return Math.round((visitedCount.value / props.items.length) * 100)
})
</script>
