<template>
  <section class="w-100 d-flex  ">
    <div class="w-70">
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
                <div class="d-flex align-center ga-2">
                  <v-checkbox v-model="item.visited" density="compact" hide-details color="green"
                    class="flex-grow-0 visited-check" />
                  <p class="text-white font-weight-bold title" :class="{ 'text-decoration-line-through text-grey': item.visited }">{{ item.title }}</p>
                </div>
                <v-btn v-if="props.isEditMode" size="x-small" variant="tonal" color="orange" icon="mdi-pencil"
                  class="ml-2 flex-shrink-0" @click="openEditDialog(index)"></v-btn>
              </div>

              <!-- 標籤 -->
              <div v-if="item.tags?.length" class="d-flex flex-wrap ga-1 mb-2">
                <v-chip v-for="tag in item.tags" :key="tag" size="x-small" variant="flat"
                  :color="tagConfig[tag]?.color ?? 'grey'" :prepend-icon="tagConfig[tag]?.icon">
                  {{ tagConfig[tag]?.label ?? tag }}
                </v-chip>
              </div>

              <v-divider class="my-1" opacity="1" color="orange"></v-divider>

              <!-- 地址 & 導航 -->
              <div class="d-flex flex-wrap align-center mt-3">
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
                <p class="text-orange text-body-2 mb-1">Remark 備註</p>
                <div class="remark border border-opacity-50 border-orange21 rounded-lg pa-3">
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

    <div class="w-30 px-5 d-flex flex-column ga-4">
      <!-- 倒數計時 -->
      <v-card class="pa-4 info-bord-side mt-5" color="transparent" elevation="4">
        <div class="d-flex align-center ga-2 mb-2">
          <v-icon color="orange-darken-1">mdi-airplane-takeoff</v-icon>
          <p class="font-weight-bold text-body-1 text-orange">出發倒數</p>
        </div>
        <div class="d-flex justify-center align-center ga-3">
          <div v-if="countdown.days > 0" class="text-center">
            <p class="text-h4 font-weight-bold text-orange">{{ countdown.days }}</p>
            <p class="text-caption text-blue-grey-lighten-4">天</p>
          </div>
          <div v-if="countdown.days > 0" class="text-h5 text-blue-grey-lighten-3">:</div>
          <div class="text-center">
            <p class="text-h4 font-weight-bold text-orange">{{ countdown.hours }}</p>
            <p class="text-caption text-blue-grey-lighten-4">時</p>
          </div>
          <div class="text-h5 text-blue-grey-lighten-3">:</div>
          <div class="text-center">
            <p class="text-h4 font-weight-bold text-orange">{{ countdown.minutes }}</p>
            <p class="text-caption text-blue-grey-lighten-4">分</p>
          </div>
        </div>
        <p v-if="countdown.passed" class="text-center text-caption text-green mt-1">已出發！旅途愉快 ✈</p>
      </v-card>

      <!-- 行程完成度 -->
      <v-card class="pa-4 info-bord-side" color="transparent" elevation="4">
        <div class="d-flex justify-space-between align-center mb-2">
          <p class="font-weight-bold text-body-1 text-orange">行程完成度</p>
          <p class="text-caption text-blue-grey-lighten-4">{{ visitedCount }}/{{ sortedItems.length }}</p>
        </div>
        <v-progress-linear :model-value="progressPercent" color="orange-darken-1" bg-color="rgba(255,140,0,0.15)"
          height="10" rounded></v-progress-linear>
        <p class="text-caption text-blue-grey-lighten-4 mt-1 text-right">{{ progressPercent }}%</p>
      </v-card>

      <!-- 行程總覽 -->
      <v-card class="pa-4 info-bord-side" color="transparent" elevation="4">
        <p class="font-weight-bold text-body-1 mb-3 text-orange">行程總覽</p>
        <div class="d-flex justify-space-between">
          <div class="d-flex flex-column align-center ga-1">
            <v-icon color="orange-darken-1" size="small">mdi-checkbox-marked-outline</v-icon>
            <p class="text-caption text-blue-grey-lighten-4">全部行程</p>
            <p class="font-weight-bold text-white">{{ sortedItems.length }} <span class="text-caption">筆</span></p>
          </div>
          <div class="d-flex flex-column align-center ga-1">
            <v-icon color="orange-darken-1" size="small">mdi-clock-outline</v-icon>
            <p class="text-caption text-blue-grey-lighten-4">總時長</p>
            <p class="font-weight-bold text-white">{{ totalDuration }}</p>
          </div>
          <div class="d-flex flex-column align-center ga-1">
            <v-icon color="red" size="small">mdi-map-marker</v-icon>
            <p class="text-caption text-blue-grey-lighten-4">造訪地點</p>
            <p class="font-weight-bold text-white">{{ uniqueLocations }} <span class="text-caption">處</span></p>
          </div>
        </div>
      </v-card>

      <!-- 地圖總覽 -->
      <v-card class="pa-4 info-bord-side overflow-hidden" color="transparent" elevation="4">
        <div class="d-flex align-center ga-2 mb-2">
          <v-icon color="orange-darken-1">mdi-map</v-icon>
          <p class="font-weight-bold text-body-1 text-orange">地圖總覽</p>
        </div>
        <div class="map-container rounded-lg overflow-hidden">
          <LeafletMap :items="sortedItems" :active-item-id="activeMapItem" />
        </div>
        <div class="d-flex flex-wrap ga-1 mt-2">
          <v-chip v-for="item in sortedItems.filter(i => i.lat && i.lng)" :key="item.id"
            size="x-small" variant="tonal" color="orange-darken-1" class="cursor-pointer"
            @click="activeMapItem = item.id">
            {{ item.title }}
          </v-chip>
        </div>
      </v-card>

      <!-- 行前檢查清單 -->
      <v-card class="pa-4 info-bord-side" color="transparent" elevation="4">
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
            :label="item.label" />
          <v-spacer />
          <v-btn icon="mdi-close" size="x-small" variant="text" color="red-lighten-1"
            @click="removeChecklistItem(i)" />
        </div>

        <!-- 新增項目 -->
        <div class="d-flex align-center ga-2 mt-3">
          <v-text-field v-model="newChecklistItem" variant="outlined" density="compact" color="orange"
            base-color="orange" placeholder="新增項目..." hide-details
            @keyup.enter="addChecklistItem" class="flex-grow-1" />
          <v-btn icon="mdi-plus" size="small" variant="tonal" color="orange-darken-1"
            :disabled="!newChecklistItem.trim()" @click="addChecklistItem" />
        </div>
      </v-card>
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
import LeafletMap from './LeafletMap.vue'
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

