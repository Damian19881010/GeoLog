<template>
  <main class="home-page">
    <section class="hero-section ">
      <div class="index" color="transparent" flat>
        <p class="eyebrow">GeoLog Travel Studio</p>
        <p class="h1">探索世界，整理每一段<span class="text-orange">旅行軌跡</span></p>
        <p class="hero-description">
          把景點、航班、租車與每日行程集中在同一個工作台，出發前就能看懂整趟旅程的節奏。
        </p>
        <!-- 建立旅程 / 查看成就 按鈕區塊 -->
        <div class="hero-actions">
          <v-btn class="primary-btn" rounded="pill" size="large" prepend-icon="mdi-notebook-plus-outline"
            :to="{ name: 'book' }">
            建立旅程
          </v-btn>
          <v-btn class="outline-btn" rounded="pill" size="large" variant="outlined" prepend-icon="mdi-trophy-outline"
            href="#achievements">
            查看成就
          </v-btn>
        </div>


        <!--  -->
        <div class="hero-stats " aria-label="GeoLog highlights">
          <div v-for="stat in heroStats" :key="stat.label">
            <strong>{{ stat.value }}</strong>
            <span>{{ stat.label }}</span>
          </div>
        </div>
      </div>


      <!-- 使用者登入後會抓出離當天日期最近的一筆旅程資料 -->
      <!-- 但是如果視今天之前的日期，則不予以抓取 -->
      <article class="feature-card d-none">
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
 
    <!-- 世界旅行地圖 -->
    <WorldTravelMapSection />

    <!-- 成就與等級系統介紹 -->
    <AchievementLevelSection />
    <!-- 近期行程 -->
    <RecentRoutesSection />

    <!-- 開始規劃 -->
    <section class="join-band">
      <h2>把下一段旅程整理成值得回看的 GeoLog</h2>
      <v-btn class="join-btn" rounded="pill" prepend-icon="mdi-arrow-right-circle" :to="{ name: 'book' }">
        開始規劃
      </v-btn>
    </section>
  </main>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import banner4Image from '@/assets/images/banner4.png'
import WorldTravelMapSection from '@/components/home/WorldTravelMapSection.vue'
import AchievementLevelSection from '@/components/gamification/AchievementLevelSection.vue'
import RecentRoutesSection from '@/components/home/RecentRoutesSection.vue'
import tripImage from '@/assets/images/trip.png'
import trip2Image from '@/assets/images/trip2.png'
import trip3Image from '@/assets/images/trip3.png'
import trip5Image from '@/assets/images/trip5.png'
import trip8Image from '@/assets/images/trip8.png'
import trip10Image from '@/assets/images/trip10.png'
import trip12Image from '@/assets/images/trip12.png'
import trip14Image from '@/assets/images/trip14.png'

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
  padding: 0px 0 72px;
  // background:
  //   linear-gradient(180deg, rgba(245, 251, 255, 0.05) 0%, rgba(245, 251, 255, 0) 42%),
  //   linear-gradient(135deg, #071426 0%, #0d263d 52%, #061322 100%);
  color: #f5fbff;
}


.content-section,
.join-band {
  width: min(1920px, calc(100% - 140px));
  margin-inline: auto;
}

.hero-section {

  display: grid;
  background-image: url('@/assets/images/banner4.png');
  background-repeat: no-repeat;
  background-size: scroll;
  // background-size: cover;
  background-position: center;
  padding: 34px clamp(22px, 6vw, 72px);
  grid-template-columns: minmax(0, 1fr) minmax(320px, 430px);
  align-items: center;
  gap: clamp(28px, 6vw, 72px);
  min-height: 600px;
  // border: 1px solid rgba(255, 122, 26, 0.34);
  .index {
    width: 650px;
    .h1 {
      font-size: 4rem;
      font-weight: 900;
    }

    @include breakpoint(1536px) {
      width: 500px !important;
      // background: red!important;
      .h1 {
      font-size: 3rem;

      }
    }
  }

  @include breakpoint(900px) {
    grid-template-columns: 1fr;
    min-height: auto;
  }
}



.eyebrow,
.section-heading p {
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
  font-size: 1rem;
  line-height: 1.7;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}

.primary-btn {
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
.collection-card {
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

  .hero-stats {
    grid-template-columns: 1fr;

    div {
      border-right: 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.14);

      &:last-child {
        border-bottom: 0;
      }
    }
  }
}
</style>
