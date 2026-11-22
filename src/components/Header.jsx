import React from 'react';
import { Calendar, Sparkles, Download, Layers, CheckCircle2 } from 'lucide-react';
import { GREGORIAN_MONTHS } from '../constants/calendarData';

export default function Header({
  year,
  setYear,
  month,
  setMonth,
  days,
  onOpenAutoSequence,
  onExportJson
}) {
  const filledDaysCount = days.filter((d) => d.isFilled).length;
  const totalDays = days.length;
  const progressPct = totalDays > 0 ? Math.round((filledDaysCount / totalDays) * 100) : 0;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        {/* Top row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-red-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                Calendar Admin
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  நிர்வாகம்
                </span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Panchangam, Tamil Dates, Thithi & Event Management
              </p>
            </div>
          </div>

          {/* Quick stats and buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Progress Badge */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <div className="text-xs">
                <span className="font-bold text-slate-800">{filledDaysCount}/{totalDays}</span>
                <span className="text-slate-500 ml-1">Days Filled ({progressPct}%)</span>
              </div>
            </div>

            {/* Auto Sequence Button */}
            <button
              onClick={onOpenAutoSequence}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100 transition-colors shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Auto-fill Tamil Dates
            </button>

            {/* Export JSON Button */}
            <button
              onClick={onExportJson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
            >
              <Download className="w-3.5 h-3.5" />
              Export JSON
            </button>
          </div>
        </div>

        {/* Year and Month Selector Row */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Year select */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Year:</span>
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
              {[2026, 2027, 2028, 2029].map((yr) => (
                <button
                  key={yr}
                  onClick={() => setYear(yr)}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                    year === yr
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>

          {/* Month selector tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {GREGORIAN_MONTHS.map((mName, idx) => (
              <button
                key={mName}
                onClick={() => setMonth(idx)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap transition-all ${
                  month === idx
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {mName.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

