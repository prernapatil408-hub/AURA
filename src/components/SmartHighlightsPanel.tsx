import React, { useState } from 'react';
import { SmartHighlight } from '../data/mockData';
import { analyzeTranscriptSentence } from '../utils/smartHighlightsEngine';

interface SmartHighlightsPanelProps {
  highlights: SmartHighlight[];
  onTogglePin: (highlightId: string) => void;
  onAddHighlight: (highlight: SmartHighlight) => void;
  onSimulateNextSpeech: () => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'warning') => void;
}

export const SmartHighlightsPanel: React.FC<SmartHighlightsPanelProps> = ({
  highlights,
  onTogglePin,
  onAddHighlight,
  onSimulateNextSpeech,
  onShowToast
}) => {
  const [filter, setFilter] = useState<'all' | 'pinned' | 'decision' | 'key_phrase'>('all');
  const [customPhrase, setCustomPhrase] = useState('');
  const [isAutoDetecting, setIsAutoDetecting] = useState(true);

  // Filtered highlights
  const filtered = highlights.filter((h) => {
    if (filter === 'pinned') return h.isPinned;
    if (filter === 'decision') return h.category === 'decision';
    if (filter === 'key_phrase') return h.category === 'key_phrase';
    return true;
  });

  const pinnedCount = highlights.filter((h) => h.isPinned).length;
  const decisionCount = highlights.filter((h) => h.category === 'decision').length;

  const handleAnalyzeCustomPhrase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPhrase.trim()) return;

    const detected = analyzeTranscriptSentence(
      customPhrase,
      'Prerna (You)',
      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );

    if (detected) {
      onAddHighlight(detected);
      setCustomPhrase('');
      onShowToast(`Auto-detected: ${detected.category.replace('_', ' ')} (${detected.confidence}% confidence)`);
    } else {
      // Create manual highlight with standard confidence
      const manual: SmartHighlight = {
        id: 'hl-' + Date.now(),
        text: customPhrase.trim(),
        category: 'key_phrase',
        speaker: 'Prerna (You)',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidence: 90,
        isPinned: true,
        keywords: ['Manual Pin']
      };
      onAddHighlight(manual);
      setCustomPhrase('');
      onShowToast('Captured and pinned highlight');
    }
  };

  return (
    <div className="flex flex-col h-full space-y-3.5 text-xs">
      {/* 1. Status Banner */}
      <div className="p-3 rounded-xl bg-gradient-to-r from-[#141d2e] to-[#0f172a] border border-[#223049] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#38bdf8]/15 border border-[#38bdf8]/30 flex items-center justify-center text-[#38bdf8]">
            <span className="material-symbols-outlined text-[17px] animate-pulse">
              auto_awesome
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-[#f8fafc]">
              <span>Smart Highlights</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] bg-[#38bdf8]/15 text-[#38bdf8] font-semibold uppercase">
                AI Active
              </span>
            </div>
            <p className="text-[11px] text-[#94a3b8]">
              Auto-detecting key phrases & decisions live
            </p>
          </div>
        </div>

        {/* Auto-detect toggle */}
        <button
          onClick={() => {
            setIsAutoDetecting(!isAutoDetecting);
            onShowToast(isAutoDetecting ? 'Auto-detect paused' : 'Auto-detect resumed');
          }}
          className={`px-2 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
            isAutoDetecting
              ? 'bg-[#0369a1]/30 border-[#38bdf8]/40 text-[#38bdf8]'
              : 'bg-[#1e293b] border-[#334155] text-[#94a3b8]'
          }`}
          title="Toggle live auto-detection"
        >
          {isAutoDetecting ? 'Listening' : 'Paused'}
        </button>
      </div>

      {/* 2. Simulation Action Button */}
      <div className="flex items-center gap-2">
        <button
          onClick={onSimulateNextSpeech}
          className="flex-1 py-2 px-3 rounded-xl bg-[#162032] hover:bg-[#1f2e47] border border-[#223049] text-[#38bdf8] hover:text-[#7dd3fc] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-[15px] animate-pulse">
            record_voice_over
          </span>
          <span>Simulate Spoken Decision</span>
        </button>
      </div>

      {/* 3. Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setFilter('all')}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
            filter === 'all'
              ? 'bg-[#0284c7] text-white shadow-xs'
              : 'bg-[#111927] text-[#94a3b8] hover:text-[#f8fafc] border border-[#1e293b]'
          }`}
        >
          All ({highlights.length})
        </button>
        <button
          onClick={() => setFilter('pinned')}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1 ${
            filter === 'pinned'
              ? 'bg-[#0284c7] text-white shadow-xs'
              : 'bg-[#111927] text-[#94a3b8] hover:text-[#f8fafc] border border-[#1e293b]'
          }`}
        >
          <span className="material-symbols-outlined text-[13px] text-[#fbbf24]">push_pin</span>
          <span>Pinned ({pinnedCount})</span>
        </button>
        <button
          onClick={() => setFilter('decision')}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1 ${
            filter === 'decision'
              ? 'bg-[#0284c7] text-white shadow-xs'
              : 'bg-[#111927] text-[#94a3b8] hover:text-[#f8fafc] border border-[#1e293b]'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
          <span>Decisions ({decisionCount})</span>
        </button>
        <button
          onClick={() => setFilter('key_phrase')}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
            filter === 'key_phrase'
              ? 'bg-[#0284c7] text-white shadow-xs'
              : 'bg-[#111927] text-[#94a3b8] hover:text-[#f8fafc] border border-[#1e293b]'
          }`}
        >
          Key Phrases
        </button>
      </div>

      {/* 4. List of Auto-detected Highlights */}
      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-0.5">
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-xl border transition-all group relative ${
                item.isPinned
                  ? 'bg-[#111a2e]/90 border-[#38bdf8]/40 shadow-sm'
                  : 'bg-[#111927] border-[#1e293b] hover:border-[#27354d]'
              }`}
            >
              {/* Card Header: Category badge & Pin button */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                      item.category === 'decision'
                        ? 'bg-[#22c55e]/15 text-[#4ade80] border border-[#22c55e]/30'
                        : item.category === 'action_item'
                        ? 'bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/30'
                        : 'bg-[#fbbf24]/15 text-[#fde047] border border-[#fbbf24]/30'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[12px]">
                      {item.category === 'decision'
                        ? 'check_circle'
                        : item.category === 'action_item'
                        ? 'task_alt'
                        : 'bookmark'}
                    </span>
                    <span>
                      {item.category === 'decision'
                        ? 'Decision'
                        : item.category === 'action_item'
                        ? 'Action'
                        : 'Key Phrase'}
                    </span>
                  </span>

                  <span className="text-[10px] text-[#94a3b8]">
                    {item.speaker} · {item.time}
                  </span>
                </div>

                {/* Pin toggle button */}
                <button
                  onClick={() => {
                    onTogglePin(item.id);
                    onShowToast(item.isPinned ? 'Highlight unpinned' : 'Highlight pinned to screen');
                  }}
                  className={`p-1 rounded-lg transition-colors ${
                    item.isPinned
                      ? 'text-[#fbbf24] bg-[#fbbf24]/15 hover:bg-[#fbbf24]/25'
                      : 'text-[#64748b] hover:text-[#f8fafc] hover:bg-[#1e293b]'
                  }`}
                  title={item.isPinned ? 'Unpin highlight' : 'Pin highlight to top'}
                  aria-label={item.isPinned ? 'Unpin highlight' : 'Pin highlight to top'}
                >
                  <span
                    className={`material-symbols-outlined text-[16px] ${
                      item.isPinned ? 'fill-current' : ''
                    }`}
                  >
                    push_pin
                  </span>
                </button>
              </div>

              {/* Phrase text */}
              <p className="text-[#e2e8f0] font-medium leading-relaxed text-xs">
                "{item.text}"
              </p>

              {/* Tags and AI Confidence */}
              <div className="mt-2.5 flex items-center justify-between gap-2 pt-2 border-t border-white/5">
                <div className="flex items-center gap-1 flex-wrap">
                  {item.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 rounded bg-[#162032] border border-[#223049] text-[9px] text-[#94a3b8]"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>

                <span className="text-[10px] font-semibold text-[#38bdf8] flex items-center gap-0.5 shrink-0">
                  <span className="material-symbols-outlined text-[12px]">psychology</span>
                  <span>{item.confidence}% Match</span>
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-xs text-[#94a3b8] bg-[#111927] rounded-xl border border-[#1e293b]">
            <span className="material-symbols-outlined text-[24px] text-[#64748b] mb-1.5 block">
              filter_list
            </span>
            No highlights match this filter.
          </div>
        )}
      </div>

      {/* 5. Custom phrase input (Allows user to test AI detection logic) */}
      <div className="pt-2 border-t border-[#1b2333]">
        <form onSubmit={handleAnalyzeCustomPhrase} className="space-y-1.5">
          <label className="text-[11px] font-semibold text-[#94a3b8] block">
            Test AI Phrase Detection
          </label>
          <div className="flex items-center gap-1.5 bg-[#0c111a] border border-[#1e293b] rounded-xl px-2.5 py-1.5 focus-within:border-[#38bdf8]">
            <input
              type="text"
              value={customPhrase}
              onChange={(e) => setCustomPhrase(e.target.value)}
              placeholder="e.g. 'Approved moving failover timeout to 100ms'"
              className="flex-1 bg-transparent text-xs text-[#f8fafc] placeholder:text-[#64748b] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!customPhrase.trim()}
              className="px-2 py-1 rounded-lg bg-[#0284c7] disabled:bg-[#1e293b] text-white disabled:text-[#64748b] text-[11px] font-semibold flex items-center gap-1 transition-all"
            >
              <span>Analyze</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
