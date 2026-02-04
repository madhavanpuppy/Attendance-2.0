import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ConfigCardProps {
  fullDayRate: number;
  halfDayRate: number;
  onUpdateSettings: (fullDay: number, halfDay: number) => void;
  onExportJSON: () => void;
  onExportPDF: () => void;
}

const ConfigCard = ({ fullDayRate, halfDayRate, onUpdateSettings, onExportJSON, onExportPDF }: ConfigCardProps) => {
  const handleFullDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onUpdateSettings(value, halfDayRate);
  };

  const handleHalfDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onUpdateSettings(fullDayRate, value);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
      {/* Header */}
      <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
        <Settings className="w-4 h-4" />
        Configuration
      </h3>

      {/* Daily Rates */}
      <div className="mb-5">
        <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
          Daily Rates
        </label>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[0.65rem] font-semibold text-muted-foreground uppercase">
              Full
            </span>
            <Input
              type="number"
              value={fullDayRate}
              onChange={handleFullDayChange}
              className="pl-12 font-semibold"
            />
          </div>
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[0.65rem] font-semibold text-muted-foreground uppercase">
              Half
            </span>
            <Input
              type="number"
              value={halfDayRate}
              onChange={handleHalfDayChange}
              className="pl-12 font-semibold"
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
          Quick Actions
        </label>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onExportJSON}
          >
            JSON
          </Button>
          <Button
            variant="default"
            className="flex-1"
            onClick={onExportPDF}
          >
            PDF Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfigCard;
