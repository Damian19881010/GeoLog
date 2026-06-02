<template>
  <JourneySideCard>
    <p class="font-weight-bold text-body-1 mb-3 text-orange">行程總覽</p>
    <div class="d-flex justify-space-between">
      <div class="d-flex flex-column align-center ga-1">
        <v-icon color="orange-darken-1" size="small">mdi-checkbox-marked-outline</v-icon>
        <p class="text-caption text-blue-grey-lighten-4">全部行程</p>
        <p class="font-weight-bold text-white">{{ props.items.length }} <span class="text-caption">筆</span></p>
      </div>
      <div class="d-flex flex-column align-center ga-1">
        <v-icon color="orange-darken-1" size="small">mdi-clock-outline</v-icon>
        <p class="text-caption text-blue-grey-lighten-4">總時長</p>
        <p class="font-weight-bold text-white">{{ totalDuration }}</p>
      </div>
      <div class="d-flex flex-column align-center ga-1">
        <v-icon color="red" size="small">mdi-map-marker</v-icon>
        <p class="text-caption text-blue-grey-lighten-4">造訪地點</p>
        <p class="font-weight-bold text-white">{{ uniqueLocations }} <span class="text-caption">處</span></p>
      </div>
    </div>
  </JourneySideCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { JourneyItem } from '../../types'
import JourneySideCard from './JourneySideCard.vue'

const props = defineProps<{
  items: JourneyItem[]
}>()

const parseTimeRange = (time = ''): { startTime: string; endTime: string } => {
  const [startTime = '', endTime = ''] = String(time).split(' - ')

  return {
    startTime,
    endTime,
  }
}

const totalDuration = computed(() => {
  let totalMinutes = 0

  for (const item of props.items) {
    const { startTime, endTime } = parseTimeRange(item.time)
    if (startTime && endTime) {
      const [sh, sm] = startTime.split(':').map(Number)
      const [eh, em] = endTime.split(':').map(Number)
      totalMinutes += (eh * 60 + em) - (sh * 60 + sm)
    }
  }

  if (totalMinutes <= 0) return '0 分'

  const hours = Math.floor(totalMinutes / 60)
  const mins = totalMinutes % 60

  return hours > 0 ? `${hours} 小時 ${mins} 分` : `${mins} 分`
})

const uniqueLocations = computed(() => {
  const addresses = new Set(props.items.map(item => item.address).filter(Boolean))

  return addresses.size
})
</script>
