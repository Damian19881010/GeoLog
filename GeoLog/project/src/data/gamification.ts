import { mockJourneyTabs, mockTrips } from '@/data/mockData'
import type { AchievementCardProps } from '@/types/achievement'
import type { JourneyDay, JourneyItem, Trip } from '@/views/book/types'

export type AchievementCard = AchievementCardProps & {
  category: string
  expReward: number
}

export type GamificationContext = {
  trips: Trip[]
  journeyDays: JourneyDay[]
}

type ExpAction = {
  action: string
  reward: `+${number} EXP`
}

type AchievementCategory =
  | '旅程里程碑'
  | '地理探索'
  | '日本探索'
  | '行程規劃'
  | '交通與票券'
  | 'SECRET'

type AchievementDefinition = Omit<AchievementCard, 'isSecret' | 'isUnlocked' | 'unlockProgress'> & {
  target: number
  getCurrent: (context: GamificationContext) => number
  isSecret?: boolean
}

type LevelPrivilege = {
  minLevel: number
  description: string
}

const SECRET_TITLE = '隱藏成就'
const SECRET_DESCRIPTION = '完成特定條件後才會揭曉這項成就。'
const DEFAULT_LEVEL_RANK = '旅圖探索者'

const CATEGORIES = {
  journey: '旅程里程碑',
  geography: '地理探索',
  japan: '日本探索',
  planning: '行程規劃',
  logistics: '交通與票券',
  secret: 'SECRET',
} as const satisfies Record<string, AchievementCategory>

const EUROPE_COUNTRIES = new Set([
  'Czech Republic',
  'France',
  'Germany',
  'Netherlands',
  'Spain',
  'United Kingdom',
])

const ISLAND_CITIES = new Set(['Cebu', 'Melbourne', 'Okinawa', 'Sydney'])

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}

const getJourneyItems = (journeyDays: JourneyDay[]): JourneyItem[] => {
  return journeyDays.flatMap((day) => day.items)
}

const countTripsByCountry = (trips: Trip[], country: string): number => {
  return trips.filter((trip) => trip.country === country).length
}

const countTripsByCity = (trips: Trip[], city: string): number => {
  return trips.filter((trip) => trip.city === city).length
}

const countUnique = (values: string[]): number => {
  return new Set(values.filter(Boolean)).size
}

const sumDaysByCity = (trips: Trip[], city: string): number => {
  return trips
    .filter((trip) => trip.city === city)
    .reduce((total, trip) => total + Math.max(trip.days, 0), 0)
}

const countItemsByTag = (journeyDays: JourneyDay[], tag: string): number => {
  return getJourneyItems(journeyDays).filter((item) => item.tags?.includes(tag as never)).length
}

const countItemsWithTransport = (journeyDays: JourneyDay[]): number => {
  return getJourneyItems(journeyDays).filter((item) => Boolean(item.transport)).length
}

const countItemsWithTickets = (journeyDays: JourneyDay[]): number => {
  return getJourneyItems(journeyDays).filter((item) => item.tickets && item.tickets !== true).length
}

const countEarlyMorningItems = (journeyDays: JourneyDay[]): number => {
  return getJourneyItems(journeyDays).filter((item) => {
    const hour = Number(item.time.slice(0, 2))
    return Number.isFinite(hour) && hour >= 3 && hour < 6
  }).length
}

const countIslandTrips = (trips: Trip[]): number => {
  return trips.filter((trip) => ISLAND_CITIES.has(trip.city)).length
}

const countEuropeanCountries = (trips: Trip[]): number => {
  return countUnique(trips.filter((trip) => EUROPE_COUNTRIES.has(trip.country)).map((trip) => trip.country))
}

export const LEVEL_RANKS = {
  0: '旅行新手',
  1: '散步旅人',
  2: '城市蒐集家',
  3: '地圖觀察員',
  4: '路線策劃師',
  5: '島嶼探索者',
  6: '跨區旅行家',
  7: '旅圖領航員',
  8: '世界行腳家',
  9: 'GeoLog 傳奇探索者',
} as const satisfies Record<number, string>

const LEVEL_PRIVILEGES = [
  {
    minLevel: 8,
    description: '解鎖進階旅圖徽章、完整成就牆與高階探索稱號。',
  },
  {
    minLevel: 5,
    description: '解鎖專屬旅程標籤與更多地圖收藏展示。',
  },
  {
    minLevel: 3,
    description: '開放更多徽章樣式，讓旅程紀錄更有辨識度。',
  },
  {
    minLevel: 1,
    description: '開始累積探索經驗，解鎖基礎成就與旅圖稱號。',
  },
] as const satisfies readonly LevelPrivilege[]

export const ACHIEVEMENT_ICONS = {
  'minimal-pin': 'mdi-map-marker-radius-outline',
  'radar-ring': 'mdi-radar',
  'immigration-house': 'mdi-home-map-marker',
  'dot-globe': 'mdi-earth',
} as const satisfies Record<AchievementCardProps['iconType'], string>

