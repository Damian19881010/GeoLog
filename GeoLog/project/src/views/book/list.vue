<template>
  <v-container class="pa-0 container" fluid>
    <!-- 新增旅程 / 旅程列表 / 快速過濾 -->
    <section class="section">
      <v-card
        class="top add pa-5 border border-dashed border-orange21 border-opacity-100 d-flex justify-center align-center rounded-lg ga-2 flex-wrap"
        color="transparent">
        <!-- 快速過濾 -->
        <v-select v-model="selectedCountry" class="text-white country-select w-100" :items="countryOptions"
          variant="outlined" density="compact" hide-details="auto" max-width="200" theme="dark"
          clearable
          :menu-props="{ contentClass: 'country-dropdown' }">
          <template #label>
            <div class="d-flex align-center ga-2">
              <v-icon icon="mdi-map-marker" color="white"></v-icon>
              <span class="text-orange21">國家</span>
            </div>
          </template>
        </v-select>
        <v-select v-model="selectedCity" class="text-white country-select w-100" :items="cityOptions"
          variant="outlined" density="compact" hide-details="auto" max-width="200" theme="dark"
          clearable
          :menu-props="{ contentClass: 'country-dropdown' }">
          <template #label>
            <div class="d-flex align-center ga-2">
              <v-icon icon="mdi-map-marker" color="white"></v-icon>
              <span class="text-orange21">城市</span>
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
            <v-card class="info w-100 h-100">
              <div class="delete px-5 ga-2 d-flex justify-space-between w-100 "  v-if="isEditing">
                <v-btn 
                  size="small" 
                  color="orange" 
                  prepend-icon="mdi-delete"
                  text="刪除" 
                  @click="deleteTrip(item.id)">
                </v-btn>
                <v-btn class="opacity-80" append-icon="mdi-share" color="black" size="small" text="分享共編"></v-btn>
              </div>
              <!-- 圖片 -->
              <div class="image-container pa-0" style="max-height: 200px; overflow: hidden;">
                <v-img :src="item.image" max-width="100%" height="100%"></v-img>
              </div>
              
              <!-- 文字 -->
              <v-card-item class="item"  @click="goToJourney(item.id)">
                <div class="d-flex ga-2 align-center w-100">
                  <v-chip v-if="item.country !== ''" size="x-small" label color="white">{{ item.country }}</v-chip>
                  <v-chip v-if="item.city !== ''" size="x-small" color="yellow" prepend-icon="mdi-map-marker-radius">{{ item.city }}</v-chip>
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

    <Creat v-model="createDialog" @create="onTripCreated" />
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import tripImg from '@/assets/images/trip.png'
import trip2 from '@/assets/images/trip2.png'
import trip3 from '@/assets/images/trip3.png'
import trip4 from '@/assets/images/trip4.png'
import trip5 from '@/assets/images/trip5.png'
import Creat from './components/creat.vue'
import type { TripFormData } from './components/creat.vue'

const createDialog = ref(false)
const selectedCountry = ref<string | null>(null)
const selectedCity = ref<string | null>(null)

const countryOptions = ['日本', '韓國', '泰國', '越南', '新加坡', '馬來西亞', '菲律賓', '印尼', '其他']
const cityOptionsByCountry: Record<string, string[]> = {
  日本: ['沖繩', '大阪', '京都', '東京', '其他'],
  韓國: ['首爾', '釜山', '濟州', '其他'],
  泰國: ['曼谷', '清邁', '普吉', '其他'],
  越南: ['河內', '峴港', '胡志明', '其他'],
  新加坡: ['新加坡', '其他'],
  馬來西亞: ['吉隆坡', '檳城', '亞庇', '其他'],
  菲律賓: ['馬尼拉', '宿霧', '長灘島', '其他'],
  印尼: ['峇里島', '雅加達', '其他'],
  其他: ['其他'],
}

const cityOptions = computed(() => {
  if (!selectedCountry.value) return ['沖繩', '大阪', '京都', '東京', '其他']
  return cityOptionsByCountry[selectedCountry.value] ?? ['其他']
})

const openCreateDialog = () => {
  createDialog.value = true
}

const onTripCreated = (data: TripFormData) => {
  const days = Math.ceil(
    (new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) / (1000 * 60 * 60 * 24)
  ) + 1

  trips.value.unshift({
    id: Date.now(),
    name: data.name,
    days,
    startDate: data.startDate,
    endDate: data.endDate,
    country: data.country,
    city: data.city,
    image: data.imagePreviewUrl || tripImg,
  })
}

const router = useRouter()

const trips = ref([
  {
    id: 1,
    name: '沖繩5天4夜自由行-範例',
    days: 5,
    startDate: '2022-01-01',
    endDate: '2022-01-03',
    country: '日本',
    city: '沖繩',
    image: tripImg
  },
  {
    id: 2,
    name: '沖繩3天2夜',
    days: 3,
    startDate: '2026-08-01',
    endDate: '2026-08-08',
    country: '日本',
    city:'沖繩',
    image: trip2
  },
  {
    id: 3,
    name: '大阪京都自由行',
    days: 7,
    startDate: '2026-08-01',
    endDate: '2026-08-07',
    country: '日本',
    city:'大阪',
    image: trip3
  },
  {
    id: 4,
    name: '法蘭克福自由行',
    days: 7,
    startDate: '2026-08-01',
    endDate: '2026-08-07',
    country: '德國',
    city:'法蘭克福',
    image: trip4
  },
   {
    id: 5,
    name: '台北自由行',
    days: 7,
    startDate: '2026-08-01',
    endDate: '2026-08-07',
    country: '台灣',
    city:'台北',
    image: trip5
  },
])

watch(selectedCountry, () => {
  if (selectedCity.value && !cityOptions.value.includes(selectedCity.value)) {
    selectedCity.value = null
  }
})

const filteredTrips = computed(() =>
  trips.value.filter((trip) => {
    const countryCandidates = countryOptions.filter((country) => country !== '其他')
    const cityCandidates = cityOptions.value.filter((city) => city !== '其他')
    const matchesCountry = !selectedCountry.value ||
      (selectedCountry.value === '其他'
        ? !countryCandidates.includes(trip.country)
        : trip.country === selectedCountry.value)
    const matchesCity = !selectedCity.value ||
      (selectedCity.value === '其他'
        ? !cityCandidates.includes(trip.city)
        : trip.city === selectedCity.value)

    return matchesCountry && matchesCity
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
