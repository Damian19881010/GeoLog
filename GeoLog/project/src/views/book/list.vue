<template>
  <v-container class="pa-0 container" fluid>
    <!-- 新增旅程 / 旅程列表 / 快速過濾 -->
    <section class="section">
      <v-card
        class="top add pa-5 border border-dashed border-orange21 border-opacity-100 d-flex justify-center align-center rounded-lg ga-2 flex-wrap"
        color="transparent">
        <!-- 快速過濾 -->
        <!-- 國家 -->
        <v-select v-model="selectedCountry" class="text-white country-select w-100" :items="countryOptions"
          item-title="title" item-value="value"
          variant="outlined" density="compact" hide-details="auto" max-width="200" theme="dark"
          clearable
          :loading="isLocationLoading"
          :menu-props="{ contentClass: 'country-dropdown' }">
          <template #label>
            <div class="d-flex align-center ga-2">
              <v-icon icon="mdi-map-marker" color="white"></v-icon>
              <span class="text-orange21">國家</span>
            </div>
          </template>
        </v-select>
        <!-- 城市 -->
        <v-select v-model="selectedCity" class="text-white country-select w-100" :items="cityOptions"
          item-title="title" item-value="value"
          variant="outlined" density="compact" hide-details="auto" max-width="200" theme="dark"
          clearable
          :disabled="!selectedCountry || isLocationLoading"
          :loading="isLocationLoading"
          :no-data-text="locationLoadError || (selectedCountry ? '沒有城市資料' : '請先選擇國家')"
          :menu-props="{ contentClass: 'country-dropdown' }">
          <template #label>
            <div class="d-flex align-center ga-2">
              <v-icon icon="mdi-map-marker" color="white"></v-icon>
              <span class="text-orange21">城市</span>
            </div>
          </template>
        </v-select>
        <!-- 時間(年月) -->
        <v-select v-model="selectedYear" class="text-white country-select w-100" :items="yearOptions"
          item-title="title" item-value="value"
          variant="outlined" density="compact" hide-details="auto" max-width="140" theme="dark"
          clearable
          :menu-props="{ contentClass: 'country-dropdown' }">
          <template #label>
            <div class="d-flex align-center ga-2">
              <v-icon icon="mdi-calendar-month" color="white"></v-icon>
              <span class="text-orange21">年份</span>
            </div>
          </template>
        </v-select>
        <v-select v-model="selectedMonth" class="text-white country-select w-100" :items="monthOptions"
          item-title="title" item-value="value"
          variant="outlined" density="compact" hide-details="auto" max-width="140" theme="dark"
          clearable
          :disabled="!selectedYear"
          :no-data-text="selectedYear ? '該年份沒有月份資料' : '請先選擇年份'"
          :menu-props="{ contentClass: 'country-dropdown' }">
          <template #label>
            <div class="d-flex align-center ga-2">
              <v-icon icon="mdi-calendar-text" color="white"></v-icon>
              <span class="text-orange21">月份</span>
            </div>
          </template>
        </v-select>
        <v-spacer />

        <!-- 文字 -->
        <div class="d-flex ga-2">
          <v-btn color="orange21" prepend-icon="mdi-plus-circle" @click="openCreateDialog">新增旅程</v-btn>
          <v-btn color="orange21" prepend-icon="mdi-trash-can-outline" variant="tonal" @click="isEditing = !isEditing">{{ isEditing ? '完成編輯' : '編輯旅程' }}</v-btn>
        </div>

      </v-card>
    </section>

    <section class="section">
      <v-list class="bg-transparent list px-2">
        <v-row class="row " justify="start" >

          <v-col cols="12" xl="3" lg="4" md="4" sm="6" v-for="item in filteredTrips" :key="item.id">
            <v-card class="info w-100 h-100" @click="goToJourney(item.id)" >
              <div class="delete px-5 ga-2 d-flex justify-space-between w-100 flex-wrap"  v-if="isEditing">
                <v-btn 
                  size="small" 
                  color="orange" 
                  prepend-icon="mdi-delete"
                  text="刪除" 
                  @click.stop="deleteTrip(item.id)">
                </v-btn>
                <v-btn prepend-icon="mdi-pencil" size="small" color="orange" text="編輯" @click.stop="openEditDialog(item)"></v-btn>
                <v-spacer></v-spacer>
                <v-btn class="opacity-80" append-icon="mdi-share" color="black" size="small" text="分享共編" @click.stop></v-btn>
              </div>
              <!-- 圖片 -->
              <div class="image-container pa-0" style="max-height: 200px; overflow: hidden;">
                <v-img :src="item.image" max-width="100%" height="100%"></v-img>
              </div>
              
              <!-- 文字 -->
              <v-card-item class="item">
                <div class="d-flex ga-2 align-center w-100">
                  <v-chip v-if="item.country !== ''" label color="white" class="country-chip">
                    <template #prepend>
                      <span
                        v-if="getCountryFlagClass(item.country)"
                        :class="['fi', getCountryFlagClass(item.country), 'country-flag']"
                        aria-hidden="true"
                      ></span>
                    </template>
                    {{ getLocationLabel(item.country) }}
                  </v-chip>
                  <v-chip v-if="item.city !== ''"  color="yellow" prepend-icon="mdi-map-marker-radius">{{ getLocationLabel(item.city) }}</v-chip>
                </div>
                  <p class="title py-2">{{ item.name }}</p>

                <div class="d-flex justify-space-between mb-2 ">
                  <v-chip label color="orange" size="small" prepend-icon="mdi-calendar-range">{{ item.startDate }}~{{ item.endDate }}</v-chip>
                </div>
              </v-card-item>

            </v-card>
          </v-col>
        </v-row>
      </v-list>
    </section>

    <Creat
      v-model="createDialog"
      :mode="dialogMode"
      :initial-data="editingTripFormData"
      @create="onTripCreated"
      @update="onTripUpdated" />
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import tripImg from '@/assets/images/trip.png'
import Creat from './components/creat.vue'
import type { TripFormData } from './components/creat.vue'
import {
  fallbackCountryCityMap,
  getCountryFlagClass,
  getLocationLabel,
  type CountryCityMap as LocationCountryCityMap,
  toCityValue,
  toCountryValue,
} from './locationConfig'
import type { Trip } from './types'
import { useTrips } from './useTrips'

