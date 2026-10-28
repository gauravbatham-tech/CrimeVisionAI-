export const fallbackCases = [
  {
    id: "CV-2026-8941",
    caseNumber: "CV-2026-8941",
    title: "Downtown Sovereign Vault Incursion & Armed Heist",
    incidentType: "Armed Robbery / Commercial Vault Burglary / Weapons Discharge",
    status: "UNDER_INVESTIGATION",
    leadInvestigator: "Det. Marcus Reyes #4019",
    agency: "Forensic Intelligence Division, Metro Cyber & Physical Task Force",
    location: "442 Financial Boulevard, Suite B2, Metro Central",
    dateOccurred: "2026-10-24 21:12:00 UTC",
    dateReported: "2026-10-24 21:15:30 UTC",
    caseChainOfCustodyHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    summary: "At approximately 21:12 UTC, two masked perpetrators breached the exterior service alley security entrance of the Sovereign Deposit Facility. Visual CCTV footage and acoustic 911 audio confirm the use of high-grade industrial cutting tools, an accidental handgun discharge, and an armed getaway via a silver sports sedan.",
    metrics: {
      totalEvidenceItems: 5,
      personsOfInterest: 2,
      weaponsIdentified: 1,
      timelineEvents: 6,
      criticalDiscrepancies: 1,
      alibiStatus: "CONTRADICTION_PROVEN"
    },
    evidence: [
      {
        id: "EVD-2026-8941-001",
        evidenceNumber: "EVD-001",
        title: "CCTV Exterior Cam 04 - Perimeter Alley Breach",
        type: "VIDEO",
        mimeType: "video/mp4",
        mediaUrl: "/sample_media/cctv_exterior_breach.svg",
        timestamp: "2026-10-24 21:14:02 UTC",
        recoveryLocation: "Perimeter Alley North, Mounting Pole 12",
        recoveredBy: "Tech. Sarah Lin (Digital Forensics Unit)",
        sha256: "7f4a819b12dce3094c8bfa92305711e29cfa44021ef9a8d5c4b123985721aabb",
        chainOfCustody: [
          { time: "2026-10-24 21:40:00 UTC", agent: "Tech. S. Lin", action: "Seized DVR storage drive and extracted raw stream" },
          { time: "2026-10-24 22:15:00 UTC", agent: "Det. M. Reyes", action: "Imported into CrimeVision AI Multimodal Pipeline" }
        ],
        aiAnalysis: {
          sceneDescription: "Exterior security footage shows POI-1 approaching the steel reinforcement door with a heavy pry bar. Forced breach is accomplished at 21:14:02 UTC. POI-1 motions to POI-2 before entering the premises.",
          detectedEntities: [
            {
              id: "POI-1",
              type: "PERSON",
              label: "Perpetrator 1 (Breacher)",
              confidence: 0.984,
              details: "Male build, ~6'1\", tactical hooded parka, nitrile gloves, dark cargo trousers.",
              box2d: [185, 300, 390, 390]
            },
            {
              id: "TOOL-01",
              type: "TOOL",
              label: "Industrial Pry Bar",
              confidence: 0.941,
              details: "Hardened steel crowbar used against upper strike plate.",
              box2d: [240, 360, 270, 395]
            }
          ],
          actionsDetected: [
            { action: "Mechanical Levering of Security Door", confidence: 0.98, forensicSignificance: "Primary point of illegal entry established." }
          ]
        }
      },
      {
        id: "EVD-2026-8941-002",
        evidenceNumber: "EVD-002",
        title: "CCTV Interior Cam 01 - Vault Door Thermal Cutting",
        type: "VIDEO",
        mimeType: "video/mp4",
        mediaUrl: "/sample_media/cctv_interior_vault.svg",
        timestamp: "2026-10-24 21:18:44 UTC",
        recoveryLocation: "Sub-Level B2 Main Vault Chamber",
        recoveredBy: "Tech. Sarah Lin (Digital Forensics Unit)",
        sha256: "8e2d415b3a4c9e8877efd123456789abcdef0123456789abcdef0123456789ab",
        chainOfCustody: [
          { time: "2026-10-24 21:45:00 UTC", agent: "Tech. S. Lin", action: "Extracted vault NVR internal footage" }
        ],
        aiAnalysis: {
          sceneDescription: "Interior camera records POI-1 utilizing a portable hydraulic rotary cutter against safe locking pins. Intense spark shower observed. POI-2 provides armed cover with a handgun pointing toward the vestibule.",
          detectedEntities: [
            {
              id: "POI-1",
              type: "PERSON",
              label: "POI-1 (Breacher)",
              confidence: 0.972,
              details: "Operating hydraulic saw with heat-resistant safety visor.",
              box2d: [215, 445, 350, 530]
            },
            {
              id: "POI-2",
              type: "PERSON",
              label: "POI-2 (Armed Lookout)",
              confidence: 0.958,
              details: "Shorter build (~5'9\"), dark windbreaker, carrying suppressed firearm.",
              box2d: [190, 250, 335, 320]
            },
            {
              id: "WEAPON-02",
              type: "WEAPON",
              label: "Suppressed Handgun",
              confidence: 0.960,
              details: "Semi-automatic pistol equipped with cylindrical sound suppressor.",
              box2d: [225, 305, 245, 330]
            }
          ],
          actionsDetected: [
            { action: "Thermal Cutting of Safe Mechanism", confidence: 0.989, forensicSignificance: "High technical skill exhibited by suspects." }
          ]
        }
      },
      {
        id: "EVD-2026-8941-003",
        evidenceNumber: "EVD-003",
        title: "Ballistics Recovery - Glock 19 Suppressed Handgun",
        type: "IMAGE",
        mimeType: "image/svg+xml",
        mediaUrl: "/sample_media/ballistics_glock.svg",
        timestamp: "2026-10-24 22:30:15 UTC",
        recoveryLocation: "Vault Vestibule Floor adjacent to Evidence Cone #04",
        recoveredBy: "Forensic Specialist David Cho #5512",
        sha256: "4a3b2c1d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b",
        chainOfCustody: [
          { time: "2026-10-24 22:30:15 UTC", agent: "Spec. D. Cho", action: "Recovered weapon from crime scene floor" }
        ],
        aiAnalysis: {
          sceneDescription: "Macro forensic evidence photograph depicting a black polymer handgun with attached matte barrel suppressor and tactical weapon-mounted light. Weapon exhibits slide lock back indicating magazine depletion.",
          detectedEntities: [
            {
              id: "WEAPON-01",
              type: "WEAPON",
              label: "Glock 19 Gen 5 9x19mm",
              confidence: 0.997,
              details: "Features threaded barrel with SilencerCo Omega 9K suppressor, Streamlight TLR-1 weapon light.",
              box2d: [210, 390, 385, 760]
            },
            {
              id: "CONE-04",
              type: "OBJECT",
              label: "Evidence Marker #04",
              confidence: 0.992,
              details: "Yellow crime scene marker.",
              box2d: [240, 140, 340, 195]
            }
          ],
          actionsDetected: [
            { action: "Ballistic Evidence Deposition", confidence: 0.99, forensicSignificance: "Firearm abandoned during hasty egress." }
          ]
        }
      },
      {
        id: "EVD-2026-8941-004",
        evidenceNumber: "EVD-004",
        title: "Macro Forensic Examination - Door Toolmarks & Latents",
        type: "IMAGE",
        mimeType: "image/svg+xml",
        mediaUrl: "/sample_media/forensic_door_toolmark.svg",
        timestamp: "2026-10-24 23:05:00 UTC",
        recoveryLocation: "Perimeter Security Door B Latch Assembly",
        recoveredBy: "Forensic Specialist David Cho #5512",
        sha256: "1f2e3d4c5b6a798899aabbccddeeff00112233445566778899aabbccddeeff00",
        chainOfCustody: [
          { time: "2026-10-24 23:05:00 UTC", agent: "Spec. D. Cho", action: "Lifted latent print using black magnetic powder" }
        ],
        aiAnalysis: {
          sceneDescription: "Macro visual photography of the exterior door latch plate displaying striation gouges from a mechanical tool, accompanied by an identifiable partial friction ridge impression.",
          detectedEntities: [
            {
              id: "TOOLMARK-01",
              type: "OBJECT",
              label: "Forced Entry Pry Mark",
              confidence: 0.964,
              details: "Tool bevel width 32mm; consistent with heavy demolition crowbar.",
              box2d: [170, 345, 260, 430]
            },
            {
              id: "PRINT-01",
              type: "OBJECT",
              label: "Latent Fingerprint Impression",
              confidence: 0.881,
              details: "12 clear minutiae points located on steel frame; candidate for AFIS search.",
              box2d: [185, 425, 280, 500]
            }
          ],
          actionsDetected: [
            { action: "Pry Bar Insertion & Latch Bypassing", confidence: 0.97, forensicSignificance: "Physical entry point confirmation." }
          ]
        }
      },
      {
        id: "EVD-2026-8941-005",
        evidenceNumber: "EVD-005",
        title: "911 Dispatch Emergency Call Recording & Acoustic Telemetry",
        type: "AUDIO",
        mimeType: "audio/wav",
        mediaUrl: "/sample_media/witness_audio_waveform.svg",
        timestamp: "2026-10-24 21:15:30 UTC",
        recoveryLocation: "Metro 911 Communications Audio Archival Server",
        recoveredBy: "Dispatcher R. Alvarez #208",
        sha256: "99887766554433221100aabbccddeeff99887766554433221100aabbccddeeff",
        chainOfCustody: [
          { time: "2026-10-24 21:25:00 UTC", agent: "Dispatcher R. Alvarez", action: "Audio transcript and audio WAV export generated" }
        ],
        audioTranscript: "Caller (Store Manager): 'Oh God, they just kicked through the security door! I hear loud metal grinding from the vault area... Wait, that was a gunshot! Please hurry! I see them carrying duffel bags out to the alley... It looks like a blue pickup truck speeding away northward!'",
        aiAnalysis: {
          sceneDescription: "Acoustic audio signal processing reveals mechanical cutting frequencies (approx 4.2 kHz) beginning at 00:00:42, followed by a sharp acoustic transient at 00:01:14 with decay envelope matching a suppressed 9mm firearm.",
          detectedEntities: [
            {
              id: "ACOUSTIC-01",
              type: "OBJECT",
              label: "Suppressed Gunshot Transient",
              confidence: 0.978,
              details: "Peak SPL 118 dB equivalent at sensor, 1.2s reverberation time.",
              box2d: [60, 300, 82, 435]
            }
          ],
          actionsDetected: [
            { action: "Emergency 911 Distress Call", confidence: 0.99, forensicSignificance: "Establishes immediate witness awareness and panic timeline." },
            { action: "Acoustic Firearm Discharge", confidence: 0.978, forensicSignificance: "Matches interior vault CCTV timestamp 21:18:44 UTC." }
          ]
        }
      }
    ],
    timeline: [
      {
        id: "TL-001",
        time: "21:12:15 UTC",
        sourceEvidenceId: "EVD-2026-8941-001",
        sourceType: "VISUAL",
        title: "Perimeter Approach",
        narrative: "Two unidentified suspects emerge on foot from the north alleyway wearing dark tactical garments and gloves.",
        confidence: 0.985,
        status: "VERIFIED",
        corroboration: "Corroborated by alley motion sensor trip at 21:12:12 UTC."
      },
      {
        id: "TL-002",
        time: "21:14:02 UTC",
        sourceEvidenceId: "EVD-2026-8941-001",
        sourceType: "VISUAL",
        title: "Perimeter Door Breach",
        narrative: "POI-1 forces open the exterior security door using a hardened steel pry tool, damaging the deadbolt latch.",
        confidence: 0.991,
        status: "VERIFIED",
        corroboration: "Corroborated by Item EVD-004 macro toolmark striations."
      },
      {
        id: "TL-003",
        time: "21:15:30 UTC",
        sourceEvidenceId: "EVD-2026-8941-005",
        sourceType: "AUDIO",
        title: "911 Emergency Call Initiated",
        narrative: "Store manager initiates 911 dispatch call reporting grinding noises from vault corridor.",
        confidence: 0.999,
        status: "VERIFIED",
        corroboration: "Direct telecom carrier timestamp sync."
      },
      {
        id: "TL-004",
        time: "21:18:44 UTC",
        sourceEvidenceId: "EVD-2026-8941-002",
        sourceType: "CROSS_MODAL_FUSED",
        title: "Vault Door Cut & Suppressed Discharge",
        narrative: "CCTV Cam 01 visually captures cutting torch sparks severing safe pins; simultaneously, 911 audio at 00:01:14 records a suppressed acoustic gunshot transient.",
        confidence: 0.978,
        status: "VERIFIED",
        corroboration: "Fused visual CCTV 01 and witness acoustic audio channel."
      },
      {
        id: "TL-005",
        time: "21:20:45 UTC",
        sourceEvidenceId: "EVD-2026-8941-001",
        sourceType: "VISUAL",
        title: "Suspects Evacuate with Contraband",
        narrative: "POI-1 and POI-2 exit through breached alley door carrying black tactical duffel bags. Glock 19 dropped during hasty escape.",
        confidence: 0.974,
        status: "VERIFIED",
        corroboration: "Corroborated by physical recovery of Glock 19 at Item EVD-003."
      },
      {
        id: "TL-006",
        time: "21:21:10 UTC",
        sourceEvidenceId: "EVD-2026-8941-001",
        sourceType: "VISUAL",
        title: "Vehicular Egress (Contradiction Identified)",
        narrative: "CCTV Exterior Cam 04 records metallic silver sports sedan departing southbound at high speed onto Interstate 95 ramp.",
        confidence: 0.965,
        status: "CONTRADICTION_FLAGGED",
        corroboration: "CONTRADICTION: Witness 1 stated getaway car was a 'blue pickup truck heading north'. Visual proof decisively invalidates witness vehicle color and heading."
      }
    ],
    discrepancies: [
      {
        id: "DISC-01",
        claim: "Witness 1 stated in 911 call: 'I saw a blue pickup truck speeding away northward right after the loud sound.'",
        evidenceContradiction: "Perimeter Camera 04 recorded a metallic silver sedan exiting south onto Highway 95 at 21:21:10 UTC.",
        confidence: 0.962,
        severity: "CRITICAL_CONTRADICTION",
        investigativeImpact: "Invalidates blue pickup search; prevents misallocation of investigative resources."
      }
    ],
    spatialMap: {
      sceneLayout: "Sovereign Deposit Facility - Sub-Level B2 & Alleyway",
      nodes: [
        { id: "NODE-1", label: "Perimeter Alley North (Cam 04)", x: 20, y: 30, type: "CAMERA" },
        { id: "NODE-2", label: "Breached Security Door B", x: 45, y: 30, type: "BREACH_POINT" },
        { id: "NODE-3", label: "Main Vault Safe Room (Cam 01)", x: 75, y: 65, type: "PRIMARY_TARGET" },
        { id: "NODE-4", label: "Vestibule Glock Recovery Site", x: 60, y: 50, type: "WEAPON_RECOVERY" },
        { id: "NODE-5", label: "Manager Office (911 Caller)", x: 30, y: 75, type: "WITNESS_LOCATION" }
      ],
      vectorPath: [
        { from: "NODE-1", to: "NODE-2", label: "21:12 Ingress" },
        { from: "NODE-2", to: "NODE-3", label: "21:14 Infiltration" },
        { from: "NODE-3", to: "NODE-4", label: "21:20 Weapon Dropped" },
        { from: "NODE-4", to: "NODE-1", label: "21:21 Vehicular Escape" }
      ]
    }
  }
];
