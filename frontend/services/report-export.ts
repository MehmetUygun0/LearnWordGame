import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import { ReportSummary } from '@/services/report';

export const exportReportAsPdf = async (summary: ReportSummary) => {
  const html = buildReportHtml(summary);
  const { uri } = await Print.printToFileAsync({
    html,
    base64: false,
  });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, {
      dialogTitle: 'Kelime öğrenme raporunu paylaş',
      mimeType: 'application/pdf',
      UTI: 'com.adobe.pdf',
    });
    return uri;
  }

  await Print.printAsync({ html });
  return uri;
};

const buildReportHtml = (summary: ReportSummary) => {
  const generatedAt = formatDate(summary.generatedAt ?? new Date().toISOString());
  const levelRows = summary.levelStats
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.level)}</td>
          <td>${formatNumber(item.words)}</td>
          <td>${formatNumber(item.totalWords ?? item.words)}</td>
          <td>%${formatNumber(item.learnedPercentage ?? 0)}</td>
          <td>%${formatNumber(item.averageKnowledgeScore ?? 0)}</td>
        </tr>`
    )
    .join('');
  const stageRows = summary.stageStats
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.label || `${item.stage}/6`)}</td>
          <td>${formatNumber(item.words)}</td>
          <td>%${formatNumber(item.percentage ?? 0)}</td>
        </tr>`
    )
    .join('');
  const topicRows = summary.topicStats
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.topic)}</td>
          <td>${formatNumber(item.words)}</td>
          <td>${formatNumber(item.learnedWords)}</td>
          <td>%${formatNumber(item.successRate)}</td>
        </tr>`
    )
    .join('');
  const difficultRows = summary.difficultWords.length
    ? summary.difficultWords
        .map(
          (item) => `
            <tr>
              <td>${escapeHtml(item.word)}</td>
              <td>${formatNumber(item.wrongCount)}</td>
              <td>${formatNumber(item.stage)}/6</td>
            </tr>`
        )
        .join('')
    : '<tr><td colspan="3">Zorlanılan kelime bulunmuyor.</td></tr>';

  return `<!doctype html>
  <html lang="tr">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>
        * { box-sizing: border-box; }
        body {
          margin: 0;
          padding: 36px;
          color: #1f2937;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background: #ffffff;
        }
        header {
          border-bottom: 3px solid #7c6cff;
          padding-bottom: 18px;
          margin-bottom: 24px;
        }
        h1 {
          margin: 0 0 8px;
          font-size: 28px;
          color: #111827;
        }
        h2 {
          margin: 28px 0 12px;
          font-size: 17px;
          color: #111827;
        }
        p {
          margin: 0;
          line-height: 1.55;
        }
        .muted { color: #6b7280; font-size: 12px; }
        .grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin: 20px 0 6px;
        }
        .metric {
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 14px;
          background: #f9fafb;
        }
        .metric span {
          display: block;
          color: #6b7280;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: .04em;
        }
        .metric strong {
          display: block;
          margin-top: 6px;
          font-size: 22px;
          color: #111827;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 8px;
          font-size: 12px;
        }
        th, td {
          border: 1px solid #e5e7eb;
          padding: 9px 10px;
          text-align: left;
        }
        th {
          background: #f3f4f6;
          color: #374151;
        }
        ul {
          margin: 8px 0 0;
          padding-left: 18px;
        }
        li { margin-bottom: 7px; line-height: 1.45; }
        .section {
          page-break-inside: avoid;
        }
      </style>
    </head>
    <body>
      <header>
        <h1>Kelime Öğrenme İlerleme Raporu</h1>
        <p>${escapeHtml(summary.userName)} için oluşturuldu · Seviye: ${escapeHtml(summary.level)} · ${generatedAt}</p>
      </header>

      <section class="grid">
        ${metric('Takip edilen', summary.totalTrackedWords ?? summary.totalLearnedWords)}
        ${metric('Öğrenilen', summary.totalLearnedWords)}
        ${metric('Başarı', `%${summary.correctRate}`)}
        ${metric('Tekrar bekleyen', summary.reviewDueCount)}
      </section>

      ${summary.narrativeSummary ? `<section class="section"><h2>Genel Değerlendirme</h2><p>${escapeHtml(summary.narrativeSummary)}</p></section>` : ''}

      <section class="section">
        <h2>Seviye Dağılımı</h2>
        <table>
          <thead><tr><th>Seviye</th><th>Öğrenilen</th><th>Toplam</th><th>Öğrenme</th><th>Bilgi skoru</th></tr></thead>
          <tbody>${levelRows || '<tr><td colspan="5">Seviye verisi bulunmuyor.</td></tr>'}</tbody>
        </table>
      </section>

      <section class="section">
        <h2>Konu Bazlı Başarı</h2>
        <table>
          <thead><tr><th>Konu</th><th>Kelime</th><th>Öğrenilen</th><th>Başarı</th></tr></thead>
          <tbody>${topicRows || '<tr><td colspan="4">Konu analizi için kelime verisi bulunmuyor.</td></tr>'}</tbody>
        </table>
      </section>

      <section class="section">
        <h2>6 Tekrar Durumu</h2>
        <table>
          <thead><tr><th>Aşama</th><th>Kelime</th><th>Oran</th></tr></thead>
          <tbody>${stageRows || '<tr><td colspan="3">Tekrar verisi bulunmuyor.</td></tr>'}</tbody>
        </table>
      </section>

      <section class="section">
        <h2>Zorlanılan Kelimeler</h2>
        <table>
          <thead><tr><th>Kelime</th><th>Yanlış</th><th>Aşama</th></tr></thead>
          <tbody>${difficultRows}</tbody>
        </table>
      </section>

      ${listSection('Güçlü Yönler', summary.strengths)}
      ${listSection('Odak Alanları', summary.focusAreas)}
      ${listSection('Öneriler', summary.recommendations)}
    </body>
  </html>`;
};

const metric = (label: string, value: string | number) => `
  <div class="metric">
    <span>${escapeHtml(label)}</span>
    <strong>${escapeHtml(String(value))}</strong>
  </div>`;

const listSection = (title: string, items?: string[]) => {
  if (!items?.length) {
    return '';
  }

  return `
    <section class="section">
      <h2>${escapeHtml(title)}</h2>
      <ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
    </section>`;
};

const formatDate = (value?: string) => {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('tr-TR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

const formatNumber = (value: number) => new Intl.NumberFormat('tr-TR').format(Math.round(Number(value) || 0));

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
