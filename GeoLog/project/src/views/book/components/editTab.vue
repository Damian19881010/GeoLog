<template>
  <v-dialog v-model="dialog" max-width="980" content-class="edit-tab-dialog">
    <v-card class="tab-editor-panel rounded-xl overflow-hidden" elevation="0">
      <div class="header-wrap px-6 px-sm-8 pt-6">
        <div class="d-flex flex-column flex-md-row align-md-center justify-space-between ga-4">
          <div>
            <p class="text-h5 font-weight-bold panel-title mb-1">編輯日程</p>
            <p class="panel-subtitle mb-0">DAY TAB AND SCHEDULE EDITOR</p>
          </div>

          <v-btn-toggle v-model="mode" mandatory divided class="mode-toggle">
            <v-btn value="create" variant="tonal" color="orange21">
              <template #prepend>
                <v-icon color="white">mdi-plus</v-icon>
              </template>
              <template #default>
                <span class="text-white">新增日程</span>
              </template>
            </v-btn>
            <v-btn value="edit" prepend-icon="mdi-calendar-edit" :disabled="!currentDay" variant="tonal" color="orange21">
              <template #prepend>
                <v-icon color="white">mdi-calendar-edit</v-icon>
              </template>
              <template #default>
                <span class="text-white">編輯當日所有行程</span>
              </template>
            </v-btn>
          </v-btn-toggle>
        </div>
        <div class="glow-line mt-4"></div>
      </div>

      <v-list class="bg-transparent">
        <v-card-text class="px-6 px-sm-8 py-5">
        <div class="section-label mb-3">DAY INFO</div>
        <v-row dense>
          <v-col cols="12" sm="6">
            <v-text-field
              v-if="mode === 'create'"
              v-model="form.tabText"
              label="名稱"
              placeholder="DAY 3"
              variant="outlined"
              density="compact"
              color="orange"
              base-color="orange"
              hide-details="auto"
            />
            <v-select
              v-else
              v-model="selectedDayId"
              :items="daySelectItems"
              item-title="text"
              item-value="id"
              label="選擇日程"
              variant="outlined"
              density="compact"
              color="orange"
              base-color="orange"
              hide-details="auto"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <DatePicker v-model="form.date" label="日期" max-width="185" />
          </v-col>
          <v-col cols="12" >
            <v-text-field
              v-model="form.title"
              label="當日標題"
              placeholder="DAY 3｜新增行程"
              variant="outlined"
              density="compact"
              color="orange"
              base-color="orange"
              hide-details="auto"
            />
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="form.rhythm"
              label="當日節奏"
              rows="1"
              auto-grow
              variant="outlined"
              density="compact"
              color="orange"
              base-color="orange"
              hide-details="auto"
            />
          </v-col>
        </v-row>
        <div class="glow-line  mt-8"></div>
        <div class="d-flex align-center mt-6 mb-3">
          <div>
            <div class="section-label">SCHEDULE</div>
            <div class="section-hint">一次編輯當日所有行程項目</div>
          </div>
          <v-spacer />
          <v-btn
            size="small"
            color="orange"
            variant="tonal"
            prepend-icon="mdi-plus"
            text="新增項目"
            @click="addItemDraft"
          />
        </div>

        <div v-if="itemDrafts.length === 0" class="empty-state pa-5 rounded-lg text-center">
          <v-icon icon="mdi-calendar-plus" color="orange" size="32" />
          <p class="text-white2 mt-2 mb-0">目前沒有行程項目，可以先新增一筆。</p>
        </div>

        <div v-for="(item, index) in itemDrafts" :key="item.id" class="schedule-row pa-4 mb-3 rounded-lg">
          <div class="d-flex align-center mb-3">
            <v-chip color="yellow" label>行程{{ index + 1 }}</v-chip>
            <v-spacer />
            <v-btn
              icon="mdi-trash-can-outline"
              size="x-small"
              color="red"
              variant="tonal"
              aria-label="刪除行程項目"
              @click="removeItemDraft(index)"
            />
          </div>

          <v-row dense>
            <v-col cols="6" sm="6" class="d-flex ga-2">
              <TimePicker v-model="item.startTime" label="開始" icon="mdi-clock-start" density="compact" max-width="170" />
              <TimePicker v-model="item.endTime" label="結束" icon="mdi-clock-end" density="compact" max-width="170" />
            </v-col>

            <v-col cols="12" sm="8">
              <v-text-field
                v-model="item.title"
                label="標題"
                variant="outlined"
                density="compact"
                color="orange"
                base-color="orange"
                hide-details="auto">
                <template #prepend-inner>
                  <v-icon color="white2">mdi-format-text</v-icon>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12">
              <v-text-field
                v-model="item.address"
                label="地址"
                variant="outlined"
                density="compact"
                color="orange"
                base-color="orange"
                hide-details="auto">
                <template #prepend-inner>
                  <v-icon color="white2">mdi-map-marker</v-icon>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12">
              <v-textarea
                v-model="item.note"
                label="備註"
                rows="1"
                auto-grow
                variant="outlined"
                density="compact"
                color="orange"
                base-color="orange"
                hide-details="auto">
                <template #prepend-inner>
                  <v-icon color="white2">mdi-note-text</v-icon>
                </template>
              </v-textarea>
            </v-col>
            <v-col cols="12" class="d-flex align-center">
              <v-checkbox
                v-model="item.hasTickets"
                label="保留/加入機票資訊"
                color="orange21"
                hide-details="auto"
              />
              <v-checkbox
                v-model="item.hasAccommodation"
                label="保留/加入住宿資訊"
                color="orange21"
                hide-details="auto"
              />
            </v-col>

            <!-- 標籤選擇 -->
            <v-col cols="12">
              <p class="text-caption text-blue-grey-lighten-3 mb-2">標籤</p>
              <div class="d-flex flex-wrap ga-2">
                <v-chip v-for="tag in availableTags" :key="tag.value" :color="tag.color"
                  :variant="item.tags.includes(tag.value) ? 'flat' : 'outlined'"
                  :prepend-icon="tag.icon" size="x-small" class="cursor-pointer"
                  @click="toggleItemTag(item, tag.value)">
                  {{ tag.label }}
                </v-chip>
              </div>
            </v-col>

            <!-- 交通方式 -->
            <v-col cols="12">
              <div class="d-flex align-center ga-3 mb-2">
                <p class="text-caption text-blue-grey-lighten-3">前往下一站的交通</p>
                <v-switch v-model="item.hasTransport" color="orange" density="compact" hide-details
                  class="flex-grow-0" />
              </div>
              <v-row v-if="item.hasTransport" dense>
                <v-col cols="4">
                  <v-select v-model="item.transportMode" :items="transportModeOptions" item-title="label"
                    item-value="value" label="方式" variant="outlined" density="compact" color="orange"
                    base-color="orange" hide-details="auto" />
                </v-col>
                <v-col cols="4">
                  <v-text-field v-model="item.transportDuration" label="預估時間" variant="outlined"
                    density="compact" color="orange" base-color="orange" hide-details="auto"
                    placeholder="30 分鐘" />
                </v-col>
                <v-col cols="4">
                  <v-text-field v-model="item.transportNote" label="備註" variant="outlined"
                    density="compact" color="orange" base-color="orange" hide-details="auto"
                    placeholder="選填" />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </div>
      </v-card-text>
      </v-list>




      <div class="px-6 px-sm-8 pb-6">
        <div class="glow-line mb-4"></div>
        <v-card-actions class="pa-0 d-flex justify-end ga-3">
          <v-btn class="btn-cancel" variant="flat" min-width="92" @click="dialog = false">
            取消
          </v-btn>
          <v-btn class="btn-save" variant="flat" min-width="120" :disabled="!canSave" @click="handleSave">
            {{ mode === 'create' ? '新增頁籤' : '儲存當日' }}
          </v-btn>
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import TimePicker from '@/components/shared/timePicker.vue'
import DatePicker from '@/components/shared/datePicker.vue'
import type { JourneyDay, JourneyItem, JourneyTicketInput, JourneyAccommodationInput, JourneyTag, TransportMode } from '../types'

