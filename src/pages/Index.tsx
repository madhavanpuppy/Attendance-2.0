import { useState } from "react";
import Navbar from "@/components/Navbar";
import SalaryCard from "@/components/SalaryCard";
import StatsRow from "@/components/StatsRow";
import ConfigCard from "@/components/ConfigCard";
import Calendar from "@/components/Calendar";
import AdvancesWidget from "@/components/AdvancesWidget";
import AttendanceModal from "@/components/AttendanceModal";
import { useAttendance } from "@/hooks/useAttendance";

const Index = () => {
  const {
    data,
    viewDate,
    changeMonth,
    updateSettings,
    markAttendance,
    addAdvance,
    deleteAdvance,
    calculateSalary,
    getMonthlyAdvances,
    exportData,
    exportPDF,
  } = useAttendance();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const salaryData = calculateSalary();
  const monthlyAdvances = getMonthlyAdvances();

  const handleDayClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    setIsModalOpen(true);
  };

  const handleMarkAttendance = (type: "full" | "half" | "absent" | "clear") => {
    if (selectedDate) {
      markAttendance(selectedDate, type);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 md:px-5 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">
          {/* Sidebar - Shows below on mobile */}
          <aside className="flex flex-col gap-5 order-2 lg:order-1">
            <SalaryCard
              netSalary={salaryData.netSalary}
              totalSalary={salaryData.totalSalary}
              totalAdvances={salaryData.totalAdvances}
            />

            <StatsRow fullDays={salaryData.fullDays} halfDays={salaryData.halfDays} />

            <ConfigCard
              fullDayRate={data.settings.fullDay}
              halfDayRate={data.settings.halfDay}
              onUpdateSettings={updateSettings}
              onExportJSON={exportData}
              onExportPDF={exportPDF}
            />

            {/* Footer Credit */}
            <p className="text-center text-xs text-muted-foreground">
              Engineered by <span className="text-primary font-semibold">Maddy</span>
            </p>
          </aside>

          {/* Main Content */}
          <main className="flex flex-col gap-6 order-1 lg:order-2">
            <Calendar
              viewDate={viewDate}
              attendance={data.attendance}
              onChangeMonth={changeMonth}
              onDayClick={handleDayClick}
            />

            <AdvancesWidget advances={monthlyAdvances} onAddAdvance={addAdvance} onDeleteAdvance={deleteAdvance} />
          </main>
        </div>
      </div>

      {/* Attendance Modal */}
      <AttendanceModal
        isOpen={isModalOpen}
        selectedDate={selectedDate}
        fullDayRate={data.settings.fullDay}
        halfDayRate={data.settings.halfDay}
        onClose={handleCloseModal}
        onMarkAttendance={handleMarkAttendance}
      />
    </div>
  );
};

export default Index;
