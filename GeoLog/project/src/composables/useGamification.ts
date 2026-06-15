import { computed } from 'vue'
import { EXP_ACTIONS, getUnlockedAchievementExp, resolveAchievements } from '@/data/gamification'
import { useLevel } from '@/composables/useLevel'
import { useJourneyDays } from '@/views/book/useJourneyDays'
import { useTrips } from '@/views/book/useTrips'

export const useGamification = () => {
  const { trips } = useTrips()
  const { journeyDays } = useJourneyDays()

  const achievements = computed(() =>
    resolveAchievements({
      trips: trips.value,
      journeyDays: journeyDays.value,
    }),
  )

  const playerTotalExp = computed(() => getUnlockedAchievementExp(achievements.value))
  const unlockedAchievementCount = computed(() =>
    achievements.value.filter((achievement) => achievement.isUnlocked).length,
  )
  const unlockedAchievementPercent = computed(() => {
    if (achievements.value.length === 0) return 0
    return Math.round((unlockedAchievementCount.value / achievements.value.length) * 100)
  })
  const { levelInfo } = useLevel(playerTotalExp)

  return {
    achievements,
    expActions: EXP_ACTIONS,
    levelInfo,
    playerTotalExp,
    unlockedAchievementCount,
    unlockedAchievementPercent,
  }
}
