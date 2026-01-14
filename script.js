// ===== Voices (Web Speech API) =====
let voices=[]; const vSel=document.getElementById('voice');
function loadVoices(){ voices=speechSynthesis.getVoices(); vSel.innerHTML='';
  voices.forEach((v,i)=>{ const o=document.createElement('option'); o.value=i; o.textContent=v.name+' ('+v.lang+')'; vSel.appendChild(o); }); }
speechSynthesis.onvoiceschanged=loadVoices;

// ===== Speak + Mouth Sync =====
const canvas=document.getElementById('avatar'); const ctx=canvas.getContext('2d');
function drawMouth(open){ ctx.clearRect(0,0,300,300); ctx.fillStyle='#0ff'; ctx.fillRect(90,150,120, open? (20+Math.random()*40):20); }

document.getElementById('play').onclick=()=>{
  const u=new SpeechSynthesisUtterance(document.getElementById('text').value);
  u.voice=voices[vSel.value]; u.lang=document.getElementById('lang').value;
  u.onstart=()=> mouthInterval=setInterval(()=>drawMouth(true),60);
  u.onend=()=>{ clearInterval(mouthInterval); drawMouth(false); };
  speechSynthesis.speak(u);
};

// ===== Record Audio (Frontend-only) =====
let mediaRecorder, chunks=[];
document.getElementById('record').onclick=async()=>{
  const stream=await navigator.mediaDevices.getDisplayMedia({ audio:true, video:false });
  mediaRecorder=new MediaRecorder(stream); chunks=[];
  mediaRecorder.ondataavailable=e=>chunks.push(e.data);
  mediaRecorder.start(); alert('Recording... Play voice now');
};

document.getElementById('save').onclick=()=>{
  if(!chunks.length) return alert('No recording');
  const blob=new Blob(chunks,{type:chunks[0].type});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='voice.webm'; a.click();
};

// ===== Theme =====
document.getElementById('theme').onchange=e=>document.body.className=e.target.value;

// ===== FPS =====
let f=0,l=performance.now();
function fps(n){ f++; if(n-l>1000){ document.getElementById('fps').innerText='FPS: '+f; f=0; l=n; } requestAnimationFrame(fps); }
requestAnimationFrame(fps);
