// @ts-nocheck
import React from 'react';
import AvgDayTimeline from './AvgDayTimeline';

type Props = {
  view2Mode: 'none' | 'map2d' | 'solar2d' | 'list' | 'avgday';
  setView2Mode: (m: 'none' | 'map2d' | 'solar2d' | 'list' | 'avgday') => void;
  mapRef2: React.RefObject<HTMLDivElement>;
  pins: any[];
  legendFilter: Set<string>;
  statusFilter: Set<string>;
  kindColors: Record<string, string>;
  defaultGrey: string;
  statusColors: Record<string, string>;
  layerRadii: number[];
  layerNames: string[];
  formatLabel: (s: string) => string;
  autoOrganizePins: () => void;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  setPins?: React.Dispatch<React.SetStateAction<any[]>>;
  onOpenQuickAdd?: (startMin: number) => void;
  onEditPin?: (id: string) => void;
};

const SecondaryView: React.FC<Props> = ({
  view2Mode,
  setView2Mode,
  mapRef2,
  pins,
  legendFilter,
  statusFilter,
  kindColors,
  defaultGrey,
  statusColors,
  layerRadii,
  layerNames,
  formatLabel,
  autoOrganizePins,
  zoom,
  setZoom,
  setPins,
  onOpenQuickAdd,
  onEditPin,
}) => {
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <select className="text-sm border rounded px-3 py-1" value={view2Mode} onChange={(e)=>setView2Mode(e.target.value as any)}>
          <option value="none">Empty</option>
          <option value="map2d">Map 2D</option>
          <option value="solar2d">Solar 2D</option>
          <option value="list">List</option>
          <option value="avgday">Timeline</option>
        </select>
        <div className="flex items-center gap-2">
          <button className="px-4 py-1 rounded-full border bg-white text-gray-800 text-sm" onClick={autoOrganizePins}>Auto</button>
          <button className="px-4 py-1 rounded-full border bg-white text-gray-800 text-sm" onClick={() => setZoom((z) => Math.min(2, z + 0.1))}>+</button>
          <button className="px-4 py-1 rounded-full border bg-white text-gray-800 text-sm" onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}>-</button>
          <button className="px-4 py-1 rounded-full border bg-white text-gray-800 text-sm" onClick={() => setZoom(1)}>Reset</button>
        </div>
      </div>

      {view2Mode === 'map2d' ? (
        <div ref={mapRef2} className="relative h-64 bg-gray-100 overflow-hidden rounded-lg">
          <div className="absolute inset-0 origin-center">
            <div className="absolute inset-0 bg-[linear-gradient(#e5e7eb_1px,transparent_1px),linear-gradient(90deg,#e5e7eb_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          </div>
          <button className="absolute bottom-2 left-2 bg-white border border-gray-200 rounded-md p-1 shadow" aria-label="Expand">↗</button>
          {pins
            .filter((p) => (legendFilter.size === 0 || legendFilter.has(p.kind)) && (statusFilter.size === 0 || (p as any).status && statusFilter.has((p as any).status)))
            .map((p) => (
              <div key={p.id} className="absolute" style={{ left: `${p.xPct}%`, top: `${p.yPct}%`, transform: 'translate(-50%, -50%)' }}>
                <span className="absolute w-3 h-3 rounded-full" style={{ left: 0, top: 0, transform: 'translate(-50%, -50%)', backgroundColor: (p as any).status ? statusColors[(p as any).status as any] : defaultGrey }} />
                <div className="relative px-3 py-1 rounded-full text-xs text-slate-700 bg-white/50 shadow translate-x-2 -translate-y-1/2">{formatLabel(p.label)}</div>
              </div>
            ))}
        </div>
      ) : view2Mode === 'solar2d' ? (
        <div className="relative h-64 bg-gray-100 rounded-lg">
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              {layerRadii.map((r, i) => (
                <path key={`v2-path-${i}`} id={`v2-orbit-${i}`} d={`M 50 50 m -${r}, 0 a ${r},${r} 0 1,1 ${r*2},0 a ${r},${r} 0 1,1 -${r*2},0`} />
              ))}
            </defs>
            {layerRadii.map((r, i) => (
              <g key={`v2-ring-${i}`}>
                <circle cx="50" cy="50" r={r} stroke="#E5E7EB" strokeDasharray="2 2" strokeWidth="0.6" fill="none" />
                <text fontSize="3" fill="#64748B"><textPath href={`#v2-orbit-${i}`} startOffset="25%" textAnchor="middle">{layerNames[i]}</textPath></text>
              </g>
            ))}
          </svg>
          {pins
            .filter((p) => (legendFilter.size === 0 || legendFilter.has(p.kind)) && (statusFilter.size === 0 || (p as any).status && statusFilter.has((p as any).status)))
            .map((p) => (
              <div key={p.id} className="absolute" style={{ left: `${p.xPct}%`, top: `${p.yPct}%`, transform: 'translate(-50%, -50%)' }}>
                <span className="absolute w-3 h-3 rounded-full" style={{ left: 0, top: 0, transform: 'translate(-50%, -50%)', backgroundColor: (p as any).status ? statusColors[(p as any).status as any] : defaultGrey }} />
                <div className="relative px-3 py-1 rounded-full text-xs text-slate-700 bg-white/50 shadow translate-x-2 -translate-y-1/2">{formatLabel(p.label)}</div>
              </div>
            ))}
          <button className="absolute bottom-2 left-2 bg-white border border-gray-200 rounded-md p-1 shadow" aria-label="Expand">↗</button>
        </div>
      ) : view2Mode === 'list' ? (
        <div className="grid grid-cols-1 gap-4">
          {(legendFilter.size > 0 ? Array.from(legendFilter) : (['person','task','note','decision','location'] as const)).map((k) => (
            <div key={k as string} className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600 mb-2 capitalize">{k as string}</div>
              <div className="space-y-2 max-h-48 overflow-auto pr-2">
                {pins
                  .filter(p => p.kind === (k as any))
                  .filter(p => statusFilter.size === 0 || ((p as any).status && statusFilter.has((p as any).status)))
                  .map((p) => (
                    <div key={p.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 shadow-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: kindColors[p.kind] }}></span>
                        <span className="text-sm text-gray-800">{p.label}</span>
                      </div>
                      <span className="text-xs text-gray-400">({Math.round(p.xPct)}%, {Math.round(p.yPct)}%)</span>
                    </div>
                  ))}
                {pins.filter(p => p.kind === (k as any) && (statusFilter.size === 0 || ((p as any).status && statusFilter.has((p as any).status)))).length === 0 && (
                  <div className="text-xs text-gray-500">No items</div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : view2Mode === 'avgday' ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Timeline (drag blocks to adjust start; double‑click to edit)</div>
            <div className="text-xs text-gray-600 flex items-center gap-2">
              <span>Range:</span>
              {(['day','week','month','year'] as const).map(r => (
                <button key={r} className={`px-2 py-1 rounded border ${'day'===r ? 'bg-gray-100' : ''}`} disabled>{r}</button>
              ))}
            </div>
          </div>
          <AvgDayTimeline which="v2" pins={pins} setPins={setPins as any} onOpenQuickAdd={onOpenQuickAdd as any} onEditPin={onEditPin as any} />
        </div>
      ) : view2Mode === 'none' ? (
        <div className="relative h-40 bg-gray-100 overflow-hidden rounded-lg">
          <div className="absolute inset-0 bg-[linear-gradient(#e5e7eb_1px,transparent_1px),linear-gradient(90deg,#e5e7eb_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <button className="absolute bottom-2 left-2 bg-white border border-gray-200 rounded-md p-1 shadow" aria-label="Expand">
            ↗
          </button>
        </div>
      ) : null}
    </>
  );
};

export default SecondaryView;

