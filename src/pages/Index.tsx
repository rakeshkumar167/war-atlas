import { useState, useMemo, useCallback } from "react";
import { battles, Battle } from "@/data/battles";
import BattleMap from "@/components/BattleMap";
import Timeline from "@/components/Timeline";
import BattleModal from "@/components/BattleModal";
import { Swords } from "lucide-react";

const Index = () => {
  const [currentYear, setCurrentYear] = useState(1945);
  const [selectedBattle, setSelectedBattle] = useState<Battle | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const visibleBattles = useMemo(
    () => battles.filter((b) => b.year <= currentYear),
    [currentYear]
  );

  // Battles within a ±30 year window are "active" (highlighted)
  const activeBattles = useMemo(
    () =>
      battles.filter(
        (b) =>
          b.year <= currentYear &&
          b.year >= currentYear - 30 &&
          (b.endYear ? b.endYear >= currentYear - 30 : true)
      ),
    [currentYear]
  );

  const handleBattleClick = useCallback((battle: Battle) => {
    setSelectedBattle(battle);
    setModalOpen(true);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 md:px-8 py-3 border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <Swords className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-display font-semibold text-foreground tracking-wide">
          Chronicles of War
        </h1>
        <span className="ml-auto text-xs text-muted-foreground font-body">
          {visibleBattles.length} of {battles.length} events shown
        </span>
      </header>

      {/* Map */}
      <div className="flex-1 relative">
        <BattleMap
          battles={visibleBattles}
          activeBattles={activeBattles}
          onBattleClick={handleBattleClick}
        />
      </div>

      {/* Timeline */}
      <div className="border-t border-border/50 bg-card/80 backdrop-blur-sm">
        <Timeline
          battles={battles}
          currentYear={currentYear}
          onYearChange={setCurrentYear}
          onBattleClick={handleBattleClick}
        />
      </div>

      {/* Modal */}
      <BattleModal
        battle={selectedBattle}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
};

export default Index;
