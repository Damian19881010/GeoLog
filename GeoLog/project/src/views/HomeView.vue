<template>
  <main class="home-page">
    <Transition name="toast-slide">
      <aside
        v-if="gamificationToastVisible"
        class="achievement-toast"
        role="status"
        aria-live="polite"
      >
        <span class="toast-spark toast-spark-one"></span>
        <span class="toast-spark toast-spark-two"></span>
        <span class="toast-spark toast-spark-three"></span>
        <span class="toast-spark toast-spark-four"></span>
        <div class="toast-mark">
          <v-icon size="18">mdi-star-four-points</v-icon>
        </div>
        <div class="toast-copy">
          <strong>LEVEL UP!</strong>
          <span>{{ toastMessage }}</span>
        </div>
        <button
          class="toast-close"
          type="button"
          aria-label="Close notification"
          @click="gamificationToastVisible = false"
        >
          <v-icon size="16">mdi-close</v-icon>
        </button>
      </aside>
    </Transition>

    <section class="hero-section">
      <div class="hero-copy">
        <p class="eyebrow">GeoLog Travel Studio</p>
        <h1>探索世界，整理每一段旅行軌跡</h1>
        <p class="hero-description">
          把景點、航班、租車與每日行程集中在同一個工作台，出發前就能看懂整趟旅程的節奏。
        </p>

        <div class="hero-actions">
          <v-btn
            class="primary-btn"
            rounded="pill"
            size="large"
            prepend-icon="mdi-notebook-plus-outline"
            :to="{ name: 'book' }"
          >
            建立旅程
          </v-btn>
          <v-btn
            class="outline-btn"
            rounded="pill"
            size="large"
            variant="outlined"
            prepend-icon="mdi-trophy-outline"
            href="#achievements"
          >
            查看成就
          </v-btn>
        </div>

        <div class="hero-stats" aria-label="GeoLog highlights">
          <div v-for="stat in heroStats" :key="stat.label">
            <strong>{{ stat.value }}</strong>
            <span>{{ stat.label }}</span>
          </div>
        </div>
      </div>

      <article class="feature-card">
        <div class="feature-image-wrap">
          <img :src="heroTrip.image" :alt="heroTrip.title" />
          <span class="live-chip">
            <v-icon size="15">mdi-map-marker-sparkles</v-icon>
            {{ heroTrip.badge }}
          </span>
        </div>
        <div class="feature-info">
          <div>
            <p>Next Journey</p>
            <h2>{{ heroTrip.title }}</h2>
          </div>
          <div class="feature-price">
            <span>{{ heroTrip.days }}</span>
            <strong>{{ heroTrip.stops }}</strong>
          </div>
        </div>
      </article>
    </section>

    <section class="tool-strip" aria-label="GeoLog travel tools">
      <span v-for="tool in travelTools" :key="tool">{{ tool }}</span>
    </section>

    <section id="world-map" class="content-section world-section">
      <div class="section-heading">
        <p>World map</p>
        <h2>旅程世界地圖</h2>
      </div>

      <div class="world-map-panel">
        <div class="world-map-toolbar">
          <div>
            <span class="map-kicker">Interactive route map</span>
            <h3>Visited Cities</h3>
          </div>

          <v-chip class="map-chip" prepend-icon="mdi-map-marker-radius" size="large">
            Leaflet
          </v-chip>
        </div>

        <div ref="worldMapRef" class="world-map-chart" aria-label="GeoLog world map"></div>

        <div class="map-summary">
          <div v-for="item in mapSummary" :key="item.label">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </div>
        </div>
      </div>
    </section>

    <section id="achievements" class="content-section gamification-section">
      <div class="section-heading">
        <p>Gamification</p>
        <h2>成就與等級系統</h2>
      </div>

      <div class="gamification-layout">
        <article class="level-card">
          <div
            class="level-avatar"
            :style="{ '--level-progress': `${levelInfo.progressPercent}%` }"
            aria-label="Current level"
          >
            <span>LV</span>
            <strong>{{ levelInfo.level }}</strong>
          </div>

          <div class="level-details">
            <span class="panel-label">目前階級</span>
            <h3>{{ currentRank }}</h3>
            <p>{{ currentPrivilege }}</p>

            <div class="level-progress">
              <span :style="{ width: `${levelInfo.progressPercent}%` }"></span>
            </div>

            <div class="level-meta">
              <span>{{ levelInfo.levelExp }} / {{ levelInfo.requiredExp }} EXP</span>
              <strong>距離下一級 {{ nextLevelRemaining }} EXP</strong>
            </div>
          </div>
        </article>

        <aside class="exp-panel">
          <div class="panel-topline">
            <span class="panel-label">EXP Actions</span>
            <strong>{{ playerTotalExp }} EXP</strong>
          </div>

          <ul class="exp-list">
            <li v-for="item in expActions" :key="item.action">
              <span>{{ item.action }}</span>
              <strong>{{ item.reward }}</strong>
            </li>
          </ul>

          <v-btn
            class="orange-action"
            rounded="pill"
            prepend-icon="mdi-trophy-award"
            @click="simulateAchievementUnlock"
          >
            模擬解鎖
          </v-btn>
        </aside>
      </div>

      <div class="achievement-toolbar">
        <div>
          <span class="panel-label">Achievement Matrix</span>
          <h3>{{ unlockedAchievementCount }} / {{ achievementCards.length }} 已解鎖</h3>
        </div>
        <div class="matrix-progress" aria-label="Achievement unlock progress">
          <span :style="{ width: `${unlockedAchievementPercent}%` }"></span>
        </div>
      </div>

      <div class="achievement-grid">
        <article
          v-for="achievement in achievementCards"
          :key="achievement.id"
          class="achievement-card"
          :class="{
            'is-unlocked': achievement.isUnlocked,
            'is-locked': !achievement.isUnlocked,
            'is-secret': achievement.isSecret && !achievement.isUnlocked,
          }"
        >
          <div class="achievement-icon">
            <v-icon size="26">
              {{ achievementIcon(achievement) }}
            </v-icon>
          </div>

          <div class="achievement-body">
            <div class="achievement-row">
              <span>{{ achievement.isSecret && !achievement.isUnlocked ? 'Secret' : achievement.category }}</span>
              <strong>{{ achievement.isUnlocked ? 'Unlocked' : 'Locked' }}</strong>
            </div>
            <h3>{{ achievementTitle(achievement) }}</h3>
            <p>{{ achievementDescription(achievement) }}</p>
          </div>

          <div v-if="achievement.unlockProgress" class="achievement-progress">
            <div>
              <span
                :style="{ width: `${achievementProgressPercent(achievement)}%` }"
              ></span>
            </div>
            <strong>
              {{ achievement.unlockProgress.current }} / {{ achievement.unlockProgress.target }}
            </strong>
          </div>
        </article>
      </div>
    </section>

    <section class="content-section">
      <div class="section-heading">
        <p>Popular this week</p>
        <h2>熱門旅程靈感</h2>
      </div>

      <div class="journey-row">
        <RouterLink
          v-for="journey in popularJourneys"
          :key="journey.title"
          class="journey-card"
          :to="{ name: 'book' }"
        >
          <img :src="journey.image" :alt="journey.title" />
          <div class="journey-meta">
            <div>
              <h3>{{ journey.title }}</h3>
              <p>{{ journey.subtitle }}</p>
            </div>
            <span>{{ journey.count }}</span>
          </div>
        </RouterLink>
      </div>
    </section>

    <section class="content-section compact-section">
      <div class="section-heading">
        <p>Top routes</p>
        <h2>近期行程</h2>
      </div>

      <div class="route-grid">
        <RouterLink
          v-for="route in topRoutes"
          :key="route.title"
          class="route-pill"
          :to="{ name: 'book' }"
        >
          <img :src="route.image" :alt="route.title" />
          <div>
            <h3>{{ route.title }}</h3>
            <p>{{ route.detail }}</p>
          </div>
        </RouterLink>
      </div>
    </section>

    <section class="content-section">
      <div class="section-heading">
        <p>Explore collections</p>
        <h2>探索旅行分類</h2>
      </div>

      <div class="collection-grid">
        <RouterLink
          v-for="collection in collections"
          :key="collection.title"
          class="collection-card"
          :to="{ name: 'book' }"
        >
          <div class="collection-mosaic">
            <img
              v-for="image in collection.images"
              :key="image"
              :src="image"
              :alt="collection.title"
            />
          </div>
          <div class="collection-footer">
            <span>{{ collection.title }}</span>
            <strong>{{ collection.items }}</strong>
          </div>
        </RouterLink>
      </div>
    </section>

    <section class="join-band">
      <h2>把下一段旅程整理成值得回看的 GeoLog</h2>
      <v-btn
        class="join-btn"
        rounded="pill"
        prepend-icon="mdi-arrow-right-circle"
        :to="{ name: 'book' }"
      >
        開始規劃
      </v-btn>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useLevel } from '@/composables/useLevel'
