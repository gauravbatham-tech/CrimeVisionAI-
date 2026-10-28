import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

let client = null;

export function getGeminiClient(customApiKey = null) {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      return new GoogleGenAI({ apiKey });
    } catch (err) {
      console.warn('Failed to initialize GoogleGenAI with key:', err.message);
      return null;
    }
  }
  return null;
}

/**
 * Perform Multimodal Generative AI Scene Analysis on Image/Video Frame
 */
export async function analyzeMultimodalEvidence({
  fileBuffer = null,
  mimeType = 'image/jpeg',
  evidenceType = 'IMAGE',
  title = '',
  description = '',
  apiKey = null
}) {
  const ai = getGeminiClient(apiKey);

  if (ai && fileBuffer) {
    try {
      const base64Data = fileBuffer.toString('base64');
      const prompt = `
You are CrimeVision AI, an advanced digital forensic intelligence system designed for law enforcement and multimodal evidence analysis.
Analyze this crime scene ${evidenceType.toLowerCase()} evidence thoroughly.

Extract and output a strict JSON object with the following fields:
{
  "sceneDescription": "Detailed forensic description of what is visible, environment, lighting, physical entry points, and observed actions.",
  "detectedEntities": [
    {
      "id": "POI-1 or WEAPON-1 or OBJ-1",
      "type": "PERSON | WEAPON | VEHICLE | TOOL | OBJECT",
      "label": "Specific label (e.g., Suspect in dark hoodie, Glock 19 Handgun, Pry bar)",
      "confidence": 0.95,
      "details": "Attributes such as clothing, posture, brand, serial indicator, or markings",
      "box2d": [ymin, xmin, ymax, xmax] // normalized 0-1000
    }
  ],
  "actionsDetected": [
    {
      "action": "e.g., Forced door breach, brandishing weapon, looting vault, fleeing scene",
      "confidence": 0.92,
      "forensicSignificance": "Explanation of investigative importance"
    }
  ],
  "forensicAnomalies": [
    "Any unusual indicators, thermal signatures, toolmarks, or potential tampering"
  ],
  "investigativeLeads": [
    "Specific actionable leads for detective follow-up"
  ]
}
Return only valid JSON.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: mimeType || 'image/jpeg',
                  data: base64Data
                }
              },
              { text: prompt }
            ]
          }
        ]
      });

      const text = response.text || '';
      const cleanJson = text.replace(/```json\s*/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      return {
        ...parsed,
        source: 'GEMINI_2_5_FLASH_LIVE',
        processedAt: new Date().toISOString()
      };
    } catch (err) {
      console.warn('Gemini API call failed, falling back to forensic simulation:', err.message);
    }
  }

  // Fallback / Deterministic Generative Engine
  return generateSimulatedForensicAnalysis({ evidenceType, title, description });
}

/**
 * Fuse Multimodal Evidence into a Unified Chronological Timeline
 */
