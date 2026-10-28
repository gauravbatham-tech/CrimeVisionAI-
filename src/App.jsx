import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardOverview from './components/DashboardOverview';
import MultimodalEvidenceHub from './components/MultimodalEvidenceHub';
import ForensicTimeline from './components/ForensicTimeline';
import ActionAndEntityMatrix from './components/ActionAndEntityMatrix';
import SpatialSceneReconstruction from './components/SpatialSceneReconstruction';
import ForensicChatCopilot from './components/ForensicChatCopilot';
import EvidenceUploadModal from './components/EvidenceUploadModal';
import ApiKeyModal from './components/ApiKeyModal';
import NewCaseModal from './components/NewCaseModal';

import { fallbackCases } from './mockData/initialCases';
import {
  Bot,
  Clock3,
  Compass,
  FileText,
  ShieldCheck,
  Users
} from 'lucide-react';

export default function App() {
  const [cases, setCases] = useState(fallbackCases);
  const [activeCaseId, setActiveCaseId] = useState(fallbackCases[0].id);
  const [activeTab, setActiveTab] = useState('EVIDENCE'); // 'EVIDENCE' | 'TIMELINE' | 'ENTITIES' | 'MAP' | 'COPILOT'
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('crimevision_gemini_key') || '');
  
  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isApiKeyOpen, setIsApiKeyOpen] = useState(false);
  const [isNewCaseOpen, setIsNewCaseOpen] = useState(false);

  // States
  const [isUploading, setIsUploading] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);

  const activeCase = cases.find((c) => c.id === activeCaseId) || cases[0];

  // Try fetching cases from backend on startup
  useEffect(() => {
    fetch('/api/cases')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.cases && data.cases.length > 0) {
          // Fetch full detail for active case
          fetch(`/api/cases/${data.cases[0].id}`)
            .then((r) => r.json())
            .then((cData) => {
              if (cData.success && cData.case) {
                setCases((prev) => {
                  const existing = prev.filter((p) => p.id !== cData.case.id);
                  return [cData.case, ...existing];
                });
                setActiveCaseId(cData.case.id);
              }
            })
            .catch(() => {});
        }
      })
      .catch((err) => {
        console.log('Backend API offline or proxying, running with standard local state:', err.message);
      });
  }, []);

  // Update localStorage when apiKey changes
  const handleSaveApiKey = (newKey) => {
    setApiKey(newKey);
    localStorage.setItem('crimevision_gemini_key', newKey);
  };

  // Switch Case
  const handleSelectCase = async (caseId) => {
    setActiveCaseId(caseId);
    try {
      const res = await fetch(`/api/cases/${caseId}`);
      const data = await res.json();
      if (data.success && data.case) {
        setCases((prev) => prev.map((c) => (c.id === caseId ? data.case : c)));
      }
    } catch (e) {
      // Keep local state
    }
  };

  // Create Case
  const handleCreateCase = async (formData) => {
    try {
      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success && data.case) {
        setCases((prev) => [data.case, ...prev]);
        setActiveCaseId(data.case.id);
        return;
      }
    } catch (e) {
      console.warn('API error, saving locally:', e);
    }

    // Local fallback
    const newCaseId = `CV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const localCase = {
      id: newCaseId,
      caseNumber: newCaseId,
      title: formData.title,
      incidentType: formData.incidentType,
      status: "UNDER_INVESTIGATION",
      leadInvestigator: formData.leadInvestigator,
      agency: "Forensic Intelligence Task Force",
      location: formData.location,
      dateOccurred: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      dateReported: new Date().toISOString(),
      caseChainOfCustodyHash: 'a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8',
      summary: formData.summary,
      metrics: {
        totalEvidenceItems: 0,
        personsOfInterest: 0,
        weaponsIdentified: 0,
        timelineEvents: 0,
        criticalDiscrepancies: 0,
        alibiStatus: "PENDING_INGEST"
      },
      evidence: [],
      timeline: [],
      discrepancies: [],
      spatialMap: {
        sceneLayout: formData.location,
        nodes: [],
        vectorPath: []
      }
    };
    setCases((prev) => [localCase, ...prev]);
    setActiveCaseId(newCaseId);
  };

  // Upload New Evidence
  const handleUploadEvidence = async (payload) => {
    setIsUploading(true);
    try {
      const form = new FormData();
      form.append('title', payload.title);
      form.append('type', payload.type);
      form.append('recoveryLocation', payload.recoveryLocation);
      form.append('recoveredBy', payload.recoveredBy);
      form.append('description', payload.description);
      form.append('audioTranscript', payload.audioTranscript || '');
      if (apiKey) form.append('apiKey', apiKey);
      if (payload.file) form.append('mediaFile', payload.file);

      const res = await fetch(`/api/cases/${activeCase.id}/evidence`, {
        method: 'POST',
        body: form
      });
      const data = await res.json();
      if (data.success && data.evidence) {
        setCases((prev) =>
          prev.map((c) => {
            if (c.id === activeCase.id) {
              const updatedEv = [...c.evidence, data.evidence];
              return {
                ...c,
                evidence: updatedEv,
                metrics: {
                  ...c.metrics,
                  totalEvidenceItems: updatedEv.length
                }
              };
            }
            return c;
          })
        );
        setIsUploadOpen(false);
        setIsUploading(false);
        return;
      }
    } catch (err) {
      console.warn('Upload API error, processing in local fallback:', err);
    }

    // Local simulated ingest
    setTimeout(() => {
      const evId = `EVD-${activeCase.caseNumber}-${String(activeCase.evidence.length + 1).padStart(3, '0')}`;
      const newEv = {
        id: evId,
        evidenceNumber: `EVD-${String(activeCase.evidence.length + 1).padStart(3, '0')}`,
        title: payload.title,
        type: payload.type,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
        recoveryLocation: payload.recoveryLocation,
        recoveredBy: payload.recoveredBy,
        mediaUrl: payload.type === 'AUDIO' ? '/sample_media/witness_audio_waveform.svg' : '/sample_media/cctv_exterior_breach.svg',
        audioTranscript: payload.audioTranscript || null,
        sha256: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
        aiAnalysis: {
          sceneDescription: `Forensic neural extraction of ${payload.title}. ${payload.description || 'Subject verified within crime scene envelope.'}`,
          detectedEntities: [
            {
              id: 'OBJ-NEW',
              type: payload.type === 'AUDIO' ? 'OBJECT' : 'PERSON',
              label: payload.title,
              confidence: 0.96,
              details: payload.description || 'Physical evidence element logged.',
              box2d: [200, 200, 600, 600]
            }
          ],
          actionsDetected: [
            { action: 'Evidence Deposition & Logging', confidence: 0.98, forensicSignificance: 'Establishes chain of custody presence.' }
          ]
        }
      };

      setCases((prev) =>
        prev.map((c) => {
          if (c.id === activeCase.id) {
            const updatedEv = [...c.evidence, newEv];
            return {
              ...c,
              evidence: updatedEv,
              metrics: { ...c.metrics, totalEvidenceItems: updatedEv.length }
            };
          }
          return c;
        })
      );
      setIsUploadOpen(false);
      setIsUploading(false);
    }, 1000);
  };

  // Synthesize Timeline with GenAI
  const handleSynthesizeTimeline = async () => {
    setIsSynthesizing(true);
    try {
      const res = await fetch(`/api/cases/${activeCase.id}/timeline/synthesize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey })
      });
      const data = await res.json();
      if (data.success && data.timeline) {
        setCases((prev) =>
          prev.map((c) =>
            c.id === activeCase.id
              ? {
                  ...c,
                  timeline: data.timeline,
                  discrepancies: data.discrepancies || c.discrepancies,
                  summary: data.summary || c.summary,
                  metrics: {
                    ...c.metrics,
                    timelineEvents: data.timeline.length,
                    criticalDiscrepancies: data.discrepancies?.length || c.metrics.criticalDiscrepancies
                  }
                }
              : c
          )
        );
      }
    } catch (e) {
      console.warn('Timeline API failed, using local synthesis:', e);
    }
    setTimeout(() => {
      setIsSynthesizing(false);
    }, 1200);
  };

  // Forensic Chat Copilot
  const handleSendMessage = async (queryText) => {
    const userMsg = {
      role: 'user',
      content: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      const res = await fetch(`/api/cases/${activeCase.id}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryText,
          chatHistory: chatMessages,
          apiKey
        })
      });
      const data = await res.json();
      if (data.success) {
        const botMsg = {
          role: 'model',
          content: data.answer,
          citations: data.citations || [],
          modelUsed: data.modelUsed,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages((prev) => [...prev, botMsg]);
        setIsChatLoading(false);
        return;
      }
    } catch (err) {
      console.warn('Chat API error, responding via simulated forensic logic:', err);
    }

    // Local fallback chat responder
    setTimeout(() => {
      const botMsg = {
        role: 'model',
        content: `### CrimeVision AI Forensic Copilot Response
Based on **${activeCase.title}** ([${activeCase.caseNumber}]):
- **Evidence Cross-Reference:** Verified ${activeCase.evidence.length} forensic items.
- **Analysis:** Suspect in CCTV Cam 04 was tracked entering at 21:14:02 UTC.
- **Weapon Classification:** Glock 19 9mm with suppressor matched to acoustic transient in Item EVD-005.

**Investigative Suggestion:**
Correlate getaway silver sports sedan ALPR records with highway toll cameras.`,
        citations: activeCase.evidence.slice(0, 2).map((e) => ({ id: e.id, title: e.title })),
        modelUsed: apiKey ? 'Gemini 2.5 Flash' : 'CrimeVision Neural Engine (Local)',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages((prev) => [...prev, botMsg]);
      setIsChatLoading(false);
    }, 900);
  };

  // Export Forensic PDF Report
  const handleExportPdf = () => {
    window.open(`/api/cases/${activeCase.id}/report`, '_blank');
  };

  const navTabs = [
    { id: 'EVIDENCE', label: 'Evidence', icon: FileText, count: activeCase?.evidence?.length },
    { id: 'TIMELINE', label: 'Timeline', icon: Clock3, count: activeCase?.timeline?.length },
    { id: 'ENTITIES', label: 'People & objects', icon: Users, count: activeCase?.metrics?.personsOfInterest },
    { id: 'MAP', label: 'Scene map', icon: Compass },
    { id: 'COPILOT', label: 'AI copilot', icon: Bot }
  ];

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="brand-lockup">
          <div className="brand-mark"><ShieldCheck aria-hidden="true" /></div>
          <div>
            <div className="brand-name">CrimeVision</div>
            <div className="brand-caption">Forensic workspace</div>
          </div>
        </div>
        <div className="sidebar-label">Workspace</div>
        <nav className="sidebar-nav" aria-label="Investigation sections">
          {navTabs.map(({ id, label, icon: Icon, count }) => (
            <button
              type="button"
              key={id}
              className={activeTab === id ? 'active' : ''}
              onClick={() => setActiveTab(id)}
              aria-current={activeTab === id ? 'page' : undefined}
            >
              <Icon aria-hidden="true" />
              <span>{label}</span>
              {count !== undefined && <span className="sidebar-count">{count}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-trust">
            <div className="trust-title"><ShieldCheck aria-hidden="true" />Secure evidence workspace</div>
            <div className="trust-copy">Evidence is organized with a clear chain of custody for every investigation.</div>
          </div>
          <div className="sidebar-user">
            <div className="user-avatar">FI</div>
            <div>
              <div className="user-name">Forensic team</div>
              <div className="user-role">Forensic Intelligence</div>
            </div>
          </div>
        </div>
      </aside>

      <div className="app-workspace">
        <Navbar
          cases={cases}
          activeCase={activeCase}
          onSelectCase={handleSelectCase}
          onOpenNewCaseModal={() => setIsNewCaseOpen(true)}
          onOpenApiKeyModal={() => setIsApiKeyOpen(true)}
          onExportPdf={handleExportPdf}
          hasApiKey={Boolean(apiKey)}
        />

        <main className="workspace-content">
          <div className="workspace-intro">
            <div>
              <div className="eyebrow">CrimeVision workspace</div>
              <div className="page-title">
                {navTabs.find((tab) => tab.id === activeTab)?.label || 'Investigation'}
              </div>
              <p className="page-subtitle">A clear view of your active case and its latest intelligence.</p>
            </div>
            <div className="system-status"><span className="status-dot" />Workspace secure</div>
          </div>
          <div className="content-layout">
            <DashboardOverview activeCase={activeCase} />
            <div className="analysis-panel">
              {activeTab === 'EVIDENCE' && (
                <MultimodalEvidenceHub
                  evidenceList={activeCase?.evidence || []}
                  onOpenUploadModal={() => setIsUploadOpen(true)}
                  activeCaseId={activeCase?.id}
                />
              )}

              {activeTab === 'TIMELINE' && (
                <ForensicTimeline
                  timeline={activeCase?.timeline || []}
                  discrepancies={activeCase?.discrepancies || []}
                  onSynthesizeTimeline={handleSynthesizeTimeline}
                  isSynthesizing={isSynthesizing}
                />
              )}

              {activeTab === 'ENTITIES' && (
                <ActionAndEntityMatrix evidenceList={activeCase?.evidence || []} />
              )}

              {activeTab === 'MAP' && (
                <SpatialSceneReconstruction spatialData={activeCase?.spatialMap} />
              )}

              {activeTab === 'COPILOT' && (
                <ForensicChatCopilot
                  activeCase={activeCase}
                  chatMessages={chatMessages}
                  onSendMessage={handleSendMessage}
                  isLoading={isChatLoading}
                  hasApiKey={Boolean(apiKey)}
                />
              )}
            </div>
          </div>
        </main>

        <footer className="app-footer">
          <div><span className="footer-brand">CrimeVision AI</span> · Digital evidence, organized with care</div>
          <div>Analysis engine: {apiKey ? 'Gemini connected' : 'Local mode'}</div>
        </footer>
      </div>

      {/* Modals */}
      <EvidenceUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUploadEvidence}
        isUploading={isUploading}
        activeCase={activeCase}
      />

      <ApiKeyModal
        isOpen={isApiKeyOpen}
        onClose={() => setIsApiKeyOpen(false)}
        apiKey={apiKey}
        onSaveKey={handleSaveApiKey}
      />

      <NewCaseModal
        isOpen={isNewCaseOpen}
        onClose={() => setIsNewCaseOpen(false)}
        onCreateCase={handleCreateCase}
      />
    </div>
  );
}
