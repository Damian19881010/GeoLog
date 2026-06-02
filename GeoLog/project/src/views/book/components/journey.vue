<template>
  <section class="w-100 d-flex  ">
    <div class="w-100">
      <!-- 標頭 前言-->
    <v-card class="px-5 py-3 ga-2 mt-5 info-bord1 d-flex align-center" color="transparent" elevation="5">
      <v-chip color="amber-lighten-5" label prepend-icon="mdi-calendar-today">{{ day.date }}</v-chip>
      <p class="font-weight-bold text-white2 title ">{{ day.header.title }}</p>
    </v-card>

    <!-- 日程 -->
    <v-list class=" dateList px-0 bg-transparent  ">
      <v-timeline truncate-line="end" v-if="sortedItems.length" side="end" :density="timelineDensity"
        line-color="rgba(255,140,0,0.35)" class="journey-timeline  ">
        <template v-for="(item, index) in sortedItems" :key="item.id">
          <v-timeline-item dot-color="orange-darken-2"
            icon="mdi-map-marker" icon-color="white" size="small">
            <!-- 時間：顯示在軸線左側 -->
            <template #opposite>
              <div class="d-flex flex-column ga-1">
                <v-chip size="large" color="orange-darken-1" variant="tonal" prepend-icon="mdi-clock-outline">
                  {{ parseTimeRange(item.time).startTime }}
                </v-chip>
                <v-chip v-if="parseTimeRange(item.time).endTime" size="large" color="orange-darken-1" variant="tonal"
                  prepend-icon="mdi-clock-check-outline">
                  {{ parseTimeRange(item.time).endTime }}
                </v-chip>
              </div>
            </template>

            <!-- 卡片內容 -->
            <v-card class="pa-4 info-bord2 mb-2 w-100" color="transparent" elevation="4">
              <v-chip v-if="timelineDensity === 'compact'" color="orange-darken-1" variant="tonal"
                prepend-icon="mdi-clock-outline">
                {{ item.time }}
              </v-chip>
              <!-- 標題 + 編輯 + 完成勾選 -->
              <div class="d-flex justify-space-between align-start mb-1 flex-wrap">
                <v-checkbox
                  :model-value="item.visited"
                  density="compact"
                  hide-details
                  color="red"
                  class="flex-grow-0 visited-check text-white"
                  @update:model-value="setItemVisited(item.id, Boolean($event))"
                >
                  <template #label>
                    <p :class="['text-white', 'font-weight-bold', 'title', { 'text-decoration-line-through text-grey': item.visited }]">{{ item.title }}</p>
                  </template>
                </v-checkbox>
                <v-btn v-if="props.isEditMode" size="x-small" variant="tonal" color="orange" icon="mdi-pencil" class="ml-2 flex-shrink-0" @click="openEditDialog(index)"></v-btn>
              </div>

              <!-- 標籤 -->
              <div v-if="item.tags?.length" class="d-flex flex-wrap ga-2 mb-2 justify-end">
                <v-chip v-for="tag in item.tags" :key="tag" variant="flat"
                  :color="tagConfig[tag]?.color ?? 'grey'" :prepend-icon="tagConfig[tag]?.icon">
                  {{ tagConfig[tag]?.label ?? tag }}
                </v-chip>
              </div>

              <v-divider class="my-1" opacity="1" color="orange"></v-divider>

              <!-- 地址 & 導航 -->
              <div class="d-flex flex-wrap align-center mt-3 ga-2">
                <v-icon color="red" size="large">mdi-map-marker</v-icon>
                <p class="text-body-2 text-blue-grey-lighten-4 ">{{ item.address }}</p>
                <v-spacer></v-spacer>
                <v-btn class="border border-opacity-100 border-red" size="small" variant="tonal" color="red"
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
                <p class="text-white text-body-2 mb-1 bg-orange px-1">Remark 備註</p>
                <div class="remark border border-opacity-50 border-orange21 pa-3">
                  <p class="text-white2 text-body-2 ma-0">{{ item.note }}</p>
                </div>
              </div>
            </v-card>
          </v-timeline-item>

          <!-- 交通區段：顯示在兩個行程之間 -->
          <v-timeline-item v-if="item.transport && index < sortedItems.length - 1"
            :key="`transport-${item.id}`" size="x-small" dot-color="blue-grey-darken-1"
            :icon="transportIcon(item.transport.mode)" icon-color="white">
            <template #opposite>
              <v-chip size="small" color="blue-grey-darken-1" variant="tonal" prepend-icon="mdi-timer-outline">
                {{ item.transport.duration }}
              </v-chip>
            </template>
            <div class="transport-segment d-flex align-center ga-2 pa-2">
              <v-icon size="small" color="blue-grey-lighten-2">{{ transportIcon(item.transport.mode) }}</v-icon>
              <p class="text-caption text-blue-grey-lighten-3">
                {{ transportLabel(item.transport.mode) }}
                <span v-if="item.transport.note" class="ml-1 text-blue-grey-lighten-4">· {{ item.transport.note }}</span>
              </p>
            </div>
          </v-timeline-item>
        </template>
      </v-timeline>
    </v-list>

    </div>

   

    <!-- 編輯日程 -->
    <EditDate v-model="editDialog" :initial-data="editFormData" :mode="isCreatingItem ? 'create' : 'edit'"
      @save="saveItem" />

  </section>

