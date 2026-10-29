/* =====================================================================
   DATA — LEB2 Mockup Console
   ชื่อทุกอย่างอิงตาม paper: HS = High-Salience (เพิ่มความโดดเด่น), LS = Low-Salience (ลดความโดดเด่น)
   แก้ลิงก์ Figma ที่ "FIGMA_LINKS" ด้านล่างที่เดียว (19 บรรทัด) — track ทั้ง 30 อ้างอิงชื่อแบบอัตโนมัติ
   ===================================================================== */

/* วางลิงก์ Figma prototype ของแต่ละแบบที่นี่ (เว้นว่าง "" = ปุ่มจะขึ้นว่ายังไม่มีลิงก์) */
const FIGMA_LINKS = {
  "Baseline": "https://www.figma.com/proto/qr6rOEsr0AGFYxn8Q3mEUq/LEB2-Cheap-copy?node-id=888-87148&p=f&t=gihTjNRA5HHmV20G-1&scaling=min-zoom&content-scaling=fixed&page-id=888%3A23653&starting-point-node-id=888%3A87148&show-proto-sidebar=1",
  // HS+HS
  "Menu(HS)+Button(HS)": "https://www.figma.com/proto/qr6rOEsr0AGFYxn8Q3mEUq/LEB2-Cheap-copy?node-id=888-66940&p=f&t=gihTjNRA5HHmV20G-1&scaling=min-zoom&content-scaling=fixed&page-id=888%3A23653&starting-point-node-id=888%3A66940&show-proto-sidebar=1",
  "Menu(HS)+Status(HS)": "https://www.figma.com/proto/qr6rOEsr0AGFYxn8Q3mEUq/LEB2-Cheap-copy?node-id=888-75587&p=f&t=gihTjNRA5HHmV20G-1&scaling=min-zoom&content-scaling=fixed&page-id=888%3A23653&starting-point-node-id=888%3A75587&show-proto-sidebar=1",
  "Menu(HS)+Search(HS)": "https://www.figma.com/proto/qr6rOEsr0AGFYxn8Q3mEUq/LEB2-Cheap-copy?node-id=888-64081&p=f&t=gihTjNRA5HHmV20G-1&scaling=min-zoom&content-scaling=fixed&page-id=888%3A23653&starting-point-node-id=888%3A64081&show-proto-sidebar=1",
  "Button(HS)+Status(HS)": "https://www.figma.com/proto/qr6rOEsr0AGFYxn8Q3mEUq/LEB2-Cheap-copy?node-id=888-72683&p=f&t=gihTjNRA5HHmV20G-1&scaling=min-zoom&content-scaling=fixed&page-id=888%3A23653&starting-point-node-id=888%3A72683&show-proto-sidebar=1",
  "Status(HS)+Search(HS)": "https://www.figma.com/proto/qr6rOEsr0AGFYxn8Q3mEUq/LEB2-Cheap-copy?node-id=888-78436&p=f&t=gihTjNRA5HHmV20G-1&scaling=min-zoom&content-scaling=fixed&page-id=888%3A23653&starting-point-node-id=888%3A78436&show-proto-sidebar=1",
  "Button(HS)+Search(HS)": "https://www.figma.com/proto/qr6rOEsr0AGFYxn8Q3mEUq/LEB2-Cheap-copy?node-id=888-69789&p=f&t=gihTjNRA5HHmV20G-1&scaling=min-zoom&content-scaling=fixed&page-id=888%3A23653&starting-point-node-id=888%3A69789&show-proto-sidebar=1",
  // LS+HS
  "Status(LS)+Search(HS)": "https://www.figma.com/proto/qr6rOEsr0AGFYxn8Q3mEUq/LEB2-Cheap-copy?node-id=888-52553&p=f&t=gihTjNRA5HHmV20G-1&scaling=min-zoom&content-scaling=fixed&page-id=888%3A23653&starting-point-node-id=888%3A52553&show-proto-sidebar=1",
  "Menu(LS)+Search(HS)": "https://www.figma.com/proto/qr6rOEsr0AGFYxn8Q3mEUq/LEB2-Cheap-copy?node-id=888-55412&p=f&t=gihTjNRA5HHmV20G-1&scaling=min-zoom&content-scaling=fixed&page-id=888%3A23653&starting-point-node-id=888%3A55412&show-proto-sidebar=1",
  "Button(LS)+Search(HS)": "https://www.figma.com/proto/qr6rOEsr0AGFYxn8Q3mEUq/LEB2-Cheap-copy?node-id=888-49700&p=f&t=gihTjNRA5HHmV20G-1&scaling=min-zoom&content-scaling=fixed&page-id=888%3A23653&starting-point-node-id=888%3A49700&show-proto-sidebar=1",
  "Button(LS)+Status(HS)": "https://www.figma.com/proto/qr6rOEsr0AGFYxn8Q3mEUq/LEB2-Cheap-copy?node-id=888-46846&p=f&t=gihTjNRA5HHmV20G-1&scaling=min-zoom&content-scaling=fixed&page-id=888%3A23653&starting-point-node-id=888%3A46846&show-proto-sidebar=1",
  "Menu(LS)+Status(HS)": "https://www.figma.com/proto/qr6rOEsr0AGFYxn8Q3mEUq/LEB2-Cheap-copy?node-id=888-61220&p=f&t=gihTjNRA5HHmV20G-1&scaling=min-zoom&content-scaling=fixed&page-id=888%3A23653&starting-point-node-id=888%3A61220&show-proto-sidebar=1",
  "Menu(LS)+Button(HS)": "https://www.figma.com/proto/qr6rOEsr0AGFYxn8Q3mEUq/LEB2-Cheap-copy?node-id=888-58316&p=f&t=gihTjNRA5HHmV20G-1&scaling=min-zoom&content-scaling=fixed&page-id=888%3A23653&starting-point-node-id=888%3A58316&show-proto-sidebar=1",
  "Status(LS)+Button(HS)": "https://www.figma.com/proto/qr6rOEsr0AGFYxn8Q3mEUq/LEB2-Cheap-copy?node-id=888-43953&p=f&t=gihTjNRA5HHmV20G-1&scaling=min-zoom&content-scaling=fixed&page-id=888%3A23653&starting-point-node-id=888%3A43953&show-proto-sidebar=1",
  "Button(LS)+Menu(HS)": "https://www.figma.com/proto/qr6rOEsr0AGFYxn8Q3mEUq/LEB2-Cheap-copy?node-id=888-41059&p=f&t=gihTjNRA5HHmV20G-1&scaling=min-zoom&content-scaling=fixed&page-id=888%3A23653&starting-point-node-id=888%3A41059&show-proto-sidebar=1",
  "Status(LS)+Menu(HS)": "https://www.figma.com/proto/qr6rOEsr0AGFYxn8Q3mEUq/LEB2-Cheap-copy?node-id=888-38155&p=f&t=gihTjNRA5HHmV20G-1&scaling=min-zoom&content-scaling=fixed&page-id=888%3A23653&starting-point-node-id=888%3A38155&show-proto-sidebar=1",
  // LS+LS
  "Button(LS)+Menu(LS)": "https://www.figma.com/proto/qr6rOEsr0AGFYxn8Q3mEUq/LEB2-Cheap-copy?node-id=888-84245&p=f&t=gihTjNRA5HHmV20G-1&scaling=min-zoom&content-scaling=fixed&page-id=888%3A23653&starting-point-node-id=888%3A84245&show-proto-sidebar=1",
  "Button(LS)+Status(LS)": "https://www.figma.com/proto/qr6rOEsr0AGFYxn8Q3mEUq/LEB2-Cheap-copy?node-id=888-87139&p=f&t=gihTjNRA5HHmV20G-1&scaling=min-zoom&content-scaling=fixed&page-id=888%3A23653&starting-point-node-id=888%3A87139&show-proto-sidebar=1",
  "Menu(LS)+Status(LS)": "https://www.figma.com/proto/qr6rOEsr0AGFYxn8Q3mEUq/LEB2-Cheap-copy?node-id=888-81341&p=f&t=gihTjNRA5HHmV20G-1&scaling=min-zoom&content-scaling=fixed&page-id=888%3A23653&starting-point-node-id=888%3A81341&show-proto-sidebar=1",
};

