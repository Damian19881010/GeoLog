import mockTripData from '@/views/book/mockTripData.js'
import { journeyTabs } from '@/views/book/mockJourneyData'
import type { JourneyDay, Trip } from '@/views/book/types'

export type CityCoordinate = {
  city: string
  coord: [number, number]
}

export const mockTrips: Trip[] = mockTripData

export const mockJourneyTabs: JourneyDay[] = journeyTabs

export const cityCoordinates: Record<string, CityCoordinate> = {
  Okinawa: { city: 'Okinawa', coord: [127.6792, 26.2124] },
  Osaka: { city: 'Osaka', coord: [135.5023, 34.6937] },
  Kyoto: { city: 'Kyoto', coord: [135.7681, 35.0116] },
  Tokyo: { city: 'Tokyo', coord: [139.6917, 35.6895] },
  Frankfurt: { city: 'Frankfurt', coord: [8.6821, 50.1109] },
  Taipei: { city: 'Taipei', coord: [121.5654, 25.033] },
  London: { city: 'London', coord: [-0.1276, 51.5072] },
  Paris: { city: 'Paris', coord: [2.3522, 48.8566] },
  Prague: { city: 'Prague', coord: [14.4378, 50.0755] },
  Amsterdam: { city: 'Amsterdam', coord: [4.9041, 52.3676] },
  Cebu: { city: 'Cebu', coord: [123.8854, 10.3157] },
  'New York': { city: 'New York', coord: [-74.006, 40.7128] },
  Madrid: { city: 'Madrid', coord: [-3.7038, 40.4168] },
  Melbourne: { city: 'Melbourne', coord: [144.9631, -37.8136] },
  Sydney: { city: 'Sydney', coord: [151.2093, -33.8688] },
}
