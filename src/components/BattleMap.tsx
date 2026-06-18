import { useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Battle } from "@/data/battles";

interface BattleMapProps {
  battles: Battle[];
  activeBattles: Battle[];
  onBattleClick: (battle: Battle) => void;
}

export default function BattleMap({ battles, activeBattles, onBattleClick }: BattleMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const onBattleClickRef = useRef(onBattleClick);
  onBattleClickRef.current = onBattleClick;

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [30, 20],
      zoom: 3,
      minZoom: 2,
      maxZoom: 8,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png").addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when battles/activeBattles change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    battles.forEach((battle) => {
      const isActive = activeBattles.some((b) => b.id === battle.id);
      const el = document.createElement("div");
      el.className = `battle-marker${isActive ? " active" : ""}`;

      const icon = L.divIcon({
        className: "",
        html: el.outerHTML,
        iconSize: isActive ? [16, 16] : [12, 12],
        iconAnchor: isActive ? [8, 8] : [6, 6],
      });

      const marker = L.marker([battle.lat, battle.lng], { icon })
        .addTo(map)
        .on("click", () => onBattleClickRef.current(battle));

      marker.bindTooltip(
        `<strong>${battle.name}</strong><br/>${battle.year}${battle.endYear ? `–${battle.endYear}` : ""} AD`,
        { direction: "top", offset: [0, -10] }
      );

      markersRef.current.push(marker);
    });

    // Fly to active battles
    if (activeBattles.length === 1) {
      map.flyTo([activeBattles[0].lat, activeBattles[0].lng], 5, { duration: 1.5 });
    } else if (activeBattles.length > 1) {
      const bounds = L.latLngBounds(activeBattles.map((b) => [b.lat, b.lng] as L.LatLngTuple));
      map.flyToBounds(bounds, { padding: [50, 50], duration: 1.5 });
    }
  }, [battles, activeBattles]);

  return <div ref={containerRef} className="w-full h-full" />;
}
