import React from 'react';
import {
  Users,
  Crosshair,
  Wrench,
  Car,
  Shield,
  Activity,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function ActionAndEntityMatrix({ evidenceList }) {
  // Aggregate all detected entities across evidence
  const allEntities = [];
  const allActions = [];

  evidenceList.forEach((ev) => {
    if (ev.aiAnalysis?.detectedEntities) {
      ev.aiAnalysis.detectedEntities.forEach((ent) => {
        allEntities.push({
          ...ent,
          sourceEvidenceId: ev.evidenceNumber || ev.id,
          sourceTitle: ev.title
        });
      });
    }
    if (ev.aiAnalysis?.actionsDetected) {
      ev.aiAnalysis.actionsDetected.forEach((act) => {
        allActions.push({
          ...act,
          sourceEvidenceId: ev.evidenceNumber || ev.id,
          sourceTitle: ev.title
        });
      });
    }
  });

  const persons = allEntities.filter((e) => e.type === 'PERSON');
  const weapons = allEntities.filter((e) => e.type === 'WEAPON');
  const tools = allEntities.filter((e) => e.type === 'TOOL' || e.type === 'OBJECT');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Suspect & Person of Interest Dossier */}
      <div className="tactical-card p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-[#1e293b] pb-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <h3 className="font-tactical font-bold text-xs uppercase text-white tracking-wider">
              PERSON OF INTEREST (POI) DOSSIER
            </h3>
          </div>
          <span className="badge badge-cyan">{persons.length} DETECTED</span>
        </div>

        <div className="space-y-2.5">
          {persons.map((p, idx) => (
            <div
              key={idx}
              className="bg-[#0b1424] border border-[#1e293b] hover:border-cyan-500/50 rounded p-3 space-y-2 transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-cyan-300">
                  {p.label}
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-400">
                  MATCH CONFIDENCE: {(p.confidence * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans">
                {p.details}
              </p>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-[#1e293b]/50">
                <span>Ref: [{p.sourceEvidenceId}]</span>
                <span className="text-cyan-400/80">NEURAL RECOGNITION ACTIVE</span>
              </div>
            </div>
          ))}

          {persons.length === 0 && (
            <div className="text-slate-500 text-xs font-mono py-4 text-center">
              No suspect profiles detected.
            </div>
          )}
        </div>
      </div>

      {/* Weapons & Ballistic Intelligence */}
      <div className="tactical-card p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-[#1e293b] pb-2">
          <div className="flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-red-400" />
            <h3 className="font-tactical font-bold text-xs uppercase text-white tracking-wider">
              WEAPONS & BALLISTIC INTELLIGENCE
            </h3>
          </div>
          <span className="badge badge-red">{weapons.length} IDENTIFIED</span>
        </div>

        <div className="space-y-2.5">
          {weapons.map((w, idx) => (
            <div
              key={idx}
              className="bg-[#140f1a] border border-red-900/40 hover:border-red-500/50 rounded p-3 space-y-2 transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-red-400">
                  {w.label}
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-400">
                  CONFIDENCE: {(w.confidence * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans">
                {w.details}
              </p>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-[#1e293b]/50">
                <span>Source: [{w.sourceEvidenceId}]</span>
                <span className="text-red-400/80 font-bold">NIBIN CANDIDATE</span>
              </div>
            </div>
          ))}

          {weapons.length === 0 && (
            <div className="text-slate-500 text-xs font-mono py-4 text-center">
              No ballistic signatures identified in current evidence.
            </div>
          )}
        </div>
      </div>

      {/* Actions & Temporal Incursion Analysis */}
      <div className="lg:col-span-2 tactical-card p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-[#1e293b] pb-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h3 className="font-tactical font-bold text-xs uppercase text-white tracking-wider">
              NEURAL ACTION RECOGNITION & FORENSIC SIGNIFICANCE
            </h3>
          </div>
          <span className="badge badge-green">{allActions.length} ACTIONS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {allActions.map((act, idx) => (
            <div
              key={idx}
              className="bg-[#0b1422] border border-[#1e293b] rounded p-2.5 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-cyan-300">
                  {act.action}
                </span>
                <span className="text-[10px] font-mono text-emerald-400">
                  {(act.confidence * 100).toFixed(0)}% CONF
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans">
                {act.forensicSignificance}
              </p>
              <div className="text-[9px] font-mono text-slate-500">
                EVIDENCE SOURCE: [{act.sourceEvidenceId}]
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
