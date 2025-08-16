import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';

type Anchor = { name: string; completed: boolean };

type Props = {
  faithModeEnabled: boolean;
  anchors: Anchor[];
};

const AnchorsCard: React.FC<Props> = ({ faithModeEnabled, anchors }) => {
  if (!faithModeEnabled) return null;
  return (
    <div className="rounded-2xl p-6 shadow-sm border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
      <h3 className="font-semibold mb-4">Daily Anchors</h3>
      <div className="grid grid-cols-2 gap-2">
        {anchors.map((anchor, index) => (
          <div key={index} className="flex items-center space-x-2">
            {anchor.completed ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <Circle className="w-5 h-5 text-gray-300" />
            )}
            <span className={`text-sm ${anchor.completed ? 'text-gray-900' : 'text-gray-500'}`}>
              {anchor.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnchorsCard;

