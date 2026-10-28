import React, { useState } from 'react';
import {
  Clock,
  Video,
  Mic,
  Crosshair,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Filter
} from 'lucide-react';

export default function ForensicTimeline({
  timeline,
  discrepancies,
  onSynthesizeTimeline,
  isSynthesizing
}) {
  const [filter, setFilter] = useState('ALL');

  const filteredTimeline = timeline.filter((item) => {
    if (filter === 'ALL') return true;
    if (filter === 'CONTRADICTIONS') return item.status === 'CONTRADICTION_FLAGGED';
    if (filter === 'VISUAL') return item.sourceType === 'VISUAL' || item.sourceType === 'CROSS_MODAL_FUSED';
    if (filter === 'AUDIO') return item.sourceType === 'AUDIO' || item.sourceType === 'CROSS_MODAL_FUSED';
    return true;
  });

  const getSourceIcon = (type) => {
    switch (type) {
      case 'VISUAL':
        return <Video className="w-3.5 h-3.5 text-cyan-400" />;
      case 'AUDIO':
        return <Mic className="w-3.5 h-3.5 text-amber-400" />;
      case 'CROSS_MODAL_FUSED':
        return <Sparkles className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  return (
    <div className="tactical-card p-4 space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1e293b] pb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <h2 className="font-tactical font-bold text-sm text-white tracking-wider">
            UNIFIED MULTIMODAL FORENSIC TIMELINE (CHRONOLOGICAL)
          </h2>
          <span className="badge badge-cyan">{timeline.length} EVENTS</span>
        </div>

        {/* Filter and Synthesize Button */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-[#070c14] border border-[#1e293b] p-0.5 rounded text-xs font-mono">
            {['ALL', 'VISUAL', 'AUDIO', 'CONTRADICTIONS'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded transition ${
                  filter === f
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={onSynthesizeTimeline}
            disabled={isSynthesizing}
            className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSynthesizing ? 'animate-spin' : ''}`} />
            <span>{isSynthesizing ? 'SYNTHESIZING...' : 'AI MULTIMODAL FUSION'}</span>
          </button>
        </div>
      </div>

      {/* Discrepancies Alert Banner if any exist */}
      {discrepancies?.length > 0 && (
        <div className="bg-red-950/30 border border-red-500/40 rounded p-3 space-y-2">
          <div className="flex items-center gap-2 text-red-400 font-tactical font-bold text-xs uppercase">
            <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
            <span>Forensic Discrepancy & Witness Contradiction Detected ({discrepancies.length})</span>
          </div>
          {discrepancies.map((disc, idx) => (
            <div
              key={idx}
              className="bg-black/40 border border-red-900/50 rounded p-2.5 text-xs space-y-1 font-mono"
            >
              <div className="text-amber-300">
                <span className="text-red-400 font-bold">WITNESS CLAIM:</span> "{disc.claim}"
              </div>
              <div className="text-emerald-300">
                <span className="text-cyan-400 font-bold">VISUAL CAMERA REBUTTAL:</span> {disc.evidenceContradiction}
              </div>
              <div className="text-[10px] text-slate-400">
                CONFIDENCE: {(disc.confidence * 100).toFixed(1)}% // STATUS: {disc.severity || 'CRITICAL_CONTRADICTION'}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chronological Event Sequence */}
      <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-blue-500 before:to-emerald-500">
        {filteredTimeline.map((item, idx) => {
          const isContradiction = item.status === 'CONTRADICTION_FLAGGED';

          return (
            <div
              key={item.id || idx}
              className={`tactical-card p-3 relative transition border ${
                isContradiction
                  ? 'border-red-500/60 bg-red-950/20 hover:border-red-400'
                  : 'border-[#1e293b] hover:border-cyan-500/50'
              }`}
            >
              {/* Timeline Dot Marker */}
              <div
                className={`absolute -left-[27px] top-3.5 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                  isContradiction
                    ? 'border-red-500 bg-red-900'
                    : 'border-cyan-400 bg-slate-900'
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    isContradiction ? 'bg-red-400 animate-ping' : 'bg-cyan-400'
                  }`}
                />
              </div>

              {/* Event Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1e293b]/60 pb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                    {item.time}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                    {getSourceIcon(item.sourceType)}
                    <span>{item.sourceType}</span>
                  </div>
                  {isContradiction ? (
                    <span className="badge badge-red text-[9px]">CONTRADICTION FLAG</span>
                  ) : (
                    <span className="badge badge-green text-[9px]">VERIFIED</span>
                  )}
                </div>

                <div className="text-[10px] font-mono text-emerald-400 font-bold">
                  CONF: {(item.confidence * 100).toFixed(1)}%
                </div>
              </div>

              {/* Event Content */}
              <div className="pt-2 space-y-1">
                <h4 className="text-xs font-tactical font-bold text-white tracking-wide">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {item.narrative}
                </p>

                {item.corroboration && (
                  <div className="text-[10px] font-mono text-slate-400 pt-1 flex items-start gap-1">
                    <CheckCircle2 className="w-3 h-3 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-300">Cross-Modal Link:</strong> {item.corroboration}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
