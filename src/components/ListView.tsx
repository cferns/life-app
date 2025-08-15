// @ts-nocheck
import React from 'react';

type Props = {
  pins: any[];
  legendFilter: Set<string>;
  defaultGrey: string;
  statusColors: Record<string, string>;
  onEdit: (pin: any) => void;
};

const ListView: React.FC<Props> = ({ pins, legendFilter, defaultGrey, statusColors, onEdit }) => {
  return (
    <div className="p-4">
      {(['person','task','note','decision','location'] as const).map((k) => (
        <div key={k} className="mb-4">
          <div className="text-sm text-gray-600 mb-2 capitalize">{k}</div>
          <div className="space-y-2">
            {pins.filter(p => legendFilter.size === 0 ? p.kind === k : (legendFilter as Set<string>).has(p.kind)).map((p) => (
              <div key={p.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.status ? statusColors[p.status] : defaultGrey }}></span>
                  <span className="text-sm text-gray-800">{p.label}</span>
                </div>
                <button className="text-xs text-blue-600" onClick={() => onEdit(p)}>Edit</button>
              </div>
            ))}
            {pins.filter(p => p.kind === k).length === 0 && (
              <div className="text-xs text-gray-500">No items</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListView;

