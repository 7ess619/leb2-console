# ตั้งค่าซิงค์ Google Sheet (ทำครั้งเดียว ~5 นาที)

1. อัพโหลดไฟล์ `LEB2-Tracking-template.xlsx` ขึ้น Google Drive แล้วเปิดด้วย Google Sheets (ไฟล์มีแท็บ Tracks 120 แถว, Mockups 19 แถว และ Summary พร้อมแล้ว) — ถ้าอยากเริ่มจากชีตเปล่าก็ได้ สคริปต์จะสร้างแท็บให้เอง แต่จะไม่มีแถวล่วงหน้าและ Summary
2. เมนู **Extensions → Apps Script** ลบโค้ดเดิมทิ้ง แล้ววางทั้งไฟล์ `apps-script.gs`
3. แก้บรรทัด `const SECRET = '...'` เป็นรหัสที่ทีมตกลงกัน (อย่าใช้รหัสอื่นที่ใช้งานอยู่) แล้วกด Save
4. กด **Deploy → New deployment** → ไอคอนเฟือง เลือก **Web app**
   - Execute as: **Me** 
   - Who has access: **Anyone**
   - กด Deploy → อนุญาตสิทธิ์ (Google จะเตือนว่า app ไม่ได้ verify: กด Advanced → Go to … → Allow)
5. ก๊อป **Web app URL** (ลงท้าย `/exec`)
6. เปิด `config.js` ใส่ค่า
   ```js
   SHEET_URL: "https://script.google.com/macros/s/....../exec", 
   SHEET_KEY: "รหัสเดียวกับ SECRET",
   ```
7. อัพขึ้น GitHub Pages ตามปกติ ที่มุมขวาบนของเว็บจะขึ้น `SHEET: ซิงค์แล้ว`

## ข้อควรรู้
- Sheet จะสร้างแท็บ `Tracks` กับ `Mockups` ให้เอง และเพิ่มแถวเมื่อมีการติ๊ก/กรอกครั้งแรก
- แท็บ `Tracks` มีคอลัมน์ `decision_error` (0 = ตอบถูก, 1 = ตอบผิด) พร้อมใช้ใน SPSS
- เก็บเฉพาะเลข Track, รอบ, สถานะ, คำตอบ Late/Quiz ไม่มีชื่อหรือรหัสนักศึกษา
- เว็บดึงข้อมูลใหม่ทุก 30 วินาที และเมื่อสลับกลับมาที่แท็บ
- ถ้าแก้โค้ด Apps Script ภายหลัง ต้อง **Deploy → Manage deployments → แก้เป็น New version** URL ถึงจะใช้โค้ดใหม่
- ค่า `SHEET_KEY` อยู่ในซอร์สบน GitHub ใครเปิด repo ได้ก็เห็น ถ้า repo เป็น public ให้ถือว่ารหัสนี้เป็นแค่กันคนเขียนมั่ว ไม่ใช่ความลับจริง
- เฉลยไม่ถูกส่งไปไหน ฝังอยู่ใน `data.js` (ตาราง `TIERS`) ถ้าเฉลยต้องเป็นความลับต่อผู้เข้าร่วม อย่าเปิดหน้าเว็บนี้ให้เขาเห็น
