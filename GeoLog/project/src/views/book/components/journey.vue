<template>
  <!-- 標頭 前言-->
  <v-card v-if="showHeader" class="pa-5  info-bord1" color="transparent" elevation="5">
    <!-- 預覽模式 -->

    <template v-if="!isHeaderEditing">
      <div class="d-flex justify-space-between align-center">
        <v-chip class="mb-2" color="amber-lighten-5" label prepend-icon="mdi-calendar-today">{{ day.date }}</v-chip>
        <v-btn
          v-if="props.isEditMode"
          size="x-small"
          variant="tonal"
          color="orange"
          icon="mdi-pencil"
          @click="startEditHeader"
        ></v-btn>
      </div>
      <p class="font-weight-bold text-white2 text-h4 ">{{ day.header.title }}</p>
      <p class="text-orange-lighten-3 pt-2">{{ day.header.rhythm }}</p>
    </template>


    <!-- 編輯模式 -->
    <template v-if="props.isEditMode && isHeaderEditing" >
      <v-text-field 
        v-model="headerDraft.title" 
        label="標題" 
        class="text-white2" 
        variant="outlined" 
        color="orange" 
        hide-details="auto"
        density="compact" 
        base-color="orange">
      </v-text-field>
      <v-text-field 
        v-model="headerDraft.rhythm" 
        class="mt-3 text-white2" 
        label="節奏" 
        aria-placeholder="請填寫節奏（例如：輕鬆、緊湊"
        variant="outlined" 
        color="orange"
        hide-details="auto" 
        density="compact" 
        base-color="orange">
      </v-text-field>
      
      <div class="mt-3 ga-2 d-flex align-center"> 
        <v-spacer></v-spacer>
        <v-btn
          v-if="props.isEditMode"
          size="small"
          variant="tonal"
          color="white2"
          icon="mdi-keyboard-return"
          @click="isHeaderEditing = false"
        ></v-btn>
        <v-btn
          v-if="props.isEditMode"
          size="small"
          variant="tonal"
          color="orange"
          icon="mdi-content-save"
          @click="saveHeader"
        ></v-btn>
        <v-btn
          v-if="props.isEditMode"
          size="small"
          variant="tonal"
          color="red"
          icon="mdi-trash-can"
          @click="deleteHeader"
        ></v-btn>

      </div>
    </template>
  </v-card>

  <!-- 日程 -->
  <v-card v-for="(item, index) in localItems" :key="item.id" class="pa-5  my-5 info-bord2" color="transparent" elevation="5">
    <!-- 時間 -->
    <div class="d-flex justify-space-between align-center">
      <v-chip size="large" color="orange" prepend-icon="mdi-clock-outline">{{ item.time }}</v-chip>
      <v-btn
        v-if="props.isEditMode"
        size="x-small"
        variant="tonal"
        color="orange"
        icon="mdi-pencil"
        @click="openEditDialog(index)"
      ></v-btn>
    </div>
    <!-- 標題 -->
    <p class=" font-weight-bold text-white2 py-2 text-h4">{{ item.title }}</p>
    <!-- 地址 & 導航 -->
    <div class="d-flex align-center">
      <v-icon color="red">mdi-map-marker</v-icon>
      <p class="text-body-medium text-blue-grey-lighten-4">{{ item.address }}</p>
      <v-spacer></v-spacer>
      <v-btn 
        class="border border-opacity-100 border-red"
        size="small"
        variant="tonal" 
        color="red" 
        prepend-icon="mdi-navigation" 
        text="導航"
        @click="openGoogleMap(item.address)">
      </v-btn>
    </div>
    <div v-if="item.tickets" class="mt-4">
      <airTickets />
    </div>
    <!-- 備註 -->
    <div class="section-block mt-5" v-if="item.note" >
      <p class="text-orange">Remark 備註</p>
      <div class="remark border border-opacity-50 border-orange21 rounded-lg p-3 mt-2 pa-3">
        <p class="text-white2">{{ item.note }}</p>
      </div>
    </div>

  </v-card>

  <!-- 編輯日程 -->
  <EditDate v-model="editDialog" :initial-data="editFormData" @save="saveItem" />



