<template>
  <EditMode
    v-model="editMode"
    :length="props.days.length"
    @open-edit-tab="emit('open-edit-tab')"
    @add-journey="emit('add-journey')"/>

  <v-card class="top py-3 px-5 book-workspace" color="transparent"  elevation="0">
    <p class="font-weight-bold text-white2 ma-0 text-title-large">{{ tripTitle }}</p>
    <p class="text-white text-body-small opacity-80">2025/03/19(三) - 2025/03/23(日)</p>
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
  (e: 'add-journey'): void
}>()

const isTitleEditing = ref(false)
const tripTitle = ref('沖繩5天4夜自由行-範例')
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
  border: 1px solid rgba(255, 255, 255, 0.082);
  backdrop-filter: blur(10px);
}
</style>