const createDialog = ref(false)
const selectedCountry = ref<string | null>(null)
const selectedCity = ref<string | null>(null)
const selectedYear = ref<string | null>(null)
const selectedMonth = ref<string | null>(null)
const editingTripId = ref<number | null>(null)

type SelectOption = {
  title: string
  value: string
}

type CountriesNowCountry = {
  country: string
  cities: string[]
}

type CountriesNowResponse = {
  error: boolean
  msg: string
  data: CountriesNowCountry[]
}

type CachedCountryCityMap = {
  expiresAt: number
  data: LocationCountryCityMap
}

const OTHER_OPTION = '其他'
const COUNTRY_CITY_ENDPOINT = 'https://countriesnow.space/api/v0.1/countries'
const COUNTRY_CITY_CACHE_KEY = 'geolog:country-city-options:v2'
const COUNTRY_CITY_CACHE_TTL = 1000 * 60 * 60 * 24 * 7

const countryCityMap = ref<LocationCountryCityMap>(fallbackCountryCityMap)
const isLocationLoading = ref(false)
const locationLoadError = ref('')

const normalizedSelectedCountry = computed(() => {
  if (!selectedCountry.value) return null
  return selectedCountry.value === OTHER_OPTION ? OTHER_OPTION : toCountryValue(selectedCountry.value)
})

const normalizedSelectedCity = computed(() => {
  if (!selectedCity.value) return null
  return selectedCity.value === OTHER_OPTION ? OTHER_OPTION : toCityValue(selectedCity.value)
})

const countryOptions = computed<SelectOption[]>(() =>
  toSelectOptions(withOtherOption([
    ...Object.keys(countryCityMap.value),
    ...trips.value.map((trip) => trip.country),
  ]))
)

