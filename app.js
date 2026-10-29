const STORAGE_KEY = "leb2_progress_v2";
const SHEET_ON = !!(CONFIG.SHEET_URL && CONFIG.SHEET_KEY);
const VBY = Object.fromEntries(VARIANTS.map(v => [v.id, v]));
const stageNo = k => STAGE_ORDER.indexOf(k);
const stageTitle = (k, variant) => k === "baseline"
  ? "Test 0 — Main Web (Baseline)"
  : `Test ${stageNo(k)} — ${TIERS[k].label}: ${variant}`;

function defaultState(){
  const mockups = {}; VARIANTS.forEach(v => mockups[v.id] = false);
  const tracks = {};
  TRACKS.forEach(t => { tracks[t.id] = {}; STAGE_ORDER.forEach(k => tracks[t.id][k] = {done:false, late:"", quiz:""}); });
  return {mockups, tracks};
}
let STATE = defaultState();
let VIEW = {name:"index", trackId:null};
let TRACK_FILTER = "all";
const REVEALED = new Set();           // ปุ่มดูเฉลย (เก็บเฉพาะในหน้านี้ ไม่ซิงค์)
let SYNC = {status: SHEET_ON ? "connecting" : "local", pending: 0};

/* ---------- correctness ---------- */
function verdict(k, st){
  if(st.late === "" || st.quiz === "") return null;           // ยังกรอกไม่ครบ
  const T = TIERS[k];
  return (+st.late === T.late && +st.quiz === T.quiz);        // true=ถูก
}
const decisionError = (k, st) => { const v = verdict(k, st); return v === null ? "" : (v ? 0 : 1); };

/* ---------- local cache ---------- */
function loadLocal(){
  try{
    const p = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if(p){ Object.keys(p.mockups||{}).forEach(k => { if(k in STATE.mockups) STATE.mockups[k] = p.mockups[k]; });
      Object.keys(STATE.tracks).forEach(id => { if(p.tracks && p.tracks[id]) STAGE_ORDER.forEach(k => { if(p.tracks[id][k]) Object.assign(STATE.tracks[id][k], p.tracks[id][k]); }); }); }
  }catch(e){}
}
const saveLocal = () => { try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE)); }catch(e){} };

/* ---------- Google Sheet sync ---------- */
function stageRow(tid, k){
  const t = TRACKS.find(x => x.id === tid), st = STATE.tracks[tid][k], T = TIERS[k];
  return {type:"stage", track:tid, stage:k, variant:t.stages[stageNo(k)], course:T.course,
    done:st.done, late:st.late, quiz:st.quiz, exp_late:T.late, exp_quiz:T.quiz, decision_error:decisionError(k, st)};
}
let queue = new Map(), flushTimer = null;
function queueRow(row){
  if(!SHEET_ON) return;
  queue.set(row.type === "stage" ? `s|${row.track}|${row.stage}` : `m|${row.variant}`, row);
  SYNC.pending = queue.size; setClock();
  clearTimeout(flushTimer); flushTimer = setTimeout(flush, 500);
}
async function flush(){
  const rows = [...queue.values()]; queue = new Map();
  if(!rows.length) return;
  try{
    const r = await fetch(CONFIG.SHEET_URL, {method:"POST", headers:{"Content-Type":"text/plain;charset=utf-8"},
      body: JSON.stringify({key:CONFIG.SHEET_KEY, rows})});
    const j = await r.json(); if(j.error) throw new Error(j.error);
    SYNC.status = "ok";
  }catch(e){ console.error("sheet save failed", e); SYNC.status = "error"; rows.forEach(queueRowRetry); }
  SYNC.pending = queue.size; setClock();
}
const queueRowRetry = row => { queue.set(row.type === "stage" ? `s|${row.track}|${row.stage}` : `m|${row.variant}`, row); clearTimeout(flushTimer); flushTimer = setTimeout(flush, 5000); };

