<template>
  <v-text-field
    :model-value="modelValue"
    type="date"
    variant="outlined"
    :density="density"
    color="orange"
    :max-width="maxWidth"
    base-color="orange"
    hide-details="auto"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #prepend-inner>
      <v-icon color="white2">mdi-calendar</v-icon>
    </template>
    <template #label>
      <span>{{ label }}</span>
    </template>
    <template #append-inner>
      <v-menu v-model="menu" :close-on-content-click="false" location="bottom end">
        <template #activator="{ props: menuProps }">
          <v-btn v-bind="menuProps" color="orange21" icon="mdi-plus" variant="text" density="compact" />
        </template>
        <v-card min-width="290">
          <v-date-picker
            v-model="tempDate"
            color="orange"
            show-adjacent-months
          />
          <v-card-actions class="justify-end">
            <v-btn variant="text" @click="menu = false">取消</v-btn>
            <v-btn variant="tonal" color="orange" @click="confirmPick">確認</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </template>
  </v-text-field>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string
  label?: string
  density?: 'default' | 'comfortable' | 'compact'
  maxWidth?: string | number
}>(), {
  modelValue: '',
  label: '日期',
  density: 'compact',
  maxWidth: undefined,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const menu = ref(false)
const tempDate = ref<Date | null>(null)

const toIsoString = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

watch(menu, (open) => {
  if (open && props.modelValue) {
    const parsed = new Date(props.modelValue)
    tempDate.value = Number.isNaN(parsed.getTime()) ? null : parsed
  }
})

const confirmPick = () => {
  if (tempDate.value) {
    emit('update:modelValue', toIsoString(tempDate.value))
  }
  menu.value = false
}
</script>