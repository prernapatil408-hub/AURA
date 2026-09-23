import React, { useState } from 'react';

interface JoinWithCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (code: string) => void;
}

export const JoinWithCodeModal: React.FC<JoinWithCodeModalProps> = ({
  isOpen,
  onClose,
  onJoin
}) => {
  const [code, setCode] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      onJoin(code.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-sm bg-[#0e1420] border border-[#222e44] rounded-2xl shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-4 sm:p-5 border-b border-[#1e293b] flex items-center justify-between bg-[#111927]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0284c7]/20 text-[#38bdf8] flex items-center justify-center">
              <span className="material-symbols-outlined text-[19px]">keyboard</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#f8fafc]">Join with Code</h2>
              <p className="text-[11px] text-[#94a3b8]">Enter meeting code or link</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#1e293b]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#cbd5e1] mb-1.5">
              Meeting Code or URL
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. aurameet.ai/sync-44 or abc-defg-hij"
              className="w-full bg-[#0c111a] border border-[#1e293b] rounded-xl px-3.5 py-2.5 text-xs text-[#f8fafc] focus:outline-none focus:border-[#38bdf8]"
              autoFocus
              required
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#1e293b] hover:bg-[#283548] text-xs font-medium text-[#94a3b8]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!code.trim()}
              className="px-5 py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              Join Meeting
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
