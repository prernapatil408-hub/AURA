import { SmartHighlight } from '../data/mockData';

/**
 * AI Logic for Smart Highlights auto-detection.
 * Inspects incoming transcripts and spoken phrases to categorize and extract
 * decisions, key phrases, and action items with confidence scoring.
 */

interface DetectionRule {
  pattern: RegExp;
  category: 'decision' | 'key_phrase' | 'action_item';
  defaultConfidence: number;
  autoPin: boolean;
}

const DETECTION_RULES: DetectionRule[] = [
  // Decision patterns
  {
    pattern: /\b(approved|approving|we decided|agreed to|consensus reached|locked in|sign[- ]off on|final decision|resolved to)\b/i,
    category: 'decision',
    defaultConfidence: 96,
    autoPin: true
  },
  // Key phrase / constraint patterns
  {
    pattern: /\b(key requirement|strictly under|crucial constraint|latency budget|security invariant|milestone|must ensure|zero-downtime|sla guarantee)\b/i,
    category: 'key_phrase',
    defaultConfidence: 93,
    autoPin: false
  },
  // Action commitment patterns
  {
    pattern: /\b(action item|assigned to|responsible for|will verify|will submit|follow[- ]up on|todo item)\b/i,
    category: 'action_item',
    defaultConfidence: 91,
    autoPin: false
  }
];

// Key technical and business vocabulary for keyword extraction
const VOCABULARY = [
  'Raft', 'quorum', 'failover', '120ms', 'latency', 'canary', 'zero-downtime',
  'staging', 'production', 'benchmark', 'rollback', 'security', 'isolation',
  'cross-region', 'heartbeat', 'database', 'postgres', 'cluster', 'timeout',
  'replication', 'consensus', 'telemetry', 'sign-off', 'friday', 'policy'
];

export function analyzeTranscriptSentence(
  text: string,
  speaker: string = 'Dr. Sarah Chen',
  time: string = '18:45'
): SmartHighlight | null {
  const clean = text.trim();
  if (clean.length < 10) return null;

  for (const rule of DETECTION_RULES) {
    if (rule.pattern.test(clean)) {
      // Extract keywords found in the sentence
      const detectedKeywords = VOCABULARY.filter((word) =>
        new RegExp(`\\b${word}\\b`, 'i').test(clean)
      );

      // Add category-specific tag if not present
      const tags = detectedKeywords.slice(0, 3);
      if (tags.length === 0) {
        tags.push(rule.category === 'decision' ? 'Decision' : 'Important');
      }

      // Add small variance to confidence score for realistic feel
      const confidence = Math.min(
        99,
        Math.max(88, rule.defaultConfidence + Math.floor(Math.random() * 4) - 2)
      );

      return {
        id: 'hl-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        text: clean,
        category: rule.category,
        speaker,
        time,
        confidence,
        isPinned: rule.autoPin,
        keywords: tags
      };
    }
  }

  // Fallback: If sentence contains strong definitive words
  if (/\b(decide|always|never|guaranteed|mandate|critical)\b/i.test(clean)) {
    return {
      id: 'hl-' + Date.now(),
      text: clean,
      category: 'key_phrase',
      speaker,
      time,
      confidence: 88,
      isPinned: false,
      keywords: ['Key Phrase', 'Live Capture']
    };
  }

  return null;
}

/**
 * Pre-defined stream of live meeting speech samples used to demonstrate
 * AI auto-detection occurring organically as the meeting unfolds.
 */
export const SIMULATED_LIVE_SPEECH_STREAM = [
  {
    speaker: 'Dr. Sarah Chen',
    sentence: 'We agreed to increase regional read-replicas from 3 to 5 nodes to handle peak traffic.',
    time: '18:48'
  },
  {
    speaker: 'Alex Vance',
    sentence: 'Crucial constraint: Database migration scripts must be fully idempotent and non-blocking.',
    time: '18:50'
  },
  {
    speaker: 'Dr. Sarah Chen',
    sentence: 'Approved automated canary traffic shift starting at 5% with a 30-minute health soak.',
    time: '18:52'
  },
  {
    speaker: 'Prerna',
    sentence: 'Action item: Prerna will coordinate the final staging security audit before Thursday end of day.',
    time: '18:54'
  },
  {
    speaker: 'Alex Vance',
    sentence: 'Locked in 99.99% availability target for the customer dashboard service level agreement.',
    time: '18:57'
  }
];
