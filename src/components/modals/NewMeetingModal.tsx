import React, { useState } from 'react';
import { PlatformType } from '../../data/mockData';

interface NewMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartMeeting: (title: string, platform: PlatformType) => void;
}

export const NewMeetingModal: React.FC<NewMeetingModalProps> = ({
  isOpen,
  onClose,
  onStartMeeting
}) => {
  const [title, setTitle] = useState('Executive Architecture Sync');
  const [platform, setPlatform] = useState<PlatformType>('AuraMeet');
  const [aiAssistantEnabled, setAiAssistantEnabled] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartMeeting(title || 'Instant Meeting', platform);
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
            <div className="w-8 h-8 rounded-xl bg-[#0284c7]/20 text-[#38bdf8] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">videocam</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#f8fafc]">Start New Meeting</h2>
              <p className="text-[11px] text-[#94a3b8]">Launch instant meeting with Aura Assistant</p>
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
            <label className="block text-xs font-medium text-[#cbd5e1] mb-1.5">
              Meeting Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Distributed Systems Architecture Sync"
              className="w-full bg-[#0c111a] border border-[#1e293b] rounded-xl px-3.5 py-2.5 text-xs text-[#f8fafc] focus:outline-none focus:border-[#38bdf8]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#cbd5e1] mb-1.5">
              Platform
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['AuraMeet', 'Google Meet', 'Zoom', 'Microsoft Teams'] as PlatformType[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlatform(p)}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-left flex items-center gap-2 transition-all ${
                    platform === p
                      ? 'border-[#38bdf8] bg-[#0284c7]/15 text-[#38bdf8]'
                      : 'border-[#1e293b] bg-[#121927] text-[#94a3b8] hover:text-[#f8fafc]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {p === 'Google Meet' ? 'videocam' : p === 'Zoom' ? 'video_camera_front' : p === 'Microsoft Teams' ? 'groups' : 'meeting_room'}
                  </span>
                  <span>{p}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#121927] border border-[#1f2b3e] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#38bdf8]">neurology</span>
              <div>
                <p className="text-xs font-medium text-[#f8fafc]">AI Assistant Attendance</p>
                <p className="text-[11px] text-[#94a3b8]">Automatically track notes and key decisions</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={aiAssistantEnabled}
              onChange={(e) => setAiAssistantEnabled(e.target.checked)}
              className="w-4 h-4 accent-[#0284c7]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#1e293b] hover:bg-[#283548] text-xs font-medium text-[#94a3b8] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">play_arrow</span>
              <span>Start Meeting Now</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
