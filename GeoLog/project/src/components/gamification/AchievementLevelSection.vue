<template>
  <section id="achievements" class="achievement-preview-section">
    <div class="section-heading">
      <p>Gamification</p>
      <h2>成就與等級系統</h2>
    </div>

    <div class="achievement-toolbar">
      <div>
        <span class="panel-label">Achievement Preview</span>
        <h3>{{ unlockedAchievementCount }} / {{ achievements.length }} 已解鎖</h3>
      </div>

      <div class="toolbar-actions">
        <div class="matrix-progress" aria-label="Achievement unlock progress">
          <span :style="{ width: `${unlockedAchievementPercent}%` }"></span>
        </div>
        <v-btn
          class="orange-action"
          rounded="pill"
          prepend-icon="mdi-arrow-right-circle"
          text="前往"
          :to="{ name: 'achievements' }"/>
      </div>
    </div>

    <div class="achievement-grid">
      <AchievementCard
        v-for="achievement in previewAchievements"
        :key="achievement.id"
        :achievement="achievement"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AchievementCard from '@/components/gamification/AchievementCard.vue'
import { useGamification } from '@/composables/useGamification'

const { achievements, unlockedAchievementCount, unlockedAchievementPercent } = useGamification()
const previewAchievements = computed(() => achievements.value.slice(0, 8))
</script>

<style scoped lang="scss">
@mixin breakpoint($point) {
  @media screen and (max-width: $point) {
    @content;
  }
}

.achievement-preview-section {
  width: min(1120px, calc(100% - 40px));
  margin: 76px auto 0;
  scroll-margin-top: 110px;
}

.section-heading {
  margin-bottom: 22px;
  text-align: center;

  p {
    margin: 0;
    color: #8fdfff;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 1.8px;
    text-transform: uppercase;
  }

  h2 {
    margin: 8px 0 0;
    color: #f5fbff;
    font-size: clamp(28px, 4vw, 38px);
    font-weight: 900;
    letter-spacing: 0;
  }
}

.panel-label {
  margin: 0;
  color: #8fdfff;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.8px;
  text-transform: uppercase;
}

.achievement-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 16px;

  h3 {
    margin: 6px 0 0;
    color: #f5fbff;
    font-size: 20px;
  }

  @include breakpoint(720px) {
    align-items: flex-start;
    flex-direction: column;
  }
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 14px;

  @include breakpoint(520px) {
    width: 100%;
    align-items: stretch;
    flex-direction: column;
  }
}

.matrix-progress {
  width: min(280px, 32vw);
  height: 10px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(245, 251, 255, 0.16);

  span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, #ff7a1a, #ffb05c);
    box-shadow: 0 0 18px rgba(255, 122, 26, 0.45);
  }

  @include breakpoint(520px) {
    width: 100%;
  }
}

.orange-action {
  background: #ff7a1a !important;
  color: #071426 !important;
  font-weight: 900;
  box-shadow: 0 16px 34px rgba(255, 122, 26, 0.24);
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

@include breakpoint(600px) {
  .achievement-preview-section {
    width: min(100% - 28px, 1120px);
  }
}
</style>
