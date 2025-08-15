import React from 'react';
import { Clock } from 'lucide-react';

type Heart = { name: string; action: string; emoji: string; days: number };

type Props = {
  heartConnections: Heart[];
  primaryDeficit: 'Eat/Rest' | 'Connect' | 'Decide';
  nextBestActionByDeficit: Record<'Eat/Rest' | 'Connect' | 'Decide', { title: string; micro: string }>;
  dailyScores: Record<string, number>;
  sabbathMode: boolean;
};

const QuickActions: React.FC<Props> = ({ heartConnections, primaryDeficit, nextBestActionByDeficit, dailyScores, sabbathMode }) => {
  return (
    <div className={`space-y-4 ${sabbathMode ? 'opacity-80 saturate-75' : ''}`}>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-semibold mb-3">Who needs love today?</h3>
        <div className="space-y-2">
          {heartConnections
            .slice()
            .sort((a, b) => b.days - a.days)
            .filter((c) => c.days > 0)
            .slice(0, 3)
            .map((c, i) => (
              <div key={i} className={`flex items-center justify-between p-3 rounded ${c.days > 7 ? 'bg-red-50' : 'bg-gray-50'}`}>
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{c.emoji}</span>
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-gray-500">{c.days} days since last touch</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Call</button>
                  <button className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Text</button>
                </div>
              </div>
          ))}
          {heartConnections.every((c) => c.days === 0) && (
            <div className="text-sm text-gray-600">All caught up. Consider a quick gratitude note.</div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-semibold mb-3">Next</h3>
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900">{nextBestActionByDeficit[primaryDeficit].title}</h4>
          <p className="text-sm text-blue-700 mt-1">Micro-steps: {nextBestActionByDeficit[primaryDeficit].micro}</p>
          <div className="flex items-center justify-between mt-3">
            <div className="flex gap-2 text-xs">
              <span className="px-2 py-1 bg-white/70 rounded">Due soon</span>
              <span className="px-2 py-1 bg-white/70 rounded">Primary deficit: {primaryDeficit}</span>
              <span className="px-2 py-1 bg-white/70 rounded">Short win</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">25:00</span>
            </div>
          </div>
          <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Start
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-semibold mb-4">Daily Scores</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Energy</span>
            <span className="font-bold text-xl">{dailyScores.energy}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Peace</span>
            <span className="font-bold text-xl">{dailyScores.peace}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Gratitude</span>
            <span className="font-bold text-xl">{dailyScores.gratitude}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;

