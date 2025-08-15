import React from 'react';

type ViewType = 'map2d' | 'solar2d' | 'solar3d' | 'list' | 'avgday';

type Props = {
  viewType: ViewType;
  setViewType: (v: ViewType) => void;
  onAuto: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
};

const VisualizationToolbar: React.FC<Props> = ({ viewType, setViewType, onAuto, onZoomIn, onZoomOut, onResetZoom }) => {
  return (
    <div className="flex items-center justify-between px-4 pt-3 pb-3">
      <select
        className="text-sm bg-white border border-gray-200 rounded-xl px-3 py-1 text-gray-700 shadow-sm"
        value={viewType}
        onChange={(e) => setViewType(e.target.value as ViewType)}
        title="Visualization"
      >
        <option value="map2d">Map 2D</option>
        <option value="solar2d">Solar 2D</option>
        <option value="solar3d">Solar 3D</option>
        <option value="list">List</option>
        <option value="avgday">Timeline</option>
      </select>
      <div className="flex items-center gap-6 rounded-xl border border-gray-200 bg-white px-4 py-1 shadow-sm">
        <button type="button" className="appearance-none bg-transparent focus:outline-none text-sm font-medium text-gray-800 hover:text-gray-900" onClick={onAuto}>Auto</button>
        <button type="button" className="appearance-none bg-transparent focus:outline-none text-sm font-medium text-gray-800 hover:text-gray-900" onClick={onZoomIn}>+</button>
        <button type="button" className="appearance-none bg-transparent focus:outline-none text-sm font-medium text-gray-800 hover:text-gray-900" onClick={onZoomOut}>-</button>
        <button type="button" className="appearance-none bg-transparent focus:outline-none text-sm font-medium text-gray-800 hover:text-gray-900" onClick={onResetZoom}>Reset</button>
      </div>
    </div>
  );
};

export default VisualizationToolbar;

