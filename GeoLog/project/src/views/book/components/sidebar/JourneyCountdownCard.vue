<template>
  <JourneySideCard>
    <div class="d-flex align-center ga-2 mb-2">
      <v-icon color="orange-darken-1">mdi-airplane-takeoff</v-icon>
      <p class="font-weight-bold text-body-1 text-orange">出發倒數</p>
    </div>
    <div class="d-flex justify-center align-center ga-3">
      <div v-if="countdown.days > 0" class="text-center">
        <p class="text-h4 font-weight-bold text-orange">{{ countdown.days }}</p>
        <p class="text-caption text-blue-grey-lighten-4">天</p>
      </div>
      <div v-if="countdown.days > 0" class="text-h5 text-blue-grey-lighten-3">:</div>
      <div class="text-center">
        <p class="text-h4 font-weight-bold text-orange">{{ countdown.hours }}</p>
        <p class="text-caption text-blue-grey-lighten-4">時</p>
      </div>
      <div class="text-h5 text-blue-grey-lighten-3">:</div>
      <div class="text-center">
        <p class="text-h4 font-weight-bold text-orange">{{ countdown.minutes }}</p>
        <p class="text-caption text-blue-grey-lighten-4">分</p>
      </div>
    </div>
    <p v-if="countdown.passed" class="text-center text-caption text-green mt-1">已出發！旅途愉快</p>
  </JourneySideCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import JourneySideCard from './JourneySideCard.vue'

const props = defineProps<{
  date: string
}>()

const countdown = computed(() => {
  const tripDate = new Date(props.date)
  const diff = tripDate.getTime() - Date.now()

  if (!Number.isFinite(diff) || diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, passed: true }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  return { days, hours, minutes, passed: false }
})
</script>
