import { SavedAudit } from './audit-context';
import { QUESTIONS, calculateScore, getStatusColor, getCategoryColor, generateActionItems, getTopVulnerabilities } from './audit-data';
import { LOGO_BASE64 } from './logo-base64';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getScoreColor(pct: number): string {
  if (pct >= 80) return '#00C6AE';
  if (pct >= 60) return '#2ED573';
  if (pct >= 40) return '#FFD93D';
  if (pct >= 20) return '#FF9F43';
  return '#FF4757';
}

function generateCategoryBarsSVG(categories: { category: string; percentage: number; categoryKey: string }[]): string {
  const barH = 22;
  const gap = 10;
  const labelW = 130;
  const barMaxW = 180;
  const pctW = 45;
  const totalW = labelW + barMaxW + pctW + 10;
  const totalH = categories.length * (barH + gap) + gap;

  const bars = categories.map((cat, i) => {
    const y = gap + i * (barH + gap);
    const color = getCategoryColor(cat.categoryKey);
    const fillW = Math.max(2, (cat.percentage / 100) * barMaxW);
    const shortName = cat.category.length > 18 ? cat.category.substring(0, 18) + '...' : cat.category;
    return `
      <text x="${labelW - 6}" y="${y + barH / 2 + 4}" fill="#E0E6ED" font-size="10" font-weight="500" text-anchor="end">${shortName}</text>
      <rect x="${labelW}" y="${y}" width="${barMaxW}" height="${barH}" rx="4" fill="#1E3452" opacity="0.5"/>
      <rect x="${labelW}" y="${y}" width="${fillW}" height="${barH}" rx="4" fill="${color}"/>
      <text x="${labelW + barMaxW + 8}" y="${y + barH / 2 + 4}" fill="${color}" font-size="11" font-weight="700">${cat.percentage}%</text>
    `;
  }).join('');

  return `<svg width="${totalW}" height="${totalH}" viewBox="0 0 ${totalW} ${totalH}" xmlns="http://www.w3.org/2000/svg">
    ${bars}
  </svg>`;
}