</template>

<script setup>
import { computed, ref, watch } from 'vue'
import airTickets from '@/components/flightInfo/ticket.vue'
import EditDate from './editDate.vue'

const props = defineProps({
    day: {
        type: Object,
        required: true,
    },
    isEditMode: {
        type: Boolean,
        default: false,
    },
})

const localItems = ref([])

const showHeader = ref(true)
const isHeaderEditing = ref(false)
const headerDraft = ref({ title: '', rhythm: '' })

const editDialog = ref(false)
const editingIndex = ref(-1)

const parseTimeRange = (time = '') => {
  const [startTime = '', endTime = ''] = String(time).split(' - ')

  return {
    startTime,
    endTime,
  }
}

const editFormData = computed(() => {
  const item = localItems.value[editingIndex.value]

  if (!item) {
    return {
      startTime: '',
      endTime: '',
      title: '',
      address: '',
      note: '',
      tickets: false,
    }
  }

  const { startTime, endTime } = parseTimeRange(item.time)

  return {
    startTime,
    endTime,
    title: item.title ?? '',
    address: item.address ?? '',
    note: item.note ?? '',
    tickets: Boolean(item.tickets),
  }
})

watch(
    () => props.day,
    (nextDay) => {
        localItems.value = (nextDay?.items ?? []).map((item) => ({
          ...item,
          tickets: Boolean(item?.tickets),
        }))

    if (!isHeaderEditing.value) {
      headerDraft.value = {
        title: nextDay?.header?.title ?? '',
        rhythm: nextDay?.header?.rhythm ?? '',
      }
    }
    },
    { immediate: true }
)

const startEditHeader = () => {
  if (!props.isEditMode) return
  headerDraft.value = {
    title: props.day?.header?.title ?? '',
    rhythm: props.day?.header?.rhythm ?? '',
  }
  isHeaderEditing.value = true
}

const openEditDialog = (index) => {
  if (!props.isEditMode) return

  editingIndex.value = index
  editDialog.value = true
}

const saveItem = (payload) => {
  const index = editingIndex.value
  if (index < 0) return

  const startTime = payload.startTime?.trim() ?? ''
  const endTime = payload.endTime?.trim() ?? ''
  const time = startTime && endTime ? `${startTime} - ${endTime}` : startTime || endTime

  const updatedItem = {
    ...localItems.value[index],
    time,
    title: payload.title,
    address: payload.address,
    note: payload.note,
    tickets: Boolean(payload.tickets),
  }

  localItems.value.splice(index, 1, updatedItem)

  if (Array.isArray(props.day?.items)) {
    props.day.items.splice(index, 1, { ...updatedItem })
  }

  editingIndex.value = -1
}

const saveHeader = () => {
  if (!props.isEditMode) return
  if (!props.day.header) props.day.header = {}

  props.day.header.title = headerDraft.value.title
  props.day.header.rhythm = headerDraft.value.rhythm
  isHeaderEditing.value = false

  window.alert('儲存成功')
}

const deleteHeader = () => {
  if (!props.isEditMode) return

  const ok = window.confirm('確定刪除該筆行程嗎?')
  if (!ok) return

  showHeader.value = false
  isHeaderEditing.value = false

  window.alert('行程已刪除')
}

const openGoogleMap = (addr) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`
    window.open(url, '_blank')
}
</script>

<style lang="scss" scoped>
.top {
    background-color: rgba(240, 255, 255, 0.096);
    border-radius: 24px;
}

.info-bord1 {
    background-color: rgba(252, 164, 0, 0.233);
    border-radius: 24px;
    border: 1px solid rgba(238, 182, 0, 0.774);
}

.info-bord2 {
    background-color: rgba(240, 255, 255, 0.096);
    border-radius: 24px;
}
</style>