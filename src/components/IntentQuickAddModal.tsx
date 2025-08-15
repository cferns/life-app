import React from 'react';

type Props = {
  open: boolean;
  selectedIntent: 'Eat/Rest' | 'Connect' | 'Decide' | null;
  onCancel: () => void;
  onSave: () => void;
};

const IntentQuickAddModal: React.FC<Props> = ({ open, selectedIntent, onCancel, onSave }) => {
  if (!open || !selectedIntent) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 className="font-semibold mb-2">Quick add — {selectedIntent}</h3>
        <input className="w-full border rounded px-3 py-2 text-sm" placeholder={`What is a 2–5 min step for ${selectedIntent}?`} />
        <div className="flex justify-end gap-2 mt-4">
          <button className="px-3 py-2 text-sm" onClick={onCancel}>Cancel</button>
          <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded" onClick={onSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default IntentQuickAddModal;

