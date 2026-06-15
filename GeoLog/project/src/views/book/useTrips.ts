import { ref } from 'vue'
import { mockTrips } from '@/data/mockData'
import type { Trip } from './types'

const trips = ref<Trip[]>(mockTrips.map((trip) => ({ ...trip })))

export const useTrips = () => {
  return {
    trips,
  }
}
