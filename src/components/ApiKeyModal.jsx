import React, { useState } from 'react';
import { Key, X, CheckCircle2, AlertCircle, Cpu, ExternalLink } from 'lucide-react';

export default function ApiKeyModal({
  isOpen,
  onClose,
  apiKey,
  onSaveKey
}) {
  const [keyInput, setKeyInput] = useState(apiKey || '');
  const [status, setStatus] = useState(null); // 'checking' | 'valid' | 'invalid'
  const [statusMsg, setStatusMsg] = useState('');

  if (!isOpen) return null;

  const handleTestKey = async () => {
    if (!keyInput.trim()) {
      setStatus('invalid');
      setStatusMsg('Please enter an API key');
      return;
    }

    setStatus('checking');
    setStatusMsg('Testing connection to Google Gemini 2.5 Flash...');

    try {
      const res = await fetch('/api/settings/verify-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: keyInput.trim() })
      });
      const data = await res.json();
      if (data.valid) {
        setStatus('valid');
        setStatusMsg('Gemini 2.5 Flash connection verified successfully!');
      } else {
        setStatus('invalid');
        setStatusMsg(data.error || 'Invalid API key or network error');
      }
    } catch (err) {
      setStatus('invalid');
      setStatusMsg('Verification request failed: ' + err.message);
    }
  };

  const handleSave = () => {
    onSaveKey(keyInput.trim());
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-dialog tactical-card max-w-md w-full p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-cyan-400" />
            <h3 className="font-tactical font-bold text-sm text-white tracking-wider">
              GOOGLE GEMINI GENAI CONFIGURATION
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          CrimeVision AI integrates with Google Gemini multimodal models (<code className="text-cyan-300 font-mono">gemini-2.5-flash</code>) for real-time visual scene analysis, video action extraction, audio transcript synthesis, and conversational Q&A.
        </p>

        <div className="space-y-2">
          <label className="block text-[11px] font-mono text-slate-300">
            GOOGLE GEMINI API KEY:
          </label>
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full bg-[#070c14] border border-[#1e293b] focus:border-cyan-500 rounded px-3 py-1.5 text-xs font-mono text-cyan-300 focus:outline-none"
          />
          <div className="text-[10px] text-slate-400 flex items-center justify-between">
            <span>Stored locally in browser session</span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:underline flex items-center gap-1"
            >
              Get Gemini API Key <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>

        {status && (
          <div
            className={`p-2.5 rounded text-xs font-mono flex items-start gap-2 ${
              status === 'valid'
                ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
                : status === 'checking'
                ? 'bg-cyan-950/40 border border-cyan-500/40 text-cyan-300'
                : 'bg-red-950/40 border border-red-500/40 text-red-300'
            }`}
          >
            {status === 'valid' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : status === 'checking' ? (
              <Cpu className="w-4 h-4 text-cyan-400 flex-shrink-0 animate-spin mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            )}
            <span>{statusMsg}</span>
          </div>
        )}

        <div className="bg-[#0b1424] p-2.5 rounded border border-[#1e293b] text-[11px] text-slate-400 font-mono">
          <span className="text-amber-400 font-bold block mb-0.5">LOCAL NEURAL ENGINE NOTE:</span>
          If no API key is provided, CrimeVision AI automatically utilizes its built-in simulated neural inference engine, allowing complete platform demonstration without external network dependencies.
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#1e293b]">
          <button
            type="button"
            onClick={handleTestKey}
            disabled={status === 'checking'}
            className="btn-secondary text-xs"
          >
            TEST KEY
          </button>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="btn-secondary text-xs">
              CANCEL
            </button>
            <button type="button" onClick={handleSave} className="btn-primary text-xs">
              SAVE & APPLY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
