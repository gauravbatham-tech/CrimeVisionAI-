import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  ShieldAlert,
  FileSearch,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  CornerDownLeft
} from 'lucide-react';

export default function ForensicChatCopilot({
  activeCase,
  chatMessages,
  onSendMessage,
  isLoading,
  hasApiKey
}) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const sampleQuestions = [
    "Did the suspect in Cam 1 match the jacket described in the 911 call?",
    "What weapons were identified and where were they recovered?",
    "Explain the discrepancy in the witness's getaway vehicle description.",
    "Reconstruct the chronological timeline between 21:14 and 21:21 UTC."
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleSelectSample = (question) => {
    if (isLoading) return;
    onSendMessage(question);
  };

  return (
    <div className="tactical-card p-4 space-y-4 flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1e293b] pb-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-cyan-400" />
          <h3 className="font-tactical font-bold text-xs uppercase text-white tracking-wider">
            FORENSIC AI ASSISTANT // NATURAL LANGUAGE EVIDENCE COPILOT
          </h3>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-400">CONTEXT:</span>
          <span className="text-cyan-300 font-semibold">{activeCase?.caseNumber}</span>
          <span className="text-slate-500">({activeCase?.evidence?.length || 0} ITEMS INDEXED)</span>
        </div>
      </div>

      {/* Suggested Investigative Questions */}
      <div className="flex-shrink-0 space-y-1.5">
        <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-cyan-400" />
          <span>SUGGESTED INVESTIGATIVE QUERIES (CLICK TO ASK):</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectSample(q)}
              className="text-[11px] font-sans bg-[#0c1626] hover:bg-[#12223c] border border-[#1e293b] hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 px-2.5 py-1 rounded text-left transition cursor-pointer"
            >
              "{q}"
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1.5 bg-[#070c14] border border-[#1e293b] rounded p-3">
        {chatMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
            <FileSearch className="w-8 h-8 text-cyan-500/40" />
            <p className="font-tactical text-xs text-slate-400">
              FORENSIC AI COPILOT READY FOR EVIDENCE QUERIES
            </p>
            <p className="font-mono text-[11px] max-w-md text-slate-500">
              Ask any question regarding witness statements, camera timestamps, weapon classifications, or contradictions.
            </p>
          </div>
        ) : (
          chatMessages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={idx}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400 flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded p-3 space-y-2 text-xs font-sans ${
                    isUser
                      ? 'bg-cyan-950/40 border border-cyan-500/40 text-cyan-100'
                      : 'bg-[#0f172a] border border-[#1e293b] text-slate-200 shadow'
                  }`}
                >
                  {/* Sender Tag */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1 text-[10px] font-mono">
                    <span className={isUser ? 'text-cyan-300 font-bold' : 'text-slate-400 font-bold'}>
                      {isUser ? 'INVESTIGATOR' : 'CRIMEVISION AI COPILOT'}
                    </span>
                    <span className="text-slate-500">{msg.timestamp || 'Just now'}</span>
                  </div>

                  {/* Message Body */}
                  <div className="whitespace-pre-wrap leading-relaxed space-y-1">
                    {msg.content}
                  </div>

                  {/* Evidence Citations if available */}
                  {msg.citations?.length > 0 && (
                    <div className="pt-2 border-t border-slate-800 space-y-1">
                      <span className="text-[10px] font-mono text-cyan-400 font-bold block">
                        CITED EVIDENCE ITEMS:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {msg.citations.map((c, cIdx) => (
                          <span
                            key={cIdx}
                            className="badge badge-cyan text-[9px] cursor-pointer hover:bg-cyan-500/30"
                            title={c.title}
                          >
                            [{c.id}] {c.title.length > 20 ? c.title.substring(0, 20) + '...' : c.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Model Signature Badge */}
                  {!isUser && msg.modelUsed && (
                    <div className="text-[9px] font-mono text-slate-500 text-right pt-0.5">
                      Engine: {msg.modelUsed}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-7 h-7 rounded bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400 flex-shrink-0 animate-pulse">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-[#0f172a] border border-[#1e293b] rounded p-3 text-xs font-mono text-cyan-300 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
              <span>Querying multimodal evidence vector database...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSubmit} className="flex gap-2 flex-shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about this case (evidence, suspects, timeline, contradictions)..."
          className="flex-1 bg-[#070c14] border border-[#1e293b] focus:border-cyan-500 rounded px-3 py-2 text-xs font-sans text-slate-100 focus:outline-none transition"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="btn-primary text-xs px-4 flex items-center gap-1.5 disabled:opacity-50"
        >
          <span>SEND</span>
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
