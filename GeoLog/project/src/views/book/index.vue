<template>
  <v-container fluid class="book-root">

    <section class="workspace">
      <WorkSpace v-model:tab="tab" v-model:is-edit-mode="isEditMode" :days="visibleJourneyTabs"
        @open-edit-tab="editTabDialog = true"
        @add-journey="requestAddJourney" />
    </section>

    <section class="page">
      <v-window v-model="tab" class="date">
        <v-window-item v-for="(day, idx) in visibleJourneyTabs" :key="day.id" :value="idx + 1">
          <Journey
            :day="day"
            :is-edit-mode="isEditMode"
            :add-request-key="tab === idx + 1 ? addJourneyRequestKey : 0"
          />
        </v-window-item>
      </v-window>
    </section>

    <!-- <FlightTicket /> -->
    <!-- <CarInfo /> -->

    <EditTab
      v-model="editTabDialog"
      :days="visibleJourneyTabs"
      :current-day="currentJourneyDay"
      :day-count="visibleJourneyTabs.length"
      @add-day="addJourneyDay"
      @update-day="updateJourneyDay"/>

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
import type { JourneyDay } from './types'

const cloneJourneyDays = (days: JourneyDay[]) => JSON.parse(JSON.stringify(days)) as JourneyDay[]

const journeyDays = ref<JourneyDay[]>(cloneJourneyDays(journeyTabs))
const visibleDayCount = ref(journeyDays.value.length)
const tab = ref(1)
const isEditMode = ref(false)
const editTabDialog = ref(false)
const addJourneyRequestKey = ref(0)

const visibleJourneyTabs = computed(() => journeyDays.value.slice(0, visibleDayCount.value))
const currentJourneyDay = computed(() => visibleJourneyTabs.value[tab.value - 1] ?? null)

const requestAddJourney = () => {
  if (!isEditMode.value || visibleJourneyTabs.value.length === 0) return

  addJourneyRequestKey.value += 1
}

const addJourneyDay = (day: JourneyDay) => {
  journeyDays.value.push(day)
  visibleDayCount.value = journeyDays.value.length
  tab.value = journeyDays.value.length
}

const updateJourneyDay = (day: JourneyDay) => {
  const index = journeyDays.value.findIndex((item) => item.id === day.id)
  if (index === -1) return

  journeyDays.value.splice(index, 1, day)
}

watch(visibleDayCount, count => {
  if (count < 1) {
    tab.value = 1
    return
  }

  if (tab.value > count) tab.value = count
})

watch(tab, () => {
  addJourneyRequestKey.value = 0
})
</script>

<style scoped lang="scss">
.book-root {
  overflow-x: hidden;
  height: 100vh;
}

.workspace {
  position: fixed;
  z-index: 900;
  width: 80%;
  top: 140px;
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
  max-height: calc(100% - 400px);
  overflow-x: hidden;
  overflow-y: auto;
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
