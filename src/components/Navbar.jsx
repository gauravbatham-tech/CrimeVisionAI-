import React, { useEffect, useState } from 'react';
import { Cpu, Download, FolderPlus, KeyRound, Layers, Radio } from 'lucide-react';

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
      setUtcTime(new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="app-topbar">
      <div className="topbar-case">
        <div className="topbar-case-icon"><Layers aria-hidden="true" /></div>
        <div className="topbar-case-select">
          <div className="topbar-eyebrow">Investigation workspace</div>
          <select
            aria-label="Select active case"
            value={activeCase?.id || ''}
            onChange={(event) => onSelectCase(event.target.value)}
          >
            {cases.map((item) => (
              <option key={item.id} value={item.id}>
                {item.caseNumber || item.id} · {item.title}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          className="icon-button"
          onClick={onOpenNewCaseModal}
          aria-label="Create a new case"
          title="Create a new case"
        >
          <FolderPlus aria-hidden="true" />
        </button>
      </div>

      <div className="topbar-actions">
        <div className="system-status" title="Coordinated Universal Time">
          <Radio aria-hidden="true" size={14} />
          <span>{utcTime}</span>
        </div>
        <button type="button" className="button-secondary engine-button" onClick={onOpenApiKeyModal}>
          <Cpu aria-hidden="true" />
          <span>{hasApiKey ? 'AI connected' : 'Connect AI'}</span>
          <KeyRound aria-hidden="true" className="engine-key" />
        </button>
        <button type="button" className="button-primary" onClick={onExportPdf}>
          <Download aria-hidden="true" />
          <span>Export report</span>
        </button>
      </div>
    </header>
  );
}
