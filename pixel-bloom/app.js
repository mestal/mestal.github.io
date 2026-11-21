(function(){
const LINKS={android:"https://play.google.com/store/apps/details?id=com.mestal.nonogram",ios:""};
const NAMES={en:"English",tr:"Türkçe",de:"Deutsch",fr:"Français",es:"Español",pt:"Português",it:"Italiano",pl:"Polski",nl:"Nederlands",sv:"Svenska",nb:"Norsk",da:"Dansk",fi:"Suomi",cs:"Čeština",hu:"Magyar",ro:"Română",bg:"Български",el:"Ελληνικά",ru:"Русский",uk:"Українська",id:"Indonesia",ms:"Melayu",fil:"Filipino",vi:"Tiếng Việt",sw:"Kiswahili",ar:"العربية",fa:"فارسی",ur:"اردو",hi:"हिन्दी",mr:"मराठी",bn:"বাংলা",pa:"ਪੰਜਾਬੀ",ta:"தமிழ்",te:"తెలుగు",th:"ไทย",zh:"中文",ja:"日本語",ko:"한국어"};
const RTL=["ar","fa","ur"],K=window.I18N_KEYS,PB=window.PB,$=s=>document.querySelector(s);
let lang="en";
const t=k=>{const a=I18N[lang]||I18N.en,i=K.indexOf(k);return a[i]||I18N.en[i]||""};
const nm=o=>o[lang]||o.en;

document.querySelectorAll("[data-play]").forEach(a=>a.href=LINKS.android);
const sel=$("#lang");
Object.keys(NAMES).forEach(c=>{const o=document.createElement("option");o.value=c;o.textContent=NAMES[c];sel.appendChild(o)});

function applyLang(c,save){
  lang=I18N[c]?c:"en";sel.value=lang;
  const h=document.documentElement;h.lang=lang;h.dir=RTL.includes(lang)?"rtl":"ltr";
  document.querySelectorAll("[data-i18n]").forEach(e=>{e.textContent=t(e.dataset.i18n)});
  document.title=t("title");
  const sfx=lang==="tr"?"":"-en";
  $("#fp").href="../pixel-bloom-privacy"+sfx+".html";$("#fs").href="../pixel-bloom-support"+sfx+".html";
  if(save)try{localStorage.setItem("pb-lang",lang)}catch(e){}
  renderMaps();renderGal();drawHud();renderBoard(true);
}
sel.onchange=()=>applyLang(sel.value,true);

/* maps */
function renderMaps(){
  $("#chips").innerHTML=PB.worlds.map((w,i)=>`<div class="chip rv in"><b>${nm(w.name)}</b><small>${t("m1").replace("{a}",i*20+1).replace("{b}",i*20+20)}</small></div>`).join("");
}
/* gallery */
let galBuilt=false;
function drawPic(cv,p){
  const n=p.col.length;cv.width=cv.height=n;const x=cv.getContext("2d");
  p.col.forEach((r,y)=>[...r].forEach((ch,i)=>{const c=p.pal[ch];if(c){x.fillStyle=c;x.fillRect(i,y,1,1)}}));
}
function renderGal(){
  const g=$("#gal");
  if(!galBuilt){
    PB.pics.forEach((p,i)=>{const b=document.createElement("button");const c=document.createElement("canvas");drawPic(c,p);b.appendChild(c);b.dataset.i=i;
      b.onclick=()=>{g.querySelectorAll(".on").forEach(e=>e.classList.remove("on"));b.classList.add("on");sel_=i;$("#gname").textContent=nm(p.name)};g.appendChild(b)});
    galBuilt=true;
  }
  if(sel_>=0)$("#gname").textContent=nm(PB.pics[sel_].name);
}
let sel_=-1;

/* demo */
let lv=0,st,hearts,score,combo,mode="f",done;
const D=()=>PB.demo[lv%PB.demo.length];
function clues(line){const o=[];let c=0;line.forEach(v=>{if(v){c++}else if(c){o.push(c);c=0}});if(c)o.push(c);return o.length?o:[0]}
function startLevel(){
  const d=D();st=d.sol.map(r=>[...r].map(()=>0));hearts=3;done=false;combo=0;
  if(lv===0||restarting)score=0;
  $("#msg").textContent="";$("#msg").className="msg";$("#next").style.display="none";
  renderBoard(false);drawHud();
}
let restarting=false;
function renderBoard(keep){
  const d=D(),n=d.sol.length,m=d.sol[0].length,box=$("#boardBox");
  const rows=d.sol.map(r=>[...r].map(c=>c==="#"?1:0));
  const rc=rows.map(clues),cc=[...Array(m)].map((_,j)=>clues(rows.map(r=>r[j])));
  box.innerHTML="";const b=document.createElement("div");b.className="board";
  b.style.gridTemplateColumns=`auto repeat(${m},auto)`;b.id="board";
  b.appendChild(document.createElement("div"));
  cc.forEach((c,j)=>{const e=document.createElement("div");e.className="clue col";e.id="cc"+j;e.innerHTML=c.map(v=>`<span>${v}</span>`).join("");b.appendChild(e)});
  for(let i=0;i<n;i++){
    const r=document.createElement("div");r.className="clue row";r.id="rc"+i;r.innerHTML=rc[i].map(v=>`<span>${v}</span>`).join(" ");b.appendChild(r);
    for(let j=0;j<m;j++){const e=document.createElement("div");e.className="cell";e.dataset.i=i;e.dataset.j=j;b.appendChild(e)}
  }
  box.appendChild(b);paint();
  let down=false;
  b.addEventListener("pointerdown",e=>{const c=e.target.closest(".cell");if(!c)return;e.preventDefault();down=true;act(c)});
  b.addEventListener("pointerover",e=>{if(!down)return;const c=e.target.closest(".cell");if(c)act(c)});
  window.addEventListener("pointerup",()=>down=false);
  b.addEventListener("pointercancel",()=>down=false);
  b.addEventListener("contextmenu",e=>e.preventDefault());
}
function paint(){
  const d=D();
  document.querySelectorAll(".cell").forEach(e=>{
    const i=+e.dataset.i,j=+e.dataset.j,s=st[i][j];e.className="cell";e.textContent="";e.style.background="";
    if(done){const ch=d.col[i][j],c=d.pal[ch];if(d.sol[i][j]==="#"&&c){e.style.background=c;e.classList.add("bloom")}else e.style.background="#2a1a55";return}
    if(s===1)e.classList.add("f");else if(s===2){e.classList.add("x");e.textContent="✕"}else if(s===3){e.classList.add("bad");e.textContent="✕"}
  });
  const n=d.sol.length,m=d.sol[0].length;
  for(let i=0;i<n;i++)$("#rc"+i).classList.toggle("done",[...d.sol[i]].every((c,j)=>c!=="#"||st[i][j]===1));
  for(let j=0;j<m;j++)$("#cc"+j).classList.toggle("done",d.sol.every((r,i)=>r[j]!=="#"||st[i][j]===1));
}
function drawHud(){
  $("#hearts").textContent="❤️".repeat(Math.max(hearts||0,0))+"🖤".repeat(Math.max(3-(hearts||0),0));
  $("#score").textContent=score||0;$("#combo").textContent=combo>=5?"x"+Math.min(1+Math.floor(combo/5),5):"";
  $("#mFill").classList.toggle("on",mode==="f");$("#mMark").classList.toggle("on",mode==="m");
  if(done)$("#msg").textContent=t("d6");
}
function act(c){
  if(done||hearts<=0)return;
  const i=+c.dataset.i,j=+c.dataset.j,d=D(),sol=d.sol[i][j]==="#";
  if(st[i][j]===1||st[i][j]===3||(mode==="m"&&st[i][j]===2))return;
  if(mode==="f"){
    if(sol){const mul=Math.min(1+Math.floor(combo/5),5);combo++;score+=10*mul;st[i][j]=1;checkLines(i,j)}
    else{st[i][j]=3;miss()}
  }else{
    if(sol){miss()}else st[i][j]=2;
  }
  paint();drawHud();
  if(d.sol.every((r,a)=>[...r].every((ch,b)=>ch!=="#"||st[a][b]===1))){
    done=true;score+=100+50*hearts+(hearts===3?200:0);paint();drawHud();confetti();$("#next").style.display="";
  }else if(hearts<=0){$("#msg").textContent=t("d7");$("#msg").className="msg bad"}
}
function miss(){hearts--;combo=0;$("#msg").className="msg bad";$("#msg").textContent="💔"}
function checkLines(i,j){
  const d=D();let k=0;
  if([...d.sol[i]].every((ch,b)=>ch!=="#"||st[i][b]===1))k++;
  if(d.sol.every((r,a)=>r[j]!=="#"||st[a][j]===1))k++;
  if(k){score+=50*k*Math.min(1+Math.floor(combo/5),5)}
  $("#msg").className="msg";$("#msg").textContent="";
}
$("#mFill").onclick=()=>{mode="f";drawHud()};
$("#mMark").onclick=()=>{mode="m";drawHud()};
$("#restart").onclick=()=>{restarting=true;startLevel();restarting=false};
$("#next").onclick=()=>{lv++;startLevel()};

/* confetti */
const cv=$("#cf"),cx=cv.getContext("2d");let ps=[],raf=0;
function size(){cv.width=innerWidth;cv.height=innerHeight}size();addEventListener("resize",size);
function confetti(){
  const cols=["#ff5fa2","#ffd23f","#3ddc97","#4cc9f0","#ff8a3d"];
  for(let i=0;i<120;i++)ps.push({x:innerWidth/2+(Math.random()-.5)*200,y:innerHeight*.55,vx:(Math.random()-.5)*14,vy:-Math.random()*16-4,s:5+Math.random()*7,c:cols[i%5],r:Math.random()*6});
  if(!raf)loop();
}
function loop(){
  cx.clearRect(0,0,cv.width,cv.height);
  ps.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.45;p.r+=.2;cx.save();cx.translate(p.x,p.y);cx.rotate(p.r);cx.fillStyle=p.c;cx.fillRect(-p.s/2,-p.s/2,p.s,p.s*.6);cx.restore()});
  ps=ps.filter(p=>p.y<innerHeight+30);
  raf=ps.length?requestAnimationFrame(loop):0;if(!raf)cx.clearRect(0,0,cv.width,cv.height);
}

/* misc */
addEventListener("scroll",()=>$("#nav").classList.toggle("sc",scrollY>20),{passive:true});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll(".rv").forEach(e=>io.observe(e));

let init="en";
try{init=localStorage.getItem("pb-lang")||""}catch(e){}
if(!init){const n=(navigator.language||"en").toLowerCase();init=I18N[n]?n:(I18N[n.split("-")[0]]?n.split("-")[0]:(n.startsWith("nb")||n.startsWith("no")?"nb":"en"))}
score=0;hearts=3;startLevel();
applyLang(init,false);
})();
