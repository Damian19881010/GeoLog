<template>
  <main class="guide-page">
    <section class="guide-hero" :style="{ backgroundImage: `url(${heroImage})` }">
      <div class="hero-shade"></div>

      <div class="hero-content">
        <v-chip class="hero-chip" color="white" variant="flat" prepend-icon="mdi-map-marker-path">
          Travel workspace
        </v-chip>

        <h1>GeoLog</h1>
        <p class="hero-copy">
          把旅程、日期、地點與移動節奏集中在同一個入口，出發前先把每一天排得清清楚楚。
        </p>

        <div class="hero-actions">
          <v-btn
            class="primary-action"
            color="orange-darken-2"
            size="large"
            rounded="pill"
            prepend-icon="mdi-notebook-plus-outline"
            :to="{ name: 'book' }"
          >
            進入行程
          </v-btn>

          <v-btn
            class="secondary-action"
            color="white"
            size="large"
            rounded="pill"
            variant="tonal"
            prepend-icon="mdi-compass-outline"
            :to="{ name: 'book' }"
          >
            瀏覽旅程
          </v-btn>
        </div>
      </div>

      <div class="hero-panel d-none">
        <div class="panel-header">
          <div>
            <p class="panel-kicker">Current route</p>
            <h2>沖繩 5 日</h2>
          </div>
          <v-icon color="orange-lighten-2" size="32">mdi-airplane-takeoff</v-icon>
        </div>

        <div class="route-line">
          <span v-for="stop in routeStops" :key="stop"></span>
        </div>

        <div class="route-stops">
          <p v-for="stop in routeStops" :key="stop">{{ stop }}</p>
        </div>
      </div>
    </section>

    <section class="guide-content">
      <div class="section-heading">
        <p>Start here</p>
        <h2>今天要去哪裡？</h2>
      </div>

      <div class="quick-grid">
        <RouterLink
          v-for="item in quickLinks"
          :key="item.title"
          class="quick-card"
          :to="item.to"
        >
          <v-icon :color="item.color" size="30">{{ item.icon }}</v-icon>
          <div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.text }}</p>
          </div>
          <v-icon class="quick-arrow" color="white">mdi-arrow-right</v-icon>
        </RouterLink>
      </div>

      <div class="overview-grid">
        <article class="timeline-panel">
          <div class="section-heading compact">
            <p>Next steps</p>
            <h2>行程節奏</h2>
          </div>

          <div class="timeline-list">
            <div v-for="item in timelineItems" :key="item.time" class="timeline-row">
              <span>{{ item.time }}</span>
              <div>
                <h3>{{ item.title }}</h3>
                <p>{{ item.place }}</p>
              </div>
            </div>
          </div>
        </article>

        <article class="summary-panel">
          <div class="summary-item">
            <v-icon color="cyan-lighten-2">mdi-calendar-range</v-icon>
            <div>
              <p>旅程天數</p>
              <strong>5 days</strong>
            </div>
          </div>

          <div class="summary-item">
            <v-icon color="orange-lighten-2">mdi-map-marker-radius</v-icon>
            <div>
              <p>規劃地點</p>
              <strong>18 stops</strong>
            </div>
          </div>

          <div class="summary-item">
            <v-icon color="green-lighten-2">mdi-check-circle-outline</v-icon>
            <div>
              <p>準備狀態</p>
              <strong>Ready</strong>
            </div>
          </div>

          <v-btn
            block
            class="summary-action"
            color="orange-darken-2"
            rounded="pill"
            prepend-icon="mdi-arrow-right-circle"
            :to="{ name: 'book' }"
          >
            打開旅程列表
          </v-btn>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import heroImage from '@/assets/images/trip12.png'

const routeStops = ['機場', '租車', 'PARCO', '飯店']

const quickLinks = [
  {
    title: '旅程列表',
    text: '查看已建立的旅程與日期篩選。',
    icon: 'mdi-notebook-multiple',
    color: 'orange-lighten-2',
    to: { name: 'book' },
  },
  {
    title: '每日行程',
    text: '進入行程後整理時間、地點與備註。',
    icon: 'mdi-timeline-clock-outline',
    color: 'cyan-lighten-2',
    to: { name: 'book' },
  },
  {
    title: '地圖視角',
    text: '用地點與路線掌握當天移動感。',
    icon: 'mdi-map-search-outline',
    color: 'green-lighten-2',
    to: { name: 'book' },
  },
]

const timelineItems = [
  {
    time: '09:45',
    title: '抵達沖繩',
    place: 'Naha Airport',
  },
  {
    time: '13:30',
    title: '取車與補給',
    place: 'OTS / PARCO City',
  },
  {
    time: '20:30',
    title: '入住飯店',
    place: 'Nest Hotel Naha Nishi',
  },
]
</script>

