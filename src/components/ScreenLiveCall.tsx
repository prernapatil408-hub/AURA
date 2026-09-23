import React, { useState, useEffect } from 'react';
import {
  MeetingItem,
  CopilotMessage,
  INITIAL_COPILOT_MESSAGES,
  ASK_AURA_SUGGESTIONS,
  SmartHighlight,
  INITIAL_SMART_HIGHLIGHTS
} from '../data/mockData';
import { SmartHighlightsPanel } from './SmartHighlightsPanel';
import {
  analyzeTranscriptSentence,
  SIMULATED_LIVE_SPEECH_STREAM
} from '../utils/smartHighlightsEngine';

interface ScreenLiveCallProps {
  meeting: MeetingItem;
  onLeaveMeeting: () => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'warning') => void;
}

export const ScreenLiveCall: React.FC<ScreenLiveCallProps> = ({
  meeting,
  onLeaveMeeting,
  onShowToast
}) => {
  // Call controls state: Camera and Mic OFF by default
  const [isMicMuted, setIsMicMuted] = useState(true);
  const [isVideoOff, setIsVideoOff] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activeSideTab, setActiveSideTab] = useState<'none' | 'highlights' | 'ai' | 'transcript' | 'notes' | 'participants'>('highlights');
  const [callDuration, setCallDuration] = useState('18:42');

  // AI Copilot state
  const [aiMessages, setAiMessages] = useState<CopilotMessage[]>(INITIAL_COPILOT_MESSAGES);
  const [inputQuery, setInputQuery] = useState('');
  const [isAiResponding, setIsAiResponding] = useState(false);

  // Smart Highlights State
  const [highlights, setHighlights] = useState<SmartHighlight[]>(
    meeting.smartHighlights || INITIAL_SMART_HIGHLIGHTS
  );
  const [recentlyDetected, setRecentlyDetected] = useState<SmartHighlight | null>(null);
  const [speechSimIndex, setSpeechSimIndex] = useState(0);

  // Timer simulation
  useEffect(() => {
    let seconds = 18 * 60 + 42;
    const interval = setInterval(() => {
      seconds++;
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      setCallDuration(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Periodic AI Smart Highlights detection trigger
  useEffect(() => {
    // Automatically trigger a live detection after 6 seconds to demonstrate the AI in action
    const autoDetectionTimer = setTimeout(() => {
      triggerNextSimulatedSpeech();
    }, 6000);

    return () => clearTimeout(autoDetectionTimer);
  }, []);

  const triggerNextSimulatedSpeech = () => {
    const nextSpeech = SIMULATED_LIVE_SPEECH_STREAM[speechSimIndex % SIMULATED_LIVE_SPEECH_STREAM.length];
    setSpeechSimIndex((prev) => prev + 1);

    const detected = analyzeTranscriptSentence(
      nextSpeech.sentence,
      nextSpeech.speaker,
      nextSpeech.time
    );

    if (detected) {
      setHighlights((prev) => [detected, ...prev]);
      setRecentlyDetected(detected);
      onShowToast(`AI Detected ${detected.category === 'decision' ? 'Important Decision' : 'Key Phrase'}: "${detected.text.slice(0, 32)}..."`, 'info');

      // Auto dismiss recently detected floating banner after 5.5s
      setTimeout(() => {
        setRecentlyDetected((curr) => (curr?.id === detected.id ? null : curr));
      }, 5500);
    }
  };

  const handleTogglePin = (id: string) => {
    setHighlights((prev) =>
      prev.map((h) => (h.id === id ? { ...h, isPinned: !h.isPinned } : h))
    );
  };

  const handleAddHighlight = (newHighlight: SmartHighlight) => {
    setHighlights((prev) => [newHighlight, ...prev]);
    setRecentlyDetected(newHighlight);
    setTimeout(() => {
      setRecentlyDetected((curr) => (curr?.id === newHighlight.id ? null : curr));
    }, 5500);
  };

  const handleSendAiPrompt = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: CopilotMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: queryText
    };

    setAiMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsAiResponding(true);

    setTimeout(() => {
      let reply = '';
      const q = queryText.toLowerCase();

      if (q.includes('highlight') || q.includes('pinned')) {
        const pinnedList = highlights.filter((h) => h.isPinned).map((h) => `• ${h.text}`).join('\n');
        reply = `Current Pinned Smart Highlights:\n${pinnedList || 'No highlights pinned yet.'}`;
      } else if (q.includes('decision')) {
        reply = 'Decisions so far: 1) Approved Raft quorum for multi-region replication. 2) Set failover timeout to 120ms. 3) Staging verification scheduled for Friday.';
      } else if (q.includes('action') || q.includes('todo')) {
        reply = 'Action items: 1) Alex M. to verify fallback node configuration. 2) Review automated rollback policies in staging. 3) Publish zero-downtime release notes.';
      } else if (q.includes('summarize') || q.includes('summary')) {
        reply = 'Live Meeting Summary: The architecture team reached consensus on multi-region failover tolerances (120ms) and validated staging benchmarks. Release remains on schedule for Friday.';
      } else if (q.includes('follow up') || q.includes('followup')) {
        reply = 'Follow-up recommendation: Validate tenant memory isolation before Friday morning staging sign-off with Dr. Sarah Chen.';
      } else {
        reply = `Aura is tracking the discussion. The team is currently discussing deployment timelines and fallback cluster configuration.`;
      }

      const botMsg: CopilotMessage = {
        id: 'aura-' + Date.now(),
        sender: 'aura',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: reply,
        actions: ['Add to Notes', 'Copy']
      };

      setAiMessages((prev) => [...prev, botMsg]);
      setIsAiResponding(false);
    }, 600);
  };

  const pinnedHighlights = highlights.filter((h) => h.isPinned);

  return (
    <div className="flex flex-col w-full h-screen bg-[#070a0f] text-[#f8fafc] overflow-hidden select-none">
      {/* 1. TOP BAR: Meeting title | Status | Time */}
      <header className="h-14 px-4 sm:px-6 bg-[#0c111a] border-b border-[#1b2333] flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444] animate-pulse shrink-0" />
          <h1 className="text-sm sm:text-base font-bold text-[#f8fafc] truncate">
            {meeting.title}
          </h1>
          <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#141d2e] text-[#38bdf8] border border-[#223049]">
            {meeting.platform}
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Smart Highlights indicator */}
          <button
            onClick={() => setActiveSideTab(activeSideTab === 'highlights' ? 'none' : 'highlights')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111927] hover:bg-[#162134] border border-[#223049] text-xs font-medium text-[#38bdf8] transition-all"
            title="Open Smart Highlights"
          >
            <span className="material-symbols-outlined text-[15px] text-[#fbbf24]">push_pin</span>
            <span>{pinnedHighlights.length} Pinned</span>
          </button>

          {/* AI Assistant Active status indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111927] border border-[#223049] text-xs font-medium text-[#38bdf8]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse" />
            <span className="hidden sm:inline">AI Active</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-[#cbd5e1] bg-[#162032] px-2.5 py-1 rounded-lg">
            <span className="material-symbols-outlined text-[15px] text-[#94a3b8]">timer</span>
            <span>{callDuration}</span>
          </div>
        </div>
      </header>

      {/* 2. MIDDLE AREA: LARGE VIDEO AREA + OPTIONAL SIDE PANEL */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LARGE VIDEO AREA */}
        <div className="flex-1 flex flex-col p-3 sm:p-4 overflow-hidden bg-[#070a0f] relative">
          {/* FLOATING PINNED HIGHLIGHTS BAR (Shows active decisions pinned to this meeting) */}
          {pinnedHighlights.length > 0 && (
            <div className="absolute top-4 left-4 right-36 sm:right-48 z-10 flex items-center gap-2 overflow-x-auto scrollbar-none pointer-events-auto">
              {pinnedHighlights.map((hl) => (
                <div
                  key={hl.id}
                  onClick={() => setActiveSideTab('highlights')}
                  className="px-3 py-1.5 rounded-xl bg-[#0c111a]/90 hover:bg-[#111927] border border-[#38bdf8]/40 backdrop-blur-md text-[11px] text-[#f8fafc] flex items-center gap-2 shadow-lg shrink-0 cursor-pointer transition-all hover:scale-[1.02]"
                  title="Click to view all smart highlights"
                >
                  <span className="material-symbols-outlined text-[13px] text-[#fbbf24]">push_pin</span>
                  <span className="font-semibold text-[#38bdf8] truncate max-w-[200px] sm:max-w-[280px]">
                    {hl.text}
                  </span>
                  <span className="text-[10px] text-[#94a3b8] font-mono shrink-0">
                    {hl.confidence}% AI
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* FLOATING LIVE DETECTION ALERT (Appears when AI auto-detects a new decision or key phrase) */}
          {recentlyDetected && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 max-w-md w-[calc(100%-2rem)] bg-[#0d1524]/95 border border-[#38bdf8]/60 shadow-[0_10px_35px_rgba(0,0,0,0.7)] backdrop-blur-xl rounded-2xl p-3 text-xs flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-3 duration-300">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#38bdf8]/15 border border-[#38bdf8]/40 flex items-center justify-center text-[#38bdf8] shrink-0">
                  <span className="material-symbols-outlined text-[18px] animate-pulse">
                    auto_awesome
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-[#38bdf8] uppercase tracking-wider">
                      Smart Highlight Detected
                    </span>
                    <span className="text-[10px] text-[#94a3b8] font-mono">
                      {recentlyDetected.confidence}% Match
                    </span>
                  </div>
                  <p className="text-[#f8fafc] font-medium truncate text-xs mt-0.5">
                    "{recentlyDetected.text}"
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => {
                    handleTogglePin(recentlyDetected.id);
                    onShowToast(recentlyDetected.isPinned ? 'Unpinned' : 'Pinned to meeting');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all ${
                    recentlyDetected.isPinned
                      ? 'bg-[#fbbf24] text-black shadow-xs'
                      : 'bg-[#1e293b] text-[#cbd5e1] hover:text-[#f8fafc]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px]">
                    {recentlyDetected.isPinned ? 'check' : 'push_pin'}
                  </span>
                  <span>{recentlyDetected.isPinned ? 'Pinned' : 'Pin'}</span>
                </button>
                <button
                  onClick={() => setRecentlyDetected(null)}
                  className="text-[#94a3b8] hover:text-[#f8fafc] p-1 rounded-lg"
                  aria-label="Dismiss alert"
                >
                  <span className="material-symbols-outlined text-[15px]">close</span>
                </button>
              </div>
            </div>
          )}

          {/* VIDEO GRID */}
          <div className="flex-1 w-full h-full grid grid-cols-1 md:grid-cols-2 gap-3 items-center justify-center min-h-0">
            {/* Primary Speaker: Dr. Sarah Chen */}
            <div className="relative w-full h-full bg-[#0d121c] rounded-2xl overflow-hidden border border-[#1e2738] shadow-lg flex flex-col items-center justify-center group">
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="relative">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#1e293b] to-[#334155] border-2 border-[#38bdf8]/40 flex items-center justify-center shadow-xl">
                    <span className="material-symbols-outlined text-5xl sm:text-6xl text-[#94a3b8]">
                      person
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#1e293b] border-2 border-[#0d121c] flex items-center justify-center text-[#ef4444] shadow-md">
                    <span className="material-symbols-outlined text-[17px]">videocam_off</span>
                  </div>
                </div>

                <div className="text-center">
                  <h4 className="text-sm sm:text-base font-bold text-[#f8fafc]">Dr. Sarah Chen</h4>
                  <p className="text-xs text-[#94a3b8] flex items-center justify-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[14px] text-[#94a3b8]">videocam_off</span>
                    <span>Camera Off</span>
                  </p>
                </div>
              </div>

              {/* Speaker Overlay Label */}
              <div className="absolute bottom-3 left-3 bg-[#0c111a]/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
                <span className="text-xs font-semibold text-[#f8fafc]">Dr. Sarah Chen</span>
                <span className="text-[10px] text-[#38bdf8]">Speaking</span>
              </div>

              {/* Audio Waveform Indicator */}
              <div className="absolute top-3 right-3 flex items-center gap-0.5 bg-black/60 px-2 py-1 rounded-lg border border-white/5">
                <span className="w-1 h-3 bg-[#38bdf8] animate-pulse rounded-full" />
                <span className="w-1 h-4 bg-[#38bdf8] animate-pulse [animation-delay:0.1s] rounded-full" />
                <span className="w-1 h-2 bg-[#38bdf8] animate-pulse [animation-delay:0.2s] rounded-full" />
              </div>
            </div>

            {/* Secondary Feed: Alex Vance */}
            <div className="relative w-full h-full bg-[#0d121c] rounded-2xl overflow-hidden border border-[#1e2738] shadow-lg flex flex-col items-center justify-center">
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="relative">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#1e293b] to-[#334155] border-2 border-[#223049] flex items-center justify-center shadow-xl">
                    <span className="material-symbols-outlined text-5xl sm:text-6xl text-[#94a3b8]">
                      person
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#1e293b] border-2 border-[#0d121c] flex items-center justify-center text-[#ef4444] shadow-md">
                    <span className="material-symbols-outlined text-[17px]">videocam_off</span>
                  </div>
                </div>

                <div className="text-center">
                  <h4 className="text-sm sm:text-base font-bold text-[#f8fafc]">Alex Vance</h4>
                  <p className="text-xs text-[#94a3b8] flex items-center justify-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[14px] text-[#94a3b8]">videocam_off</span>
                    <span>Camera Off</span>
                  </p>
                </div>
              </div>

              <div className="absolute bottom-3 left-3 bg-[#0c111a]/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                <span className="text-xs font-semibold text-[#f8fafc]">Alex Vance</span>
                <span className="text-[10px] text-[#94a3b8]">Platform Lead</span>
              </div>
            </div>
          </div>

          {/* Self preview (floating picture-in-picture) */}
          <div className="absolute top-6 right-6 w-32 sm:w-40 h-24 sm:h-28 bg-[#0e1420] rounded-xl overflow-hidden border-2 border-[#24334a] shadow-2xl z-10 flex flex-col items-center justify-center p-2">
            <div className="w-10 h-10 rounded-full bg-[#1a2333] border border-[#2b3a52] flex items-center justify-center text-[#94a3b8] mb-1">
              <span className="material-symbols-outlined text-[22px]">person</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-[#94a3b8]">
              <span className="material-symbols-outlined text-[12px] text-[#ef4444]">videocam_off</span>
              <span>Camera Off</span>
            </div>
            <div className="absolute bottom-1 left-1.5 right-1.5 text-[9px] font-semibold bg-black/70 px-1.5 py-0.5 rounded text-white text-center truncate">
              You {isMicMuted ? '(Muted)' : ''}
            </div>
          </div>
        </div>

        {/* SIDE PANEL (COLLAPSIBLE TABS) */}
        {activeSideTab !== 'none' && (
          <aside className="w-full sm:w-80 md:w-96 bg-[#0c111a] border-l border-[#1b2333] flex flex-col shrink-0 z-20 transition-all absolute sm:relative inset-y-0 right-0 max-sm:w-full">
            {/* Panel Header */}
            <div className="p-3.5 border-b border-[#1b2333] flex items-center justify-between bg-[#111927]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#38bdf8]">
                  {activeSideTab === 'highlights'
                    ? 'auto_awesome'
                    : activeSideTab === 'ai'
                    ? 'neurology'
                    : activeSideTab === 'transcript'
                    ? 'transcribe'
                    : activeSideTab === 'notes'
                    ? 'edit_note'
                    : 'groups'}
                </span>
                <h3 className="text-xs font-bold text-[#f8fafc] uppercase tracking-wider">
                  {activeSideTab === 'highlights' && `Smart Highlights (${highlights.length})`}
                  {activeSideTab === 'ai' && 'AI Assistant & Ask Aura'}
                  {activeSideTab === 'transcript' && 'Live Transcript'}
                  {activeSideTab === 'notes' && 'Meeting Notes'}
                  {activeSideTab === 'participants' && `Participants (${meeting.participantCount})`}
                </h3>
              </div>

              <button
                onClick={() => setActiveSideTab('none')}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#1e293b]"
                title="Collapse panel"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Panel Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {/* TAB 1: SMART HIGHLIGHTS */}
              {activeSideTab === 'highlights' && (
                <SmartHighlightsPanel
                  highlights={highlights}
                  onTogglePin={handleTogglePin}
                  onAddHighlight={handleAddHighlight}
                  onSimulateNextSpeech={triggerNextSimulatedSpeech}
                  onShowToast={onShowToast}
                />
              )}

              {/* TAB 2: AI ASSISTANT TAB */}
              {activeSideTab === 'ai' && (
                <div className="space-y-4">
                  {/* Status Banner */}
                  <div className="p-3 rounded-xl bg-[#141d2e] border border-[#223049] flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#38bdf8]">
                        <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
                        <span>AI Assistant Active</span>
                      </div>
                      <p className="text-[11px] text-[#94a3b8] mt-0.5">
                        Listening, recording decisions & summarizing
                      </p>
                    </div>
                  </div>

                  {/* Summary Preview */}
                  <div className="p-3 rounded-xl bg-[#111927] border border-[#1e293b] space-y-1">
                    <span className="text-[10px] font-semibold text-[#38bdf8] uppercase tracking-wider block">
                      Live Summary
                    </span>
                    <p className="text-[#cbd5e1] leading-relaxed">
                      {meeting.summary}
                    </p>
                  </div>

                  {/* Quick Pinned Highlights in AI Tab */}
                  {pinnedHighlights.length > 0 && (
                    <div className="p-3 rounded-xl bg-[#111927] border border-[#38bdf8]/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-[#fbbf24] uppercase tracking-wider flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">push_pin</span>
                          <span>Pinned Decisions ({pinnedHighlights.length})</span>
                        </span>
                        <button
                          onClick={() => setActiveSideTab('highlights')}
                          className="text-[10px] text-[#38bdf8] hover:underline"
                        >
                          View All
                        </button>
                      </div>
                      <div className="space-y-1.5">
                        {pinnedHighlights.slice(0, 3).map((ph) => (
                          <div key={ph.id} className="text-[11px] text-[#e2e8f0] flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] mt-1.5 shrink-0" />
                            <span className="line-clamp-2">{ph.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ask Aura Section */}
                  <div className="pt-2 border-t border-[#1b2333] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-[#f8fafc]">Ask Aura</span>
                      <span className="text-[10px] text-[#94a3b8]">Live Assistant</span>
                    </div>

                    <div className="space-y-1.5">
                      {ASK_AURA_SUGGESTIONS.map((chip, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendAiPrompt(chip)}
                          className="w-full text-left p-2 rounded-xl bg-[#111927] hover:bg-[#162032] border border-[#1e293b] text-[#cbd5e1] hover:text-[#38bdf8] transition-all text-[11px] flex items-center justify-between group"
                        >
                          <span>"{chip}"</span>
                          <span className="material-symbols-outlined text-[13px] opacity-0 group-hover:opacity-100 transition-opacity text-[#38bdf8]">
                            arrow_forward
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Messages in Call */}
                    <div className="space-y-2 pt-2">
                      {aiMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-2.5 rounded-xl whitespace-pre-line ${
                            msg.sender === 'user'
                              ? 'bg-[#0284c7] text-white ml-6'
                              : 'bg-[#141d2e] border border-[#223049] text-[#e2e8f0]'
                          }`}
                        >
                          {msg.sender === 'aura' && (
                            <span className="text-[10px] font-bold text-[#38bdf8] block mb-1">
                              Aura Assistant
                            </span>
                          )}
                          <p>{msg.text}</p>
                        </div>
                      ))}

                      {isAiResponding && (
                        <div className="p-2.5 rounded-xl bg-[#141d2e] border border-[#223049] text-[#38bdf8] flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-bounce" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-bounce [animation-delay:0.2s]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-bounce [animation-delay:0.4s]" />
                          <span className="text-[10px] text-[#94a3b8]">Analyzing meeting audio...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: TRANSCRIPT TAB */}
              {activeSideTab === 'transcript' && (
                <div className="space-y-2.5">
                  {meeting.transcript?.map((t, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-[#111927] border border-[#1e293b]">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-semibold text-[#38bdf8]">{t.speaker}</span>
                        <span className="text-[#94a3b8] font-mono">{t.time}</span>
                      </div>
                      <p className="text-[#cbd5e1]">{t.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: NOTES TAB */}
              {activeSideTab === 'notes' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-[#111927] border border-[#1e293b]">
                    <span className="text-[11px] font-semibold text-[#f8fafc] block mb-1">
                      Collaborative Meeting Notes
                    </span>
                    <textarea
                      defaultValue={meeting.notes}
                      rows={8}
                      className="w-full bg-[#0c111a] border border-[#1e293b] rounded-xl p-2.5 text-xs text-[#f8fafc] focus:outline-none focus:border-[#38bdf8]"
                    />
                  </div>
                  <button
                    onClick={() => onShowToast('Notes synced with cloud')}
                    className="w-full py-2 rounded-xl bg-[#162032] hover:bg-[#1e2c44] text-xs font-semibold text-[#38bdf8] border border-[#223049]"
                  >
                    Save Notes
                  </button>
                </div>
              )}

              {/* TAB 5: PARTICIPANTS TAB */}
              {activeSideTab === 'participants' && (
                <div className="space-y-2">
                  {meeting.participants?.map((p) => (
                    <div key={p.id} className="p-2.5 rounded-xl bg-[#111927] border border-[#1e293b] flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#1b2537] border border-[#283850] flex items-center justify-center text-[#94a3b8]">
                          <span className="material-symbols-outlined text-[18px]">person</span>
                        </div>
                        <div>
                          <p className="font-semibold text-[#f8fafc] text-xs">{p.name}</p>
                          <p className="text-[10px] text-[#94a3b8]">{p.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[15px] text-[#ef4444]">videocam_off</span>
                        {p.isHost && (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/20">
                            Host
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Panel Input Bar when AI tab is open */}
            {activeSideTab === 'ai' && (
              <div className="p-3 border-t border-[#1b2333] bg-[#111927]">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendAiPrompt(inputQuery);
                  }}
                  className="flex items-center gap-2 bg-[#0c111a] border border-[#1e293b] rounded-xl px-2.5 py-1.5 focus-within:border-[#38bdf8]"
                >
                  <input
                    type="text"
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    placeholder="Ask Aura anything about this call..."
                    className="flex-1 bg-transparent text-xs text-[#f8fafc] placeholder:text-[#64748b] focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!inputQuery.trim()}
                    className="w-7 h-7 rounded-lg bg-[#0284c7] disabled:bg-[#1e293b] text-white disabled:text-[#64748b] flex items-center justify-center transition-all"
                  >
                    <span className="material-symbols-outlined text-[15px]">arrow_upward</span>
                  </button>
                </form>
              </div>
            )}
          </aside>
        )}
      </div>

      {/* 3. PRIMARY CONTROLS BAR: Mic | Cam | Share | More | Leave + Highlights button */}
      <div className="h-16 px-4 bg-[#0c111a] border-t border-[#1b2333] flex items-center justify-between shrink-0 z-30">
        {/* Left: Meeting quick info */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-[#94a3b8]">
          <span className="material-symbols-outlined text-[16px] text-[#38bdf8]">lock</span>
          <span>End-to-end encrypted</span>
        </div>

        {/* Center: Main Media Controls */}
        <div className="flex items-center gap-2 sm:gap-3 mx-auto sm:mx-0">
          {/* Mic */}
          <button
            onClick={() => {
              setIsMicMuted(!isMicMuted);
              onShowToast(isMicMuted ? 'Microphone unmuted' : 'Microphone muted');
            }}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
              isMicMuted
                ? 'bg-[#ef4444] text-white hover:bg-[#dc2626]'
                : 'bg-[#182234] text-[#f8fafc] hover:bg-[#202d44]'
            }`}
            title={isMicMuted ? 'Unmute Microphone' : 'Mute Microphone'}
          >
            <span className="material-symbols-outlined text-[20px]">
              {isMicMuted ? 'mic_off' : 'mic'}
            </span>
          </button>

          {/* Camera */}
          <button
            onClick={() => {
              setIsVideoOff(!isVideoOff);
              onShowToast(isVideoOff ? 'Camera turned on' : 'Camera turned off');
            }}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
              isVideoOff
                ? 'bg-[#ef4444] text-white hover:bg-[#dc2626]'
                : 'bg-[#182234] text-[#f8fafc] hover:bg-[#202d44]'
            }`}
            title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
          >
            <span className="material-symbols-outlined text-[20px]">
              {isVideoOff ? 'videocam_off' : 'videocam'}
            </span>
          </button>

          {/* Share Screen */}
          <button
            onClick={() => {
              setIsScreenSharing(!isScreenSharing);
              onShowToast(isScreenSharing ? 'Screen sharing stopped' : 'Screen sharing started');
            }}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
              isScreenSharing
                ? 'bg-[#0284c7] text-white'
                : 'bg-[#182234] text-[#f8fafc] hover:bg-[#202d44]'
            }`}
            title="Share Screen"
          >
            <span className="material-symbols-outlined text-[20px]">present_to_all</span>
          </button>

          {/* More options */}
          <button
            onClick={() => onShowToast('Audio & video settings menu')}
            className="w-11 h-11 rounded-2xl bg-[#182234] text-[#f8fafc] hover:bg-[#202d44] flex items-center justify-center transition-all"
            title="More Options"
          >
            <span className="material-symbols-outlined text-[20px]">more_vert</span>
          </button>

          {/* Leave Call */}
          <button
            onClick={onLeaveMeeting}
            className="px-4 h-11 rounded-2xl bg-[#ef4444] hover:bg-[#dc2626] text-white font-semibold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            title="Leave Meeting"
          >
            <span className="material-symbols-outlined text-[18px]">call_end</span>
            <span className="hidden sm:inline">Leave</span>
          </button>
        </div>

        {/* Right: Drawer Triggers (Smart Highlights | Participants | Transcript | Notes | Ask Aura) */}
        <div className="flex items-center gap-1">
          {/* Smart Highlights Button with Pin Count badge */}
          <button
            onClick={() => setActiveSideTab(activeSideTab === 'highlights' ? 'none' : 'highlights')}
            className={`p-2 rounded-xl text-xs flex items-center gap-1 transition-all relative ${
              activeSideTab === 'highlights'
                ? 'bg-[#0284c7] text-white shadow-xs'
                : 'text-[#38bdf8] hover:bg-[#162032]'
            }`}
            title="Smart Highlights"
          >
            <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
            {pinnedHighlights.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#fbbf24] text-black text-[9px] font-bold flex items-center justify-center shadow-xs">
                {pinnedHighlights.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSideTab(activeSideTab === 'participants' ? 'none' : 'participants')}
            className={`p-2 rounded-xl text-xs flex items-center gap-1 transition-all ${
              activeSideTab === 'participants'
                ? 'bg-[#1e293b] text-[#38bdf8]'
                : 'text-[#94a3b8] hover:text-[#f8fafc]'
            }`}
            title="Participants"
          >
            <span className="material-symbols-outlined text-[20px]">group</span>
          </button>

          <button
            onClick={() => setActiveSideTab(activeSideTab === 'transcript' ? 'none' : 'transcript')}
            className={`p-2 rounded-xl text-xs flex items-center gap-1 transition-all ${
              activeSideTab === 'transcript'
                ? 'bg-[#1e293b] text-[#38bdf8]'
                : 'text-[#94a3b8] hover:text-[#f8fafc]'
            }`}
            title="Transcript"
          >
            <span className="material-symbols-outlined text-[20px]">transcribe</span>
          </button>

          <button
            onClick={() => setActiveSideTab(activeSideTab === 'notes' ? 'none' : 'notes')}
            className={`p-2 rounded-xl text-xs flex items-center gap-1 transition-all ${
              activeSideTab === 'notes'
                ? 'bg-[#1e293b] text-[#38bdf8]'
                : 'text-[#94a3b8] hover:text-[#f8fafc]'
            }`}
            title="Notes"
          >
            <span className="material-symbols-outlined text-[20px]">edit_note</span>
          </button>

          <button
            onClick={() => setActiveSideTab(activeSideTab === 'ai' ? 'none' : 'ai')}
            className={`p-2 sm:px-3 rounded-xl text-xs flex items-center gap-1.5 font-medium transition-all ${
              activeSideTab === 'ai'
                ? 'bg-[#0284c7] text-white shadow-xs'
                : 'bg-[#141d2e] text-[#38bdf8] border border-[#223049] hover:bg-[#1a2538]'
            }`}
            title="Ask Aura Assistant"
          >
            <span className="material-symbols-outlined text-[18px]">neurology</span>
            <span className="hidden md:inline">Ask Aura</span>
          </button>
        </div>
      </div>
    </div>
  );
};