import type { AchievementCardProps } from '@/types/achievement'
import tripImage from '@/assets/images/trip.png'
import trip2Image from '@/assets/images/trip2.png'
import trip3Image from '@/assets/images/trip3.png'
import trip5Image from '@/assets/images/trip5.png'
import trip8Image from '@/assets/images/trip8.png'
import trip10Image from '@/assets/images/trip10.png'
import trip12Image from '@/assets/images/trip12.png'
import trip14Image from '@/assets/images/trip14.png'

type TravelMarker = {
  name: string
  city: string
  coord: [number, number]
  value: number
}

type AchievementCard = AchievementCardProps & {
  category: string
  expReward: number
}

const LEVEL_RANKS: Record<number, string> = {
  0: '菜鳥實習生',
  1: '週末逃跑計畫者',
  2: '城市漫遊者',
  3: '專業副駕駛',
  4: '行程主控官',
  5: '特級地圖拓荒客',
  10: '空間幾何探索家',
  20: '地理維度掌控者',
}

const ACHIEVEMENT_ICONS: Record<AchievementCardProps['iconType'], string> = {
  'minimal-pin': 'mdi-map-marker-radius-outline',
  'radar-ring': 'mdi-radar',
  'immigration-house': 'mdi-home-map-marker',
  'dot-globe': 'mdi-earth',
}

const worldMapRef = ref<HTMLDivElement | null>(null)
const playerTotalExp = ref(1240)
const gamificationToastVisible = ref(false)
const toastMessage = ref('菜鳥實習生 -> 城市漫遊者 (LV.2)')
const { levelInfo } = useLevel(playerTotalExp)
let worldMap: L.Map | null = null
let markerLayer: L.LayerGroup | null = null
let toastTimer: ReturnType<typeof setTimeout> | null = null

const heroTrip = {
  title: 'Tokyo Night Notes',
  badge: 'Live plan',
  days: '5 days',
  stops: '18 stops',
  image: trip12Image,
}

