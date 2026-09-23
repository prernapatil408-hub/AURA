import React from 'react';

export type NavTab = 'meetings' | 'calendar' | 'brain' | 'notes' | 'profile';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'meetings' as const, label: 'Meetings', icon: 'videocam' },
    { id: 'calendar' as const, label: 'Calendar', icon: 'calendar_month' },
    { id: 'brain' as const, label: 'AI Brain', icon: 'neurology' },
    { id: 'notes' as const, label: 'Notes', icon: 'description' },
    { id: 'profile' as const, label: 'Profile', icon: 'person' }
  ];

  return (
    <nav
      aria-label="Primary Navigation"
      className="fixed bottom-0 inset-x-0 z-40 bg-[#0c1017]/95 backdrop-blur-xl border-t border-[#1e2638] transition-all"
    >
      <div className="max-w-2xl mx-auto grid grid-cols-5 items-center h-16 px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 transition-all relative ${
                isActive
                  ? 'text-[#38bdf8]'
                  : 'text-[#94a3b8] hover:text-[#f8fafc]'
              }`}
            >
              <div className="relative">
                <span
                  className="material-symbols-outlined text-[23px] transition-transform"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {tab.icon}
                </span>
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
                )}
              </div>
              <span
                className={`text-[11px] font-medium tracking-tight mt-0.5 ${
                  isActive ? 'text-[#38bdf8] font-semibold' : 'text-[#94a3b8]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
