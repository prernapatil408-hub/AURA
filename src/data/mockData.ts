export interface MeetingParticipant {
  id: string;
  name: string;
  role: string;
  avatar: string;
  isHost?: boolean;
  isMuted?: boolean;
  isVideoOff?: boolean;
}

export type PlatformType = 'Google Meet' | 'Zoom' | 'Microsoft Teams' | 'AuraMeet';

export interface MeetingItem {
  id: string;
  title: string;
  platform: PlatformType;
  date: string;
  time: string;
  duration: string;
  participantCount: number;
  participants: MeetingParticipant[];
  status: 'live' | 'upcoming' | 'completed';
  aiAssistantStatus: 'AI Assistant Ready' | 'AI Assistant Scheduled' | 'AI Assistant Attending' | 'AI Summary Ready';
  summary?: string;
  actionItems?: string[];
  decisions?: string[];
  importantMoments?: { time: string; text: string }[];
  transcript?: { speaker: string; time: string; text: string }[];
  notes?: string;
  project?: string;
  tags?: string[];
  isAiAttended?: boolean;
  smartHighlights?: SmartHighlight[];
}

export interface SmartHighlight {
  id: string;
  meetingId?: string;
  text: string;
  category: 'decision' | 'key_phrase' | 'action_item';
  speaker: string;
  time: string;
  confidence: number;
  isPinned: boolean;
  keywords: string[];
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'aura';
  time: string;
  text: string;
  highlightWords?: string[];
  actions?: string[];
}

export interface ActionItemRecord {
  id: string;
  title: string;
  meetingTitle: string;
  meetingDate: string;
  assignedTo: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'pending' | 'completed';
}

export const BRAND_ASSETS = {
  logo: 'https://lh3.googleusercontent.com/aida/AEtjO1WYZZ1EqEQkIKaJfSBRLb84iDRvv_YvM-Df3CjgtY0QXYOSjnZ6hxlJEhTBI2uhxre9sBMwHQB5b1zBqkPI4Tqr5zZ-NLbqYmrBhZC2_3erl-pwHsPf09iz6VmiH3yNAOlolKrS-mpA1HnxPDm2uUUYEjp5vj1uJiv8u60LcyUdy_iG_O6IO35doZd0Yr60cdyVQRXJyb4ZDCubGXZ-Tp0o4mvQan9BkPs9WuKE3gdS16AKj5-_EMMckPN8',
  userProfile: 'https://lh3.googleusercontent.com/aida/AEtjO1UZtBylDoJeNa4wrPfX3L8P5O-VdtdhamzWfNerZWMSw7ZbnQhXf5FhOxXNMc8cE23CFGxVT_B2fdGWd6vEwL0UlrzWQmnyfS_jKcdtKcEct0xxbYMj84a3l_IOQ7-To-7XO0STHNW8esD3o18Ixdz1o8vMa4vz2lmJarOVRX3Yiy9DuJKYbK75dTo62Ve5PwJpE4w8GEWaSZhefPgVkkFHffY7OtKpY9rwK4H20ud2R0_w_aOrzf0GJbOS',
  speakerSarah: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqYCYGLdQP0NF-RA3_SMBeAVobgm7ffl3hs0tBjm_Ck4hCiK_3GzdB5bn-5nrLDm24bl-GUiruACRiH-DiNYa7-C1Q8amg1xHi0QLQq3e0zs12AyV6DTlWT8z88oToVPnxfjjgnx7eLY7x510QUbMZfhl9BoEYmlc49MBfLxxmKzLyxIXu5qCiCLjVXpGHDHeoG_jmD34WGrpLZLzMlCsWU22F9_yiKN4fK2NV4XE6quZK4UYXdeKpzw',
  attendeeAlex: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHJjtfw7u0lnJ6T1oHQWbSkX-1cd9zIbKxfenC-WisGWxOfp0tV8cD2q2O0bSRi2f_IYiPuOYO2ZMfsjF3Ml89Z_5Vmhdk1IQ4028PPLNI5tCX7Tv0Yw1KUMGFnuXPUEQu2cpRE3s1DZJHN_AG7RQzaVeKLWpB7oEtrrsTFeVVOgaLu83-_Sa2JzQ527GoQ1pOmROjMIpidigOgJJ7MqRr6rXKhfMYdvn_77zRWFnTGbur3iBN8Y7UNA'
};

