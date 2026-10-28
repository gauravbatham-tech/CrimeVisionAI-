import fs from 'fs';
import path from 'path';

const mediaDir = path.resolve('server/data/sample_media');
if (!fs.existsSync(mediaDir)) {
  fs.mkdirSync(mediaDir, { recursive: true });
}

// 1. CCTV Exterior Breach
const cctvExterior = `
<svg width="800" height="450" viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg" style="background:#0a0e17; font-family: monospace;">
  <defs>
    <linearGradient id="cctvGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#09131f"/>
      <stop offset="100%" stop-color="#02060b"/>
    </linearGradient>
    <radialGradient id="flashlight" cx="35%" cy="55%" r="40%">
      <stop offset="0%" stop-color="#1e3a5f" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#132337" stroke-width="0.5"/>
    </pattern>
  </defs>

  <!-- Background and Grid -->
  <rect width="800" height="450" fill="url(#cctvGrad)"/>
  <rect width="800" height="450" fill="url(#grid)" opacity="0.4"/>
  <rect width="800" height="450" fill="url(#flashlight)"/>

  <!-- Alley Scene Geometry -->
  <polygon points="120,40 120,410 260,350 260,90" fill="#0d1b2a" stroke="#1b3a5b" stroke-width="1.5"/>
  <polygon points="260,90 260,350 560,350 560,90" fill="#0b1724" stroke="#18334f" stroke-width="1.5"/>
  <polygon points="560,90 560,350 680,410 680,40" fill="#0e1f30" stroke="#1b3a5b" stroke-width="1.5"/>
  
  <!-- Security Door & Lock Assembly -->
  <rect x="360" y="160" width="100" height="190" fill="#070d14" stroke="#254a6e" stroke-width="2"/>
  <circle cx="445" cy="255" r="5" fill="#f59e0b" filter="drop-shadow(0 0 4px #f59e0b)"/>
  <rect x="355" y="240" width="15" height="35" fill="#ef4444" opacity="0.4"/>

  <!-- POI 1 Silhouette (Breacher) -->
  <g id="poi-1">
    <circle cx="340" cy="210" r="16" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
    <!-- Tactical Hood / Mask -->
    <path d="M 326 210 Q 340 195 354 210 Q 354 226 340 228 Q 326 226 326 210 Z" fill="#0f172a"/>
    <!-- Body & Vest -->
    <path d="M 315 230 L 365 230 L 370 310 L 310 310 Z" fill="#1e293b" stroke="#38bdf8" stroke-width="1.2"/>
    <!-- Arms reaching door pry bar -->
    <line x1="330" y1="245" x2="368" y2="255" stroke="#475569" stroke-width="7" stroke-linecap="round"/>
    <line x1="365" y1="250" x2="380" y2="258" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/>
    <!-- Legs -->
    <line x1="325" y1="310" x2="320" y2="380" stroke="#0f172a" stroke-width="10"/>
    <line x1="355" y1="310" x2="362" y2="375" stroke="#0f172a" stroke-width="10"/>
  </g>

  <!-- Bounding Box POI-1 -->
  <rect x="300" y="185" width="90" height="205" fill="none" stroke="#06b6d4" stroke-width="2" stroke-dasharray="6,3"/>
  <rect x="300" y="165" width="165" height="20" fill="#0891b2" opacity="0.9"/>
  <text x="306" y="179" fill="#ffffff" font-size="11" font-weight="bold">POI-1 [SUSPECT: 98.4%]</text>

  <!-- Bounding Box WEAPON / PRY TOOL -->
  <rect x="360" y="240" width="35" height="30" fill="none" stroke="#ef4444" stroke-width="2"/>
  <rect x="398" y="240" width="135" height="18" fill="#dc2626" opacity="0.9"/>
  <text x="403" y="253" fill="#ffffff" font-size="10" font-weight="bold">TOOL: PRY-BAR (94.1%)</text>

  <!-- Tactical HUD Overlay -->
  <text x="30" y="40" fill="#22c55e" font-size="13" font-weight="bold">● CAM-04: PERIMETER ALLEY NORTH [REC]</text>
  <text x="30" y="60" fill="#94a3b8" font-size="11">TIMESTAMP: 2026-10-24 21:14:02.418 UTC | FPS: 30.00 | LUX: 1.2</text>
  <text x="30" y="420" fill="#06b6d4" font-size="11">CRIMEVISION AI MULTIMODAL INGEST // SHA256: 7f4a...9b12 // STATUS: PROCESSED</text>
  <line x1="20" y1="20" x2="40" y2="20" stroke="#06b6d4" stroke-width="2"/>
  <line x1="20" y1="20" x2="20" y2="40" stroke="#06b6d4" stroke-width="2"/>
  <line x1="780" y1="20" x2="760" y2="20" stroke="#06b6d4" stroke-width="2"/>
  <line x1="780" y1="20" x2="780" y2="40" stroke="#06b6d4" stroke-width="2"/>
  <line x1="20" y1="430" x2="40" y2="430" stroke="#06b6d4" stroke-width="2"/>
  <line x1="20" y1="430" x2="20" y2="410" stroke="#06b6d4" stroke-width="2"/>
  <line x1="780" y1="430" x2="760" y2="430" stroke="#06b6d4" stroke-width="2"/>
  <line x1="780" y1="430" x2="780" y2="410" stroke="#06b6d4" stroke-width="2"/>
</svg>
`;

