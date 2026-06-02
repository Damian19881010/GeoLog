<template>
  <JourneySideCard>
    <div class="d-flex justify-space-between align-center mb-3">
      <p class="font-weight-bold text-body-1 text-orange">行前檢查清單</p>
      <p class="text-caption text-blue-grey-lighten-4">{{ checkedCount }}/{{ checklist.length }} 完成</p>
    </div>
    <div v-for="(item, i) in checklist" :key="i" class="d-flex align-center ga-2">
      <v-checkbox
        v-model="item.checked"
        density="compact"
        hide-details
        color="orange-darken-1"
        class="flex-grow-0 text-white"
        :label="item.label"
      />
      <v-spacer />
      <v-btn icon="mdi-close" size="x-small" variant="text" color="red-lighten-1" @click="removeChecklistItem(i)" />
    </div>

    <div class="d-flex align-center ga-2 mt-3">
      <v-text-field
        v-model="newChecklistItem"
        variant="outlined"
        density="compact"
        color="orange"
        base-color="orange"
        placeholder="新增項目..."
        hide-details
        class="flex-grow-1"
        @keyup.enter="addChecklistItem"
      />
      <v-btn
        icon="mdi-plus"
        size="small"
        variant="tonal"
        color="orange-darken-1"
        :disabled="!newChecklistItem.trim()"
        @click="addChecklistItem"
      />
    </div>
  </JourneySideCard>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import JourneySideCard from './JourneySideCard.vue'

interface ChecklistItem {
  label: string
  checked: boolean
}

const checklist = ref<ChecklistItem[]>([
  { label: '護照', checked: false },
  { label: '機票 / 電子機票', checked: false },
  { label: '藥品 / 常備藥', checked: false },
  { label: '護照 & 護照影本', checked: false },
  { label: '相機 / 充電器 / 電池', checked: false },
  { label: '旅遊保險 / 其他文件', checked: false },
])

const checkedCount = computed(() => checklist.value.filter(item => item.checked).length)
const newChecklistItem = ref('')

const addChecklistItem = () => {
  const label = newChecklistItem.value.trim()
  if (!label) return

  checklist.value.push({ label, checked: false })
  newChecklistItem.value = ''
}

const removeChecklistItem = (index: number) => {
  checklist.value.splice(index, 1)
}
</script>
