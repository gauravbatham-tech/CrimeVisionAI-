import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

import {
  analyzeMultimodalEvidence,
  synthesizeMultimodalTimeline,
  queryForensicChat,
  analyzeAudioTranscript,
  getGeminiClient
} from './services/geminiService.js';

import {
  forensicStore,
  calculateFileHash
} from './services/forensicEngine.js';

import { generateForensicReport } from './services/reportGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static directories
const uploadsDir = path.join(__dirname, 'data/uploads');
const sampleMediaDir = path.join(__dirname, 'data/sample_media');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(sampleMediaDir)) fs.mkdirSync(sampleMediaDir, { recursive: true });

app.use('/uploads', express.static(uploadsDir));
app.use('/sample_media', express.static(sampleMediaDir));

// Multer storage for uploaded evidence
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `evd_${Date.now()}_${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, uniqueName);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

// ================= API ROUTES =================

// 1. Get all cases
app.get('/api/cases', (req, res) => {
  try {
    const cases = forensicStore.getAllCases();
    res.json({ success: true, cases });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Get specific case by ID
app.get('/api/cases/:id', (req, res) => {
  try {
    const caseData = forensicStore.getCaseById(req.params.id);
    if (!caseData) return res.status(404).json({ success: false, error: 'Case not found' });
    res.json({ success: true, case: caseData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Create a new case
app.post('/api/cases', (req, res) => {
  try {
    const newCase = forensicStore.createCase(req.body);
    res.status(201).json({ success: true, case: newCase });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Ingest new Multimodal Evidence with Generative AI analysis
app.post('/api/cases/:id/evidence', upload.single('mediaFile'), async (req, res) => {
  try {
    const { id } = req.params;
    const caseData = forensicStore.getCaseById(id);
    if (!caseData) return res.status(404).json({ success: false, error: 'Case not found' });

    const {
      title,
      type = 'IMAGE',
      recoveryLocation = 'Crime Scene Perimeter',
      recoveredBy = 'Investigating Forensic Tech',
      timestamp = new Date().toISOString(),
      description = '',
      audioTranscript = '',
      apiKey = null
    } = req.body;

    let mediaUrl = '';
    let fileBuffer = null;
    let mimeType = 'image/jpeg';
    let fileHash = '';

    if (req.file) {
      mediaUrl = `/uploads/${req.file.filename}`;
      fileBuffer = fs.readFileSync(req.file.path);
      mimeType = req.file.mimetype;
      fileHash = calculateFileHash(fileBuffer);
    } else {
      // Mock / direct transcript upload
      fileHash = calculateFileHash(Buffer.from(title + description + Date.now()));
      mediaUrl = type === 'AUDIO' ? '/sample_media/witness_audio_waveform.svg' : '/sample_media/cctv_exterior_breach.svg';
    }

    // Run Generative AI Multimodal Scene & Entity Analysis
    let aiAnalysis = null;
    if (type === 'AUDIO' && audioTranscript) {
      aiAnalysis = await analyzeAudioTranscript({
        transcript: audioTranscript,
        apiKey
      });
      // Map to standard schema
      aiAnalysis = {
        sceneDescription: `Acoustic analysis of audio stream: ${audioTranscript.slice(0, 150)}...`,
        detectedEntities: aiAnalysis.acousticEvents?.map((evt, idx) => ({
          id: `ACOUSTIC-${idx + 1}`,
          type: 'OBJECT',
          label: evt.event,
          confidence: evt.confidence || 0.95,
          details: `Time: ${evt.estimatedTime}`,
          box2d: [100, 100, 300, 300]
        })) || [],
        actionsDetected: [
          { action: "Audio Speech & Acoustic Sound Capture", confidence: 0.98, forensicSignificance: "Temporal timeline marker" }
        ],
        forensicAnomalies: [`Speaker urgency: ${aiAnalysis.speakerEmotionalUrgency || 'Normal'}`],
        investigativeLeads: aiAnalysis.keyStatements || []
      };
    } else {
      aiAnalysis = await analyzeMultimodalEvidence({
        fileBuffer,
        mimeType,
        evidenceType: type,
        title,
        description,
        apiKey
      });
    }

    const evidenceId = `EVD-${caseData.caseNumber}-${String(caseData.evidence.length + 1).padStart(3, '0')}`;
    const evidenceItem = {
      id: evidenceId,
      evidenceNumber: `EVD-${String(caseData.evidence.length + 1).padStart(3, '0')}`,
      title: title || `Evidence Item #${caseData.evidence.length + 1}`,
      type: type.toUpperCase(),
      mimeType,
      mediaUrl,
      timestamp,
      recoveryLocation,
      recoveredBy,
      sha256: fileHash,
      audioTranscript: audioTranscript || null,
      chainOfCustody: [
        { time: new Date().toISOString(), agent: recoveredBy, action: "Evidence logged and hashed into CrimeVision AI" }
      ],
      aiAnalysis
    };

    forensicStore.addEvidence(id, evidenceItem);
    res.status(201).json({ success: true, evidence: evidenceItem, case: caseData });
  } catch (err) {
    console.error('Evidence upload error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Synthesize Multimodal Timeline with Generative AI
app.post('/api/cases/:id/timeline/synthesize', async (req, res) => {
  try {
    const { id } = req.params;
    const { apiKey = null } = req.body;
    const caseData = forensicStore.getCaseById(id);
    if (!caseData) return res.status(404).json({ success: false, error: 'Case not found' });

    const synthesis = await synthesizeMultimodalTimeline(caseData, apiKey);

    // Update case timeline and discrepancies
    if (synthesis.reconstructedTimeline) {
      forensicStore.updateTimeline(id, synthesis.reconstructedTimeline, synthesis.discrepancies);
    }

    res.json({
      success: true,
      timeline: caseData.timeline,
      discrepancies: caseData.discrepancies,
      summary: synthesis.executiveReconstructionSummary
    });
  } catch (err) {
    console.error('Timeline synthesis error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Persistent AI Forensic Assistant Chat (RAG)
app.post('/api/cases/:id/chat', async (req, res) => {
  try {
    const { id } = req.params;
    const { query, chatHistory = [], apiKey = null } = req.body;
    const caseData = forensicStore.getCaseById(id);
    if (!caseData) return res.status(404).json({ success: false, error: 'Case not found' });

    if (!query || !query.trim()) {
      return res.status(400).json({ success: false, error: 'Query is required' });
    }

    const chatResponse = await queryForensicChat({
      query,
      caseData,
      chatHistory,
      apiKey
    });

    res.json({
      success: true,
      answer: chatResponse.answer,
      citations: chatResponse.citations,
      modelUsed: chatResponse.modelUsed
    });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Court-Admissible Forensic PDF Report Generation
app.get('/api/cases/:id/report', (req, res) => {
  try {
    const { id } = req.params;
    const caseData = forensicStore.getCaseById(id);
    if (!caseData) return res.status(404).json({ success: false, error: 'Case not found' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=CrimeVision_${caseData.caseNumber}_Forensic_Report.pdf`);

    generateForensicReport(caseData, res);
  } catch (err) {
    console.error('Report generation error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. Verify Gemini API Key
app.post('/api/settings/verify-key', async (req, res) => {
  try {
    const { apiKey } = req.body;
    if (!apiKey) return res.status(400).json({ valid: false, error: 'API key is required' });

    const ai = getGeminiClient(apiKey);
    if (!ai) return res.json({ valid: false, error: 'Invalid client initialization' });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: 'Respond with the word "VALID" only.' }] }]
    });

    if (response.text && response.text.toUpperCase().includes('VALID')) {
      return res.json({ valid: true, message: 'Gemini 2.5 Flash API connection verified successfully' });
    } else {
      return res.json({ valid: true, message: 'Connected to Gemini API' });
    }
  } catch (err) {
    res.json({ valid: false, error: err.message });
  }
});

// Fallback to static frontend when built
const distDir = path.join(__dirname, '../dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.use((req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`[CrimeVision AI] Forensic Backend Engine running on http://localhost:${PORT}`);
  console.log(`[CrimeVision AI] Multi-Modal Intelligence Pipelines Online.`);
});
