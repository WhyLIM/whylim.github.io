import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'framer-motion';
import { config } from '../config';

// Fix for default marker icon in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle map movements based on stage
function MapController({ 
  stage, 
  userLocation, 
  ownerLocation,
  shouldAnimate = true
}: { 
  stage: 1 | 2 | 3 | 4; 
  userLocation: [number, number] | null; 
  ownerLocation: [number, number];
  shouldAnimate?: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Defensive check for ownerLocation
    if (!ownerLocation || !Array.isArray(ownerLocation) || !Number.isFinite(ownerLocation[0]) || !Number.isFinite(ownerLocation[1])) {
      return;
    }

    const isValidUserLoc = !!(userLocation && Array.isArray(userLocation) && Number.isFinite(userLocation[0]) && Number.isFinite(userLocation[1]));
    const duration = shouldAnimate ? 3 : 0;

    try {
      // Explicitly create LatLng objects to ensure validity and catch errors early
      const ownerLatLng = L.latLng(ownerLocation[0], ownerLocation[1]);

      if (stage === 1) {
        // Stage 1: Focus on Owner
        map.flyTo(ownerLatLng, 13, {
          duration: duration,
          easeLinearity: 0.25
        });
      } else if (stage === 2) {
        // Stage 2: Focus on User (if available)
        if (isValidUserLoc) {
          try {
            const userLatLng = L.latLng(userLocation![0], userLocation![1]);
            map.flyTo(userLatLng, 13, {
              duration: duration,
              easeLinearity: 0.25
            });
          } catch (e) {
            console.warn("Invalid user location despite checks, falling back to owner:", userLocation, e);
            map.flyTo(ownerLatLng, 6, { 
              duration: duration,
              easeLinearity: 0.25
            });
          }
        } else {
          // If no user location, zoom out to a safe level that fills screen (6)
          map.flyTo(ownerLatLng, 6, { 
            duration: duration,
            easeLinearity: 0.25
          });
        }
      } else if (stage === 3 || stage === 4) {
        // Stage 3 & 4: Fit bounds to show both
        if (isValidUserLoc) {
          try {
            const userLatLng = L.latLng(userLocation![0], userLocation![1]);
            // Create bounds from the two points
            const bounds = L.latLngBounds([ownerLatLng, userLatLng]);
            
            if (bounds.isValid()) {
              map.flyToBounds(bounds, {
                padding: [50, 50],
                duration: duration,
                easeLinearity: 0.25
              });
            } else {
               map.flyTo(ownerLatLng, 6, { duration: duration, easeLinearity: 0.25 });
            }
          } catch (e) {
             console.warn("Invalid user location for bounds despite checks:", userLocation, e);
             map.flyTo(ownerLatLng, 6, { duration: duration, easeLinearity: 0.25 });
          }
        } else {
          // If no user location, maintain safe zoom level 6
          map.flyTo(ownerLatLng, 6, { 
            duration: duration,
            easeLinearity: 0.25
          });
        }
      }
    } catch (error) {
      console.error("MapController error:", error, { ownerLocation, userLocation, stage });
    }
  }, [stage, userLocation, ownerLocation, map, shouldAnimate]);

  return null;
}

interface MapBackgroundProps {
  theme: 'light' | 'dark';
  userLocation: [number, number] | null;
  ownerLocation: [number, number];
  stage: 1 | 2 | 3 | 4;
  shouldAnimate?: boolean;
}

export default function MapBackground({ theme, userLocation, ownerLocation, stage, shouldAnimate = true }: MapBackgroundProps) {
  // CartoDB tiles are elegant and minimalist
  const lightTiles = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
  const darkTiles = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
  
  const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

  // Validate ownerLocation
  if (!ownerLocation || !Number.isFinite(ownerLocation[0]) || !Number.isFinite(ownerLocation[1])) {
    return null; 
  }

  // Validate userLocation
  const validUserLocation = userLocation && Number.isFinite(userLocation[0]) && Number.isFinite(userLocation[1]) ? userLocation : null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="absolute inset-0 z-0 h-full w-full"
    >
      <MapContainer 
        center={ownerLocation} 
        zoom={4} 
        minZoom={5}
        scrollWheelZoom={false} 
        zoomControl={false}
        attributionControl={false}
        className="h-full w-full"
        style={{ background: theme === 'dark' ? '#121212' : '#F9F8F4' }}
      >
        <TileLayer
          attribution={attribution}
          url={theme === 'dark' ? darkTiles : lightTiles}
        />
        
        <MapController 
          stage={stage} 
          userLocation={validUserLocation} 
          ownerLocation={ownerLocation} 
          shouldAnimate={shouldAnimate}
        />

        {/* Owner Marker - Always visible */}
        <Marker position={ownerLocation}>
          <Popup className="font-sans">
            <div className="text-center">
              <p className="font-bold">{config.name}</p>
            </div>
          </Popup>
        </Marker>

        {/* User Marker - Visible if location known */}
        {validUserLocation && (
          <Marker position={validUserLocation}>
            <Popup className="font-sans">
              <div className="text-center">
                <p className="font-bold">You</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
      
      {/* Overlay gradient to fade map into background slightly */}
      <div className={`absolute inset-0 pointer-events-none transition-colors duration-500 ${
        theme === 'dark' 
          ? 'bg-black/20' 
          : 'bg-white/10'
      }`} />
    </motion.div>
  );
}
