<template>
  <v-container fluid>

    <section class="workspace">
      <WorkSpace v-model:tab="tab" v-model:is-edit-mode="isEditMode" :days="visibleJourneyTabs"
        @open-edit-tab="editTabDialog = true" />
    </section>

    <section class="page">
      <v-window v-model="tab" class="date">
        <v-window-item v-for="(day, idx) in visibleJourneyTabs" :key="day.id" :value="idx + 1">
          <Journey :day="day" :is-edit-mode="isEditMode" />
        </v-window-item>
      </v-window>
    </section>




    <!-- <FlightTicket /> -->
    <!-- <CarInfo /> -->



    <EditTab v-model="editTabDialog" />
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import CarInfo from '@/components/carInfo/car.vue'
import FlightTicket from '@/components/flightInfo/flight.vue'
import EditTab from './components/editTab.vue'
import Journey from './components/journey.vue'
import WorkSpace from './components/workSpace.vue'
import { journeyTabs } from './mockJourneyData'

const visibleDayCount = ref(journeyTabs.length)
const tab = ref(1)
const isEditMode = ref(false)
const editTabDialog = ref(false)

const visibleJourneyTabs = computed(() => journeyTabs.slice(0, visibleDayCount.value))

watch(visibleDayCount, count => {
  if (count < 1) {
    tab.value = 1
    return
  }

  if (tab.value > count) tab.value = count
})
</script>

<style scoped lang="scss">
.workspace {
  position: fixed;
  z-index: 900;
  width: 80%;
  left: 0;
  right: 0;
  margin: 0 auto;
  padding-bottom: 12px;

}

.page {
  width: 80%;
  margin: 10px auto 0;
  position: fixed;
  padding: 0 15px;
  top: 380px;
  left: 0;
  right: 0;
  max-height: calc(100% - 250px);
  overflow: auto;
  &::-webkit-scrollbar {
    width: 5px !important;
  }
}

@media (max-width: 600px) {
  .workspace {
    top: calc(16px + 90px);
  }
}

</style>
