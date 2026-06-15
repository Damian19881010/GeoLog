<template>
  <section class="recent-routes-section">
    <div class="section-heading">
      <p>Top routes</p>
      <h2>近期行程</h2>
    </div>
  
    <v-container class="pa-0">
      <v-row dense>
        <v-col v-for="route in topRoutes" :key="route.id" cols="12" sm="6" md="6" lg="4">
          <v-card :to="{ name: 'book-detail', params: { id: route.id } }" class="route-pill w-100" hoverable elevation="2" >
            <div>
              <v-img :src="route.image" :alt="route.title" width="100%" />
            </div>
            <div class="pa-3">
              <p class="text-title-medium">{{ route.title }}</p>
              <p class="text-body-small">{{ route.detail }}</p>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

  

  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getLocationLabel } from '@/views/book/locationConfig'
import type { Trip } from '@/views/book/types'
import { useTrips } from '@/views/book/useTrips'

const RECENT_ROUTE_LIMIT = 6
const { trips } = useTrips()

const getTripTimestamp = (trip: Trip) => {
  const timestamp = new Date(`${trip.startDate}T00:00:00`).getTime()
  return Number.isNaN(timestamp) ? 0 : timestamp
}

const getRouteDetail = (trip: Trip) => {
  const location = [trip.city, trip.country]
    .filter(Boolean)
    .map(getLocationLabel)
    .join(', ')

  return `${location} / ${trip.days} days`
}

const topRoutes = computed(() =>
  [...trips.value]
    .sort((left, right) => getTripTimestamp(right) - getTripTimestamp(left) || right.id - left.id)
    .slice(0, RECENT_ROUTE_LIMIT)
    .map((trip) => ({
      id: trip.id,
      title: trip.name,
      detail: getRouteDetail(trip),
      image: trip.image,
    })),
)
</script>

<style scoped lang="scss">
@mixin breakpoint($point) {
  @media screen and (max-width: $point) {
    @content;
  }
}

.recent-routes-section {
  width: min(1920px, calc(100% - 140px));
  margin: 62px auto 0;

  @include breakpoint(600px) {
    width: min(100% - 28px, 1120px);
  }
}

.section-heading {
  margin-bottom: 22px;
  text-align: center;

  p {
    margin: 0;
    color: #8fdfff;

    font-weight: 800;
    letter-spacing: 1.8px;
    text-transform: uppercase;
  }

  h2 {
    margin: 8px 0 0;
    color: #f5fbff;
    font-size: clamp(28px, 4vw, 38px);
    font-weight: 900;
    letter-spacing: 0;
  }
}

.route-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  @include breakpoint(840px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @include breakpoint(560px) {
    grid-template-columns: 1fr;
  }
}

.route-pill {
  min-height: 72px;
 
  border: 1px solid rgba(245, 251, 255, 0.18);
  border-radius: 8px;
  background: rgba(245, 251, 255, 0.08);
  color: inherit;
  text-decoration: none;

  img {
    width: 54px;
    height: 54px;
    display: block;
    border-radius: 8px;
    object-fit: cover;
  }

  h3,
  p {
    margin: 0;
  }

  h3 {
    color: #ffffff;
    font-size: 14px;
  }

  p {
    color: rgba(245, 251, 255, 0.58);

  }
}
</style>