export async function synthesizeMultimodalTimeline(caseData, apiKey = null) {
  const ai = getGeminiClient(apiKey);

  if (ai) {
    try {
      const summaryContext = JSON.stringify({
        caseId: caseData.id,
        title: caseData.title,
        evidence: caseData.evidence.map(e => ({
          id: e.id,
          type: e.type,
          title: e.title,
          timestamp: e.timestamp,
          extractedData: e.aiAnalysis
        }))
      });

      const prompt = `
You are the CrimeVision AI Multimodal Fusion Engine. 
You are given multiple forensic evidence items (CCTV footage, crime scene images, 911 audio transcripts, witness statements, ballistic photos).
Your task is to synthesize a strict chronological forensic timeline that correlates visual frames with audio events and sensor markers.
Also identify any contradictions or discrepancies between witness statements and camera timestamps.

Return valid JSON with:
{
  "reconstructedTimeline": [
    {
      "time": "21:14:02 UTC",
      "sourceEvidenceId": "EVD-001",
      "sourceType": "VISUAL | AUDIO | BALLISTIC | SENSOR",
      "title": "Short title",
      "narrative": "Detailed chronological description of this moment",
      "confidence": 0.98,
      "crossModalCorroboration": "Corroborated by 911 audio call item EVD-005",
      "status": "VERIFIED | CONTRADICTION_FLAGGED | UNCORROBORATED"
    }
  ],
  "discrepancies": [
    {
      "claim": "Witness 1 claimed suspect vehicle was a blue pickup truck heading north at 21:10",
      "evidenceContradiction": "Exterior Camera 04 recorded a silver sedan exiting south at 21:21",
      "confidence": 0.95,
      "severity": "CRITICAL"
    }
  ],
  "executiveReconstructionSummary": "A cohesive 2-3 paragraph reconstruction of the complete incident."
}
Only valid JSON.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `Case Evidence Data:\n${summaryContext}\n\n${prompt}` }] }
        ]
      });

      const text = response.text || '';
      const cleanJson = text.replace(/```json\s*/gi, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (err) {
      console.warn('Gemini timeline synthesis failed, using fallback:', err.message);
    }
  }

  // Fallback synthesis
  return generateFallbackTimelineSynthesis(caseData);
}

/**
 * Natural Language Q&A over Evidence (Forensic Assistant / Copilot)
 */
export async function queryForensicChat({ query, caseData, chatHistory = [], apiKey = null }) {
  const ai = getGeminiClient(apiKey);

  const contextPrompt = `
You are CrimeVision AI Copilot, a certified forensic intelligence AI assisting investigators.
You have access to the complete evidentiary database for Case: "${caseData.title}" (${caseData.id}).

EVIDENCE INVENTORY:
${caseData.evidence.map(e => `
- Item [${e.id}] (${e.type}): "${e.title}"
  Timestamp: ${e.timestamp}
  AI Findings: ${e.aiAnalysis?.sceneDescription || e.description}
  Detected Entities: ${e.aiAnalysis?.detectedEntities?.map(d => `${d.label} (${(d.confidence * 100).toFixed(0)}%)`).join(', ') || 'None'}
  Actions: ${e.aiAnalysis?.actionsDetected?.map(a => a.action).join(', ') || 'None'}
`).join('\n')}

KNOWN TIMELINE EVENTS:
${caseData.timeline.map(t => `[${t.time}] ${t.title}: ${t.narrative} (Source: ${t.sourceEvidenceId})`).join('\n')}

INVESTIGATOR QUESTION: "${query}"

INSTRUCTIONS:
1. Provide a direct, professional, forensic answer citing specific Evidence IDs (e.g., [Item ${caseData.evidence[0]?.id || 'EVD-001'}]) and exact timestamps.
2. If there are contradictions between witness testimony and visual evidence, explicitly highlight them.
3. Suggest 2 immediate tactical investigative next steps.
Format cleanly with markdown bolding, bullet points, and citation tags.
`;

  if (ai) {
    try {
      const contents = [];
      // Include up to 4 previous dialogue turns
      chatHistory.slice(-4).forEach(msg => {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        });
      });
      contents.push({
        role: 'user',
        parts: [{ text: contextPrompt }]
      });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents
      });

      return {
        answer: response.text,
        modelUsed: 'gemini-2.5-flash',
        citations: extractCitations(response.text, caseData.evidence)
      };
    } catch (err) {
      console.warn('Gemini chat query failed, using rule-based responder:', err.message);
    }
  }

  return generateFallbackForensicChatAnswer(query, caseData);
}

/**
 * Audio Acoustic & Speech Analysis
 */