async function pull(){
  if(!SHEET_ON || queue.size) return;
  try{
    const r = await fetch(`${CONFIG.SHEET_URL}?key=${encodeURIComponent(CONFIG.SHEET_KEY)}`);
    const j = await r.json(); if(j.error) throw new Error(j.error);
    if(queue.size) return;                                   // มีของที่ยังไม่ได้ส่ง ไม่ทับ
    (j.stages||[]).forEach(s => { const c = STATE.tracks[s.track] && STATE.tracks[s.track][s.stage];
      if(c){ c.done = s.done === true || String(s.done).toUpperCase() === "TRUE"; c.late = String(s.late ?? ""); c.quiz = String(s.quiz ?? ""); } });
    (j.mockups||[]).forEach(m => { if(m.variant in STATE.mockups) STATE.mockups[m.variant] = m.checked === true || String(m.checked).toUpperCase() === "TRUE"; });
    SYNC.status = "ok"; saveLocal();
    if(!(document.activeElement && document.activeElement.tagName === "INPUT")) render();
  }catch(e){ console.error("sheet load failed", e); SYNC.status = "error"; }
  setClock();
}

/* ---------- clock / status ---------- */
function setClock(){
  const d = new Date();
  const date = d.toLocaleDateString('en-GB', {weekday:'short', year:'numeric', month:'short', day:'numeric'});
  const time = d.toLocaleTimeString('en-GB', {hour:'2-digit', minute:'2-digit'});
  const label = {local:"LOCAL ONLY (เครื่องนี้เท่านั้น)", connecting:"SHEET: กำลังเชื่อมต่อ…",
    ok: SYNC.pending ? "SHEET: กำลังบันทึก…" : "SHEET: ซิงค์แล้ว", error:"SHEET: เชื่อมต่อไม่ได้ (เก็บในเครื่องไว้ก่อน)"}[SYNC.status];
  document.getElementById('clockBox').innerHTML = `<b>${date}</b><br>${time} · ${label}`;
}
setClock(); setInterval(setClock, 30000);

function go(name, trackId){ VIEW = {name, trackId: trackId || null}; window.scrollTo({top:0}); render(); }

/* ---------- shared bits ---------- */
const missingLinks = () => VARIANTS.filter(v => !FIGMA_LINKS[v.id]).length;
function figmaBtn(id, cls){
  const u = FIGMA_LINKS[id];
  return u ? `<a class="${cls}" href="${u}" target="_blank" rel="noopener">เปิด Figma ↗</a>`
           : `<span class="${cls} nolink" title="ใส่ลิงก์ใน data.js → FIGMA_LINKS">ยังไม่มีลิงก์</span>`;
}
const linkBanner = () => missingLinks() ? `<div class="banner">ยังไม่ได้ใส่ลิงก์ Figma ${missingLinks()}/${VARIANTS.length} แบบ — ใส่ที่ <code>data.js</code> → <code>FIGMA_LINKS</code></div>` : "";
const tierClass = t => ({baseline:"tier-baseline", hshs:"tier-hshs", lshs:"tier-lshs", lsls:"tier-lsls"})[t];


/* ---------- Figma setup guide (แสดงบนหน้าแรกและหน้า track) ---------- */
let GUIDE_OPEN = true;
const guideBox = () => `<details class="guide" ${GUIDE_OPEN ? "open" : ""} ontoggle="GUIDE_OPEN = this.open">
  <summary>ตั้งค่า Figma ก่อนเริ่มรอบทดสอบ (ทำทุกครั้งที่เปิดลิงก์ prototype ใหม่)</summary>
  <ol>
    <li>กด <b>เปิด Figma ↗</b> ของแบบที่จะใช้ (เปิดหน้าต่างใหม่)</li>
    <li>คลิกไอคอนปรับแต่ง (สัญลักษณ์สไลเดอร์) ที่แถบด้านบนของ prototype → <b>Advanced settings</b> → <b>Show hints on click</b> ต้อง<u>ปิด</u> (ไม่มีเครื่องหมายถูก) — ถ้าเปิดอยู่ Figma จะกะพริบไฮไลต์พื้นที่ที่คลิกได้ ซึ่งชี้นำสายตาผู้เข้าร่วมและปนกับข้อมูล eye-tracking</li>
    <li>กดปุ่ม <b>Full screen</b> (ไอคอนลูกศรสี่ทิศ มุมขวาบน) ให้ prototype เต็มจอก่อนเริ่มปรับเทียบสายตา</li>
    <li>ถ้าแถบเครื่องมือ Figma ยังเห็นอยู่หลังเต็มจอ ให้เมนูเดียวกันเลือก <b>Hide UI</b> (<code>Ctrl + \\</code>)</li>
    <li>เช็กให้เห็นหน้าแรกของแบบนั้นครบก่อนให้ผู้เข้าร่วมเริ่ม</li>
  </ol>
  <div class="guide-note">ยืนยันไม่ได้ว่า Figma จำค่าเหล่านี้ข้ามลิงก์/เครื่องหรือไม่ จึงให้เช็กทุกครั้ง</div>
</details>`;

