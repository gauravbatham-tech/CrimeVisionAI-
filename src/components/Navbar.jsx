import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Cpu,
  Key,
  FileDown,
  FolderPlus,
  Radio,
  Layers,
  ChevronDown
} from 'lucide-react';

export default function Navbar({
  cases,
  activeCase,
  onSelectCase,
  onOpenNewCaseModal,
  onOpenApiKeyModal,
  onExportPdf,
  hasApiKey
}) {
  const [utcTime, setUtcTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="tactical-border border-b border-[#1e293b] bg-[#090e18]/90 backdrop-blur sticky top-0 z-40 px-4 py-3 flex flex-wrap items-center justify-between gap-4">
      {/* Brand & Emblem */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
          <ShieldAlert className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-tactical font-bold text-lg tracking-wider text-white">
              CRIMEVISION <span className="text-cyan-400">AI</span>
            </span>
            <span className="badge badge-cyan text-[10px]">v2.6 FORENSIC</span>
          </div>
          <p className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            MULTIMODAL INTELLIGENCE PLATFORM // CJIS COMPLIANT
          </p>
        </div>
      </div>

      {/* Case Switcher & System Telemetry */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Case Dropdown */}
        <div className="flex items-center gap-2 bg-[#0d1626] border border-[#1e293b] rounded px-2.5 py-1.5">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-tactical text-slate-400 uppercase">Active Case:</span>
          <select
            value={activeCase?.id || ''}
            onChange={(e) => onSelectCase(e.target.value)}
            className="bg-transparent text-xs font-mono font-semibold text-cyan-300 focus:outline-none cursor-pointer pr-2"
          >
            {cases.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#0b1322] text-slate-200">
                [{c.caseNumber || c.id}] {c.title.length > 32 ? c.title.substring(0, 32) + '...' : c.title}
              </option>
            ))}
          </select>
          <button
            onClick={onOpenNewCaseModal}
            title="Create New Investigation Case"
            className="text-xs text-slate-400 hover:text-cyan-300 p-1 rounded hover:bg-slate-800 transition"
          >
            <FolderPlus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Live System Time */}
        <div className="hidden lg:flex items-center gap-2 bg-[#070c16] border border-[#1e293b] px-2.5 py-1.5 rounded font-mono text-[11px] text-slate-400">
          <Radio className="w-3 h-3 text-emerald-400" />
          <span>{utcTime}</span>
        </div>

        {/* GenAI Engine Status Badge */}
        <button
          onClick={onOpenApiKeyModal}
          title="Configure Google Gemini API Key"
          className="flex items-center gap-2 bg-[#0c1626] hover:bg-[#122038] border border-[#1e293b] hover:border-cyan-500/50 rounded px-2.5 py-1.5 transition text-left cursor-pointer"
        >
          <Cpu className={`w-3.5 h-3.5 ${hasApiKey ? 'text-emerald-400' : 'text-amber-400'}`} />
          <div className="text-[11px] font-mono leading-none">
            <span className="block text-[9px] text-slate-400">GENAI ENGINE</span>
            <span className={hasApiKey ? 'text-emerald-300 font-semibold' : 'text-amber-300 font-semibold'}>
              {hasApiKey ? 'Gemini 2.5 Flash (Live)' : 'Neural Engine (Local)'}
            </span>
          </div>
          <Key className="w-3 h-3 text-slate-500 hover:text-cyan-400 ml-1" />
        </button>

        {/* Export PDF Button */}
        <button
          onClick={onExportPdf}
          className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5 shadow-[0_0_10px_rgba(6,182,212,0.25)]"
        >
          <FileDown className="w-3.5 h-3.5" />
          <span>EXPORT FORENSIC PDF</span>
        </button>
      </div>
    </header>
  );
}