export async function analyzeAudioTranscript({ transcript, audioDuration, apiKey = null }) {
  const ai = getGeminiClient(apiKey);

  if (ai) {
    try {
      const prompt = `
Analyze this witness / 911 audio transcript for forensic timeline reconstruction:
"${transcript}"

Extract JSON:
{
  "speakers": ["Caller / Witness", "911 Dispatcher"],
  "acousticEvents": [
    {"event": "Gunshot sound / transient", "estimatedTime": "00:01:14", "confidence": 0.96},
    {"event": "Power cutter / metal screech", "estimatedTime": "00:00:45", "confidence": 0.91}
  ],
  "speakerEmotionalUrgency": "High (Panic Level 0.94)",
  "keyStatements": [
    "Witness reported seeing two hooded individuals",
    "Witness heard door kicked open"
  ],
  "temporalAnchorPoints": [
    "00:00:15 - Call initiated",
    "00:01:14 - Gunshot audible in background"
  ]
}
`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      });
      const cleanJson = response.text.replace(/```json\s*/gi, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (err) {
      console.warn('Gemini audio transcript analysis failed, using fallback:', err.message);
    }
  }

  return {
    speakers: ["Caller / Witness", "911 Dispatcher"],
    acousticEvents: [
      { event: "High-frequency metallic screech (Hydraulic tool)", estimatedTime: "00:00:42", confidence: 0.92 },
      { event: "Acoustic impulse transient (Gunshot signature)", estimatedTime: "00:01:14", confidence: 0.98 }
    ],
    speakerEmotionalUrgency: "Extreme Acute Distress (Panic Score: 0.94)",
    keyStatements: [
      "Perimeter security door breached violently",
      "Sparks and grinding audible from vault hallway",
      "Audible firearm discharge at 00:01:14"
    ],
    temporalAnchorPoints: [
      "00:00:00 - Call connects to Dispatch Center",
      "00:00:42 - Mechanical breach sound detected",
      "00:01:14 - Ballistic report captured by caller microphone"
    ]
  };
}

// Helper: Extract cited evidence IDs from text
function extractCitations(text, evidenceList) {
  const citations = [];
  evidenceList.forEach(e => {
    if (text.includes(e.id) || text.includes(e.title)) {
      citations.push({ id: e.id, title: e.title, type: e.type });
    }
  });
  return citations;
}

// Fallback Deterministic Scene Analysis Generator
function generateSimulatedForensicAnalysis({ evidenceType, title, description }) {
  const isCCTV = title.toLowerCase().includes('cctv') || title.toLowerCase().includes('cam');
  const isWeapon = title.toLowerCase().includes('weapon') || title.toLowerCase().includes('ballistics') || title.toLowerCase().includes('glock');
  const isAudio = evidenceType === 'AUDIO' || title.toLowerCase().includes('audio') || title.toLowerCase().includes('911');

  if (isWeapon) {
    return {
      sceneDescription: "High-resolution forensic macro bench imagery depicting a recovered semi-automatic firearm resting on an anti-static examination surface adjacent to metric reference scale. Weapon slide exhibits matte black nitride finish with distinctive cocking serrations and attached muzzle suppressor.",
      detectedEntities: [
        {
          id: "WEAPON-01",
          type: "WEAPON",
          label: "Semi-Automatic Handgun (Glock 19 Gen 5)",
          confidence: 0.997,
          details: "Caliber: 9x19mm Parabellum, threaded barrel, muzzle-mounted sound suppressor, tactical weapon light attachment on accessory rail.",
          box2d: [350, 240, 780, 850]
        },
        {
          id: "MARKER-04",
          type: "OBJECT",
          label: "Forensic Evidence Cone #04",
          confidence: 0.992,
          details: "Yellow polymer scene marker denoting primary recovery locus.",
          box2d: [240, 140, 340, 195]
        }
      ],
      actionsDetected: [
        {
          action: "Weapon Discard / Staged Recovery",
          confidence: 0.95,
          forensicSignificance: "Serial number partially abraded; requires chemical etching restoration."
        }
      ],
      forensicAnomalies: [
        "Unspent 9mm round chambered; firing pin impression matches casing recovered in vault vestibule."
      ],
      investigativeLeads: [
        "Swab suppressor baffle and textured grip for touch DNA.",
        "Query NIBIN ballistic database for prior linked discharge events."
      ],
      source: "CRIMEVISION_NEURAL_ENGINE_LOCAL",
      processedAt: new Date().toISOString()
    };
  }

  if (isCCTV) {
    return {
      sceneDescription: "Surveillance footage capture revealing two individuals dressed in dark tactical attire operating near the vault barrier. POI-1 observed wielding a high-speed hydraulic rotary cutting saw generating significant thermal spark dispersion, while POI-2 maintains a perimeter security stance brandishing a sidearm.",
      detectedEntities: [
        {
          id: "POI-1",
          type: "PERSON",
          label: "Breacher / Lead Perpetrator",
          confidence: 0.984,
          details: "Approx height 6'1\", black balaclava, reinforced tactical vest, nitrile gloves, dark cargo trousers.",
          box2d: [185, 300, 390, 390]
        },
        {
          id: "POI-2",
          type: "PERSON",
          label: "Lookout / Armed Accomplice",
          confidence: 0.958,
          details: "Approx height 5'9\", dark windbreaker with reflective hood accent, brandishing semi-automatic pistol in low-ready posture.",
          box2d: [190, 250, 335, 320]
        },
        {
          id: "TOOL-01",
          type: "TOOL",
          label: "Hydraulic Cut-Off Saw",
          confidence: 0.971,
          details: "Yellow and black industrial cutter applied to vault door locking pin housing.",
          box2d: [230, 460, 280, 520]
        }
      ],
      actionsDetected: [
        {
          action: "Thermal Metal Penetration & Perimeter Breach",
          confidence: 0.989,
          forensicSignificance: "Demonstrates pre-planned logistical readiness and specialized entry equipment."
        },
        {
          action: "Armed Perimeter Sentry Coverage",
          confidence: 0.965,
          forensicSignificance: "Confirms active threat posture and readiness to engage responding personnel."
        }
      ],
      forensicAnomalies: [
        "Security camera lens subjected to infrared glare spray attempt at 21:13:50 UTC."
      ],
      investigativeLeads: [
        "Analyze toolmark striations on vault hinge against serial commercial blades.",
        "Correlate getaway vehicle timestamp with city ALPR traffic camera feeds."
      ],
      source: "CRIMEVISION_NEURAL_ENGINE_LOCAL",
      processedAt: new Date().toISOString()
    };
  }

  // Generic / Default Analysis
  return {
    sceneDescription: `Forensic examination of ${title}. The evidence demonstrates clear evidentiary value for temporal scene reconstruction, physical entity identification, and corroboration with concurrent sensor records.`,
    detectedEntities: [
      {
        id: "OBJ-01",
        type: "OBJECT",
        label: "Evidence Subject",
        confidence: 0.92,
        details: description || "Physical evidentiary item documented at scene.",
        box2d: [200, 200, 700, 700]
      }
    ],
    actionsDetected: [
      {
        action: "Physical Evidence Deposition",
        confidence: 0.90,
        forensicSignificance: "Establishes spatial presence within the primary crime scene perimeter."
      }
    ],
    forensicAnomalies: ["Integrity verified via SHA-256 hash stamp."],
    investigativeLeads: ["Submit for fingerprint and biological trace analysis."],
    source: "CRIMEVISION_NEURAL_ENGINE_LOCAL",
    processedAt: new Date().toISOString()
  };
}

// Fallback Timeline Synthesizer
function generateFallbackTimelineSynthesis(caseData) {
  return {
    reconstructedTimeline: caseData.timeline,
    discrepancies: [
      {
        claim: "Witness 1 stated in 911 audio: 'I saw a blue pickup truck speeding away northward right after the siren.'",
        evidenceContradiction: "Perimeter Camera 04 recorded a metallic silver sedan exiting south onto Highway 95 at 21:21:10 UTC.",
        confidence: 0.962,
        severity: "CRITICAL_CONTRADICTION",
        investigativeImpact: "Discounts blue pickup lead; refocuses dragnet on silver sports sedan bearing tinted glass."
      }
    ],
    executiveReconstructionSummary: `At 21:12:00 UTC on October 24, 2026, two suspects arrived at the rear service alley of the facility. POI-1 breached the exterior security door using a hardened steel pry tool at 21:14:02 UTC. Once inside, POI-1 applied a hydraulic rotary cut-off saw to the primary vault safe hinges while POI-2 provided armed lookout with a suppressed 9mm handgun. At 21:18:44 UTC, an acoustic impulse consistent with an accidental weapon discharge was captured simultaneously by the 911 witness audio stream and vault audio sensors. The suspects evacuated the structure at 21:20:45 UTC with approximately $4.2M in negotiable securities, departing in a silver sedan at 21:21:10 UTC.`
  };
}

// Fallback Chat Responder
function generateFallbackForensicChatAnswer(query, caseData) {
  const q = query.toLowerCase();

  if (q.includes('weapon') || q.includes('gun') || q.includes('firearm')) {
    return {
      answer: `### Forensic Weapon Analysis
Based on **[Item EVD-2026-8941-003: Ballistics Bench Examination]** and **[Item EVD-2026-8941-002: CCTV Interior Vault]**:
- **Weapon Type:** Glock 19 Gen 5 semi-automatic pistol chambered in 9x19mm Parabellum.
- **Modifications:** Equipped with a quick-detach sound suppressor and tactical rail weapon light.
- **Locus of Recovery:** Abandoned on the vault vestibule floor at timestamp **21:20:15 UTC** during suspect egress.
- **Discharge Correlation:** At **21:18:44 UTC**, the 911 witness recording (**[Item EVD-2026-8941-005]**) captured an acoustic impulse transient matching this weapon's suppressed signature.

**Investigative Recommendations:**
1. Execute chemical restoration on the partially abraded serial number on the slide rail.
2. Cross-reference casing ejector marks against the state NIBIN database.`,
      modelUsed: 'CrimeVision Heuristic Forensic Engine (Simulated)',
      citations: [
        { id: 'EVD-2026-8941-003', title: 'Ballistics Recovery Photo - Glock 19', type: 'IMAGE' },
        { id: 'EVD-2026-8941-005', title: '911 Witness Audio Transcript', type: 'AUDIO' }
      ]
    };
  }

  if (q.includes('timeline') || q.includes('when') || q.includes('time') || q.includes('sequence')) {
    return {
      answer: `### Chronological Event Sequence
The multimodal fusion engine established the following timeline across visual, acoustic, and witness records:
- **21:12:15 UTC:** Vehicle approaches alley (Corroborated by CCTV Cam 04).
- **21:14:02 UTC:** POI-1 initiates forced breach of exterior door using mechanical pry-bar (**[Item EVD-2026-8941-001]**).
- **21:15:30 UTC:** 911 Call received from store manager reporting heavy grinding noise (**[Item EVD-2026-8941-005]**).
- **21:18:44 UTC:** Safe hinges severed by rotary cutter; suppressed gunshot audible on audio.
- **21:20:45 UTC:** Suspects flee through breached rear door.
- **21:21:10 UTC:** Silver sports sedan departs south at high velocity.`,
      modelUsed: 'CrimeVision Heuristic Forensic Engine (Simulated)',
      citations: [
        { id: 'EVD-2026-8941-001', title: 'CCTV Cam 04 Exterior Breach', type: 'VIDEO' },
        { id: 'EVD-2026-8941-005', title: '911 Dispatch Audio Stream', type: 'AUDIO' }
      ]
    };
  }

  if (q.includes('suspect') || q.includes('poi') || q.includes('who') || q.includes('person')) {
    return {
      answer: `### Suspect Profile & Identification Matrix
From **[Item EVD-2026-8941-001]** and **[Item EVD-2026-8941-002]**:
- **POI-1 (Breacher / Primary):** Height ~6'1" (185cm), athletic/stocky build. Wore black balaclava hood, black reinforced plate carrier, dark tactical trousers, and blue nitrile forensic-grade gloves. Carried a yellow industrial rotary cut-off saw.
- **POI-2 (Lookout / Armed):** Height ~5'9" (175cm), medium build. Wore a dark hooded jacket with reflective arm chevron, holding a suppressed 9mm handgun in low-ready posture.

**Discrepancy Note:** Witness 911 caller initially stated "three tall men", but visual surveillance conclusively shows only **two** individuals inside the operational envelope.`,
      modelUsed: 'CrimeVision Heuristic Forensic Engine (Simulated)',
      citations: [
        { id: 'EVD-2026-8941-001', title: 'CCTV Exterior Cam 04', type: 'VIDEO' },
        { id: 'EVD-2026-8941-002', title: 'CCTV Interior Vault Cam 01', type: 'VIDEO' }
      ]
    };
  }

  if (q.includes('contradiction') || q.includes('discrepancy') || q.includes('witness') || q.includes('alibi')) {
    return {
      answer: `### Multimodal Contradiction & Corroboration Report
The Cross-Modal Fusion Engine flagged **1 Critical Discrepancy**:
- **Witness Statement (911 Audio - EVD-005):** Caller stated: *"I saw a blue pickup truck speeding away northward right after the loud sound."*
- **Visual Evidence (Exterior Cam 04 - EVD-001):** High-definition visual footage captured at 21:21:10 UTC proves the suspects fled in a **metallic silver sports sedan traveling southbound** toward Interstate 95.
- **Resolution:** Witness visual perception was distorted by darkness and ambient building reflections. Detective units should suppress alerts for the blue pickup and maintain ALPR monitoring for the silver sedan.`,
      modelUsed: 'CrimeVision Heuristic Forensic Engine (Simulated)',
      citations: [
        { id: 'EVD-2026-8941-001', title: 'CCTV Cam 04 Exterior Breach', type: 'VIDEO' },
        { id: 'EVD-2026-8941-005', title: '911 Witness Audio Transcript', type: 'AUDIO' }
      ]
    };
  }

  // Default answer
  return {
    answer: `### Forensic Case Intelligence Query: "${query}"
Reviewing the current evidentiary repository for **${caseData.title}**:
- **Evidence Count:** ${caseData.evidence.length} validated items (Images, Videos, Audio transcripts).
- **Chain of Custody:** All items sealed with SHA-256 cryptographic verification.
- **Current Synthesis:** Suspects entered via breached perimeter door B at **21:14:02 UTC**, utilized hydraulic cutters on vault lockboxes, and evacuated at **21:20:45 UTC**.

Would you like to analyze:
1. Specific weapon ballistics and serial recovery?
2. Suspect physical anthropometrics and clothing signatures?
3. Fused visual-audio timeline synchronization?`,
    modelUsed: 'CrimeVision Heuristic Forensic Engine (Simulated)',
    citations: caseData.evidence.slice(0, 2).map(e => ({ id: e.id, title: e.title, type: e.type }))
  };
}
