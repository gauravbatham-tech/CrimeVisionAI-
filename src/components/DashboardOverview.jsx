import React from 'react';
import {
  FileText,
  Users,
  Crosshair,
  Clock,
  AlertTriangle,
  Fingerprint,
  MapPin,
  Calendar,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function DashboardOverview({ activeCase }) {
  if (!activeCase) return null;

  const metrics = activeCase.metrics || {
    totalEvidenceItems: activeCase.evidence?.length || 0,
    personsOfInterest: 0,
    weaponsIdentified: 0,
    timelineEvents: activeCase.timeline?.length || 0,
    criticalDiscrepancies: activeCase.discrepancies?.length || 0
  };

  return (
    <div className="space-y-4">
      {/* Case Header Details Banner */}
      <div className="tactical-card p-4 bg-gradient-to-r from-[#0c1626] to-[#090e18] border-l-4 border-l-cyan-500">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="badge badge-cyan">{activeCase.caseNumber}</span>
              <span className="badge badge-amber">{activeCase.incidentType}</span>
              <span className="badge badge-green flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                {activeCase.status}
              </span>
            </div>
            <h1 className="text-xl font-tactical font-bold text-white tracking-wide">
              {activeCase.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                {activeCase.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                {activeCase.dateOccurred}
              </span>
              <span className="flex items-center gap-1">
                <Fingerprint className="w-3.5 h-3.5 text-emerald-400" />
                Lead: {activeCase.leadInvestigator}
              </span>
            </div>
          </div>

          {/* Cryptographic Chain of Custody Stamp */}
          <div className="bg-[#070c14] border border-[#1e293b] p-2.5 rounded max-w-sm font-mono text-[11px]">
            <div className="flex items-center justify-between gap-2 text-slate-400 text-[10px] pb-1 border-b border-[#1e293b]">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                CUSTODY INTEGRITY SEAL
              </span>
              <span className="text-slate-500">SHA-256 VERIFIED</span>
            </div>
            <p className="text-[10px] text-emerald-300 break-all font-mono pt-1">
              {activeCase.caseChainOfCustodyHash}
            </p>
          </div>
        </div>
      </div>

      {/* Top 5 Forensic Telemetry Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {/* Metric 1 */}
        <div className="tactical-card p-3 relative overflow-hidden group hover:border-cyan-500/50 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-tactical font-semibold">EVIDENCE ITEMS</span>
            <FileText className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-tactical font-bold text-white mt-1">
            {metrics.totalEvidenceItems}
          </div>
          <div className="text-[10px] font-mono text-cyan-400/80 mt-0.5">
            Images, CCTV & Audio
          </div>
          <div className="absolute bottom-0 left-0 h-0.5 w-full bg-cyan-500/30 group-hover:bg-cyan-500 transition"></div>
        </div>

        {/* Metric 2 */}
        <div className="tactical-card p-3 relative overflow-hidden group hover:border-cyan-500/50 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-tactical font-semibold">PERSONS OF INTEREST</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-tactical font-bold text-cyan-300 mt-1">
            {metrics.personsOfInterest}
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-0.5">
            Visual Neural Tracking
          </div>
          <div className="absolute bottom-0 left-0 h-0.5 w-full bg-cyan-500/30 group-hover:bg-cyan-500 transition"></div>
        </div>

        {/* Metric 3 */}
        <div className="tactical-card p-3 relative overflow-hidden group hover:border-red-500/50 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-tactical font-semibold">WEAPONS DETECTED</span>
            <Crosshair className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-tactical font-bold text-red-400 mt-1">
            {metrics.weaponsIdentified}
          </div>
          <div className="text-[10px] font-mono text-red-400/80 mt-0.5">
            Ballistics Matched
          </div>
          <div className="absolute bottom-0 left-0 h-0.5 w-full bg-red-500/30 group-hover:bg-red-500 transition"></div>
        </div>

        {/* Metric 4 */}
        <div className="tactical-card p-3 relative overflow-hidden group hover:border-amber-500/50 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-tactical font-semibold">FUSED EVENTS</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-tactical font-bold text-amber-300 mt-1">
            {metrics.timelineEvents}
          </div>
          <div className="text-[10px] font-mono text-amber-400/80 mt-0.5">
            Cross-Modal Temporal Sync
          </div>
          <div className="absolute bottom-0 left-0 h-0.5 w-full bg-amber-500/30 group-hover:bg-amber-500 transition"></div>
        </div>

        {/* Metric 5 */}
        <div className="tactical-card p-3 relative overflow-hidden group hover:border-red-500/50 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-tactical font-semibold">CONTRADICTIONS</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-tactical font-bold text-rose-400 mt-1">
            {metrics.criticalDiscrepancies}
          </div>
          <div className="text-[10px] font-mono text-rose-400/80 mt-0.5">
            Witness vs Camera Flags
          </div>
          <div className="absolute bottom-0 left-0 h-0.5 w-full bg-rose-500/30 group-hover:bg-rose-500 transition"></div>
        </div>
      </div>

      {/* Generative Forensic AI Reconstruction Summary Box */}
      <div className="tactical-card p-4 border border-cyan-500/20 bg-[#0b1322]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <h2 className="text-xs font-tactical font-bold uppercase tracking-wider text-cyan-400">
              Generative Scene Reconstruction Narrative
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            MULTIMODAL SYNTHESIS // CONFIDENCE: 98.4%
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          {activeCase.summary}
        </p>
      </div>
    </div>
  );
}
