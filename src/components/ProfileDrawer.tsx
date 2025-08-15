import React from 'react';
import { X } from 'lucide-react';

type Props = {
  show: boolean;
  onClose: () => void;
};

const ProfileDrawer: React.FC<Props> = ({ show, onClose }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 w-80 max-w-[85vw] bg-white shadow-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Profile</h2>
          <button className="w-8 h-8 rounded-md border flex items-center justify-center" onClick={onClose} aria-label="Close profile"><X className="w-4 h-4"/></button>
        </div>
        <div className="space-y-3 text-sm text-gray-700">
          <div><input type="checkbox" className="mr-2"/> Option A</div>
          <div><input type="checkbox" className="mr-2"/> Option B</div>
          <div><input type="checkbox" className="mr-2"/> Option C</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDrawer;

