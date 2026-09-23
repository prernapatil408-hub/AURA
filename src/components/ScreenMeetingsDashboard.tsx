import React, { useState } from 'react';
import {
  BRAND_ASSETS,
  USER_PROFILE_DATA,
  MeetingItem,
  PlatformType
} from '../data/mockData';

interface ScreenMeetingsDashboardProps {
  meetings: MeetingItem[];
  onOpenNewMeeting: () => void;
  onOpenSchedule: () => void;
  onOpenJoinCode: () => void;
  onJoinMeeting: (meeting: MeetingItem) => void;
  onViewMeetingDetail: (meeting: MeetingItem) => void;
  onAskAura: (promptText?: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'warning') => void;
  onTriggerReminder?: (meeting: MeetingItem) => void;
}

export const ScreenMeetingsDashboard: React.FC<ScreenMeetingsDashboardProps> = ({
  meetings,
  onOpenNewMeeting,
  onOpenSchedule,
  onOpenJoinCode,
  onJoinMeeting,
  onViewMeetingDetail,
  onAskAura,
  onShowToast,
  onTriggerReminder
}) => {
  const [filter, setFilter] = useState<'All' | 'Today' | 'Upcoming' | 'Recorded' | 'AI Attended'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [quickPromptText, setQuickPromptText] = useState('');

  // Filtering meetings
  const filteredMeetings = meetings.filter((m) => {
    // Search query filter
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.summary && m.summary.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    // Filter tabs
    if (filter === 'Today') {
      return m.date.toLowerCase() === 'today';
    }
    if (filter === 'Upcoming') {
      return m.status === 'upcoming' || m.status === 'live';
    }
    if (filter === 'Recorded') {
      return m.status === 'completed';
    }
    if (filter === 'AI Attended') {
      return m.isAiAttended === true;
    }
    return true;
  });

  const upcomingMeetings = filteredMeetings.filter((m) => m.status === 'upcoming' || m.status === 'live');
  const recentMeetings = filteredMeetings.filter((m) => m.status === 'completed');

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

  const handleQuickPromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickPromptText.trim()) {
      onAskAura(quickPromptText.trim());
      setQuickPromptText('');
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#0b0f17] text-[#f8fafc] pb-32">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#0b0f17]/95 backdrop-blur-xl border-b border-[#1a2333]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={BRAND_ASSETS.logo}
              alt="AuraMeet"
              className="h-9 w-auto object-contain cursor-pointer transition-transform hover:scale-105"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-[#f8fafc]">AuraMeet</span>
                <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-[#38bdf8]" />
                <span className="hidden sm:inline-block text-xs text-[#94a3b8]">AI-Powered Meetings</span>
              </div>
              <p className="text-xs text-[#94a3b8] font-normal">
                Good morning, {USER_PROFILE_DATA.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Download Aura Code directly to computer */}
            <a
              href="/aura.zip"
              download="aura.zip"
              onClick={() => onShowToast('Downloading aura.zip to your computer...')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-semibold shadow-md transition-all active:scale-95 cursor-pointer"
              title="Download Aura project zip"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span className="hidden sm:inline">Download Aura Code</span>
              <span className="sm:hidden">Download</span>
            </a>

            {/* Small status: AI Assistant Ready */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111927] border border-[#223049] text-xs font-medium text-[#38bdf8]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse" />
              <span>AI Assistant Ready</span>
            </div>

            <button
              onClick={() => onAskAura()}
              className="w-9 h-9 rounded-full bg-[#141d2e] hover:bg-[#1f2b40] border border-[#223049] flex items-center justify-center text-[#38bdf8] transition-all"
              title="Ask Aura Assistant"
              aria-label="Ask Aura Assistant"
            >
              <span className="material-symbols-outlined text-[19px]">neurology</span>
            </button>

            <button
              onClick={() => onShowToast(`${USER_PROFILE_DATA.name} • ${USER_PROFILE_DATA.role}`)}
              className="w-9 h-9 rounded-full bg-[#162032] hover:bg-[#1f2c44] border border-[#233149] flex items-center justify-center text-[#cbd5e1] hover:text-[#38bdf8] transition-all"
              title={`${USER_PROFILE_DATA.name} (${USER_PROFILE_DATA.role})`}
              aria-label="User Profile"
            >
              <span className="material-symbols-outlined text-[20px]">person</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 pt-6 space-y-6">
        {/* Mobile AI Assistant Status Badge */}
        <div className="sm:hidden flex items-center justify-between p-2.5 rounded-xl bg-[#111927] border border-[#1e293b]">
          <div className="flex items-center gap-2 text-xs font-medium text-[#38bdf8]">
            <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
            <span>AI Assistant Ready</span>
          </div>
          <span className="text-[11px] text-[#94a3b8]">Ready to listen & summarize</span>
        </div>

        {/* Top Action Buttons (New Meeting is Primary) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* "+ New Meeting" (Primary action) */}
          <button
            onClick={onOpenNewMeeting}
            className="flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-2xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-semibold text-sm shadow-md transition-all active:scale-[0.98] group"
          >
            <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">
              add_circle
            </span>
            <span>+ New Meeting</span>
          </button>

          {/* "Schedule" */}
          <button
            onClick={onOpenSchedule}
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-[#141c2b] hover:bg-[#1a2538] border border-[#223049] text-[#f8fafc] font-medium text-sm transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[19px] text-[#38bdf8]">
              calendar_today
            </span>
            <span>Schedule</span>
          </button>

          {/* "Join with Code" */}
          <button
            onClick={onOpenJoinCode}
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-[#141c2b] hover:bg-[#1a2538] border border-[#223049] text-[#f8fafc] font-medium text-sm transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[19px] text-[#38bdf8]">
              tag
            </span>
            <span>Join with Code</span>
          </button>
        </div>

        {/* Meeting Filters & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Filters: All, Today, Upcoming, Recorded, AI Attended */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {(['All', 'Today', 'Upcoming', 'Recorded', 'AI Attended'] as const).map((tab) => {
              const isSelected = filter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
                    isSelected
                      ? 'bg-[#1e293b] text-[#38bdf8] border border-[#38bdf8]/40 shadow-xs'
                      : 'bg-[#111927] text-[#94a3b8] hover:text-[#f8fafc] border border-[#1e293b]'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined text-[17px] text-[#64748b] absolute left-3 top-1/2 -translate-y-1/2">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search meetings..."
              className="w-full bg-[#111927] border border-[#1e293b] rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-[#f8fafc] placeholder:text-[#64748b] focus:outline-none focus:border-[#38bdf8]"
            />
          </div>
        </div>

        {/* SECTION: UPCOMING MEETINGS */}
        {filter !== 'Recorded' && (
          <section className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#f8fafc] tracking-tight">Upcoming</h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#141d2e] text-[#38bdf8] border border-[#223049]">
                  {upcomingMeetings.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {onTriggerReminder && upcomingMeetings.length > 0 && (
                  <button
                    onClick={() => onTriggerReminder(upcomingMeetings[0])}
                    className="text-[11px] font-medium text-[#38bdf8] hover:text-[#7dd3fc] flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#141d2e] hover:bg-[#1b273d] border border-[#223049] transition-all"
                    title="Simulate 5-minute pre-meeting alert toast"
                  >
                    <span className="material-symbols-outlined text-[13px] animate-pulse">notifications_active</span>
                    <span>Test 5m Alert</span>
                  </button>
                )}
                <span className="text-xs text-[#94a3b8]">Sorted by start time</span>
              </div>
            </div>

            {upcomingMeetings.length > 0 ? (
              <div className="space-y-3">
                {upcomingMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="p-4 sm:p-5 rounded-2xl bg-[#111927] border border-[#1e293b] hover:border-[#2b3a52] transition-all shadow-sm flex flex-col gap-3 group"
                  >
                    {/* Top Row: Platform, Status & Time */}
                    <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        {/* Platform Badge */}
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#162032] border border-[#233149] font-medium text-[#38bdf8]">
                          <span className="material-symbols-outlined text-[15px]">
                            {getPlatformIcon(meeting.platform)}
                          </span>
                          <span>{meeting.platform}</span>
                        </span>

                        {/* Date & Time */}
                        <span className="text-[#94a3b8] font-medium">
                          {meeting.date} · {meeting.time}
                        </span>
                      </div>

                      {/* Status / Duration */}
                      {meeting.status === 'live' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ef4444]/15 border border-[#ef4444]/30 text-[#f87171] text-[11px] font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-pulse" />
                          <span>LIVE</span>
                        </span>
                      ) : (
                        <span className="text-xs text-[#94a3b8] font-mono">
                          {meeting.duration}
                        </span>
                      )}
                    </div>

                    {/* Middle: Title & Participants */}
                    <div>
                      <h3
                        onClick={() => onViewMeetingDetail(meeting)}
                        className="text-base font-bold text-[#f8fafc] group-hover:text-[#38bdf8] transition-colors cursor-pointer"
                      >
                        {meeting.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5 text-xs text-[#94a3b8]">
                        <span className="material-symbols-outlined text-[15px]">group</span>
                        <span>{meeting.participantCount} participants</span>
                      </div>
                    </div>

                    {/* AI Assistant Status & Action CTAs */}
                    <div className="pt-2 border-t border-[#1a2436] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-[#38bdf8]/10 text-[#38bdf8] flex items-center justify-center">
                          <span className="material-symbols-outlined text-[15px]">neurology</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-[#94a3b8]">AI Assistant:</span>
                          <span className="text-[#f8fafc] font-medium ml-1.5">
                            {meeting.aiAssistantStatus}
                          </span>
                        </div>
                      </div>

                      {/* CTAs: Join is primary and strongest */}
                      <div className="flex items-center gap-2 self-end sm:self-auto w-full sm:w-auto">
                        <button
                          onClick={() => onViewMeetingDetail(meeting)}
                          className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#162032] hover:bg-[#1e2c44] text-[#cbd5e1] hover:text-[#f8fafc] border border-[#233149] text-xs font-medium transition-all"
                        >
                          Brief
                        </button>

                        <button
                          onClick={() => onJoinMeeting(meeting)}
                          className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
                        >
                          <span className="material-symbols-outlined text-[16px]">videocam</span>
                          <span>Join Meeting</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-[#111927] border border-[#1e293b] rounded-2xl space-y-2">
                <span className="material-symbols-outlined text-[32px] text-[#64748b]">
                  event_busy
                </span>
                <p className="text-sm font-semibold text-[#f8fafc]">No upcoming meetings</p>
                <p className="text-xs text-[#94a3b8]">Schedule a meeting or start an instant session.</p>
              </div>
            )}
          </section>
        )}

        {/* SECTION: RECENT MEETINGS */}
        {filter !== 'Upcoming' && (
          <section className="space-y-3.5 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#f8fafc] tracking-tight">Recent Meetings</h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#141d2e] text-[#94a3b8] border border-[#223049]">
                  {recentMeetings.length}
                </span>
              </div>
              <span className="text-xs text-[#94a3b8]">Summarized by Aura</span>
            </div>

            <div className="space-y-3">
              {recentMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="p-4 sm:p-5 rounded-2xl bg-[#111927] border border-[#1e293b] hover:border-[#2b3a52] transition-all shadow-sm flex flex-col gap-3 group"
                >
                  {/* Top info */}
                  <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                    <span className="font-semibold text-[#38bdf8] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">
                        {getPlatformIcon(meeting.platform)}
                      </span>
                      {meeting.platform}
                    </span>
                    <span className="text-[#94a3b8]">
                      {meeting.date} · {meeting.duration} · {meeting.participantCount} participants
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => onViewMeetingDetail(meeting)}
                    className="text-base font-bold text-[#f8fafc] group-hover:text-[#38bdf8] transition-colors cursor-pointer"
                  >
                    {meeting.title}
                  </h3>

                  {/* AI Summary Preview */}
                  <div className="p-3 rounded-xl bg-[#0c111a] border border-[#1a2436] text-xs text-[#cbd5e1] leading-relaxed">
                    <div className="flex items-center gap-1.5 font-medium text-[#38bdf8] mb-1">
                      <span className="material-symbols-outlined text-[14px]">neurology</span>
                      <span>AI Summary</span>
                    </div>
                    <p className="line-clamp-2">{meeting.summary}</p>
                  </div>

                  {/* Action Items & Decisions Preview */}
                  <div className="flex items-center gap-3 text-xs">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141d2e] text-[#38bdf8] border border-[#223049] font-medium">
                      <span className="material-symbols-outlined text-[14px]">task_alt</span>
                      <span>{meeting.actionItems?.length || 4} Action Items</span>
                    </span>

                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141d2e] text-[#c084fc] border border-[#223049] font-medium">
                      <span className="material-symbols-outlined text-[14px]">gavel</span>
                      <span>{meeting.decisions?.length || 3} Decisions</span>
                    </span>
                  </div>

                  {/* Buttons: View Summary | View Notes | Ask Aura */}
                  <div className="pt-2 border-t border-[#1a2436] flex items-center justify-end gap-2 flex-wrap">
                    <button
                      onClick={() => onViewMeetingDetail(meeting)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#162032] hover:bg-[#1f2c42] text-[#cbd5e1] hover:text-[#f8fafc] text-xs font-medium border border-[#223049] transition-all"
                    >
                      View Summary
                    </button>

                    <button
                      onClick={() => onViewMeetingDetail(meeting)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#162032] hover:bg-[#1f2c42] text-[#cbd5e1] hover:text-[#f8fafc] text-xs font-medium border border-[#223049] transition-all"
                    >
                      View Notes
                    </button>

                    <button
                      onClick={() => onAskAura(`Summarize the ${meeting.title}`)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#0284c7]/20 hover:bg-[#0284c7]/30 text-[#38bdf8] text-xs font-medium border border-[#38bdf8]/30 transition-all flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">chat</span>
                      <span>Ask Aura</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION: QUICK AI PROMPT (SUBTLE COMPACT INPUT) */}
        <div className="pt-2">
          <form
            onSubmit={handleQuickPromptSubmit}
            className="flex items-center gap-2 p-2 rounded-2xl bg-[#111927]/80 border border-[#1a2436] focus-within:border-[#38bdf8]/60 transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-[#141d2e] flex items-center justify-center text-[#38bdf8] shrink-0">
              <span className="material-symbols-outlined text-[17px]">neurology</span>
            </div>

            <input
              type="text"
              value={quickPromptText}
              onChange={(e) => setQuickPromptText(e.target.value)}
              placeholder="Ask Aura about your meetings..."
              className="flex-1 bg-transparent text-xs text-[#f8fafc] placeholder:text-[#64748b] focus:outline-none"
            />

            <button
              type="submit"
              disabled={!quickPromptText.trim()}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                quickPromptText.trim()
                  ? 'bg-[#0284c7] hover:bg-[#0369a1] text-white cursor-pointer'
                  : 'bg-[#162032] text-[#64748b] cursor-not-allowed'
              }`}
            >
              Ask
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};