// 2. CCTV Interior Vault
const cctvInterior = `
<svg width="800" height="450" viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg" style="background:#090d16; font-family: monospace;">
  <defs>
    <linearGradient id="sparks" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="50%" stop-color="#f97316"/>
      <stop offset="100%" stop-color="#ef4444"/>
    </linearGradient>
  </defs>

  <!-- Vault Room -->
  <polygon points="80,50 720,50 640,380 160,380" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>
  <!-- Safety Deposit Lockers Left -->
  <rect x="90" y="80" width="80" height="260" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
  <line x1="90" y1="120" x2="170" y2="120" stroke="#334155"/>
  <line x1="90" y1="160" x2="170" y2="160" stroke="#334155"/>
  <line x1="90" y1="200" x2="170" y2="200" stroke="#334155"/>
  <line x1="90" y1="240" x2="170" y2="240" stroke="#334155"/>
  <line x1="90" y1="280" x2="170" y2="280" stroke="#334155"/>

  <!-- Vault Safe Door Center (Breached) -->
  <circle cx="400" cy="210" r="85" fill="#1e293b" stroke="#475569" stroke-width="6"/>
  <circle cx="400" cy="210" r="55" fill="#0f172a" stroke="#64748b" stroke-width="4"/>
  <!-- Spoke Handles -->
  <line x1="400" y1="135" x2="400" y2="285" stroke="#94a3b8" stroke-width="5"/>
  <line x1="325" y1="210" x2="475" y2="210" stroke="#94a3b8" stroke-width="5"/>

  <!-- Hydraulic Cutter Sparks -->
  <circle cx="460" cy="245" r="12" fill="#fbbf24" filter="drop-shadow(0 0 10px #f59e0b)"/>
  <line x1="460" y1="245" x2="490" y2="230" stroke="#fef08a" stroke-width="2"/>
  <line x1="460" y1="245" x2="475" y2="280" stroke="#f97316" stroke-width="1.5"/>
  <line x1="460" y1="245" x2="510" y2="260" stroke="#fef08a" stroke-width="1"/>

  <!-- Suspect 1 (Operating Cutter) -->
  <g id="poi-1-vault">
    <circle cx="490" cy="230" r="14" fill="#334155"/>
    <path d="M 470 245 L 515 245 L 505 320 L 465 320 Z" fill="#1e293b" stroke="#38bdf8"/>
    <rect x="445" y="215" width="85" height="135" fill="none" stroke="#06b6d4" stroke-width="2"/>
    <rect x="445" y="195" width="150" height="18" fill="#0891b2"/>
    <text x="450" y="208" fill="#fff" font-size="10" font-weight="bold">POI-1 [BREACHER: 97.2%]</text>
  </g>

  <!-- Suspect 2 (Lookout with Firearm) -->
  <g id="poi-2-vault">
    <circle cx="280" cy="210" r="14" fill="#334155"/>
    <path d="M 265 225 L 300 225 L 305 315 L 260 315 Z" fill="#1e293b" stroke="#f59e0b"/>
    <!-- Armed Handgun Extension -->
    <line x1="285" y1="240" x2="315" y2="235" stroke="#94a3b8" stroke-width="3"/>
    <rect x="250" y="190" width="70" height="145" fill="none" stroke="#f59e0b" stroke-width="2"/>
    <rect x="250" y="170" width="140" height="18" fill="#d97706"/>
    <text x="255" y="183" fill="#fff" font-size="10" font-weight="bold">POI-2 [LOOKOUT: 95.8%]</text>
    
    <!-- Weapon Flag -->
    <rect x="305" y="225" width="25" height="20" fill="none" stroke="#ef4444" stroke-width="2"/>
    <rect x="335" y="222" width="130" height="16" fill="#dc2626"/>
    <text x="340" y="234" fill="#fff" font-size="9" font-weight="bold">WEAPON: HANDGUN 96%</text>
  </g>

  <!-- HUD -->
  <text x="30" y="40" fill="#22c55e" font-size="13" font-weight="bold">● CAM-01: SECURE VAULT LEVEL B2 [IR-ACTIVE]</text>
  <text x="30" y="60" fill="#94a3b8" font-size="11">TIMESTAMP: 2026-10-24 21:18:44.890 UTC | SEISMIC: 4.8 G | SENSOR: BREACH</text>
  <text x="30" y="425" fill="#f59e0b" font-size="11">AI ACTION RECONSTRUCTION: THERMAL ROTARY CUTTING IN PROGRESS (CONF: 98.9%)</text>
</svg>
`;