const heroStats = [
  { value: '27+', label: '景點收藏' },
  { value: '20+', label: '行程節點' },
  { value: '7+', label: '城市靈感' },
]

const travelTools = ['Maps', 'Flights', 'Car Rental', 'Daily Notes', 'Achievements', 'GeoLog']

const mapSummary = [
  { label: 'Cities', value: '06' },
  { label: 'Routes', value: '12' },
  { label: 'Notes', value: '39' },
]

const expActions = [
  { action: '建立第一個旅遊行程', reward: '+100 EXP' },
  { action: '新增一個景點停靠站', reward: '+10 EXP' },
  { action: 'Daily Notes 超過 50 字', reward: '+20 EXP' },
  { action: '解鎖進階成就', reward: '+500 EXP' },
]

const travelMarkers: TravelMarker[] = [
  { name: 'Tokyo Sprint', city: 'Tokyo', coord: [139.6917, 35.6895], value: 18 },
  { name: 'Island Blue', city: 'Cebu', coord: [123.8854, 10.3157], value: 14 },
  { name: 'Neon Broadway', city: 'New York', coord: [-74.006, 40.7128], value: 16 },
  { name: 'Kyoto Amber', city: 'Kyoto', coord: [135.7681, 35.0116], value: 12 },
  { name: 'Okinawa Loop', city: 'Naha', coord: [127.6792, 26.2124], value: 10 },
  { name: 'Gallery Weekend', city: 'Melbourne', coord: [144.9631, -37.8136], value: 11 },
]

const achievementCards = ref<AchievementCard[]>([
  {
    id: 'okinawa-traveler',
    title: '沖繩旅行家',
    description: '造訪沖繩 3 次，熟悉那霸機場國際線與國內線通道。',
    iconType: 'minimal-pin',
    isUnlocked: true,
    unlockProgress: { current: 3, target: 3 },
    isSecret: false,
    category: '深度足跡',
    expReward: 200,
  },
  {
    id: 'okinawa-master',
    title: '沖繩達人',
    description: '對名護、恩納到國際通的右駕路線熟門熟路。',
    iconType: 'minimal-pin',
    isUnlocked: false,
    unlockProgress: { current: 3, target: 5 },
    isSecret: false,
    category: '深度足跡',
    expReward: 500,
  },
  {
    id: 'shinjuku-survivor',
    title: '新宿迷宮生存者',
    description: '在新宿車站內轉乘超過 5 次，並且完全沒有迷路。',
    iconType: 'radar-ring',
    isUnlocked: false,
    unlockProgress: { current: 4, target: 6 },
    isSecret: false,
    category: '深度足跡',
    expReward: 500,
  },
  {
    id: 'magellan',
    title: '特級麥哲倫',
    description: '累積造訪超過 10 個不同國家。',
    iconType: 'dot-globe',
    isUnlocked: false,
    unlockProgress: { current: 7, target: 10 },
    isSecret: false,
    category: '地理制霸',
    expReward: 500,
  },
  {
    id: 'island-drifter',
    title: '島嶼漂流者',
    description: '累積造訪 3 個以上海島型度假勝地。',
    iconType: 'dot-globe',
    isUnlocked: true,
    unlockProgress: { current: 3, target: 3 },
    isSecret: false,
    category: '地理制霸',
    expReward: 500,
  },
  {
    id: 'time-manager',
    title: '特級時間管理大師',
    description: '單一工程內，景點移動時間精準計算到分鐘。',
    iconType: 'radar-ring',
    isUnlocked: false,
    unlockProgress: { current: 6, target: 10 },
    isSecret: false,
    category: '規劃流派',
    expReward: 500,
  },
  {
    id: 'marching-plan',
    title: '特戰兵行軍行程',
    description: '單日行程塞滿超過 10 個景點，且步行軌跡超過 2 萬步。',
    iconType: 'minimal-pin',
    isUnlocked: false,
    unlockProgress: { current: 8, target: 10 },
    isSecret: false,
    category: '規劃流派',
    expReward: 500,
  },
  {
    id: 'night-engineer',
    title: '爆肝工程師的浪漫',
    description: '連續 3 天在凌晨 3:00 至 5:00 之間編輯並儲存行程。',
    iconType: 'immigration-house',
    isUnlocked: false,
    isSecret: true,
    category: '隱藏彩蛋',
    expReward: 1000,
  },
])

const popularJourneys = [
  {
    title: 'Island Blue',
    subtitle: 'Cebu coast',
    count: '3 days',
    image: trip10Image,
  },
  {
    title: 'City Canvas',
    subtitle: 'Laneway walk',
    count: '48 stops',
    image: trip14Image,
  },
  {
    title: 'Neon Broadway',
    subtitle: 'New York route',
    count: '39 notes',
    image: trip12Image,
  },
  {
    title: 'Kyoto Amber',
    subtitle: 'Temple trail',
    count: '6 days',
    image: trip3Image,
  },
]

const topRoutes = [
  { title: 'Okinawa Loop', detail: '12 stops / 4 days', image: trip10Image },
  { title: 'Tokyo Sprint', detail: '18 stops / 5 days', image: trip12Image },
  { title: 'Kyoto Slow Walk', detail: '9 stops / 3 days', image: trip3Image },
  { title: 'Gallery Weekend', detail: '14 stops / 2 days', image: trip14Image },
  { title: 'Harbor Escape', detail: '8 stops / 2 days', image: trip2Image },
  { title: 'Mountain Light', detail: '11 stops / 3 days', image: trip8Image },
]

