// @ts-nocheck
import React from 'react';
import type { PinKind, PinStatus } from '../types';

type Props = {
  pin: any | null;
  editKind: PinKind;
  setEditKind: (k: PinKind) => void;
  editText: string;
  setEditText: (s: string) => void;
  editMeta: any;
  setEditMeta: (fn: (m: any) => any) => void;
  statusColors: Record<string, string>;
  defaultGrey: string;
  onCancel: () => void;
  onDelete: () => void;
  onSave: () => void;
};

const GlobalEditModal: React.FC<Props> = ({ pin, editKind, setEditKind, editText, setEditText, editMeta, setEditMeta, statusColors, defaultGrey, onCancel, onDelete, onSave }) => {
  if (!pin) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onCancel} />
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
            <span className="w-4 h-4 rounded-full inline-block" style={{ backgroundColor: (pin as any).status ? statusColors[(pin as any).status as PinStatus] : defaultGrey }}></span>
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
            <button className="text-xs px-2 py-1" onClick={onCancel}>Cancel</button>
            <button className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded" onClick={onDelete}>Delete</button>
            <button className="text-xs bg-blue-600 text-white px-2 py-1 rounded" onClick={onSave}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalEditModal;

