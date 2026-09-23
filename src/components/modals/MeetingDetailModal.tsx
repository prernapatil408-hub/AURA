import React, { useState } from 'react';
import { MeetingItem, SmartHighlight, INITIAL_SMART_HIGHLIGHTS } from '../../data/mockData';

interface MeetingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  meeting: MeetingItem | null;
  onJoinMeeting: (meeting: MeetingItem) => void;
  onAskAura: (promptText?: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'warning') => void;
}

export const MeetingDetailModal: React.FC<MeetingDetailModalProps> = ({
  isOpen,
  onClose,
  meeting,
  onJoinMeeting,
  onAskAura,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'highlights' | 'transcript' | 'notes' | 'actions' | 'ai'>('overview');
  const [highlights, setHighlights] = useState<SmartHighlight[]>(
    meeting?.smartHighlights || INITIAL_SMART_HIGHLIGHTS
  );

  const handleTogglePin = (id: string) => {
    setHighlights((prev) =>
      prev.map((h) => (h.id === id ? { ...h, isPinned: !h.isPinned } : h))
    );
  };

  if (!isOpen || !meeting) return null;

  const getPlatformIcon = (platform: string) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-2xl bg-[#0e1420] border border-[#222e44] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#1e293b] flex items-start justify-between gap-3 bg-[#111927]">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#1e293b] text-[#38bdf8] border border-[#38bdf8]/20">
                <span className="material-symbols-outlined text-[14px]">
                  {getPlatformIcon(meeting.platform)}
                </span>
                {meeting.platform}
              </span>

              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[#162032] text-[#94a3b8]">
                <span className="material-symbols-outlined text-[13px]">schedule</span>
                {meeting.date} · {meeting.time}
              </span>

              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[#162032] text-[#94a3b8]">
                <span className="material-symbols-outlined text-[13px]">group</span>
                {meeting.participantCount} participants
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-[#f8fafc] tracking-tight leading-snug">
              {meeting.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {meeting.status !== 'completed' && (
              <button
                onClick={() => {
                  onClose();
                  onJoinMeeting(meeting);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-medium text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">videocam</span>
                <span>Join Meeting</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#1e293b] transition-all"
              aria-label="Close modal"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 sm:px-5 border-b border-[#1e293b] bg-[#0c111a] overflow-x-auto no-scrollbar">
          {[
            { id: 'overview' as const, label: 'Overview', icon: 'dashboard' },
            { id: 'highlights' as const, label: 'Smart Highlights', icon: 'auto_awesome' },
            { id: 'transcript' as const, label: 'Transcript', icon: 'transcribe' },
            { id: 'notes' as const, label: 'Notes', icon: 'edit_note' },
            { id: 'actions' as const, label: 'Action Items', icon: 'check_circle' },
            { id: 'ai' as const, label: 'AI Assistant', icon: 'neurology' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 py-3 px-3 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-[#38bdf8] text-[#38bdf8]'
                    : 'border-transparent text-[#94a3b8] hover:text-[#f8fafc]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#0e1420] text-sm">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* AI Assistant Status Banner */}
              <div className="p-3.5 rounded-xl bg-[#141d2e] border border-[#233149] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#38bdf8]/10 text-[#38bdf8] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">neurology</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#f8fafc] block">
                      {meeting.aiAssistantStatus}
                    </span>
                    <span className="text-[11px] text-[#94a3b8]">
                      Aura synchronized this session's context and notes
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onAskAura(`Summarize the ${meeting.title}`)}
                  className="px-3 py-1.5 rounded-lg bg-[#1e293b] hover:bg-[#283548] text-xs font-medium text-[#38bdf8] transition-all flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[15px]">chat</span>
                  <span>Ask Aura</span>
                </button>
              </div>

              {/* AI Summary */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
                  <span className="material-symbols-outlined text-[16px] text-[#38bdf8]">summarize</span>
                  <span>AI Summary</span>
                </div>
                <div className="p-4 rounded-xl bg-[#121927] border border-[#1f2b3e] text-[#e2e8f0] leading-relaxed text-sm">
                  {meeting.summary || 'Summary is being prepared as the meeting progresses.'}
                </div>
              </div>

              {/* Key Decisions */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
                  <span className="material-symbols-outlined text-[16px] text-[#c084fc]">gavel</span>
                  <span>Key Decisions ({meeting.decisions?.length || 0})</span>
                </div>
                {meeting.decisions && meeting.decisions.length > 0 ? (
                  <div className="space-y-2">
                    {meeting.decisions.map((dec, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-[#121927] border border-[#1f2b3e] flex items-start gap-2.5 text-xs text-[#e2e8f0]"
                      >
                        <span className="material-symbols-outlined text-[16px] text-[#38bdf8] shrink-0 mt-0.5">
                          check
                        </span>
                        <span>{dec}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#94a3b8] italic p-3 bg-[#121927] rounded-xl border border-[#1f2b3e]">
                    No major decisions logged yet.
                  </p>
                )}
              </div>

              {/* Action Items */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
                  <span className="material-symbols-outlined text-[16px] text-[#38bdf8]">task_alt</span>
                  <span>Action Items ({meeting.actionItems?.length || 0})</span>
                </div>
                {meeting.actionItems && meeting.actionItems.length > 0 ? (
                  <div className="space-y-2">
                    {meeting.actionItems.map((act, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-[#121927] border border-[#1f2b3e] flex items-start justify-between gap-3 text-xs"
                      >
                        <div className="flex items-start gap-2.5 text-[#e2e8f0]">
                          <span className="material-symbols-outlined text-[16px] text-[#38bdf8] shrink-0 mt-0.5">
                            radio_button_unchecked
                          </span>
                          <span>{act}</span>
                        </div>
                        <button
                          onClick={() => onShowToast('Action item copied')}
                          className="text-[#94a3b8] hover:text-[#38bdf8] text-[11px] shrink-0"
                        >
                          Copy
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#94a3b8] italic p-3 bg-[#121927] rounded-xl border border-[#1f2b3e]">
                    No action items recorded.
                  </p>
                )}
              </div>

              {/* Pinned Smart Highlights & Key Decisions */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#38bdf8]">
                    <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                    <span>Smart Highlights & Key Decisions</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('highlights')}
                    className="text-[11px] text-[#38bdf8] hover:underline"
                  >
                    View All ({highlights.length})
                  </button>
                </div>
                <div className="space-y-2">
                  {highlights.slice(0, 3).map((hl) => (
                    <div
                      key={hl.id}
                      className="p-3 rounded-xl bg-[#121927] border border-[#1f2b3e] flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                              hl.category === 'decision'
                                ? 'bg-[#22c55e]/15 text-[#4ade80] border border-[#22c55e]/30'
                                : 'bg-[#fbbf24]/15 text-[#fde047] border border-[#fbbf24]/30'
                            }`}
                          >
                            {hl.category === 'decision' ? 'Decision' : 'Key Phrase'}
                          </span>
                          <span className="text-[10px] text-[#94a3b8]">
                            {hl.speaker} · {hl.time}
                          </span>
                        </div>
                        <p className="text-[#e2e8f0] font-medium">"{hl.text}"</p>
                      </div>
                      <span className="text-[10px] font-mono text-[#38bdf8] shrink-0">
                        {hl.confidence}% AI
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Important Moments */}
              {meeting.importantMoments && meeting.importantMoments.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
                    <span className="material-symbols-outlined text-[16px] text-[#fbbf24]">timer</span>
                    <span>Important Moments</span>
                  </div>
                  <div className="space-y-2">
                    {meeting.importantMoments.map((mom, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-[#121927] border border-[#1f2b3e] flex items-center justify-between text-xs"
                      >
                        <span className="text-[#e2e8f0]">{mom.text}</span>
                        <span className="text-[#94a3b8] font-mono text-[11px] bg-[#162032] px-2 py-0.5 rounded">
                          {mom.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SMART HIGHLIGHTS */}
          {activeTab === 'highlights' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#1e293b]">
                <div>
                  <span className="text-xs font-semibold text-[#f8fafc]">AI Smart Highlights</span>
                  <p className="text-[11px] text-[#94a3b8]">Key phrases, decisions, and constraints detected by Aura</p>
                </div>
                <button
                  onClick={() => onShowToast('All highlights exported')}
                  className="text-xs text-[#38bdf8] hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[15px]">content_copy</span>
                  <span>Copy All</span>
                </button>
              </div>

              <div className="space-y-3">
                {highlights.map((hl) => (
                  <div
                    key={hl.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      hl.isPinned
                        ? 'bg-[#131d30] border-[#38bdf8]/40 shadow-sm'
                        : 'bg-[#121927] border-[#1f2b3e]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            hl.category === 'decision'
                              ? 'bg-[#22c55e]/15 text-[#4ade80] border border-[#22c55e]/30'
                              : 'bg-[#fbbf24]/15 text-[#fde047] border border-[#fbbf24]/30'
                          }`}
                        >
                          {hl.category === 'decision' ? 'Decision' : 'Key Phrase'}
                        </span>
                        <span className="text-[11px] text-[#94a3b8]">
                          {hl.speaker} · {hl.time}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          handleTogglePin(hl.id);
                          onShowToast(hl.isPinned ? 'Unpinned' : 'Pinned to meeting');
                        }}
                        className={`p-1 rounded-lg transition-colors ${
                          hl.isPinned
                            ? 'text-[#fbbf24] bg-[#fbbf24]/15'
                            : 'text-[#64748b] hover:text-[#f8fafc]'
                        }`}
                        title={hl.isPinned ? 'Unpin' : 'Pin'}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          push_pin
                        </span>
                      </button>
                    </div>

                    <p className="text-xs text-[#f8fafc] font-medium leading-relaxed">
                      "{hl.text}"
                    </p>

                    <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-white/5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {hl.keywords.map((kw, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded bg-[#162032] border border-[#223049] text-[9px] text-[#94a3b8]"
                          >
                            #{kw}
                          </span>
                        ))}
                      </div>

                      <span className="text-[10px] font-semibold text-[#38bdf8]">
                        {hl.confidence}% AI Confidence
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TRANSCRIPT */}
          {activeTab === 'transcript' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#1e293b]">
                <span className="text-xs text-[#94a3b8]">Meeting Audio Transcription</span>
                <button
                  onClick={() => onShowToast('Transcript exported to clipboard')}
                  className="text-xs text-[#38bdf8] hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[15px]">content_copy</span>
                  <span>Copy All</span>
                </button>
              </div>

              {meeting.transcript && meeting.transcript.length > 0 ? (
                meeting.transcript.map((line, i) => (
                  <div key={i} className="p-3 rounded-xl bg-[#121927] border border-[#1f2b3e] space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#38bdf8]">{line.speaker}</span>
                      <span className="text-[11px] font-mono text-[#94a3b8]">{line.time}</span>
                    </div>
                    <p className="text-xs text-[#e2e8f0] leading-relaxed">{line.text}</p>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-[#94a3b8] bg-[#121927] rounded-xl border border-[#1f2b3e]">
                  <span className="material-symbols-outlined text-[28px] text-[#64748b] mb-2 block">
                    transcribe
                  </span>
                  Full transcript will appear once meeting audio begins.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#121927] border border-[#1f2b3e] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-[#f8fafc] uppercase tracking-wider">
                    Collaborative Notes
                  </h3>
                  <span className="text-[11px] text-[#94a3b8]">Auto-saved</span>
                </div>
                <textarea
                  defaultValue={meeting.notes || 'Meeting notes captured during session.'}
                  rows={6}
                  className="w-full bg-[#0c111a] border border-[#1e293b] rounded-xl p-3 text-xs text-[#f8fafc] focus:outline-none focus:border-[#38bdf8] leading-relaxed"
                />
                <button
                  onClick={() => onShowToast('Notes updated successfully')}
                  className="px-3.5 py-1.5 rounded-lg bg-[#1e293b] hover:bg-[#283548] text-xs font-medium text-[#f8fafc] transition-all"
                >
                  Save Notes
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: ACTION ITEMS */}
          {activeTab === 'actions' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#94a3b8]">Follow-ups Extracted by Aura</span>
                <span className="text-xs text-[#38bdf8] font-medium">
                  {meeting.actionItems?.length || 0} Total
                </span>
              </div>

              {meeting.actionItems?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#121927] border border-[#1f2b3e] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-md border border-[#38bdf8]/40 bg-[#38bdf8]/10 text-[#38bdf8] flex items-center justify-center font-bold text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="text-[#f8fafc]">{item}</span>
                  </div>
                  <button
                    onClick={() => onShowToast('Added to personal tasks')}
                    className="px-2.5 py-1 rounded bg-[#1e293b] text-[#38bdf8] text-[11px] font-medium hover:bg-[#283548]"
                  >
                    Add to Tasks
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: AI */}
          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-b from-[#141f33] to-[#0e1420] border border-[#233149] space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#38bdf8]">
                  <span className="material-symbols-outlined text-[18px]">neurology</span>
                  <span>Aura Assistant Intelligence</span>
                </div>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  Aura actively listened to this meeting, tracked key decisions, and organized follow-up items into your personal workspace.
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <button
                    onClick={() => onAskAura('What decisions were made?')}
                    className="p-2.5 rounded-lg bg-[#121927] border border-[#1f2b3e] text-left text-[#e2e8f0] hover:border-[#38bdf8]/50 transition-all"
                  >
                    "What decisions were made?"
                  </button>
                  <button
                    onClick={() => onAskAura('What are my action items?')}
                    className="p-2.5 rounded-lg bg-[#121927] border border-[#1f2b3e] text-left text-[#e2e8f0] hover:border-[#38bdf8]/50 transition-all"
                  >
                    "What are my action items?"
                  </button>
                  <button
                    onClick={() => onAskAura('Summarize this meeting.')}
                    className="p-2.5 rounded-lg bg-[#121927] border border-[#1f2b3e] text-left text-[#e2e8f0] hover:border-[#38bdf8]/50 transition-all"
                  >
                    "Summarize this meeting."
                  </button>
                  <button
                    onClick={() => onAskAura('What should I follow up on?')}
                    className="p-2.5 rounded-lg bg-[#121927] border border-[#1f2b3e] text-left text-[#e2e8f0] hover:border-[#38bdf8]/50 transition-all"
                  >
                    "What should I follow up on?"
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1e293b] bg-[#111927] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#94a3b8]">
            <span className="w-2 h-2 rounded-full bg-[#38bdf8]" />
            <span>Private & encrypted meeting context</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#1e293b] hover:bg-[#283548] text-xs font-medium text-[#f8fafc] transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
