<template>
  <v-card class="book-toolbar d-flex align-center ga-3 " color="transparent" elevation="0">
    <v-switch
      v-model="isEditMode"
      label="Edit Mode / 編輯模式"
      color="orange-darken-3"
      class="text-orange font-weight-bold"
      hide-details="auto"
      prepend-icon="mdi-pencil"
    />
    <v-spacer></v-spacer>
    <v-btn
      v-if="isEditMode"
      :disabled="!length"
      size="small"
      color="orange"
      prepend-icon="mdi-cog-outline"
      text="編輯頁籤"
      variant="tonal"
      @click="emit('open-edit-tab')"
    />
    <v-btn v-if="isEditMode" size="small" color="orange21" prepend-icon="mdi-plus" text="新增行程" />
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: boolean
  length?: number
}>(), {
  modelValue: false,
  length: 0,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'open-edit-tab'): void
}>()

const isEditMode = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})
</script>

