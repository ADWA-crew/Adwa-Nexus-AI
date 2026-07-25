import { useQuery } from '@tanstack/react-query'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { PageTransition } from '@/app/components/PageTransition'
import { Skeleton } from '@/components/ui/skeleton'
import { apiClient } from '@/services/api/client'
import type { MapLocation } from '@/types'

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

async function getMapLocations(): Promise<MapLocation[]> {
  return apiClient.request<MapLocation[]>('/map/locations')
}

const museumCenter: [number, number] = [9.032, 38.7469]

export default function MapPage() {
  const { data: locations = [], isLoading } = useQuery({
    queryKey: ['map-locations'],
    queryFn: getMapLocations,
  })

  return (
    <PageTransition className="mx-auto max-w-6xl px-4 md:px-6 py-10">
      <header className="mb-8">
        <h1 className="font-display text-4xl font-bold">Museum Map</h1>
        <p className="text-muted-foreground mt-2">
          Navigate floors, galleries, and points of interest
        </p>
      </header>

      {isLoading ? (
        <Skeleton className="h-[500px] w-full rounded-2xl" />
      ) : (
        <div className="rounded-2xl border border-border overflow-hidden h-[500px] md:h-[600px]">
          <MapContainer
            center={museumCenter}
            zoom={17}
            className="h-full w-full"
            scrollWheelZoom
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {locations.map((location) => (
              <Marker key={location.id} position={[location.lat, location.lng]}>
                <Popup>
                  <strong>{location.name}</strong>
                  <br />
                  Floor {location.floor} · {location.type}
                  {location.description && (
                    <>
                      <br />
                      {location.description}
                    </>
                  )}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mt-6">
        {locations.map((location) => (
          <div
            key={location.id}
            className="rounded-xl border border-border bg-card p-4"
          >
            <p className="font-semibold">{location.name}</p>
            <p className="text-sm text-muted-foreground capitalize">
              {location.type} · Floor {location.floor}
            </p>
          </div>
        ))}
      </div>
    </PageTransition>
  )
}
