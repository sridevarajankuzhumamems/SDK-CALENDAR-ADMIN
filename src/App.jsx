import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MonthGrid from './components/MonthGrid';
import DayEditorModal from './components/DayEditorModal';
import AutoSequenceModal from './components/AutoSequenceModal';
import { fetchMonth, updateDay, autoSequenceTamil } from './services/api';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [year, setYear] = useState(2027);
  const [month, setMonth] = useState(0); // 0 = January
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals state
  const [selectedDay, setSelectedDay] = useState(null);
  const [isAutoSequenceOpen, setIsAutoSequenceOpen] = useState(false);

  // Load Month Data
  const loadMonthData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMonth(year, month);
      setDays(data);
    } catch (err) {
      console.error(err);
      setError('Could not connect to Calendar Backend on http://localhost:5001. Please make sure the server is started.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMonthData();
  }, [year, month]);

  // Handle Save Day
  const handleSaveDay = async (updatedDayData) => {
    const res = await updateDay(year, month, updatedDayData.day, updatedDayData);
    if (res.success) {
      // Update local state smoothly
      setDays((prev) =>
        prev.map((d) => (d.day === updatedDayData.day ? res.data : d))
      );
      setSelectedDay(res.data);
    }
  };

  // Handle Auto Sequence
  const handleAutoSequence = async (startMonth, startDay) => {
    const newDays = await autoSequenceTamil(year, month, startMonth, startDay);
    setDays(newDays);
  };

  // Handle Export JSON
  const handleExportJson = () => {
    const exportData = {
      year,
      month,
      days
    };
    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calendar_${year}_month_${month + 1}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header
        year={year}
        setYear={setYear}
        month={month}
        setMonth={setMonth}
        days={days}
        onOpenAutoSequence={() => setIsAutoSequenceOpen(true)}
        onExportJson={handleExportJson}
      />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-red-700">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <div className="text-xs">
                <p className="font-bold">{error}</p>
                <p className="text-red-500 mt-0.5">Start server with: <code className="bg-red-100 px-1 py-0.5 rounded">npm start</code> in calendar_backend</p>
              </div>
            </div>
            <button
              onClick={loadMonthData}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-xs font-bold transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center text-slate-400">
            <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs font-semibold">Loading Calendar Data...</p>
          </div>
        ) : (
          <MonthGrid
            year={year}
            month={month}
            days={days}
            onSelectDay={(dayData) => setSelectedDay(dayData)}
          />
        )}
      </main>

      {/* Slide-over Day Editor */}
      {selectedDay && (
        <DayEditorModal
          dayData={selectedDay}
          onClose={() => setSelectedDay(null)}
          onSave={handleSaveDay}
        />
      )}

      {/* Auto Sequence Modal */}
      <AutoSequenceModal
        year={year}
        month={month}
        isOpen={isAutoSequenceOpen}
        onClose={() => setIsAutoSequenceOpen(false)}
        onSequence={handleAutoSequence}
      />
    </div>
  );
}

