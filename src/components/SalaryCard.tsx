import { Eye } from 'lucide-react';

interface SalaryCardProps {
  netSalary: number;
  totalSalary: number;
  totalAdvances: number;
}

const SalaryCard = ({ netSalary, totalSalary, totalAdvances }: SalaryCardProps) => {
  return (
    <div className="salary-card-gradient text-primary-foreground rounded-lg p-6 shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center opacity-70 mb-2">
        <span className="text-[0.7rem] font-semibold tracking-wider">CURRENT NET SALARY</span>
        <Eye className="w-4 h-4" />
      </div>

      {/* Main Amount */}
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
        Rs. {netSalary.toFixed(2)}
      </h2>

      {/* Breakdown */}
      <div className="flex items-center justify-between bg-white/10 p-3 rounded-lg">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs opacity-70">Earned</span>
          <span className="text-sm font-semibold">Rs. {totalSalary.toFixed(2)}</span>
        </div>
        <div className="w-px h-6 bg-white/20" />
        <div className="flex flex-col gap-0.5">
        <span className="text-xs opacity-70">Advances</span>
          <span className="text-sm font-semibold opacity-80">Rs. {totalAdvances.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default SalaryCard;
