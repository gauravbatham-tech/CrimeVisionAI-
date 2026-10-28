import React from 'react';
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Fingerprint,
  MapPin,
  Sparkles,
  Target,
  Users
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

  const cards = [
    { label: 'Evidence items', value: metrics.totalEvidenceItems, note: 'Across all media types', icon: FileText, tone: 'teal' },
    { label: 'Persons of interest', value: metrics.personsOfInterest, note: 'Profiles in this case', icon: Users, tone: 'green' },
    { label: 'Weapons identified', value: metrics.weaponsIdentified, note: 'Forensic matches', icon: Target, tone: 'red' },
    { label: 'Timeline events', value: metrics.timelineEvents, note: 'Correlated moments', icon: Clock3, tone: 'amber' },
    { label: 'Discrepancies', value: metrics.criticalDiscrepancies, note: 'Require investigator review', icon: AlertTriangle, tone: 'red' }
  ];

  const statusLabel = (activeCase.status || 'OPEN').replaceAll('_', ' ').toLowerCase();

  return (
    <section className="dashboard-stack" aria-label="Case overview">
      <div className="case-overview">
        <div className="case-overview-main">
          <div className="case-badges">
            <span className="badge badge-cyan">{activeCase.caseNumber || activeCase.id}</span>
            <span className="badge badge-amber">{activeCase.incidentType}</span>
            <span className="badge badge-green">{statusLabel}</span>
          </div>
          <h1 className="case-title">{activeCase.title}</h1>
          <div className="case-meta">
            <span><MapPin aria-hidden="true" />{activeCase.location}</span>
            <span><CalendarDays aria-hidden="true" />{activeCase.dateOccurred}</span>
            <span><Fingerprint aria-hidden="true" />Lead: {activeCase.leadInvestigator}</span>
          </div>
        </div>

        <div className="custody-seal">
          <div className="seal-heading">
            <CheckCircle2 aria-hidden="true" />
            <span>Chain of custody verified</span>
            <span className="seal-caption">SHA-256</span>
          </div>
          <span className="seal-hash">{activeCase.caseChainOfCustodyHash}</span>
        </div>
      </div>

      <div className="metric-grid" aria-label="Case metrics">
        {cards.map(({ label, value, note, icon: Icon, tone }) => (
          <article className={`metric-card tone-${tone}`} key={label}>
            <div className="metric-card-top">
              <span>{label}</span>
              <span className="metric-icon"><Icon aria-hidden="true" /></span>
            </div>
            <div className="metric-value">{value}</div>
            <div className="metric-note">{note}</div>
          </article>
        ))}
      </div>

      <div className="narrative-card">
        <div className="narrative-head"><Sparkles aria-hidden="true" />Case intelligence summary</div>
        <p className="narrative-copy">{activeCase.summary}</p>
      </div>
    </section>
  );
}
