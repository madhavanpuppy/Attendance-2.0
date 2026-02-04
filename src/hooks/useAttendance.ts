import { useState, useEffect, useCallback } from 'react';
import jsPDF from 'jspdf';

export interface AttendanceData {
  settings: {
    fullDay: number;
    halfDay: number;
  };
  attendance: Record<string, 'full' | 'half' | 'absent'>;
  advances: Array<{ date: string; amount: number }>;
}

const STORAGE_KEY = 'attendanceData';

const defaultData: AttendanceData = {
  settings: {
    fullDay: 400,
    halfDay: 250,
  },
  attendance: {},
  advances: [],
};

export const useAttendance = () => {
  const [data, setData] = useState<AttendanceData>(defaultData);
  const [viewDate, setViewDate] = useState(new Date());

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.settings) {
          parsed.settings = { fullDay: 400, halfDay: 250 };
        }
        setData(parsed);
      }
    } catch (e) {
      console.error('Failed to load attendance data:', e);
    }
  }, []);

  // Save data to localStorage whenever it changes
  const saveData = useCallback((newData: AttendanceData) => {
    setData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  }, []);

  const getViewMonthKey = useCallback(() => {
    return `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}`;
  }, [viewDate]);

  const changeMonth = useCallback((offset: number) => {
    setViewDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + offset);
      return newDate;
    });
  }, []);

  const updateSettings = useCallback((fullDay: number, halfDay: number) => {
    saveData({
      ...data,
      settings: { fullDay, halfDay },
    });
  }, [data, saveData]);

  const markAttendance = useCallback((dateStr: string, type: 'full' | 'half' | 'absent' | 'clear') => {
    const newAttendance = { ...data.attendance };
    
    if (type === 'clear') {
      delete newAttendance[dateStr];
    } else {
      newAttendance[dateStr] = type;
    }

    saveData({
      ...data,
      attendance: newAttendance,
    });
  }, [data, saveData]);

  const addAdvance = useCallback((date: string, amount: number) => {
    saveData({
      ...data,
      advances: [...data.advances, { date, amount }],
    });
  }, [data, saveData]);

  const deleteAdvance = useCallback((index: number) => {
    const newAdvances = [...data.advances];
    newAdvances.splice(index, 1);
    saveData({
      ...data,
      advances: newAdvances,
    });
  }, [data, saveData]);

  const calculateSalary = useCallback(() => {
    const currentViewMonth = getViewMonthKey();
    let fullDays = 0;
    let halfDays = 0;

    Object.entries(data.attendance).forEach(([date, status]) => {
      if (date.startsWith(currentViewMonth)) {
        if (status === 'full') fullDays++;
        else if (status === 'half') halfDays++;
      }
    });

    const monthlyAdvances = data.advances.filter(adv => adv.date.startsWith(currentViewMonth));
    const totalSalary = (fullDays * data.settings.fullDay) + (halfDays * data.settings.halfDay);
    const totalAdvances = monthlyAdvances.reduce((sum, adv) => sum + adv.amount, 0);
    const netSalary = totalSalary - totalAdvances;

    return {
      fullDays,
      halfDays,
      rateFull: data.settings.fullDay,
      rateHalf: data.settings.halfDay,
      totalSalary,
      totalAdvances,
      netSalary,
    };
  }, [data, getViewMonthKey]);

  const getMonthlyAdvances = useCallback(() => {
    const currentViewMonth = getViewMonthKey();
    return data.advances
      .map((adv, index) => ({ ...adv, originalIndex: index }))
      .filter(adv => adv.date.startsWith(currentViewMonth))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [data.advances, getViewMonthKey]);

  const exportData = useCallback(() => {
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-data-${getViewMonthKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [data, getViewMonthKey]);

  const exportPDF = useCallback(() => {
    const salary = calculateSalary();
    const monthName = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    const currentMonthKey = getViewMonthKey();

    const attendanceEntries = Object.entries(data.attendance)
      .filter(([date]) => date.startsWith(currentMonthKey))
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    // Gradient Header (indigo to purple)
    for (let i = 0; i < 45; i++) {
      const ratio = i / 45;
      doc.setFillColor(
        Math.round(79 + ratio * (147 - 79)),
        Math.round(70 + ratio * (51 - 70)),
        Math.round(229 + ratio * (234 - 229))
      );
      doc.rect(0, i, pageWidth, 1, 'F');
    }
    
    // Accent stripe
    doc.setFillColor(16, 185, 129); // Emerald
    doc.rect(0, 45, pageWidth, 4, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Attendance Report', margin, 28);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(monthName, pageWidth - margin, 28, { align: 'right' });

    let yPos = 65;

    // Summary Section Title with accent
    doc.setFillColor(79, 70, 229);
    doc.roundedRect(margin, yPos - 5, 4, 16, 2, 2, 'F');
    doc.setTextColor(79, 70, 229);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary', margin + 10, yPos + 5);
    yPos += 20;

    // Summary Cards Row
    const cardWidth = (contentWidth - 20) / 3;
    const cardHeight = 50;

    // Card 1: Full Days (Green)
    doc.setFillColor(220, 252, 231);
    doc.roundedRect(margin, yPos, cardWidth, cardHeight, 6, 6, 'F');
    doc.setFillColor(16, 185, 129);
    doc.roundedRect(margin, yPos, cardWidth, 6, 6, 0, 'F');
    doc.rect(margin, yPos + 3, cardWidth, 3, 'F');
    doc.setTextColor(22, 101, 52);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Full Days', margin + cardWidth / 2, yPos + 20, { align: 'center' });
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(String(salary.fullDays), margin + cardWidth / 2, yPos + 38, { align: 'center' });

    // Card 2: Half Days (Amber)
    const card2X = margin + cardWidth + 10;
    doc.setFillColor(254, 243, 199);
    doc.roundedRect(card2X, yPos, cardWidth, cardHeight, 6, 6, 'F');
    doc.setFillColor(245, 158, 11);
    doc.roundedRect(card2X, yPos, cardWidth, 6, 6, 0, 'F');
    doc.rect(card2X, yPos + 3, cardWidth, 3, 'F');
    doc.setTextColor(146, 64, 14);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Half Days', card2X + cardWidth / 2, yPos + 20, { align: 'center' });
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(String(salary.halfDays), card2X + cardWidth / 2, yPos + 38, { align: 'center' });

    // Card 3: Advances (Red)
    const card3X = margin + (cardWidth + 10) * 2;
    doc.setFillColor(254, 226, 226);
    doc.roundedRect(card3X, yPos, cardWidth, cardHeight, 6, 6, 'F');
    doc.setFillColor(239, 68, 68);
    doc.roundedRect(card3X, yPos, cardWidth, 6, 6, 0, 'F');
    doc.rect(card3X, yPos + 3, cardWidth, 3, 'F');
    doc.setTextColor(153, 27, 27);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Advances', card3X + cardWidth / 2, yPos + 20, { align: 'center' });
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(String(salary.totalAdvances), card3X + cardWidth / 2, yPos + 38, { align: 'center' });

    yPos += cardHeight + 15;

    // Net Salary Banner
    doc.setFillColor(16, 185, 129);
    doc.roundedRect(margin, yPos, contentWidth, 35, 6, 6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Net Salary', margin + 15, yPos + 15);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(`${salary.netSalary}`, margin + 15, yPos + 28);
    
    // Total Earned on right
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Total Earned', pageWidth - margin - 15, yPos + 15, { align: 'right' });
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`${salary.totalSalary}`, pageWidth - margin - 15, yPos + 28, { align: 'right' });

    yPos += 50;

    // Attendance Log Title
    doc.setFillColor(79, 70, 229);
    doc.roundedRect(margin, yPos - 5, 4, 16, 2, 2, 'F');
    doc.setTextColor(79, 70, 229);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Attendance Log', margin + 10, yPos + 5);
    yPos += 18;

    // Table header (gradient purple)
    for (let i = 0; i < 14; i++) {
      const ratio = i / 14;
      doc.setFillColor(
        Math.round(79 + ratio * (99 - 79)),
        Math.round(70 + ratio * (102 - 70)),
        Math.round(229 + ratio * (241 - 229))
      );
      doc.rect(margin, yPos + i, contentWidth, 1, 'F');
    }
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Date', margin + 12, yPos + 9);
    doc.text('Status', pageWidth / 2, yPos + 9, { align: 'center' });
    doc.text('Amount', pageWidth - margin - 12, yPos + 9, { align: 'right' });
    yPos += 14;

    // Table rows
    doc.setFont('helvetica', 'normal');
    
    if (attendanceEntries.length === 0) {
      doc.setFillColor(254, 243, 199);
      doc.roundedRect(margin, yPos + 5, contentWidth, 25, 4, 4, 'F');
      doc.setTextColor(146, 64, 14);
      doc.setFontSize(10);
      doc.text('No records for this month', pageWidth / 2, yPos + 20, { align: 'center' });
    } else {
      attendanceEntries.forEach(([dateStr, status], index) => {
        // Alternating rows
        if (index % 2 === 0) {
          doc.setFillColor(243, 244, 246);
        } else {
          doc.setFillColor(255, 255, 255);
        }
        doc.rect(margin, yPos, contentWidth, 13, 'F');

        const date = new Date(dateStr);
        const formattedDate = `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;

        doc.setTextColor(55, 65, 81);
        doc.setFontSize(9);
        doc.text(formattedDate, margin + 12, yPos + 9);

        // Status badge
        const statusX = pageWidth / 2 - 15;
        if (status === 'full') {
          doc.setFillColor(220, 252, 231);
          doc.roundedRect(statusX, yPos + 2, 30, 9, 2, 2, 'F');
          doc.setTextColor(22, 101, 52);
          doc.setFont('helvetica', 'bold');
          doc.text('Full', pageWidth / 2, yPos + 9, { align: 'center' });
        } else if (status === 'half') {
          doc.setFillColor(254, 243, 199);
          doc.roundedRect(statusX, yPos + 2, 30, 9, 2, 2, 'F');
          doc.setTextColor(146, 64, 14);
          doc.setFont('helvetica', 'bold');
          doc.text('Half', pageWidth / 2, yPos + 9, { align: 'center' });
        } else {
          doc.setFillColor(254, 226, 226);
          doc.roundedRect(statusX, yPos + 2, 30, 9, 2, 2, 'F');
          doc.setTextColor(153, 27, 27);
          doc.setFont('helvetica', 'bold');
          doc.text('Absent', pageWidth / 2, yPos + 9, { align: 'center' });
        }

        // Amount
        const pay = status === 'full' ? salary.rateFull : status === 'half' ? salary.rateHalf : 0;
        doc.setTextColor(55, 65, 81);
        doc.setFont('helvetica', 'bold');
        doc.text(String(pay), pageWidth - margin - 12, yPos + 9, { align: 'right' });

        yPos += 13;
      });
    }

    doc.save(`Attendance_${monthName.replace(' ', '_')}.pdf`);
  }, [data, viewDate, calculateSalary, getViewMonthKey]);

  return {
    data,
    viewDate,
    changeMonth,
    updateSettings,
    markAttendance,
    addAdvance,
    deleteAdvance,
    calculateSalary,
    getMonthlyAdvances,
    getViewMonthKey,
    exportData,
    exportPDF,
  };
};