const collections = [
  {
    title: '城市散策',
    items: '30 items',
    images: [trip12Image, trip14Image, trip5Image],
  },
  {
    title: '海島假期',
    items: '45 items',
    images: [trip10Image, trip2Image, tripImage],
  },
  {
    title: '文化路線',
    items: '50 items',
    images: [trip3Image, trip8Image, trip14Image],
  },
]

const currentRank = computed(() => {
  return LEVEL_RANKS[levelInfo.value.level] ?? `LV.${levelInfo.value.level} 探索者`
})

const currentPrivilege = computed(() => {
  if (levelInfo.value.level >= 20) {
    return '頂級專屬外圈動態粒子發光特效已開放。'
  }

  if (levelInfo.value.level >= 10) {
    return '專屬幾何科技感地圖 Pin 針樣式已開放。'
  }

  if (levelInfo.value.level >= 5) {
    return '地圖自訂深色模式已開放。'
  }

  if (levelInfo.value.level >= 1) {
    return '頭像外圈已引進亮橘色邊框。'
  }

  return '完成首次核心操作即可快速升級。'
})

const nextLevelRemaining = computed(() => {
  return Math.max(levelInfo.value.requiredExp - levelInfo.value.levelExp, 0)
})

const unlockedAchievementCount = computed(() => {
  return achievementCards.value.filter((achievement) => achievement.isUnlocked).length
})

const unlockedAchievementPercent = computed(() => {
  return Math.round((unlockedAchievementCount.value / achievementCards.value.length) * 100)
})

const toLatLng = (marker: TravelMarker): L.LatLngExpression => [marker.coord[1], marker.coord[0]]

