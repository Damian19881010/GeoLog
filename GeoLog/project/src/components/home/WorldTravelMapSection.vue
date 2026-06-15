<template>
  <section id="world-map" class="world-travel-map-section">
    <v-card class="section-heading" color="transparent" flat>
      <p>旅程地圖</p>
      <h2>旅程世界地圖</h2>
    </v-card>

    <v-card class="world-map-panel">
      <div>
        <span class="map-kicker">互動旅程地圖</span>
        <h3 class="opacity-80">我的旅程足跡</h3>
      </div>

      <div ref="worldMapRef" class="world-map-chart" aria-label="GeoLog 旅程世界地圖"></div>

      <div class="map-summary ">
        <div v-for="item in mapSummary" :key="item.label">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </div>
      </div>
    </v-card>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { cityCoordinates } from '@/data/mockData'
import { cartoDarkTileOptions, cartoDarkTileUrl } from '@/utils/mapTiles'
import { useJourneyDays } from '@/views/book/useJourneyDays'
import { useTrips } from '@/views/book/useTrips'
import { getLocationLabel } from '@/views/book/locationConfig'

type TravelMarker = {
  name: string
  city: string
  coord: [number, number]
  value: number
}

const worldMapRef = ref<HTMLDivElement | null>(null)
let worldMap: L.Map | null = null
let markerLayer: L.LayerGroup | null = null

const { trips } = useTrips()
const { journeyDays } = useJourneyDays()

const travelMarkers = computed<TravelMarker[]>(() =>
  trips.value.flatMap((trip) => {
    const city = cityCoordinates[trip.city]

    if (!city) return []

    return {
      name: trip.name,
      city: getLocationLabel(city.city),
      coord: city.coord,
      value: Math.max(trip.days, 1),
    }
  }),
)

const mapSummary = computed(() => [
  { label: '城市', value: String(new Set(travelMarkers.value.map((marker) => marker.city)).size).padStart(2, '0') },
  { label: '路線', value: String(trips.value.length).padStart(2, '0') },
  {
    label: '筆記',
    value: String(journeyDays.value.reduce((total, day) => total + day.items.length, 0)).padStart(2, '0'),
  },
])

const toLatLng = (marker: TravelMarker): L.LatLngExpression => [marker.coord[1], marker.coord[0]]

