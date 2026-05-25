<template>
  <v-dialog v-model="dialog" max-width="600px" content-class="create-dialog">
    <v-card class="dialog-panel rounded-xl overflow-hidden" elevation="0">
      <v-toolbar color="transparent" density="compact">
        <v-toolbar-title class="panel-title text-h6 font-weight-bold">
          <v-icon class="mr-2" color="orange">mdi-map-marker-plus</v-icon>
          新增行程
        </v-toolbar-title>
        <template #append>
          <v-btn icon="mdi-close" variant="text" color="white" @click="dialog = false" />
        </template>
      </v-toolbar>

      <v-divider class="glow-line" />

      <v-card-text class="pt-6">
        <v-text-field
          v-model="form.name"
          label="行程名稱"
          placeholder="例如：東京 5 日自由行"
          prepend-inner-icon="mdi-pencil-outline"
          color="orange"
          base-color="orange"
          variant="outlined"
          density="compact"
          hide-details="auto"
          :rules="[rules.required]"
        />

        <v-select
          v-model="form.country"
          class="mt-4"
          :items="countryOptions"
          label="國家"
          prepend-inner-icon="mdi-map-marker"
          color="orange"
          base-color="orange"
          variant="outlined"
          density="compact"
          hide-details="auto"
          :rules="[rules.required]"
        />

        <v-text-field
          v-model="form.city"
          class="mt-4"
          label="城市"
          placeholder="例如：東京、台北、首爾"
          prepend-inner-icon="mdi-city-variant-outline"
          color="orange"
          base-color="orange"
          variant="outlined"
          density="compact"
          hide-details="auto"
          :rules="[rules.required]"
        />

        <v-row class="mt-4">
          <v-col cols="6">
            <v-text-field
              ref="startDateFieldRef"
              v-model="form.startDate"
              label="開始日期"
              type="date"
              color="orange"
              base-color="orange"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :rules="[rules.required]"
            >
              <template #append-inner>
                <v-btn
                  icon="mdi-calendar-start"
                  color="orange"
                  variant="text"
                  density="comfortable"
                  size="small"
                  aria-label="選擇開始日期"
                  @click.stop="openDatePicker('start')"
                />
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              ref="endDateFieldRef"
              v-model="form.endDate"
              label="結束日期"
              type="date"
              color="orange"
              base-color="orange"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :rules="[rules.required, rules.endAfterStart]"
            >
              <template #append-inner>
                <v-btn
                  icon="mdi-calendar-end"
                  color="orange"
                  variant="text"
                  density="comfortable"
                  size="small"
                  aria-label="選擇結束日期"
                  @click.stop="openDatePicker('end')"
                />
              </template>
            </v-text-field>
          </v-col>
        </v-row>

        <v-expand-transition>
          <div v-if="tripDays > 0" class="mt-3 d-flex align-center">
            <v-chip color="orange" variant="tonal" size="small" prepend-icon="mdi-clock-outline">
              {{ tripDays }} 天 {{ tripNights }} 夜
            </v-chip>
          </div>
        </v-expand-transition>

        <v-file-input
          v-model="form.imageFile"
          class="mt-4"
          label="上傳封面圖片"
          prepend-icon=""
          prepend-inner-icon="mdi-image-plus"
          color="orange"
          base-color="orange"
          variant="outlined"
          density="compact"
          hide-details="auto"
          accept="image/*"
          @update:model-value="onImageSelected"
        />

        <v-expand-transition>
          <div v-if="imagePreview" class="mt-4 image-preview-wrapper">
            <v-img :src="imagePreview" max-height="200" class="rounded-lg" cover>
              <template #placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular indeterminate color="orange" />
                </div>
              </template>
            </v-img>
            <v-btn
              class="image-remove-btn"
              icon="mdi-close-circle"
              size="x-small"
              color="error"
              variant="elevated"
              @click="removeImage"
            />
          </div>
        </v-expand-transition>
      </v-card-text>

      <v-divider class="glow-line" />

      <v-card-actions class="pa-4 d-flex justify-end ga-3">
        <v-btn class="btn-cancel" variant="outlined" @click="dialog = false">
          取消
        </v-btn>
        <v-btn
          class="btn-save"
          :disabled="!isFormValid"
          :loading="isSubmitting"
          @click="handleCreate"
        >
          <v-icon class="mr-1">mdi-check</v-icon>
          建立行程
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch, type ComponentPublicInstance } from 'vue'

export interface TripFormData {
  city: string
  name: string
  startDate: string
  endDate: string
  country: string
  imageFile: File[]
  imagePreviewUrl: string | null
}

type TripFormState = Omit<TripFormData, 'imagePreviewUrl'>

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'create', data: TripFormData): void
}>()

const dialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
})

const MS_PER_DAY = 1000 * 60 * 60 * 24
const countryOptions = ['日本', '台灣', '韓國', '泰國', '美國', '英國', '法國', '德國', '澳洲']

