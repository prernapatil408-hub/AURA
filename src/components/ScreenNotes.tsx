import React, { useState } from 'react';
import { MeetingItem } from '../data/mockData';

interface ScreenNotesProps {
  meetings: MeetingItem[];
  onViewMeetingDetail: (meeting: MeetingItem) => void;
  onAskAura: (promptText?: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'warning') => void;
}

export const ScreenNotes: React.FC<ScreenNotesProps> = ({
  meetings,
  onViewMeetingDetail,
  onAskAura,
  onShowToast
}) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Smart Highlights' | 'Summaries' | 'Action Items' | 'Decisions' | 'Transcripts'>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // Filter and search
  const filteredMeetings = meetings.filter((m) => {
    const q = search.toLowerCase();
    const matchesSearch =
      m.title.toLowerCase().includes(q) ||
      (m.summary && m.summary.toLowerCase().includes(q)) ||
      (m.notes && m.notes.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (filterType === 'Smart Highlights') {
      return (m.smartHighlights && m.smartHighlights.length > 0) || (m.decisions && m.decisions.length > 0);
    }
    if (filterType === 'Action Items') {
      return m.actionItems && m.actionItems.length > 0;
    }
    if (filterType === 'Decisions') {
      return m.decisions && m.decisions.length > 0;
    }
    if (filterType === 'Transcripts') {
      return m.transcript && m.transcript.length > 0;
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#0b0f17] text-[#f8fafc] pb-32">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0b0f17]/95 backdrop-blur-xl border-b border-[#1a2333]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-[#f8fafc] tracking-tight">Meeting Notes</h1>
            <p className="text-xs text-[#94a3b8]">Summaries, decisions & action items</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onAskAura('Summarize all my recent meeting notes')}
              className="px-3 py-1.5 rounded-xl bg-[#0284c7]/20 hover:bg-[#0284c7]/30 text-xs font-semibold text-[#38bdf8] border border-[#38bdf8]/30 flex items-center gap-1.5 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">chat</span>
              <span className="hidden sm:inline">Ask Aura</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 pt-5 space-y-5">
        {/* Search, Filter, Sort Controls */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <span className="material-symbols-outlined text-[18px] text-[#64748b] absolute left-3 top-1/2 -translate-y-1/2">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notes, decisions, keywords..."
                className="w-full bg-[#111927] border border-[#1e293b] rounded-xl pl-9 pr-4 py-2 text-xs text-[#f8fafc] placeholder:text-[#64748b] focus:outline-none focus:border-[#38bdf8]"
              />
            </div>

            {/* Sort Toggle */}
            <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-[#94a3b8]">
              <span className="text-[11px]">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#111927] border border-[#1e293b] rounded-xl px-3 py-2 text-xs text-[#f8fafc] focus:outline-none focus:border-[#38bdf8]"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {(['All', 'Smart Highlights', 'Summaries', 'Action Items', 'Decisions', 'Transcripts'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterType(tab)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 ${
                  filterType === tab
                    ? 'bg-[#1e293b] text-[#38bdf8] border border-[#38bdf8]/40'
                    : 'bg-[#111927] text-[#94a3b8] hover:text-[#f8fafc] border border-[#1e293b]'
                }`}
              >
                {tab === 'Smart Highlights' ? '✨ Smart Highlights' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Notes Cards List */}
        <div className="space-y-4">
          {filteredMeetings.length > 0 ? (
            filteredMeetings.map((meeting) => (
              <div
                key={meeting.id}
                className="p-5 rounded-2xl bg-[#111927] border border-[#1e293b] hover:border-[#2b3a52] transition-all space-y-3.5 shadow-sm group"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-mono text-[#94a3b8]">
                      {meeting.date} · {meeting.time}
                    </span>
                    <h2
                      onClick={() => onViewMeetingDetail(meeting)}
                      className="text-base font-bold text-[#f8fafc] group-hover:text-[#38bdf8] cursor-pointer transition-colors mt-0.5"
                    >
                      {meeting.title}
                    </h2>
                  </div>

                  <span className="px-2.5 py-1 rounded-lg bg-[#162032] border border-[#233149] text-xs font-medium text-[#38bdf8] shrink-0">
                    {meeting.platform}
                  </span>
                </div>

                {/* Summary Preview */}
                <div className="p-3.5 rounded-xl bg-[#0c111a] border border-[#1a2436] text-xs text-[#cbd5e1] leading-relaxed">
                  <span className="font-semibold text-[#38bdf8] block mb-1">AI Summary</span>
                  <p>{meeting.summary}</p>
                </div>

                {/* Key decisions if available */}
                {meeting.decisions && meeting.decisions.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider block">
                      Decisions ({meeting.decisions.length})
                    </span>
                    <div className="space-y-1">
                      {meeting.decisions.map((decision, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-xs text-[#cbd5e1] p-2 rounded-lg bg-[#141b28]"
                        >
                          <span className="material-symbols-outlined text-[15px] text-[#c084fc] shrink-0">
                            check_circle
                          </span>
                          <span>{decision}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action items if available */}
                {meeting.actionItems && meeting.actionItems.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider block">
                      Action Items ({meeting.actionItems.length})
                    </span>
                    <div className="space-y-1">
                      {meeting.actionItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-xs text-[#cbd5e1] p-2 rounded-lg bg-[#141b28]"
                        >
                          <span className="material-symbols-outlined text-[15px] text-[#38bdf8] shrink-0">
                            task_alt
                          </span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer Buttons */}
                <div className="pt-2 border-t border-[#1a2436] flex items-center justify-between">
                  <span className="text-[11px] text-[#94a3b8]">
                    {meeting.participantCount} participants
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(meeting.notes || meeting.summary || '');
                        onShowToast('Notes copied to clipboard');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#162032] hover:bg-[#1e2c44] text-[#cbd5e1] text-xs font-medium border border-[#233149] transition-all flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">content_copy</span>
                      <span>Copy</span>
                    </button>

                    <button
                      onClick={() => onViewMeetingDetail(meeting)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-medium transition-all"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center bg-[#111927] border border-[#1e293b] rounded-2xl space-y-3">
              <span className="material-symbols-outlined text-[36px] text-[#64748b]">
                description
              </span>
              <p className="text-sm font-semibold text-[#f8fafc]">No matching notes found</p>
              <p className="text-xs text-[#94a3b8]">
                Try adjusting your search query or filter criteria.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
