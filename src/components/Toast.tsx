import React from 'react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'info' | 'warning';
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success' }) => {
  if (!message) return null;

  return (
    <div className="fixed top-14 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 rounded-full bg-[#1c2028]/95 border border-[#4cd7f6]/40 text-[#dfe2ee] font-mono text-xs shadow-2xl flex items-center gap-2 backdrop-blur-xl animate-fade-in pointer-events-none">
      <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">
        {type === 'warning' ? 'warning' : 'check_circle'}
      </span>
      <span>{message}</span>
    </div>
  );
};
