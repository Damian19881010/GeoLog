<template>
  <!-- 標頭 前言-->
  <v-card v-if="showHeader" class="pa-5 mt-5  info-bord1" color="transparent" elevation="5">
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
  <v-timeline
    truncate-line="end"
    v-if="sortedItems.length"
    side="end"
    density="default"
    line-color="rgba(255,140,0,0.35)"
    class="journey-timeline mt-4">
    <v-timeline-item
      v-for="(item, index) in sortedItems"
      :key="item.id"
      dot-color="orange-darken-2"
      icon="mdi-map-marker"
      icon-color="white"
      size="small">
      <!-- 時間：顯示在軸線左側 -->
      <template #opposite>
        <v-chip
          size="x-large"
          color="orange-darken-1"
          variant="tonal"
          prepend-icon="mdi-clock-outline">
          {{ item.time }}
        </v-chip>
      </template>

      <!-- 卡片內容 -->
      <v-card class="pa-4 info-bord2 mb-2 w-100" width="600" color="transparent" elevation="4">
        <!-- 標題 + 編輯 -->
        <div class="d-flex justify-space-between align-start mb-1">
          <v-card-title class="text-white font-weight-bold">{{ item.title }}</v-card-title>
          <v-btn
            v-if="props.isEditMode"
            size="x-small"
            variant="tonal"
            color="orange"
            icon="mdi-pencil"
            class="ml-2 flex-shrink-0"
            @click="openEditDialog(index)"
          ></v-btn>
        </div>

        <v-divider class="my-1" opacity="1" color="orange"></v-divider>  

        <!-- 地址 & 導航 -->
        <div class="d-flex align-center mt-3">
          <v-icon color="red" size="large">mdi-map-marker</v-icon>
          <span class="text-body-2 text-blue-grey-lighten-4 ml-1">{{ item.address }}</span>
          <v-spacer></v-spacer>
          <v-btn
            class="border border-opacity-100 border-red"
            size="small"
            variant="tonal"
            color="red"
            @click="openGoogleMap(item.address)">
            <template #default>
              <p class="text-caption font-weight-bold text-white">導航</p>
            </template>
            <template #append>
              <v-icon>mdi-navigation</v-icon>
            </template>
          </v-btn>
        </div>

        

        <!-- 機票 -->
        <div v-if="item.tickets" class="mt-4">
          <airTickets :ticket="getDisplayTicket(item.tickets)" />
        </div>

        <!-- 備註 -->
        <div v-if="item.note" class="mt-4">
          <p class="text-orange text-body-2 mb-1">Remark 備註</p>
          <div class="remark border border-opacity-50 border-orange21 rounded-lg pa-3">
            <p class="text-white2 text-body-2 ma-0">{{ item.note }}</p>
          </div>
        </div>
      </v-card>
    </v-timeline-item>
  </v-timeline>

  <!-- 編輯日程 -->
  <EditDate v-model="editDialog" :initial-data="editFormData" :mode="isCreatingItem ? 'create' : 'edit'" @save="saveItem" />



</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import airTickets from '@/components/flightInfo/ticket.vue'
import EditDate from './editDate.vue'
import type {
  EditJourneyInitialData,
  FlightTicketDetail,
  JourneyDay,
  JourneyItem,
  JourneyTicketInput,
  JourneyTickets,
} from '../types'

const createDefaultTickets = (): JourneyTickets => ({
  selectedTrip: 'outbound',
  outbound: {
    airline: 'Peach樂桃',
    bookingCode: '5BPCRV',
    flightNo: 'MM922',
    departureAt: '2026/03/19 09:45',
    notice: '如搭乘日本國內線航班，請於出發時間前120分鐘~50分鐘內完成手續',
  },
  inbound: {
    airline: 'Peach樂桃',
    bookingCode: '5BPCRV',
    flightNo: 'MM929',
    departureAt: '2026/03/23 16:50',
    notice: '如搭乘日本國內線航班，請於出發時間前120分鐘~50分鐘內完成手續',
  },
})

const normalizeTickets = (tickets: JourneyTicketInput | undefined): JourneyTickets | null => {
  if (!tickets) return null
  if (tickets === true) return createDefaultTickets()

  const defaults = createDefaultTickets()
  const selectedTrip = tickets.selectedTrip === 'inbound' ? 'inbound' : 'outbound'

  return {
    selectedTrip,
    outbound: {
      ...defaults.outbound,
      ...(tickets.outbound ?? {}),
    },
    inbound: {
      ...defaults.inbound,
      ...(tickets.inbound ?? {}),
    },
  }
}

