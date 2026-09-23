import React, { useState } from 'react';
import { MeetingItem, PlatformType } from '../data/mockData';

interface ScreenCalendarProps {
  meetings: MeetingItem[];
  onJoinMeeting: (meeting: MeetingItem) => void;
  onViewMeetingDetail: (meeting: MeetingItem) => void;
  onScheduleNew: () => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'warning') => void;
}

export const ScreenCalendar: React.FC<ScreenCalendarProps> = ({
  meetings,
  onJoinMeeting,
  onViewMeetingDetail,
  onScheduleNew,
  onShowToast
}) => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [selectedDay, setSelectedDay] = useState(2); // Tuesday / Today

  const weekDays = [
    { day: 'Sun', date: 'Sep 21', count: 1 },
    { day: 'Mon', date: 'Sep 22', count: 1 },
    { day: 'Tue', date: 'Today', count: 2, isToday: true },
    { day: 'Wed', date: 'Sep 24', count: 1 },
    { day: 'Thu', date: 'Sep 25', count: 0 },
    { day: 'Fri', date: 'Sep 26', count: 2 },
    { day: 'Sat', date: 'Sep 27', count: 0 }
  ];

  const getPlatformIcon = (platform: PlatformType) => {
    switch (platform) {
      case 'Google Meet':
        return 'videocam';
      case 'Zoom':
        return 'video_camera_front';
      case 'Microsoft Teams':
        return 'groups';
      default:
        return 'meeting_room';
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#0b0f17] text-[#f8fafc] pb-32">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0b0f17]/95 backdrop-blur-xl border-b border-[#1a2333]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-[#f8fafc] tracking-tight">Calendar</h1>
            <p className="text-xs text-[#94a3b8]">Scheduled meetings & AI attendance</p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle: Daily / Weekly */}
            <div className="flex items-center p-1 rounded-xl bg-[#111927] border border-[#1e293b]">
              <button
                onClick={() => setViewMode('daily')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'daily'
                    ? 'bg-[#0284c7] text-white shadow-xs'
                    : 'text-[#94a3b8] hover:text-[#f8fafc]'
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => setViewMode('weekly')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'weekly'
                    ? 'bg-[#0284c7] text-white shadow-xs'
                    : 'text-[#94a3b8] hover:text-[#f8fafc]'
                }`}
              >
                Weekly
              </button>
            </div>

            <button
              onClick={onScheduleNew}
              className="px-3 py-1.5 rounded-xl bg-[#141d2e] hover:bg-[#1f2b40] text-xs font-medium text-[#38bdf8] border border-[#223049] flex items-center gap-1 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span className="hidden sm:inline">Schedule</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 pt-5 space-y-5">
        {/* Days of week selector bar */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-[#111927] border border-[#1e293b]">
          {weekDays.map((item, idx) => {
            const isSelected = selectedDay === idx;
            return (
              <button
                key={idx}
                onClick={() => setSelectedDay(idx)}
                className={`flex flex-col items-center py-2.5 px-1 rounded-xl text-center transition-all ${
                  isSelected
                    ? 'bg-[#1b2537] border border-[#38bdf8]/40 shadow-xs'
                    : 'hover:bg-[#141c2b] text-[#94a3b8]'
                }`}
              >
                <span className="text-[11px] font-medium uppercase tracking-wider text-[#94a3b8]">
                  {item.day}
                </span>
                <span
                  className={`text-xs font-bold mt-0.5 ${
                    item.isToday
                      ? 'text-[#38bdf8]'
                      : isSelected
                      ? 'text-[#f8fafc]'
                      : 'text-[#cbd5e1]'
                  }`}
                >
                  {item.date}
                </span>

                {item.count > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] mt-1" />
                )}
              </button>
            );
          })}
        </div>

        {/* AI Attendance Schedule Banner */}
        <div className="p-3.5 rounded-2xl bg-[#111927] border border-[#1e293b] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#38bdf8]/10 text-[#38bdf8] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">neurology</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#f8fafc]">
                Scheduled AI Attendance Active
              </p>
              <p className="text-[11px] text-[#94a3b8]">
                Aura will automatically join and capture structured summaries for your meetings
              </p>
            </div>
          </div>

          <button
            onClick={() => onShowToast('Calendar sync updated with Google & Outlook')}
            className="px-3 py-1.5 rounded-lg bg-[#141d2e] hover:bg-[#1c273c] text-xs font-medium text-[#94a3b8] hover:text-[#f8fafc] border border-[#223049] transition-all shrink-0"
          >
            Sync Calendars
          </button>
        </div>

        {/* Timeline / View */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#94a3b8] px-1">
            <span>
              {viewMode === 'daily'
                ? `Schedule for ${weekDays[selectedDay].date}`
                : 'All Scheduled Meetings for This Week'}
            </span>
            <span>{meetings.length} meetings on schedule</span>
          </div>

          <div className="space-y-3">
            {meetings.map((meeting) => (
              <div
                key={meeting.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#111927] border border-[#1e293b] hover:border-[#2b3a52] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#162032] border border-[#233149] font-medium text-[#38bdf8]">
                      <span className="material-symbols-outlined text-[14px]">
                        {getPlatformIcon(meeting.platform)}
                      </span>
                      {meeting.platform}
                    </span>

                    <span className="text-[#94a3b8] font-mono">
                      {meeting.date} · {meeting.time}
                    </span>

                    <span className="px-2 py-0.5 rounded-md bg-[#141d2e] text-[#94a3b8] border border-[#223049] text-[11px]">
                      {meeting.duration}
                    </span>
                  </div>

                  <h3
                    onClick={() => onViewMeetingDetail(meeting)}
                    className="text-sm font-bold text-[#f8fafc] group-hover:text-[#38bdf8] transition-colors cursor-pointer"
                  >
                    {meeting.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-[#94a3b8]">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">group</span>
                      {meeting.participantCount} participants
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-[#38bdf8]">
                      <span className="material-symbols-outlined text-[14px]">neurology</span>
                      {meeting.aiAssistantStatus}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => onViewMeetingDetail(meeting)}
                    className="px-3.5 py-2 rounded-xl bg-[#162032] hover:bg-[#1e2c44] text-[#cbd5e1] hover:text-[#f8fafc] border border-[#233149] text-xs font-medium transition-all"
                  >
                    Details
                  </button>

                  <button
                    onClick={() => onJoinMeeting(meeting)}
                    className="px-4 py-2 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">videocam</span>
                    <span>Join</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
