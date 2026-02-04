import { X, Check, Clock, XCircle, Eraser } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AttendanceModalProps {
  isOpen: boolean;
  selectedDate: string | null;
  fullDayRate: number;
  halfDayRate: number;
  onClose: () => void;
  onMarkAttendance: (type: 'full' | 'half' | 'absent' | 'clear') => void;
}

const AttendanceModal = ({
  isOpen,
  selectedDate,
  fullDayRate,
  halfDayRate,
  onClose,
  onMarkAttendance,
}: AttendanceModalProps) => {
  if (!isOpen || !selectedDate) return null;

  const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
  });

  const handleAction = (type: 'full' | 'half' | 'absent' | 'clear') => {
    onMarkAttendance(type);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      <div
        className={cn(
          'bg-card w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 pb-8',
          'shadow-2xl animate-slide-up'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle (mobile) */}
        <div className="w-10 h-1 bg-border rounded-full mx-auto mb-6 sm:hidden" />

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-foreground">{formattedDate}</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-2xl"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Full Day */}
          <button
            onClick={() => handleAction('full')}
            className="action-card-full border border-border bg-card p-4 rounded-xl text-left flex items-center gap-3 transition-all active:scale-[0.98] hover:bg-muted/30"
          >
            <div className="action-icon w-9 h-9 rounded-full flex items-center justify-center shrink-0">
              <Check className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">Full Day</span>
              <span className="text-xs text-muted-foreground">Rs. {fullDayRate}</span>
            </div>
          </button>

          {/* Half Day */}
          <button
            onClick={() => handleAction('half')}
            className="action-card-half border border-border bg-card p-4 rounded-xl text-left flex items-center gap-3 transition-all active:scale-[0.98] hover:bg-muted/30"
          >
            <div className="action-icon w-9 h-9 rounded-full flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">Half Day</span>
              <span className="text-xs text-muted-foreground">Rs. {halfDayRate}</span>
            </div>
          </button>

          {/* Absent */}
          <button
            onClick={() => handleAction('absent')}
            className="action-card-absent border border-border bg-card p-4 rounded-xl text-left flex items-center gap-3 transition-all active:scale-[0.98] hover:bg-muted/30"
          >
            <div className="action-icon w-9 h-9 rounded-full flex items-center justify-center shrink-0">
              <XCircle className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">Absent</span>
              <span className="text-xs text-muted-foreground">No Pay</span>
            </div>
          </button>

          {/* Clear */}
          <button
            onClick={() => handleAction('clear')}
            className="action-card-clear border border-border bg-card p-4 rounded-xl text-left flex items-center gap-3 transition-all active:scale-[0.98] hover:bg-muted/30"
          >
            <div className="action-icon w-9 h-9 rounded-full flex items-center justify-center shrink-0">
              <Eraser className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">Clear</span>
              <span className="text-xs text-muted-foreground">Reset</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceModal;