export const INITIAL_COPILOT_MESSAGES: CopilotMessage[] = [
  {
    id: 'm1',
    sender: 'user',
    time: '11:25 AM',
    text: 'What was Dr. Sarah’s consensus on the deployment timeline?'
  },
  {
    id: 'm2',
    sender: 'aura',
    time: '11:25 AM',
    text: 'Dr. Sarah Chen aligned the rollout for Friday 5:00 PM. She confirmed the staging validation must pass automated security checks before public release.',
    highlightWords: ['Friday 5:00 PM', 'staging validation', 'automated security checks'],
    actions: ['Add to Notes', 'Copy', 'Share']
  }
];

export const INITIAL_SMART_HIGHLIGHTS: SmartHighlight[] = [
  {
    id: 'hl-1',
    meetingId: 'meet-1',
    text: 'Approved Raft-based distributed quorum across regional cluster nodes',
    category: 'decision',
    speaker: 'Dr. Sarah Chen',
    time: '18:14',
    confidence: 98,
    isPinned: true,
    keywords: ['Approved', 'Raft quorum', 'Regional nodes']
  },
  {
    id: 'hl-2',
    meetingId: 'meet-1',
    text: 'Configured heartbeat failover timeout strictly at 120ms threshold',
    category: 'decision',
    speaker: 'Alex Vance',
    time: '18:22',
    confidence: 95,
    isPinned: true,
    keywords: ['Failover timeout', '120ms', 'Configured']
  },
  {
    id: 'hl-3',
    meetingId: 'meet-1',
    text: 'Zero-downtime release notes must be published to team wiki before staging cutover',
    category: 'action_item',
    speaker: 'Prerna',
    time: '18:31',
    confidence: 93,
    isPinned: false,
    keywords: ['Zero-downtime', 'Release notes', 'Wiki']
  },
  {
    id: 'hl-4',
    meetingId: 'meet-1',
    text: 'Pre-flight stress verification scheduled for Friday 5:00 PM sign-off',
    category: 'key_phrase',
    speaker: 'Dr. Sarah Chen',
    time: '18:39',
    confidence: 91,
    isPinned: false,
    keywords: ['Stress verification', 'Friday 5:00 PM', 'Sign-off']
  }
];

export const ASK_AURA_SUGGESTIONS = [
  'What decisions were made?',
  'What are my action items?',
  'Summarize this meeting.',
  'What should I follow up on?'
];