// 3. Ballistics / Weapon Evidence Close-up
const ballisticsWeapon = `
<svg width="800" height="450" viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg" style="background:#111827; font-family: monospace;">
  <defs>
    <radialGradient id="evidenceSpotlight" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1f2937" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#0b0f19" stop-opacity="1"/>
    </radialGradient>
  </defs>
  <rect width="800" height="450" fill="url(#evidenceSpotlight)"/>

  <!-- Forensic Grid Surface with metric scale markings -->
  <line x1="50" y1="360" x2="750" y2="360" stroke="#475569" stroke-width="3"/>
  <!-- Centimeter tick marks -->
  ${Array.from({ length: 29 }).map((_, i) => `
    <line x1="${100 + i * 22}" y1="355" x2="${100 + i * 22}" y2="${i % 5 === 0 ? '375' : '368'}" stroke="#94a3b8" stroke-width="${i % 5 === 0 ? '2' : '1'}"/>
    ${i % 5 === 0 ? `<text x="${96 + i * 22}" y="390" fill="#94a3b8" font-size="10">${i}cm</text>` : ''}
  `).join('')}

  <!-- Yellow Plastic Forensic Evidence Cone Marker #04 -->
  <polygon points="140,240 180,240 195,340 125,340" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
  <rect x="142" y="270" width="36" height="36" fill="#000000" rx="3"/>
  <text x="151" y="297" fill="#ffffff" font-size="24" font-weight="900">04</text>

  <!-- Detailed Firearm (Glock 19 Gen 5 with Suppressor & Weapon Light) -->
  <g id="firearm" transform="translate(260, 160)">
    <!-- Silencer / Suppressor -->
    <rect x="360" y="70" width="130" height="32" rx="4" fill="#1e293b" stroke="#475569" stroke-width="2"/>
    <line x1="390" y1="70" x2="390" y2="102" stroke="#334155"/>
    <line x1="420" y1="70" x2="420" y2="102" stroke="#334155"/>
    <line x1="450" y1="70" x2="450" y2="102" stroke="#334155"/>
    <!-- Slide -->
    <rect x="180" y="66" width="185" height="40" rx="3" fill="#0f172a" stroke="#64748b" stroke-width="2"/>
    <!-- Cocking Serrations -->
    <line x1="190" y1="72" x2="190" y2="92" stroke="#475569" stroke-width="2"/>
    <line x1="196" y1="72" x2="196" y2="92" stroke="#475569" stroke-width="2"/>
    <line x1="202" y1="72" x2="202" y2="92" stroke="#475569" stroke-width="2"/>
    <line x1="208" y1="72" x2="208" y2="92" stroke="#475569" stroke-width="2"/>
    <!-- Ejection Port & Extractor -->
    <rect x="270" y="68" width="35" height="15" fill="#334155"/>
    <!-- Lower Polymer Frame & Grip -->
    <polygon points="180,106 295,106 280,210 220,205 210,125 180,115" fill="#1e293b" stroke="#334155" stroke-width="2"/>
    <!-- Trigger Guard & Trigger -->
    <path d="M 270 120 C 270 155 240 155 235 125" fill="none" stroke="#475569" stroke-width="4"/>
    <path d="M 252 120 Q 256 135 245 138" fill="none" stroke="#cbd5e1" stroke-width="3"/>
    <!-- Tactical Light / Laser Attachment -->
    <rect x="295" y="108" width="65" height="22" fill="#020617" stroke="#38bdf8" stroke-width="1.5"/>
    <circle cx="355" cy="119" r="4" fill="#38bdf8" filter="drop-shadow(0 0 5px #38bdf8)"/>
  </g>

  <!-- AI Analysis Bounding Overlay -->
  <rect x="390" y="210" width="370" height="175" fill="none" stroke="#ef4444" stroke-width="2"/>
  <rect x="390" y="186" width="320" height="22" fill="#dc2626"/>
  <text x="396" y="201" fill="#ffffff" font-size="11" font-weight="bold">AI DETECT: SEMI-AUTO FIREARM (99.7%)</text>

  <!-- Secondary Classification Pill -->
  <rect x="520" y="325" width="220" height="42" fill="#1e293b" stroke="#ef4444" stroke-width="1.5" rx="4"/>
  <text x="530" y="342" fill="#f87171" font-size="10" font-weight="bold">MODEL: GLOCK 19 9x19mm</text>
  <text x="530" y="357" fill="#94a3b8" font-size="9">ATTACHMENTS: SUPPRESSOR, WML</text>

  <!-- Macro Scale Header -->
  <text x="35" y="45" fill="#e2e8f0" font-size="14" font-weight="bold">ITEM ID: EVD-2026-8941-003 // BALLISTICS BENCH PHOTO</text>
  <text x="35" y="65" fill="#94a3b8" font-size="11">CUSTODY SEAL VERIFIED | CHAIN REF: DET. M. REYES #4019 | DIGITAL SHA256 VALIDATED</text>
</svg>
`;