const createTravelIcon = (marker: TravelMarker) => {
  const color = marker.value >= 15 ? '#ff7a1a' : '#67d8ff'

  return L.divIcon({
    className: 'travel-marker-icon',
    html: `
      <span class="travel-marker-pulse" style="--marker-color:${color};"></span>
      <span class="travel-marker-core" style="--marker-color:${color};"></span>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18],
  })
}

const resizeWorldMap = () => {
  worldMap?.invalidateSize()
}

const initWorldMap = () => {
  if (!worldMapRef.value) {
    return
  }

  worldMap?.remove()
  worldMap = null

  const mapElement = worldMapRef.value as HTMLDivElement & { _leaflet_id?: number }
  mapElement.replaceChildren()
  delete mapElement._leaflet_id

  worldMap = L.map(mapElement, {
    zoomControl: false,
    attributionControl: true,
    worldCopyJump: true,
    minZoom: 2,
    maxZoom: 8,
    maxBounds: [
      [-82, -180],
      [82, 180],
    ],
    maxBoundsViscosity: 0.7,
  }).setView([22, 35], 2)

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(worldMap)

  L.control.zoom({ position: 'bottomright' }).addTo(worldMap)

  markerLayer = L.layerGroup().addTo(worldMap)

  travelMarkers.forEach((marker) => {
    const leafletMarker = L.marker(toLatLng(marker), {
      icon: createTravelIcon(marker),
      title: marker.city,
    })

    leafletMarker.bindTooltip(marker.city, {
      direction: 'top',
      offset: [0, -14],
      permanent: true,
      className: 'travel-marker-label',
    })

    leafletMarker.bindPopup(`
      <div class="travel-map-popup">
        <strong>${marker.name}</strong>
        <span>${marker.city} / ${marker.value} stops</span>
      </div>
    `)

    markerLayer?.addLayer(leafletMarker)
  })

  worldMap.fitBounds(L.latLngBounds(travelMarkers.map((marker) => toLatLng(marker))), {
    padding: [52, 52],
    maxZoom: 3,
  })

  setTimeout(resizeWorldMap, 80)
  setTimeout(resizeWorldMap, 280)
  window.addEventListener('resize', resizeWorldMap)
}

const triggerToast = (message: string) => {
  toastMessage.value = message
  gamificationToastVisible.value = true

  if (toastTimer) {
    clearTimeout(toastTimer)
  }

  toastTimer = setTimeout(() => {
    gamificationToastVisible.value = false
  }, 5200)
}

const simulateAchievementUnlock = () => {
  const targetAchievement =
    achievementCards.value.find((achievement) => !achievement.isUnlocked && !achievement.isSecret) ??
    achievementCards.value.find((achievement) => !achievement.isUnlocked)

  if (!targetAchievement) {
    triggerToast('所有展示成就都已解鎖')
    return
  }

  targetAchievement.isUnlocked = true

  if (targetAchievement.unlockProgress) {
    targetAchievement.unlockProgress.current = targetAchievement.unlockProgress.target
  }

  playerTotalExp.value += targetAchievement.expReward
  triggerToast(`${targetAchievement.title} 解鎖，+${targetAchievement.expReward} EXP`)
}

const achievementIcon = (achievement: AchievementCard) => {
  if (achievement.isSecret && !achievement.isUnlocked) {
    return 'mdi-lock-outline'
  }

  return ACHIEVEMENT_ICONS[achievement.iconType]
}

const achievementTitle = (achievement: AchievementCard) => {
  if (achievement.isSecret && !achievement.isUnlocked) {
    return '隱藏成就'
  }

  return achievement.title
}

const achievementDescription = (achievement: AchievementCard) => {
  if (achievement.isSecret && !achievement.isUnlocked) {
    return '達成前不顯示條件。'
  }

  return achievement.description
}

const achievementProgressPercent = (achievement: AchievementCard) => {
  const progress = achievement.unlockProgress

  if (!progress) {
    return achievement.isUnlocked ? 100 : 0
  }

  return Math.min(Math.round((progress.current / progress.target) * 100), 100)
}

onMounted(() => {
  void nextTick(initWorldMap)
  setTimeout(() => {
    triggerToast('菜鳥實習生 -> 城市漫遊者 (LV.2)')
  }, 650)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeWorldMap)

  if (toastTimer) {
    clearTimeout(toastTimer)
  }

  worldMap?.remove()
  worldMap = null
  markerLayer = null
})
</script>

<style scoped lang="scss">
@mixin breakpoint($point) {
  @media screen and (max-width: $point) {
    @content;
  }
}

.home-page {
  width: 100%;
  min-height: calc(100vh - 90px);
  overflow: hidden;
  padding: 54px 0 72px;
  background:
    linear-gradient(180deg, rgba(245, 251, 255, 0.05) 0%, rgba(245, 251, 255, 0) 42%),
    linear-gradient(135deg, #071426 0%, #0d263d 52%, #061322 100%);
  color: #f5fbff;
}

.hero-section,
.content-section,
.join-band {
  width: min(1120px, calc(100% - 40px));
  margin-inline: auto;
}

.hero-section {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 430px);
  align-items: center;
  gap: clamp(28px, 6vw, 72px);
  min-height: 600px;

  @include breakpoint(900px) {
    grid-template-columns: 1fr;
    min-height: auto;
  }
}

.hero-copy {
  max-width: 650px;
}

.eyebrow,
.section-heading p,
.panel-label {
  margin: 0;
  color: #8fdfff;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.8px;
  text-transform: uppercase;
}

h1 {
  max-width: 700px;
  margin: 18px 0 16px;
  color: #f5fbff;
  font-size: clamp(42px, 6vw, 78px);
  font-weight: 900;
  letter-spacing: 0;
  line-height: 1.02;
}

.hero-description {
  max-width: 560px;
  color: rgba(245, 251, 255, 0.72);
  font-size: 17px;
  line-height: 1.7;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}

.primary-btn,
.orange-action {
  background: #ff7a1a !important;
  color: #071426 !important;
  font-weight: 900;
  box-shadow: 0 16px 34px rgba(255, 122, 26, 0.24);
}

.outline-btn {
  border-color: rgba(245, 251, 255, 0.38) !important;
  background: rgba(245, 251, 255, 0.05) !important;
  color: #f5fbff !important;
}

.hero-stats {
  width: min(420px, 100%);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: 34px;
  overflow: hidden;
  border: 1px solid rgba(245, 251, 255, 0.2);
  border-radius: 8px;
  background: rgba(245, 251, 255, 0.08);
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.28);

  div {
    padding: 14px 16px;
    border-right: 1px solid rgba(245, 251, 255, 0.14);

    &:last-child {
      border-right: 0;
    }
  }

  strong,
  span {
    display: block;
  }

  strong {
    color: #ff7a1a;
    font-size: 24px;
    line-height: 1;
  }

  span {
    margin-top: 6px;
    color: rgba(245, 251, 255, 0.7);
    font-size: 12px;
  }
}

.feature-card {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(245, 251, 255, 0.2);
  border-radius: 8px;
  background: rgba(245, 251, 255, 0.08);
  box-shadow: 0 28px 70px rgba(0, 0, 0, 0.38);
}

.feature-image-wrap {
  position: relative;
  aspect-ratio: 4 / 5;
  min-height: 430px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    filter: saturate(1.12) contrast(1.04);
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 42%, rgba(7, 20, 38, 0.84) 100%);
  }
}

.live-chip {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid rgba(245, 251, 255, 0.24);
  border-radius: 999px;
  padding: 7px 11px;
  background: rgba(7, 20, 38, 0.72);
  color: #f5fbff;
  font-size: 12px;
  backdrop-filter: blur(10px);
}

.feature-info {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 18px;
  padding: 18px 20px 20px;
  background: linear-gradient(135deg, rgba(245, 251, 255, 0.12), rgba(255, 122, 26, 0.24));

  p {
    margin: 0 0 4px;
    color: rgba(245, 251, 255, 0.64);
    font-size: 12px;
  }

  h2 {
    margin: 0;
    color: #ffffff;
    font-size: 22px;
    letter-spacing: 0;
  }
}

.feature-price {
  text-align: right;

  span {
    display: block;
    color: rgba(245, 251, 255, 0.66);
    font-size: 12px;
  }

  strong {
    color: #ff7a1a;
    font-size: 18px;
  }
}

.tool-strip {
  display: flex;
  justify-content: center;
  gap: clamp(18px, 5vw, 56px);
  padding: 18px 24px;
  border-top: 1px solid rgba(245, 251, 255, 0.12);
  border-bottom: 1px solid rgba(245, 251, 255, 0.12);
  background: rgba(245, 251, 255, 0.08);
  color: rgba(245, 251, 255, 0.78);
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0;
  white-space: nowrap;
  overflow-x: auto;
}

.content-section {
  margin-top: 76px;
}

.compact-section {
  margin-top: 62px;
}

.section-heading {
  margin-bottom: 22px;
  text-align: center;

  h2 {
    margin: 8px 0 0;
    color: #f5fbff;
    font-size: clamp(28px, 4vw, 38px);
    font-weight: 900;
    letter-spacing: 0;
  }
}

.world-section,
.gamification-section {
  scroll-margin-top: 110px;
}

.world-map-panel {
  position: relative;
  overflow: hidden;
  height: clamp(560px, 52vw, 680px);
  min-height: 560px;
  border: 1px solid rgba(143, 223, 255, 0.22);
  border-radius: 8px;
  background:
    linear-gradient(rgba(143, 223, 255, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(143, 223, 255, 0.08) 1px, transparent 1px),
    linear-gradient(180deg, rgba(13, 34, 56, 0.96), rgba(5, 12, 26, 0.98));
  background-size: 22px 22px, 22px 22px, 100% 100%;
  box-shadow: 0 26px 72px rgba(0, 0, 0, 0.42);
}

.world-map-toolbar,
.map-summary {
  position: relative;
  z-index: 2;
}

.world-map-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 22px 24px 0;

  h3 {
    margin: 4px 0 0;
    color: #ffffff;
    font-size: 22px;
    letter-spacing: 0;
  }
}

.map-kicker {
  color: rgba(143, 223, 255, 0.78);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.6px;
  text-transform: uppercase;
}

.map-chip {
  background: #ff7a1a !important;
  color: #071426 !important;
  font-weight: 900;
}

.world-map-chart {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: inherit;
  background: #071426;
  box-shadow: inset 0 0 0 1px rgba(143, 223, 255, 0.08);
}

:deep(.leaflet-container) {
  width: 100%;
  height: 100%;
  background: #071426;
  color: rgba(255, 255, 255, 0.86);
  font: inherit;
}

:deep(.leaflet-tile) {
  filter: saturate(0.88) contrast(1.08);
}

:deep(.leaflet-control-attribution) {
  background: rgba(5, 10, 28, 0.72);
  color: rgba(255, 255, 255, 0.62);
  font-size: 10px;
  backdrop-filter: blur(8px);

  a {
    color: #8fdfff;
  }
}

:deep(.leaflet-control-zoom) {
  overflow: hidden;
  border: 1px solid rgba(143, 223, 255, 0.22);
  border-radius: 8px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.28);

  a {
    width: 34px;
    height: 34px;
    border: 0;
    background: rgba(6, 15, 33, 0.9);
    color: #ffffff;
    line-height: 34px;

    &:hover {
      background: rgba(255, 122, 26, 0.9);
      color: #071426;
    }
  }
}

:deep(.travel-marker-icon) {
  background: transparent;
  border: 0;
}

:deep(.travel-marker-pulse),
:deep(.travel-marker-core) {
  position: absolute;
  inset: 50% auto auto 50%;
  display: block;
  border-radius: 999px;
  transform: translate(-50%, -50%);
}

:deep(.travel-marker-pulse) {
  width: 34px;
  height: 34px;
  border: 1px solid var(--marker-color);
  box-shadow: 0 0 20px var(--marker-color);
  opacity: 0.72;
  animation: markerPulse 1.9s ease-out infinite;
}

:deep(.travel-marker-core) {
  width: 13px;
  height: 13px;
  border: 2px solid rgba(255, 255, 255, 0.9);
  background: var(--marker-color);
  box-shadow:
    0 0 16px var(--marker-color),
    0 0 0 5px rgba(255, 122, 26, 0.14);
}

:deep(.travel-marker-label) {
  border: 0;
  border-radius: 999px;
  padding: 3px 8px;
  background: rgba(6, 15, 33, 0.72);
  color: rgba(255, 255, 255, 0.86);
  box-shadow: none;
  font-size: 11px;
  font-weight: 700;
  backdrop-filter: blur(8px);

  &::before {
    display: none;
  }
}

:deep(.leaflet-popup-content-wrapper),
:deep(.leaflet-popup-tip) {
  background: rgba(5, 10, 28, 0.94);
  color: #ffffff;
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.4);
}

:deep(.travel-map-popup) {
  display: grid;
  gap: 4px;
  min-width: 150px;

  strong {
    color: #ffffff;
    font-size: 13px;
  }

  span {
    color: rgba(255, 255, 255, 0.64);
    font-size: 12px;
  }
}

@keyframes markerPulse {
  0% {
    opacity: 0.82;
    transform: translate(-50%, -50%) scale(0.55);
  }

  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.65);
  }
}

.map-summary {
  position: absolute;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  width: min(460px, calc(100% - 48px));
  overflow: hidden;
  border: 1px solid rgba(143, 223, 255, 0.2);
  border-radius: 8px;
  background: rgba(4, 10, 25, 0.68);
  backdrop-filter: blur(12px);

  div {
    padding: 13px 16px;
    background: rgba(245, 251, 255, 0.05);
    text-align: center;
  }

  span,
  strong {
    display: block;
  }

  span {
    color: rgba(245, 251, 255, 0.58);
    font-size: 12px;
  }

  strong {
    margin-top: 4px;
    color: #ffffff;
    font-size: 20px;
  }
}

.gamification-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.65fr);
  gap: 18px;

  @include breakpoint(920px) {
    grid-template-columns: 1fr;
  }
}

.level-card,
.exp-panel,
.achievement-card {
  border: 1px solid rgba(245, 251, 255, 0.16);
  border-radius: 8px;
  background: rgba(245, 251, 255, 0.94);
  color: #071426;
  box-shadow: 0 22px 54px rgba(0, 0, 0, 0.22);
}

.level-card {
  display: grid;
  grid-template-columns: 150px minmax(0, 1fr);
  align-items: center;
  gap: 24px;
  min-height: 260px;
  padding: clamp(22px, 4vw, 34px);
  background:
    linear-gradient(135deg, rgba(255, 122, 26, 0.12), rgba(245, 251, 255, 0) 46%),
    #f5fbff;

  @include breakpoint(640px) {
    grid-template-columns: 1fr;
  }
}

.level-avatar {
  --level-progress: 0%;
  position: relative;
  width: 142px;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  justify-self: center;
  border-radius: 999px;
  background: conic-gradient(#ff7a1a var(--level-progress), rgba(7, 20, 38, 0.14) 0);

  &::before {
    content: "";
    position: absolute;
    inset: 10px;
    border-radius: inherit;
    background: #071426;
  }

  span,
  strong {
    position: relative;
    z-index: 1;
    color: #f5fbff;
  }

  span {
    align-self: end;
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 1.2px;
  }

  strong {
    align-self: start;
    font-size: 48px;
    line-height: 0.95;
  }
}

.level-details {
  min-width: 0;

  h3 {
    margin: 8px 0 8px;
    color: #071426;
    font-size: clamp(26px, 4vw, 38px);
    line-height: 1.15;
    letter-spacing: 0;
  }

  p {
    max-width: 560px;
    margin: 0;
    color: rgba(7, 20, 38, 0.68);
    font-size: 15px;
    line-height: 1.65;
  }
}

.level-progress,
.matrix-progress {
  height: 10px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(7, 20, 38, 0.12);

  span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, #ff7a1a, #ffb05c);
    box-shadow: 0 0 18px rgba(255, 122, 26, 0.45);
  }
}

.level-progress {
  margin-top: 20px;
}

.level-meta {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 10px;
  color: rgba(7, 20, 38, 0.62);
  font-size: 12px;

  strong {
    color: #071426;
  }

  @include breakpoint(560px) {
    flex-direction: column;
    gap: 4px;
  }
}

.exp-panel {
  display: grid;
  gap: 18px;
  align-content: start;
  padding: 24px;
}

.panel-topline,
.achievement-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.panel-topline strong {
  color: #ff7a1a;
  font-size: 24px;
}

.exp-list {
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(7, 20, 38, 0.1);
    color: rgba(7, 20, 38, 0.72);
    font-size: 13px;
  }

  strong {
    flex: 0 0 auto;
    color: #071426;
  }
}

.achievement-toolbar {
  margin: 28px 0 16px;

  h3 {
    margin: 6px 0 0;
    font-size: 20px;
    color: #f5fbff;
  }

  .matrix-progress {
    width: min(280px, 42vw);
    background: rgba(245, 251, 255, 0.16);
  }

  @include breakpoint(640px) {
    align-items: flex-start;
    flex-direction: column;

    .matrix-progress {
      width: 100%;
    }
  }
}

.achievement-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;

  @include breakpoint(980px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @include breakpoint(420px) {
    grid-template-columns: 1fr;
  }
}

.achievement-card {
  min-height: 244px;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 16px;
  padding: 18px;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(255, 122, 26, 0.8);
    box-shadow: 0 18px 42px rgba(255, 122, 26, 0.16);
  }

  &.is-locked {
    opacity: 0.46;

    .achievement-icon,
    .achievement-body,
    .achievement-progress {
      filter: grayscale(100%);
    }

    &:hover {
      opacity: 0.72;
    }
  }

  &.is-unlocked {
    border-color: rgba(255, 122, 26, 0.5);
  }
}

.achievement-icon {
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: #071426;
  color: #ff7a1a;
}

.achievement-body {
  min-width: 0;

  h3 {
    margin: 10px 0 8px;
    color: #071426;
    font-size: 18px;
    line-height: 1.25;
    letter-spacing: 0;
  }

  p {
    margin: 0;
    color: rgba(7, 20, 38, 0.66);
    font-size: 13px;
    line-height: 1.62;
  }
}

.achievement-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: rgba(7, 20, 38, 0.52);
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;

  span,
  strong {
    min-width: 0;
  }

  strong {
    flex: 0 0 auto;
    color: #ff7a1a;
  }
}

.achievement-progress {
  display: grid;
  gap: 7px;

  div {
    height: 7px;
    overflow: hidden;
    border-radius: 999px;
    background: rgba(7, 20, 38, 0.12);
  }

  span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: #ff7a1a;
  }

  strong {
    color: rgba(7, 20, 38, 0.62);
    font-size: 11px;
    text-align: right;
  }
}

.achievement-toast {
  position: fixed;
  top: 22px;
  right: 22px;
  z-index: 80;
  width: min(390px, calc(100vw - 32px));
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 14px;
  overflow: hidden;
  border: 1px solid rgba(255, 122, 26, 0.45);
  border-radius: 8px;
  padding: 14px;
  background: rgba(7, 20, 38, 0.9);
  color: #f5fbff;
  box-shadow:
    0 22px 54px rgba(0, 0, 0, 0.34),
    0 0 34px rgba(255, 122, 26, 0.2);
  backdrop-filter: blur(16px);
}

.toast-mark {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: rgba(255, 122, 26, 0.16);
  color: #ff7a1a;
}

.toast-copy {
  min-width: 0;

  strong,
  span {
    display: block;
  }

  strong {
    color: #ff7a1a;
    font-size: 13px;
    letter-spacing: 1.4px;
  }

  span {
    margin-top: 3px;
    color: rgba(245, 251, 255, 0.78);
    font-size: 13px;
  }
}

.toast-close {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 8px;
  background: rgba(245, 251, 255, 0.1);
  color: #f5fbff;
  cursor: pointer;
}

.toast-spark {
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 999px;
  background: #ff7a1a;
  box-shadow: 0 0 14px rgba(255, 122, 26, 0.82);
  animation: toastSpark 1.8s ease-in-out infinite;
}

.toast-spark-one {
  top: 12px;
  left: 16px;
}

.toast-spark-two {
  right: 44px;
  top: 18px;
  animation-delay: 0.25s;
}

.toast-spark-three {
  right: 78px;
  bottom: 16px;
  animation-delay: 0.45s;
}

.toast-spark-four {
  left: 58px;
  bottom: 12px;
  animation-delay: 0.7s;
}

@keyframes toastSpark {
  0%,
  100% {
    opacity: 0.24;
    transform: translateY(0) scale(0.7);
  }

  50% {
    opacity: 1;
    transform: translateY(-5px) scale(1);
  }
}

.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: opacity 0.24s ease, transform 0.24s ease;
}

.toast-slide-enter-from,
.toast-slide-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

.journey-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;

  @include breakpoint(980px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @include breakpoint(560px) {
    grid-template-columns: 1fr;
  }
}

.journey-card,
.collection-card,
.route-pill {
  color: inherit;
  text-decoration: none;
}

.journey-card {
  min-height: 310px;
  overflow: hidden;
  border: 1px solid rgba(245, 251, 255, 0.18);
  border-radius: 8px;
  background: rgba(245, 251, 255, 0.08);
  transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease;

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(255, 122, 26, 0.7);
    box-shadow: 0 18px 44px rgba(255, 122, 26, 0.15);
  }

  img {
    width: 100%;
    height: 230px;
    display: block;
    object-fit: cover;
  }
}

.journey-meta {
  min-height: 80px;
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 14px;
  padding: 14px;
  background: linear-gradient(135deg, rgba(245, 251, 255, 0.1), rgba(255, 122, 26, 0.22));

  h3,
  p {
    margin: 0;
  }

  h3 {
    color: #ffffff;
    font-size: 17px;
    line-height: 1.15;
  }

  p,
  span {
    color: rgba(245, 251, 255, 0.68);
    font-size: 12px;
  }

  span {
    flex: 0 0 auto;
    font-weight: 800;
  }
}

.route-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  @include breakpoint(840px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @include breakpoint(560px) {
    grid-template-columns: 1fr;
  }
}

.route-pill {
  display: grid;
  grid-template-columns: 54px minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  min-height: 72px;
  padding: 9px 12px;
  border: 1px solid rgba(245, 251, 255, 0.18);
  border-radius: 8px;
  background: rgba(245, 251, 255, 0.08);

  img {
    width: 54px;
    height: 54px;
    display: block;
    border-radius: 8px;
    object-fit: cover;
  }

  h3,
  p {
    margin: 0;
  }

  h3 {
    color: #ffffff;
    font-size: 14px;
  }

  p {
    color: rgba(245, 251, 255, 0.58);
    font-size: 12px;
  }
}

.collection-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;

  @include breakpoint(860px) {
    grid-template-columns: 1fr;
  }
}

.collection-card {
  overflow: hidden;
  border: 1px solid rgba(245, 251, 255, 0.18);
  border-radius: 8px;
  background: rgba(245, 251, 255, 0.08);
}

.collection-mosaic {
  display: grid;
  grid-template-columns: 1.25fr 0.8fr;
  grid-template-rows: repeat(2, 94px);
  gap: 4px;
  padding: 8px;

  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    border-radius: 6px;

    &:first-child {
      grid-row: 1 / 3;
    }
  }
}

.collection-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 13px 13px;
  background: rgba(245, 251, 255, 0.08);

  span,
  strong {
    color: #ffffff;
    font-size: 13px;
  }

  strong {
    color: #ff7a1a;
  }
}

.join-band {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 18px;
  margin-top: 78px;
  padding: 34px clamp(22px, 6vw, 72px);
  border: 1px solid rgba(255, 122, 26, 0.34);
  border-radius: 8px 8px 72px 8px;
  background: linear-gradient(115deg, rgba(245, 251, 255, 0.96), rgba(255, 122, 26, 0.82));

  h2 {
    max-width: 650px;
    margin: 0;
    color: #071426;
    font-size: clamp(24px, 4vw, 34px);
    font-weight: 900;
    line-height: 1.18;
    letter-spacing: 0;
  }

  @include breakpoint(720px) {
    grid-template-columns: 1fr;
    border-radius: 8px 8px 52px 8px;
  }
}

.join-btn {
  width: fit-content;
  background: #071426 !important;
  color: #f5fbff !important;
}

@include breakpoint(600px) {
  .home-page {
    padding-top: 34px;
  }

  .hero-section,
  .content-section,
  .join-band {
    width: min(100% - 28px, 1120px);
  }

  .feature-image-wrap {
    min-height: 360px;
  }

  .hero-stats,
  .map-summary {
    grid-template-columns: 1fr;

    div {
      border-right: 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.14);

      &:last-child {
        border-bottom: 0;
      }
    }
  }

  .world-map-panel {
    height: 470px;
    min-height: 470px;
  }

  .world-map-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .achievement-toast {
    top: 14px;
    right: 14px;
  }
}
</style>
