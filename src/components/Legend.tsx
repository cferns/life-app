import React from 'react';
import type { PinStatus } from '../types';
import { Check } from 'lucide-react';

type LegendItem = { key: string; label: string; color: string };

type Props = {
  items: LegendItem[];
  legendFilter: Set<string>;
  onToggleKind: (key: string) => void;
  statusFilter: Set<PinStatus>;
  onToggleStatus: (key: PinStatus) => void;
};

const Legend: React.FC<Props> = ({ items, legendFilter, onToggleKind, statusFilter, onToggleStatus }) => {
  return (
    <div>
      <div className="rounded-t-2xl -mx-4 -mt-4 px-4 py-3" style={{ background: 'var(--accent-bg)', color: 'var(--accent-text)' }}>
        <div className="text-lg font-medium">Legend</div>
      </div>
      <div className="flex items-center gap-3 flex-nowrap overflow-x-auto pb-2 pt-3" style={{ background: 'var(--card-bg)' }}>
        {items.map((item) => {
          const selected = legendFilter.has(item.key as any);
          return (
            <button
              key={item.key}
              className={`shrink-0 px-3 py-2 rounded-full shadow text-sm transition ${selected ? 'ring-2 ring-blue-200' : ''}`}
              style={{
                backgroundColor: selected ? item.color : 'var(--control-bg)',
                color: selected ? '#ffffff' : 'var(--control-text)',
                border: selected ? 'none' : '1px solid var(--control-border)'
              }}
              onClick={() => onToggleKind(item.key)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <span className="text-sm text-gray-700">Attention needed:</span>
        {([['red','#EF4444'], ['yellow','#F59E0B'], ['green','#22C55E']] as const).map(([key, color]) => {
          const selected = statusFilter.has(key as PinStatus);
          return (
            <button
              key={key}
              className={`w-10 h-6 rounded-full border flex items-center justify-center relative ${selected ? 'ring-2 ring-blue-200' : ''}`}
              style={{ background: '#ffffff', borderColor: '#e5e7eb' }}
              onClick={() => onToggleStatus(key as PinStatus)}
              aria-label={`Filter ${key}`}
            >
              <span className="w-6 h-3 rounded-full" style={{ backgroundColor: color, opacity: selected ? 1 : 0.3 }}></span>
              {selected && <Check className="absolute right-1 top-1 text-gray-700" size={12} />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Legend;