export const EXP_ACTIONS = [
  { action: '解鎖旅程里程碑成就', reward: '+100 EXP' },
  { action: '解鎖地理探索成就', reward: '+300 EXP' },
  { action: '解鎖行程規劃成就', reward: '+500 EXP' },
  { action: '解鎖隱藏成就', reward: '+1000 EXP' },
] as const satisfies readonly ExpAction[]

export const ACHIEVEMENT_DEFINITIONS = [
  {
    id: 'first-trip',
    title: '第一段旅程',
    description: '建立至少 1 筆旅程資料，讓 GeoLog 有第一個座標。',
    category: CATEGORIES.journey,
    iconType: 'minimal-pin',
    expReward: 100,
    target: 1,
    getCurrent: ({ trips }) => trips.length,
  },
  {
    id: 'trip-collector-10',
    title: '十趟旅程蒐集家',
    description: '累積 10 筆旅程資料，形成穩定的旅行資料庫。',
    category: CATEGORIES.journey,
    iconType: 'minimal-pin',
    expReward: 500,
    target: 10,
    getCurrent: ({ trips }) => trips.length,
  },
  {
    id: 'trip-explorer-20',
    title: '二十趟探索者',
    description: '累積 20 筆旅程資料，持續擴張自己的旅圖。',
    category: CATEGORIES.journey,
    iconType: 'minimal-pin',
    expReward: 800,
    target: 20,
    getCurrent: ({ trips }) => trips.length,
  },
  {
    id: 'country-collector-10',
    title: '十國收藏家',
    description: '旅程資料涵蓋 10 個不同國家。',
    category: CATEGORIES.geography,
    iconType: 'dot-globe',
    expReward: 1000,
    target: 10,
    getCurrent: ({ trips }) => countUnique(trips.map((trip) => trip.country)),
  },
  {
    id: 'city-collector-12',
    title: '十二城漫遊者',
    description: '旅程資料涵蓋 12 個不同城市。',
    category: CATEGORIES.geography,
    iconType: 'dot-globe',
    expReward: 800,
    target: 12,
    getCurrent: ({ trips }) => countUnique(trips.map((trip) => trip.city)),
  },
  {
    id: 'europe-route-5',
    title: '歐洲路線採樣員',
    description: '旅程資料涵蓋 5 個歐洲國家。',
    category: CATEGORIES.geography,
    iconType: 'dot-globe',
    expReward: 700,
    target: 5,
    getCurrent: ({ trips }) => countEuropeanCountries(trips),
  },
  {
    id: 'island-drifter',
    title: '島嶼漫遊者',
    description: '累積 4 筆島嶼或海港城市旅程。',
    category: CATEGORIES.geography,
    iconType: 'dot-globe',
    expReward: 500,
    target: 4,
    getCurrent: ({ trips }) => countIslandTrips(trips),
  },
  {
    id: 'japan-traveler',
    title: '日本初訪旅人',
    description: '建立至少 1 筆日本旅程。',
    category: CATEGORIES.japan,
    iconType: 'minimal-pin',
    expReward: 200,
    target: 1,
    getCurrent: ({ trips }) => countTripsByCountry(trips, 'Japan'),
  },
  {
    id: 'japan-route-collector',
    title: '日本路線蒐集家',
    description: '累積 4 筆日本旅程資料。',
    category: CATEGORIES.japan,
    iconType: 'minimal-pin',
    expReward: 500,
    target: 4,
    getCurrent: ({ trips }) => countTripsByCountry(trips, 'Japan'),
  },
  {
    id: 'okinawa-traveler',
    title: '沖繩旅人',
    description: '沖繩旅程累積至少 3 天。',
    category: CATEGORIES.japan,
    iconType: 'minimal-pin',
    expReward: 200,
    target: 3,
    getCurrent: ({ trips }) => sumDaysByCity(trips, 'Okinawa'),
  },
  {
    id: 'okinawa-deep-diver',
    title: '沖繩深度探索者',
    description: '沖繩旅程累積至少 8 天。',
    category: CATEGORIES.japan,
    iconType: 'minimal-pin',
    expReward: 500,
    target: 8,
    getCurrent: ({ trips }) => sumDaysByCity(trips, 'Okinawa'),
  },
  {
    id: 'tokyo-sightseer',
    title: '東京景點巡禮',
    description: '建立至少 1 筆東京旅程。',
    category: CATEGORIES.japan,
    iconType: 'radar-ring',
    expReward: 300,
    target: 1,
    getCurrent: ({ trips }) => countTripsByCity(trips, 'Tokyo'),
  },
  {
    id: 'shikoku-traveler',
    title: '四國旅人',
    description: '建立至少 1 筆四國城市旅程。',
    category: CATEGORIES.japan,
    iconType: 'minimal-pin',
    expReward: 300,
    target: 1,
    getCurrent: ({ trips }) =>
      ['Tokushima', 'Kagawa', 'Kochi', 'Ehime'].some((city) => countTripsByCity(trips, city) > 0) ? 1 : 0,
  },
  {
    id: 'journey-planner',
    title: '行程規劃師',
    description: '行程明細累積 8 個項目。',
    category: CATEGORIES.planning,
    iconType: 'radar-ring',
    expReward: 500,
    target: 8,
    getCurrent: ({ journeyDays }) => getJourneyItems(journeyDays).length,
  },
  {
    id: 'food-note-collector',
    title: '美食筆記收藏家',
    description: '行程明細中累積 3 個美食標籤。',
    category: CATEGORIES.planning,
    iconType: 'radar-ring',
    expReward: 300,
    target: 3,
    getCurrent: ({ journeyDays }) => countItemsByTag(journeyDays, 'food'),
  },
  {
    id: 'hotel-check-in',
    title: '住宿安排完成',
    description: '行程明細中至少安排 1 個住宿項目。',
    category: CATEGORIES.planning,
    iconType: 'immigration-house',
    expReward: 200,
    target: 1,
    getCurrent: ({ journeyDays }) => countItemsByTag(journeyDays, 'hotel'),
  },
  {
    id: 'transport-master',
    title: '移動節奏管理者',
    description: '行程明細中累積 5 個交通移動規劃。',
    category: CATEGORIES.logistics,
    iconType: 'radar-ring',
    expReward: 500,
    target: 5,
    getCurrent: ({ journeyDays }) => countItemsWithTransport(journeyDays),
  },
  {
    id: 'ticket-keeper',
    title: '票券保管員',
    description: '行程明細中至少綁定 1 組票券資訊。',
    category: CATEGORIES.logistics,
    iconType: 'immigration-house',
    expReward: 300,
    target: 1,
    getCurrent: ({ journeyDays }) => countItemsWithTickets(journeyDays),
  },
  {
    id: 'australia-duo',
    title: '澳洲雙城線',
    description: '澳洲旅程涵蓋 2 個不同城市。',
    category: CATEGORIES.geography,
    iconType: 'dot-globe',
    expReward: 500,
    target: 2,
    getCurrent: ({ trips }) => countUnique(trips.filter((trip) => trip.country === 'Australia').map((trip) => trip.city)),
  },
  {
    id: 'late-night-planner',
    title: '清晨出發者',
    description: '行程明細中安排 03:00 到 06:00 之間的項目。',
    category: CATEGORIES.secret,
    iconType: 'immigration-house',
    expReward: 1000,
    target: 1,
    isSecret: true,
    getCurrent: ({ journeyDays }) => countEarlyMorningItems(journeyDays),
  },
] as const satisfies readonly AchievementDefinition[]

