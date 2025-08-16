import React from 'react';

type Props = {
  open: boolean;
  stuckCategory: 'Self' | 'Relationships' | 'Faith' | null;
  setStuckCategory: (c: 'Self' | 'Relationships' | 'Faith' | null) => void;
  onClose: () => void;
};

const StuckModal: React.FC<Props> = ({ open, stuckCategory, setStuckCategory, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="rounded-xl p-6 w-full max-w-lg" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
        <h3 className="font-semibold mb-3">Feeling stuck</h3>
        {!stuckCategory ? (
          <div className="grid grid-cols-3 gap-2">
            {(['Self', 'Relationships', 'Faith'] as const).map((c) => (
              <button key={c} className="px-3 py-2 bg-gray-100 rounded text-sm hover:bg-gray-200" onClick={() => setStuckCategory(c)}>{c}</button>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-sm text-gray-600">Category: {stuckCategory}</div>
            <div className="space-y-2">
              {(
                stuckCategory === 'Self' ? [
                  'Stand up, sip water, one deep breath',
                  'Set a 5‑min timer and do the first tiny step',
                  'Write the next sentence only'
                ] : stuckCategory === 'Relationships' ? [
                  'Send a 1‑line check‑in to someone you care about',
                  'Draft the hard message; send a kind first line',
                  'Schedule a 10‑min call'
                ] : [
                  'Two‑minute quiet: “Here I am.”',
                  'Read one verse; pick one word to carry',
                  'Offer gratitude for one specific thing'
                ]
              ).map((s, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded text-sm">• {s}</div>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button className="px-3 py-2 text-sm" onClick={() => { onClose(); setStuckCategory(null); }}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StuckModal;

