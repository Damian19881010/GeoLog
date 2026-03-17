<template>
  <div class="option-card pa-4 d-flex align-center ga-5">
    <div>
      <v-img :src="flightImage" :width="150" class="border"></v-img>
    </div>

    <div>
      <div class="d-flex ga-2 mb-3 flex-wrap">
        <v-chip color="white2">{{ ticket.airline }}</v-chip>
        <v-chip color="white2">報到碼：{{ ticket.bookingCode }}</v-chip>
        <v-chip color="white2">班機{{ ticket.flightNo }}</v-chip>
        <v-chip color="orange" prepend-icon="mdi-clock-outline">{{ ticket.departureAt }}</v-chip>
      </div>
      <p class="text-white2">{{ ticket.notice }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  ticket: {
    type: Object,
    required: true,
  },
})

import flightImage from '@/assets/images/flight.png'
</script>