/* ---------- INDEX ---------- */
function renderIndex(){
  const doneTracks = TRACKS.filter(t => trackComplete(t.id)).length;
  const doneMocks = VARIANTS.filter(v => STATE.mockups[v.id]).length;
  return `
    ${linkBanner()}
    ${guideBox()}
    <div class="hero">
      <div class="eyebrow">Mission Select</div>
      <h2>อยากดูอะไรวันนี้?</h2>
      <p>เปิดชุด mock-up ตรงไปที่ Figma prototype โดยไม่ต้องไล่หาใน editor และติดตามความคืบหน้าการเก็บข้อมูลของทีม</p>
    </div>
    <div class="switch-grid">
      <button class="switch sw-a" onclick="go('mockups')">
        <div class="tag"><span class="led"></span>Panel 01</div>
        <h3>Mock-up ทั้งหมด</h3>
        <p>Baseline + HS/LS ทั้ง 18 แบบ (19 ปุ่ม) — ใช้สำรวจ ตรวจสอบ หรืออ้างอิงชุดใดชุดหนึ่งโดยเฉพาะ</p>
        <div class="meta"><span>${doneMocks}/${VARIANTS.length} เปิดตรวจแล้ว</span><span class="go">เข้าดู →</span></div>
      </button>
      <button class="switch sw-b" onclick="go('tracks')">
        <div class="tag"><span class="led"></span>Panel 02</div>
        <h3>Track Mock-up</h3>
        <p>30 tracks สำหรับเก็บข้อมูลจริง แต่ละ track มี 4 รอบทดสอบ พร้อมเฉลยและสถานะการเก็บข้อมูล</p>
        <div class="meta"><span>${doneTracks}/${TRACKS.length} tracks เสร็จสมบูรณ์</span><span class="go">เข้าดู →</span></div>
      </button>
    </div>`;
}

/* ---------- MOCKUPS ---------- */
function renderMockups(){
  const doneMocks = VARIANTS.filter(v => STATE.mockups[v.id]).length;
  let body = `${linkBanner()}
    <button class="backbtn" onclick="go('index')">← กลับหน้าแรก</button>
    <div class="sec-head">
      <div class="eyebrow">Panel 01</div>
      <h2>Mock-up ทั้งหมด</h2>
      <div class="sec-sub">ตรวจแล้ว ${doneMocks} / ${VARIANTS.length} — กด "เปิด Figma" เพื่อดู prototype โดยตรง</div>
    </div>`;
  ["baseline","hshs","lshs","lsls"].forEach(tier => {
    const items = VARIANTS.filter(v => v.tier === tier), T = TIERS[tier];
    body += `<div class="group-block">
      <div class="group-title gt-${tier}"><span class="swatch"></span>${T.label}${tier==="baseline" ? "" : ` — ${items.length} แบบ`} · ${T.course}</div>
      <div class="card-grid">`;
    items.forEach(v => {
      const on = STATE.mockups[v.id];
      body += `<div class="mcard ${tierClass(tier)}">
        <div class="mcard-top">
          <div class="mcard-label">${v.id === "Baseline" ? "Main Web (Baseline)" : v.id}</div>
          <input type="checkbox" class="chk" ${on?"checked":""} onchange="toggleMockup('${v.id}', this.checked)" aria-label="ตรวจแล้ว: ${v.id}">
        </div>
        <div class="mcard-actions">${figmaBtn(v.id, "openbtn")}<span class="status-pill ${on?'done':''}">${on?'ตรวจแล้ว':'ยังไม่ตรวจ'}</span></div>
      </div>`;
    });
    body += `</div></div>`;
  });
  return body;
}
function toggleMockup(id, val){
  STATE.mockups[id] = val; saveLocal(); queueRow({type:"mockup", variant:id, checked:val}); render();
}