const props = withDefaults(defineProps<{
  day: JourneyDay
  isEditMode?: boolean
  addRequestKey?: number
}>(), {
  isEditMode: false,
  addRequestKey: 0,
})

const localItems = ref<JourneyItem[]>([])

const sortedItems = computed(() =>
  [...localItems.value].sort((a, b) => a.time.localeCompare(b.time))
)
const showHeader = ref(true)
const isHeaderEditing = ref(false)
const headerDraft = ref({ title: '', rhythm: '' })

const editDialog = ref(false)
const editingIndex = ref(-1)
const isCreatingItem = ref(false)

const parseTimeRange = (time = ''): { startTime: string; endTime: string } => {
  const [startTime = '', endTime = ''] = String(time).split(' - ')

  return {
    startTime,
    endTime,
  }
}

const editFormData = computed<EditJourneyInitialData>(() => {
  const item = localItems.value[editingIndex.value]

  if (isCreatingItem.value || !item) {
    return {
      startTime: '',
      endTime: '',
      title: '',
      address: '',
      note: '',
      tickets: null,
    }
  }

  const { startTime, endTime } = parseTimeRange(item.time)

  return {
    startTime,
    endTime,
    title: item.title ?? '',
    address: item.address ?? '',
    note: item.note ?? '',
    tickets: normalizeTickets(item.tickets),
  }
})

watch(
    () => props.day,
    (nextDay) => {
        localItems.value = (nextDay?.items ?? []).map((item: JourneyItem) => ({
          ...item,
          tickets: normalizeTickets(item?.tickets),
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

const openEditDialog = (index: number): void => {
  if (!props.isEditMode) return

  editingIndex.value = index
  isCreatingItem.value = false
  editDialog.value = true
}

const saveItem = (payload: EditJourneyInitialData): void => {
  const index = editingIndex.value
  const startTime = payload.startTime?.trim() ?? ''
  const endTime = payload.endTime?.trim() ?? ''
  const time = startTime && endTime ? `${startTime} - ${endTime}` : startTime || endTime

  if (isCreatingItem.value) {
    const nextItem: JourneyItem = {
      id: `${props.day.id}-${Date.now()}`,
      time,
      title: payload.title,
      address: payload.address,
      note: payload.note,
      tickets: normalizeTickets(payload.tickets),
    }

    localItems.value.push(nextItem)

    if (Array.isArray(props.day?.items)) {
      props.day.items.push({ ...nextItem })
    }

    isCreatingItem.value = false
    editingIndex.value = -1
    return
  }

  if (index < 0) return
  const currentItem = localItems.value[index]
  if (!currentItem) return

  const updatedItem: JourneyItem = {
    ...currentItem,
    time,
    title: payload.title,
    address: payload.address,
    note: payload.note,
    tickets: normalizeTickets(payload.tickets),
  }

  localItems.value.splice(index, 1, updatedItem)

  if (Array.isArray(props.day?.items)) {
    props.day.items.splice(index, 1, { ...updatedItem })
  }

  editingIndex.value = -1
}

const openCreateDialog = (): void => {
  if (!props.isEditMode) return

  editingIndex.value = -1
  isCreatingItem.value = true
  editDialog.value = true
}

watch(
  () => props.addRequestKey,
  (requestKey, previousRequestKey) => {
    if (!requestKey || requestKey <= (previousRequestKey ?? 0)) return

    openCreateDialog()
  }
)

watch(editDialog, (open) => {
  if (open) return

  isCreatingItem.value = false
  editingIndex.value = -1
})

const saveHeader = () => {
  if (!props.isEditMode) return
  if (!props.day.header) {
    props.day.header = {
      title: '',
      rhythm: '',
    }
  }

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

const openGoogleMap = (addr: string): void => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`
    window.open(url, '_blank', 'noopener,noreferrer')
}

const getDisplayTicket = (tickets: JourneyTicketInput): FlightTicketDetail => {
  const normalizedTickets = normalizeTickets(tickets) ?? createDefaultTickets()

  return normalizedTickets[normalizedTickets.selectedTrip]
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

// ── Timeline ──
.journey-timeline {
  :deep(.v-timeline-item__dot) {
    box-shadow: 0 0 10px rgba(255, 140, 0, 0.4);
  }
}

.timeline-time-chip {
  font-size: 0.75rem;
  letter-spacing: 0.03em;
}
</style>