const form = ref<TripFormState>(createEmptyForm())
const imagePreview = ref<string | null>(null)
const isSubmitting = ref(false)
const startDateFieldRef = ref<DateFieldRef | null>(null)
const endDateFieldRef = ref<DateFieldRef | null>(null)

type DateFieldRef = ComponentPublicInstance & {
  $el: HTMLElement
}

function createEmptyForm(): TripFormState {
  return {
    city: '',
    name: '',
    startDate: '',
    endDate: '',
    country: '',
    imageFile: [],
  }
}

const rules = {
  required: (value: string) => !!value || '此欄位為必填',
  endAfterStart: (value: string) => {
    if (!form.value.startDate || !value) return true
    return value >= form.value.startDate || '結束日期不可早於開始日期'
  },
}

const tripDays = computed(() => {
  if (!form.value.startDate || !form.value.endDate) return 0
  const diff = Math.ceil(
    (new Date(form.value.endDate).getTime() - new Date(form.value.startDate).getTime()) / MS_PER_DAY
  ) + 1
  return diff > 0 ? diff : 0
})

const tripNights = computed(() => Math.max(tripDays.value - 1, 0))

const isFormValid = computed(() =>
  form.value.name.trim() !== '' &&
  form.value.city.trim() !== '' &&
  form.value.country !== '' &&
  form.value.startDate !== '' &&
  form.value.endDate !== '' &&
  form.value.endDate >= form.value.startDate
)

const openDatePicker = (target: 'start' | 'end') => {
  const field = target === 'start' ? startDateFieldRef.value : endDateFieldRef.value
  const input = field?.$el.querySelector('input[type="date"]') as HTMLInputElement | null

  input?.focus()
  if (typeof input?.showPicker === 'function') {
    input.showPicker()
    return
  }

  input?.click()
}

const onImageSelected = (files: File | File[] | null) => {
  const fileList = Array.isArray(files) ? files : files ? [files] : []
  const file = fileList[0]

  if (!file) {
    imagePreview.value = null
    return
  }

  const reader = new FileReader()
  reader.onload = (event) => {
    imagePreview.value = event.target?.result as string
  }
  reader.readAsDataURL(file)
}

const removeImage = () => {
  form.value.imageFile = []
  imagePreview.value = null
}

const resetForm = () => {
  form.value = createEmptyForm()
  imagePreview.value = null
  isSubmitting.value = false
}

const handleCreate = () => {
  if (!isFormValid.value || isSubmitting.value) return
  isSubmitting.value = true

  emit('create', {
    name: form.value.name.trim(),
    city: form.value.city.trim(),
    startDate: form.value.startDate,
    endDate: form.value.endDate,
    country: form.value.country,
    imageFile: form.value.imageFile,
    imagePreviewUrl: imagePreview.value,
  })

  dialog.value = false
}

watch(dialog, (open) => {
  if (!open) resetForm()
})
</script>

<style scoped lang="scss">
.dialog-panel {
  position: relative;
  border: 1px solid rgba(255, 173, 77, 0.24);
  background:
    linear-gradient(180deg, rgba(17, 22, 45, 0.96) 0%, rgba(8, 12, 28, 0.98) 100%);
  box-shadow:
    0 0 0 1px rgba(255, 180, 90, 0.06) inset,
    0 18px 60px rgba(0, 0, 0, 0.5),
    0 0 28px rgba(255, 132, 0, 0.08);
  color: rgba(255, 255, 255, 0.92);

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background:
      radial-gradient(circle at 15% 12%, rgba(0, 157, 255, 0.08), transparent 26%),
      radial-gradient(circle at 88% 16%, rgba(255, 136, 0, 0.1), transparent 22%);
    pointer-events: none;
  }
}

.panel-title {
  letter-spacing: 2px;
  color: #ffb347;
}

.glow-line {
  height: 1px;
  width: 100%;
  background: linear-gradient(90deg,
    rgba(255, 140, 0, 0.95) 0%,
    rgba(255, 196, 120, 0.35) 45%,
    rgba(255, 255, 255, 0.04) 100%);
  box-shadow: 0 0 12px rgba(255, 145, 0, 0.16);
}

.image-preview-wrapper {
  position: relative;

  .image-remove-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 1;
  }
}

.btn-cancel {
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  background: rgba(255, 255, 255, 0.05) !important;
  color: rgba(255, 255, 255, 0.88) !important;
}

.btn-save {
  background: linear-gradient(135deg, #ffb347 0%, #ff7a00 100%) !important;
  color: #fff !important;
  box-shadow:
    0 10px 24px rgba(255, 122, 0, 0.24),
    0 0 16px rgba(255, 166, 77, 0.18);

  &:disabled {
    opacity: 0.4;
    box-shadow: none;
  }
}
</style>