</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useDisplay } from 'vuetify'
import airTickets from '@/components/flightInfo/ticket.vue'
import EditDate from './editDate.vue'

import type {
  EditJourneyInitialData,
  FlightTicketDetail,
  JourneyDay,
  JourneyItem,
  JourneyTag,
  JourneyTicketInput,
  JourneyTickets,
  TransportMode,
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

const { width } = useDisplay()
const timelineDensity = computed(() => width.value <= 820 ? 'compact' : 'default')
const dateChipSize = computed(() => width.value <= 1024 ? 'small' : 'x-large')

const localItems = ref<JourneyItem[]>([])

const sortedItems = computed(() =>
  [...localItems.value].sort((a, b) => a.time.localeCompare(b.time))
)

// 標籤配置
const tagConfig: Record<JourneyTag, { label: string; color: string; icon: string }> = {
  food: { label: '美食', color: 'red-darken-1', icon: 'mdi-silverware-fork-knife' },
  attraction: { label: '景點', color: 'blue-darken-1', icon: 'mdi-camera' },
  shopping: { label: '購物', color: 'pink-darken-1', icon: 'mdi-shopping' },
  transport: { label: '交通', color: 'blue-grey-darken-1', icon: 'mdi-car' },
  hotel: { label: '住宿', color: 'purple-darken-1', icon: 'mdi-bed' },
  activity: { label: '活動', color: 'green-darken-1', icon: 'mdi-run' },
}

// 交通圖示 & 標籤
const transportIcon = (mode: TransportMode): string => {
  const icons: Record<TransportMode, string> = {
    walk: 'mdi-walk',
    drive: 'mdi-car',
    train: 'mdi-train',
    bus: 'mdi-bus',
    flight: 'mdi-airplane',
    taxi: 'mdi-taxi',
  }
  return icons[mode] ?? 'mdi-map-marker-path'
}

const transportLabel = (mode: TransportMode): string => {
  const labels: Record<TransportMode, string> = {
    walk: '步行',
    drive: '自駕',
    train: '電車',
    bus: '巴士',
    flight: '飛行',
    taxi: '計程車',
  }
  return labels[mode] ?? mode
}

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
      tags: [],
      transport: null,
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
    tags: item.tags ?? [],
    transport: item.transport ?? null,
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

const setItemVisited = (itemId: string, visited: boolean): void => {
  const localItem = localItems.value.find(item => item.id === itemId)
  if (localItem) localItem.visited = visited

  const sourceItem = props.day?.items?.find(item => item.id === itemId)
  if (sourceItem) sourceItem.visited = visited
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
      tags: payload.tags ?? [],
      transport: payload.transport ?? null,
      visited: false,
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
    tags: payload.tags ?? currentItem.tags ?? [],
    transport: payload.transport ?? null,
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
/* 【 設置RWD 】*/
@mixin breakpoint($point) {
  @media screen and (max-width: $point) {
    @content;
  }
}

.top {
  background-color: rgba(240, 255, 255, 0.096);
  border-radius: 24px;
}

.info-bord1 {
  width: 100%;
  background-color: rgba(252, 164, 0, 0.233);
  border-radius: 16px;
  border: 1px solid rgba(238, 182, 0, 0.774);
  @include breakpoint(1024px) {
    width: 100%;

    .title {
      font-size: 1rem;
    }

    .subtitle {
      font-size: 0.8rem;
    }
  }
}

.dateList {
  padding: 0;
  width: 100%;
  max-height: calc(100vh - 0px);
  overflow-y: auto;

  @include breakpoint(1024px) {
    width: 100%;
  }

}


.info-bord2 {
  background-color: rgba(240, 255, 255, 0.096);
  border-radius: 24px;
  width: 500px;


  @include breakpoint(1680px) {
    width: 500px;
  }

  @include breakpoint(1440px) {
    width: 450px;
  }

  @include breakpoint(1280px) {
    width: 400px;
  }

  @include breakpoint(1152px) {
    width: 350px;
  }

  @include breakpoint(1024px) {
    width: 500px;
  }

  @include breakpoint(820px) {
    width: 100%;
  }

  @include breakpoint(600px) {
    width: 100%;
  }

}


// ── Timeline ──
.journey-timeline {
  :deep(.v-timeline-item__dot) {
    box-shadow: 0 0 10px rgba(255, 140, 0, 0.4);
  }
}

.transport-segment {
  border-left: 2px dashed rgba(96, 125, 139, 0.4);
  margin-left: 4px;
  padding-left: 8px;
}

.visited-check {
  :deep(.v-selection-control) {
    min-height: auto;
  }
}

.timeline-time-chip {
  font-size: 0.75rem;
  letter-spacing: 0.03em;
}
</style>
