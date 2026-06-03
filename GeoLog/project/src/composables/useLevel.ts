import { computed, unref, type MaybeRef } from 'vue'

export const EXP_TABLE = [0, 30, 90, 210, 410, 810, 1310, 2000, 3000, 4500]

export function useLevel(totalExp: MaybeRef<number>) {
  const levelInfo = computed(() => {
    const normalizedExp = Math.max(0, Math.floor(unref(totalExp)))
    let level = 0

    while (level < EXP_TABLE.length - 1 && normalizedExp >= EXP_TABLE[level + 1]) {
      level++
    }

    const currentLevelMin = EXP_TABLE[level]
    const nextLevelMin = EXP_TABLE[level + 1] || currentLevelMin + 5000
    const levelExp = normalizedExp - currentLevelMin
    const requiredExp = nextLevelMin - currentLevelMin
    const progressPercent = Math.min((levelExp / requiredExp) * 100, 100)

    return {
      level,
      levelExp,
      requiredExp,
      progressPercent: Math.round(progressPercent),
    }
  })

  return { levelInfo }
}
