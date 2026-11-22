import React from 'react';
import { Edit3, CheckCircle, Clock, Image as ImageIcon, Sparkles } from 'lucide-react';
import { DAY_TYPES } from '../constants/calendarData';

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function MonthGrid({
  year,
  month,
  days,
  onSelectDay
}) {
  // First day of month (0 = Sun, 1 = Mon...)
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const emptyCells = Array(firstDayOfWeek).fill(null);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
        {WEEKDAYS.map((day, idx) => (
          <div
            key={day}
            className={`py-2.5 text-center text-xs font-black uppercase tracking-wider ${
              idx === 0 ? 'text-red-500 bg-red-50/50' : 'text-slate-600'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 bg-slate-100">
        {/* Empty cells before month start */}
        {emptyCells.map((_, i) => (
          <div key={`empty-${i}`} className="min-h-[110px] sm:min-h-[135px] bg-slate-50/40 p-2" />
        ))}

        {/* Days */}
        {days.map((dayData) => {
          const { day, dayOfWeek, isSunday, isGovtHoliday, tamilDate, tithiList, nakshatraList, events, dayType, isFilled } = dayData;
          const isRed = isSunday || isGovtHoliday;
          
          const primaryTithi = tithiList && tithiList[0]?.name ? tithiList[0].name : '';
          const primaryNakshatra = nakshatraList && nakshatraList[0]?.name ? nakshatraList[0].name : '';
          
          const leftImg = dayData.leftImage || null;
          const rightImg = dayData.gridImage || (!dayData.leftImage ? (dayData.image || null) : null);
          const hasImage = Boolean(leftImg || rightImg);

          return (
            <div
              key={day}
              onClick={() => onSelectDay(dayData)}
              className={`min-h-[110px] sm:min-h-[135px] p-2 relative bg-white hover:bg-slate-50/80 transition-all cursor-pointer group flex flex-col justify-between border-t border-l border-slate-100 overflow-hidden ${
                isFilled ? '' : 'bg-slate-50/20'
              }`}
            >
              {/* Dual Cell Images */}
              {leftImg && (
                <img
                  src={leftImg}
                  alt="Left Event"
                  className="absolute top-0 left-0 w-6 h-6 sm:w-7 sm:h-7 object-cover rounded-br border-b border-r border-slate-200 z-10"
                  title="Left Image"
                />
              )}
              {rightImg && (
                <img
                  src={rightImg}
                  alt="Right Event"
                  className="absolute top-0 right-0 w-6 h-6 sm:w-7 sm:h-7 object-cover rounded-bl border-b border-l border-slate-200 z-10"
                  title="Right Image"
                />
              )}

              {/* Top row: Gregorian Date & Tamil Date */}
              <div>
                <div className="flex items-start justify-between">
                  <div className={`flex items-center gap-1.5 ${leftImg ? 'pl-6 sm:pl-7' : ''}`}>
                    <span
                      className={`text-base sm:text-lg font-black leading-none ${
                        isRed ? 'text-red-600' : 'text-slate-900'
                      }`}
                    >
                      {day}
                    </span>
                    {isFilled && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Configured" />
                    )}
                  </div>

                  {/* Tamil Date Badge */}
                  {tamilDate?.month && tamilDate?.day ? (
                    <span
                      className={`text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded ${rightImg ? 'mr-6 sm:mr-7' : ''} ${
                        isRed ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {tamilDate.month} {tamilDate.day}
                    </span>
                  ) : (
                    <span className={`text-[10px] text-slate-300 italic ${rightImg ? 'mr-6 sm:mr-7' : ''}`}>No Tamil Date</span>
                  )}
                </div>

                {/* Thithi and Nakshatra */}
                <div className="mt-1.5 space-y-0.5">
                  {primaryTithi && (
                    <div className="flex items-center gap-1">
                      {primaryTithi === 'அமாவாசை' && (
                        <span className="w-2 h-2 rounded-full bg-slate-900 inline-block shrink-0" title="அமாவாசை" />
                      )}
                      {primaryTithi === 'பௌர்ணமி' && (
                        <span className="w-2 h-2 rounded-full border border-slate-400 bg-white inline-block shrink-0" title="பௌர்ணமி" />
                      )}
                      <p className="text-[10px] sm:text-[11px] font-semibold text-purple-700 truncate leading-tight">
                        {primaryTithi}
                      </p>
                    </div>
                  )}

                  {primaryNakshatra && (
                    <p className="text-[10px] sm:text-[11px] font-medium text-blue-700 truncate leading-tight">
                      {primaryNakshatra}
                    </p>
                  )}
                </div>

                {/* Events list badges */}
                {events && events.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {events.slice(0, 2).map((evt, i) => (
                      <span
                        key={i}
                        className="text-[9px] sm:text-[10px] font-bold px-1 py-0.5 rounded bg-red-50 text-red-700 border border-red-100 truncate max-w-full"
                      >
                        {evt}
                      </span>
                    ))}
                    {events.length > 2 && (
                      <span className="text-[9px] text-red-500 font-bold">
                        +{events.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom footer: Indicators & Edit hover */}
              <div className="mt-2 pt-1 border-t border-slate-50 flex items-center justify-between text-slate-400 text-xs">
                <div className="flex items-center gap-1">
                  {hasImage && (
                    <span className="text-amber-600 bg-amber-50 p-0.5 rounded" title="Has Image">
                      <ImageIcon className="w-3 h-3" />
                    </span>
                  )}
                  {dayType === 'MAJOR_FESTIVAL' && (
                    <span className="text-amber-700 bg-amber-100 text-[9px] font-bold px-1 rounded">
                      பண்டிகை
                    </span>
                  )}
                  {dayType === 'AUSPICIOUS' && (
                    <span className="text-emerald-700 bg-emerald-100 text-[9px] font-bold px-1 rounded">
                      முகூர்த்தம்
                    </span>
                  )}
                  {dayType === 'VIRADHAM' && (
                    <span className="text-purple-700 bg-purple-100 text-[9px] font-bold px-1 rounded">
                      விரதம்
                    </span>
                  )}
                </div>

                {/* Hover edit button */}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 bg-slate-100 hover:bg-slate-200 p-1 rounded-md">
                  <Edit3 className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

