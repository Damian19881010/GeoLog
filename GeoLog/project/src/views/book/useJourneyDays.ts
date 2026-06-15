import { ref } from 'vue'
import { mockJourneyTabs } from '@/data/mockData'
import type { JourneyDay } from './types'

const cloneJourneyDays = (days: JourneyDay[]) => JSON.parse(JSON.stringify(days)) as JourneyDay[]

const journeyDays = ref<JourneyDay[]>(cloneJourneyDays(mockJourneyTabs))

export const useJourneyDays = () => {
  return {
    journeyDays,
  }
}
