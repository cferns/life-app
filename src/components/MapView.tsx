// @ts-nocheck
import React from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

type Props = {
  mapRef: React.RefObject<HTMLDivElement>;
  isFullscreen: boolean;
  zoom: number;
  solarView: boolean;
  layerRadii: number[];
  layerNames: string[];
  pins: any[];
  legendFilter: Set<string>;
  statusFilter: Set<string>;
  defaultGrey: string;
  statusColors: Record<string, string>;
  formatLabel: (s: string) => string;
  toggleFullscreen: () => void;
  onMapDoubleClick: React.MouseEventHandler<HTMLDivElement>;
  onPinMouseDown: (id: string) => void;
  onPinDoubleClick: (pin: any) => void;
};

const MapView: React.FC<Props> = ({
  mapRef,
  isFullscreen,
  zoom,
  solarView,
  layerRadii,
  layerNames,
  pins,
  legendFilter,
  statusFilter,
  defaultGrey,
  statusColors,
  formatLabel,
  toggleFullscreen,
  onMapDoubleClick,
  onPinMouseDown,
  onPinDoubleClick,
}) => {
  return (
    <div ref={mapRef} onDoubleClick={onMapDoubleClick} className={`relative bg-gray-100 cursor-crosshair select-none overflow-hidden border-t border-gray-200`} style={{ height: isFullscreen ? 'calc(100vh - 3rem)' : '20rem' }}>
      {/* Fullscreen toggle */}
      <button
        className="absolute top-3 right-3 z-10 bg-white border border-gray-200 rounded-xl w-9 h-9 shadow-sm hover:bg-gray-50 flex items-center justify-center"
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </button>
      {/* Grid background */}
      <div className="absolute inset-0 origin-center" style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}>
        <div className="absolute inset-0 bg-[linear-gradient(#e5e7eb_1px,transparent_1px),linear-gradient(90deg,#e5e7eb_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>
      {/* Solar rings */}
      {solarView && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ transform: `scale(${zoom})` }}>
          <defs>
            {layerRadii.map((r, i) => (
              <path key={`path-${i}`} id={`orbit-${i}`} d={`M 50 50 m -${r}, 0 a ${r},${r} 0 1,1 ${r*2},0 a ${r},${r} 0 1,1 -${r*2},0`} />
            ))}
          </defs>
          {layerRadii.map((r, i) => (
            <g key={i}>
              <circle cx="50" cy="50" r={r} stroke="#E5E7EB" strokeDasharray="2 2" strokeWidth="0.6" fill="none" />
              <text fontSize="3" fill="#64748B">
                <textPath href={`#orbit-${i}`} startOffset="25%" textAnchor="middle">{layerNames[i]}</textPath>
              </text>
            </g>
          ))}
        </svg>
      )}
      {/* Pins */}
      {pins
        .filter((p) => (legendFilter.size === 0 || legendFilter.has(p.kind)) && (statusFilter.size === 0 || (p as any).status && statusFilter.has((p as any).status)))
        .map((p) => (
        <div
          key={p.id}
          className="absolute group"
          style={{ left: `${p.xPct}%`, top: `${p.yPct}%`, transform: `translate(-50%, -50%) scale(${zoom})` }}
          onMouseDown={() => onPinMouseDown(p.id)}
          onDoubleClick={(e) => { e.stopPropagation(); onPinDoubleClick(p); }}
        >
          <div className="relative">
            {/* Dot */}
            <span
              className="absolute w-3 h-3 rounded-full"
              style={{ left: 0, top: 0, transform: 'translate(-50%, -50%)', backgroundColor: p.status ? statusColors[p.status] : defaultGrey }}
            />
            {/* Label */}
            <div
              className="absolute px-3 py-1 rounded-full text-xs text-slate-700 bg-white/50 shadow"
              style={{ left: 0, top: 0, transform: `translate(${p.xPct < 50 ? '-12px' : '12px'}, -50%)${p.xPct < 50 ? ' translateX(-100%)' : ''}` }}
            >
              {formatLabel(p.label)}
            </div>
          </div>
        </div>
      ))}
      {/* Curved connections (example) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {pins.filter((p) => p.kind === 'root').map((p) => {
          const sx = `${50}%`; const sy = `${50}%`;
          const tx = `${p.xPct}%`; const ty = `${p.yPct}%`;
          const c1x = `${(50 + p.xPct) / 2}%`; const c1y = `${50}%`;
          const c2x = `${(50 + p.xPct) / 2}%`; const c2y = `${p.yPct}%`;
          return (
            <path key={`edge-${p.id}`} d={`M ${sx} ${sy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${tx} ${ty}`} stroke="#94A3B8" strokeWidth="2" fill="none" />
          );
        })}
      </svg>
    </div>
  );
};

export default MapView;

