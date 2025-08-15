// @ts-nocheck
import React, { useMemo, useState, useEffect, useRef } from 'react';
import ThreeSolarView from './ThreeSolarView';
import Card from './components/Card';
import type { MapPin, PinKind, PinStatus } from './types';
import Legend from './components/Legend';
import MapView from './components/MapView';
import SecondaryView from './components/SecondaryView';
import { Clock, Plus, CheckCircle, Circle, Star, Coffee, Phone, Moon, Users, Compass, Heart, Maximize2, Minimize2, Check, Menu, X } from 'lucide-react';

const ConsolidatedLifeTracker: React.FC = () => {
  // local Card alias kept for backward compatibility; prefer components/Card
  const LocalCard: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className = '', children }) => (
    <Card className={className}>{children}</Card>
  );
  const [activeTab, setActiveTab] = useState<'today' | 'focus' | 'review' | 'graphs' | 'settings'>('today');
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [masterDocPreview, setMasterDocPreview] = useState<string>('');
  const [rootCausesPreview, setRootCausesPreview] = useState<string>('');
  const [faithModeEnabled, setFaithModeEnabled] = useState<boolean>(true);
  const [sabbathMode, setSabbathMode] = useState<boolean>(false);
  const [showIntentModal, setShowIntentModal] = useState<boolean>(false);
  const [selectedIntent, setSelectedIntent] = useState<'Eat/Rest' | 'Connect' | 'Decide' | null>(null);
  const [showStuckModal, setShowStuckModal] = useState<boolean>(false);
  const [stuckCategory, setStuckCategory] = useState<'Self' | 'Relationships' | 'Faith' | null>(null);
  type DecisionLogItem = { id: string; prompt: string; chosen: string; reason: string; createdAt: string };
  const [decisionLog, setDecisionLog] = useState<DecisionLogItem[]>([]);
  const [decisionDraft, setDecisionDraft] = useState<{ prompt: string; chosen: string; reason: string }>({ prompt: '', chosen: '', reason: '' });
  const [syncState, setSyncState] = useState<'synced' | 'pending' | 'offline'>('synced');
  const [mood, setMood] = useState<number>(3);
  const [energy, setEnergy] = useState<number>(3);
  const [fadeStage, setFadeStage] = useState<1 | 2 | 3 | 4>(1);
  const [timerSec, setTimerSec] = useState<number>(25 * 60);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    // Fetch small previews from public docs
    fetch('/docs/universal_daily_navigator_master_doc.md')
      .then((r) => r.text())
      .then((t) => setMasterDocPreview(t.split('\n').slice(0, 20).join('\n')))
      .catch(() => setMasterDocPreview('Failed to load master doc.'));
    fetch('/docs/root-causes.md')
      .then((r) => r.text())
      .then((t) => setRootCausesPreview(t.split('\n').slice(0, 20).join('\n')))
      .catch(() => setRootCausesPreview('Failed to load root causes.'));
  }, []);

  // Sample data
  const dailyScores: Record<string, number> = {
    intention: 4.3,
    integrity: 3.8,
    care: 4.2,
    faithfulness: 4.8,
    energy: 7,
    peace: 8,
    gratitude: 9
  };

  const todayStory: Array<{ time: string; activity: string; category: string; icon: React.ComponentType<{ className?: string }> }> = [
    { time: '7:30 AM', activity: 'Started with morning prayer and stretches', category: 'spiritual', icon: Star },
    { time: '9:15 AM', activity: 'Called Mom about weekend family dinner', category: 'connect', icon: Phone },
    { time: '11:30 AM', activity: 'Chose to help neighbor with groceries', category: 'care', icon: Heart },
    { time: '12:45 PM', activity: 'Took mindful lunch break in the garden', category: 'rest', icon: Coffee },
    { time: '2:00 PM', activity: 'Texted encouragement to struggling friend', category: 'connect', icon: Heart }
  ];

  const heartConnections: Array<{ name: string; action: string; emoji: string; days: number }> = [
    { name: 'Mom', action: 'Called this morning', emoji: '💗', days: 0 },
    { name: 'Sam (neighbor)', action: 'Helped with groceries', emoji: '🤝', days: 0 },
    { name: 'Alex', action: 'Sent encouragement', emoji: '✨', days: 0 },
    { name: 'Project Alpha', action: 'Last touch', emoji: '💼', days: 14 }
  ];

  const weeklyData = [
    { day: 'Mon', intention: 4, integrity: 3, care: 4, faithfulness: 5 },
    { day: 'Tue', intention: 5, integrity: 4, care: 3, faithfulness: 4 },
    { day: 'Wed', intention: 3, integrity: 5, care: 5, faithfulness: 5 },
    { day: 'Thu', intention: 4, integrity: 3, care: 4, faithfulness: 4 },
    { day: 'Fri', intention: 5, integrity: 4, care: 4, faithfulness: 5 },
    { day: 'Sat', intention: 4, integrity: 4, care: 5, faithfulness: 5 },
    { day: 'Sun', intention: 4, integrity: 4, care: 4, faithfulness: 5 }
  ];

  const balanceData = [
    { name: 'Eat/Rest', value: 6, total: 10, color: '#10B981' },
    { name: 'Connect', value: 8, total: 10, color: '#8B5CF6' },
    { name: 'Decide', value: 7, total: 10, color: '#F59E0B' }
  ];

  // Compute primary deficit (lowest ratio)
  const primaryDeficit = balanceData
    .map((b) => ({ name: b.name, ratio: b.value / b.total }))
    .sort((a, b) => a.ratio - b.ratio)[0]?.name as 'Eat/Rest' | 'Connect' | 'Decide';

  const nextBestActionByDeficit: Record<'Eat/Rest' | 'Connect' | 'Decide', { title: string; micro: string }> = {
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

  useEffect(() => {
    if (!timerRunning) return;
    const id = setInterval(() => setTimerSec((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [timerRunning]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const rootButtons = useMemo(() => (
    <div className="grid grid-cols-3 gap-3">
      <button onClick={() => { setSelectedIntent('Eat/Rest'); setShowIntentModal(true); }} className="p-4 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-100 flex flex-col items-center">
        <Moon className="w-6 h-6 text-teal-600" />
        <span className="mt-2 text-sm font-medium text-teal-800">Eat/Rest</span>
      </button>
      <button onClick={() => { setSelectedIntent('Connect'); setShowIntentModal(true); }} className="p-4 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-100 flex flex-col items-center">
        <Users className="w-6 h-6 text-purple-600" />
        <span className="mt-2 text-sm font-medium text-purple-800">Connect</span>
      </button>
      <button onClick={() => { setSelectedIntent('Decide'); setShowIntentModal(true); }} className="p-4 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-100 flex flex-col items-center">
        <Compass className="w-6 h-6 text-amber-600" />
        <span className="mt-2 text-sm font-medium text-amber-800">Decide</span>
      </button>
    </div>
  ), []);

  // Map pins (mind-map style)
  const defaultPins: MapPin[] = [
    { id: 'you', label: 'You', color: '#2563EB', xPct: 50, yPct: 50, kind: 'you' },
    // Roots (optional)
    { id: 'root-eat', label: 'Eat/Rest', color: '#10B981', xPct: 18, yPct: 18, kind: 'root', meta: { root: 'eatRest' } },
    { id: 'root-connect', label: 'Connect', color: '#8B5CF6', xPct: 82, yPct: 28, kind: 'root', meta: { root: 'connect' } },
    { id: 'root-decide', label: 'Decide', color: '#F59E0B', xPct: 35, yPct: 86, kind: 'root', meta: { root: 'decide' } },
    // People
    { id: 'p-mom', label: 'Mom', xPct: 30, yPct: 40, kind: 'person', status: 'green' },
    { id: 'p-sam', label: 'Sam', xPct: 65, yPct: 35, kind: 'person', status: 'yellow' },
    { id: 'p-alex', label: 'Alex', xPct: 55, yPct: 65, kind: 'person', status: 'red' },
    // Tasks
    { id: 't-water', label: 'Drink water', xPct: 78, yPct: 20, kind: 'task', status: 'green', meta: { effortMin: 2, root: 'eatRest' } },
    { id: 't-walk', label: 'Walk 5 min', xPct: 20, yPct: 60, kind: 'task', status: 'yellow', meta: { effortMin: 5, root: 'eatRest' } },
    { id: 't-draft', label: 'Finish draft', xPct: 58, yPct: 55, kind: 'task', status: 'red', meta: { effortMin: 25, root: 'decide' } },
    // Notes
    { id: 'n-idea', label: 'Idea: solar map', xPct: 40, yPct: 30, kind: 'note', status: 'yellow', meta: { body: 'Pin types, ring snapping' } },
    { id: 'n-grocery', label: 'Groceries', xPct: 25, yPct: 72, kind: 'note', status: 'green', meta: { body: 'Milk, eggs, greens' } },
    // Decisions
    { id: 'd-topic', label: 'Pick blog topic', xPct: 45, yPct: 80, kind: 'decision', status: 'red' },
  // Locations
    { id: 'loc-home', label: 'Home', xPct: 48, yPct: 25, kind: 'location', status: 'green' },
  ];
  const [pins, setPins] = useState<MapPin[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>('');
  const [editKind, setEditKind] = useState<PinKind>('note');
  const [editMeta, setEditMeta] = useState<any>({});
  const [showAddMenu, setShowAddMenu] = useState<boolean>(false);
  // All kinds default to gray; color is derived from status if present
  const defaultGrey = '#6B7280';
  const kindColors: Record<PinKind, string> = {
    you: defaultGrey,
    root: defaultGrey,
    note: defaultGrey,
    task: defaultGrey,
    person: defaultGrey,
    location: defaultGrey,
    decision: defaultGrey,
  };
  const statusColors: Record<PinStatus, string> = {
    red: '#EF4444',
    yellow: '#F59E0B',
    green: '#22C55E',
  };
  const legendItems = [
    { key: 'person', label: 'People', color: defaultGrey },
    { key: 'task', label: 'Tasks', color: defaultGrey },
    { key: 'note', label: 'Notes', color: defaultGrey },
    { key: 'decision', label: 'Decisions', color: defaultGrey },
    { key: 'location', label: 'Locations', color: defaultGrey },
  ];
  const [zoom, setZoom] = useState<number>(1);
  const [legendFilter, setLegendFilter] = useState<Set<PinKind>>(new Set());
  const [statusFilter, setStatusFilter] = useState<Set<PinStatus>>(new Set());
  type View2Mode = 'none' | 'map2d' | 'solar2d' | 'list' | 'avgday';
  const [view2Mode, setView2Mode] = useState<View2Mode>('none');
  const [solarView, setSolarView] = useState<boolean>(false);
  const [use3D, setUse3D] = useState<boolean>(false);
  // Orbit types are typed rings (inner→outer)
  const orbitKinds: PinKind[] = ['person', 'task', 'note', 'decision', 'location'];
  const layerNames = orbitKinds.map((k) => (
    k === 'note' ? 'Notes' : k === 'task' ? 'Tasks' : k === 'person' ? 'People' : k === 'decision' ? 'Decisions' : k === 'location' ? 'Locations' : k
  ));
  // Radii from center in percentage points (computed by count)
  const layerRadii = Array.from({ length: orbitKinds.length }, (_, i) => 10 + i * 7);
  const kindToLayerIndex: Record<PinKind, number | null> = {
    you: null,
    root: null,
    note: orbitKinds.indexOf('note'),
    task: orbitKinds.indexOf('task'),
    person: orbitKinds.indexOf('person'),
    location: orbitKinds.indexOf('location'),
    decision: orbitKinds.indexOf('decision'),
  };
  const getRingRadiusForKind = (kind: PinKind): number => {
    const idx = kindToLayerIndex[kind];
    if (idx === null || idx === undefined) return 0;
    return layerRadii[idx] ?? layerRadii[0];
  };
  const mapRef = React.useRef<HTMLDivElement | null>(null);
  const mapRef2 = React.useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await panelRef.current?.requestFullscreen?.();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {}
  };

  useEffect(() => {
    const onFullChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFullChange);
    return () => document.removeEventListener('fullscreenchange', onFullChange);
  }, []);
  const formatLabel = (raw: string): string => {
    const words = (raw || '').trim().split(/\s+/);
    if (words.length <= 2) return words.join(' ');
    return `${words[0]} ${words[1]}…`;
  };
  const minutesToTime = (min: number): string => {
    const m = Math.max(0, Math.min(1439, Math.round(min)));
    const h = Math.floor(m / 60);
    const mm = m % 60;
    const hh12 = ((h + 11) % 12) + 1;
    const ampm = h < 12 ? 'AM' : 'PM';
    return `${hh12}:${mm.toString().padStart(2, '0')} ${ampm}`;
  };
  // Avg-day drag state
  const avgRef1 = useRef<HTMLDivElement | null>(null);
  const avgRef2 = useRef<HTMLDivElement | null>(null);
  const [dragAvg, setDragAvg] = useState<{ id: string; offset: number; which: 'v1' | 'v2' } | null>(null);
  // Quick add (timeline)
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickTitle, setQuickTitle] = useState('');
  const [quickStartMin, setQuickStartMin] = useState(9 * 60);
  const [quickDurationMin, setQuickDurationMin] = useState(30);
  useEffect(() => {
    if (!dragAvg) return;
    const onMove = (e: MouseEvent) => {
      const ref = dragAvg.which === 'v1' ? avgRef1.current : avgRef2.current;
      if (!ref) return;
      const rect = ref.getBoundingClientRect();
      const ratio = (e.clientY - rect.top) / rect.height; // vertical timeline
      const minutes = Math.max(0, Math.min(1440, Math.round(ratio * 1440))) - dragAvg.offset;
      setPins((prev) => prev.map((p) => {
        if (p.id !== dragAvg.id) return p;
        const meta = { ...(p as any).meta };
        const dur = Math.max(0, meta.avgDurationMin ?? 30);
        meta.avgStartMin = Math.max(0, Math.min(1440 - dur, minutes));
        return { ...p, meta } as any;
      }));
    };
    const onUp = () => setDragAvg(null);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [dragAvg]);

  const renderAvgDayTimeline = (which: 'v1' | 'v2') => {
    const containerRef = which === 'v1' ? avgRef1 : avgRef2;
    type Block = { id: string; label: string; start: number; end: number };
    let items: Block[] = pins
      .filter((p) => p.kind === 'task' && (p as any).meta?.avgStartMin != null)
      .map((p) => {
        const start = Number((p as any).meta.avgStartMin) || 0;
        const dur = Number((p as any).meta.avgDurationMin) || 30;
        return { id: p.id, label: p.label, start, end: Math.min(1440, start + dur) };
      })
      .sort((a, b) => a.start - b.start);
    // Fallback demo if no tasks tagged yet
    if (items.length === 0) {
      const demo = pins.filter(p => p.kind === 'task').slice(0, 6);
      items = demo.map((p, i) => {
        const start = 8 * 60 + i * 45; // from 8:00AM every 45m
        const dur = 30;
        return { id: p.id, label: p.label, start, end: Math.min(1440, start + dur) };
      });
    }
    // lane assignment to avoid overlaps
    const lanes: Block[][] = [];
    for (const it of items) {
      let placed = false;
      for (const lane of lanes) {
        if (lane.length === 0 || lane[lane.length - 1].end <= it.start) {
          lane.push(it); placed = true; break;
        }
      }
      if (!placed) lanes.push([it]);
    }
    const tickHours = [6, 9, 12, 15, 18, 21];
    return (
      <div
        ref={containerRef}
        className="relative w-full bg-white rounded-lg border p-3"
        style={{ height: 400 }}
        onDoubleClick={(e) => {
          const ref = containerRef.current; if (!ref) return;
          const rect = ref.getBoundingClientRect();
          const ratio = (e.clientY - rect.top) / rect.height;
          const start = Math.max(0, Math.min(1440, Math.round(ratio * 1440)));
          setQuickAddOpen(true);
          setQuickTitle('');
          setQuickStartMin(start);
          setQuickDurationMin(30);
        }}
      >
        {/* Hour ticks horizontally across */}
        <div className="absolute inset-3">
          {tickHours.map((h) => {
            const top = (h / 24) * 100;
            return (
              <div key={h} className="absolute left-0 right-0" style={{ top: `${top}%` }}>
                <div className="w-full h-px bg-gray-200"></div>
                <div className="absolute -left-1 text-xs -translate-y-1/2 text-gray-500">{minutesToTime(h * 60)}</div>
              </div>
            );
          })}
          {/* Lanes as columns */}
          {lanes.map((lane, li) => {
            const laneWidth = 100 / Math.max(1, lanes.length);
            const left = li * laneWidth;
            return (
              <div key={li} className="absolute" style={{ left: `${left}%`, width: `${laneWidth}%`, top: 0, bottom: 0 }}>
                {lane.map((b) => {
                  const top = (b.start / 1440) * 100;
                  const height = ((b.end - b.start) / 1440) * 100;
                  return (
                    <div
                      key={b.id}
                      className="absolute rounded-md bg-blue-100 border border-blue-200 flex items-center justify-center px-2 cursor-grab active:cursor-grabbing"
                      style={{ top: `${top}%`, height: `${height}%`, left: '10%', right: '10%' }}
                      onMouseDown={(e) => {
                        const p = pins.find((x) => x.id === b.id)!;
                        const start = Number((p as any).meta?.avgStartMin) || 0;
                        const ref = containerRef.current;
                        if (!ref) return;
                        const rect = ref.getBoundingClientRect();
                        const ratio = (e.clientY - rect.top) / rect.height;
                        const cursorMin = Math.round(ratio * 1440);
                        setDragAvg({ id: b.id, offset: cursorMin - start, which });
                      }}
                      onDoubleClick={() => {
                        setEditingId(b.id);
                        const p = pins.find((x) => x.id === b.id)!;
                        setEditText(p.label); setEditKind(p.kind as any); setEditMeta({ ...(p as any).meta, status: (p as any).status });
                      }}
                    >
                      <div className="text-[11px] text-blue-900 text-center leading-tight">
                        <div>{minutesToTime(b.start)}</div>
                        <div className="truncate max-w-[90%] mx-auto">{b.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Load/save pins from localStorage so refresh uses the same objects
  useEffect(() => {
    const saved = localStorage.getItem('udn_pins');
    if (saved) {
      try { setPins(JSON.parse(saved)); return; } catch {}
    }
    setPins(defaultPins);
  }, []);

  useEffect(() => {
    if (pins.length > 0) {
      localStorage.setItem('udn_pins', JSON.stringify(pins));
    }
  }, [pins]);

  const clampPct = (v: number) => Math.max(2, Math.min(98, v));

  const autoOrganizePins = () => {
    const centerX = 50;
    const centerY = 50;
    const minDistance = 4; // percent units between dots
    const iterations = 14;
    let arranged = pins.map((p) => ({ ...p }));
    const isAnchored = (p: MapPin) => p.kind === 'you';

    for (let iter = 0; iter < iterations; iter++) {
      for (let i = 0; i < arranged.length; i++) {
        for (let j = i + 1; j < arranged.length; j++) {
          const a = arranged[i];
          const b = arranged[j];
          // Ignore label-only overlap; we space dots
          let dx = b.xPct - a.xPct;
          let dy = b.yPct - a.yPct;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;
          if (dist < minDistance) {
            const push = (minDistance - dist) / 2;
            dx /= dist; dy /= dist;
            // Move either or both depending on anchor status
            if (!isAnchored(a)) {
              a.xPct = clampPct(a.xPct - dx * push);
              a.yPct = clampPct(a.yPct - dy * push);
            }
            if (!isAnchored(b)) {
              b.xPct = clampPct(b.xPct + dx * push);
              b.yPct = clampPct(b.yPct + dy * push);
            }
          }
        }
      }
      // Snap to rings when Solar View is active
      if (solarView) {
        arranged = arranged.map((p) => {
          const r = getRingRadiusForKind(p.kind);
          if (r > 0 && p.kind !== 'you') {
            const angle = Math.atan2(p.yPct - centerY, p.xPct - centerX);
            return {
              ...p,
              xPct: centerX + r * Math.cos(angle),
              yPct: centerY + r * Math.sin(angle),
            };
          }
          return p;
        });
      }
    }
    setPins(arranged);
  };

  useEffect(() => {
    if (!draggingId) return;
    const onMove = (e: MouseEvent) => {
      if (!mapRef.current) return;
      const rect = mapRef.current.getBoundingClientRect();
      const xPct = clampPct(((e.clientX - rect.left) / rect.width) * 100);
      const yPct = clampPct(((e.clientY - rect.top) / rect.height) * 100);
      setPins((prev) => prev.map((p) => {
        if (p.id !== draggingId) return p;
        if (solarView) {
          // Snap to the designated ring for this pin's kind. Prevent ring change unless kind changes.
          const cx = 50, cy = 50;
          const dx = xPct - cx;
          const dy = yPct - cy;
          const angle = Math.atan2(dy, dx);
          const r = getRingRadiusForKind(p.kind);
          if (r === 0) {
            // Free (You) stays near center but allow move
            return { ...p, xPct, yPct };
          }
          return { ...p, xPct: cx + r * Math.cos(angle), yPct: cy + r * Math.sin(angle) };
        }
        return { ...p, xPct, yPct };
      }));
    };
    const onUp = () => setDraggingId(null);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [draggingId, solarView]);

  const handleMapDoubleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const xPct = clampPct(((e.clientX - rect.left) / rect.width) * 100);
    const yPct = clampPct(((e.clientY - rect.top) / rect.height) * 100);
    const id = Math.random().toString(36).slice(2);
    const newPin: MapPin = { id, label: 'New', color: '#64748B', xPct, yPct, kind: 'note', status: 'yellow', meta: { body: '', status: 'yellow' } };
    setPins((prev) => [...prev, newPin]);
    setEditingId(id);
    setEditKind('note');
    setEditText('New');
    setEditMeta({ body: '', status: 'yellow' });
  };

  const anchors = [
    { name: 'Morning', completed: true },
    { name: 'Midday', completed: true },
    { name: 'Evening', completed: false },
    { name: 'Sabbath', completed: true }
  ];

  const consistencyLeaders = [
    { name: 'Morning stretch', streak: 6, total: 10 },
    { name: 'Hydration check', streak: 9, total: 10 },
    { name: 'Alex', streak: 3, total: 5 },
    { name: 'Volunteer', streak: 2, total: 5 }
  ];

  const getScoreColor = (score: number): string => {
    if (score >= 4) return 'text-green-500';
    if (score >= 3) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      spiritual: 'bg-purple-100 text-purple-800',
      connect: 'bg-blue-100 text-blue-800',
      care: 'bg-green-100 text-green-800',
      rest: 'bg-teal-100 text-teal-800',
      work: 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  // Temporary: mark rarely used variables as referenced during stepwise refactor so TypeScript stays green
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  (setActiveTab, setTimeRange, masterDocPreview, rootCausesPreview, setFaithModeEnabled, setSabbathMode, decisionLog, setDecisionLog, decisionDraft, setDecisionDraft, setSyncState, fadeStage, setFadeStage, timerSec, setTimerRunning, weeklyData, formatTimer, rootButtons, showAddMenu, setShowAddMenu, use3D, consistencyLeaders, getScoreColor);

  // Drawers & card visibility
  const [showFilters, setShowFilters] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showView1, setShowView1] = useState(true);
  const [showLegendCard, setShowLegendCard] = useState(true);
  const [showView2Card, setShowView2Card] = useState(true);

  // Multiple view types switcher
  type ViewType = 'map2d' | 'solar2d' | 'solar3d' | 'list' | 'avgday';
  const [viewType, setViewType] = useState<ViewType>('map2d');

  useEffect(() => {
    // Keep existing toggles in sync with dropdown
    if (viewType === 'solar3d') {
      setUse3D(true);
      setSolarView(true);
    } else if (viewType === 'solar2d') {
      setUse3D(false);
      setSolarView(true);
    } else {
      setUse3D(false);
      setSolarView(false);
    }
  }, [viewType]);

  return (
    <div className="min-h-screen bg-gray-50 p-0">
      <div className="max-w-7xl mx-auto space-y-6 px-6 sm:px-9 pt-6 sm:pt-8">
        {/* Header */}
        <LocalCard className="p-3 sm:p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center" onClick={()=>setShowFilters(true)} aria-label="Open filters">
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Daily Navigator</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-2 py-1 rounded ${syncState === 'synced' ? 'bg-green-100 text-green-800' : syncState === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-200 text-gray-700'}`}>{syncState}</span>
              <button className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200" aria-label="Profile" onClick={()=>setShowProfile(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-gray-500"><path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/></svg>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input className="flex-1 bg-transparent outline-none text-sm" placeholder="Navigate life: water • call mom • choose one thing" />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22"/><path d="M5 8v8"/><path d="M19 8v8"/></svg>
          </div>
          {/* (compact) no extra controls row here per design */}
        </LocalCard>

        {/* Filters Drawer */}
        {showFilters && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/30" onClick={()=>setShowFilters(false)} />
            <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-white shadow-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Filters</h2>
                <button className="w-8 h-8 rounded-md border flex items-center justify-center" onClick={()=>setShowFilters(false)} aria-label="Close filters"><X className="w-4 h-4"/></button>
              </div>
              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-700">Cards</div>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={showView1} onChange={(e)=>setShowView1(e.target.checked)} /> View 1</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={showLegendCard} onChange={(e)=>setShowLegendCard(e.target.checked)} /> Legend</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={showView2Card} onChange={(e)=>setShowView2Card(e.target.checked)} /> View 2</label>
              </div>
            </div>
          </div>
        )}

        {/* Profile Drawer */}
        {showProfile && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/30" onClick={()=>setShowProfile(false)} />
            <div className="absolute inset-y-0 right-0 w-80 max-w-[85vw] bg-white shadow-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Profile</h2>
                <button className="w-8 h-8 rounded-md border flex items-center justify-center" onClick={()=>setShowProfile(false)} aria-label="Close profile"><X className="w-4 h-4"/></button>
              </div>
              <div className="space-y-3 text-sm text-gray-700">
                <div><input type="checkbox" className="mr-2"/> Option A</div>
                <div><input type="checkbox" className="mr-2"/> Option B</div>
                <div><input type="checkbox" className="mr-2"/> Option C</div>
              </div>
            </div>
          </div>
        )}

      {/* Global Edit Modal */}
      {editingId && (() => {
        const p = pins.find(pp => pp.id === editingId);
        if (!p) return null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30" onClick={() => setEditingId(null)} />
            <div className="relative z-10 bg-white rounded-xl shadow-xl p-4 w-[320px] sm:w-[420px]">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <select className="border rounded px-2 py-1 text-xs" value={editKind} onChange={(e) => setEditKind(e.target.value as any)}>
                    <option value="note">Note</option>
                    <option value="task">Task</option>
                    <option value="person">Person</option>
                    <option value="location">Location</option>
                    <option value="decision">Decision</option>
                  </select>
                  <input className="flex-1 border rounded px-2 py-1 text-xs" value={editText} onChange={(e) => setEditText(e.target.value)} placeholder="Label" />
                  <span className="w-4 h-4 rounded-full inline-block" style={{ backgroundColor: (p as any).status ? statusColors[(p as any).status as PinStatus] : defaultGrey }}></span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span>Status:</span>
                  <button className={`px-2 py-1 rounded ${editMeta?.status === 'red' ? 'bg-red-100 text-red-700' : 'bg-gray-100'}`} onClick={() => setEditMeta((m:any)=> ({...m, status:'red'}))}>🔴</button>
                  <button className={`px-2 py-1 rounded ${editMeta?.status === 'yellow' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100'}`} onClick={() => setEditMeta((m:any)=> ({...m, status:'yellow'}))}>🟡</button>
                  <button className={`px-2 py-1 rounded ${editMeta?.status === 'green' ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`} onClick={() => setEditMeta((m:any)=> ({...m, status:'green'}))}>🟢</button>
                </div>
                {editKind === 'note' && (
                  <textarea className="border rounded px-2 py-1 text-xs" rows={2} placeholder="Body"
                    value={editMeta.body ?? ''}
                    onChange={(e) => setEditMeta((m: any) => ({ ...m, body: e.target.value }))}
                  />
                )}
                {editKind === 'task' && (
                  <div className="grid grid-cols-2 gap-2">
                    <input className="border rounded px-2 py-1 text-xs" placeholder="Effort (min)"
                      value={editMeta.effortMin ?? ''}
                      onChange={(e) => setEditMeta((m: any) => ({ ...m, effortMin: e.target.value }))}
                    />
                    <select className="border rounded px-2 py-1 text-xs" value={editMeta.root ?? 'eatRest'} onChange={(e) => setEditMeta((m: any) => ({ ...m, root: e.target.value }))}>
                      <option value="eatRest">Eat/Rest</option>
                      <option value="connect">Connect</option>
                      <option value="decide">Decide</option>
                    </select>
                    <input className="border rounded px-2 py-1 text-xs col-span-2" placeholder="Avg day start (min from 12:00 AM)"
                      value={editMeta.avgStartMin ?? ''}
                      onChange={(e) => setEditMeta((m: any) => ({ ...m, avgStartMin: Number(e.target.value) }))}
                    />
                    <input className="border rounded px-2 py-1 text-xs col-span-2" placeholder="Avg duration (min)"
                      value={editMeta.avgDurationMin ?? ''}
                      onChange={(e) => setEditMeta((m: any) => ({ ...m, avgDurationMin: Number(e.target.value) }))}
                    />
                    <label className="flex items-center gap-2 text-xs col-span-2 text-gray-600">
                      <input type="checkbox" checked={!!editMeta.recurring} onChange={(e)=> setEditMeta((m:any)=> ({...m, recurring: e.target.checked}))} />
                      <span>Recurring</span>
                    </label>
                  </div>
                )}
                {editKind === 'person' && (
                  <input className="border rounded px-2 py-1 text-xs" placeholder="Phone/Handle"
                    value={editMeta.handle ?? ''}
                    onChange={(e) => setEditMeta((m: any) => ({ ...m, handle: e.target.value }))}
                  />
                )}
                {editKind === 'location' && (
                  <input className="border rounded px-2 py-1 text-xs" placeholder="Location"
                    value={editMeta.location ?? ''}
                    onChange={(e) => setEditMeta((m: any) => ({ ...m, location: e.target.value }))}
                  />
                )}
                <div className="flex justify-end gap-2 pt-1">
                  <button className="text-xs px-2 py-1" onClick={() => setEditingId(null)}>Cancel</button>
                  <button className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded" onClick={() => { setPins((prev) => prev.filter((x) => x.id !== p!.id)); setEditingId(null); }}>Delete</button>
                  <button className="text-xs bg-blue-600 text-white px-2 py-1 rounded"
                    onClick={() => {
                      setPins((prev) => prev.map((x) => {
                        if (x.id !== p!.id) return x;
                        let next: any = { ...x, label: editText, kind: editKind, meta: editMeta };
                        if (editMeta?.status) next.status = editMeta.status;
                        if (solarView && x.kind !== editKind) {
                          const cx = 50, cy = 50;
                          const angle = Math.atan2(x.yPct - cy, x.xPct - cx);
                          const r = getRingRadiusForKind(editKind);
                          if (r > 0) {
                            next.xPct = cx + r * Math.cos(angle);
                            next.yPct = cy + r * Math.sin(angle);
                          }
                        }
                        return next;
                      }));
                      setEditingId(null);
                    }}
                  >Save</button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

        {/* Today Tab */}
        {activeTab === 'today' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visualization Panel (center stage) */}
            {showView1 && (
            <LocalCard className="lg:col-span-2 p-0 overflow-hidden relative">
              {isFullscreen && (
                <div className="absolute top-3 left-3 z-10">
                  <select
                    className="text-xs bg-white/90 border border-gray-200 rounded-md px-2 py-1 text-gray-700 shadow"
                    value={viewType}
                    onChange={(e) => setViewType(e.target.value as ViewType)}
                    title="Visualization"
                  >
                    <option value="map2d">Map 2D</option>
                    <option value="solar2d">Solar 2D</option>
                    <option value="solar3d">Solar 3D</option>
                    <option value="list">List</option>
                  </select>
                </div>
              )}
              {/* Map card header row (selector left, light controls right) */}
              <div className="flex items-center justify-between px-4 pt-3 pb-3 border-b">
                <select
                  className="text-sm bg-white border border-gray-200 rounded-xl px-3 py-1 text-gray-700 shadow-sm"
                  value={viewType}
                  onChange={(e) => setViewType(e.target.value as ViewType)}
                  title="Visualization"
                >
                  <option value="map2d">Map 2D</option>
                  <option value="solar2d">Solar 2D</option>
                  <option value="solar3d">Solar 3D</option>
                  <option value="list">List</option>
                  <option value="avgday">Timeline</option>
                </select>
                <div className="flex items-center gap-6 rounded-xl border border-gray-200 bg-white px-4 py-1 shadow-sm">
                  <button type="button" className="appearance-none bg-transparent focus:outline-none text-sm font-medium text-gray-800 hover:text-gray-900" onClick={autoOrganizePins}>Auto</button>
                  <button type="button" className="appearance-none bg-transparent focus:outline-none text-sm font-medium text-gray-800 hover:text-gray-900" onClick={() => setZoom((z) => Math.min(2, z + 0.1))}>+</button>
                  <button type="button" className="appearance-none bg-transparent focus:outline-none text-sm font-medium text-gray-800 hover:text-gray-900" onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}>-</button>
                  <button type="button" className="appearance-none bg-transparent focus:outline-none text-sm font-medium text-gray-800 hover:text-gray-900" onClick={() => setZoom(1)}>Reset</button>
                </div>
              </div>
              {isFullscreen && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-white/80 backdrop-blur rounded-full px-4 py-2 shadow flex items-center gap-3">
                  <span className="text-sm text-gray-700">Attention needed:</span>
                  {([['red','#EF4444'], ['yellow','#F59E0B'], ['green','#22C55E']] as const).map(([key, color]) => {
                    const selected = statusFilter.has(key as PinStatus);
                    return (
                      <button
                        key={key}
                        className={`w-10 h-6 rounded-full border flex items-center justify-center relative ${selected ? 'ring-2 ring-blue-200' : ''}`}
                        style={{ background: '#ffffff', borderColor: '#e5e7eb' }}
                        onClick={() => setStatusFilter(prev => { const next = new Set(prev); if (next.has(key as PinStatus)) next.delete(key as PinStatus); else next.add(key as PinStatus); return next; })}
                        aria-label={`Filter ${key}`}
                      >
                        <span className="w-6 h-3 rounded-full" style={{ backgroundColor: color, opacity: selected ? 1 : 0.3 }}></span>
                        {selected && <Check className="absolute right-1 top-1 text-gray-700" size={12} />}
                      </button>
                    );
                  })}
                </div>
              )}
              {/* Fullscreen toggle now sits inside the map area to avoid overlapping the header controls */}
              {viewType === 'solar3d' ? (
                <ThreeSolarView
                  pins={pins as any}
                  layerRadii={layerRadii}
                  layerNames={layerNames}
                  kindColors={kindColors}
                  statusColors={statusColors as any}
                  defaultGrey={defaultGrey}
                  kindToLayerIndex={kindToLayerIndex as any}
                  ringRotations={layerRadii.map((_, i) => [i * 0.05, i * 0.03, i * 0.02])}
                  isFullscreen={isFullscreen}
                />
              ) : viewType === 'list' ? (
                <div className="p-4">
                  {(['person','task','note','decision','location'] as const).map((k) => (
                    <div key={k} className="mb-4">
                      <div className="text-sm text-gray-600 mb-2 capitalize">{k}</div>
                      <div className="space-y-2">
                        {pins.filter(p => legendFilter.size === 0 ? p.kind === k : (legendFilter as Set<PinKind>).has(p.kind)).map((p) => (
                          <div key={p.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.status ? statusColors[p.status] : defaultGrey }}></span>
                              <span className="text-sm text-gray-800">{p.label}</span>
                            </div>
                            <button className="text-xs text-blue-600" onClick={() => { setEditingId(p.id); setEditText(p.label); setEditKind(p.kind); setEditMeta({ ...(p.meta||{}), status: (p as any).status }); }}>Edit</button>
                          </div>
                        ))}
                        {pins.filter(p => p.kind === k).length === 0 && (
                          <div className="text-xs text-gray-500">No items</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : viewType === 'avgday' ? (
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">Timeline (drag blocks to adjust start; double‑click to edit)</div>
                    <div className="text-xs text-gray-600 flex items-center gap-2">
                      <span>Range:</span>
                      {(['day','week','month','year'] as const).map(r => (
                        <button key={r} className={`px-2 py-1 rounded border ${'day'===r ? 'bg-gray-100' : ''}`} disabled>{r}</button>
                      ))}
                    </div>
                  </div>
                  {renderAvgDayTimeline('v1')}
                </div>
              ) : (
              <>
              <MapView
                mapRef={mapRef}
                isFullscreen={isFullscreen}
                zoom={zoom}
                solarView={solarView}
                layerRadii={layerRadii}
                layerNames={layerNames}
                pins={pins as any}
                legendFilter={legendFilter as any}
                statusFilter={statusFilter as any}
                defaultGrey={defaultGrey}
                statusColors={statusColors as any}
                formatLabel={formatLabel}
                toggleFullscreen={toggleFullscreen}
                onMapDoubleClick={handleMapDoubleClick}
                onPinMouseDown={(id)=>setDraggingId(id)}
                onPinDoubleClick={(p)=>{ setEditingId(p.id); setEditText(p.label); setEditKind(p.kind); setEditMeta({ ...(p.meta||{}), status: (p as any).status }); }}
              />
              {quickAddOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                  <div className="absolute inset-0 bg-black/30" onClick={() => setQuickAddOpen(false)} />
                  <div className="relative z-10 bg-white rounded-xl shadow-xl p-4 w-[360px]">
                    <div className="text-sm font-medium mb-2">Quick add task</div>
                    <input className="w-full border rounded px-2 py-1 text-sm mb-2" placeholder="Title" value={quickTitle} onChange={(e)=>setQuickTitle(e.target.value)} />
                    <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
                      <div>
                        <div className="text-gray-600 mb-1">Start</div>
                        <input className="w-full border rounded px-2 py-1" value={quickStartMin} onChange={(e)=>setQuickStartMin(Number(e.target.value)||0)} />
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">Duration (min)</div>
                        <input className="w-full border rounded px-2 py-1" value={quickDurationMin} onChange={(e)=>setQuickDurationMin(Number(e.target.value)||30)} />
                      </div>
                    </div>
                    <div className="flex gap-2 mb-3">
                      {[15,25,30,45,60].map(d=> (
                        <button key={d} className={`px-2 py-1 rounded border text-xs ${quickDurationMin===d?'bg-gray-100':''}`} onClick={()=>setQuickDurationMin(d)}>{d}m</button>
                      ))}
                    </div>
                    <div className="flex justify-end gap-2">
                      <button className="text-sm px-2 py-1" onClick={()=> setQuickAddOpen(false)}>Cancel</button>
                      <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded" onClick={()=>{
                        const id = Math.random().toString(36).slice(2);
                        const newPin: any = { id, label: quickTitle || 'New task', color: '#64748B', xPct: 50, yPct: 50, kind: 'task', status: 'yellow', meta: { avgStartMin: quickStartMin, avgDurationMin: quickDurationMin } };
                        setPins((prev)=>[...prev, newPin]);
                        setQuickAddOpen(false);
                        setEditingId(id); setEditKind('task'); setEditText(newPin.label); setEditMeta(newPin.meta);
                      }}>Save</button>
                    </div>
                  </div>
                </div>
              )}
              </>
              )}
            </LocalCard>
            )}

            {/* Legend card (separate from main visualization) */}
            {showLegendCard && (
            <LocalCard className="lg:col-span-2 p-4">
              <Legend
                items={legendItems as any}
                legendFilter={legendFilter as any}
                onToggleKind={(k)=> setLegendFilter(prev=>{ const next=new Set(prev as any); if(next.has(k as any)) next.delete(k as any); else next.add(k as any); return next as any; })}
                statusFilter={statusFilter as any}
                onToggleStatus={(k)=> setStatusFilter(prev=>{ const next=new Set(prev); if(next.has(k)) next.delete(k); else next.add(k); return next; })}
              />
            </LocalCard>
            )}

            {/* Secondary view card */}
            {showView2Card && (
            <LocalCard className="lg:col-span-2 p-4">
              <SecondaryView
                view2Mode={view2Mode as any}
                setView2Mode={(m)=>setView2Mode(m as any)}
                mapRef2={mapRef2}
                pins={pins as any}
                legendFilter={legendFilter as any}
                statusFilter={statusFilter as any}
                kindColors={kindColors as any}
                defaultGrey={defaultGrey}
                statusColors={statusColors as any}
                layerRadii={layerRadii}
                layerNames={layerNames}
                formatLabel={formatLabel}
                autoOrganizePins={autoOrganizePins}
                zoom={zoom}
                setZoom={setZoom}
                renderAvgDayTimeline={(which)=>renderAvgDayTimeline('v2')}
              />
            </LocalCard>
            )}

            {/* Quick Actions */}
            <div className={`space-y-4 ${sabbathMode ? 'opacity-80 saturate-75' : ''}`}>
              {/* Community-first: Who needs love today? */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="font-semibold mb-3">Who needs love today?</h3>
                <div className="space-y-2">
                  {heartConnections
                    .slice()
                    .sort((a, b) => b.days - a.days)
                    .filter((c) => c.days > 0)
                    .slice(0, 3)
                    .map((c, i) => (
                      <div key={i} className={`flex items-center justify-between p-3 rounded ${c.days > 7 ? 'bg-red-50' : 'bg-gray-50'}`}>
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{c.emoji}</span>
                          <div>
                            <div className="font-medium">{c.name}</div>
                            <div className="text-xs text-gray-500">{c.days} days since last touch</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Call</button>
                          <button className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Text</button>
                        </div>
                      </div>
                  ))}
                  {heartConnections.every((c) => c.days === 0) && (
                    <div className="text-sm text-gray-600">All caught up. Consider a quick gratitude note.</div>
                  )}
                </div>
              </div>
               {/* Next Best Action */}
               <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold mb-3">Next</h3>
              <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">{nextBestActionByDeficit[primaryDeficit].title}</h4>
                  <p className="text-sm text-blue-700 mt-1">Micro-steps: {nextBestActionByDeficit[primaryDeficit].micro}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex gap-2 text-xs">
                      <span className="px-2 py-1 bg-white/70 rounded">Due soon</span>
                      <span className="px-2 py-1 bg-white/70 rounded">Primary deficit: {primaryDeficit}</span>
                      <span className="px-2 py-1 bg-white/70 rounded">Short win</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">25:00</span>
                    </div>
                  </div>
                  <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Start
                  </button>
                </div>
              </div>

              {/* Daily Scores */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="font-semibold mb-4">Daily Scores</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Energy</span>
                    <span className="font-bold text-xl">{dailyScores.energy}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Peace</span>
                    <span className="font-bold text-xl">{dailyScores.peace}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Gratitude</span>
                    <span className="font-bold text-xl">{dailyScores.gratitude}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Story */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold mb-4">Today's Story</h3>
              <div className="space-y-4">
                {todayStory.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${getCategoryColor(item.category)}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-500">{item.time}</div>
                        <div className="text-gray-900">{item.activity}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Anchors (faith mode) */}
            {faithModeEnabled && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="font-semibold mb-4">Daily Anchors</h3>
                <div className="grid grid-cols-2 gap-2">
                  {anchors.map((anchor, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      {anchor.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300" />
                      )}
                      <span className={`text-sm ${anchor.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                        {anchor.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        

        

        

        

        {/* Intent Quick Add Modal */}
        {showIntentModal && selectedIntent && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="font-semibold mb-2">Quick add — {selectedIntent}</h3>
              <input className="w-full border rounded px-3 py-2 text-sm" placeholder={`What is a 2–5 min step for ${selectedIntent}?`} />
              <div className="flex justify-end gap-2 mt-4">
                <button className="px-3 py-2 text-sm" onClick={() => setShowIntentModal(false)}>Cancel</button>
                <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded" onClick={() => setShowIntentModal(false)}>Save</button>
              </div>
            </div>
          </div>
        )}

        {/* Stuck Moment Modal */}
        {showStuckModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg">
              <h3 className="font-semibold mb-3">Feeling stuck</h3>
              {!stuckCategory ? (
                <div className="grid grid-cols-3 gap-2">
                  {(['Self', 'Relationships', 'Faith'] as const).map((c) => (
                    <button key={c} className="px-3 py-2 bg-gray-100 rounded text-sm hover:bg-gray-200" onClick={() => setStuckCategory(c)}>{c}</button>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">Category: {stuckCategory}</div>
                  <div className="space-y-2">
                    {(
                      stuckCategory === 'Self' ? [
                        'Stand up, sip water, one deep breath',
                        'Set a 5‑min timer and do the first tiny step',
                        'Write the next sentence only'
                      ] : stuckCategory === 'Relationships' ? [
                        'Send a 1‑line check‑in to someone you care about',
                        'Draft the hard message; send a kind first line',
                        'Schedule a 10‑min call'
                      ] : [
                        'Two‑minute quiet: “Here I am.”',
                        'Read one verse; pick one word to carry',
                        'Offer gratitude for one specific thing'
                      ]
                    ).map((s, i) => (
                      <div key={i} className="p-3 bg-gray-50 rounded text-sm">• {s}</div>
                    ))}
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button className="px-3 py-2 text-sm" onClick={() => { setShowStuckModal(false); setStuckCategory(null); }}>Close</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics section is currently disabled in this build. */}

        {/* Footer (mood/energy) */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur p-3 border-t">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">Mood</span>
              <input type="range" min={0} max={5} value={mood} onChange={(e) => setMood(Number(e.target.value))} />
              <span className="text-xs">{mood}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">Energy</span>
              <input type="range" min={0} max={5} value={energy} onChange={(e) => setEnergy(Number(e.target.value))} />
              <span className="text-xs">{energy}</span>
            </div>
            <button className="ml-auto w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsolidatedLifeTracker;

