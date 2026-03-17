<template>
  <div class="option-card pa-4 d-flex align-center ga-5">
    <div>
      <v-img :src="flightImage" :width="150"  class="border" ></v-img>
    </div>
    <!-- 去程 -->
    <div v-if="!go">
      <div class="d-flex ga-2 mb-3 flex-wrap">
        <v-chip color="white2">Peach樂桃</v-chip>
        <v-chip color="white2">報到碼：5BPCRV</v-chip>
        <v-chip color="white2">班機MM922</v-chip>
        <v-chip color="orange" prepend-icon="mdi-clock-outline">2026/03/19 09:45</v-chip>
      </div>
      <p class="text-white2">如搭乘日本國內線航班，請於出發時間前120分鐘~50分鐘內完成手續</p>
    </div>
    <!-- 回程 -->
    <div v-else >
      <div class="d-flex ga-2 mb-3">
        <v-chip color="white2">Peach樂桃</v-chip>
        <v-chip color="white2">報到碼：5BPCRV</v-chip>
        <v-chip color="white2">班機MM929</v-chip>
        <v-chip color="orange" prepend-icon="mdi-clock-outline">2026/03/23 16:50</v-chip>
      </div>
      <p class="text-white2">如搭乘日本國內線航班，請於出發時間前120分鐘~50分鐘內完成手續</p>
    </div>
  </div>
</template>

<script setup>
import flightImage from '@/assets/images/flight.png'
</script>