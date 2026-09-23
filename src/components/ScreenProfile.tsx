import React, { useState } from 'react';
import { USER_PROFILE_DATA } from '../data/mockData';

interface ScreenProfileProps {
  onShowToast: (msg: string, type?: 'success' | 'info' | 'warning') => void;
}

export const ScreenProfile: React.FC<ScreenProfileProps> = ({ onShowToast }) => {
  const [activeSection, setActiveSection] = useState<'profile' | 'ai' | 'integrations' | 'privacy'>('profile');

  // Preferences toggles
  const [autoJoin, setAutoJoin] = useState(true);
  const [summaryEmail, setSummaryEmail] = useState(true);
  const [actionItemSync, setActionItemSync] = useState(true);
  const [dataRetentionDays, setDataRetentionDays] = useState('90');

  const integrations = [
    { name: 'Google Calendar', icon: 'calendar_today', connected: true, status: 'Synced' },
    { name: 'Google Meet', icon: 'videocam', connected: true, status: 'Active' },
    { name: 'Zoom', icon: 'video_camera_front', connected: true, status: 'Active' },
    { name: 'Microsoft Teams', icon: 'groups', connected: false, status: 'Connect' },
    { name: 'Slack', icon: 'chat', connected: true, status: 'Notifications on' }
  ];

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#0b0f17] text-[#f8fafc] pb-32">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0b0f17]/95 backdrop-blur-xl border-b border-[#1a2333]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-[#f8fafc] tracking-tight">Profile & Settings</h1>
            <p className="text-xs text-[#94a3b8]">Account, AI assistant & integrations</p>
          </div>

          <button
            onClick={() => onShowToast('All settings saved successfully')}
            className="px-4 py-2 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-semibold shadow-sm transition-all"
          >
            Save Changes
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 pt-5 space-y-6">
        {/* User Card */}
        <div className="p-5 rounded-2xl bg-[#111927] border border-[#1e293b] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1e293b] to-[#334155] border-2 border-[#38bdf8]/40 shadow-sm flex items-center justify-center text-[#94a3b8]">
              <span className="material-symbols-outlined text-[36px]">person</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#f8fafc]">{USER_PROFILE_DATA.name}</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/20">
                  {USER_PROFILE_DATA.membership}
                </span>
              </div>
              <p className="text-xs text-[#94a3b8]">{USER_PROFILE_DATA.email}</p>
              <p className="text-xs text-[#64748b] mt-0.5">{USER_PROFILE_DATA.role} · {USER_PROFILE_DATA.department}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-[#0c111a] border border-[#1a2333]">
              <span className="text-xs text-[#94a3b8] block">Meetings</span>
              <span className="text-sm font-bold text-[#f8fafc]">{USER_PROFILE_DATA.stats.meetingsAttended}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0c111a] border border-[#1a2333]">
              <span className="text-xs text-[#94a3b8] block">Time Saved</span>
              <span className="text-sm font-bold text-[#38bdf8]">{USER_PROFILE_DATA.stats.aiHoursSaved}</span>
            </div>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-2 border-b border-[#1e293b] pb-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'profile' as const, label: 'Account & Profile', icon: 'person' },
            { id: 'ai' as const, label: 'AI Assistant', icon: 'neurology' },
            { id: 'integrations' as const, label: 'Integrations', icon: 'extension' },
            { id: 'privacy' as const, label: 'Privacy & Data', icon: 'lock' }
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                activeSection === sec.id
                  ? 'bg-[#1b2537] text-[#38bdf8] border border-[#38bdf8]/30 shadow-xs'
                  : 'text-[#94a3b8] hover:text-[#f8fafc]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{sec.icon}</span>
              <span>{sec.label}</span>
            </button>
          ))}
        </div>

        {/* SECTION: Account & Profile */}
        {activeSection === 'profile' && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-[#111927] border border-[#1e293b] space-y-4">
              <h3 className="text-sm font-bold text-[#f8fafc]">Personal Information</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#cbd5e1] mb-1">Full Name</label>
                  <input
                    type="text"
                    defaultValue={USER_PROFILE_DATA.name}
                    className="w-full bg-[#0c111a] border border-[#1e293b] rounded-xl px-3 py-2 text-xs text-[#f8fafc] focus:outline-none focus:border-[#38bdf8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#cbd5e1] mb-1">Email Address</label>
                  <input
                    type="email"
                    defaultValue={USER_PROFILE_DATA.email}
                    disabled
                    className="w-full bg-[#0c111a]/60 border border-[#1e293b] rounded-xl px-3 py-2 text-xs text-[#64748b] cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#cbd5e1] mb-1">Job Role</label>
                  <input
                    type="text"
                    defaultValue={USER_PROFILE_DATA.role}
                    className="w-full bg-[#0c111a] border border-[#1e293b] rounded-xl px-3 py-2 text-xs text-[#f8fafc] focus:outline-none focus:border-[#38bdf8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#cbd5e1] mb-1">Department</label>
                  <input
                    type="text"
                    defaultValue={USER_PROFILE_DATA.department}
                    className="w-full bg-[#0c111a] border border-[#1e293b] rounded-xl px-3 py-2 text-xs text-[#f8fafc] focus:outline-none focus:border-[#38bdf8]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION: AI Assistant */}
        {activeSection === 'ai' && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-[#111927] border border-[#1e293b] space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[19px] text-[#38bdf8]">neurology</span>
                <h3 className="text-sm font-bold text-[#f8fafc]">AI Assistant Configuration</h3>
              </div>

              <div className="space-y-3.5 pt-1">
                <div className="flex items-center justify-between py-2 border-b border-[#1a2333]">
                  <div>
                    <h4 className="text-xs font-semibold text-[#f8fafc]">Auto-Join Scheduled Meetings</h4>
                    <p className="text-[11px] text-[#94a3b8]">Let Aura automatically attend meetings and capture live notes</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoJoin}
                    onChange={(e) => setAutoJoin(e.target.checked)}
                    className="w-4 h-4 accent-[#0284c7]"
                  />
                </div>

                <div className="flex items-center justify-between py-2 border-b border-[#1a2333]">
                  <div>
                    <h4 className="text-xs font-semibold text-[#f8fafc]">Email Meeting Briefs</h4>
                    <p className="text-[11px] text-[#94a3b8]">Receive structured summary and decisions immediately after meetings</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={summaryEmail}
                    onChange={(e) => setSummaryEmail(e.target.checked)}
                    className="w-4 h-4 accent-[#0284c7]"
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <h4 className="text-xs font-semibold text-[#f8fafc]">Action Item Auto-Sync</h4>
                    <p className="text-[11px] text-[#94a3b8]">Extract to-dos and sync with your task workspace</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={actionItemSync}
                    onChange={(e) => setActionItemSync(e.target.checked)}
                    className="w-4 h-4 accent-[#0284c7]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION: Integrations */}
        {activeSection === 'integrations' && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-[#111927] border border-[#1e293b] space-y-3">
              <h3 className="text-sm font-bold text-[#f8fafc]">Connected Platforms</h3>
              <p className="text-xs text-[#94a3b8]">
                Sync your calendars and video meeting tools for seamless automatic attendance.
              </p>

              <div className="space-y-2.5 pt-2">
                {integrations.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#0c111a] border border-[#1a2333] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#162032] text-[#38bdf8] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#f8fafc]">{item.name}</h4>
                        <span className="text-[11px] text-[#94a3b8]">{item.status}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onShowToast(`${item.name} integration settings updated`)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        item.connected
                          ? 'bg-[#141d2e] text-[#94a3b8] hover:text-[#f8fafc] border border-[#223049]'
                          : 'bg-[#0284c7] text-white hover:bg-[#0369a1]'
                      }`}
                    >
                      {item.connected ? 'Configured' : 'Connect'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION: Privacy & Data */}
        {activeSection === 'privacy' && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-[#111927] border border-[#1e293b] space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[19px] text-[#38bdf8]">shield</span>
                <h3 className="text-sm font-bold text-[#f8fafc]">Privacy & Data Governance</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-[#0c111a] border border-[#1a2333] flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-[#f8fafc]">Data Retention Period</h4>
                    <p className="text-[11px] text-[#94a3b8]">Select how long meeting recordings and transcripts are retained</p>
                  </div>
                  <select
                    value={dataRetentionDays}
                    onChange={(e) => setDataRetentionDays(e.target.value)}
                    className="bg-[#141d2e] border border-[#223049] text-xs text-[#f8fafc] rounded-lg px-2.5 py-1.5 focus:outline-none"
                  >
                    <option value="30">30 Days</option>
                    <option value="90">90 Days</option>
                    <option value="365">1 Year</option>
                    <option value="unlimited">Indefinite</option>
                  </select>
                </div>

                <div className="p-3 rounded-xl bg-[#0c111a] border border-[#1a2333] flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-[#f8fafc]">Export Meeting Intelligence</h4>
                    <p className="text-[11px] text-[#94a3b8]">Download your structured notes, transcripts, and decisions</p>
                  </div>
                  <a
                    href="/aura.zip"
                    download="aura.zip"
                    onClick={() => onShowToast('Downloading complete project aura.zip...')}
                    className="px-3 py-1.5 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-xs font-medium text-white transition-all inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">download</span>
                    <span>Download Project ZIP</span>
                  </a>
                </div>

                <div className="p-3 rounded-xl bg-[#0c111a] border border-[#1a2333] flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-[#ef4444]">Purge Private Memory</h4>
                    <p className="text-[11px] text-[#94a3b8]">Permanently delete indexed context from your Aura Brain</p>
                  </div>
                  <button
                    onClick={() => onShowToast('Data purge requires confirmation', 'warning')}
                    className="px-3 py-1.5 rounded-lg bg-[#ef4444]/15 hover:bg-[#ef4444]/25 text-xs font-medium text-[#f87171] border border-[#ef4444]/30 transition-all"
                  >
                    Purge
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