const cityOptions = computed<SelectOption[]>(() => {
  if (!normalizedSelectedCountry.value) return []

  return toSelectOptions(withOtherOption([
    ...(countryCityMap.value[normalizedSelectedCountry.value] ?? []),
    ...trips.value
      .filter((trip) => trip.country === normalizedSelectedCountry.value)
      .map((trip) => trip.city),
  ]))
})

const yearOptions = computed<SelectOption[]>(() => {
  const years = Array.from(new Set(
    trips.value.flatMap((trip) => getTripYearsInRange(trip))
  )).sort((left, right) => Number(right) - Number(left))

  return years.map((year) => ({
    title: `${year}年`,
    value: year,
  }))
})

const monthOptions = computed<SelectOption[]>(() => {
  if (!selectedYear.value) return []

  const months = Array.from(new Set(
    trips.value.flatMap((trip) => getTripMonthsInYear(trip, Number(selectedYear.value)))
  )).sort((left, right) => Number(left) - Number(right))

  return months.map((month) => ({
    title: `${month}月`,
    value: month,
  }))
})

const withOtherOption = (items: string[]) => {
  const uniqueItems = Array.from(new Set(
    items
      .map((item) => item.trim())
      .filter((item) => item !== '' && item !== OTHER_OPTION)
  ))

  uniqueItems.sort((a, b) => a.localeCompare(b, 'zh-Hant'))

  return [...uniqueItems, OTHER_OPTION]
}

const toSelectOptions = (items: string[]) =>
  items.map((value) => ({
    title: getLocationLabel(value),
    value,
  }))

const getTripDateRange = (trip: Trip) => {
  const start = new Date(`${trip.startDate}T00:00:00`)
  const end = new Date(`${trip.endDate}T23:59:59.999`)

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null

  return start <= end ? { start, end } : { start: end, end: start }
}

const getTripYearsInRange = (trip: Trip) => {
  const range = getTripDateRange(trip)
  if (!range) return []

  const years: string[] = []

  for (let year = range.start.getFullYear(); year <= range.end.getFullYear(); year += 1) {
    years.push(String(year))
  }

  return years
}

const getTripMonthsInYear = (trip: Trip, year: number) => {
  const range = getTripDateRange(trip)
  if (!range || range.start.getFullYear() > year || range.end.getFullYear() < year) return []

  const startMonth = range.start.getFullYear() === year ? range.start.getMonth() + 1 : 1
  const endMonth = range.end.getFullYear() === year ? range.end.getMonth() + 1 : 12
  const months: string[] = []

  for (let month = startMonth; month <= endMonth; month += 1) {
    months.push(String(month).padStart(2, '0'))
  }

  return months
}

const matchesSelectedDate = (trip: Trip) => {
  if (!selectedYear.value) return true

  const range = getTripDateRange(trip)
  if (!range) return false

  const year = Number(selectedYear.value)
  const month = selectedMonth.value ? Number(selectedMonth.value) : null
  const filterStart = month
    ? new Date(year, month - 1, 1)
    : new Date(year, 0, 1)
  const filterEnd = month
    ? new Date(year, month, 0, 23, 59, 59, 999)
    : new Date(year, 11, 31, 23, 59, 59, 999)

  return range.start <= filterEnd && range.end >= filterStart
}

const normalizeCountryCityMap = (countries: CountriesNowCountry[]) => {
  return countries.reduce<LocationCountryCityMap>((map, item) => {
    const country = item.country.trim()

    if (country && Array.isArray(item.cities)) {
      map[country] = withOtherOption(item.cities).filter((city) => city !== OTHER_OPTION)
    }

    return map
  }, { ...fallbackCountryCityMap })
}

const readCountryCityCache = () => {
  try {
    const rawCache = localStorage.getItem(COUNTRY_CITY_CACHE_KEY)
    if (!rawCache) return null

    const cache = JSON.parse(rawCache) as CachedCountryCityMap
    if (cache.expiresAt < Date.now()) return null

    return cache.data
  } catch {
    return null
  }
}

