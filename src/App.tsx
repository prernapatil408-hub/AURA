/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ALL_MEETINGS, MeetingItem, PlatformType } from './data/mockData';
import { BottomNav, NavTab } from './components/BottomNav';
import { ScreenMeetingsDashboard } from './components/ScreenMeetingsDashboard';
import { ScreenCalendar } from './components/ScreenCalendar';
import { ScreenAIBrain } from './components/ScreenAIBrain';
import { ScreenNotes } from './components/ScreenNotes';
import { ScreenProfile } from './components/ScreenProfile';
import { ScreenLiveCall } from './components/ScreenLiveCall';
import { MeetingDetailModal } from './components/modals/MeetingDetailModal';
import { AskAuraModal } from './components/modals/AskAuraModal';
import { NewMeetingModal } from './components/modals/NewMeetingModal';
import { ScheduleMeetingModal } from './components/modals/ScheduleMeetingModal';
import { JoinWithCodeModal } from './components/modals/JoinWithCodeModal';
import { MeetingReminderToast } from './components/MeetingReminderToast';
import { Toast } from './components/Toast';

export default function App() {
  // Navigation & Screen state
  const [activeTab, setActiveTab] = useState<NavTab>('meetings');
  const [activeLiveMeeting, setActiveLiveMeeting] = useState<MeetingItem | null>(null);

  // Data state
  const [meetings, setMeetings] = useState<MeetingItem[]>(ALL_MEETINGS);

  // Modals state
  const [selectedMeetingDetail, setSelectedMeetingDetail] = useState<MeetingItem | null>(null);
  const [isAskAuraOpen, setIsAskAuraOpen] = useState(false);
  const [askAuraInitialPrompt, setAskAuraInitialPrompt] = useState<string | undefined>(undefined);
  const [isNewMeetingOpen, setIsNewMeetingOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isJoinCodeOpen, setIsJoinCodeOpen] = useState(false);

  // 5-minute pre-meeting reminder toast alert state
  const [reminderMeeting, setReminderMeeting] = useState<MeetingItem | null>(null);

  // Toast alert state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info' | 'warning'>('success');

  const showToast = (msg: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2500);
  };

  // Automated 5-minute pre-meeting reminder trigger
  useEffect(() => {
    // If not currently in a live meeting, find the earliest upcoming meeting
    const upcoming = meetings.find((m) => m.status === 'upcoming');
    if (upcoming && !activeLiveMeeting) {
      // Trigger a 5-minute pre-meeting toast alert after 3 seconds
      const timer = setTimeout(() => {
        setReminderMeeting(upcoming);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [meetings, activeLiveMeeting]);

  // Actions
  const handleJoinMeeting = (meeting: MeetingItem) => {
    setReminderMeeting(null);
    setActiveLiveMeeting(meeting);
    showToast(`Joined ${meeting.title}`);
  };

  const handleStartInstantMeeting = (title: string, platform: PlatformType) => {
    const newMeeting: MeetingItem = {
      id: 'meet-' + Date.now(),
      title,
      platform,
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: 'In Progress',
      participantCount: 3,
      status: 'live',
      aiAssistantStatus: 'AI Assistant Attending',
      summary: 'Instant meeting initiated with Aura Assistant listening and summarizing in real-time.',
      decisions: [],
      actionItems: [],
      participants: [
        {
          id: 'p1',
          name: 'Prerna',
          role: 'Host',
          avatar:
            'https://lh3.googleusercontent.com/aida/AEtjO1UZtBylDoJeNa4wrPfX3L8P5O-VdtdhamzWfNerZWMSw7ZbnQhXf5FhOxXNMc8cE23CFGxVT_B2fdGWd6vEwL0UlrzWQmnyfS_jKcdtKcEct0xxbYMj84a3l_IOQ7-To-7XO0STHNW8esD3o18Ixdz1o8vMa4vz2lmJarOVRX3Yiy9DuJKYbK75dTo62Ve5PwJpE4w8GEWaSZhefPgVkkFHffY7OtKpY9rwK4H20ud2R0_w_aOrzf0GJbOS',
          isHost: true
        }
      ],
      isAiAttended: true
    };

    setMeetings((prev) => [newMeeting, ...prev]);
    setIsNewMeetingOpen(false);
    setActiveLiveMeeting(newMeeting);
    showToast('Meeting started with AI Assistant');
  };

  const handleScheduleMeeting = (scheduledData: any) => {
    const newScheduled: MeetingItem = {
      id: 'meet-' + Date.now(),
      title: scheduledData.title,
      platform: scheduledData.platform,
      date: scheduledData.date,
      time: scheduledData.time,
      duration: '45 mins',
      participantCount: 4,
      status: 'upcoming',
      aiAssistantStatus: scheduledData.aiAttendance ? 'AI Assistant Scheduled' : 'AI Assistant Ready',
      summary: 'Agenda and pre-meeting brief indexed by Aura.',
      decisions: [],
      actionItems: [],
      participants: [],
      isAiAttended: scheduledData.aiAttendance
    };

    setMeetings((prev) => [newScheduled, ...prev]);
    setIsScheduleOpen(false);
    showToast('Meeting scheduled successfully');
  };

  const handleOpenAskAura = (promptText?: string) => {
    setAskAuraInitialPrompt(promptText);
    setIsAskAuraOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-[#f8fafc] font-sans flex flex-col relative selection:bg-[#38bdf8]/30">
      {/* Global standard Toast */}
      <Toast message={toastMessage} type={toastType} />

      {/* 5-minute pre-meeting reminder toast with immediate Join Now action */}
      <MeetingReminderToast
        meeting={reminderMeeting}
        onJoin={handleJoinMeeting}
        onDismiss={() => setReminderMeeting(null)}
      />

      {/* If in active live meeting, render full screen live video interface */}
      {activeLiveMeeting ? (
        <ScreenLiveCall
          meeting={activeLiveMeeting}
          onLeaveMeeting={() => {
            setActiveLiveMeeting(null);
            showToast('Left meeting. Summary saved to Notes & Brain.');
          }}
          onShowToast={showToast}
        />
      ) : (
        <>
          {/* Main 5 Primary Sections */}
          <div className="flex-1 w-full flex flex-col">
            {activeTab === 'meetings' && (
              <ScreenMeetingsDashboard
                meetings={meetings}
                onOpenNewMeeting={() => setIsNewMeetingOpen(true)}
                onOpenSchedule={() => setIsScheduleOpen(true)}
                onOpenJoinCode={() => setIsJoinCodeOpen(true)}
                onJoinMeeting={handleJoinMeeting}
                onViewMeetingDetail={(m) => setSelectedMeetingDetail(m)}
                onAskAura={handleOpenAskAura}
                onShowToast={showToast}
                onTriggerReminder={(m) => setReminderMeeting(m)}
              />
            )}

            {activeTab === 'calendar' && (
              <ScreenCalendar
                meetings={meetings}
                onJoinMeeting={handleJoinMeeting}
                onViewMeetingDetail={(m) => setSelectedMeetingDetail(m)}
                onScheduleNew={() => setIsScheduleOpen(true)}
                onShowToast={showToast}
              />
            )}

            {activeTab === 'brain' && (
              <ScreenAIBrain
                onAskAura={handleOpenAskAura}
                onShowToast={showToast}
              />
            )}

            {activeTab === 'notes' && (
              <ScreenNotes
                meetings={meetings}
                onViewMeetingDetail={(m) => setSelectedMeetingDetail(m)}
                onAskAura={handleOpenAskAura}
                onShowToast={showToast}
              />
            )}

            {activeTab === 'profile' && (
              <ScreenProfile onShowToast={showToast} />
            )}
          </div>

          {/* Exactly Five Primary Sections Bottom Navigation */}
          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        </>
      )}

      {/* MODALS */}
      {/* 1. Meeting Detail Modal (Overview, Transcript, Notes, Action Items, AI) */}
      <MeetingDetailModal
        isOpen={!!selectedMeetingDetail}
        meeting={selectedMeetingDetail}
        onClose={() => setSelectedMeetingDetail(null)}
        onJoinMeeting={handleJoinMeeting}
        onAskAura={(prompt) => {
          setSelectedMeetingDetail(null);
          handleOpenAskAura(prompt);
        }}
        onShowToast={showToast}
      />

      {/* 2. Ask Aura Assistant Modal */}
      <AskAuraModal
        isOpen={isAskAuraOpen}
        onClose={() => {
          setIsAskAuraOpen(false);
          setAskAuraInitialPrompt(undefined);
        }}
        initialPrompt={askAuraInitialPrompt}
        onShowToast={showToast}
      />

      {/* 3. New Meeting Modal (+ New Meeting) */}
      <NewMeetingModal
        isOpen={isNewMeetingOpen}
        onClose={() => setIsNewMeetingOpen(false)}
        onStartMeeting={handleStartInstantMeeting}
      />

      {/* 4. Schedule Meeting Modal */}
      <ScheduleMeetingModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onSchedule={handleScheduleMeeting}
      />

      {/* 5. Join With Code Modal */}
      <JoinWithCodeModal
        isOpen={isJoinCodeOpen}
        onClose={() => setIsJoinCodeOpen(false)}
        onJoin={(code) => {
          showToast(`Connecting to ${code}...`);
          const matched = meetings[0];
          setTimeout(() => {
            setActiveLiveMeeting(matched);
          }, 300);
        }}
      />
    </div>
  );
}
