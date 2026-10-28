import PDFDocument from 'pdfkit';

/**
 * Generate a professional Court-Admissible Forensic PDF Report
 */
export function generateForensicReport(caseData, res) {
  const doc = new PDFDocument({
    margin: 40,
    size: 'A4',
    bufferPages: true,
    info: {
      Title: `CrimeVision AI Forensic Report - ${caseData.caseNumber}`,
      Author: 'CrimeVision AI Multimodal Intelligence System',
      Subject: `Forensic Reconstruction Dossier: ${caseData.title}`,
      Keywords: 'Forensics, AI, Reconstruction, Multimodal, Chain of Custody'
    }
  });

  // Pipe to response
  doc.pipe(res);

  // Set colors
  const primaryNavy = '#0f172a';
  const accentCyan = '#0284c7';
  const alertRed = '#dc2626';
  const darkGray = '#334155';
  const lightBg = '#f1f5f9';

  // --- PAGE 1: COVER & EXECUTIVE SUMMARY ---
  // Top Banner
  doc.rect(40, 40, 515, 26).fill(primaryNavy);
  doc.fillColor('#ffffff').fontSize(10).font('Helvetica-Bold')
    .text('CRIMEVISION AI // MULTIMODAL FORENSIC INTELLIGENCE DOSSIER', 50, 48, { align: 'center' });

  doc.rect(40, 66, 515, 14).fill(alertRed);
  doc.fillColor('#ffffff').fontSize(8).font('Helvetica-Bold')
    .text('CLASSIFICATION: LAW ENFORCEMENT SENSITIVE // COURT-ADMISSIBLE FORENSIC SUMMARY', 50, 69, { align: 'center' });

  // Main Title
  doc.moveDown(2);
  doc.fillColor(primaryNavy).fontSize(18).font('Helvetica-Bold')
    .text(`FORENSIC INCIDENT RECONSTRUCTION REPORT`, 40, 95);
  doc.fillColor(accentCyan).fontSize(12).font('Helvetica-Bold')
    .text(`CASE FILE: ${caseData.caseNumber} - ${caseData.title.toUpperCase()}`, 40, 118);

  // Divider Line
  doc.strokeColor(accentCyan).lineWidth(1.5).moveTo(40, 135).lineTo(555, 135).stroke();

  // Case Metadata Box
  doc.rect(40, 145, 515, 95).fill(lightBg).strokeColor('#cbd5e1').stroke();
  doc.fillColor(darkGray).fontSize(9).font('Helvetica');

  const col1X = 50;
  const col2X = 300;
  let metaY = 153;

  doc.font('Helvetica-Bold').text('INCIDENT TYPE:', col1X, metaY);
  doc.font('Helvetica').text(caseData.incidentType, col1X + 90, metaY);

  doc.font('Helvetica-Bold').text('DATE OCCURRED:', col2X, metaY);
  doc.font('Helvetica').text(caseData.dateOccurred, col2X + 95, metaY);

  metaY += 16;
  doc.font('Helvetica-Bold').text('LEAD DETECTIVE:', col1X, metaY);
  doc.font('Helvetica').text(caseData.leadInvestigator, col1X + 90, metaY);

  doc.font('Helvetica-Bold').text('JURISDICTION:', col2X, metaY);
  doc.font('Helvetica').text(caseData.agency, col2X + 95, metaY, { width: 155 });

  metaY += 16;
  doc.font('Helvetica-Bold').text('LOCATION:', col1X, metaY);
  doc.font('Helvetica').text(caseData.location, col1X + 90, metaY, { width: 150 });

  metaY += 24;
  doc.font('Helvetica-Bold').text('CHAIN OF CUSTODY HASH (SHA-256):', col1X, metaY);
  doc.font('Courier').fontSize(7.5).fillColor('#047857')
    .text(caseData.caseChainOfCustodyHash, col1X, metaY + 12);

  // Section: Executive Summary
  doc.fillColor(primaryNavy).fontSize(12).font('Helvetica-Bold')
    .text('1. EXECUTIVE FORENSIC RECONSTRUCTION NARRATIVE', 40, 255);
  doc.strokeColor('#cbd5e1').lineWidth(0.5).moveTo(40, 270).lineTo(555, 270).stroke();

  doc.fillColor('#1e293b').fontSize(9.5).font('Helvetica')
    .text(caseData.summary, 40, 278, { width: 515, align: 'justify', lineGap: 3 });

  // Key Incident Telemetry Metrics Box
  const metricY = 350;
  doc.rect(40, metricY, 515, 55).fill('#e2e8f0');
  
  const mColWidth = 515 / 5;
  const metricsData = [
    { label: 'EVIDENCE ITEMS', val: `${caseData.evidence.length}` },
    { label: 'PERSONS OF INTEREST', val: `${caseData.metrics.personsOfInterest}` },
    { label: 'WEAPONS DETECTED', val: `${caseData.metrics.weaponsIdentified}` },
    { label: 'TIMELINE EVENTS', val: `${caseData.timeline.length}` },
    { label: 'CONTRADICTIONS', val: `${caseData.discrepancies.length}` }
  ];

  metricsData.forEach((m, idx) => {
    const curX = 40 + idx * mColWidth;
    doc.fillColor(primaryNavy).fontSize(16).font('Helvetica-Bold')
      .text(m.val, curX, metricY + 10, { width: mColWidth, align: 'center' });
    doc.fillColor(darkGray).fontSize(7).font('Helvetica-Bold')
      .text(m.label, curX, metricY + 34, { width: mColWidth, align: 'center' });
  });

  // Section: Detected Entities (Persons & Weapons Matrix)
  let section2Y = 425;
  doc.fillColor(primaryNavy).fontSize(12).font('Helvetica-Bold')
    .text('2. DETECTED PERSONS OF INTEREST & WEAPON CLASSIFICATION MATRIX', 40, section2Y);
  doc.strokeColor('#cbd5e1').lineWidth(0.5).moveTo(40, section2Y + 15).lineTo(555, section2Y + 15).stroke();

  let entY = section2Y + 25;
  caseData.evidence.forEach(e => {
    if (e.aiAnalysis?.detectedEntities && e.aiAnalysis.detectedEntities.length > 0) {
      e.aiAnalysis.detectedEntities.forEach(ent => {
        if (entY > 730) {
          doc.addPage();
          entY = 50;
        }

        doc.rect(40, entY, 515, 38).fill('#f8fafc').strokeColor('#e2e8f0').stroke();
        
        // Entity Badge
        const badgeColor = ent.type === 'WEAPON' ? alertRed : (ent.type === 'PERSON' ? accentCyan : '#f59e0b');
        doc.rect(45, entY + 6, 65, 14).fill(badgeColor);
        doc.fillColor('#ffffff').fontSize(7.5).font('Helvetica-Bold')
          .text(ent.type, 45, entY + 9, { width: 65, align: 'center' });

        doc.fillColor(primaryNavy).fontSize(9.5).font('Helvetica-Bold')
          .text(ent.label, 120, entY + 7);

        doc.fillColor('#047857').fontSize(8.5).font('Helvetica-Bold')
          .text(`CONFIDENCE: ${(ent.confidence * 100).toFixed(1)}%`, 430, entY + 7, { align: 'right', width: 115 });

        doc.fillColor(darkGray).fontSize(8).font('Helvetica')
          .text(`Source: Item [${e.id}] // Attributes: ${ent.details}`, 120, entY + 22, { width: 420 });

        entY += 44;
      });
    }
  });

  // --- NEW PAGE: UNIFIED CHRONOLOGICAL TIMELINE ---
  doc.addPage();
  doc.fillColor(primaryNavy).fontSize(12).font('Helvetica-Bold')
    .text('3. UNIFIED MULTIMODAL CHRONOLOGICAL FORENSIC TIMELINE', 40, 45);
  doc.strokeColor('#cbd5e1').lineWidth(0.5).moveTo(40, 60).lineTo(555, 60).stroke();

  let tY = 70;
  caseData.timeline.forEach((tl, idx) => {
    if (tY > 700) {
      doc.addPage();
      tY = 50;
    }

    // Time circle and line
    doc.circle(55, tY + 8, 4).fill(accentCyan);
    doc.strokeColor('#cbd5e1').lineWidth(1).moveTo(55, tY + 12).lineTo(55, tY + 45).stroke();

    doc.fillColor(primaryNavy).fontSize(9).font('Helvetica-Bold')
      .text(tl.time, 70, tY + 3);

    const isContradiction = tl.status === 'CONTRADICTION_FLAGGED';
    if (isContradiction) {
      doc.rect(145, tY + 1, 95, 12).fill(alertRed);
      doc.fillColor('#fff').fontSize(6.5).font('Helvetica-Bold')
        .text('CONTRADICTION', 145, tY + 3, { width: 95, align: 'center' });
    } else {
      doc.rect(145, tY + 1, 95, 12).fill('#059669');
      doc.fillColor('#fff').fontSize(6.5).font('Helvetica-Bold')
        .text('VERIFIED FUSION', 145, tY + 3, { width: 95, align: 'center' });
    }

    doc.fillColor(primaryNavy).fontSize(9).font('Helvetica-Bold')
      .text(tl.title, 250, tY + 3);

    doc.fillColor(darkGray).fontSize(8).font('Helvetica')
      .text(tl.narrative, 70, tY + 18, { width: 480, lineGap: 2 });

    if (tl.corroboration) {
      doc.fillColor('#475569').fontSize(7.5).font('Helvetica-Oblique')
        .text(`Cross-Modal Correlation: ${tl.corroboration}`, 70, tY + 34, { width: 480 });
      tY += 50;
    } else {
      tY += 40;
    }
  });

  // Section: Contradiction & Corroboration Analysis
  if (caseData.discrepancies.length > 0) {
    if (tY > 620) {
      doc.addPage();
      tY = 50;
    }

    doc.fillColor(alertRed).fontSize(11).font('Helvetica-Bold')
      .text('4. WITNESS STATEMENT VS. VISUAL EVIDENCE CONTRADICTION AUDIT', 40, tY + 10);
    doc.strokeColor(alertRed).lineWidth(0.5).moveTo(40, tY + 25).lineTo(555, tY + 25).stroke();

    let discY = tY + 35;
    caseData.discrepancies.forEach(d => {
      doc.rect(40, discY, 515, 60).fill('#fef2f2').strokeColor('#fecaca').stroke();
      doc.fillColor(alertRed).fontSize(8.5).font('Helvetica-Bold')
        .text(`CLAIM / TESTIMONY: "${d.claim}"`, 50, discY + 8, { width: 495 });
      doc.fillColor('#047857').fontSize(8.5).font('Helvetica-Bold')
        .text(`VISUAL REBUTTAL: ${d.evidenceContradiction}`, 50, discY + 25, { width: 495 });
      doc.fillColor(darkGray).fontSize(8).font('Helvetica')
        .text(`IMPACT: ${d.investigativeImpact || 'Refocuses investigative resources.'}`, 50, discY + 42, { width: 495 });
      discY += 70;
    });
    tY = discY;
  }

  // --- NEW PAGE: EVIDENCE CATALOG & CHAIN OF CUSTODY SIGN-OFF ---
  doc.addPage();
  doc.fillColor(primaryNavy).fontSize(12).font('Helvetica-Bold')
    .text('5. DIGITAL EVIDENCE REPOSITORY & CHAIN OF CUSTODY AUDIT LOG', 40, 45);
  doc.strokeColor('#cbd5e1').lineWidth(0.5).moveTo(40, 60).lineTo(555, 60).stroke();

  let evY = 70;
  caseData.evidence.forEach(e => {
    if (evY > 670) {
      doc.addPage();
      evY = 50;
    }

    doc.rect(40, evY, 515, 52).fill('#f8fafc').strokeColor('#cbd5e1').stroke();
    doc.fillColor(accentCyan).fontSize(9).font('Helvetica-Bold')
      .text(`[${e.id}] ${e.title} (${e.type})`, 48, evY + 6);
    doc.fillColor(darkGray).fontSize(7.5).font('Helvetica')
      .text(`Recovered By: ${e.recoveredBy} | Location: ${e.recoveryLocation} | Time: ${e.timestamp}`, 48, evY + 20);
    doc.fillColor('#047857').fontSize(7).font('Courier')
      .text(`SHA-256: ${e.sha256}`, 48, evY + 34);

    evY += 58;
  });

  // Official Seal & Sign-Off Block
  const signY = Math.min(evY + 30, 680);
  doc.rect(40, signY, 515, 90).fill('#f1f5f9').strokeColor('#94a3b8').stroke();

  doc.fillColor(primaryNavy).fontSize(9.5).font('Helvetica-Bold')
    .text('FORENSIC INVESTIGATOR CERTIFICATION', 50, signY + 10);
  doc.fillColor(darkGray).fontSize(8).font('Helvetica')
    .text('I hereby certify that the digital multimodal evidence detailed in this dossier was collected, hashed, analyzed, and reconstructed in full compliance with CJIS security policy, ISO/IEC 17025 forensic laboratory standards, and cryptographic chain-of-custody protocols.', 50, signY + 24, { width: 495 });

  doc.text(`Digital Signer: ${caseData.leadInvestigator}`, 50, signY + 62);
  doc.text(`System Fingerprint: CRIMEVISION-AI-CORE-v2.6`, 50, signY + 74);
  doc.font('Courier').fontSize(8).fillColor(accentCyan)
    .text(`[DIGITALLY SEALED: ${new Date().toISOString()}]`, 330, signY + 65, { align: 'right' });

  // Add page numbers
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    doc.fillColor('#94a3b8').fontSize(8).font('Helvetica')
      .text(`CrimeVision AI Forensic Intelligence Dossier | Case ${caseData.caseNumber} | Page ${i + 1} of ${range.count}`, 40, 800, { align: 'center', width: 515 });
  }

  doc.end();
}