export const ALL_MEETINGS: MeetingItem[] = [
  {
    id: 'meet-1',
    title: 'Distributed Systems Architecture Sync',
    platform: 'Google Meet',
    date: 'Today',
    time: '11:30 AM – 12:15 PM',
    duration: '45 mins',
    participantCount: 5,
    status: 'live',
    aiAssistantStatus: 'AI Assistant Attending',
    summary: 'Aligned core multi-region replication architecture and finalized client failover timeouts. Confirmed staging deployment schedule for Friday afternoon with automated rollback triggers.',
    decisions: [
      'Approved Raft-based distributed quorum for regional nodes',
      'Configured heartbeat failover timeout to 120ms',
      'Scheduled deployment staging sign-off for Friday 5:00 PM'
    ],
    actionItems: [
      'Alex M. to verify fallback node configuration by Friday noon',
      'Prerna to review automated rollback policies in staging',
      'Publish zero-downtime release notes to team wiki'
    ],
    importantMoments: [
      { time: '11:34 AM', text: 'Sarah outlined new multi-region failover strategy' },
      { time: '11:42 AM', text: 'Alex demonstrated cluster benchmark metrics' },
      { time: '11:58 AM', text: 'Consensus reached on Friday deployment target' }
    ],
    transcript: [
      { speaker: 'Dr. Sarah Chen', time: '11:31 AM', text: 'Welcome everyone. Today we are locking in our multi-region replication parameters before the release.' },
      { speaker: 'Alex Vance', time: '11:33 AM', text: 'Telemetry tests look solid across all staging instances. Heartbeat latencies are well within budget.' },
      { speaker: 'Prerna', time: '11:36 AM', text: 'Aura is actively logging our action items and key decisions for review.' },
      { speaker: 'Dr. Sarah Chen', time: '11:45 AM', text: 'Perfect. Let’s make sure tenant security invariants are strictly maintained throughout.' }
    ],
    notes: 'Key architectural objectives met. Team agreed on unified staging testing protocol before production cutover.',
    project: 'Core Platform',
    tags: ['Architecture', 'Deployment', 'Multi-region'],
    isAiAttended: true,
    participants: [
      { id: 'p1', name: 'Dr. Sarah Chen', role: 'Lead Architect', avatar: BRAND_ASSETS.speakerSarah, isHost: true },
      { id: 'p2', name: 'Alex Vance', role: 'Platform Engineer', avatar: BRAND_ASSETS.attendeeAlex },
      { id: 'p3', name: 'Prerna', role: 'Infrastructure Lead', avatar: BRAND_ASSETS.userProfile },
      { id: 'p4', name: 'Elena Rostova', role: 'DevOps Specialist', avatar: BRAND_ASSETS.speakerSarah },
      { id: 'p5', name: 'Marcus Brody', role: 'Security Reviewer', avatar: BRAND_ASSETS.attendeeAlex }
    ]
  },
  {
    id: 'meet-2',
    title: 'Product Design & User Experience Review',
    platform: 'Zoom',
    date: 'Today',
    time: '2:30 PM – 3:15 PM',
    duration: '45 mins',
    participantCount: 4,
    status: 'upcoming',
    aiAssistantStatus: 'AI Assistant Ready',
    summary: 'Evaluating high-fidelity mobile navigation prototypes, dark mode accessibility ratios, and frictionless meeting entry workflows.',
    decisions: [
      'Approved 5-section bottom navigation hierarchy',
      'Adopted clean slate elevation for cards with minimal glow'
    ],
    actionItems: [
      'Finalize icon set and accessibility contrast audit',
      'Deliver interactive prototype for executive review'
    ],
    importantMoments: [
      { time: 'Scheduled', text: 'Review mobile usability findings' },
      { time: 'Scheduled', text: 'Sign-off on bottom navigation design' }
    ],
    notes: 'Prepare notes on user feedback collected during the beta testing cohort.',
    project: 'Mobile UX',
    tags: ['Design', 'Mobile', 'Usability'],
    isAiAttended: true,
    participants: [
      { id: 'p1', name: 'Prerna', role: 'Infrastructure Lead', avatar: BRAND_ASSETS.userProfile, isHost: true },
      { id: 'p2', name: 'Maya Lin', role: 'Product Designer', avatar: BRAND_ASSETS.speakerSarah },
      { id: 'p3', name: 'Jordan Hayes', role: 'Design Lead', avatar: BRAND_ASSETS.attendeeAlex },
      { id: 'p4', name: 'Claire Dupont', role: 'UX Researcher', avatar: BRAND_ASSETS.speakerSarah }
    ]
  },
  {
    id: 'meet-3',
    title: 'Q4 Product Roadmap & Executive Alignment',
    platform: 'Microsoft Teams',
    date: 'Tomorrow',
    time: '10:00 AM – 11:00 AM',
    duration: '60 mins',
    participantCount: 8,
    status: 'upcoming',
    aiAssistantStatus: 'AI Assistant Scheduled',
    summary: 'Reviewing quarterly goals, cross-team milestone dependencies, and enterprise customer expansion roadmap.',
    decisions: [],
    actionItems: [
      'Prepare quarterly performance metrics deck',
      'Synthesize enterprise feedback themes'
    ],
    notes: 'Aura Assistant scheduled to capture full meeting brief and executive summary.',
    project: 'Strategy',
    tags: ['Roadmap', 'Leadership', 'Q4'],
    isAiAttended: true,
    participants: [
      { id: 'p1', name: 'David Kim', role: 'VP Engineering', avatar: BRAND_ASSETS.attendeeAlex, isHost: true },
      { id: 'p2', name: 'Dr. Sarah Chen', role: 'Lead Architect', avatar: BRAND_ASSETS.speakerSarah },
      { id: 'p3', name: 'Prerna', role: 'Infrastructure Lead', avatar: BRAND_ASSETS.userProfile }
    ]
  },
  {
    id: 'meet-4',
    title: 'Database Sharding & Query Optimization',
    platform: 'Google Meet',
    date: 'Yesterday',
    time: '3:00 PM – 3:45 PM',
    duration: '45 mins',
    participantCount: 6,
    status: 'completed',
    aiAssistantStatus: 'AI Summary Ready',
    summary: 'Analyzed distributed table partition benchmarks. Decoupled read replicas from primary transactional nodes to prevent lock contention under peak workload.',
    decisions: [
      'Adopted partitioned hash ring architecture for horizontal scale',
      'Enforced immutable audit log streaming to encrypted cold storage',
      'Agreed on zero-downtime database indexing window'
    ],
    actionItems: [
      'Run stress test with 10M synthetic records',
      'Update query routing middleware documentation',
      'Audit token access permissions for data analytics team',
      'Benchmark memory footprint under 50k concurrent writes'
    ],
    importantMoments: [
      { time: '3:12 PM', text: 'Elena presented latency bottleneck graphs' },
      { time: '3:28 PM', text: 'Agreement on read-replica decoupling strategy' },
      { time: '3:40 PM', text: 'Action items assigned across infrastructure leads' }
    ],
    transcript: [
      { speaker: 'Elena Rostova', time: '3:02 PM', text: 'We observed query latency spikes during peak reporting hours.' },
      { speaker: 'Dr. Sarah Chen', time: '3:08 PM', text: 'Decoupling the read replicas from primary write paths should alleviate this immediately.' },
      { speaker: 'Alex Vance', time: '3:20 PM', text: 'Agreed. Staging tests confirmed a 40% reduction in query queue times.' }
    ],
    notes: 'Full technical summary generated by Aura. High consensus reached across all participants.',
    project: 'Data Infrastructure',
    tags: ['Database', 'Optimization', 'Performance'],
    isAiAttended: true,
    participants: [
      { id: 'p1', name: 'Elena Rostova', role: 'DevOps Specialist', avatar: BRAND_ASSETS.speakerSarah, isHost: true },
      { id: 'p2', name: 'Dr. Sarah Chen', role: 'Lead Architect', avatar: BRAND_ASSETS.speakerSarah },
      { id: 'p3', name: 'Alex Vance', role: 'Platform Engineer', avatar: BRAND_ASSETS.attendeeAlex },
      { id: 'p4', name: 'Prerna', role: 'Infrastructure Lead', avatar: BRAND_ASSETS.userProfile }
    ]
  },
  {
    id: 'meet-5',
    title: 'Security Compliance & Data Governance Review',
    platform: 'AuraMeet',
    date: 'Sep 21, 2026',
    time: '1:00 PM – 1:45 PM',
    duration: '45 mins',
    participantCount: 5,
    status: 'completed',
    aiAssistantStatus: 'AI Summary Ready',
    summary: 'Completed annual SOC2 compliance readiness checklist. Confirmed end-to-end encryption keys and air-gapped tenant memory isolation guidelines.',
    decisions: [
      'Approved updated credential rotation policy for all service accounts',
      'Verified zero data leakage between customer enterprise workspaces',
      'Enabled automated vulnerability reporting in CI/CD pipeline'
    ],
    actionItems: [
      'Submit audit attestation documents to external assessor',
      'Conduct follow-up review on encrypted backup retention',
      'Review IAM permissions for third-party integrations'
    ],
    importantMoments: [
      { time: '1:10 PM', text: 'Security lead reviewed compliance scorecard' },
      { time: '1:35 PM', text: 'Unanimous sign-off on updated rotation policy' }
    ],
    notes: 'Audit readiness achieved with no outstanding high-severity items.',
    project: 'Security & Governance',
    tags: ['Security', 'Compliance', 'Audit'],
    isAiAttended: true,
    participants: [
      { id: 'p1', name: 'Marcus Brody', role: 'Security Reviewer', avatar: BRAND_ASSETS.attendeeAlex, isHost: true },
      { id: 'p2', name: 'Dr. Sarah Chen', role: 'Lead Architect', avatar: BRAND_ASSETS.speakerSarah },
      { id: 'p3', name: 'Prerna', role: 'Infrastructure Lead', avatar: BRAND_ASSETS.userProfile }
    ]
  }
];

