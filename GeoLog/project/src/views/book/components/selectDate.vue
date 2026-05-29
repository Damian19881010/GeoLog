<template>
      <v-tabs 
    v-model="currentTab" 
    class="text-white2 tab border-orange border-opacity-100 " 
    show-arrows
    hide-slider 
    density="compact">
      <v-tab
        v-for="(day, idx) in props.days"
        :key="day.id"
        class="rounded-lg tabs"
        color="orange"
        :value="idx + 1">
        <div class="d-flex align-end ga-1">
          <span class="font-weight-bold">{{ day.tabText }}</span>
          <p class="text-body-small text-grey-lighten-1">{{ day.date.slice(5).replace('-', '/') }}</p>
        </div>
      </v-tab>
      <!-- <v-btn v-if="editMode" class="tabs"  @click="emit('open-edit-tab')">
        <v-icon color="white" size="20">mdi-plus</v-icon>
      </v-btn> -->
  </v-tabs>
  <v-divider color="orange" opacity="1" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { JourneyDay } from '../types'

const props = defineProps<{
  tab: number
  isEditMode: boolean
  days: JourneyDay[]
}>()

const emit = defineEmits<{
  (e: 'update:tab', value: number): void
  (e: 'open-edit-tab'): void
}>()

const currentTab = computed({
  get: () => props.tab,
  set: (value: number) => emit('update:tab', value),
})

const editMode = computed(() => props.isEditMode)
</script>

<style lang="scss" scoped>
.tabs {
  backdrop-filter: blur(10px);
  //border-right: 1px solid rgba(255, 255, 255, 0.226) !important;
  background-color: rgba(255, 255, 255, 0.082) !important;
  border-radius: 8px 24px 0px 0px !important;
  position: relative;
  &:deep(.v-tab__content) {
    transition: all 0.2s ease;
  }

  &.v-tab--selected {
    background: linear-gradient(135deg, rgba(255, 152, 0, 0.3), rgba(255, 87, 34, 0.15)) !important;
    border: 1px solid rgba(255, 152, 0, 0.6) !important;
    border-radius: 8px 24px 0px 0px !important;
  }

}
</style>