const writeCountryCityCache = (data: LocationCountryCityMap) => {
  try {
    localStorage.setItem(COUNTRY_CITY_CACHE_KEY, JSON.stringify({
      expiresAt: Date.now() + COUNTRY_CITY_CACHE_TTL,
      data,
    }))
  } catch {
    // Ignore storage errors; the API result can still be used for this session.
  }
}

const loadCountryCityOptions = async () => {
  const cachedData = readCountryCityCache()

  if (cachedData) {
    countryCityMap.value = {
      ...fallbackCountryCityMap,
      ...cachedData,
    }
    return
  }

  isLocationLoading.value = true
  locationLoadError.value = ''

  try {
    const response = await fetch(COUNTRY_CITY_ENDPOINT)

    if (!response.ok) {
      throw new Error(`CountriesNow request failed: ${response.status}`)
    }

    const payload = await response.json() as CountriesNowResponse

    if (payload.error || !Array.isArray(payload.data)) {
      throw new Error(payload.msg || 'Invalid CountriesNow response')
    }

    const nextCountryCityMap = normalizeCountryCityMap(payload.data)
    countryCityMap.value = nextCountryCityMap
    writeCountryCityCache(nextCountryCityMap)
  } catch (error) {
    locationLoadError.value = '國家城市資料載入失敗，暫用預設清單'
    console.warn(locationLoadError.value, error)
  } finally {
    isLocationLoading.value = false
  }
}

onMounted(() => {
  void loadCountryCityOptions()
})

const openCreateDialog = () => {
  editingTripId.value = null
  createDialog.value = true
}

const onTripCreated = (data: TripFormData) => {
  trips.value.unshift({
    id: Date.now(),
    name: data.name,
    days: getTripDays(data.startDate, data.endDate),
    startDate: data.startDate,
    endDate: data.endDate,
    country: toCountryValue(data.country),
    city: toCityValue(data.city),
    image: data.imagePreviewUrl || tripImg,
  })
}

const openEditDialog = (trip: Trip) => {
  editingTripId.value = trip.id
  createDialog.value = true
}

const onTripUpdated = (data: TripFormData) => {
  if (editingTripId.value === null) return

  const tripIndex = trips.value.findIndex((trip) => trip.id === editingTripId.value)
  if (tripIndex === -1) return

  const currentTrip = trips.value[tripIndex]
  trips.value[tripIndex] = {
    ...currentTrip,
    name: data.name,
    days: getTripDays(data.startDate, data.endDate),
    startDate: data.startDate,
    endDate: data.endDate,
    country: toCountryValue(data.country),
    city: toCityValue(data.city),
    image: data.imagePreviewUrl || tripImg,
  }
}

const getTripDays = (startDate: string, endDate: string) =>
  Math.max(
    Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1,
    0
  )

const router = useRouter()

const { trips } = useTrips()

const dialogMode = computed(() => editingTripId.value === null ? 'create' : 'edit')

const editingTripFormData = computed<TripFormData | null>(() => {
  if (editingTripId.value === null) return null

  const trip = trips.value.find((item) => item.id === editingTripId.value)
  if (!trip) return null

  return {
    name: trip.name,
    country: trip.country,
    city: getLocationLabel(trip.city),
    startDate: trip.startDate,
    endDate: trip.endDate,
    imageFile: [],
    imagePreviewUrl: trip.image,
  }
})

watch(createDialog, (open) => {
  if (!open) editingTripId.value = null
})

watch(selectedCountry, () => {
  if (normalizedSelectedCity.value && !cityOptions.value.some((city) => city.value === normalizedSelectedCity.value)) {
    selectedCity.value = null
  }
})

watch(selectedYear, () => {
  if (selectedMonth.value && !monthOptions.value.some((month) => month.value === selectedMonth.value)) {
    selectedMonth.value = null
  }
})

