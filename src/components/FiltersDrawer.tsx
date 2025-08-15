import React from 'react';
import { X } from 'lucide-react';

type Props = {
  show: boolean;
  onClose: () => void;
  showView1: boolean;
  setShowView1: (v: boolean) => void;
  showLegendCard: boolean;
  setShowLegendCard: (v: boolean) => void;
  showView2Card: boolean;
  setShowView2Card: (v: boolean) => void;
};

const FiltersDrawer: React.FC<Props> = ({ show, onClose, showView1, setShowView1, showLegendCard, setShowLegendCard, showView2Card, setShowView2Card }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-white shadow-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Filters</h2>
          <button className="w-8 h-8 rounded-md border flex items-center justify-center" onClick={onClose} aria-label="Close filters"><X className="w-4 h-4"/></button>
        </div>
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-700">Cards</div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={showView1} onChange={(e)=>setShowView1(e.target.checked)} /> View 1</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={showLegendCard} onChange={(e)=>setShowLegendCard(e.target.checked)} /> Legend</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={showView2Card} onChange={(e)=>setShowView2Card(e.target.checked)} /> View 2</label>
        </div>
      </div>
    </div>
  );
};

export default FiltersDrawer;