<style scoped lang="scss">
@mixin breakpoint($point) {
  @media screen and (max-width: $point) {
    @content;
  }
}

.guide-page {
  width: 100%;
  min-height: calc(100vh - 90px);
  color: rgba(255, 255, 255, 0.92);
}

.guide-hero {
  position: relative;
  min-height: 520px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  align-items: end;
  gap: 32px;
  overflow: hidden;
  padding: 96px clamp(20px, 6vw, 84px) 54px;
  background-position: center;
  background-size: cover;

  @include breakpoint(960px) {
    min-height: auto;
    grid-template-columns: 1fr;
    padding-top: 72px;
  }
}

.hero-shade {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(0, 2, 16, 0.88) 0%, rgba(0, 8, 24, 0.58) 48%, rgba(243, 94, 7, 0.42) 100%),
    linear-gradient(0deg, rgba(0, 6, 7, 0.98) 0%, rgba(0, 0, 0, 0) 48%);
}

.hero-content,
.hero-panel {
  position: relative;
  z-index: 1;
}

.hero-content {
  max-width: 720px;
}

.hero-chip {
  color: #06121f !important;
  font-weight: 700;
  margin-bottom: 20px;
}

h1 {
  font-size: clamp(48px, 8vw, 96px);
  line-height: 0.95;
  font-weight: 900;
  letter-spacing: 0;
  margin: 0 0 18px;
  color: #ffffff;
}

.hero-copy {
  max-width: 620px;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.82);

  @include breakpoint(600px) {
    font-size: 16px;
  }
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 30px;
}

.primary-action {
  box-shadow: 0 14px 34px rgba(255, 111, 0, 0.28);
}

.secondary-action {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.hero-panel,
.timeline-panel,
.summary-panel,
.quick-card {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(4, 14, 31, 0.72);
  backdrop-filter: blur(14px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.28);
}

.hero-panel {
  width: 100%;
  border-radius: 8px;
  padding: 22px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.panel-kicker {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1.6px;
  color: rgba(255, 255, 255, 0.52);
}

.panel-header h2,
.section-heading h2,
.quick-card h3,
.timeline-row h3 {
  letter-spacing: 0;
}

.panel-header h2 {
  font-size: 26px;
  margin: 3px 0 0;
}

.route-line {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  align-items: center;
  gap: 8px;
  margin: 28px 0 16px;

  span {
    height: 6px;
    border-radius: 999px;
    background: linear-gradient(90deg, #ff8a00, #42d6ff);
  }
}

.route-stops {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;

  p {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.72);
  }
}

.guide-content {
  width: min(1120px, calc(100% - 40px));
  margin: -22px auto 0;
  position: relative;
  z-index: 2;
  padding-bottom: 56px;
}

.section-heading {
  margin-bottom: 18px;

  p {
    color: #ffb45f;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 1.8px;
    text-transform: uppercase;
  }

  h2 {
    color: #ffffff;
    font-size: 28px;
    margin: 4px 0 0;
  }
}

.section-heading.compact {
  margin-bottom: 16px;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;

  @include breakpoint(860px) {
    grid-template-columns: 1fr;
  }
}

.quick-card {
  min-height: 116px;
  border-radius: 8px;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 14px;
  align-items: center;
  padding: 18px;
  color: inherit;
  text-decoration: none;
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    border-color: rgba(255, 179, 95, 0.44);
    background: rgba(8, 24, 48, 0.86);
  }

  h3 {
    font-size: 17px;
    margin: 0 0 3px;
  }

  p {
    color: rgba(255, 255, 255, 0.62);
    font-size: 13px;
  }
}

.quick-arrow {
  opacity: 0.58;
}

.overview-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 18px;
  margin-top: 18px;

  @include breakpoint(900px) {
    grid-template-columns: 1fr;
  }
}

.timeline-panel,
.summary-panel {
  border-radius: 8px;
  padding: 22px;
}

.timeline-list {
  display: grid;
  gap: 14px;
}

.timeline-row {
  display: grid;
  grid-template-columns: 74px minmax(0, 1fr);
  gap: 16px;
  align-items: start;
  padding: 14px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);

  span {
    color: #42d6ff;
    font-weight: 800;
  }

  h3 {
    font-size: 16px;
    margin: 0 0 4px;
  }

  p {
    color: rgba(255, 255, 255, 0.56);
    font-size: 13px;
  }
}

.summary-panel {
  display: grid;
  gap: 14px;
}

.summary-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 12px;
  align-items: center;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  p {
    color: rgba(255, 255, 255, 0.56);
    font-size: 13px;
  }

  strong {
    display: block;
    margin-top: 2px;
    color: #ffffff;
    font-size: 20px;
  }
}

.summary-action {
  align-self: end;
  margin-top: 4px;
}
</style>