type DialogMode = 'create' | 'edit'

type ItemDraft = {
  id: string
  startTime: string
  endTime: string
  title: string
  address: string
  note: string
  hasTickets: boolean
  hasAccommodation: boolean
  tickets: JourneyTicketInput
  accommodation: JourneyAccommodationInput
  tags: JourneyTag[]
  hasTransport: boolean
  transportMode: TransportMode
  transportDuration: string
  transportNote: string
}

const availableTags: { value: JourneyTag; label: string; color: string; icon: string }[] = [
  { value: 'food', label: '美食', color: 'red-darken-1', icon: 'mdi-silverware-fork-knife' },
  { value: 'attraction', label: '景點', color: 'blue-darken-1', icon: 'mdi-camera' },
  { value: 'shopping', label: '購物', color: 'pink-darken-1', icon: 'mdi-shopping' },
  { value: 'transport', label: '交通', color: 'blue-grey-darken-1', icon: 'mdi-car' },
  { value: 'hotel', label: '住宿', color: 'purple-darken-1', icon: 'mdi-bed' },
  { value: 'activity', label: '活動', color: 'green-darken-1', icon: 'mdi-run' },
]

const transportModeOptions: { value: TransportMode; label: string }[] = [
  { value: 'walk', label: '步行' },
  { value: 'drive', label: '自駕' },
  { value: 'train', label: '電車' },
  { value: 'bus', label: '巴士' },
  { value: 'flight', label: '飛行' },
  { value: 'taxi', label: '計程車' },
]

