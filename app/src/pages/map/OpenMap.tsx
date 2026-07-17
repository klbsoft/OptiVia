import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// import juan_bush_route from "./juan_bosh_route"
import Schedule from '../schedule/Schedule';
import { useView } from '../../context/ViewContext';
import juan_bush_route from './juan_bosh_route';
import densifyRoute from "./juan_bosh_route";


// Fix default marker icons in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});


  const busIcon = new L.Icon({
  iconUrl: '/img/bus.png',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});


export default function MapView() {
  // Coordinates for the two stations (approximate - you can adjust)
  const sanIsidro: [number, number] = [18.495602, -69.750599]; // Autopista San Isidro
  const laMella: [number, number] = [18.500157, -69.852764];   // Carretera Mella
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const {setCurrentView} = useView(); 


// Add all your route points here - easy!

/*
useEffect(() => {
  let watchId: number;

  if ('geolocation' in navigator) {
    // 1. Configure for maximum accuracy
    const options = {
      enableHighAccuracy: true,  // Forces the device to try to get a GPS fix
      timeout: 25000,            // Wait up to 10 seconds for a good signal
      maximumAge: 0              // Never use a cached location
    };

    // 2. Success handler
    const onSuccess = (position: GeolocationPosition) => {
      setUserLocation([position.coords.latitude, position.coords.longitude]);
      console.log(`📍 Accuracy: ${position.coords.accuracy} meters`);
    };

    // 3. Error handler
    const onError = (error: GeolocationPositionError) => {
      console.warn(`Location error (${error.code}): ${error.message}`);
      // Fallback to a sensible default for the demo if all else fails
      if (!userLocation) {
        //  setUserLocation([18.4693, -69.8894]); // San Isidro
        alert("La ubicacion no pudo ser capturada con presicion.");
      }
    };

    // 4. Start watching the position (this is the key change)
    watchId = navigator.geolocation.watchPosition(onSuccess, onError, options);
  }

  // 5. Cleanup: stop watching when the component unmounts
  return () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
    }
  };
}, []); // The empty dependency array ensures this runs only once
*/
const routePoints: [number, number][] = densifyRoute(); //juan_bush_route(); 
  
// Get user's current location
  
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

  // Center between the two stations
  const center: [number, number] = [
    (sanIsidro[0] + laMella[0]) / 2,
    (sanIsidro[1] + laMella[1]) / 2,
  ];

  const busIcon = new L.Icon({
  iconUrl: '/opti-via/img/bus.png',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

//   const percentToPx = (percent: number) => {
//   const vh = window.innerHeight;
//   return Math.max((percent / 100) * vh, 400);
// };
const [busIndex, setBusIndex] = useState(0);

// Add this effect
useEffect(() => {
  const timer = setInterval(() => {
    setBusIndex(prev => (prev + 1) % routePoints.length);
  }, 500); // Move every 500ms
  return () => clearInterval(timer);
}, []);
  return (
    <div 
      data-component="map-container"
      style={{ 
        flex: 1,                    // Takes all available space in Body
        width: '100%', 
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',            // Makes MapContainer fill the space
        flexDirection: 'column'     // Stack children vertically
      // paddingTop:'40%',
      // height: percentToPx(100), 
      // width: '100%', 
      // overflow: 'hidden',      // This is key - prevents map from spilling out
      // position: 'relative'      // Establishes containment context
    }}>
      <MapContainer 
        center={center} 
        zoom={11} 
        style={{ 
          flex: 1,                // Fills the parent div
          width: '100%',
          borderRadius: '12px',
          border: '5px solid white'
        
        
          // height: '100%', 
          // width: '100%',
          // borderRadius: '12px' ,
          // border: '5px solid red'
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={routePoints[busIndex]} icon={busIcon}>
          <Popup>🚌</Popup>
        </Marker>
        {/* Origin Marker */}
        <Marker position={sanIsidro}
        eventHandlers={{
            click:()=>{
                setCurrentView(<Schedule/>)
            }
        }}
        >
          <Popup>San Isidro</Popup>
        </Marker>
        
        // Use it:
        <Marker position={routePoints[routePoints.length-2]} icon={busIcon}>
            <Popup>OMZA Bus</Popup>
        </Marker>
        {/* Destination Marker */}
        <Marker position={laMella}
               eventHandlers={{
            click:()=>{
                setCurrentView(<Schedule/>)
            }
        }}
        >
          <Popup>Carretera Mella</Popup>
        </Marker>
        
        {/* User Location (red dot) */}
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
        
        {/* Route line between stations */}
        <Polyline 
          positions={routePoints /*[sanIsidro, laMella]*/} 
          color="#0367C7" 
          weight={5}
          opacity={0.7}
        />
      </MapContainer>
    </div>
  );
}