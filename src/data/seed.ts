import type { MapPin } from '../types';
import { Star, Coffee, Phone, Heart } from 'lucide-react';

export const dailyScores: Record<string, number> = {
  intention: 4.3,
  integrity: 3.8,
  care: 4.2,
  faithfulness: 4.8,
  energy: 7,
  peace: 8,
  gratitude: 9
};

export const todayStory: Array<{ time: string; activity: string; category: string; icon: any }> = [
  { time: '7:30 AM', activity: 'Started with morning prayer and stretches', category: 'spiritual', icon: Star },
  { time: '9:15 AM', activity: 'Called Mom about weekend family dinner', category: 'connect', icon: Phone },
  { time: '11:30 AM', activity: 'Chose to help neighbor with groceries', category: 'care', icon: Heart },
  { time: '12:45 PM', activity: 'Took mindful lunch break in the garden', category: 'rest', icon: Coffee },
  { time: '2:00 PM', activity: 'Texted encouragement to struggling friend', category: 'connect', icon: Heart }
];

export const heartConnections: Array<{ name: string; action: string; emoji: string; days: number }> = [
  { name: 'Mom', action: 'Called this morning', emoji: '💗', days: 0 },
  { name: 'Sam (neighbor)', action: 'Helped with groceries', emoji: '🤝', days: 0 },
  { name: 'Alex', action: 'Sent encouragement', emoji: '✨', days: 0 },
  { name: 'Project Alpha', action: 'Last touch', emoji: '💼', days: 14 }
];

export const weeklyData = [
  { day: 'Mon', intention: 4, integrity: 3, care: 4, faithfulness: 5 },
  { day: 'Tue', intention: 5, integrity: 4, care: 3, faithfulness: 4 },
  { day: 'Wed', intention: 3, integrity: 5, care: 5, faithfulness: 5 },
  { day: 'Thu', intention: 4, integrity: 3, care: 4, faithfulness: 4 },
  { day: 'Fri', intention: 5, integrity: 4, care: 4, faithfulness: 5 },
  { day: 'Sat', intention: 4, integrity: 4, care: 5, faithfulness: 5 },
  { day: 'Sun', intention: 4, integrity: 4, care: 4, faithfulness: 5 }
];

export const balanceData = [
  { name: 'Eat/Rest', value: 6, total: 10, color: '#10B981' },
  { name: 'Connect', value: 8, total: 10, color: '#8B5CF6' },
  { name: 'Decide', value: 7, total: 10, color: '#F59E0B' }
];

export const nextBestActionByDeficit: Record<'Eat/Rest' | 'Connect' | 'Decide', { title: string; micro: string }> = {
  'Eat/Rest': {
    title: 'Drink water and stretch (2 min)',
    micro: 'Fill bottle • 4 easy stretches'
  },
  Connect: {
    title: 'Check in with someone (2 min)',
    micro: 'Open messages • Send 1 line of encouragement'
  },
  Decide: {
    title: 'Choose your one thing (1 min)',
    micro: 'List 2 options • Circle the most loving next step'
  }
};

export const anchors = [
  { name: 'Morning', completed: true },
  { name: 'Midday', completed: true },
  { name: 'Evening', completed: false },
  { name: 'Sabbath', completed: true }
];

export const defaultPins: MapPin[] = [
  { id: 'you', label: 'You', color: '#2563EB', xPct: 50, yPct: 50, kind: 'you' },
  { id: 'root-eat', label: 'Eat/Rest', color: '#10B981', xPct: 18, yPct: 18, kind: 'root', meta: { root: 'eatRest' } },
  { id: 'root-connect', label: 'Connect', color: '#8B5CF6', xPct: 82, yPct: 28, kind: 'root', meta: { root: 'connect' } },
  { id: 'root-decide', label: 'Decide', color: '#F59E0B', xPct: 35, yPct: 86, kind: 'root', meta: { root: 'decide' } },
  { id: 'p-mom', label: 'Mom', xPct: 30, yPct: 40, kind: 'person', status: 'green' },
  { id: 'p-sam', label: 'Sam', xPct: 65, yPct: 35, kind: 'person', status: 'yellow' },
  { id: 'p-alex', label: 'Alex', xPct: 55, yPct: 65, kind: 'person', status: 'red' },
  { id: 't-water', label: 'Drink water', xPct: 78, yPct: 20, kind: 'task', status: 'green', meta: { effortMin: 2, root: 'eatRest' } },
  { id: 't-walk', label: 'Walk 5 min', xPct: 20, yPct: 60, kind: 'task', status: 'yellow', meta: { effortMin: 5, root: 'eatRest' } },
  { id: 't-draft', label: 'Finish draft', xPct: 58, yPct: 55, kind: 'task', status: 'red', meta: { effortMin: 25, root: 'decide' } },
  { id: 'n-idea', label: 'Idea: solar map', xPct: 40, yPct: 30, kind: 'note', status: 'yellow', meta: { body: 'Pin types, ring snapping' } },
  { id: 'n-grocery', label: 'Groceries', xPct: 25, yPct: 72, kind: 'note', status: 'green', meta: { body: 'Milk, eggs, greens' } },
  { id: 'd-topic', label: 'Pick blog topic', xPct: 45, yPct: 80, kind: 'decision', status: 'red' },
  { id: 'loc-home', label: 'Home', xPct: 48, yPct: 25, kind: 'location', status: 'green' }
];