// 4. Latent Toolmark & Forced Entry Macro
const toolmarkMacro = `
<svg width="800" height="450" viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg" style="background:#0c131d; font-family: monospace;">
  <!-- Metallic Door Jamb Texture -->
  <rect width="800" height="450" fill="#0f172a"/>
  <rect x="250" y="0" width="300" height="450" fill="#1e293b" stroke="#334155" stroke-width="3"/>
  <rect x="380" y="140" width="40" height="170" fill="#475569" stroke="#64748b" stroke-width="2"/>
  
  <!-- Pry Mark Scratches / Deformation -->
  <path d="M 370 190 Q 385 205 382 225 Q 375 235 390 245" fill="none" stroke="#fbbf24" stroke-width="6"/>
  <path d="M 368 195 Q 380 208 385 220" fill="none" stroke="#f59e0b" stroke-width="3"/>
  <circle cx="382" cy="225" r="4" fill="#ef4444"/>

  <!-- Latent Fingerprint Ridge Simulation -->
  <g id="fingerprint" transform="translate(440, 200)" opacity="0.75">
    <ellipse cx="40" cy="50" rx="20" ry="32" fill="none" stroke="#38bdf8" stroke-width="1.5"/>
    <ellipse cx="40" cy="50" rx="15" ry="24" fill="none" stroke="#38bdf8" stroke-width="1.5"/>
    <ellipse cx="40" cy="50" rx="10" ry="16" fill="none" stroke="#38bdf8" stroke-width="1.5"/>
    <ellipse cx="40" cy="50" rx="5" ry="8" fill="none" stroke="#38bdf8" stroke-width="1.5"/>
  </g>

  <!-- Bounding Boxes -->
  <rect x="345" y="170" width="85" height="90" fill="none" stroke="#f59e0b" stroke-width="2"/>
  <text x="210" y="165" fill="#f59e0b" font-size="11" font-weight="bold">FORCED ENTRY PRY MARK [96.4% CONF]</text>

  <rect x="425" y="185" width="75" height="95" fill="none" stroke="#06b6d4" stroke-width="2"/>
  <text x="430" y="300" fill="#06b6d4" font-size="11" font-weight="bold">LATENT PRINT RIDGE [88.1% AFIS READY]</text>

  <!-- Forensic Rulers -->
  <line x1="100" y1="410" x2="700" y2="410" stroke="#cbd5e1" stroke-width="3"/>
  ${Array.from({ length: 25 }).map((_, i) => `
    <line x1="${120 + i * 24}" y1="405" x2="${120 + i * 24}" y2="${i % 5 === 0 ? '425' : '417'}" stroke="#94a3b8"/>
  `).join('')}

  <!-- Header -->
  <text x="30" y="40" fill="#38bdf8" font-size="13" font-weight="bold">ITEM ID: EVD-2026-8941-004 // MACRO FORENSIC TOOLMARK EXAM</text>
  <text x="30" y="60" fill="#94a3b8" font-size="11">PERIMETER DOOR B LATCH RESTRICTION | TOOL BEVEL ANGLE: 28.5° ESTIMATED</text>
</svg>
`;

