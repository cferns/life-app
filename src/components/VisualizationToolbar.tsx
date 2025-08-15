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
    <div className="flex items-center justify-between px-4 pt-3 pb-3" style={{ background: 'var(--accent-bg)', color: 'var(--accent-text)' }}>
      <select
        className="text-sm rounded-xl px-3 py-1 shadow-sm"
        style={{ background: 'var(--control-bg)', color: 'var(--control-text)', border: '1px solid var(--control-border)' }}
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
      <div className="flex items-center gap-6 rounded-xl px-4 py-1 shadow-sm" style={{ background: 'var(--control-bg)', color: 'var(--control-text)', border: '1px solid var(--control-border)' }}>
        <button type="button" className="appearance-none bg-transparent focus:outline-none text-sm font-medium" onClick={onAuto}>Auto</button>
        <button type="button" className="appearance-none bg-transparent focus:outline-none text-sm font-medium" onClick={onZoomIn}>+</button>
        <button type="button" className="appearance-none bg-transparent focus:outline-none text-sm font-medium" onClick={onZoomOut}>-</button>
        <button type="button" className="appearance-none bg-transparent focus:outline-none text-sm font-medium" onClick={onResetZoom}>Reset</button>
      </div>
    </div>
  );
};

export default VisualizationToolbar;

