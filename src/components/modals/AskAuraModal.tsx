import React, { useState, useRef, useEffect } from 'react';
import { ASK_AURA_SUGGESTIONS, CopilotMessage, INITIAL_COPILOT_MESSAGES } from '../../data/mockData';

interface AskAuraModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'warning') => void;
}

export const AskAuraModal: React.FC<AskAuraModalProps> = ({
  isOpen,
  onClose,
  initialPrompt,
  onShowToast
}) => {
  const [messages, setMessages] = useState<CopilotMessage[]>(INITIAL_COPILOT_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPrompt) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = (text?: string) => {
    const query = (text || inputValue).trim();
    if (!query) return;

    const userMessage: CopilotMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: query
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      const qLower = query.toLowerCase();

      if (qLower.includes('decision')) {
        reply = 'Key decisions agreed upon: 1) Approved Raft-based distributed quorum for regional nodes. 2) Scheduled deployment staging sign-off for Friday 5:00 PM. 3) Adopted partitioned hash ring architecture for horizontal database scaling.';
      } else if (qLower.includes('action') || qLower.includes('todo')) {
        reply = 'Your top action items: 1) Alex M. to verify fallback node configuration by Friday noon. 2) Prerna to review automated rollback policies in staging. 3) Run stress test with 10M synthetic records.';
      } else if (qLower.includes('summarize') || qLower.includes('summary')) {
        reply = 'Summary: The engineering leads aligned on multi-region replication parameters with a 120ms failover timeout. Database query latencies improved by 40% in staging tests. Production release is greenlighted for Friday.';
      } else if (qLower.includes('follow up') || qLower.includes('followup')) {
        reply = 'Recommended follow-ups: Reach out to Dr. Sarah Chen regarding the final staging benchmark results, and verify that the security rotation checklist is signed off before Thursday evening.';
      } else {
        reply = `Based on your recent meetings, the team has reached consensus on the core architecture and scheduled the release for Friday afternoon. Aura is continuously syncing meeting notes.`;
      }

      const botMessage: CopilotMessage = {
        id: 'aura-' + Date.now(),
        sender: 'aura',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: reply,
        actions: ['Copy to Notes', 'Share']
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-xl bg-[#0e1420] border border-[#222e44] rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[600px] max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 border-b border-[#1e293b] flex items-center justify-between bg-[#111927]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0284c7] to-[#8b5cf6] flex items-center justify-center text-white shadow-sm">
              <span className="material-symbols-outlined text-[19px]">neurology</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-[#f8fafc]">Ask Aura</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/20">
                  Meeting Assistant
                </span>
              </div>
              <p className="text-[11px] text-[#94a3b8]">
                Ask questions across all your meetings, decisions & action items
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#1e293b] transition-all"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 bg-[#0c111a] border-b border-[#1e293b] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {ASK_AURA_SUGGESTIONS.map((sug, i) => (
            <button
              key={i}
              onClick={() => handleSend(sug)}
              className="px-3 py-1 rounded-full text-xs font-medium bg-[#141c2b] text-[#cbd5e1] hover:text-[#38bdf8] hover:bg-[#1c273c] border border-[#223049] transition-all shrink-0 active:scale-95"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#0e1420]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#0284c7] text-white rounded-tr-xs'
                    : 'bg-[#141d2e] border border-[#223049] text-[#e2e8f0] rounded-tl-xs shadow-sm'
                }`}
              >
                {msg.sender === 'aura' && (
                  <div className="flex items-center gap-1.5 mb-1.5 text-[11px] font-semibold text-[#38bdf8]">
                    <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                    <span>Aura Assistant</span>
                  </div>
                )}
                <p>{msg.text}</p>

                {msg.actions && (
                  <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center gap-2">
                    {msg.actions.map((act) => (
                      <button
                        key={act}
                        onClick={() => onShowToast(`Action saved: ${act}`)}
                        className="px-2 py-0.5 rounded bg-black/20 hover:bg-black/40 text-[10px] text-[#cbd5e1] transition-all"
                      >
                        {act}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-[#64748b] mt-1 px-1">{msg.time}</span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-[#38bdf8] bg-[#141d2e] p-3 rounded-2xl w-fit border border-[#223049]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] text-[#94a3b8] ml-1">Aura is reading meeting notes...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-[#1e293b] bg-[#111927]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 bg-[#0c111a] border border-[#1e293b] rounded-xl px-3 py-1.5 focus-within:border-[#38bdf8] transition-all"
          >
            <span className="material-symbols-outlined text-[18px] text-[#64748b]">chat</span>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Aura about decisions, notes, action items..."
              className="flex-1 bg-transparent text-xs text-[#f8fafc] placeholder:text-[#64748b] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                inputValue.trim()
                  ? 'bg-[#0284c7] hover:bg-[#0369a1] text-white cursor-pointer'
                  : 'bg-[#1e293b] text-[#64748b] cursor-not-allowed'
              }`}
            >
              <span>Ask</span>
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