/* ---------- TRACKS ---------- */
const trackComplete = tid => STAGE_ORDER.every(k => STATE.tracks[tid][k].done);
const trackDoneCount = tid => STAGE_ORDER.filter(k => STATE.tracks[tid][k].done).length;
const setFilter = f => { TRACK_FILTER = f; render(); };

function renderTracks(){
  const total = TRACKS.length, completed = TRACKS.filter(t => trackComplete(t.id)).length, pct = Math.round(completed/total*100);
  const list = TRACK_FILTER === "all" ? TRACKS : TRACKS.filter(t => t.group === TRACK_FILTER);
  const GL = {}; TRACKS.forEach(t => GL[t.group] = t.groupLabel);
  const chip = (k, txt) => `<button class="filter-chip ${TRACK_FILTER===k?'active':''}" onclick="setFilter('${k}')">${txt}</button>`;
  let body = `${linkBanner()}
    <button class="backbtn" onclick="go('index')">← กลับหน้าแรก</button>
    <div class="sec-head">
      <div class="eyebrow">Panel 02</div>
      <h2>Track Mock-up</h2>
      <div class="sec-sub">1 track = 1 ผู้เข้าร่วม / 4 รอบทดสอบ (Baseline → LS+HS → HS+HS → LS+LS)</div>
    </div>
    <div class="stat-bar">
      <div class="stat done"><div class="num">${completed}</div><div class="lbl">Complete</div></div>
      <div class="stat"><div class="num">${total-completed}</div><div class="lbl">Remaining</div></div>
      <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
      <div class="stat"><div class="num">${pct}%</div><div class="lbl">Overall</div></div>
    </div>
    <div class="filter-row">${chip('all','ทั้งหมด (30)')}${["A","B","C"].map(g => chip(g, `กลุ่ม ${g} — ${GL[g]} (10)`)).join("")}</div>
    <div class="track-grid">`;
  list.forEach(t => {
    const c = trackComplete(t.id), n = trackDoneCount(t.id);
    body += `<button class="tcard ${t.repeat?'is-repeat':''}" onclick="go('trackDetail', ${t.id})">
      <div class="tcard-top"><span class="tcard-id">#${String(t.id).padStart(2,'0')}</span><span class="grp-badge grp-${t.group}">${t.group}</span></div>
      <div class="dots">${STAGE_ORDER.map(k => `<span class="dot ${STATE.tracks[t.id][k].done?'on':''}"></span>`).join('')}</div>
      <div class="tcard-status ${c?'complete':''}">${c ? '✓ เสร็จสมบูรณ์' : n+'/4 รอบ'}</div></button>`;
  });
  return body + `</div>`;
}

