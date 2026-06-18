import { useCallback, useMemo, useRef, useState } from "react";
import { Battle } from "@/data/battles";
import { motion } from "framer-motion";

interface TimelineProps {
  battles: Battle[];
  currentYear: number;
  onYearChange: (year: number) => void;
  onBattleClick: (battle: Battle) => void;
}

const ERA_LABELS = [
  { year: 0, label: "0 AD" },
  { year: 500, label: "500" },
  { year: 1000, label: "1000" },
  { year: 1500, label: "1500" },
  { year: 1800, label: "1800" },
  { year: 1900, label: "1900" },
  { year: 1950, label: "1950" },
  { year: 2000, label: "2000" },
];

export default function Timeline({ battles, currentYear, onYearChange, onBattleClick }: TimelineProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const MIN_YEAR = 0;
  const MAX_YEAR = 2026;

  const yearToPercent = useCallback(
    (year: number) => ((year - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100,
    []
  );

  const handlePointerEvent = useCallback(
    (e: React.PointerEvent | PointerEvent) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const pct = x / rect.width;
      const year = Math.round(MIN_YEAR + pct * (MAX_YEAR - MIN_YEAR));
      onYearChange(Math.max(MIN_YEAR, Math.min(MAX_YEAR, year)));
    },
    [onYearChange]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      setIsDragging(true);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      handlePointerEvent(e);
    },
    [handlePointerEvent]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (isDragging) handlePointerEvent(e);
    },
    [isDragging, handlePointerEvent]
  );

  const handlePointerUp = useCallback(() => setIsDragging(false), []);

  const sortedBattles = useMemo(
    () => [...battles].sort((a, b) => a.year - b.year),
    [battles]
  );

  const typeColors: Record<string, string> = {
    battle: "bg-primary",
    war: "bg-accent",
    siege: "bg-primary/70",
    campaign: "bg-accent/70",
  };

  return (
    <div className="w-full px-4 md:px-8 py-3">
      {/* Year display */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-display text-xs text-muted-foreground">0 AD</span>
        <motion.span
          key={currentYear}
          initial={{ scale: 1.2, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          className="font-display text-2xl font-bold text-primary"
        >
          {currentYear} AD
        </motion.span>
        <span className="font-display text-xs text-muted-foreground">2026 AD</span>
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        className="relative h-12 cursor-pointer select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Background track */}
        <div className="absolute top-5 left-0 right-0 h-1.5 rounded-full bg-secondary" />
        
        {/* Active track */}
        <div
          className="absolute top-5 left-0 h-1.5 rounded-full bg-primary/50"
          style={{ width: `${yearToPercent(currentYear)}%` }}
        />

        {/* Era labels */}
        {ERA_LABELS.map((era) => (
          <div
            key={era.year}
            className="absolute top-9 -translate-x-1/2"
            style={{ left: `${yearToPercent(era.year)}%` }}
          >
            <div className="w-px h-2 bg-muted-foreground/30 mx-auto" />
            <span className="text-[10px] text-muted-foreground/50 font-body">{era.label}</span>
          </div>
        ))}

        {/* Battle indicators */}
        {sortedBattles.map((battle) => (
          <button
            key={battle.id}
            className={`absolute top-3 w-2.5 h-2.5 rounded-full -translate-x-1/2 transition-all duration-200 hover:scale-150 ${typeColors[battle.type]} ${
              battle.year <= currentYear ? "opacity-100" : "opacity-30"
            }`}
            style={{ left: `${yearToPercent(battle.year)}%` }}
            title={`${battle.name} (${battle.year})`}
            onClick={(e) => {
              e.stopPropagation();
              onBattleClick(battle);
            }}
          />
        ))}

        {/* Slider thumb */}
        <div
          className="absolute top-3 w-5 h-5 -translate-x-1/2 rounded-full bg-primary border-2 border-primary-foreground shadow-lg shadow-primary/40 transition-transform"
          style={{
            left: `${yearToPercent(currentYear)}%`,
            transform: `translateX(-50%) scale(${isDragging ? 1.3 : 1})`,
          }}
        />
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-1 justify-center">
        {Object.entries(typeColors).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${color}`} />
            <span className="text-[10px] text-muted-foreground capitalize font-body">{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
