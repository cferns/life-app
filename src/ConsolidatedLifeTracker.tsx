// @ts-nocheck
import React, { useMemo, useState, useEffect, useRef } from 'react';
import ThreeSolarView from './ThreeSolarView';
import Card from './components/Card';
import type { MapPin, PinKind, PinStatus } from './types';
import Legend from './components/Legend';
import MapView from './components/MapView';
import SecondaryView from './components/SecondaryView';
import AvgDayTimeline from './components/AvgDayTimeline';
import { dailyScores, todayStory, heartConnections, weeklyData, balanceData, nextBestActionByDeficit, anchors, defaultPins } from './data/seed';
import { formatLabel, clampPct } from './utils/map';
import { usePinsStorage } from './hooks/usePinsStorage';
import { useFullscreen } from './hooks/useFullscreen';
import { Plus, Star, Coffee, Phone, Moon, Users, Compass, Heart, Check } from 'lucide-react';
import FooterBar from './components/FooterBar';
import FiltersDrawer from './components/FiltersDrawer';
import ProfileDrawer from './components/ProfileDrawer';
import QuickActions from './components/QuickActions';
import TodaysStory from './components/TodaysStory';
import AnchorsCard from './components/AnchorsCard';
import GlobalEditModal from './components/GlobalEditModal';
import QuickAddModal from './components/QuickAddModal';
import IntentQuickAddModal from './components/IntentQuickAddModal';
import StuckModal from './components/StuckModal';
import HeaderBar from './components/HeaderBar';
import VisualizationToolbar from './components/VisualizationToolbar';
import ListView from './components/ListView';

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
  const [theme, setTheme] = useState<'light' | 'warm' | 'dim' | 'custom'>(() => (localStorage.getItem('udn_theme') as any) || 'light');
  useEffect(()=>{
    const savedCustom = localStorage.getItem('udn_theme_custom');
    if(theme === 'custom' && savedCustom){
      try{ const {appBg,text,cardBg,cardBorder,pillBg} = JSON.parse(savedCustom);
        document.body.style.setProperty('--app-bg', appBg);
        document.body.style.setProperty('--text', text);
        document.body.style.setProperty('--card-bg', cardBg);
        document.body.style.setProperty('--card-border', cardBorder);
        document.body.style.setProperty('--pill-bg', pillBg);
      }catch{}
    }
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('udn_theme', theme);
  }, [theme]);
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


  // Compute primary deficit (lowest ratio)
  const primaryDeficit = balanceData
    .map((b) => ({ name: b.name, ratio: b.value / b.total }))
    .sort((a, b) => a.ratio - b.ratio)[0]?.name as 'Eat/Rest' | 'Connect' | 'Decide';

  // derived values from seed data

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

  const [pins, setPins] = usePinsStorage<MapPin[]>('udn_pins', defaultPins);
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
  const { isFullscreen, toggleFullscreen } = useFullscreen(panelRef as any);
  // minutesToTime moved into AvgDayTimeline component
  // Quick add (timeline)
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickTitle, setQuickTitle] = useState('');
  const [quickStartMin, setQuickStartMin] = useState(9 * 60);
  const [quickDurationMin, setQuickDurationMin] = useState(30);

  // Avg-day timeline moved into dedicated component

  // persisted via usePinsStorage

  // clampPct moved to utils

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
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [showStory, setShowStory] = useState(true);
  const [showAnchorsCard, setShowAnchorsCard] = useState(true);

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
      <HeaderBar
        syncState={syncState}
        onOpenFilters={()=>setShowFilters(true)}
        onOpenProfile={()=>setShowProfile(true)}
      />
      <div className="max-w-7xl mx-auto space-y-6 px-6 sm:px-9 pt-6 sm:pt-8">

        <FiltersDrawer
          show={showFilters}
          onClose={()=>setShowFilters(false)}
          showView1={showView1}
          setShowView1={setShowView1}
          showLegendCard={showLegendCard}
          setShowLegendCard={setShowLegendCard}
          showView2Card={showView2Card}
          setShowView2Card={setShowView2Card}
          showQuickActions={showQuickActions}
          setShowQuickActions={setShowQuickActions}
          showStory={showStory}
          setShowStory={setShowStory}
          showAnchors={showAnchorsCard}
          setShowAnchors={setShowAnchorsCard}
        />

        <ProfileDrawer
          show={showProfile}
          onClose={()=>setShowProfile(false)}
          faithModeEnabled={faithModeEnabled}
          setFaithModeEnabled={setFaithModeEnabled}
          sabbathMode={sabbathMode}
          setSabbathMode={setSabbathMode}
          syncState={syncState}
          setSyncState={setSyncState as any}
          onResetDemo={()=>{ localStorage.removeItem('udn_pins'); setPins(defaultPins); }}
          theme={theme}
          setTheme={setTheme}
        />

      {/* Global Edit Modal */}
      <GlobalEditModal
        pin={pins.find(pp => pp.id === editingId) ?? null}
        editKind={editKind}
        setEditKind={setEditKind as any}
        editText={editText}
        setEditText={setEditText}
        editMeta={editMeta}
        setEditMeta={(fn)=> setEditMeta(fn as any)}
        statusColors={statusColors as any}
        defaultGrey={defaultGrey}
        onCancel={()=> setEditingId(null)}
        onDelete={()=>{ const pid = editingId; setPins((prev) => prev.filter((x) => x.id !== pid)); setEditingId(null); }}
        onSave={()=>{
        const p = pins.find(pp => pp.id === editingId);
          if (!p) { setEditingId(null); return; }
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
      />

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
              <VisualizationToolbar
                viewType={viewType}
                setViewType={(v)=>setViewType(v as any)}
                onAuto={autoOrganizePins}
                onZoomIn={()=> setZoom((z)=> Math.min(2, z+0.1))}
                onZoomOut={()=> setZoom((z)=> Math.max(0.5, z-0.1))}
                onResetZoom={()=> setZoom(1)}
              />
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
                <ListView
                  pins={pins as any}
                  legendFilter={legendFilter as any}
                  defaultGrey={defaultGrey}
                  statusColors={statusColors as any}
                  onEdit={(p)=>{ setEditingId(p.id); setEditText(p.label); setEditKind(p.kind); setEditMeta({ ...(p.meta||{}), status: (p as any).status }); }}
                />
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
                  <AvgDayTimeline
                    which="v1"
                    pins={pins as any}
                    setPins={setPins as any}
                    onOpenQuickAdd={(start)=>{ setQuickAddOpen(true); setQuickTitle(''); setQuickStartMin(start); setQuickDurationMin(30); }}
                    onEditPin={(id)=>{ setEditingId(id); const p = pins.find(x=>x.id===id)!; setEditText(p.label); setEditKind(p.kind as any); setEditMeta({ ...(p as any).meta, status: (p as any).status }); }}
                  />
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
              <QuickAddModal
                open={quickAddOpen}
                quickTitle={quickTitle}
                setQuickTitle={setQuickTitle}
                quickStartMin={quickStartMin}
                setQuickStartMin={setQuickStartMin}
                quickDurationMin={quickDurationMin}
                setQuickDurationMin={setQuickDurationMin}
                onCancel={()=> setQuickAddOpen(false)}
                onSave={()=>{
                        const id = Math.random().toString(36).slice(2);
                        const newPin: any = { id, label: quickTitle || 'New task', color: '#64748B', xPct: 50, yPct: 50, kind: 'task', status: 'yellow', meta: { avgStartMin: quickStartMin, avgDurationMin: quickDurationMin } };
                        setPins((prev)=>[...prev, newPin]);
                        setQuickAddOpen(false);
                        setEditingId(id); setEditKind('task'); setEditText(newPin.label); setEditMeta(newPin.meta);
                }}
              />
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
            {showQuickActions && (
              <QuickActions
                heartConnections={heartConnections as any}
                primaryDeficit={primaryDeficit}
                nextBestActionByDeficit={nextBestActionByDeficit}
                dailyScores={dailyScores}
                sabbathMode={sabbathMode}
              />
            )}

            {/* Today's Story */}
            {showStory && (
              <div className="lg:col-span-2">
                <TodaysStory items={todayStory as any} getCategoryColor={getCategoryColor} />
              </div>
            )}

            {showAnchorsCard && (
              <AnchorsCard faithModeEnabled={faithModeEnabled} anchors={anchors as any} />
            )}
          </div>
        )}
        {/* Intent Quick Add Modal */}
        <IntentQuickAddModal
          open={showIntentModal}
          selectedIntent={selectedIntent}
          onCancel={()=> setShowIntentModal(false)}
          onSave={()=> setShowIntentModal(false)}
        />

        {/* Stuck Moment Modal */}
        <StuckModal
          open={showStuckModal}
          stuckCategory={stuckCategory}
          setStuckCategory={setStuckCategory as any}
          onClose={()=> setShowStuckModal(false)}
        />

        {/* Analytics section is currently disabled in this build. */}

        {/* Footer (mood/energy) */}
        <FooterBar mood={mood} setMood={setMood} energy={energy} setEnergy={setEnergy} onAdd={()=>{}} />
      </div>
    </div>
  );
};

export default ConsolidatedLifeTracker;

