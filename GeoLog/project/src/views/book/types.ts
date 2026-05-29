export type TripDirection = 'outbound' | 'inbound'

export type JourneyTag = 'food' | 'attraction' | 'shopping' | 'transport' | 'hotel' | 'activity'

export type TransportMode = 'walk' | 'drive' | 'train' | 'bus' | 'flight' | 'taxi'

export interface TransportSegment {
  mode: TransportMode
  duration: string // e.g. "15 分鐘"
  note?: string
}

export interface Trip {
  id: number
  name: string
  days: number
  startDate: string
  endDate: string
  country: string
  city: string
  image: string
}

export interface FlightTicketDetail {
  airline: string
  bookingCode: string
  flightNo: string
  departureAt: string
  notice: string
}

export interface JourneyTickets {
  selectedTrip: TripDirection
  outbound: FlightTicketDetail
  inbound: FlightTicketDetail
}

export type JourneyTicketInput = JourneyTickets | true | null

export type JourneyAccommodationInput = true | null

export interface JourneyItem {
  id: string
  time: string
  title: string
  address: string
  lat?: number
  lng?: number
  note?: string | null
  tickets: JourneyTicketInput
  accommodation?: JourneyAccommodationInput
  tags?: JourneyTag[]
  transport?: TransportSegment | null
  visited?: boolean
}

export interface JourneyHeader {
  title: string
  rhythm: string
}

export interface JourneyDay {
  id: string
  date: string
  tabText: string
  header: JourneyHeader
  items: JourneyItem[]
}

export interface EditJourneyInitialData {
  startTime: string
  endTime: string
  title: string
  address: string
  note: string
  tickets: JourneyTickets | null
  tags?: JourneyTag[]
  transport?: TransportSegment | null
}
