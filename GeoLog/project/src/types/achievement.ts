export interface AchievementCardProps {
  id: string
  title: string
  description: string
  iconType: 'minimal-pin' | 'radar-ring' | 'immigration-house' | 'dot-globe'
  isUnlocked: boolean
  unlockProgress?: { current: number; target: number }
  isSecret: boolean
}
