<template>
  <article
    class="achievement-card "
    :class="{
      'is-unlocked': achievement.isUnlocked,
      'is-locked': !achievement.isUnlocked,
      'is-secret': achievement.isSecret && !achievement.isUnlocked,
    }">
    <!-- 成就圖示 -->
    <div class="achievement-icon">
      <v-icon size="26">{{ getAchievementIcon(achievement) }}</v-icon>
    </div>
    <!-- 成就條件 -->
    <div class="achievement-body">
      <!-- 副標 -->
      <div class="achievement-row">
        <span>{{ achievement.isSecret && !achievement.isUnlocked ? 'Secret' : achievement.category }}</span>
        <strong>{{ achievement.isUnlocked ? 'Unlocked' : 'Locked' }}</strong>
      </div>  
      <!-- 標題與描述 -->
      <h3>{{ getAchievementTitle(achievement) }}</h3>
      <p>{{ getAchievementDescription(achievement) }}</p>
    </div>
    <!-- 進度條 -->
    <div v-if="achievement.unlockProgress" class="achievement-progress">
      <div>
        <span :style="{ width: `${getAchievementProgressPercent(achievement)}%` }"></span>
      </div>
      <strong>
        {{ achievement.unlockProgress.current }} / {{ achievement.unlockProgress.target }}
      </strong>
    </div>
  </article>
</template>

<script setup lang="ts">
import {
  getAchievementDescription,
  getAchievementIcon,
  getAchievementProgressPercent,
  getAchievementTitle,
  type AchievementCard,
} from '@/data/gamification'

defineProps<{
  achievement: AchievementCard
}>()
</script>

<style scoped lang="scss">
.achievement-card {
  min-height: 244px;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 16px;
  padding: 18px;
  border: 1px solid rgba(245, 251, 255, 0.16);
  border-radius: 8px;
  background: rgb(245, 251, 255);
  color: #071426;
  box-shadow: 0 22px 54px rgba(0, 0, 0, 0.22);
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
    border: 2px solid rgba(255, 122, 26, 0.5);

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
</style>