/* tier = "แม่" ของแต่ละรอบ — เฉลยและวิชาเป้าหมายผูกกับ tier (ไม่ผูกกับแบบลูก)
   course = วิชาที่ผู้เข้าร่วมต้องเปิดตามโจทย์ใน Figma, late/quiz = เฉลยจำนวนงานส่งช้า/ควิซค้าง */
const TIERS = {
  baseline: { label: "Baseline",  course: "MDT 310 Eyes Tracking",        late: 1, quiz: 2 },
  lshs:     { label: "LS+HS",     course: "MDT 313 Web Programming",      late: 2, quiz: 1 },
  hshs:     { label: "HS+HS",     course: "MDT 312 UX/UI Designs",        late: 1, quiz: 2 },
  lsls:     { label: "LS+LS",     course: "MDT 311 Confirmation Bias",    late: 2, quiz: 1 },
};
/* ลำดับรอบทดสอบของทุก track (Test 0 → 3) */
const STAGE_ORDER = ["baseline", "lshs", "hshs", "lsls"];

/* แบบ mock-up ทั้ง 19 (1 baseline + 18) ตามชื่อใน Figma */
const VARIANTS = [
  { id: "Baseline", tier: "baseline" },
  { id: "Menu(HS)+Button(HS)", tier: "hshs" },
  { id: "Menu(HS)+Status(HS)", tier: "hshs" },
  { id: "Menu(HS)+Search(HS)", tier: "hshs" },
  { id: "Button(HS)+Status(HS)", tier: "hshs" },
  { id: "Status(HS)+Search(HS)", tier: "hshs" },
  { id: "Button(HS)+Search(HS)", tier: "hshs" },
  { id: "Status(LS)+Search(HS)", tier: "lshs" },
  { id: "Menu(LS)+Search(HS)", tier: "lshs" },
  { id: "Button(LS)+Search(HS)", tier: "lshs" },
  { id: "Button(LS)+Status(HS)", tier: "lshs" },
  { id: "Menu(LS)+Status(HS)", tier: "lshs" },
  { id: "Menu(LS)+Button(HS)", tier: "lshs" },
  { id: "Status(LS)+Button(HS)", tier: "lshs" },
  { id: "Button(LS)+Menu(HS)", tier: "lshs" },
  { id: "Status(LS)+Menu(HS)", tier: "lshs" },
  { id: "Button(LS)+Menu(LS)", tier: "lsls" },
  { id: "Button(LS)+Status(LS)", tier: "lsls" },
  { id: "Menu(LS)+Status(LS)", tier: "lsls" },
];

