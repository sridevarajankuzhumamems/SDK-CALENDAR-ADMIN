import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Check,
  AlertCircle
} from 'lucide-react';
import {
  TAMIL_MONTHS,
  THITHIS,
  NAKSHATRAS,
  DAY_TYPES,
  GREGORIAN_MONTHS,
  COMMON_FESTIVAL_SUGGESTIONS
} from '../constants/calendarData';
import { uploadImage } from '../services/api';

export default function DayEditorModal({
  dayData,
  onClose,
  onSave
}) {
  if (!dayData) return null;

  const [formData, setFormData] = useState({
    ...dayData,
    tamilDate: dayData.tamilDate || { month: '', day: '' },
    tithiList: dayData.tithiList && dayData.tithiList.length > 0
      ? dayData.tithiList
      : [{ name: '', startTime: '', endTime: '', isAmavasai: false, isPournami: false }],
    nakshatraList: dayData.nakshatraList && dayData.nakshatraList.length > 0
      ? dayData.nakshatraList
      : [{ name: '', startTime: '', endTime: '' }],
    events: dayData.events || [],
    dayType: dayData.dayType || 'NORMAL',
    isGovtHoliday: Boolean(dayData.isGovtHoliday),
    leftImage: dayData.leftImage || (dayData.imageArray && dayData.imageArray.length > 1 ? dayData.imageArray[0] : ''),
    gridImage: dayData.gridImage || dayData.secondaryImage || (dayData.imageArray && dayData.imageArray.length > 1 ? dayData.imageArray[1] : (dayData.leftImage ? '' : (dayData.image || ''))),
    image: dayData.image || '',
    secondaryImage: dayData.secondaryImage || '',
    rahukalam: dayData.rahukalam || { rahukalam: '', yamagandam: '', kuligai: '' },
    nallaNeram: dayData.nallaNeram || { morning: '', evening: '' },
    notes: dayData.notes || ''
  });

  const [newEventInput, setNewEventInput] = useState('');
  const [isUploadingLeft, setIsUploadingLeft] = useState(false);
  const [isUploadingRight, setIsUploadingRight] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Update field helpers
  const handleTamilChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      tamilDate: {
        ...prev.tamilDate,
        [field]: value
      }
    }));
  };

  // Thithi helpers
  const addThithi = () => {
    setFormData((prev) => ({
      ...prev,
      tithiList: [
        ...prev.tithiList,
        { name: '', startTime: '', endTime: '', isAmavasai: false, isPournami: false }
      ]
    }));
  };

  const updateThithi = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.tithiList];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, tithiList: updated };
    });
  };

  const removeThithi = (index) => {
    if (formData.tithiList.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      tithiList: prev.tithiList.filter((_, i) => i !== index)
    }));
  };

  // Nakshatra helpers
  const addNakshatra = () => {
    setFormData((prev) => ({
      ...prev,
      nakshatraList: [
        ...prev.nakshatraList,
        { name: '', startTime: '', endTime: '' }
      ]
    }));
  };

  const updateNakshatra = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.nakshatraList];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, nakshatraList: updated };
    });
  };

  const removeNakshatra = (index) => {
    if (formData.nakshatraList.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      nakshatraList: prev.nakshatraList.filter((_, i) => i !== index)
    }));
  };

  // Event helpers
  const handleAddEvent = (eventText) => {
    const trimmed = (eventText || newEventInput).trim();
    if (!trimmed) return;
    if (!formData.events.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        events: [...prev.events, trimmed]
      }));
    }
    setNewEventInput('');
  };

  const handleRemoveEvent = (eventIndex) => {
    setFormData((prev) => ({
      ...prev,
      events: prev.events.filter((_, i) => i !== eventIndex)
    }));
  };

  // Dual Image Upload helper
  const handleImageFileChange = async (e, target) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (target === 'left') setIsUploadingLeft(true);
      else setIsUploadingRight(true);

      setErrorMessage('');
      const res = await uploadImage(file);
      if (res.success && res.url) {
        setFormData((prev) => ({
          ...prev,
          [target === 'left' ? 'leftImage' : 'gridImage']: res.url
        }));
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Image upload failed. Ensure backend is running.');
    } finally {
      if (target === 'left') setIsUploadingLeft(false);
      else setIsUploadingRight(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaveSuccess(false);
      setErrorMessage('');

      const img1 = formData.leftImage || '';
      const img2 = formData.gridImage || '';
      const imageArray = [img1, img2].filter(Boolean);

      const payload = {
        ...formData,
        leftImage: img1,
        gridImage: img2,
        image: img1 || img2 || '',
        secondaryImage: (img1 && img2) ? img2 : '',
        imageArray: imageArray
      };

      await onSave(payload);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to save day data.');
    }
  };

  const monthName = GREGORIAN_MONTHS[dayData.month];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-slate-900">
                {dayData.day} {monthName} {dayData.year}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayData.dayOfWeek]}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Edit Tamil calendar, Thithi times, and special events
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Tamil Date */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              தமிழ் தேதி (Tamil Date)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  தமிழ் மாதம் (Tamil Month)
                </label>
                <select
                  value={formData.tamilDate?.month || ''}
                  onChange={(e) => handleTamilChange('month', e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">மாதத்தை தேர்ந்தெடுக்கவும்</option>
                  {TAMIL_MONTHS.map((tm) => (
                    <option key={tm} value={tm}>{tm}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  தமிழ் தேதி (Tamil Day)
                </label>
                <input
                  type="number"
                  min="1"
                  max="32"
                  value={formData.tamilDate?.day || ''}
                  onChange={(e) => handleTamilChange('day', parseInt(e.target.value, 10) || null)}
                  placeholder="e.g. 1"
                  className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Thithi (With Start and End Times) */}
          <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-600" />
                திதி & நேரங்கள் (Thithi & Timing Span)
              </h3>
              <button
                type="button"
                onClick={addThithi}
                className="text-[11px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 bg-purple-100 hover:bg-purple-200 px-2 py-1 rounded"
              >
                <Plus className="w-3 h-3" /> Add Thithi
              </button>
            </div>

            <div className="space-y-3">
              {formData.tithiList.map((tithi, idx) => (
                <div key={idx} className="p-3 bg-white rounded-lg border border-purple-100 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-purple-700">Thithi #{idx + 1}</span>
                    {formData.tithiList.length > 1 && (
                      <button
                        onClick={() => removeThithi(idx)}
                        className="text-red-500 hover:text-red-700 text-xs p-1"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">திதி பெயர்</label>
                      <select
                        value={tithi.name}
                        onChange={(e) => updateThithi(idx, 'name', e.target.value)}
                        className="w-full text-xs px-2 py-1.5 bg-slate-50 border border-slate-200 rounded font-medium focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">தேர்ந்தெடு</option>
                        {THITHIS.map((th) => (
                          <option key={th} value={th}>{th}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Start (ஆரம்பம்)</label>
                      <input
                        type="text"
                        placeholder="e.g. 6:30 PM"
                        value={tithi.startTime || ''}
                        onChange={(e) => updateThithi(idx, 'startTime', e.target.value)}
                        className="w-full text-xs px-2 py-1.5 bg-slate-50 border border-slate-200 rounded font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">End (முடிவு)</label>
                      <input
                        type="text"
                        placeholder="e.g. 3:45 PM"
                        value={tithi.endTime || ''}
                        onChange={(e) => updateThithi(idx, 'endTime', e.target.value)}
                        className="w-full text-xs px-2 py-1.5 bg-slate-50 border border-slate-200 rounded font-medium"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Nakshatra (With Start and End Times) */}
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                நட்சத்திரம் & நேரங்கள் (Nakshatra)
              </h3>
              <button
                type="button"
                onClick={addNakshatra}
                className="text-[11px] font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded"
              >
                <Plus className="w-3 h-3" /> Add Nakshatra
              </button>
            </div>

            <div className="space-y-3">
              {formData.nakshatraList.map((nakshatra, idx) => (
                <div key={idx} className="p-3 bg-white rounded-lg border border-blue-100 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-blue-700">Nakshatra #{idx + 1}</span>
                    {formData.nakshatraList.length > 1 && (
                      <button
                        onClick={() => removeNakshatra(idx)}
                        className="text-red-500 hover:text-red-700 text-xs p-1"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">நட்சத்திரம் பெயர்</label>
                      <select
                        value={nakshatra.name}
                        onChange={(e) => updateNakshatra(idx, 'name', e.target.value)}
                        className="w-full text-xs px-2 py-1.5 bg-slate-50 border border-slate-200 rounded font-medium focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">தேர்ந்தெடு</option>
                        {NAKSHATRAS.map((nk) => (
                          <option key={nk} value={nk}>{nk}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Start (ஆரம்பம்)</label>
                      <input
                        type="text"
                        placeholder="e.g. 9:15 AM"
                        value={nakshatra.startTime || ''}
                        onChange={(e) => updateNakshatra(idx, 'startTime', e.target.value)}
                        className="w-full text-xs px-2 py-1.5 bg-slate-50 border border-slate-200 rounded font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">End (முடிவு)</label>
                      <input
                        type="text"
                        placeholder="e.g. 10:30 AM"
                        value={nakshatra.endTime || ''}
                        onChange={(e) => updateNakshatra(idx, 'endTime', e.target.value)}
                        className="w-full text-xs px-2 py-1.5 bg-slate-50 border border-slate-200 rounded font-medium"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Events & Classification */}
          <div className="bg-red-50/50 p-4 rounded-xl border border-red-200">
            <h3 className="text-xs font-black uppercase tracking-wider text-red-900 mb-3">
              நிகழ்வுகள் & பண்டிகைகள் (Events & Classification)
            </h3>

            {/* Current Event Tags */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {formData.events.map((evt, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-800 border border-red-200"
                >
                  {evt}
                  <button
                    type="button"
                    onClick={() => handleRemoveEvent(idx)}
                    className="hover:text-red-950 font-black ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Add Event Input */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="நிகழ்வை தட்டச்சு செய்க... (e.g. தை பொங்கல்)"
                value={newEventInput}
                onChange={(e) => setNewEventInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddEvent();
                  }
                }}
                className="flex-1 text-xs font-medium px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
              <button
                type="button"
                onClick={() => handleAddEvent()}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors"
              >
                Add
              </button>
            </div>

            {/* Quick Suggestions Chips */}
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Quick Suggestions (Click to add):
              </p>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                {COMMON_FESTIVAL_SUGGESTIONS.map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => handleAddEvent(sug)}
                    className="text-[10px] px-2 py-0.5 rounded bg-white hover:bg-red-100 text-slate-700 border border-slate-200 font-medium transition-colors"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Day Type and Government Holiday */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-3 border-t border-red-100">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  நாள் வகை (Day Type)
                </label>
                <select
                  value={formData.dayType}
                  onChange={(e) => setFormData((prev) => ({ ...prev, dayType: e.target.value }))}
                  className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  <option value="NORMAL">சாதாரண நாள் (Normal)</option>
                  <option value="AUSPICIOUS">சுப முகூர்த்தம் (Auspicious)</option>
                  <option value="MAJOR_FESTIVAL">முக்கிய பண்டிகை (Major Festival)</option>
                  <option value="VIRADHAM">விரத நாள் (Viradham)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="isGovtHoliday"
                  checked={formData.isGovtHoliday}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isGovtHoliday: e.target.checked }))}
                  className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
                />
                <label htmlFor="isGovtHoliday" className="text-xs font-bold text-red-700 cursor-pointer">
                  அரசு விடுமுறை (Government Holiday)
                </label>
              </div>
            </div>
          </div>

          {/* Section 5: Dual Image Upload & Preview */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                நாட்காட்டி படங்கள் (Dual Grid Images: Left & Right)
              </h3>
              <span className="text-[10px] font-semibold text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded">
                2 Images Supported
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              {/* Image 1: Left Grid Image */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-800 flex items-center gap-1">
                    <span>↖</span> Image 1 (Left Image / இடது)
                  </span>
                  {formData.leftImage && (
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, leftImage: '' }))}
                      className="text-[11px] font-bold text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <label className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-amber-500 bg-slate-50/50 cursor-pointer transition-colors">
                  <Upload className="w-5 h-5 text-slate-400 mb-1" />
                  <span className="text-[11px] font-semibold text-slate-600">
                    {isUploadingLeft ? 'Uploading...' : 'Upload Image 1'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageFileChange(e, 'left')}
                    className="hidden"
                    disabled={isUploadingLeft}
                  />
                </label>

                <input
                  type="text"
                  placeholder="Or paste URL for Image 1..."
                  value={formData.leftImage || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, leftImage: e.target.value }))}
                  className="w-full text-xs font-medium px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                />

                {/* Thumbnail Preview 1 */}
                <div className="w-full h-28 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden">
                  {formData.leftImage ? (
                    <img
                      src={formData.leftImage}
                      alt="Left Preview"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-[10px] text-slate-400">No Image 1</span>
                  )}
                </div>
              </div>

              {/* Image 2: Right Grid Image */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-800 flex items-center gap-1">
                    <span>↗</span> Image 2 (Right Image / வலது)
                  </span>
                  {formData.gridImage && (
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, gridImage: '' }))}
                      className="text-[11px] font-bold text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <label className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 bg-slate-50/50 cursor-pointer transition-colors">
                  <Upload className="w-5 h-5 text-slate-400 mb-1" />
                  <span className="text-[11px] font-semibold text-slate-600">
                    {isUploadingRight ? 'Uploading...' : 'Upload Image 2'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageFileChange(e, 'right')}
                    className="hidden"
                    disabled={isUploadingRight}
                  />
                </label>

                <input
                  type="text"
                  placeholder="Or paste URL for Image 2..."
                  value={formData.gridImage || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, gridImage: e.target.value }))}
                  className="w-full text-xs font-medium px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                />

                {/* Thumbnail Preview 2 */}
                <div className="w-full h-28 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden">
                  {formData.gridImage ? (
                    <img
                      src={formData.gridImage}
                      alt="Right Preview"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-[10px] text-slate-400">No Image 2</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 6: Rahukalam, Yamagandam, Kuligai Timings */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-600" />
              நேரங்கள் (Rahukalam, Yamagandam, Kuligai)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-red-700 mb-1">ராகு காலம்</label>
                <input
                  type="text"
                  value={formData.rahukalam?.rahukalam || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      rahukalam: { ...prev.rahukalam, rahukalam: e.target.value }
                    }))
                  }
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-orange-700 mb-1">யமகண்டம்</label>
                <input
                  type="text"
                  value={formData.rahukalam?.yamagandam || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      rahukalam: { ...prev.rahukalam, yamagandam: e.target.value }
                    }))
                  }
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-yellow-700 mb-1">குளிகை</label>
                <input
                  type="text"
                  value={formData.rahukalam?.kuligai || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      rahukalam: { ...prev.rahukalam, kuligai: e.target.value }
                    }))
                  }
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className={`flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md ${
              saveSuccess ? 'bg-emerald-600' : 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20'
            }`}
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Day Details
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

