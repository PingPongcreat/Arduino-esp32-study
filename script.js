const plan=[
["พื้นฐาน ESP32 และไฟฟ้า","GPIO, 3.3V/5V, GND, ขั้ว LED, setup() / loop()"],
["LED เปิด–ปิดและกระพริบ","pinMode(), digitalWrite(), delay()"],
["LED หลายดวง","if/else, ตัวแปร, ไฟสลับและไฟวิ่ง"],
["RGB LED","R/G/B, Common Anode/Cathode และการผสมสี"],
["PWM บน ESP32","ปรับความสว่างด้วย LEDC"],
["Ultrasonic","Trig/Echo, pulseIn() และคำนวณระยะ"],
["ทบทวนสัปดาห์แรก","รวม LED + RGB + Ultrasonic และทำข้อสอบ"],
["เงื่อนไขและระยะทาง","แบ่งระยะใกล้/กลาง/ไกลด้วย if/else"],
["ตัวแปรและการคำนวณ","int, long, float, boolean และสูตร"],
["ดีบักโค้ด","Serial Monitor, ตรวจสายและแก้ compile error"],
["พื้นฐาน IoT","Sensor, Actuator, Wi-Fi, IP และการส่งข้อมูล"],
["โจทย์รวมอุปกรณ์","Ultrasonic + RGB + LCD"],
["จำลองสอบปฏิบัติ","จับเวลา ต่อวงจร เขียนโค้ด ทดสอบ"],
["สอบจำลองรอบสุดท้าย","ทบทวนสูตรและอธิบายผลงาน"]
];
const STORE_KEY='iot-trainer-v1';
function loadStore(){try{const d=JSON.parse(localStorage.getItem(STORE_KEY));return d&&typeof d==='object'?d:{}}catch(e){return {}}}
function saveStore(d){try{localStorage.setItem(STORE_KEY,JSON.stringify(d));return true}catch(e){return false}}
const store=loadStore();
store.plans=store.plans||{};
store.checks=store.checks||{};
const planEl=document.querySelector('#plan');
function fmtTime(t){return new Date(t).toLocaleString('th-TH',{dateStyle:'medium',timeStyle:'short'})}
function renderStatus(card,rec){
  const st=card.querySelector('.save-status');
  card.classList.toggle('saved',!!rec);
  st.textContent=rec?`✓ บันทึกแล้ว ${fmtTime(rec.savedAt)}`:'ยังไม่บันทึก';
  card.querySelector('.clear-btn').hidden=!rec;
}
plan.forEach((d,i)=>{
  const card=document.createElement('div');card.className='day';card.dataset.plan=i;
  card.innerHTML=`<b class="plan-title"></b><small class="plan-desc"></small><textarea class="plan-note" rows="3" placeholder="จดบันทึก: วันนี้ทำอะไร ติดปัญหาอะไร"></textarea><div class="plan-actions"><button type="button" class="button primary save-btn">บันทึก</button><button type="button" class="button secondary clear-btn" hidden>ล้าง</button><span class="save-status"></span></div>`;
  card.querySelector('.plan-title').textContent=d[0];
  card.querySelector('.plan-desc').textContent=d[1];
  const note=card.querySelector('.plan-note');
  const rec=store.plans[i];
  if(rec)note.value=rec.note||'';
  renderStatus(card,rec);
  card.querySelector('.save-btn').addEventListener('click',()=>{
    store.plans[i]={note:note.value,savedAt:Date.now()};
    const ok=saveStore(store);
    if(!ok){card.querySelector('.save-status').textContent='บันทึกไม่สำเร็จ (เบราว์เซอร์บล็อกการเก็บข้อมูล)';return}
    renderStatus(card,store.plans[i]);updateProgress();
  });
  card.querySelector('.clear-btn').addEventListener('click',()=>{
    if(!confirm('ล้างบันทึกของแผนนี้?'))return;
    delete store.plans[i];saveStore(store);note.value='';renderStatus(card,null);updateProgress();
  });
  planEl.append(card);
});
function updateProgress(){
  const n=Object.keys(store.plans).length;
  document.querySelector('#progressText').textContent=`${n}/${plan.length} แผน`;
  document.querySelector('#progressBar').style.width=`${n/plan.length*100}%`;
}
updateProgress();
document.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x===btn));document.querySelectorAll('.lesson').forEach(x=>x.classList.toggle('active',x.id===btn.dataset.tab))}));
const questions=[
["GPIO ที่ตั้งเป็น OUTPUT ใช้ทำอะไร?",["รับสัญญาณเข้าบอร์ด","ส่งสัญญาณออกจากบอร์ด","เชื่อมต่อ Wi-Fi","เก็บข้อมูล"],1,"OUTPUT ใช้ควบคุมอุปกรณ์ภายนอก เช่น LED"],
["delay(500) หน่วงเวลากี่วินาที?",["5","0.5","50","500"],1,"delay() ใช้หน่วยมิลลิวินาที ดังนั้น 500 ms = 0.5 วินาที"],
["RGB แบบ Common Cathode ต้องการสีเหลืองควรสั่งอย่างไร?",["R=HIGH G=HIGH B=LOW","R=LOW G=LOW B=HIGH","ทุกขา LOW","R=HIGH G=LOW B=HIGH"],0,"สีเหลืองเกิดจากแดงและเขียวติดพร้อมกัน"],
["ขาใดของ HC-SR04 ส่งสัญญาณสะท้อนกลับ?",["VCC","GND","Trig","Echo"],3,"Echo เป็นสัญญาณที่ใช้จับเวลาคลื่นเสียงเดินทางไปและกลับ"],
["ถ้า Echo ใช้เวลา 2,000 µs ระยะประมาณเท่าใด?",["17.15 cm","34.3 cm","68.6 cm","6.86 cm"],1,"2,000 × 0.0343 ÷ 2 = 34.3 cm"],
["เหตุใด LED จึงควรต่อตัวต้านทาน?",["เพิ่มแรงดัน","จำกัดกระแส","เพิ่มความเร็ว","แปลงเป็น Analog"],1,"ตัวต้านทานจำกัดกระแสเพื่อป้องกัน LED เสียหาย"],
["lcd.backlight() ทำหน้าที่อะไร?",["ล้างจอ","เปิดไฟพื้นหลัง","แสดงข้อความ","ย้ายเคอร์เซอร์"],1,"ใช้เปิดไฟพื้นหลัง LCD"],
["lcd.setCursor(0,1) หมายถึงอะไร?",["คอลัมน์ 0 แถว 1","คอลัมน์ 1 แถว 0","ล้างจอ","ปิดจอ"],0,"อาร์กิวเมนต์แรกคือคอลัมน์ ตัวที่สองคือแถว เริ่มนับจาก 0"],
["LCD 1602 มีลักษณะอย่างไร?",["16 แถว 2 คอลัมน์","16 คอลัมน์ 2 แถว","1602 พิกเซล","16 สี 2 บิต"],1,"หมายถึง 16 ตัวอักษรต่อแถว จำนวน 2 แถว"],
["ทำไม Echo ของ HC-SR04 ต้องลดระดับแรงดันก่อนเข้า ESP32?",["ESP32 ต้องการ 12V","GPIO ESP32 ไม่ทนสัญญาณ 5V","เพื่อเพิ่มความเร็ว","เพื่อใช้ I2C"],1,"GPIO ของ ESP32 ใช้ลอจิก 3.3V จึงต้องแบ่งแรงดัน Echo 5V ลงให้เหมาะสม"]
];
const quiz=document.querySelector('#quiz');
questions.forEach((q,i)=>{const div=document.createElement('div');div.className='question';div.innerHTML=`<p>${i+1}. ${q[0]}</p>`+q[1].map((o,j)=>`<label class="option"><input type="radio" name="q${i}" value="${j}">${String.fromCharCode(65+j)}. ${o}</label>`).join('')+`<div class="explain" hidden></div>`;quiz.append(div)});
document.querySelector('#grade').addEventListener('click',()=>{let score=0;questions.forEach((q,i)=>{const chosen=quiz.querySelector(`input[name="q${i}"]:checked`);const box=quiz.children[i].querySelector('.explain');box.hidden=false;if(chosen&&Number(chosen.value)===q[2]){score++;box.innerHTML='<b style="color:#59d6a2">ถูกต้อง ✓</b><br>'+q[3]}else{box.innerHTML='<b style="color:#ff9b9b">คำตอบ: '+String.fromCharCode(65+q[2])+'</b><br>'+q[3]}});document.querySelector('#result').textContent=`คะแนนของคุณ ${score}/10 คะแนน`});
document.querySelector('#resetQuiz').addEventListener('click',()=>{setTimeout(()=>{document.querySelectorAll('.explain').forEach(x=>x.hidden=true);document.querySelector('#result').textContent=''},0)});
const checks=["ต่อสายไฟและ GND ถูกต้อง","กำหนด GPIO ตรงกับวงจร","ใส่ตัวต้านทานให้ LED","ลดแรงดัน Echo ก่อนเข้า ESP32","คอมไพล์ผ่าน ไม่มี Error","ทดสอบเงื่อนไขครบทุกกรณี","ตรวจกรณี Ultrasonic อ่านค่าไม่ได้","อธิบายการทำงานของโค้ดได้"];
const checkEl=document.querySelector('#checklist');checks.forEach((x,i)=>{const l=document.createElement('label');l.className='checkitem';l.innerHTML=`<input type="checkbox"> <span></span>`;l.querySelector('span').textContent=x;const cb=l.querySelector('input');cb.checked=!!store.checks[i];cb.addEventListener('change',()=>{if(cb.checked)store.checks[i]=true;else delete store.checks[i];saveStore(store)});checkEl.append(l)});