/* 30 tracks (ตามชื่อใน Figma) — stages = ชื่อแบบของ Test 0, 1 (LS+HS), 2 (HS+HS), 3 (LS+LS) */
const TRACKS = [
  { id: 1, group: "A", groupLabel: "Button(LS)+Menu(LS)", repeat: false, stages: ["Baseline", "Status(LS)+Search(HS)", "Menu(HS)+Button(HS)", "Button(LS)+Menu(LS)"] },
  { id: 2, group: "A", groupLabel: "Button(LS)+Menu(LS)", repeat: false, stages: ["Baseline", "Status(LS)+Search(HS)", "Menu(HS)+Status(HS)", "Button(LS)+Menu(LS)"] },
  { id: 3, group: "A", groupLabel: "Button(LS)+Menu(LS)", repeat: false, stages: ["Baseline", "Status(LS)+Search(HS)", "Button(HS)+Status(HS)", "Button(LS)+Menu(LS)"] },
  { id: 4, group: "A", groupLabel: "Button(LS)+Menu(LS)", repeat: false, stages: ["Baseline", "Status(LS)+Button(HS)", "Menu(HS)+Status(HS)", "Button(LS)+Menu(LS)"] },
  { id: 5, group: "A", groupLabel: "Button(LS)+Menu(LS)", repeat: false, stages: ["Baseline", "Status(LS)+Button(HS)", "Menu(HS)+Search(HS)", "Button(LS)+Menu(LS)"] },
  { id: 6, group: "A", groupLabel: "Button(LS)+Menu(LS)", repeat: false, stages: ["Baseline", "Status(LS)+Button(HS)", "Status(HS)+Search(HS)", "Button(LS)+Menu(LS)"] },
  { id: 7, group: "A", groupLabel: "Button(LS)+Menu(LS)", repeat: false, stages: ["Baseline", "Status(LS)+Menu(HS)", "Button(HS)+Status(HS)", "Button(LS)+Menu(LS)"] },
  { id: 8, group: "A", groupLabel: "Button(LS)+Menu(LS)", repeat: false, stages: ["Baseline", "Status(LS)+Menu(HS)", "Status(HS)+Search(HS)", "Button(LS)+Menu(LS)"] },
  { id: 9, group: "A", groupLabel: "Button(LS)+Menu(LS)", repeat: false, stages: ["Baseline", "Status(LS)+Menu(HS)", "Button(HS)+Search(HS)", "Button(LS)+Menu(LS)"] },
  { id: 10, group: "A", groupLabel: "Button(LS)+Menu(LS)", repeat: true, stages: ["Baseline", "Status(LS)+Search(HS)", "Menu(HS)+Button(HS)", "Button(LS)+Menu(LS)"] },
  { id: 11, group: "B", groupLabel: "Button(LS)+Status(LS)", repeat: false, stages: ["Baseline", "Menu(LS)+Search(HS)", "Menu(HS)+Button(HS)", "Button(LS)+Status(LS)"] },
  { id: 12, group: "B", groupLabel: "Button(LS)+Status(LS)", repeat: false, stages: ["Baseline", "Menu(LS)+Search(HS)", "Menu(HS)+Status(HS)", "Button(LS)+Status(LS)"] },
  { id: 13, group: "B", groupLabel: "Button(LS)+Status(LS)", repeat: false, stages: ["Baseline", "Menu(LS)+Search(HS)", "Button(HS)+Status(HS)", "Button(LS)+Status(LS)"] },
  { id: 14, group: "B", groupLabel: "Button(LS)+Status(LS)", repeat: false, stages: ["Baseline", "Menu(LS)+Status(HS)", "Menu(HS)+Button(HS)", "Button(LS)+Status(LS)"] },
  { id: 15, group: "B", groupLabel: "Button(LS)+Status(LS)", repeat: false, stages: ["Baseline", "Menu(LS)+Status(HS)", "Menu(HS)+Search(HS)", "Button(LS)+Status(LS)"] },
  { id: 16, group: "B", groupLabel: "Button(LS)+Status(LS)", repeat: false, stages: ["Baseline", "Menu(LS)+Status(HS)", "Button(HS)+Search(HS)", "Button(LS)+Status(LS)"] },
  { id: 17, group: "B", groupLabel: "Button(LS)+Status(LS)", repeat: false, stages: ["Baseline", "Menu(LS)+Button(HS)", "Menu(HS)+Status(HS)", "Button(LS)+Status(LS)"] },
  { id: 18, group: "B", groupLabel: "Button(LS)+Status(LS)", repeat: false, stages: ["Baseline", "Menu(LS)+Button(HS)", "Menu(HS)+Search(HS)", "Button(LS)+Status(LS)"] },
  { id: 19, group: "B", groupLabel: "Button(LS)+Status(LS)", repeat: false, stages: ["Baseline", "Menu(LS)+Button(HS)", "Status(HS)+Search(HS)", "Button(LS)+Status(LS)"] },
  { id: 20, group: "B", groupLabel: "Button(LS)+Status(LS)", repeat: true, stages: ["Baseline", "Menu(LS)+Search(HS)", "Menu(HS)+Button(HS)", "Button(LS)+Status(LS)"] },
  { id: 21, group: "C", groupLabel: "Menu(LS)+Status(LS)", repeat: false, stages: ["Baseline", "Button(LS)+Search(HS)", "Menu(HS)+Button(HS)", "Menu(LS)+Status(LS)"] },
  { id: 22, group: "C", groupLabel: "Menu(LS)+Status(LS)", repeat: false, stages: ["Baseline", "Button(LS)+Search(HS)", "Menu(HS)+Status(HS)", "Menu(LS)+Status(LS)"] },
  { id: 23, group: "C", groupLabel: "Menu(LS)+Status(LS)", repeat: false, stages: ["Baseline", "Button(LS)+Search(HS)", "Button(HS)+Status(HS)", "Menu(LS)+Status(LS)"] },
  { id: 24, group: "C", groupLabel: "Menu(LS)+Status(LS)", repeat: false, stages: ["Baseline", "Button(LS)+Status(HS)", "Menu(HS)+Button(HS)", "Menu(LS)+Status(LS)"] },
  { id: 25, group: "C", groupLabel: "Menu(LS)+Status(LS)", repeat: false, stages: ["Baseline", "Button(LS)+Status(HS)", "Menu(HS)+Search(HS)", "Menu(LS)+Status(LS)"] },
  { id: 26, group: "C", groupLabel: "Menu(LS)+Status(LS)", repeat: false, stages: ["Baseline", "Button(LS)+Status(HS)", "Button(HS)+Search(HS)", "Menu(LS)+Status(LS)"] },
  { id: 27, group: "C", groupLabel: "Menu(LS)+Status(LS)", repeat: false, stages: ["Baseline", "Button(LS)+Menu(HS)", "Button(HS)+Status(HS)", "Menu(LS)+Status(LS)"] },
  { id: 28, group: "C", groupLabel: "Menu(LS)+Status(LS)", repeat: false, stages: ["Baseline", "Button(LS)+Menu(HS)", "Status(HS)+Search(HS)", "Menu(LS)+Status(LS)"] },
  { id: 29, group: "C", groupLabel: "Menu(LS)+Status(LS)", repeat: false, stages: ["Baseline", "Button(LS)+Menu(HS)", "Button(HS)+Search(HS)", "Menu(LS)+Status(LS)"] },
  { id: 30, group: "C", groupLabel: "Menu(LS)+Status(LS)", repeat: true, stages: ["Baseline", "Button(LS)+Search(HS)", "Menu(HS)+Button(HS)", "Menu(LS)+Status(LS)"] },
];