const createTravelIcon = (marker: TravelMarker) => {
  const color = marker.value >= 15 ? '#ff7a1a' : '#67d8ff'

  return L.divIcon({
    className: 'travel-marker-icon',
    html: `
      <span class="travel-marker-pulse" style="--marker-color:${color};"></span>
      <span class="travel-marker-core" style="--marker-color:${color};"></span>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18],
  })
}

const resizeWorldMap = () => {
  worldMap?.invalidateSize()
}

const renderTravelMarkers = () => {
  if (!worldMap || !markerLayer) {
    return
  }

  markerLayer.clearLayers()

  travelMarkers.value.forEach((marker) => {
    const leafletMarker = L.marker(toLatLng(marker), {
      icon: createTravelIcon(marker),
      title: marker.city,
    })

    leafletMarker.bindTooltip(marker.city, {
      direction: 'top',
      offset: [0, -14],
      permanent: true,
      className: 'travel-marker-label',
    })

    leafletMarker.bindPopup(`
      <div class="travel-map-popup">
        <strong>${marker.name}</strong>
        <span>${marker.city} / ${marker.value} 天</span>
      </div>
    `)

    markerLayer?.addLayer(leafletMarker)
  })

  if (travelMarkers.value.length > 0) {
    worldMap.fitBounds(L.latLngBounds(travelMarkers.value.map((marker) => toLatLng(marker))), {
      padding: [52, 52],
      maxZoom: 3,
    })
  }
}

const initWorldMap = () => {
  if (!worldMapRef.value) {
    return
  }

  worldMap?.remove()
  worldMap = null

  const mapElement = worldMapRef.value as HTMLDivElement & { _leaflet_id?: number }
  mapElement.replaceChildren()
  delete mapElement._leaflet_id

  worldMap = L.map(mapElement, {
    zoomControl: false,
    attributionControl: true,
    worldCopyJump: true,
    minZoom: 2,
    maxZoom: 8,
    maxBounds: [
      [-82, -180],
      [82, 180],
    ],
    maxBoundsViscosity: 0.7,
  }).setView([22, 35], 2)

  L.tileLayer(cartoDarkTileUrl, cartoDarkTileOptions).addTo(worldMap)

  L.control.zoom({ position: 'bottomright' }).addTo(worldMap)
  markerLayer = L.layerGroup().addTo(worldMap)
  renderTravelMarkers()

  setTimeout(resizeWorldMap, 80)
  setTimeout(resizeWorldMap, 280)
  window.addEventListener('resize', resizeWorldMap)
}

onMounted(() => {
  void nextTick(initWorldMap)
})

watch(travelMarkers, () => {
  renderTravelMarkers()
  setTimeout(resizeWorldMap, 80)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeWorldMap)
  worldMap?.remove()
  worldMap = null
  markerLayer = null
})
</script>

<style scoped lang="scss">
@mixin breakpoint($point) {
  @media screen and (max-width: $point) {
    @content;
  }
}

.world-travel-map-section {
  width: min(1920px, calc(100% - 150px));
  margin: 76px auto 0;
  scroll-margin-top: 110px;
  @include breakpoint(1200px) {
    width: min(100% - 48px, 1120px);
    margin-top: 48px;
  }
}

.section-heading {
  margin-bottom: 22px;
  text-align: center;

  p {
    margin: 0;
    color: #8fdfff;
    font-size: 12px;
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

.world-map-panel {
  position: relative;
  overflow: hidden;
  height: clamp(560px, 52vw, 680px);
  min-height: 560px;
  border: 1px solid rgba(143, 223, 255, 0.22);
  border-radius: 8px;
  background:
    linear-gradient(rgba(143, 223, 255, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(143, 223, 255, 0.08) 1px, transparent 1px),
    linear-gradient(180deg, rgba(13, 34, 56, 0.96), rgba(5, 12, 26, 0.98));
  background-size: 22px 22px, 22px 22px, 100% 100%;
  box-shadow: 0 26px 72px rgba(0, 0, 0, 0.42);
}

.world-map-toolbar,
.map-summary {
  position: relative;
  z-index: 2;
}

.world-map-toolbar {

  background: rgba(5, 10, 28, 0.72);
  h3 {
    color: #ffffff;
    font-size: 1.5rem;

  }
}

.map-kicker {
  color: rgba(143, 223, 255, 0.78);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.6px;
  text-transform: uppercase;
}

.map-chip {
  background: #ff7a1a !important;
  color: #071426 !important;
  font-weight: 900;
}

.world-map-chart {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: inherit;
  background: #071426;
  box-shadow: inset 0 0 0 1px rgba(143, 223, 255, 0.08);
}

:deep(.leaflet-container) {
  width: 100%;
  height: 100%;
  background: #071426;
  color: rgba(255, 255, 255, 0.86);
  font: inherit;
}

:deep(.leaflet-tile) {
  filter: saturate(0.88) contrast(1.08);
}

:deep(.leaflet-control-attribution) {
  background: rgba(5, 10, 28, 0.72);
  color: rgba(255, 255, 255, 0.62);
  font-size: 10px;
  backdrop-filter: blur(8px);

  a {
    color: #8fdfff;
  }
}

:deep(.leaflet-control-zoom) {
  overflow: hidden;
  border: 1px solid rgba(143, 223, 255, 0.22);
  border-radius: 8px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.28);

  a {
    width: 34px;
    height: 34px;
    border: 0;
    background: rgba(6, 15, 33, 0.9);
    color: #ffffff;
    line-height: 34px;

    &:hover {
      background: rgba(255, 122, 26, 0.9);
      color: #071426;
    }
  }
}

:deep(.travel-marker-icon) {
  background: transparent;
  border: 0;
}

:deep(.travel-marker-pulse),
:deep(.travel-marker-core) {
  position: absolute;
  inset: 50% auto auto 50%;
  display: block;
  border-radius: 999px;
  transform: translate(-50%, -50%);
}

:deep(.travel-marker-pulse) {
  width: 34px;
  height: 34px;
  border: 1px solid var(--marker-color);
  box-shadow: 0 0 20px var(--marker-color);
  opacity: 0.72;
  animation: markerPulse 1.9s ease-out infinite;
}

:deep(.travel-marker-core) {
  width: 13px;
  height: 13px;
  border: 2px solid rgba(255, 255, 255, 0.9);
  background: var(--marker-color);
  box-shadow:
    0 0 16px var(--marker-color),
    0 0 0 5px rgba(255, 122, 26, 0.14);
}

:deep(.travel-marker-label) {
  border: 0;
  border-radius: 999px;
  padding: 3px 8px;
  background: rgba(6, 15, 33, 0.72);
  color: rgba(255, 255, 255, 0.86);
  box-shadow: none;
  font-size: 11px;
  font-weight: 700;
  backdrop-filter: blur(8px);

  &::before {
    display: none;
  }
}

:deep(.leaflet-popup-content-wrapper),
:deep(.leaflet-popup-tip) {
  background: rgba(5, 10, 28, 0.94);
  color: #ffffff;
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.4);
}

:deep(.travel-map-popup) {
  display: grid;
  gap: 4px;
  min-width: 150px;

  strong {
    color: #ffffff;
    font-size: 13px;
  }

  span {
    color: rgba(255, 255, 255, 0.64);
    font-size: 12px;
  }
}

@keyframes markerPulse {
  0% {
    opacity: 0.82;
    transform: translate(-50%, -50%) scale(0.55);
  }

  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.65);
  }
}

.map-summary {
  position: absolute;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  width: min(460px, calc(100% - 48px));
  overflow: hidden;
  border: 1px solid rgba(143, 223, 255, 0.2);
  border-radius: 8px;
  background: rgba(4, 10, 25, 0.68);
  backdrop-filter: blur(12px);


  @include breakpoint(600px) {
    position: static;
    transform: none;
    width: 80px;

  }

  div {
    padding: 13px 16px;
    background: rgba(245, 251, 255, 0.05);
    text-align: center;
  }

  span,
  strong {
    display: block;
  }

  span {
    color: rgba(245, 251, 255, 0.58);
    font-size: 12px;
  }

  strong {
    margin-top: 4px;
    color: #ffffff;
    font-size: 20px;
  }
}

@include breakpoint(600px) {
  .world-travel-map-section {
    width: min(100% - 28px, 1120px);
  }

  .world-map-panel {
    height: 470px;
    min-height: 470px;
  }

  .world-map-toolbar {
    display: block;
  }

  .map-summary {
    grid-template-columns: 1fr;

    div {
      border-bottom: 1px solid rgba(255, 255, 255, 0.14);

      &:last-child {
        border-bottom: 0;
      }
    }
  }
}
</style>
