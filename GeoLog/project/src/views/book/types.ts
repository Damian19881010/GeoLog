export type TripDirection = 'outbound' | 'inbound'

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

export interface JourneyItem {
  id: string
  time: string
  title: string
  address: string
  note?: string | null
  tickets: JourneyTicketInput
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
}
