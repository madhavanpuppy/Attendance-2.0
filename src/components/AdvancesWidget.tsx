import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Advance {
  date: string;
  amount: number;
  originalIndex: number;
}

interface AdvancesWidgetProps {
  advances: Advance[];
  onAddAdvance: (date: string, amount: number) => void;
  onDeleteAdvance: (index: number) => void;
}

const AdvancesWidget = ({ advances, onAddAdvance, onDeleteAdvance }: AdvancesWidgetProps) => {
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');

  const handleAdd = () => {
    const amountNum = parseFloat(amount);
    if (!date || isNaN(amountNum) || amountNum <= 0) {
      return;
    }
    onAddAdvance(date, amountNum);
    setDate('');
    setAmount('');
  };

  const handleDelete = (index: number) => {
    if (confirm('Delete this advance?')) {
      onDeleteAdvance(index);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
      {/* Header */}
      <h3 className="text-sm font-medium text-foreground mb-4">
        Advance Payments
      </h3>

      {/* Input Row */}
      <div className="flex gap-3 mb-5">
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="flex-1"
        />
        <Input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="flex-1"
        />
        <Button
          size="icon"
          className="bg-primary hover:bg-primary-dark shrink-0"
          onClick={handleAdd}
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      {/* Advances List */}
      <div className="flex flex-col gap-2">
        {advances.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-4">
            No advances this month
          </div>
        ) : (
          advances.map((advance) => (
            <div
              key={`${advance.date}-${advance.originalIndex}`}
              className="flex justify-between items-center p-3 border border-border rounded-lg bg-muted/30"
            >
              <div className="text-sm font-medium">
                {formatDate(advance.date)}
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-destructive">
                  Rs. {advance.amount.toFixed(2)}
                </span>
                <button
                  onClick={() => handleDelete(advance.originalIndex)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdvancesWidget;