const toggleItemTag = (item: ItemDraft, tag: JourneyTag) => {
  const idx = item.tags.indexOf(tag)
  if (idx >= 0) {
    item.tags.splice(idx, 1)
  } else {
    item.tags.push(tag)
  }
}

const props = withDefaults(defineProps<{
  modelValue?: boolean
  days?: JourneyDay[]
  currentDay?: JourneyDay | null
  dayCount?: number
}>(), {
  modelValue: false,
  days: () => [],
  currentDay: null,
  dayCount: 0,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'add-day', day: JourneyDay): void
  (e: 'update-day', day: JourneyDay): void
}>()

const dialog = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

const mode = ref<DialogMode>('create')
const selectedDayId = ref('')
const itemDrafts = ref<ItemDraft[]>([])
const form = reactive({
  id: '',
  date: '',
  tabText: '',
  title: '',
  rhythm: '',
})

const daySelectItems = computed(() =>
  props.days.map(day => ({ id: day.id, text: `${day.tabText}（${day.date}）` }))
)

const canSave = computed(() =>
  form.date.trim() !== '' &&
  form.tabText.trim() !== '' &&
  form.title.trim() !== ''
)

const parseTimeRange = (time = '') => {
  const [startTime = '', endTime = ''] = String(time).split(' - ')

  return { startTime, endTime }
}

const toIsoDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const getNextDate = () => {
  const baseDate = props.currentDay?.date ? new Date(props.currentDay.date) : new Date()

  if (Number.isNaN(baseDate.getTime())) return toIsoDate(new Date())

  baseDate.setDate(baseDate.getDate() + 1)
  return toIsoDate(baseDate)
}