/* ---------- TRACK DETAIL ---------- */
function renderTrackDetail(){
  const t = TRACKS.find(x => x.id === VIEW.trackId); if(!t) return `<p>Track not found.</p>`;
  const c = trackComplete(t.id);
  let body = `${linkBanner()}
    <button class="backbtn" onclick="go('tracks')">← กลับ Track Mock-up</button>
    ${guideBox()}
    <div class="track-head">
      <div class="track-head-left">
        <div class="track-num">#${String(t.id).padStart(2,'0')}</div>
        <div class="track-headinfo">
          <div class="eyebrow">กลุ่ม ${t.group}${t.repeat ? ' · Repeat track' : ''}</div>
          <div class="grpname">LS+LS ประจำกลุ่ม: ${t.groupLabel}</div>
        </div>
      </div>
      <div class="track-badge ${c?'complete':''}">${c ? '✓ เก็บข้อมูลครบแล้ว' : trackDoneCount(t.id)+' / 4 รอบเสร็จแล้ว'}</div>
    </div><div class="stage-list">`;
  STAGE_ORDER.forEach((k, idx) => {
    const variant = t.stages[idx], st = STATE.tracks[t.id][k], T = TIERS[k], v = verdict(k, st);
    const rk = `${t.id}|${k}`, shown = REVEALED.has(rk);
    const pill = v === null ? `<span class="verdict wait">รอกรอกคำตอบ</span>`
      : v ? `<span class="verdict ok">✓ ถูก (Decision Error = 0)</span>` : `<span class="verdict bad">✗ ผิด (Decision Error = 1)</span>`;
    body += `<div class="stage-card ${st.done?'stage-done':''}">
      <div class="stage-row-top">
        <div class="stage-left">
          <div class="stage-index">${idx}</div>
          <div><div class="stage-title">${stageTitle(k, variant)}</div>
          <div class="stage-sub">ให้ผู้เข้าร่วมเปิดวิชา ${T.course}</div></div>
        </div>
        <div class="stage-right">
          ${figmaBtn(variant, "figma-btn")}
          <label class="done-toggle"><input type="checkbox" class="chk" ${st.done?'checked':''} onchange="toggleStageDone(${t.id}, '${k}', this.checked)">ทำแล้ว</label>
        </div>
      </div>
      <div class="answer-row">
        <span class="answer-hint">คำตอบผู้เข้าร่วม —</span>
        <div class="answer-field"><label for="late-${rk}">Late</label>
          <input id="late-${rk}" type="number" min="0" max="3" placeholder="–" value="${st.late}" onchange="setAnswer(${t.id}, '${k}', 'late', this.value)"></div>
        <div class="answer-field"><label for="quiz-${rk}">Quiz</label>
          <input id="quiz-${rk}" type="number" min="0" max="3" placeholder="–" value="${st.quiz}" onchange="setAnswer(${t.id}, '${k}', 'quiz', this.value)"></div>
        ${pill}
        <button class="reveal" onclick="toggleReveal('${rk}')">${shown ? 'ซ่อนเฉลย' : 'ดูเฉลย'}</button>
        ${(st.late !== "" || st.quiz !== "" || st.done) ? `<button class="reveal reset" onclick="resetStage(${t.id}, '${k}')">รีเซ็ตรอบนี้</button>` : ""}
        ${shown ? `<span class="keybox">เฉลย: Late ${T.late} / Quiz ${T.quiz}</span>` : ""}
      </div></div>`;
  });
  return body + `</div>`;
}
function resetStage(tid, k){
  if(!confirm(`รีเซ็ต Track #${tid} — ${TIERS[k].label}?\nจะล้างคำตอบ Late/Quiz และติ๊ก "ทำแล้ว" ของรอบนี้ (ใน Google Sheet ด้วย)`)) return;
  STATE.tracks[tid][k] = {done:false, late:"", quiz:""};
  REVEALED.delete(`${tid}|${k}`);
  commit(tid, k);
}
function toggleReveal(rk){ REVEALED.has(rk) ? REVEALED.delete(rk) : REVEALED.add(rk); render(); }
function commit(tid, k){ saveLocal(); queueRow(stageRow(tid, k)); render(); }
function toggleStageDone(tid, k, val){ STATE.tracks[tid][k].done = val; commit(tid, k); }
function setAnswer(tid, k, field, val){
  val = val.replace(/[^0-9]/g, ""); if(val !== "") val = String(Math.min(3, parseInt(val)));
  STATE.tracks[tid][k][field] = val; commit(tid, k);
}

/* ---------- router ---------- */
function render(){
  const app = document.getElementById('app');
  app.innerHTML = {index:renderIndex, mockups:renderMockups, tracks:renderTracks, trackDetail:renderTrackDetail}[VIEW.name]();
}
loadLocal(); render();
if(SHEET_ON){ pull(); setInterval(pull, 30000); document.addEventListener("visibilitychange", () => { if(!document.hidden) pull(); }); }
