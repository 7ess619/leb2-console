/* LEB2 Mockup Console — ตัวรับข้อมูลเข้า Google Sheet
   วางโค้ดนี้ใน Extensions → Apps Script ของ Sheet (ดูขั้นตอนใน SETUP-GOOGLE-SHEET.md) */
const SECRET = 'เปลี่ยนเป็นรหัสของทีม';   // ต้องตรงกับ CONFIG.SHEET_KEY ใน config.js

const SHEETS = {
  stage:  { name: 'Tracks',  head: ['track','stage','variant','course','done','late_answer','quiz_answer','expected_late','expected_quiz','decision_error','updated_at'] },
  mockup: { name: 'Mockups', head: ['variant','checked','updated_at'] },
};

function sheet_(def) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(def.name);
  if (!sh) { sh = ss.insertSheet(def.name); sh.appendRow(def.head); sh.setFrozenRows(1); }
  return sh;
}
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

function doGet(e) {
  if (!e.parameter || e.parameter.key !== SECRET) return json_({ error: 'unauthorized' });
  const st = sheet_(SHEETS.stage).getDataRange().getValues().slice(1)
    .map(r => ({ track: r[0], stage: r[1], done: r[4], late: r[5], quiz: r[6] }));
  const mk = sheet_(SHEETS.mockup).getDataRange().getValues().slice(1)
    .map(r => ({ variant: r[0], checked: r[1] }));
  return json_({ stages: st, mockups: mk });
}

function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return json_({ error: 'bad json' }); }
  if (body.key !== SECRET) return json_({ error: 'unauthorized' });
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    const now = new Date();
    const stSh = sheet_(SHEETS.stage), mkSh = sheet_(SHEETS.mockup);
    const stKeys = {}, mkKeys = {};
    stSh.getDataRange().getValues().forEach((r, i) => { if (i > 0) stKeys[r[0] + '|' + r[1]] = i + 1; });
    mkSh.getDataRange().getValues().forEach((r, i) => { if (i > 0) mkKeys[r[0]] = i + 1; });
    (body.rows || []).forEach(r => {
      if (r.type === 'stage') {
        const vals = [r.track, r.stage, r.variant, r.course, r.done, r.late, r.quiz, r.exp_late, r.exp_quiz, r.decision_error, now];
        const k = r.track + '|' + r.stage;
        if (stKeys[k]) stSh.getRange(stKeys[k], 1, 1, vals.length).setValues([vals]);
        else { stSh.appendRow(vals); stKeys[k] = stSh.getLastRow(); }
      } else if (r.type === 'mockup') {
        const vals = [r.variant, r.checked, now];
        if (mkKeys[r.variant]) mkSh.getRange(mkKeys[r.variant], 1, 1, vals.length).setValues([vals]);
        else { mkSh.appendRow(vals); mkKeys[r.variant] = mkSh.getLastRow(); }
      }
    });
    return json_({ ok: true });
  } finally { lock.release(); }
}
