<template>
  <v-text-field
    :model-value="modelValue"
    type="time"
    variant="outlined"
    :density="density"
    color="orange"
    base-color="orange"
    hide-details="auto"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #prepend-inner>
      <v-icon color="orange">{{ icon }}</v-icon>
    </template>
    <template #label>
      <span>{{ label }}</span>
    </template>
    <template #append-inner>
      <v-menu v-model="menu" :close-on-content-click="false" location="bottom end">
        <template #activator="{ props: menuProps }">
          <v-btn v-bind="menuProps" color="orange" icon="mdi-plus" variant="tonal" density="compact" class="rounded-lg" />
        </template>
        <v-card min-width="290">
          <v-time-picker
            v-model="tempTime"
            bg-color="black2"
            color="orange"
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
  icon?: string
  density?: 'default' | 'comfortable' | 'compact'
}>(), {
  modelValue: '',
  label: '時間',
  icon: 'mdi-clock-outline',
  density: 'comfortable',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const menu = ref(false)
const tempTime = ref('')

watch(menu, (open) => {
  if (open) tempTime.value = props.modelValue
})

const confirmPick = () => {
  if (tempTime.value) {
    emit('update:modelValue', tempTime.value)
  }
  menu.value = false
}
</script>