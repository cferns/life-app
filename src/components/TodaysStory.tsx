import React from 'react';

type StoryItem = { time: string; activity: string; category: string; icon: React.ComponentType<{ className?: string }> };

type Props = {
  items: StoryItem[];
  getCategoryColor: (category: string) => string;
};

const TodaysStory: React.FC<Props> = ({ items, getCategoryColor }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <h3 className="font-semibold mb-4">Today's Story</h3>
      <div className="space-y-4">
        {items.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div key={index} className="flex items-start space-x-3">
              <div className={`p-2 rounded-full ${getCategoryColor(item.category)}`}>
                <IconComponent className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500">{item.time}</div>
                <div className="text-gray-900">{item.activity}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TodaysStory;