const createEmptyItemDraft = (): ItemDraft => ({
  id: `draft-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  startTime: '',
  endTime: '',
  title: '',
  address: '',
  note: '',
  hasTickets: false,
  hasAccommodation: false,
  tickets: null,
  accommodation: null,
  tags: [],
  hasTransport: false,
  transportMode: 'drive',
  transportDuration: '',
  transportNote: '',
})

const toItemDraft = (item: JourneyItem): ItemDraft => {
  const { startTime, endTime } = parseTimeRange(item.time)

  return {
    id: item.id,
    startTime,
    endTime,
    title: item.title ?? '',
    address: item.address ?? '',
    note: item.note ?? '',
    hasTickets: Boolean(item.tickets),
    hasAccommodation: Boolean(item.accommodation),
    tickets: item.tickets ?? null,
    accommodation: item.accommodation ?? null,
    tags: [...(item.tags ?? [])],
    hasTransport: Boolean(item.transport),
    transportMode: item.transport?.mode ?? 'drive',
    transportDuration: item.transport?.duration ?? '',
    transportNote: item.transport?.note ?? '',
  }
}

const resetForCreate = () => {
  const dayNumber = props.dayCount + 1

  form.id = `day-${Date.now()}`
  form.date = getNextDate()
  form.tabText = `DAY ${dayNumber}`
  form.title = `DAY ${dayNumber}｜新增行程`
  form.rhythm = ''
  itemDrafts.value = [createEmptyItemDraft()]
}

const resetForEdit = () => {
  const day = props.currentDay

  if (!day) {
    selectedDayId.value = props.days[0]?.id ?? ''
    return
  }

  selectedDayId.value = day.id
  form.id = day.id
  form.date = day.date
  form.tabText = day.tabText
  form.title = day.header?.title ?? ''
  form.rhythm = day.header?.rhythm ?? ''
  itemDrafts.value = day.items.map(toItemDraft)
}

const resetForm = () => {
  if (mode.value === 'edit') {
    resetForEdit()
    return
  }

  resetForCreate()
}

const addItemDraft = () => {
  itemDrafts.value.push(createEmptyItemDraft())
}

const removeItemDraft = (index: number) => {
  itemDrafts.value.splice(index, 1)
}

const draftHasContent = (draft: ItemDraft) =>
  draft.startTime.trim() !== '' ||
  draft.endTime.trim() !== '' ||
  draft.title.trim() !== '' ||
  draft.address.trim() !== '' ||
  draft.note.trim() !== '' ||
  draft.hasTickets ||
  draft.hasAccommodation ||
  draft.tags.length > 0 ||
  draft.hasTransport

const toJourneyItem = (draft: ItemDraft): JourneyItem => {
  const startTime = draft.startTime.trim()
  const endTime = draft.endTime.trim()
  const time = startTime && endTime ? `${startTime} - ${endTime}` : startTime || endTime

  return {
    id: draft.id.startsWith('draft-') ? `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}` : draft.id,
    time,
    title: draft.title.trim() || '未命名行程',
    address: draft.address.trim(),
    note: draft.note.trim() || null,
    tickets: draft.hasTickets ? draft.tickets || true : null,
    accommodation: draft.hasAccommodation ? draft.accommodation || true : null,
    tags: [...draft.tags],
    transport: draft.hasTransport
      ? {
          mode: draft.transportMode,
          duration: draft.transportDuration,
          note: draft.transportNote || undefined,
        }
      : null,
    visited: false,
  }
}

const buildJourneyDay = (): JourneyDay => ({
  id: mode.value === 'edit' ? form.id : `day-${Date.now()}`,
  date: form.date,
  tabText: form.tabText.trim(),
  header: {
    title: form.title.trim(),
    rhythm: form.rhythm.trim(),
  },
  items: itemDrafts.value
    .filter(draftHasContent)
    .map(toJourneyItem),
})

const handleSave = () => {
  if (!canSave.value) return

  const nextDay = buildJourneyDay()

  if (mode.value === 'edit') {
    emit('update-day', nextDay)
  } else {
    emit('add-day', nextDay)
  }

  dialog.value = false
}

watch(
  () => props.modelValue,
  (open) => {
    if (!open) return

    mode.value = 'create'
    resetForm()
  }
)

watch(mode, () => {
  if (!props.modelValue) return
  if (mode.value === 'edit' && props.days.length === 0) {
    mode.value = 'create'
    return
  }

  resetForm()
})

watch(selectedDayId, (id) => {
  if (mode.value !== 'edit' || !id) return

  const day = props.days.find(d => d.id === id)
  if (!day) return

  form.id = day.id
  form.date = day.date
  form.tabText = day.tabText
  form.title = day.header?.title ?? ''
  form.rhythm = day.header?.rhythm ?? ''
  itemDrafts.value = day.items.map(toItemDraft)
})

watch(
  () => props.currentDay,
  () => {
    if (props.modelValue && mode.value === 'edit') resetForm()
  }
)
</script>

<style scoped lang="scss">
/* ===== Dialog Overlay (背景模糊) ===== */
:deep(.v-overlay__scrim) {
  backdrop-filter: blur(6px);
  background: rgba(0, 0, 0, 0.55) !important;
}

/* ===== Dialog Container ===== */
.edit-tab-dialog {
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(255, 173, 77, 0.35);
}

/* ===== Card Panel ===== */
.tab-editor-panel {
  position: relative;
  border: 1px solid rgba(255, 173, 77, 0.22);
  background: linear-gradient(180deg, rgba(17, 22, 45, 0.98) 0%, rgba(8, 12, 28, 0.99) 100%);
  color: rgba(255, 255, 255, 0.92);
}

/* ===== Typography ===== */
.panel-title {
  color: #ffb347;
  letter-spacing: 1px;
}

.panel-subtitle,
.section-hint {
  color: rgba(255, 255, 255, 0.58);
  font-size: 0.78rem;
  letter-spacing: 1.4px;
}

.section-label {
  color: #ffb347;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 1.4px;
}

/* ===== Decorative ===== */
.glow-line {
  height: 1px;
  width: 100%;
  background: linear-gradient(90deg, rgba(255, 140, 0, 0.95), rgba(255, 196, 120, 0.3), transparent);
  box-shadow: 0 0 12px rgba(255, 145, 0, 0.16);
}

/* ===== Components ===== */
.mode-toggle {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.schedule-row,
.empty-state {
  border: 1px solid rgba(255, 173, 77, 0.16);
  background: rgba(255, 255, 255, 0.045);
}

/* ===== Buttons ===== */
.btn-cancel {
  background: rgba(255, 255, 255, 0.08) !important;
  color: rgba(255, 255, 255, 0.86) !important;
}

.btn-save {
  background: linear-gradient(135deg, #ffb347 0%, #ff7a00 100%) !important;
  color: #fff !important;
}
</style>
