import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import type { Language } from '../lib/i18n';
import { translations } from '../lib/i18n';
import { gsap, useGSAP } from '../lib/gsap';

const ownerIcon = L.divIcon({
  className: 'map-marker-shell',
  html: '<span class="map-marker map-marker-owner" aria-hidden="true"></span>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const visitorIcon = L.divIcon({
  className: 'map-marker-shell',
  html: '<span class="map-marker map-marker-visitor" aria-hidden="true"></span>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

function MapController({ stage, userLocation, ownerLocation, shouldAnimate }: {
  stage: 1 | 2 | 3 | 4;
  userLocation: [number, number] | null;
  ownerLocation: [number, number];
  shouldAnimate: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    const owner = L.latLng(ownerLocation[0], ownerLocation[1]);
    const visitor = userLocation ? L.latLng(userLocation[0], userLocation[1]) : null;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = shouldAnimate && !reduceMotion ? 1.45 : 0;
    const flight = { duration, easeLinearity: 0.35 };

    if (stage === 1) {
      map.flyTo(owner, 12, flight);
      return;
    }

    if (stage === 2 && visitor) {
      map.flyTo(visitor, 11, flight);
      return;
    }

    if ((stage === 3 || stage === 4) && visitor) {
      map.flyToBounds(L.latLngBounds([owner, visitor]), {
        padding: [96, 96],
        maxZoom: 12,
        ...flight,
      });
      return;
    }

    map.flyTo(owner, 5, flight);
  }, [map, ownerLocation, shouldAnimate, stage, userLocation]);

  return null;
}

interface MapBackgroundProps {
  theme: 'light' | 'dark';
  language: Language;
  userLocation: [number, number] | null;
  ownerLocation: [number, number];
  stage: 1 | 2 | 3 | 4;
  shouldAnimate?: boolean;
}

export default function MapBackground({
  theme,
  language,
  userLocation,
  ownerLocation,
  stage,
  shouldAnimate = true,
}: MapBackgroundProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const t = translations[language].map;
  const validOwner = ownerLocation.every(Number.isFinite);
  const validVisitor = userLocation?.every(Number.isFinite) ? userLocation : null;

  useGSAP(() => {
    gsap.fromTo(rootRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.1, ease: 'power2.out' });
  }, { scope: rootRef });

  if (!validOwner) return null;

  return (
    <div ref={rootRef} className="absolute inset-0 h-full w-full">
      <MapContainer
        attributionControl
        center={ownerLocation}
        className="h-full w-full"
        minZoom={3}
        scrollWheelZoom={false}
        style={{ background: theme === 'dark' ? '#11110f' : '#f2efe8' }}
        zoom={4}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          className="map-tiles"
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController
          stage={stage}
          userLocation={validVisitor}
          ownerLocation={ownerLocation}
          shouldAnimate={shouldAnimate}
        />
        <Marker icon={ownerIcon} position={ownerLocation}>
          <Popup><strong>{t.owner}</strong></Popup>
        </Marker>
        {validVisitor && (
          <Marker icon={visitorIcon} position={validVisitor}>
            <Popup><strong>{t.visitor}</strong></Popup>
          </Marker>
        )}
      </MapContainer>
      <div className="pointer-events-none absolute inset-0 bg-[rgb(var(--canvas-rgb)/0.12)]" />
    </div>
  );
}
