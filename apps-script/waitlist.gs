/**
 * Endpoint da lista de espera do helpme-site.
 *
 * Roda como Web App do Google Apps Script vinculado a uma planilha: cada POST
 * do site vira uma linha na aba "Lista de espera". Instalação em README.md.
 *
 * Contrato (POST x-www-form-urlencoded):
 *   email   obrigatório
 *   role    "cliente" | "profissional"
 *   source  "section" | "modal"
 *   website honeypot — vem vazio de gente; robô preenche e é descartado
 * Resposta: JSON { ok: true } ou { ok: false, error: "<motivo>" }
 */

const SHEET_NAME = 'Lista de espera';
const HEADERS = ['Data (UTC)', 'E-mail', 'Perfil', 'Origem'];
const ROLES = ['cliente', 'profissional'];
const SOURCES = ['section', 'modal'];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function doPost(e) {
  const params = (e && e.parameter) || {};

  // Robô: finge sucesso para não ensinar que foi barrado.
  if (params.website) return json({ ok: true });

  const email = String(params.email || '').trim().toLowerCase();
  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return json({ ok: false, error: 'email_invalido' });
  }
  const role = ROLES.indexOf(params.role) >= 0 ? params.role : 'cliente';
  const source = SOURCES.indexOf(params.source) >= 0 ? params.source : 'desconhecida';

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getSheet();
    if (alreadyListed(sheet, email)) return json({ ok: true, duplicate: true });
    sheet.appendRow([new Date().toISOString(), email, role, source]);
    return json({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

/** Abrir a URL no navegador responde isto: serve para conferir o deploy. */
function doGet() {
  return json({ ok: true, service: 'helpme-waitlist' });
}

function getSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function alreadyListed(sheet, email) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;
  return sheet
    .getRange(2, 2, lastRow - 1, 1)
    .getValues()
    .some(function (row) { return row[0] === email; });
}

function json(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