// 行程總覽
const totalDuration = computed(() => {
  let totalMinutes = 0
  for (const item of sortedItems.value) {
    const { startTime, endTime } = parseTimeRange(item.time)
    if (startTime && endTime) {
      const [sh, sm] = startTime.split(':').map(Number)
      const [eh, em] = endTime.split(':').map(Number)
      totalMinutes += (eh * 60 + em) - (sh * 60 + sm)
    }
  }
  if (totalMinutes <= 0) return '0 分'
  const hours = Math.floor(totalMinutes / 60)
  const mins = totalMinutes % 60
  return hours > 0 ? `${hours} 小時 ${mins} 分` : `${mins} 分`
})

const uniqueLocations = computed(() => {
  const addresses = new Set(sortedItems.value.map(i => i.address).filter(Boolean))
  return addresses.size
})

// 行前檢查清單
const checklist = ref([
  { label: '護照', checked: false },
  { label: '機票 / 電子機票', checked: false },
  { label: '藥品 / 常備藥', checked: false },
  { label: '護照 & 護照影本', checked: false },
  { label: '相機 / 充電器 / 電池', checked: false },
  { label: '旅遊保險 / 其他文件', checked: false },
])

const checkedCount = computed(() => checklist.value.filter(i => i.checked).length)

// 清單新增/刪除
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

// 地圖
const activeMapItem = ref<string | null>(null)

// 行程完成度
const visitedCount = computed(() => sortedItems.value.filter(i => i.visited).length)
const progressPercent = computed(() => {
  if (!sortedItems.value.length) return 0
  return Math.round((visitedCount.value / sortedItems.value.length) * 100)
})

// 出發倒數
const countdown = computed(() => {
  const tripDate = new Date(props.day.date)
  const now = new Date()
  const diff = tripDate.getTime() - now.getTime()

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, passed: true }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  return { days, hours, minutes, passed: false }
})
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
  // background-color: rgba(252, 164, 0, 0.233);
  // max-height: calc(100vh - 180px);
  // max-height: calc(100dvh - 320px);
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

.info-bord-side {
  background-color: rgba(240, 255, 255, 0.096);
  border-radius: 16px;
  border: 1px solid rgba(238, 182, 0, 0.3);
}

.transport-segment {
  border-left: 2px dashed rgba(96, 125, 139, 0.4);
  margin-left: 4px;
  padding-left: 8px;
}

.map-container {
  height: 200px;
  width: 100%;
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
