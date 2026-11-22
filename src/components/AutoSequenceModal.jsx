import React, { useState } from 'react';
import { X, Sparkles, Check } from 'lucide-react';
import { TAMIL_MONTHS, GREGORIAN_MONTHS } from '../constants/calendarData';

export default function AutoSequenceModal({
  year,
  month,
  isOpen,
  onClose,
  onSequence
}) {
  if (!isOpen) return null;

  const [startTamilMonth, setStartTamilMonth] = useState('தை');
  const [startTamilDay, setStartTamilDay] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApply = async () => {
    try {
      setIsSubmitting(true);
      await onSequence(startTamilMonth, startTamilDay);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to auto-sequence Tamil dates');
    } finally {
      setIsSubmitting(false);
    }
  };

  const monthName = GREGORIAN_MONTHS[month];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-amber-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500 rounded-xl text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Auto-fill Tamil Dates
              </h3>
              <p className="text-xs text-slate-500">
                For {monthName} {year}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Select what Tamil date corresponds to <strong>{monthName} 1st</strong>. The tool will automatically sequence the rest of the days for the entire month!
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Starting Tamil Month (1st நாள் மாதம்)
            </label>
            <select
              value={startTamilMonth}
              onChange={(e) => setStartTamilMonth(e.target.value)}
              className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500"
            >
              {TAMIL_MONTHS.map((tm) => (
                <option key={tm} value={tm}>{tm}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Starting Tamil Day (1st நாள் தேதி)
            </label>
            <input
              type="number"
              min="1"
              max="32"
              value={startTamilDay}
              onChange={(e) => setStartTamilDay(parseInt(e.target.value, 10) || 1)}
              className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={isSubmitting}
            className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5"
          >
            {isSubmitting ? (
              'Sequencing...'
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                Apply to Month
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

