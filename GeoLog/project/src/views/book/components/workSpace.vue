<template>
  <v-card class="book-workspace" color="transparent"  elevation="0">
    <EditMode
      v-model="editMode"
      :length="props.days.length"
      @open-edit-tab="emit('open-edit-tab')"/>

    <v-card class="top pa-5 border mt-4 rounded-lg"  elevation="5">
      <div v-if="!isTitleEditing">
        <div class="d-flex justify-space-between align-center ga-2">
          <p class="text-h3 font-weight-bold text-white2 ma-0">{{ tripTitle }}</p>
          <v-spacer />
          <v-btn
            v-if="editMode"
            size="x-small"
            icon="mdi-cog-outline"
            aria-label="編輯旅程標題"
            @click="isTitleEditing = true"
          />
        </div>

        <p class="text-white2 ma-0">{{ tripVersion }}</p>
      </div>

      <div v-else>
        <div class="mb-2 d-flex justify-space-between align-center ga-2">
          <v-spacer />
          <v-btn
            size="x-small"
            class="text-white"
            color="orange"
            icon="mdi-content-save"
            aria-label="儲存旅程標題"
            @click="isTitleEditing = false"
          />
        </div>

        <v-text-field
          v-model="tripTitle"
          label="標題"
          class="text-orange"
          variant="outlined"
          color="orange"
          hide-details="auto"
          density="compact"
          base-color="orange"
        />
        <v-text-field
          v-model="tripVersion"
          class="mt-2 text-orange"
          label="版本"
          placeholder="請輸入版本"
          variant="outlined"
          color="orange"
          hide-details="auto"
          density="compact"
          base-color="orange"
        />
      </div>
    </v-card>

    <v-card class="book-tabs mt-5" elevation="0" color="transparent">
      <v-tabs v-model="currentTab" class="text-white2 tab" show-arrows>
        <v-tab
          v-for="(day, idx) in props.days"
          :key="day.id"
          class="rounded-lg tabs"
          color="orange"
          :text="day.tabText"
          :value="idx + 1"
        />
      </v-tabs>
      <v-divider color="orange-darken-4" opacity="1" />
    </v-card>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { JourneyDay } from '../types'
import EditMode from './editMode.vue'

const props = defineProps<{
  tab: number
  isEditMode: boolean
  days: JourneyDay[]
}>()

const emit = defineEmits<{
  (e: 'update:tab', value: number): void
  (e: 'update:isEditMode', value: boolean): void
  (e: 'open-edit-tab'): void
}>()

const isTitleEditing = ref(false)
const tripTitle = ref('Okinawa')
const tripVersion = ref('ver 3.0')

const currentTab = computed({
  get: () => props.tab,
  set: (value: number) => emit('update:tab', value),
})

const editMode = computed({
  get: () => props.isEditMode,
  set: (value: boolean) => emit('update:isEditMode', value),
})

watch(() => props.days.length, count => {
  if (count < 1) {
    emit('update:tab', 1)
    return
  }

  if (props.tab > count) emit('update:tab', count)
})

watch(editMode, value => {
  if (!value) isTitleEditing.value = false
})
</script>


<style scoped lang="scss">
.top {
    background-color: rgba(0, 157, 230, 0.205) !important;
    border-radius: 16px;
}
</style>