// 5. Witness 911 Audio Waveform
const witnessAudioWaveform = `
<svg width="800" height="450" viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg" style="background:#090e17; font-family: monospace;">
  <!-- Waveform Display Box -->
  <rect x="40" y="100" width="720" height="220" fill="#0d1522" stroke="#1e293b" stroke-width="2" rx="6"/>
  
  <!-- Central zero axis -->
  <line x1="40" y1="210" x2="760" y2="210" stroke="#334155" stroke-width="1.5" stroke-dasharray="4,4"/>

  <!-- Waveform Bars -->
  ${Array.from({ length: 80 }).map((_, i) => {
    // Generate realistic speech amplitude with two high energy gunshot/screaming transients around index 35-42
    let height = 12 + Math.abs(Math.sin(i * 0.35) * 45) + (i % 3 === 0 ? 15 : 0);
    if (i >= 32 && i <= 45) height = 80 + Math.random() * 25; // Gunshot / Scream transient
    if (i >= 60 && i <= 72) height = 45 + Math.random() * 20; // Panic response
    const yTop = 210 - height;
    const isGunshot = i >= 32 && i <= 45;
    const color = isGunshot ? '#ef4444' : (i >= 60 && i <= 72 ? '#f59e0b' : '#06b6d4');
    return `<rect x="${50 + i * 8.8}" y="${yTop}" width="5" height="${height * 2}" fill="${color}" rx="2" opacity="0.85"/>`;
  }).join('')}

  <!-- AI Acoustic Marker Flag 1: Acoustic Gunshot Transient -->
  <line x1="365" y1="70" x2="365" y2="340" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,2"/>
  <rect x="300" y="60" width="135" height="22" fill="#ef4444" rx="3"/>
  <text x="307" y="75" fill="#ffffff" font-size="10" font-weight="bold">ACOUSTIC TRANSIENT [97.8%]</text>

  <!-- Transcript Highlight Strip -->
  <rect x="40" y="340" width="720" height="80" fill="#131d2e" stroke="#1e293b" rx="4"/>
  <text x="55" y="365" fill="#38bdf8" font-size="11" font-weight="bold">AI SPEECH-TO-TEXT // WITNESS CALLER (00:01:14):</text>
  <text x="55" y="388" fill="#e2e8f0" font-size="12">"Oh God, they just kicked through the security door! I hear loud metal grinding... Wait, that was a gunshot!"</text>
  <text x="55" y="408" fill="#94a3b8" font-size="10">SPEAKER EMOTION: SEVERE PANIC (0.94) | BACKGROUND NOISE: HYDRAULIC CUTTER SIGNATURE DETECTED</text>

  <!-- Header -->
  <text x="40" y="50" fill="#22c55e" font-size="14" font-weight="bold">● AUDIO EVIDENCE EVD-2026-8941-005 // 911 DISPATCH RECORDING</text>
  <text x="40" y="75" fill="#94a3b8" font-size="11">DURATION: 02:44.180 | CHANNELS: 1 (48kHz 24-bit PCM) | AUDIO CLASSIFIER: ACTIVE</text>
</svg>
`;

fs.writeFileSync(path.join(mediaDir, 'cctv_exterior_breach.svg'), cctvExterior.trim());
fs.writeFileSync(path.join(mediaDir, 'cctv_interior_vault.svg'), cctvInterior.trim());
fs.writeFileSync(path.join(mediaDir, 'ballistics_glock.svg'), ballisticsWeapon.trim());
fs.writeFileSync(path.join(mediaDir, 'forensic_door_toolmark.svg'), toolmarkMacro.trim());
fs.writeFileSync(path.join(mediaDir, 'witness_audio_waveform.svg'), witnessAudioWaveform.trim());

console.log('Sample forensic SVG media generated successfully.');
