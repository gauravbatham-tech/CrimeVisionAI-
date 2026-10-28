import React, { useState } from 'react';
import {
  Upload,
  X,
  FileCheck,
  AlertCircle,
  Camera,
  Video,
  Mic,
  Sparkles
} from 'lucide-react';

export default function EvidenceUploadModal({
  isOpen,
  onClose,
  onUpload,
  isUploading,
  activeCase
}) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('IMAGE');
  const [recoveryLocation, setRecoveryLocation] = useState('Crime Scene Perimeter');
  const [recoveredBy, setRecoveredBy] = useState('Forensic Tech Agent');
  const [description, setDescription] = useState('');
  const [audioTranscript, setAudioTranscript] = useState('');
  const [file, setFile] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onUpload({
      title,
      type,
      recoveryLocation,
      recoveredBy,
      description,
      audioTranscript,
      file
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-dialog tactical-card max-w-lg w-full p-5 space-y-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-cyan-400" />
            <h3 className="font-tactical font-bold text-sm text-white tracking-wider">
              INGEST NEW MULTIMODAL EVIDENCE
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-400 font-mono">
          Case: <span className="text-cyan-300 font-bold">{activeCase?.caseNumber}</span> // Auto SHA-256 Hashing & Generative AI Analysis enabled on ingest.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Evidence Type Selector */}
          <div>
            <label className="block text-[11px] font-mono text-slate-300 mb-1">
              EVIDENCE MODALITY TYPE:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'IMAGE', icon: Camera },
                { label: 'VIDEO', icon: Video },
                { label: 'AUDIO', icon: Mic }
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.label}
                    type="button"
                    onClick={() => setType(m.label)}
                    className={`py-2 px-3 rounded text-xs font-tactical font-semibold flex items-center justify-center gap-1.5 border transition ${
                      type === m.label
                        ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200'
                        : 'bg-[#0c1424] border-[#1e293b] text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-[11px] font-mono text-slate-300 mb-1">
              EVIDENCE TITLE / LABEL:
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. CCTV Cam 02 Hallway Footprint"
              className="w-full bg-[#070c14] border border-[#1e293b] focus:border-cyan-500 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none"
            />
          </div>

          {/* Location & Recovery Agent */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-mono text-slate-400 mb-1">
                RECOVERY LOCATION:
              </label>
              <input
                type="text"
                value={recoveryLocation}
                onChange={(e) => setRecoveryLocation(e.target.value)}
                placeholder="Locus description"
                className="w-full bg-[#070c14] border border-[#1e293b] rounded px-2.5 py-1 text-xs text-slate-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-400 mb-1">
                RECOVERED BY / AGENT:
              </label>
              <input
                type="text"
                value={recoveredBy}
                onChange={(e) => setRecoveredBy(e.target.value)}
                placeholder="Agent Name / Badge"
                className="w-full bg-[#070c14] border border-[#1e293b] rounded px-2.5 py-1 text-xs text-slate-100 focus:outline-none"
              />
            </div>
          </div>

          {/* Audio Transcript field if Audio */}
          {type === 'AUDIO' && (
            <div>
              <label className="block text-[10px] font-mono text-amber-400 mb-1">
                WITNESS / 911 AUDIO TRANSCRIPT:
              </label>
              <textarea
                rows={3}
                value={audioTranscript}
                onChange={(e) => setAudioTranscript(e.target.value)}
                placeholder="Paste or enter witness verbal transcript here..."
                className="w-full bg-[#070c14] border border-amber-500/40 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none font-mono"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-[10px] font-mono text-slate-400 mb-1">
              FIELD NOTES / PRELIMINARY OBSERVATIONS:
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contextual details for multimodal AI pipeline..."
              className="w-full bg-[#070c14] border border-[#1e293b] rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none"
            />
          </div>

          {/* File Upload Attachment */}
          <div>
            <label className="block text-[10px] font-mono text-slate-400 mb-1">
              ATTACH MEDIA FILE (OPTIONAL):
            </label>
            <input
              type="file"
              accept="image/*,video/*,audio/*"
              onChange={(e) => setFile(e.target.files[0] || null)}
              className="w-full text-xs text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border file:border-cyan-500/30 file:text-[10px] file:font-mono file:bg-cyan-950/60 file:text-cyan-300 hover:file:bg-cyan-900"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1e293b]">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-xs"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isUploading || !title.trim()}
              className="btn-primary text-xs flex items-center gap-1.5 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isUploading ? 'ANALYZING VIA GENAI...' : 'PROCESS & HASH EVIDENCE'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
