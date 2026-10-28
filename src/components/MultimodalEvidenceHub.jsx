import React, { useState } from 'react';
import {
  Camera,
  Video,
  Mic,
  Maximize2,
  ShieldCheck,
  Tag,
  Crosshair,
  Activity,
  PlusCircle,
  Clock,
  Sparkles
} from 'lucide-react';

export default function MultimodalEvidenceHub({
  evidenceList,
  onOpenUploadModal,
  activeCaseId
}) {
  const [selectedId, setSelectedId] = useState(evidenceList[0]?.id || null);
  const [filterType, setFilterType] = useState('ALL');
  const [highlightEntity, setHighlightEntity] = useState(null);

  const activeEvidence = evidenceList.find((e) => e.id === selectedId) || evidenceList[0];

  const filteredEvidence = evidenceList.filter((e) => {
    if (filterType === 'ALL') return true;
    return e.type === filterType;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'VIDEO':
        return <Video className="w-3.5 h-3.5 text-cyan-400" />;
      case 'AUDIO':
        return <Mic className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <Camera className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  return (
    <div className="tactical-card p-4 space-y-4">
      {/* Top Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1e293b] pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h2 className="font-tactical font-bold text-sm text-white tracking-wider">
            MULTIMODAL EVIDENCE REPOSITORY & NEURAL INSPECTION
          </h2>
          <span className="badge badge-cyan">{evidenceList.length} ITEMS</span>
        </div>

        {/* Filter Pills & Add Button */}
        <div className="flex items-center gap-2">
          <div className="flex bg-[#070c14] border border-[#1e293b] p-0.5 rounded text-xs font-mono">
            {['ALL', 'IMAGE', 'VIDEO', 'AUDIO'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 rounded transition ${
                  filterType === type
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenUploadModal}
            className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>INGEST EVIDENCE</span>
          </button>
        </div>
      </div>

      {/* Main Evidence Explorer: Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Evidence Item Selector Carousel/List (4 cols) */}
        <div className="lg:col-span-4 space-y-2 max-h-[540px] overflow-y-auto pr-1">
          {filteredEvidence.map((ev) => {
            const isSelected = ev.id === activeEvidence?.id;
            return (
              <div
                key={ev.id}
                onClick={() => setSelectedId(ev.id)}
                className={`p-3 rounded border cursor-pointer transition flex items-start gap-3 ${
                  isSelected
                    ? 'bg-[#122038] border-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                    : 'bg-[#090f1a] border-[#1e293b] hover:border-slate-600 hover:bg-[#0d1626]'
                }`}
              >
                {/* Thumbnail Preview */}
                <div className="w-16 h-14 rounded bg-slate-900 border border-slate-700 overflow-hidden flex-shrink-0 flex items-center justify-center relative">
                  {ev.mediaUrl ? (
                    <img
                      src={ev.mediaUrl}
                      alt={ev.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getTypeIcon(ev.type)
                  )}
                  <span className="absolute bottom-0 right-0 p-0.5 bg-black/80 rounded-tl">
                    {getTypeIcon(ev.type)}
                  </span>
                </div>

                {/* Meta details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">
                      {ev.evidenceNumber || ev.id}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">
                      {ev.timestamp ? ev.timestamp.substring(11, 19) : ''}
                    </span>
                  </div>
                  <h3 className="text-xs font-semibold text-slate-100 truncate mt-0.5">
                    {ev.title}
                  </h3>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5 font-mono">
                    Loc: {ev.recoveryLocation || 'Scene Perimeter'}
                  </p>
                  {ev.aiAnalysis?.detectedEntities?.length > 0 && (
                    <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                      {ev.aiAnalysis.detectedEntities.slice(0, 2).map((ent, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] font-mono px-1 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60"
                        >
                          {ent.label.length > 16 ? ent.label.substring(0, 16) + '...' : ent.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Deep Multimodal Inspection Stage (8 cols) */}
        {activeEvidence ? (
          <div className="lg:col-span-8 bg-[#090f1a] border border-[#1e293b] rounded p-4 space-y-4">
            {/* Stage Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1e293b] pb-2">
              <div className="flex items-center gap-2">
                <span className="badge badge-cyan">{activeEvidence.evidenceNumber || activeEvidence.id}</span>
                <h3 className="text-sm font-tactical font-bold text-white">
                  {activeEvidence.title}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  {activeEvidence.timestamp}
                </span>
                <span className="badge badge-green flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  CUSTODY SECURED
                </span>
              </div>
            </div>

            {/* Media Presentation Display */}
            <div className="relative rounded overflow-hidden border border-slate-700 bg-black max-h-[380px] flex items-center justify-center">
              {activeEvidence.mediaUrl ? (
                <img
                  src={activeEvidence.mediaUrl}
                  alt={activeEvidence.title}
                  className="w-full h-auto max-h-[380px] object-contain"
                />
              ) : (
                <div className="py-24 text-center text-slate-500 font-mono text-xs">
                  NO VISUAL MEDIA AVAILABLE
                </div>
              )}

              {/* Bounding Box Overlay for highlighted entity */}
              {highlightEntity && highlightEntity.box2d && (
                <div
                  className="absolute border-2 border-cyan-400 bg-cyan-400/20 pointer-events-none transition-all duration-300 z-10"
                  style={{
                    top: `${highlightEntity.box2d[0] / 10}%`,
                    left: `${highlightEntity.box2d[1] / 10}%`,
                    height: `${(highlightEntity.box2d[2] - highlightEntity.box2d[0]) / 10}%`,
                    width: `${(highlightEntity.box2d[3] - highlightEntity.box2d[1]) / 10}%`
                  }}
                >
                  <div className="absolute -top-6 left-0 bg-cyan-600 text-white font-mono text-[10px] px-1.5 py-0.5 rounded shadow">
                    {highlightEntity.label} [{(highlightEntity.confidence * 100).toFixed(0)}%]
                  </div>
                </div>
              )}
            </div>

            {/* Audio Transcript Viewer if Audio Evidence */}
            {activeEvidence.audioTranscript && (
              <div className="bg-[#0e1726] border border-amber-500/30 rounded p-3 space-y-1">
                <div className="flex items-center justify-between text-xs font-tactical font-bold text-amber-400">
                  <span className="flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5" />
                    AI ACOUSTIC TRANSCRIPTION & EMOTIONAL TELEMETRY
                  </span>
                  <span className="badge badge-amber text-[10px]">VERIFIED 48kHz PCM</span>
                </div>
                <p className="text-xs text-slate-200 italic font-mono bg-black/40 p-2.5 rounded border border-slate-800">
                  "{activeEvidence.audioTranscript}"
                </p>
              </div>
            )}

            {/* Generative AI Scene Findings */}
            <div className="bg-[#0b1424] border border-[#1e293b] rounded p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-tactical font-bold text-cyan-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  MULTIMODAL GENERATIVE AI SCENE DESCRIPTION
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {activeEvidence.aiAnalysis?.source || 'CRIMEVISION_NEURAL_PIPELINE'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {activeEvidence.aiAnalysis?.sceneDescription || activeEvidence.description || 'Scene analyzed by CrimeVision neural engine.'}
              </p>
            </div>

            {/* Detected Entities Bar */}
            {activeEvidence.aiAnalysis?.detectedEntities?.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-xs font-tactical text-slate-400 uppercase tracking-wide flex items-center justify-between">
                  <span>Detected Entities & Tactical Signatures (Hover to Inspect):</span>
                  <span className="text-[10px] font-mono text-cyan-400">
                    {activeEvidence.aiAnalysis.detectedEntities.length} CLASSIFIED
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {activeEvidence.aiAnalysis.detectedEntities.map((ent, idx) => (
                    <div
                      key={idx}
                      onMouseEnter={() => setHighlightEntity(ent)}
                      onMouseLeave={() => setHighlightEntity(null)}
                      className="p-2 rounded bg-[#0b1422] border border-[#1e293b] hover:border-cyan-400 transition cursor-crosshair flex items-start justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <Tag className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                          <span className="text-xs font-bold text-slate-100 truncate">
                            {ent.label}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5 font-mono">
                          {ent.details}
                        </p>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-emerald-400 flex-shrink-0">
                        {(ent.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cryptographic SHA-256 Hash Bar */}
            <div className="bg-[#070c14] border border-[#1e293b] rounded p-2 text-[10px] font-mono flex items-center justify-between flex-wrap gap-2 text-slate-400">
              <span className="flex items-center gap-1 text-slate-300">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                SHA-256 HASH:
              </span>
              <span className="text-emerald-400 select-all font-mono">
                {activeEvidence.sha256}
              </span>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 p-12 text-center text-slate-500 font-mono">
            No evidence selected.
          </div>
        )}
      </div>
    </div>
  );
}
