// @ts-nocheck
import React, { useRef, useState, useEffect } from 'react';

type MapPin = any;

type Props = {
  which: 'v1' | 'v2';
  pins: MapPin[];
  setPins: React.Dispatch<React.SetStateAction<MapPin[]>>;
  onOpenQuickAdd: (startMin: number) => void;
  onEditPin: (id: string) => void;
  height?: number;
};

const minutesToTime = (min: number): string => {
  const m = Math.max(0, Math.min(1439, Math.round(min)));
  const h = Math.floor(m / 60);
  const mm = m % 60;
  const hh12 = ((h + 11) % 12) + 1;
  const ampm = h < 12 ? 'AM' : 'PM';
  return `${hh12}:${mm.toString().padStart(2, '0')} ${ampm}`;
};

const AvgDayTimeline: React.FC<Props> = ({ which, pins, setPins, onOpenQuickAdd, onEditPin, height = 400 }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [drag, setDrag] = useState<{ id: string; offset: number } | null>(null);

  useEffect(() => {
    if (!drag) return;
    const onMove = (e: MouseEvent) => {
      const ref = containerRef.current;
      if (!ref) return;
      const rect = ref.getBoundingClientRect();
      const ratio = (e.clientY - rect.top) / rect.height;
      const minutes = Math.max(0, Math.min(1440, Math.round(ratio * 1440))) - drag.offset;
      setPins((prev) => prev.map((p: any) => {
        if (p.id !== drag.id) return p;
        const meta = { ...(p as any).meta };
        const dur = Math.max(0, meta.avgDurationMin ?? 30);
        meta.avgStartMin = Math.max(0, Math.min(1440 - dur, minutes));
        return { ...p, meta } as any;
      }));
    };
    const onUp = () => setDrag(null);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [drag, setPins]);

  type Block = { id: string; label: string; start: number; end: number };
  let items: Block[] = pins
    .filter((p: any) => p.kind === 'task' && (p as any).meta?.avgStartMin != null)
    .map((p: any) => {
      const start = Number((p as any).meta.avgStartMin) || 0;
      const dur = Number((p as any).meta.avgDurationMin) || 30;
      return { id: p.id, label: p.label, start, end: Math.min(1440, start + dur) };
    })
    .sort((a: any, b: any) => a.start - b.start);

  if (items.length === 0) {
    const demo = pins.filter((p: any) => p.kind === 'task').slice(0, 6);
    items = demo.map((p: any, i: number) => {
      const start = 8 * 60 + i * 45;
      const dur = 30;
      return { id: p.id, label: p.label, start, end: Math.min(1440, start + dur) };
    });
  }

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
      className="relative w-full rounded-lg border p-3"
      style={{ height, background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
      onDoubleClick={(e) => {
        const ref = containerRef.current; if (!ref) return;
        const rect = ref.getBoundingClientRect();
        const ratio = (e.clientY - rect.top) / rect.height;
        const start = Math.max(0, Math.min(1440, Math.round(ratio * 1440)));
        onOpenQuickAdd(start);
      }}
    >
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
                      const p = pins.find((x: any) => x.id === b.id)!;
                      const start = Number((p as any).meta?.avgStartMin) || 0;
                      const ref = containerRef.current;
                      if (!ref) return;
                      const rect = ref.getBoundingClientRect();
                      const ratio = (e.clientY - rect.top) / rect.height;
                      const cursorMin = Math.round(ratio * 1440);
                      setDrag({ id: b.id, offset: cursorMin - start });
                    }}
                    onDoubleClick={() => onEditPin(b.id)}
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

export default AvgDayTimeline;

