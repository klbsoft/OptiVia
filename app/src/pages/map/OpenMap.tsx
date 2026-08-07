import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Schedule from '../schedule/Schedule';
import { useView } from '../../context/ViewContext';
import densifyRoute from "./juan_bosh_route";

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const busIcon = new L.Icon({
  iconUrl: '/opti-via/img/bus.png',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

const TOTAL_BUSES = 10;
const BUSES_PER_DIRECTION = 5;
const MAX_SPEED = 2000; 
const MIN_SPEED = 5000; 

/** Returns a random delay between min and max milliseconds */
const randomDelay = () => Math.floor(Math.random() * (MIN_SPEED - MAX_SPEED + 1) + MIN_SPEED);

export default function MapView() {
  const sanIsidro: [number, number] = [18.495602, -69.750599];
  const laMella: [number, number] = [18.500157, -69.852764];
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const { setCurrentView } = useView();

  const routePoints: [number, number][] = densifyRoute();

  // Get user location on mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  }, []);

  const center: [number, number] = [
    (sanIsidro[0] + laMella[0]) / 2,
    (sanIsidro[1] + laMella[1]) / 2,
  ];

  /** Bus state: each bus has its position index and direction */
  const [buses, setBuses] = useState(() => {
    return Array.from({ length: TOTAL_BUSES }, (_, i) => ({
      id: i,
      index: Math.floor((i / TOTAL_BUSES) * (routePoints.length - 1)),
      direction: i < BUSES_PER_DIRECTION ? 1 : -1
    }));
  });

  // Keep a ref to buses so individual timers always see the latest state
  const busesRef = useRef(buses);
  busesRef.current = buses;

  /**
   * Each bus gets its own independent timer with a random delay (3–7 seconds).
   * After each move, it schedules the next move with a fresh random delay.
   * This creates realistic staggered movement — some buses are fast, some slow.
   */
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    const moveBus = (busId: number) => {
      setBuses(prev =>
        prev.map(bus => {
          if (bus.id !== busId) return bus;

          const nextIndex = bus.index + bus.direction;

          // Hit the end: reverse
          if (nextIndex >= routePoints.length - 1) {
            return { ...bus, index: routePoints.length - 2, direction: -1 };
          }
          // Hit the start: reverse
          if (nextIndex <= 0) {
            return { ...bus, index: 1, direction: 1 };
          }

          return { ...bus, index: nextIndex };
        })
      );

      // Schedule this bus's next move with a new random delay
      const nextDelay = randomDelay();
      const timer = setTimeout(() => moveBus(busId), nextDelay);
      timers.push(timer);
    };

    // Kick off each bus with its own initial random delay
    buses.forEach(bus => {
      const initialDelay = randomDelay();
      const timer = setTimeout(() => moveBus(bus.id), initialDelay);
      timers.push(timer);
    });

    // Cleanup all timers on unmount
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div
      data-component="map-container"
      style={{
        flex: 1,
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <MapContainer
        center={center}
        zoom={11}
        style={{
          flex: 1,
          width: '100%',
          borderRadius: '12px',
          border: '5px solid white'
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* Render all 10 buses */}
        {buses.map(bus => (
          <Marker
            key={bus.id}
            position={routePoints[bus.index]}
            icon={busIcon}
          >
            <Popup>
              🚌 Bus {bus.id + 1} — {bus.direction === 1 ? '→' : '←'}
            </Popup>
          </Marker>
        ))}

        {/* San Isidro station */}
        <Marker
          position={sanIsidro}
          eventHandlers={{
            click: () => setCurrentView(<Schedule />)
          }}
        >
          <Popup>San Isidro</Popup>
        </Marker>

        {/* La Mella station */}
        <Marker
          position={laMella}
          eventHandlers={{
            click: () => setCurrentView(<Schedule />)
          }}
        >
          <Popup>Carretera Mella</Popup>
        </Marker>

        {/* User location */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={new L.Icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            })}
          >
            <Popup>Tu ubicación</Popup>
          </Marker>
        )}

        {/* Route line */}
        <Polyline
          positions={routePoints}
          color="#0367C7"
          weight={5}
          opacity={0.7}
        />
      </MapContainer>
    </div>
  );
}