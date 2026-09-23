import React, { useState } from 'react';
import { PlatformType } from '../../data/mockData';

interface ScheduleMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (meeting: any) => void;
}

export const ScheduleMeetingModal: React.FC<ScheduleMeetingModalProps> = ({
  isOpen,
  onClose,
  onSchedule
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('Tomorrow');
  const [time, setTime] = useState('11:00 AM – 11:45 AM');
  const [platform, setPlatform] = useState<PlatformType>('Google Meet');
  const [aiAttendance, setAiAttendance] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSchedule({
      title: title || 'Scheduled Strategy Sync',
      date,
      time,
      platform,
      aiAttendance
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md bg-[#0e1420] border border-[#222e44] rounded-2xl shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-4 sm:p-5 border-b border-[#1e293b] flex items-center justify-between bg-[#111927]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#8b5cf6]/20 text-[#c084fc] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">calendar_today</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#f8fafc]">Schedule Meeting</h2>
              <p className="text-[11px] text-[#94a3b8]">Set up upcoming meeting with scheduled AI attendance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#1e293b]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#cbd5e1] mb-1.5">Meeting Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Infrastructure Sprint Review"
              className="w-full bg-[#0c111a] border border-[#1e293b] rounded-xl px-3.5 py-2.5 text-xs text-[#f8fafc] focus:outline-none focus:border-[#38bdf8]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#cbd5e1] mb-1.5">Date</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#0c111a] border border-[#1e293b] rounded-xl px-3 py-2 text-xs text-[#f8fafc] focus:outline-none focus:border-[#38bdf8]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#cbd5e1] mb-1.5">Time Window</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-[#0c111a] border border-[#1e293b] rounded-xl px-3 py-2 text-xs text-[#f8fafc] focus:outline-none focus:border-[#38bdf8]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#cbd5e1] mb-1.5">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as PlatformType)}
              className="w-full bg-[#0c111a] border border-[#1e293b] rounded-xl px-3.5 py-2.5 text-xs text-[#f8fafc] focus:outline-none focus:border-[#38bdf8]"
            >
              <option value="Google Meet">Google Meet</option>
              <option value="Zoom">Zoom</option>
              <option value="Microsoft Teams">Microsoft Teams</option>
              <option value="AuraMeet">AuraMeet</option>
            </select>
          </div>

          <div className="p-3.5 rounded-xl bg-[#121927] border border-[#1f2b3e] flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[#f8fafc]">AI Assistant Scheduled</p>
              <p className="text-[11px] text-[#94a3b8]">Ready to attend, listen, and organize notes</p>
            </div>
            <input
              type="checkbox"
              checked={aiAttendance}
              onChange={(e) => setAiAttendance(e.target.checked)}
              className="w-4 h-4 accent-[#0284c7]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#1e293b] hover:bg-[#283548] text-xs font-medium text-[#94a3b8]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-semibold shadow-sm transition-all"
            >
              Schedule Meeting
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
