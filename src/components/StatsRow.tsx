import { CalendarCheck, Clock } from 'lucide-react';

interface StatsRowProps {
  fullDays: number;
  halfDays: number;
}

const StatsRow = ({ fullDays, halfDays }: StatsRowProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Full Days */}
      <div className="bg-card border border-border rounded-lg p-4 flex flex-col items-center justify-center shadow-sm">
        <div className="w-8 h-8 rounded-full bg-success/10 text-success flex items-center justify-center mb-2">
          <CalendarCheck className="w-4 h-4" />
        </div>
        <span className="text-2xl font-bold text-foreground">{fullDays}</span>
        <span className="text-xs text-muted-foreground mt-1">Full Days</span>
      </div>

      {/* Half Days */}
      <div className="bg-card border border-border rounded-lg p-4 flex flex-col items-center justify-center shadow-sm">
        <div className="w-8 h-8 rounded-full bg-warning/10 text-warning flex items-center justify-center mb-2">
          <Clock className="w-4 h-4" />
        </div>
        <span className="text-2xl font-bold text-foreground">{halfDays}</span>
        <span className="text-xs text-muted-foreground mt-1">Half Days</span>
      </div>
    </div>
  );
};

export default StatsRow;
