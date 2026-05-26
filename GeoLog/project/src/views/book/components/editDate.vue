<template>
  <v-dialog v-model="dialogModel" max-width="680" content-class="schedule-dialog" transition="dialog-bottom-transition">
    <v-card class="dialog-panel rounded-xl overflow-hidden w-100" elevation="0">



      <!-- 背景裝飾 -->
      <div class="panel-glow glow-left"></div>
      <div class="panel-glow glow-right"></div>
      <div class="panel-grid"></div>

      <!-- 標題 -->
      <div class="header-wrap px-6 px-sm-8 pt-6 pt-sm-8">
        <div class="title-wrap">
          <p class="text-h4 font-weight-bold panel-title mb-1">{{ dialogTitle }}</p>
          <p class="panel-subtitle mb-0">{{ dialogSubtitle }}</p>
        </div>
        <div class="glow-line mt-4"></div>
      </div>
      <v-list class="bg-transparent">

        <v-card-text class="px-6 px-sm-8 pb-4 pt-5">
          <!-- TIME -->
          <div class="section-block">
            <div class="section-label mb-3">TIME</div>

            <div class="d-flex flex-wrap ga-4">
              <div class="time-box">
                <TimePicker v-model="form.startTime" label="起始時間" icon="mdi-clock-start" />
              </div>

              <div class="time-box">
                <TimePicker v-model="form.endTime" label="結束時間" icon="mdi-clock-end" />
              </div>
            </div>
          </div>

          <!-- DETAILS -->
          <div class="section-block mt-6">
            <div class="section-label mb-3">DETAILS</div>

            <v-text-field v-model="form.title" label="標題" variant="outlined" density="comfortable" color="orange"
              base-color="orange" prepend-inner-icon="mdi-format-title" hide-details="auto" class="mb-4" />

            <v-text-field v-model="form.address" label="地址" variant="outlined" density="comfortable" color="orange"
              base-color="orange" prepend-inner-icon="mdi-map-marker-outline" hide-details="auto" class="mb-4" />

            <v-textarea v-model="form.note" label="備註" variant="outlined" density="comfortable" color="orange"
              base-color="orange" prepend-inner-icon="mdi-text-box-outline" hide-details="auto" auto-grow rows="3" />
          </div>

          <!-- OPTIONS -->
          <div class="section-block mt-6">
            <div class="section-label mb-3">OPTIONS</div>

            <div class="option-card pa-4">
              <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between ga-3">
                <div>
                  <div class="option-title">是否加入機票資訊</div>
                  <div class="option-subtitle">Attach flight information to this schedule item</div>
                </div>

                <v-btn-toggle v-model="form.hasTickets" mandatory divided class="flight-toggle">
                  <v-btn :value="true" class="toggle-btn">是</v-btn>
                  <v-btn :value="false" class="toggle-btn">否</v-btn>
                </v-btn-toggle>


              </div>
            </div>
          </div>

          <div class="ticket d-flex align-center ga-2" v-if="form.hasTickets">
            <v-checkbox
              label="去程"
              color="orange21"
              :model-value="form.ticketDirection === 'outbound'"
              hide-details="auto"
              @update:model-value="selectTicketDirection('outbound', $event)"
            ></v-checkbox>
            <v-checkbox
              label="回程"
              color="orange21"
              :model-value="form.ticketDirection === 'inbound'"
              hide-details="auto"
              @update:model-value="selectTicketDirection('inbound', $event)"
            ></v-checkbox>
          </div>

          <!-- 機票預覽 -->
          <div v-if="form.hasTickets" class="section-block ">
            <div class="section-label mb-3">FLIGHT</div>

            <airTickets :ticket="selectedTicket" />

          </div>
        </v-card-text>
      </v-list>
      <!-- footer -->
      <div class="px-6 px-sm-8 pb-6 pb-sm-8">
        <div class="footer-line mb-4"></div>

        <v-card-actions class="pa-0 d-flex justify-end ga-3">
          <v-btn class="btn-cancel" variant="flat" min-width="92" @click="dialogModel = false">
            返回
          </v-btn>

          <v-btn class="btn-save" variant="flat" min-width="110" @click="handleSave">
            {{ submitLabel }}
          </v-btn>
        </v-card-actions>
      </div>

    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import airTickets from '@/components/flightInfo/ticket.vue'
import TimePicker from '@/components/shared/timePicker.vue'
import type {
  EditJourneyInitialData,
  JourneyTickets,
  TripDirection,
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

const normalizeTickets = (tickets: JourneyTickets | null | undefined): JourneyTickets | null => {
  if (!tickets) return null

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
  modelValue?: boolean
  initialData?: EditJourneyInitialData
  mode?: 'create' | 'edit'
}>(), {
  modelValue: false,
  mode: 'edit',
  initialData: () => ({
    startTime: '',
    endTime: '',
    title: '',
    address: '',
    note: '',
    tickets: null,
  }),
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', payload: EditJourneyInitialData): void
}>()

const dialogModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const dialogTitle = computed(() => props.mode === 'create' ? '新增日程' : '日程編輯')
const dialogSubtitle = computed(() => props.mode === 'create' ? 'NEW SCHEDULE' : 'SCHEDULE EDITOR')
const submitLabel = computed(() => props.mode === 'create' ? '新增' : '儲存')

const form = reactive({
  startTime: '',
  endTime: '',
  title: '',
  address: '',
  note: '',
  hasTickets: false,
  ticketDirection: 'outbound' as TripDirection,
  tickets: createDefaultTickets(),
})

const resetForm = () => {
  const normalizedTickets = normalizeTickets(props.initialData?.tickets)

  form.startTime = props.initialData?.startTime || ''
  form.endTime = props.initialData?.endTime || ''
  form.title = props.initialData?.title || ''
  form.address = props.initialData?.address || ''
  form.note = props.initialData?.note || ''
  form.hasTickets = Boolean(normalizedTickets)
  form.ticketDirection = normalizedTickets?.selectedTrip ?? 'outbound'
  form.tickets = normalizedTickets ?? createDefaultTickets()
}

const selectedTicket = computed(() => form.tickets[form.ticketDirection])

const selectTicketDirection = (direction: TripDirection, checked: boolean | null): void => {
  if (!checked) return

  form.ticketDirection = direction
}

watch(
  () => props.initialData,
  () => {
    resetForm()
  },
  { deep: true, immediate: true }
)

watch(
  () => props.modelValue,
  (val) => {
    if (val) resetForm()
  }
)

const handleSave = () => {
  emit('save', {
    startTime: form.startTime,
    endTime: form.endTime,
    title: form.title,
    address: form.address,
    note: form.note,
    tickets: form.hasTickets
      ? {
          ...form.tickets,
          selectedTrip: form.ticketDirection,
        }
      : null,
  })

  dialogModel.value = false
}
</script>
