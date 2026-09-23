import React from 'react';
import { MeetingItem } from '../data/mockData';

interface MeetingReminderToastProps {
  meeting: MeetingItem | null;
  onJoin: (meeting: MeetingItem) => void;
  onDismiss: () => void;
}

export const MeetingReminderToast: React.FC<MeetingReminderToastProps> = ({
  meeting,
  onJoin,
  onDismiss
}) => {
  if (!meeting) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed top-4 right-4 sm:right-6 z-[110] max-w-sm w-[calc(100%-2rem)] sm:w-96 bg-[#111927]/95 backdrop-blur-xl border border-[#38bdf8]/50 shadow-[0_12px_40px_rgba(0,0,0,0.6)] rounded-2xl p-3.5 text-[#f8fafc] transition-all animate-in fade-in slide-in-from-top-4 duration-300"
    >
      <div className="flex items-start gap-3">
        {/* Pulsing Bell / Clock Icon */}
        <div className="w-9 h-9 rounded-xl bg-[#0284c7]/20 border border-[#38bdf8]/40 flex items-center justify-center shrink-0 text-[#38bdf8]">
          <span className="material-symbols-outlined text-[20px] animate-pulse">
            notifications_active
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#38bdf8] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-ping" />
              Starting in 5 minutes
            </span>
            <button
              onClick={onDismiss}
              className="text-[#94a3b8] hover:text-[#f8fafc] p-0.5 rounded-lg transition-colors"
              title="Dismiss notification"
              aria-label="Dismiss notification"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>

          <h4 className="text-xs font-bold text-[#f8fafc] truncate mt-0.5">
            {meeting.title}
          </h4>

          <p className="text-[11px] text-[#94a3b8] mt-0.5 flex items-center gap-1.5">
            <span className="text-[#38bdf8] font-medium">{meeting.platform}</span>
            <span>·</span>
            <span>{meeting.time}</span>
          </p>

          {/* Action Button: Join Immediately */}
          <div className="mt-2.5 flex items-center gap-2">
            <button
              onClick={() => {
                onJoin(meeting);
                onDismiss();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-[#0284c7]/25 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[15px]">videocam</span>
              <span>Join Now</span>
            </button>

            <button
              onClick={onDismiss}
              className="px-3 py-1.5 rounded-xl bg-[#162032] hover:bg-[#1f2b42] text-[#cbd5e1] text-xs font-medium border border-[#233149] transition-all"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
