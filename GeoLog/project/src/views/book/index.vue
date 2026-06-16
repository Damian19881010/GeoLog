<template>
  <v-container fluid class="book-root d-flex flex-wrap px-0">

    <div class="left">
      <section class="workspace">
      <WorkSpace v-model:tab="tab" v-model:is-edit-mode="isEditMode" :days="visibleJourneyTabs"
        @open-edit-tab="editTabDialog = true"
        @add-journey="requestAddJourney" />
      </section>

      <section class="page">
        <SelectDate
          v-model:tab="tab"
          :is-edit-mode="isEditMode"
          :days="visibleJourneyTabs"
          @open-edit-tab="editTabDialog = true" />

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
    </div>

    <section v-if="currentJourneyDay" class="side-panel w-30 d-flex flex-wrap px-5 ga-4">
      <JourneyCountdownCard class="w-100" :date="currentJourneyDay.date" />
      <JourneyChecklistCard class="w-100" />
      <JourneyProgressCard class="w-100" :items="sortedCurrentItems" />
      <JourneyOverviewCard class="w-100" :items="sortedCurrentItems" />
      <JourneyMapCard class="w-100" :items="sortedCurrentItems" />
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
import SelectDate from './components/selectDate.vue'
import WorkSpace from './components/workSpace.vue'
import type { JourneyDay } from './types'
import { useJourneyDays } from './useJourneyDays'

import JourneyChecklistCard from './components/sidebar/JourneyChecklistCard.vue'
import JourneyCountdownCard from './components/sidebar/JourneyCountdownCard.vue'
import JourneyMapCard from './components/sidebar/JourneyMapCard.vue'
import JourneyOverviewCard from './components/sidebar/JourneyOverviewCard.vue'
import JourneyProgressCard from './components/sidebar/JourneyProgressCard.vue'

const { journeyDays } = useJourneyDays()
const visibleDayCount = ref(journeyDays.value.length)
const tab = ref(1)
const isEditMode = ref(false)
const editTabDialog = ref(false)
const addJourneyRequestKey = ref(0)

const visibleJourneyTabs = computed(() => journeyDays.value.slice(0, visibleDayCount.value))
const currentJourneyDay = computed(() => visibleJourneyTabs.value[tab.value - 1] ?? null)
const sortedCurrentItems = computed(() =>
  [...(currentJourneyDay.value?.items ?? [])].sort((a, b) => a.time.localeCompare(b.time))
)

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
@mixin breakpoint($point) {
  @media screen and (max-width: $point) {
    @content;
  }
}

.book-root {
  // overflow: visible;
  overflow: auto;
  // height: 100% !important;
  // background: linear-gradient(180deg, #1e1e1e 0%, #121212 100%);
  .left {
  // border: 1px solid rgba(255, 102, 0, 0.5) !important;
    width: 70%;
    height: 100%;
    padding: 0 50px;
    @include breakpoint(960px) {
      width: 100%;
      padding: 0 0px;
      // background-color: rgba(0, 157, 230, 0.205) !important;
    }
  }
  .side-panel {
    // width: 400px;
    width: 30%; 
    @include breakpoint(960px) {
      width: 95%;
      padding: 0 0px;
      margin: 0px auto;
      // background-color: rgba(0, 157, 230, 0.205) !important;
    }
  }
}

.workspace {
  // position: fixed; 
  z-index: 900;
  width: 100%;
  // top: 10px;
  left: 0;
  right: 0;
  margin: 0 auto;
  padding-bottom: 12px;
  @include breakpoint(960px) {
    width: 90%;
  }
}



.page {
  width: 100%;
  min-width: 0;
  margin: 0;
  // background: rgba(255, 255, 255, 0.05);
  // position: fixed;
  // padding: 0 15px;
  top: 280px;
  left: 0;
  right: 0;
  // max-height: calc(100% - 400px);
  overflow-x: hidden;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 5px !important;
  }
  @include breakpoint(960px) {
    width: 95%;
    margin: 0 auto;
  }
  @include breakpoint(768px) {
    width: 95%;
  }
}


@media (max-width: 600px) {
  .workspace {
    top: calc(16px + 90px);
  }
}

</style>