export const BRAIN_SECTIONS = {
  recentContext: [
    { title: 'Multi-Region Replication Rollout', time: 'Updated 20 mins ago', summary: 'Staging deployment target scheduled for Friday 5:00 PM with 120ms failover timeout.' },
    { title: 'Read-Replica Query Decoupling', time: 'Updated yesterday', summary: 'Table partition benchmarks achieved 40% reduction in query queue latencies.' },
    { title: 'Security Attestation Sign-off', time: 'Updated 2 days ago', summary: 'All service account credentials rotated; end-to-end encryption validated.' }
  ],
  projects: [
    { name: 'Core Platform 2.0', meetingsCount: 14, lastActive: 'Today' },
    { name: 'Data Infrastructure', meetingsCount: 8, lastActive: 'Yesterday' },
    { name: 'Security & Compliance', meetingsCount: 6, lastActive: 'Sep 21' },
    { name: 'Mobile UX Redesign', meetingsCount: 5, lastActive: 'Today' }
  ],
  importantPeople: [
    { name: 'Dr. Sarah Chen', role: 'Lead Architect', meetingsShared: 18, avatar: BRAND_ASSETS.speakerSarah },
    { name: 'Alex Vance', role: 'Platform Engineer', meetingsShared: 12, avatar: BRAND_ASSETS.attendeeAlex },
    { name: 'Elena Rostova', role: 'DevOps Specialist', meetingsShared: 9, avatar: BRAND_ASSETS.speakerSarah },
    { name: 'Marcus Brody', role: 'Security Reviewer', meetingsShared: 7, avatar: BRAND_ASSETS.attendeeAlex }
  ],
  decisions: [
    { text: 'Approved Raft-based distributed quorum for regional nodes', meeting: 'Distributed Systems Architecture Sync', date: 'Today' },
    { text: 'Scheduled deployment staging sign-off for Friday 5:00 PM', meeting: 'Distributed Systems Architecture Sync', date: 'Today' },
    { text: 'Adopted partitioned hash ring architecture for horizontal scale', meeting: 'Database Sharding & Query Optimization', date: 'Yesterday' },
    { text: 'Approved updated credential rotation policy for all service accounts', meeting: 'Security Compliance & Data Governance', date: 'Sep 21' }
  ],
  topics: ['Architecture', 'Deployment', 'Database', 'Security', 'Mobile UX', 'Failover', 'Compliance', 'Performance'],
  preferences: [
    { label: 'Automatic AI Attendance', enabled: true, desc: 'Let Aura attend meetings when you have conflicts' },
    { label: 'Executive Summaries', enabled: true, desc: 'Generate high-level summaries for leadership review' },
    { label: 'Action Item Tracking', enabled: true, desc: 'Extract and sync follow-ups to your personal workspace' },
    { label: 'Private Tenant Isolation', enabled: true, desc: 'Enforce strict memory partition for your user account' }
  ]
};

export const USER_PROFILE_DATA = {
  name: 'Prerna',
  email: 'prerna.1251070540@vit.edu',
  role: 'Infrastructure Lead',
  department: 'Core Systems Engineering',
  avatar: BRAND_ASSETS.userProfile,
  membership: 'AuraMeet Enterprise',
  stats: {
    meetingsAttended: 42,
    aiHoursSaved: '18.5 hrs',
    actionItemsExtracted: 67,
    decisionsIndexed: 31
  }
};
