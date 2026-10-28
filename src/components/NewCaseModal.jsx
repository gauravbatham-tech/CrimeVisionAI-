import React, { useState } from 'react';
import { FolderPlus, X, Shield, MapPin, User, FileText } from 'lucide-react';

export default function NewCaseModal({ isOpen, onClose, onCreateCase }) {
  const [title, setTitle] = useState('');
  const [incidentType, setIncidentType] = useState('Commercial Burglary / Forced Incursion');
  const [location, setLocation] = useState('');
  const [leadInvestigator, setLeadInvestigator] = useState('Det. Lead Investigator');
  const [summary, setSummary] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreateCase({
      title,
      incidentType,
      location: location || 'Location Unspecified',
      leadInvestigator: leadInvestigator || 'Lead Detective',
      summary: summary || 'New digital forensic investigation created.'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="tactical-card max-w-lg w-full p-5 space-y-4 border border-cyan-500/40 bg-[#0a101d]">
        <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-4 h-4 text-cyan-400" />
            <h3 className="font-tactical font-bold text-sm text-white tracking-wider">
              INITIALIZE NEW FORENSIC CASE FILE
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-mono text-slate-300 mb-1">
              CASE TITLE / OPERATION CODENAME:
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Metro Armored Transit Breach"
              className="w-full bg-[#070c14] border border-[#1e293b] focus:border-cyan-500 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-mono text-slate-400 mb-1">
                INCIDENT CLASSIFICATION:
              </label>
              <input
                type="text"
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value)}
                className="w-full bg-[#070c14] border border-[#1e293b] rounded px-2.5 py-1 text-xs text-slate-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-400 mb-1">
                LEAD DETECTIVE / AGENT:
              </label>
              <input
                type="text"
                value={leadInvestigator}
                onChange={(e) => setLeadInvestigator(e.target.value)}
                className="w-full bg-[#070c14] border border-[#1e293b] rounded px-2.5 py-1 text-xs text-slate-100 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-slate-400 mb-1">
              PRIMARY INCIDENT SCENE LOCATION:
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. 104 Industrial Parkway, Gate 4"
              className="w-full bg-[#070c14] border border-[#1e293b] rounded px-2.5 py-1 text-xs text-slate-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono text-slate-400 mb-1">
              PRELIMINARY INCIDENT SUMMARY:
            </label>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief summary of events to prime the multimodal neural engine..."
              className="w-full bg-[#070c14] border border-[#1e293b] rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1e293b]">
            <button type="button" onClick={onClose} className="btn-secondary text-xs">
              CANCEL
            </button>
            <button type="submit" className="btn-primary text-xs">
              CREATE CASE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
