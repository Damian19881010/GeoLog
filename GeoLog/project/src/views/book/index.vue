<template>
  <v-container class="pa-0 container1" max-width="100%">

    <!-- 控制板塊 -->
    <div class="worktop" color="transparent" >
      <!-- 編輯控制區 -->
      <v-card class="d-flex align-center ga-3" color="transparent" elevation="0">
        <v-switch v-model="isEditMode" label="Edit Mode" color="orange-darken-3" class=" text-orange font-weight-bold"
          hide-details="auto" prepend-icon="mdi-pencil"></v-switch>
        <v-spacer></v-spacer>
        <v-btn v-if="isEditMode" :disabled="!length" size="small" color="orange" prepend-icon="mdi-cog-outline" text="編輯頁籤"
          variant="tonal" @click="editTabDialog = true"></v-btn>
        <v-btn v-if="isEditMode" size="small" color="orange21" prepend-icon="mdi-plus" text="新增行程"></v-btn>
      </v-card>


      <!-- top -->
      <v-card class="top pa-5 border" color="transparent" elevation="5">
        <!-- 預覽 -->
        <div v-if="!Edit">
          <div class="d-flex justify-space-between align-center ga-2">
            <p class="text-h3 font-weight-bold text-white2">Okinawa</p>
            <v-spacer></v-spacer>
            <v-btn v-if="isEditMode" size="x-small" icon="mdi-cog-outline" @click="Edit = !Edit"></v-btn>
          </div>


          <!-- 副標 -->
          <p class="text-white2 ma-0">ver 3.0</p>
        </div>
        <!-- 編輯時顯示 -->
        <div v-else>
          <div class="mb-2 d-flex justify-space-between align-center ga-2">
            <v-spacer></v-spacer>
            <v-btn size="x-small" class="text-white" color="orange" icon="mdi-content-save"
              @click="Edit = !Edit"></v-btn>
          </div>
          <v-text-field label="標題" class="text-orange" variant="outlined" color="orange" hide-details="auto"
            density="compact" base-color="orange"></v-text-field>
          <v-text-field class="mt-2 text-orange" label="內容" aria-placeholder="請填寫內容" variant="outlined" color="orange"
            hide-details="auto" density="compact" base-color="orange"></v-text-field>
        </div>
      </v-card>

      <!-- tab控制 -->
      <v-card class="mt-5" elevation="5" color="transparent">
        <div class="d-flex justify-space-between align-center ga-2 px-3">
          <!-- <v-btn class="text-white" size="x-small" icon="mdi-plus"  variant="tonal" @click="length++"></v-btn> -->
          <!-- <v-btn :disabled="!length" size="x-small" class="text-white" icon="mdi-minus" variant="tonal" @click="length--"></v-btn> -->
          <v-spacer></v-spacer>


        </div>

        <v-tabs v-model="tab" class="text-white2 tab">
          <v-tab class="rounded-lg tabs" color="orange" v-for="(day, idx) in visibleJourneyTabs" :key="day.id"
            :text="day.tabText" :value="idx + 1">
          </v-tab>
        </v-tabs>
        <v-divider color="orange-darken-4" opacity="1"></v-divider>
      </v-card>

      <div class="w-100 d-flex justify-end align-center ">
        <v-spacer></v-spacer>

      </div>
    </div>

  </v-container>
  
  <FlightTicket></FlightTicket>
  <carInfo></carInfo>

  <v-container class="pa-0 container  " max-width="925">

    <!-- 行程排成 -->
    <v-window class="date " v-model="tab">

      <v-window-item v-for="(day, idx) in visibleJourneyTabs" :key="day.id" :value="idx + 1">
        <Journey :day="day" :is-edit-mode="isEditMode" />
      </v-window-item>
    </v-window>

    <!-- 編輯分頁內容 -->
    <EditTab v-model="editTabDialog" />
  </v-container>


</template>

<script setup>
import { computed, ref, watch } from 'vue'
import EditTab from './components/editTab.vue'
import Journey from './components/journey.vue'
import carInfo from '@/components/carInfo/car.vue'
import FlightTicket from '@/components/flightInfo/flight.vue'
import { journeyTabs } from './mockJourneyData'



const length = ref(journeyTabs.length)
const tab = ref(1)
const Edit = ref(false)
const isEditMode = ref(false)
const editTabDialog = ref(false)

const visibleJourneyTabs = computed(() => journeyTabs.slice(0, length.value))



watch(length, val => {
  if (val < 1) {
    tab.value = 1
    return
  }
  if (tab.value > val) tab.value = val
})
</script>

<style scoped lang="scss">
.container1 {
  overflow: hidden !important;
  background: linear-gradient(180deg, #002261 0%, #0f0047 50%, #0f004770 75%, #00072c50 100%) !important;
  height: 334px !important;
  position: fixed !important;
  top: 0px;
  z-index: 100 !important;
  // border: 1px solid rgba(255, 255, 255, 0.774);
}

.top {
  background-color: rgba(240, 255, 255, 0.096);
  border-radius: 24px;
}

.container {
  // background-color: rgba(0, 255, 255, 0.171);
  padding: 10px 0 0;
}

.worktop {
  width: 925px;
  position: fixed !important;
  top: 100px;
  z-index: 10000;
  left: 50%;
  transform: translateX(-50%);
  backdrop-filter: blur(5px);

}

.date {
  margin-top: 342.5px !important;
}
</style>