function generateEvolutionChartSVG(audits: { date: string; percentage: number; isCurrent: boolean; name: string }[]): string {
  if (audits.length < 2) return '';

  const w = 500, h = 180, padL = 45, padR = 20, padT = 25, padB = 40;
  const chartW = w - padL - padR;
  const chartH = h - padT - padB;

  const gridLines = [0, 25, 50, 75, 100].map(val => {
    const y = padT + chartH - (val / 100) * chartH;
    return `
      <line x1="${padL}" y1="${y}" x2="${w - padR}" y2="${y}" stroke="#1E3452" stroke-width="0.5" opacity="0.5"/>
      <text x="${padL - 8}" y="${y + 4}" fill="#5A6B7D" font-size="9" text-anchor="end">${val}</text>
    `;
  }).join('');

  const points = audits.map((a, i) => {
    const x = padL + (i / (audits.length - 1)) * chartW;
    const y = padT + chartH - (a.percentage / 100) * chartH;
    return { x, y, ...a };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

  const areaPath = linePath + ` L${points[points.length - 1].x},${padT + chartH} L${points[0].x},${padT + chartH} Z`;

  const dateLabels = points.map(p => {
    const d = new Date(p.date);
    const label = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    return `<text x="${p.x}" y="${h - 8}" fill="#5A6B7D" font-size="8" text-anchor="middle">${label}</text>`;
  }).join('');

  const dotsAndLabels = points.map(p => {
    const color = getScoreColor(p.percentage);
    return `
      <circle cx="${p.x}" cy="${p.y}" r="${p.isCurrent ? 6 : 4}" fill="${color}" stroke="#060E1A" stroke-width="2"/>
      <text x="${p.x}" y="${p.y - 12}" fill="${color}" font-size="10" font-weight="700" text-anchor="middle">${p.percentage}</text>
    `;
  }).join('');

  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    ${gridLines}
    <defs><linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#00C6AE" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#00C6AE" stop-opacity="0"/>
    </linearGradient></defs>
    <path d="${areaPath}" fill="url(#areaGrad)"/>
    <path d="${linePath}" fill="none" stroke="#00C6AE" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    ${dotsAndLabels}${dateLabels}
  </svg>`;
}

export function generateFullReportHTML(audit: SavedAudit, allAudits: SavedAudit[], target: 'webkit' | 'browser' = 'webkit'): string {
  const score = calculateScore(audit.answers);
  const scoreColor = getScoreColor(score.percentage);

  const dateFormatted = new Date(audit.date).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
  const timeFormatted = new Date(audit.date).toLocaleTimeString('pt-BR', {
    hour: '2-digit', minute: '2-digit',
  });

  const auditCode = 'AUD-' + audit.id.slice(-6).toUpperCase();

  const categoriesHTML = score.categories.map(cat => {
    const statusColor = getStatusColor(cat.status);
    const catColor = getCategoryColor(cat.categoryKey);
    return `
      <div class="cat-row">
        <div class="cat-left">
          <div class="cat-dot" style="background:${catColor};"></div>
          <span class="cat-name">${cat.category}</span>
        </div>
        <div class="cat-right">
          <span class="cat-pts">${cat.earnedPoints}/${cat.maxPoints} pts</span>
          <div class="cat-bar-track">
            <div class="cat-bar-fill" style="width:${cat.percentage}%;background:${statusColor};"></div>
          </div>
          <span class="cat-pct" style="color:${statusColor};">${cat.percentage}%</span>
          <span class="cat-status" style="color:${statusColor};background:${statusColor}18;">${cat.status}</span>
        </div>
      </div>`;
  }).join('');

  const barsSVG = generateCategoryBarsSVG(score.categories);

  const topVulns = getTopVulnerabilities(audit.answers, 5);
  const vulnsHTML = topVulns.length === 0
    ? '<div class="empty-state">Nenhuma vulnerabilidade critica identificada. Parabens!</div>'
    : topVulns.map((v, idx) => `
      <div class="vuln-row">
        <div class="vuln-num">${idx + 1}</div>
        <div class="vuln-info">
          <div class="vuln-question">${v.question}</div>
          <div class="vuln-answer">${v.answer}</div>
        </div>
        <div class="vuln-lost">-${v.lostPoints}</div>
      </div>`).join('');

  const answeredQuestions = QUESTIONS.filter(q => audit.answers[q.code]?.answer);
  const categorizedAnswers: Record<string, typeof answeredQuestions> = {};
  answeredQuestions.forEach(q => {
    if (!categorizedAnswers[q.category]) categorizedAnswers[q.category] = [];
    categorizedAnswers[q.category].push(q);
  });

  const answersHTML = Object.entries(categorizedAnswers).map(([catName, questions]) => {
    const catKey = questions[0]?.categoryKey || '';
    const catColor = getCategoryColor(catKey);
    const rows = questions.map(q => {
      const a = audit.answers[q.code];
      return `
        <tr>
          <td class="ans-code" style="color:${catColor};">${q.code}</td>
          <td class="ans-question">${q.question}</td>
          <td class="ans-answer">${escapeHtml(a.answer)}</td>
          <td class="ans-obs">${escapeHtml(a.observation || '-')}</td>
        </tr>`;
    }).join('');
    return `
      <div class="ans-cat-header" style="border-left:3px solid ${catColor};">
        <span style="color:${catColor};">${catName}</span>
      </div>
      <table class="ans-table">
        <thead><tr><th>Cod</th><th>Pergunta</th><th>Resposta</th><th>Observacao</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>`;
  }).join('');

  const dynamicActions = generateActionItems(audit.answers);
  const p1 = dynamicActions.filter(i => i.priority === 1);
  const p2 = dynamicActions.filter(i => i.priority === 2);
  const p3 = dynamicActions.filter(i => i.priority === 3);

  const priorityLabel = (p: number) => p === 1 ? 'CRITICO' : p === 2 ? 'IMPORTANTE' : 'MELHORIA';
  const priorityColor = (p: number) => p === 1 ? '#FF4757' : p === 2 ? '#FF9F43' : '#3742FA';

  const actionsHTML = dynamicActions.length === 0
    ? '<div class="empty-state">Nenhuma acao necessaria com base nas respostas.</div>'
    : dynamicActions.map((item, idx) => `
      <div class="action-card" style="border-left:4px solid ${priorityColor(item.priority)};">
        <div class="action-header">
          <div class="action-header-left">
            <span class="action-num" style="background:${priorityColor(item.priority)}20;color:${priorityColor(item.priority)};">${idx + 1}</span>
            <span class="action-badge" style="background:${priorityColor(item.priority)};">${priorityLabel(item.priority)}</span>
            <span class="action-cat">${item.category}</span>
          </div>
          <span class="action-impact">${item.impact}</span>
        </div>
        <div class="action-vuln">${item.vulnerability}</div>
        ${item.answerText ? `<div class="action-answer"><span class="action-answer-label">${escapeHtml(item.questionLabel || '')}:</span> ${escapeHtml(item.answerText)}</div>` : ''}
        <div class="action-solution">${item.solution}</div>
        <div class="action-details">
          <div class="action-detail"><span class="detail-label">Produto</span><span class="detail-value">${item.product}</span></div>
          <div class="action-detail"><span class="detail-label">Investimento</span><span class="detail-value accent">${item.investment}</span></div>
          <div class="action-detail"><span class="detail-label">Instalacao</span><span class="detail-value">${item.installation}</span></div>
        </div>
      </div>`).join('');

  const sortedAudits = [...allAudits]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(a => ({
      date: a.date,
      percentage: a.percentage,
      name: a.name,
      classification: a.classification || '',
      isCurrent: a.id === audit.id,
    }));

  const evolutionSVG = sortedAudits.length >= 2 ? generateEvolutionChartSVG(sortedAudits) : '';

  const evolutionTimelineHTML = sortedAudits.length >= 2 ? sortedAudits.map((a, idx) => {
    const color = getScoreColor(a.percentage);
    const d = new Date(a.date);
    const prev = idx > 0 ? sortedAudits[idx - 1].percentage : null;
    const diff = prev !== null ? a.percentage - prev : null;
    const diffHTML = diff !== null
      ? `<span class="evo-diff" style="color:${diff > 0 ? '#2ED573' : diff < 0 ? '#FF4757' : '#5A6B7D'};background:${diff > 0 ? '#2ED57318' : diff < 0 ? '#FF475718' : '#5A6B7D18'};">${diff > 0 ? '+' : ''}${diff}</span>`
      : '';
    return `
      <div class="evo-row${a.isCurrent ? ' evo-current' : ''}">
        <div class="evo-marker">
          <div class="evo-dot" style="background:${color};"></div>
          ${idx < sortedAudits.length - 1 ? '<div class="evo-line"></div>' : ''}
        </div>
        <div class="evo-content">
          <div class="evo-top">
            <span class="evo-date">${d.toLocaleDateString('pt-BR')}</span>
            <span class="evo-score" style="color:${color};">${a.percentage}/100</span>
            ${diffHTML}
          </div>
          <div class="evo-name">${escapeHtml(a.name)}</div>
        </div>
      </div>`;
  }).join('') : '';

  const timeline = [
    { week: 'Semana 1', days: 'Dias 1-7', task: 'Fechaduras + sensores porta/janela', color: '#FF4757' },
    { week: 'Semana 2', days: 'Dias 8-14', task: 'Iluminacao externa + camera entrada', color: '#FF9F43' },
    { week: 'Semana 3', days: 'Dias 15-21', task: 'Alarme monitorado (agendamento tecnico)', color: '#FFD93D' },
    { week: 'Semana 4', days: 'Dias 22-30', task: 'Reforcos estruturais + testes finais', color: '#00C6AE' },
  ];

  const timelineHTML = timeline.map((item, idx) => `
    <div class="timeline-row">
      <div class="timeline-marker">
        <div class="timeline-dot" style="background:${item.color};"></div>
        ${idx < 3 ? '<div class="timeline-connector"></div>' : ''}
      </div>
      <div class="timeline-card">
        <div class="timeline-week" style="color:${item.color};">${item.week}</div>
        <div class="timeline-days">${item.days}</div>
        <div class="timeline-task">${item.task}</div>
      </div>
    </div>`).join('');

  const pageBreak = '<div class="page-break"></div>';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  @page {
    size: A4;
    margin: ${target === 'webkit' ? '28mm 18mm 24mm 18mm' : '18mm 18mm 20mm 18mm'};
    ${target === 'webkit' ? `
    @top-center {
      content: element(page-header);
    }
    @bottom-center {
      content: element(page-footer);
    }` : ''}
  }
  ${target === 'webkit' ? `
  @page:first {
    margin-top: 16mm;
    @top-center { content: none; }
  }` : ''}
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: #060E1A;
    color: #E0E6ED;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    font-size: 12px;
    line-height: 1.5;
    max-width: 170mm;
    margin: 0 auto;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  .page-break { page-break-before: always; }

  /* ===== RUNNING HEADER (every page except first) ===== */
  .running-header {
    ${target === 'webkit' ? 'position: running(page-header);' : 'display: none;'}
    width: 100%;
    ${target === 'webkit' ? 'display: flex;' : ''}
    align-items: center;
    justify-content: space-between;
    padding: 0 0 6px 0;
    border-bottom: 1px solid #1E3452;
    background: #060E1A;
  }
  .running-header-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .running-header-logo {
    width: 22px; height: 22px;
    border-radius: 50%;
    object-fit: cover;
  }
  .running-header-brand {
    font-size: 10px;
    font-weight: 700;
    color: #D4AF37;
    letter-spacing: 2px;
  }
  .running-header-right {
    font-size: 9px;
    color: #5A6B7D;
  }

  /* ===== RUNNING FOOTER (every page) ===== */
  .running-footer {
    ${target === 'webkit' ? 'position: running(page-footer);' : 'display: none;'}
    width: 100%;
    ${target === 'webkit' ? 'display: flex;' : ''}
    align-items: center;
    justify-content: space-between;
    padding: 6px 0 0 0;
    border-top: 1px solid #1E3452;
    background: #060E1A;
  }
  .running-footer-left {
    font-size: 9px;
    color: #5A6B7D;
  }
  .running-footer-center {
    font-size: 9px;
    color: #5A6B7D;
  }
  .running-footer-right {
    font-size: 9px;
    color: #D4AF37;
    font-weight: 700;
  }

  /* ===== COVER HEADER ===== */
  .report-header {
    background: linear-gradient(135deg, #0A1628 0%, #132136 50%, #0A1628 100%);
    border: 1px solid #1E3452;
    border-radius: 16px;
    padding: 32px 28px;
    text-align: center;
    margin-bottom: 28px;
    position: relative;
    overflow: hidden;
  }
  .report-header::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #00C6AE, #4D96FF, #9B59B6, #00C6AE);
  }
  .header-logo {
    width: 100px; height: 100px;
    border-radius: 50%;
    border: 3px solid #00C6AE40;
    object-fit: cover;
    margin-bottom: 14px;
    box-shadow: 0 0 30px #00C6AE20;
  }
  .header-brand {
    font-size: 26px;
    font-weight: 800;
    color: #D4AF37;
    letter-spacing: 4px;
    text-transform: uppercase;
  }
  .header-tagline {
    font-size: 12px;
    color: #8A9BB5;
    margin-top: 4px;
    letter-spacing: 1px;
  }
  .header-divider {
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, transparent, #00C6AE, transparent);
    margin: 14px auto;
  }

  /* ===== META INFO ===== */
  .meta-grid {
    display: flex;
    gap: 10px;
    margin-bottom: 28px;
    page-break-inside: avoid;
  }
  .meta-card {
    flex: 1;
    background: #0D1B2A;
    border: 1px solid #1E3452;
    border-radius: 10px;
    padding: 12px 14px;
    text-align: center;
  }
  .meta-label {
    font-size: 9px;
    color: #5A6B7D;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 4px;
  }
  .meta-value {
    font-size: 13px;
    color: #E0E6ED;
    font-weight: 700;
  }

  /* ===== SECTIONS ===== */
  .section {
    margin-bottom: 26px;
    page-break-inside: auto;
  }
  .section-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
    padding-bottom: 8px;
    border-bottom: 1px solid #1E3452;
    page-break-after: avoid;
  }
  .section-num {
    font-size: 11px;
    font-weight: 800;
    color: #00C6AE;
    background: #00C6AE15;
    padding: 3px 8px;
    border-radius: 6px;
    letter-spacing: 1px;
  }
  .section-title {
    font-size: 17px;
    font-weight: 700;
    color: #E0E6ED;
  }

  /* ===== SCORE ===== */
  .score-container {
    display: flex;
    gap: 20px;
    align-items: stretch;
    page-break-inside: avoid;
  }
  .score-main {
    flex: 1;
    background: #0D1B2A;
    border: 1px solid #1E3452;
    border-radius: 14px;
    padding: 28px;
    text-align: center;
    position: relative;
  }
  .score-ring {
    width: 140px;
    height: 140px;
    margin: 0 auto 14px;
    position: relative;
  }
  .score-ring svg { position: absolute; top: 0; left: 0; }
  .score-number {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    font-size: 42px;
    font-weight: 800;
    letter-spacing: -1px;
  }
  .score-unit {
    font-size: 16px;
    font-weight: 400;
    opacity: 0.6;
  }
  .score-class {
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 1px;
    margin-top: 4px;
  }
  .score-pts {
    font-size: 11px;
    color: #5A6B7D;
    margin-top: 6px;
  }
  .score-radar {
    flex: 0 0 auto;
    background: #0D1B2A;
    border: 1px solid #1E3452;
    border-radius: 14px;
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* ===== CATEGORIES ===== */
  .cat-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    background: #0D1B2A;
    border: 1px solid #1E3452;
    border-radius: 8px;
    margin-bottom: 6px;
    page-break-inside: avoid;
  }
  .cat-left { display: flex; align-items: center; gap: 10px; }
  .cat-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .cat-name { font-size: 12px; font-weight: 500; color: #E0E6ED; }
  .cat-right { display: flex; align-items: center; gap: 10px; }
  .cat-pts { font-size: 11px; color: #5A6B7D; min-width: 60px; text-align: right; }
  .cat-bar-track { width: 80px; height: 5px; background: #1E3452; border-radius: 3px; overflow: hidden; }
  .cat-bar-fill { height: 100%; border-radius: 3px; transition: width 0.3s; }
  .cat-pct { font-size: 12px; font-weight: 700; min-width: 35px; text-align: right; }
  .cat-status { font-size: 9px; font-weight: 700; padding: 2px 7px; border-radius: 4px; letter-spacing: 0.3px; min-width: 65px; text-align: center; }

  /* ===== ANSWERS TABLE ===== */
  .ans-cat-header {
    padding: 6px 12px;
    background: #0D1B2A;
    border-radius: 6px;
    margin-bottom: 6px;
    margin-top: 12px;
    font-size: 12px;
    font-weight: 700;
    page-break-after: avoid;
  }
  .ans-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 4px;
    page-break-inside: auto;
  }
  .ans-table tr {
    page-break-inside: avoid;
  }
  .ans-table th {
    font-size: 9px;
    color: #5A6B7D;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    text-align: left;
    padding: 5px 8px;
    border-bottom: 1px solid #1E3452;
  }
  .ans-table td {
    font-size: 11px;
    padding: 6px 8px;
    border-bottom: 1px solid #0F1C2E;
    vertical-align: top;
  }
  .ans-code { font-weight: 700; white-space: nowrap; }
  .ans-question { color: #E0E6ED; }
  .ans-answer { color: #8A9BB5; }
  .ans-obs { color: #FFD93D; font-size: 10px; }

  /* ===== VULNERABILITIES ===== */
  .vuln-row {
    display: flex;
    align-items: center;
    padding: 10px 14px;
    background: #0D1B2A;
    border: 1px solid #1E3452;
    border-radius: 8px;
    margin-bottom: 6px;
    gap: 12px;
    page-break-inside: avoid;
  }
  .vuln-num {
    width: 26px; height: 26px;
    border-radius: 50%;
    background: #FF475720;
    color: #FF4757;
    font-weight: 800;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .vuln-info { flex: 1; }
  .vuln-question { font-size: 12px; font-weight: 600; color: #E0E6ED; }
  .vuln-answer { font-size: 11px; color: #FF9F43; margin-top: 2px; }
  .vuln-lost {
    font-size: 14px; font-weight: 800; color: #FF4757;
    background: #FF475712;
    padding: 4px 10px;
    border-radius: 6px;
    flex-shrink: 0;
  }
  .empty-state {
    text-align: center;
    padding: 20px;
    color: #5A6B7D;
    font-size: 12px;
    background: #0D1B2A;
    border-radius: 10px;
    border: 1px dashed #1E3452;
  }

  /* ===== TIMELINE ===== */
  .timeline-row {
    display: flex;
    gap: 14px;
    margin-bottom: 6px;
  }
  .timeline-marker {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
    width: 16px;
  }
  .timeline-dot {
    width: 12px; height: 12px;
    border-radius: 50%;
    border: 2px solid #060E1A;
  }
  .timeline-connector {
    width: 2px; flex: 1;
    background: #1E3452;
    margin-top: 3px;
  }
  .timeline-card {
    flex: 1;
    background: #0D1B2A;
    border: 1px solid #1E3452;
    border-radius: 8px;
    padding: 10px 14px;
  }
  .timeline-week { font-size: 12px; font-weight: 700; }
  .timeline-days { font-size: 10px; color: #5A6B7D; margin-bottom: 2px; }
  .timeline-task { font-size: 11px; color: #8A9BB5; }

  /* ===== ACTION CARDS ===== */
  .action-card {
    background: #0D1B2A;
    border: 1px solid #1E3452;
    border-radius: 10px;
    padding: 14px 16px;
    margin-bottom: 8px;
    page-break-inside: avoid;
  }
  .action-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }
  .action-header-left { display: flex; align-items: center; gap: 8px; }
  .action-num {
    width: 24px; height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 11px;
  }
  .action-badge {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 9px;
    font-weight: 700;
    color: #fff;
    letter-spacing: 0.3px;
  }
  .action-cat {
    font-size: 10px;
    color: #5A6B7D;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .action-impact {
    font-size: 14px;
    font-weight: 800;
    color: #2ED573;
  }
  .action-vuln {
    font-size: 12px;
    font-weight: 600;
    color: #FF6B81;
    margin-bottom: 4px;
  }
  .action-answer {
    background: #FF9F4312;
    padding: 4px 10px;
    border-radius: 5px;
    font-size: 10px;
    color: #FF9F43;
    margin-bottom: 6px;
  }
  .action-answer-label { color: #5A6B7D; }
  .action-solution {
    font-size: 11px;
    color: #E0E6ED;
    margin-bottom: 8px;
    line-height: 1.5;
  }
  .action-details {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }
  .action-detail { display: flex; flex-direction: column; gap: 1px; }
  .detail-label { font-size: 9px; color: #5A6B7D; text-transform: uppercase; }
  .detail-value { font-size: 11px; color: #E0E6ED; font-weight: 500; }
  .detail-value.accent { color: #00C6AE; font-weight: 700; }

  /* ===== EVOLUTION ===== */
  .evo-chart-container {
    background: #0D1B2A;
    border: 1px solid #1E3452;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 16px;
    text-align: center;
  }
  .evo-row {
    display: flex;
    gap: 12px;
    padding: 8px 0;
    page-break-inside: avoid;
  }
  .evo-current {
    background: #00C6AE10;
    border: 1px solid #00C6AE30;
    border-radius: 8px;
    padding: 8px 10px;
    margin: 2px 0;
  }
  .evo-marker {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 16px;
    flex-shrink: 0;
  }
  .evo-dot {
    width: 10px; height: 10px;
    border-radius: 50%;
    margin-top: 4px;
  }
  .evo-line {
    width: 2px; flex: 1;
    background: #1E3452;
    margin-top: 3px;
  }
  .evo-content { flex: 1; }
  .evo-top {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .evo-date { font-size: 12px; font-weight: 600; color: #E0E6ED; }
  .evo-score { font-size: 13px; font-weight: 800; }
  .evo-diff {
    font-size: 10px;
    font-weight: 700;
    padding: 1px 6px;
    border-radius: 6px;
  }
  .evo-name { font-size: 10px; color: #5A6B7D; margin-top: 2px; }

  /* ===== SUMMARY GRID ===== */
  .summary-grid {
    display: flex;
    gap: 10px;
    margin-bottom: 16px;
    page-break-inside: avoid;
  }
  .summary-card {
    flex: 1;
    background: #0D1B2A;
    border: 1px solid #1E3452;
    border-radius: 10px;
    padding: 14px;
    text-align: center;
  }
  .summary-num { font-size: 24px; font-weight: 800; }
  .summary-label { font-size: 9px; color: #5A6B7D; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }

  /* ===== FOOTER ===== */
  .report-footer {
    margin-top: 30px;
    padding-top: 16px;
    border-top: 1px solid #1E3452;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .footer-left { display: flex; align-items: center; gap: 10px; }
  .footer-logo { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; }
  .footer-brand { font-size: 10px; color: #5A6B7D; }
  .footer-right { font-size: 10px; color: #5A6B7D; text-align: right; }
  .footer-mr { color: #D4AF37; font-weight: 700; }

  /* ===== SCORE RING SVG ===== */

  /* ===== PRINT TABLE WRAPPER (fallback for browser repeated header/footer) ===== */
  ${target === 'browser' ? `
  .print-table { display: table; width: 100%; }
  .print-thead { display: table-header-group; }
  .print-tbody { display: table-row-group; }
  .print-tfoot { display: table-footer-group; }
  .print-row { display: table-row; }
  .print-cell { display: table-cell; }
  ` : `
  .print-table, .print-thead, .print-tbody, .print-tfoot, .print-row, .print-cell {
    display: block;
  }
  .print-thead, .print-tfoot { display: none; }
  `}
</style>
</head>
<body>

  <!-- Running header (CSS running elements for expo-print / WebKit) -->
  <div class="running-header">
    <div class="running-header-left">
      <img src="data:image/jpeg;base64,${LOGO_BASE64}" class="running-header-logo" alt="" />
      <span class="running-header-brand">CASA BLINDADA</span>
    </div>
    <div class="running-header-right">${escapeHtml(audit.name)} | ${auditCode} | ${dateFormatted}</div>
  </div>

  <!-- Running footer (CSS running elements for expo-print / WebKit) -->
  <div class="running-footer">
    <div class="running-footer-left">Casa Blindada Auditoria v3.0</div>
    <div class="running-footer-center">${dateFormatted} ${timeFormatted}</div>
    <div class="running-footer-right">MR ENG - Seguranca Estrategica</div>
  </div>

  <!-- Table wrapper for browser print fallback (thead/tfoot repeat on each page) -->
  <table class="print-table">
    <thead class="print-thead"><tr><td class="print-cell">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:0 0 6px 0;border-bottom:1px solid #1E3452;margin-bottom:8px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <img src="data:image/jpeg;base64,${LOGO_BASE64}" style="width:22px;height:22px;border-radius:50%;object-fit:cover;" alt="" />
          <span style="font-size:10px;font-weight:700;color:#D4AF37;letter-spacing:2px;">CASA BLINDADA</span>
        </div>
        <span style="font-size:9px;color:#5A6B7D;">${escapeHtml(audit.name)} | ${auditCode} | ${dateFormatted}</span>
      </div>
    </td></tr></thead>
    <tfoot class="print-tfoot"><tr><td class="print-cell">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 0 0 0;border-top:1px solid #1E3452;margin-top:8px;">
        <span style="font-size:9px;color:#5A6B7D;">Casa Blindada Auditoria v3.0</span>
        <span style="font-size:9px;color:#5A6B7D;">${dateFormatted} ${timeFormatted}</span>
        <span style="font-size:9px;color:#D4AF37;font-weight:700;">MR ENG - Seguranca Estrategica</span>
      </div>
    </td></tr></tfoot>
    <tbody class="print-tbody"><tr><td class="print-cell">

  <!-- ======= COVER / HEADER ======= -->
  <div class="report-header">
    <img src="data:image/jpeg;base64,${LOGO_BASE64}" class="header-logo" alt="Casa Blindada" />
    <div class="header-brand">CASA BLINDADA</div>
    <div class="header-tagline">Sistema de Auditoria de Seguranca Residencial</div>
    <div class="header-divider"></div>
    <div style="font-size:14px;color:#E0E6ED;font-weight:600;">Relatorio de Auditoria Completo</div>
  </div>

  <div class="meta-grid">
    <div class="meta-card">
      <div class="meta-label">Auditoria</div>
      <div class="meta-value">${escapeHtml(audit.name)}</div>
    </div>
    <div class="meta-card">
      <div class="meta-label">Data</div>
      <div class="meta-value">${dateFormatted}</div>
    </div>
    <div class="meta-card">
      <div class="meta-label">Hora</div>
      <div class="meta-value">${timeFormatted}</div>
    </div>
    <div class="meta-card">
      <div class="meta-label">Codigo</div>
      <div class="meta-value">${auditCode}</div>
    </div>
    <div class="meta-card">
      <div class="meta-label">Progresso</div>
      <div class="meta-value">${audit.answeredCount}/${audit.totalCount}</div>
    </div>
  </div>

  <!-- ======= 01 - RESUMO EXECUTIVO ======= -->
  <div class="section">
    <div class="section-header">
      <span class="section-num">01</span>
      <span class="section-title">Resumo Executivo</span>
    </div>
    <div class="score-container">
      <div class="score-main">
        <div class="score-ring">
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r="60" fill="none" stroke="#1E3452" stroke-width="8"/>
            <circle cx="70" cy="70" r="60" fill="none" stroke="${scoreColor}" stroke-width="8"
              stroke-dasharray="${(score.percentage / 100) * 377} 377"
              stroke-linecap="round" transform="rotate(-90 70 70)"/>
          </svg>
          <div class="score-number" style="color:${scoreColor};">${score.percentage}<span class="score-unit">%</span></div>
        </div>
        <div class="score-class" style="color:${scoreColor};">${score.classification}</div>
        <div class="score-pts">${score.totalScore} de ${score.maxScore} pontos possiveis</div>
      </div>
      <div class="score-radar">
        ${barsSVG}
      </div>
    </div>
  </div>

  <!-- ======= 02 - ANALISE POR CATEGORIA ======= -->
  <div class="section">
    <div class="section-header">
      <span class="section-num">02</span>
      <span class="section-title">Analise por Categoria</span>
    </div>
    ${categoriesHTML}
  </div>

  ${pageBreak}

  <!-- ======= 03 - TOP VULNERABILIDADES ======= -->
  <div class="section">
    <div class="section-header">
      <span class="section-num">03</span>
      <span class="section-title">Top 5 Vulnerabilidades Criticas</span>
    </div>
    ${vulnsHTML}
  </div>

  <!-- ======= 04 - CRONOGRAMA ======= -->
  <div class="section">
    <div class="section-header">
      <span class="section-num">04</span>
      <span class="section-title">Cronograma de Implementacao</span>
    </div>
    ${timelineHTML}
  </div>

  <!-- ======= 05 - PLANO DE ACAO ======= -->
  <div class="section">
    <div class="section-header">
      <span class="section-num">05</span>
      <span class="section-title">Plano de Acao</span>
    </div>
    <div class="summary-grid">
      <div class="summary-card">
        <div class="summary-num" style="color:#FF4757;">${p1.length}</div>
        <div class="summary-label">Criticos</div>
      </div>
      <div class="summary-card">
        <div class="summary-num" style="color:#FF9F43;">${p2.length}</div>
        <div class="summary-label">Importantes</div>
      </div>
      <div class="summary-card">
        <div class="summary-num" style="color:#3742FA;">${p3.length}</div>
        <div class="summary-label">Melhorias</div>
      </div>
      <div class="summary-card">
        <div class="summary-num" style="color:#E0E6ED;">${dynamicActions.length}</div>
        <div class="summary-label">Total</div>
      </div>
    </div>
    ${actionsHTML}
  </div>

  ${pageBreak}

  <!-- ======= 06 - RESPOSTAS ======= -->
  <div class="section">
    <div class="section-header">
      <span class="section-num">06</span>
      <span class="section-title">Respostas Registradas</span>
    </div>
    ${answersHTML}
  </div>

  ${sortedAudits.length >= 2 ? `
  ${pageBreak}
  <!-- ======= 07 - EVOLUCAO ======= -->
  <div class="section">
    <div class="section-header">
      <span class="section-num">07</span>
      <span class="section-title">Evolucao do Lar</span>
    </div>
    <div class="evo-chart-container">
      ${evolutionSVG}
    </div>
    ${evolutionTimelineHTML}
  </div>
  ` : ''}

    </td></tr></tbody>
  </table>

</body>
</html>`;
}

export function generateReportHTML(audit: SavedAudit): string {
  return generateFullReportHTML(audit, [audit]);
}

export function generateActionPlanHTML(audit: SavedAudit): string {
  return generateFullReportHTML(audit, [audit]);
}
