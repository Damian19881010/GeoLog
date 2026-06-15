<template>
  <main class="achievements-page">
    <section class="page-heading">
      <div>
        <p>Gamification</p>
        <h1>成就與等級系統</h1>
      </div>

      <v-btn
        class="back-btn"
        rounded="pill"
        variant="outlined"
        prepend-icon="mdi-arrow-left"
        :to="{ name: 'home', hash: '#achievements' }"
        text="返回首頁"/>
    </section>

    <section class="level-layout">
      <article class="level-card">
        <div class="level-avatar" :style="{ '--level-progress': `${levelInfo.progressPercent}%` }" aria-label="Current level">
          <span>LV</span>
          <strong>{{ levelInfo.level }}</strong>
        </div>

        <div class="level-details">
          <span class="panel-label">目前階級</span>
          <h2>{{ currentRank }}</h2>
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
      </aside>
    </section>

    <section class="achievement-section">
      <div class="achievement-toolbar">
        <div>
          <span class="panel-label">Achievement Matrix</span>
          <h2>{{ filteredUnlockedAchievementCount }} / {{ filteredAchievements.length }} 已解鎖</h2>
        </div>
        <div class="matrix-progress" aria-label="Achievement unlock progress">
          <span :style="{ width: `${filteredUnlockedAchievementPercent}%` }"></span>
        </div>
      </div>
      <div class="achievement-filters">
        <v-select
          v-model="selectedCountryFilter"
          hide-details="auto"
          class="mb-5"
          :items="countryFilterItems"
          label="國家"
          max-width="300"
          variant="outlined"
        />
        <v-select
          v-model="selectedCompletionFilter"
          hide-details="auto"
          class="mb-5"
          :items="completionFilterItems"
          label="完成度"
          max-width="300"
          variant="outlined"
        />
      </div>
 
      <div v-if="filteredAchievements.length > 0" class="achievement-grid">
        <AchievementCard
          v-for="achievement in filteredAchievements"
          :key="achievement.id"
          :achievement="achievement"
        />
      </div>
      <div v-else class="achievement-empty">
        沒有符合條件的成就
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import AchievementCard from '@/components/gamification/AchievementCard.vue'
import { getLevelPrivilege, getLevelRank } from '@/data/gamification'
import { useGamification } from '@/composables/useGamification'
import { getLocationLabel } from '@/views/book/locationConfig'

const ALL_COUNTRIES = 'all'
const GENERAL_COUNTRY = 'general'

type CompletionFilter = 'all' | 'unlocked' | 'locked'

const {
  achievements,
  expActions,
  levelInfo,
  playerTotalExp,
} = useGamification()

const selectedCountryFilter = ref(ALL_COUNTRIES)
const selectedCompletionFilter = ref<CompletionFilter>('all')

const completionFilterItems = [
  { title: '全部', value: 'all' },
  { title: '已解鎖', value: 'unlocked' },
  { title: '未解鎖', value: 'locked' },
] as const

const countryFilterItems = computed(() => {
  const countries = Array.from(
    new Set(achievements.value.map((achievement) => achievement.country).filter(Boolean)),
  ) as string[]

  return [
    { title: '全部國家', value: ALL_COUNTRIES },
    { title: '通用', value: GENERAL_COUNTRY },
    ...countries
      .sort((left, right) => getLocationLabel(left).localeCompare(getLocationLabel(right), 'zh-Hant'))
      .map((country) => ({
        title: getLocationLabel(country),
        value: country,
      })),
  ]
})

const filteredAchievements = computed(() =>
  achievements.value.filter((achievement) => {
    const matchesCountry =
      selectedCountryFilter.value === ALL_COUNTRIES ||
      (selectedCountryFilter.value === GENERAL_COUNTRY
        ? !achievement.country
        : achievement.country === selectedCountryFilter.value)

    const matchesCompletion =
      selectedCompletionFilter.value === 'all' ||
      (selectedCompletionFilter.value === 'unlocked'
        ? achievement.isUnlocked
        : !achievement.isUnlocked)

    return matchesCountry && matchesCompletion
  }),
)

const filteredUnlockedAchievementCount = computed(() =>
  filteredAchievements.value.filter((achievement) => achievement.isUnlocked).length,
)

const filteredUnlockedAchievementPercent = computed(() => {
  if (filteredAchievements.value.length === 0) return 0
  return Math.round((filteredUnlockedAchievementCount.value / filteredAchievements.value.length) * 100)
})

const currentRank = computed(() => getLevelRank(levelInfo.value.level))
const currentPrivilege = computed(() => getLevelPrivilege(levelInfo.value.level))
const nextLevelRemaining = computed(() => {
  return Math.max(levelInfo.value.requiredExp - levelInfo.value.levelExp, 0)
})
</script>

<style scoped lang="scss">
@mixin breakpoint($point) {
  @media screen and (max-width: $point) {
    @content;
  }
}

.achievements-page {
  width: min(1120px, calc(100% - 40px));
  min-height: calc(100vh - 90px);
  margin: 0 auto;
  padding: 34px 0 72px;
  color: #f5fbff;
}

.page-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 28px;

  p {
    margin: 0;
    color: #8fdfff;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 1.8px;
    text-transform: uppercase;
  }

  h1 {
    margin: 8px 0 0;
    color: #f5fbff;
    font-size: clamp(32px, 5vw, 46px);
    font-weight: 900;
    letter-spacing: 0;
  }

  @include breakpoint(640px) {
    align-items: flex-start;
    flex-direction: column;
  }
}

.back-btn {
  border-color: rgba(245, 251, 255, 0.34) !important;
  color: #f5fbff !important;
}

.panel-label {
  margin: 0;
  color: #8fdfff;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.8px;
  text-transform: uppercase;
}

.level-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.65fr);
  gap: 18px;

  @include breakpoint(920px) {
    grid-template-columns: 1fr;
  }
}

.level-card,
.exp-panel {
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

  h2 {
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

.achievement-section {
  margin-top: 34px;
}

.achievement-toolbar {
  margin-bottom: 16px;

  h2 {
    margin: 6px 0 0;
    color: #f5fbff;
    font-size: 22px;
    letter-spacing: 0;
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

.achievement-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  :deep(.v-input) {
    flex: 1 1 220px;
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

.achievement-empty {
  display: grid;
  min-height: 180px;
  place-items: center;
  border: 1px solid rgba(245, 251, 255, 0.16);
  border-radius: 8px;
  background: rgba(245, 251, 255, 0.08);
  color: rgba(245, 251, 255, 0.68);
  font-weight: 700;
}

@include breakpoint(600px) {
  .achievements-page {
    width: min(100% - 28px, 1120px);
    padding-top: 28px;
  }
}
</style>
