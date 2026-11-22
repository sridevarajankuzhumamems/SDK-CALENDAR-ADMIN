# Calendar Admin Panel (காலண்டர் நிர்வாகம்)

A dedicated React Admin Panel built for managing Panchangam, Tamil dates, Thithi time-spans, Nakshatras, festivals, and event imagery for the Calendar application.

---

## 🚀 Quick Start

### 1. Start the Backend (`calendar_backend`)
```bash
cd /Users/hi/Downloads/calendar_backend
npm start
# Server runs on http://localhost:5001
```

### 2. Start the Admin App (`calendar_admin`)
```bash
cd /Users/hi/Downloads/calendar_admin
npm run dev
# Admin panel runs on http://localhost:5174
```

---

## ✨ Features

1. **Monthly Calendar Grid**:
   - Visual 7-column layout displaying Gregorian days, Tamil dates, Thithis, Nakshatras, and festival badges.
   - Weekday headers with Sunday & government holiday red markings.
   - Completion indicator badge showing which days are saved (`🟢`) vs pending (`Draft`).

2. **Per-Day Details Editor**:
   - **Tamil Date**: Tamil Month dropdown (சித்திரை ... பங்குனி) & Tamil Day number.
   - **Thithi with Time Spans**: Support for dynamic multiple Thithis with exact Start Time (e.g. `6:30 PM`) and End Time (e.g. `3:45 PM`). Includes moon phase indicators for அமாவாசை & பௌர்ணமி.
   - **Nakshatra with Time Spans**: Start and End time tracking.
   - **Events & Festivals**: Interactive tag editor with quick 1-click suggestion chips for common Tamil festivals.
   - **Day Classification**: Normal, Auspicious (சுப முகூர்த்தம்), Major Festival, or Viradham (விரதம்).
   - **Government Holiday Toggle**: Flags days in red.
   - **Image Uploads**: Upload photo directly from device (stored in backend `/uploads`) or paste an external CDN URL with live preview.
   - **Timings**: Rahukalam, Yamagandam, Kuligai with auto-defaults and manual override.

3. **Auto-Fill Tamil Dates**:
   - Single-click tool to sequence the entire month's Tamil dates automatically by setting the 1st day.

4. **Export to JSON**:
   - Export any month's configured dataset as a standalone JSON file for backups or CDN hosting.

