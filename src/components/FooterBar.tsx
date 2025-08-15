import React from 'react';
import { Plus } from 'lucide-react';

type Props = {
  mood: number;
  setMood: (n: number) => void;
  energy: number;
  setEnergy: (n: number) => void;
  onAdd?: () => void;
};

const FooterBar: React.FC<Props> = ({ mood, setMood, energy, setEnergy, onAdd }) => {
  return (
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
        <button
          className="ml-auto w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow flex items-center justify-center"
          onClick={onAdd}
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default FooterBar;

