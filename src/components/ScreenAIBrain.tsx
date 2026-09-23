import React, { useState } from 'react';
import { BRAIN_SECTIONS } from '../data/mockData';

interface ScreenAIBrainProps {
  onAskAura: (promptText?: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'warning') => void;
}

export const ScreenAIBrain: React.FC<ScreenAIBrainProps> = ({
  onAskAura,
  onShowToast
}) => {
  const [preferences, setPreferences] = useState(BRAIN_SECTIONS.preferences);
  const [activeTab, setActiveTab] = useState<'all' | 'context' | 'decisions' | 'people' | 'projects'>('all');

  const togglePreference = (index: number) => {
    setPreferences((prev) =>
      prev.map((item, i) => (i === index ? { ...item, enabled: !item.enabled } : item))
    );
    onShowToast('Preference updated');
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#0b0f17] text-[#f8fafc] pb-32">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0b0f17]/95 backdrop-blur-xl border-b border-[#1a2333]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0284c7] to-[#a855f7] flex items-center justify-center text-white shadow-sm">
              <span className="material-symbols-outlined text-[20px]">neurology</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#f8fafc] tracking-tight">Your Aura Brain</h1>
              <p className="text-xs text-[#94a3b8]">Personal meeting intelligence & memory</p>
            </div>
          </div>

          <button
            onClick={() => onAskAura()}
            className="px-3.5 py-1.5 rounded-xl bg-[#0284c7]/20 hover:bg-[#0284c7]/30 text-xs font-semibold text-[#38bdf8] border border-[#38bdf8]/30 flex items-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">chat</span>
            <span>Ask Aura</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 pt-5 space-y-6">
        {/* Private AI Context Callout Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#111927] to-[#161d2d] border border-[#233149] shadow-sm flex items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#38bdf8]/10 text-[#38bdf8] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
              <span className="material-symbols-outlined text-[20px]">shield</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#f8fafc]">Private AI Context</h3>
              <p className="text-xs text-[#94a3b8] mt-0.5 leading-relaxed">
                Your meeting knowledge is kept separate from other users. Data is encrypted and accessible only to you.
              </p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/20 shrink-0">
            Encrypted
          </span>
        </div>

        {/* Brain Nav Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'all' as const, label: 'Overview' },
            { id: 'context' as const, label: 'Recent Context' },
            { id: 'decisions' as const, label: 'Decisions' },
            { id: 'people' as const, label: 'Important People' },
            { id: 'projects' as const, label: 'Projects' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
                activeTab === tab.id
                  ? 'bg-[#1e293b] text-[#38bdf8] border border-[#38bdf8]/40'
                  : 'bg-[#111927] text-[#94a3b8] hover:text-[#f8fafc] border border-[#1e293b]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* SECTION: Recent Context */}
        {(activeTab === 'all' || activeTab === 'context') && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#38bdf8]">schedule</span>
                <h2 className="text-sm font-bold text-[#f8fafc]">Recent Context</h2>
              </div>
              <span className="text-xs text-[#94a3b8]">Live memory threads</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {BRAIN_SECTIONS.recentContext.map((ctx, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#111927] border border-[#1e293b] hover:border-[#2b3a52] transition-all flex flex-col justify-between space-y-2"
                >
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#38bdf8]">
                      {ctx.time}
                    </span>
                    <h3 className="text-xs font-bold text-[#f8fafc] mt-1">{ctx.title}</h3>
                    <p className="text-xs text-[#94a3b8] mt-1.5 leading-relaxed">{ctx.summary}</p>
                  </div>
                  <button
                    onClick={() => onAskAura(`Tell me more about ${ctx.title}`)}
                    className="text-left text-xs font-medium text-[#38bdf8] hover:underline pt-2"
                  >
                    Query context →
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION: Decisions */}
        {(activeTab === 'all' || activeTab === 'decisions') && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#c084fc]">gavel</span>
                <h2 className="text-sm font-bold text-[#f8fafc]">Decisions Index</h2>
              </div>
              <span className="text-xs text-[#94a3b8]">{BRAIN_SECTIONS.decisions.length} recorded</span>
            </div>

            <div className="space-y-2.5">
              {BRAIN_SECTIONS.decisions.map((dec, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#111927] border border-[#1e293b] flex items-start justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[16px] text-[#38bdf8] mt-0.5 shrink-0">
                      verified
                    </span>
                    <div>
                      <p className="text-[#f8fafc] font-medium">{dec.text}</p>
                      <p className="text-[11px] text-[#94a3b8] mt-0.5">
                        {dec.meeting} · {dec.date}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onShowToast('Decision copied to clipboard')}
                    className="text-[#94a3b8] hover:text-[#38bdf8] text-[11px] shrink-0"
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION: Projects & Topics */}
        {(activeTab === 'all' || activeTab === 'projects') && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Projects */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#38bdf8]">folder</span>
                <h2 className="text-sm font-bold text-[#f8fafc]">Projects</h2>
              </div>

              <div className="p-4 rounded-2xl bg-[#111927] border border-[#1e293b] space-y-2.5">
                {BRAIN_SECTIONS.projects.map((proj, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#162032] transition-colors"
                  >
                    <div>
                      <h4 className="text-xs font-semibold text-[#f8fafc]">{proj.name}</h4>
                      <p className="text-[11px] text-[#94a3b8]">Active {proj.lastActive}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-[#141d2e] text-xs font-medium text-[#38bdf8] border border-[#223049]">
                      {proj.meetingsCount} meetings
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Topics */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#38bdf8]">label</span>
                <h2 className="text-sm font-bold text-[#f8fafc]">Topics & Tags</h2>
              </div>

              <div className="p-4 rounded-2xl bg-[#111927] border border-[#1e293b]">
                <div className="flex flex-wrap gap-2">
                  {BRAIN_SECTIONS.topics.map((t, idx) => (
                    <button
                      key={idx}
                      onClick={() => onAskAura(`What did we discuss about ${t}?`)}
                      className="px-3 py-1.5 rounded-xl bg-[#162032] hover:bg-[#1f2b40] text-xs font-medium text-[#cbd5e1] hover:text-[#38bdf8] border border-[#233149] transition-all"
                    >
                      #{t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION: Important People */}
        {(activeTab === 'all' || activeTab === 'people') && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#38bdf8]">group</span>
                <h2 className="text-sm font-bold text-[#f8fafc]">Important People</h2>
              </div>
              <span className="text-xs text-[#94a3b8]">Frequent meeting collaborators</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {BRAIN_SECTIONS.importantPeople.map((person, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#111927] border border-[#1e293b] flex items-center gap-3"
                >
                  <img
                    src={person.avatar}
                    alt={person.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#223049]"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#f8fafc] truncate">{person.name}</h4>
                    <p className="text-[11px] text-[#94a3b8] truncate">{person.role}</p>
                    <span className="text-[10px] text-[#38bdf8]">{person.meetingsShared} meetings shared</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION: Preferences */}
        {activeTab === 'all' && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#38bdf8]">tune</span>
              <h2 className="text-sm font-bold text-[#f8fafc]">AI Brain Preferences</h2>
            </div>

            <div className="p-4 rounded-2xl bg-[#111927] border border-[#1e293b] space-y-3">
              {preferences.map((pref, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-2 border-b border-[#1a2333] last:border-none"
                >
                  <div>
                    <h4 className="text-xs font-semibold text-[#f8fafc]">{pref.label}</h4>
                    <p className="text-[11px] text-[#94a3b8]">{pref.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={pref.enabled}
                    onChange={() => togglePreference(idx)}
                    className="w-4 h-4 accent-[#0284c7] cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
