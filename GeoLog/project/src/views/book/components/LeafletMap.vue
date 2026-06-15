<template>
  <div ref="mapContainer" class="leaflet-map"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { cartoDarkTileOptions, cartoDarkTileUrl } from '@/utils/mapTiles'
import type { JourneyItem } from '../types'

const props = defineProps<{
  items: JourneyItem[]
  activeItemId?: string | null
}>()

const mapContainer = ref<HTMLElement | null>(null)
let map: L.Map | null = null
let markersLayer: L.LayerGroup | null = null
const markerMap = new Map<string, L.Marker>()

const createIcon = (active: boolean) => L.divIcon({
  className: 'custom-marker',
  html: `<svg width="${active ? 32 : 24}" height="${active ? 48 : 36}" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24c0-6.6-5.4-12-12-12z" fill="${active ? '#ff6d00' : '#e68a00'}"/>
    <circle cx="12" cy="12" r="5" fill="#fff"/>
  </svg>`,
  iconSize: active ? [32, 48] : [24, 36],
  iconAnchor: active ? [16, 48] : [12, 36],
  popupAnchor: [0, active ? -48 : -36],
})

const initMap = () => {
  if (!mapContainer.value) return

  map = L.map(mapContainer.value, {
    zoomControl: false,
    attributionControl: true,
  }).setView([26.2, 127.68], 12)

  L.tileLayer(cartoDarkTileUrl, cartoDarkTileOptions).addTo(map)

  L.control.zoom({ position: 'bottomright' }).addTo(map)

  markersLayer = L.layerGroup().addTo(map)
  updateMarkers()
}

const updateMarkers = () => {
  if (!map || !markersLayer) return
  markersLayer.clearLayers()
  markerMap.clear()

  const validItems = props.items.filter(item => item.lat && item.lng)
  if (validItems.length === 0) return

  validItems.forEach(item => {
    const isActive = item.id === props.activeItemId
    const marker = L.marker([item.lat!, item.lng!], { icon: createIcon(isActive) })
    marker.bindPopup(`
      <div style="font-size:12px;color:#333;">
        <strong>${item.title}</strong><br/>
        <span>${item.time}</span>
      </div>
    `)
    markersLayer!.addLayer(marker)
    markerMap.set(item.id, marker)
  })

  // Fit bounds to show all markers
  const bounds = L.latLngBounds(validItems.map(item => [item.lat!, item.lng!]))
  map.fitBounds(bounds, { padding: [30, 30], maxZoom: 14 })
}

const flyToItem = (itemId: string | null | undefined) => {
  if (!map || !itemId) return

  const item = props.items.find(i => i.id === itemId)
  if (!item?.lat || !item?.lng) return

  // Update all marker icons
  markerMap.forEach((marker, id) => {
    marker.setIcon(createIcon(id === itemId))
  })

  // Smooth fly to the active marker
  map.flyTo([item.lat, item.lng], 15, {
    duration: 1.2,
    easeLinearity: 0.25,
  })
}

watch(() => props.items, updateMarkers, { deep: true })
watch(() => props.activeItemId, flyToItem)

onMounted(initMap)

onBeforeUnmount(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<style scoped>
.leaflet-map {
  width: 100%;
  height: 100%;
  min-height: 400px;
  border-radius: 12px;
  overflow: hidden;
}

.leaflet-map :deep(.leaflet-tile) {
  filter: saturate(0.88) contrast(1.08);
}

.leaflet-map :deep(.leaflet-control-attribution) {
  background: rgba(5, 10, 28, 0.72);
  color: rgba(255, 255, 255, 0.62);
  font-size: 10px;
  backdrop-filter: blur(8px);
}

.leaflet-map :deep(.leaflet-control-attribution a) {
  color: #8fdfff;
}
</style>

<style>
.custom-marker {
  background: none !important;
  border: none !important;
}
</style>