const filteredTrips = computed(() =>
  trips.value.filter((trip) => {
    const countryCandidates = countryOptions.value
      .map((country) => country.value)
      .filter((country) => country !== OTHER_OPTION)
    const cityCandidates = cityOptions.value
      .map((city) => city.value)
      .filter((city) => city !== OTHER_OPTION)
    const matchesCountry = !normalizedSelectedCountry.value ||
      (normalizedSelectedCountry.value === OTHER_OPTION
        ? !countryCandidates.includes(trip.country)
        : trip.country === normalizedSelectedCountry.value)
    const matchesCity = !normalizedSelectedCity.value ||
      (normalizedSelectedCity.value === OTHER_OPTION
        ? !cityCandidates.includes(trip.city)
        : trip.city === normalizedSelectedCity.value)

    const matchesDate = matchesSelectedDate(trip)

    return matchesCountry && matchesCity && matchesDate
  })
)

const goToJourney = (id: number) => {
  router.push({ name: 'book-detail', params: { id } })
}

const deleteTrip = (id: number) => {
  if (!confirm('確定要刪除嗎?')) return
  trips.value = trips.value.filter(t => t.id !== id)
}

const isEditing = ref(false)
</script>

<style scoped lang="scss">
@mixin breakpoint($point) {
  @media screen and (max-width: $point) {
    @content;
  }
}



.section {
  width: 80%;
  margin: 0 auto;
  @include breakpoint(960px) {
    width: 95% !important;
  }


  .top {
    position: fixed;
    top: 140px;
    width: 80%;
    @include breakpoint(960px) {
      width: 95% !important;
    }
    margin: 0 auto;
    left: 0;
    right: 0;
    z-index: 999;
    background-color: rgba(255, 127, 80, 0.151);

    &:hover {
      background-color: rgba(238, 63, 0, 0.233);
    }


    .country-select {
      max-width: 200px !important;
      @include breakpoint(960px) {
        max-width: 100% !important;
      }
    }
  }


}

.section:nth-child(2) {

  position: fixed;
  top: 230px;
  width: 80%;
  height: calc(100vh - 230px);
  margin: 0 auto;
  left: 0;
  right: 0;
  z-index: 999;
  @include breakpoint(960px) {
   top: 320px;
  }

  .list {
    height: 100% !important;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 5px !important;
    }
  }
}

.info {
  backdrop-filter: blur(3px);
  background-color: #000e24a2 !important;
  background: linear-gradient(135deg, #000E24 0%, rgba(0, 157, 230, 0.4) 100%);
  color: rgb(255, 153, 0);
  font-weight: bold;
  letter-spacing: 1px;
  box-shadow: 8px 8px 8px rgba(0, 0, 0, 0.705);
  border-radius: 16px;
  transition: all 0.3s ease;

  

  &:hover {
    background: linear-gradient(135deg, #000E24 0%, rgba(0, 157, 230, 0.7) 100%) !important;
    transition: all 0.3s ease;
    transform: translateY(-5px);
  }

  .item {
    cursor: pointer;
  }

  .title {
    font-size: 1rem;
    color: aliceblue;
    letter-spacing: 2px;
  }
  .delete {
    position: absolute;
    top: 8px;
    left: 0px;
    z-index: 999;
  }


}

.country-chip :deep(.v-chip__prepend) {
  margin-inline-end: 6px;
}

.country-flag {
  display: inline-block;
  width: 18px;
  border-radius: 2px;
  box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.12);
}

.edit {
  position: absolute;
  width: 95%;
  margin: 0 auto;
  left: 0;
  right: 0;
  z-index: 999;
}

.country-dropdown {
  .v-list {
    background: linear-gradient(160deg, #0d1a33 0%, #0a1628 100%) !important;
    border: 1px solid rgba(255, 165, 0, 0.25);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 16px rgba(255, 132, 0, 0.08);
    border-radius: 10px !important;

    .v-list-item {
      color: rgba(255, 255, 255, 0.85) !important;
      letter-spacing: 1px;

      &:hover,
      &--active {
        background: rgba(255, 140, 0, 0.15) !important;
        color: #ffb347 !important;
      }
    }
  }
}
</style>
