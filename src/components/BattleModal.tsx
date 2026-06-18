import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Battle } from "@/data/battles";
import { Swords, Users, Trophy, BookOpen, Calendar, MapPin, Shield, Scale, ScrollText } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BattleModalProps {
  battle: Battle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BattleModal({ battle, open, onOpenChange }: BattleModalProps) {
  if (!battle) return null;

  const typeLabel = {
    battle: "Battle",
    war: "War",
    siege: "Siege",
    campaign: "Campaign",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-2xl max-h-[85vh] p-0">
        <ScrollArea className="max-h-[85vh]">
          <div className="p-6">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest rounded bg-primary/20 text-primary font-body">
                  {typeLabel[battle.type]}
                </span>
              </div>
              <DialogTitle className="font-display text-xl text-foreground">
                {battle.name}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              {/* Date & Location */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground font-body">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-primary" />
                  {battle.year}{battle.endYear ? `–${battle.endYear}` : ""} AD
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary" />
                  {battle.location}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-foreground/85 leading-relaxed font-body">
                {battle.description}
              </p>

              {/* Context */}
              {battle.context && (
                <div className="p-3 rounded-md bg-primary/5 border border-primary/10">
                  <p className="text-[10px] uppercase tracking-wider text-primary/70 font-body mb-1 flex items-center gap-1.5">
                    <ScrollText className="w-3.5 h-3.5" /> Historical Context
                  </p>
                  <p className="text-sm text-foreground/80 leading-relaxed font-body italic">
                    {battle.context}
                  </p>
                </div>
              )}

              {/* Details grid */}
              <div className="grid grid-cols-1 gap-3">
                <InfoRow icon={<Users className="w-4 h-4" />} label="Belligerents" value={battle.belligerents} />
                {battle.commanders && (
                  <InfoRow icon={<Shield className="w-4 h-4" />} label="Commanders" value={battle.commanders} />
                )}
                {battle.strength && (
                  <InfoRow icon={<Scale className="w-4 h-4" />} label="Forces" value={battle.strength} />
                )}
                <InfoRow icon={<Trophy className="w-4 h-4" />} label="Outcome" value={battle.outcome} />
                {battle.casualties && (
                  <InfoRow icon={<Swords className="w-4 h-4" />} label="Casualties" value={battle.casualties} />
                )}
                <InfoRow icon={<BookOpen className="w-4 h-4" />} label="Significance" value={battle.significance} />
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-3 p-3 rounded-md bg-secondary/50">
      <div className="text-primary mt-0.5 shrink-0">{icon}</div>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-body">{label}</p>
        <p className="text-sm text-foreground/90 font-body leading-relaxed">{value}</p>
      </div>
    </div>
  );
}
