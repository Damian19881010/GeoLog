<template>
  <div class="option-card pa-4 d-flex flex-wrap align-center ga-5">
    <div>
      <v-img :src="flightImage" :width="100" class="border w-100"></v-img>

    </div>
  

    
      <div class="d-flex ga-2 mb-3 flex-wrap">
        <v-chip color="white2">{{ ticket.airline }}</v-chip>
        <v-chip color="white2">報到碼：{{ ticket.bookingCode }}</v-chip>
        <v-chip color="white2">班機{{ ticket.flightNo }}</v-chip>
        <v-chip color="orange" prepend-icon="mdi-clock-outline">{{ ticket.departureAt }}</v-chip>
      </div>
      <p class="text-white2">{{ ticket.notice }}</p>
    
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  ticket: {
    airline: string
    bookingCode: string
    flightNo: string
    departureAt: string
    notice: string
  }
}>()

import flightImage from '@/assets/images/flight.png'
</script>