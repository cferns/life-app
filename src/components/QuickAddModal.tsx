// @ts-nocheck
import React from 'react';

type Props = {
  open: boolean;
  quickTitle: string;
  setQuickTitle: (s: string) => void;
  quickStartMin: number;
  setQuickStartMin: (n: number) => void;
  quickDurationMin: number;
  setQuickDurationMin: (n: number) => void;
  onCancel: () => void;
  onSave: () => void;
};

const QuickAddModal: React.FC<Props> = ({ open, quickTitle, setQuickTitle, quickStartMin, setQuickStartMin, quickDurationMin, setQuickDurationMin, onCancel, onSave }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onCancel} />
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
          <button className="text-sm px-2 py-1" onClick={onCancel}>Cancel</button>
          <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded" onClick={onSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default QuickAddModal;