export const resolveAchievements = (context: GamificationContext): AchievementCard[] => {
  return ACHIEVEMENT_DEFINITIONS.map((definition) => {
    const current = clamp(Math.floor(definition.getCurrent(context)), 0, definition.target)
    const isUnlocked = current >= definition.target
    const isSecret = ('isSecret' in definition ? definition.isSecret : undefined) ?? definition.category === CATEGORIES.secret

    return {
      id: definition.id,
      title: definition.title,
      description: definition.description,
      iconType: definition.iconType,
      category: definition.category,
      expReward: definition.expReward,
      isSecret,
      isUnlocked,
      unlockProgress: {
        current,
        target: definition.target,
      },
    }
  })
}

export const getUnlockedAchievementExp = (achievements: readonly AchievementCard[]): number => {
  return achievements.reduce((total, achievement) => {
    return achievement.isUnlocked ? total + achievement.expReward : total
  }, 0)
}

export const ACHIEVEMENTS = resolveAchievements({
  trips: mockTrips,
  journeyDays: mockJourneyTabs,
})

export const PLAYER_TOTAL_EXP = getUnlockedAchievementExp(ACHIEVEMENTS)

export const getLevelRank = (level: number): string => {
  return LEVEL_RANKS[level as keyof typeof LEVEL_RANKS] ?? `LV.${level} ${DEFAULT_LEVEL_RANK}`
}

export const getLevelPrivilege = (level: number): string => {
  return (
    LEVEL_PRIVILEGES.find((privilege) => level >= privilege.minLevel)?.description ??
    '記錄更多旅程與筆記，累積 EXP 後即可解鎖新的等級特權。'
  )
}

export const getAchievementIcon = (achievement: AchievementCard): string => {
  if (achievement.isSecret && !achievement.isUnlocked) {
    return 'mdi-lock-outline'
  }

  return ACHIEVEMENT_ICONS[achievement.iconType]
}

export const getAchievementTitle = (achievement: AchievementCard): string => {
  if (achievement.isSecret && !achievement.isUnlocked) {
    return SECRET_TITLE
  }

  return achievement.title
}

export const getAchievementDescription = (achievement: AchievementCard): string => {
  if (achievement.isSecret && !achievement.isUnlocked) {
    return SECRET_DESCRIPTION
  }

  return achievement.description
}

export const getAchievementProgressPercent = (achievement: AchievementCard): number => {
  const progress = achievement.unlockProgress

  if (!progress || progress.target <= 0) {
    return achievement.isUnlocked ? 100 : 0
  }

  const normalizedCurrent = Math.max(progress.current, 0)
  const rawPercent = Math.round((normalizedCurrent / progress.target) * 100)

  return clamp(rawPercent, 0, 100)
}
