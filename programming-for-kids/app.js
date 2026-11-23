(function(){
const PLAY_URL="https://play.google.com/store/apps/details?id=com.mestal.programmingforkids";
const NAMES={en:"English",tr:"Türkçe",de:"Deutsch",es:"Español",fr:"Français",pt:"Português",ru:"Русский",ar:"العربية"};
const RTL=["ar"],$=s=>document.querySelector(s);
let lang="en";
const t=k=>(I18N[lang]&&I18N[lang][k])||I18N.en[k]||"";

document.querySelectorAll("[data-play]").forEach(a=>a.href=PLAY_URL);
const sel=$("#lang");
Object.keys(NAMES).forEach(c=>{const o=document.createElement("option");o.value=c;o.textContent=NAMES[c];sel.appendChild(o)});

function applyLang(c,save){
  lang=I18N[c]?c:"en";sel.value=lang;
  const h=document.documentElement;h.lang=lang;h.dir=RTL.includes(lang)?"rtl":"ltr";
  document.querySelectorAll("[data-i18n]").forEach(e=>{e.textContent=t(e.dataset.i18n)});
  document.title=t("title");
  if(save)try{localStorage.setItem("pfk-lang",lang)}catch(e){}
  renderDemo();
}
sel.onchange=()=>applyLang(sel.value,true);

/* ---------- mini game demo ---------- */
const ARW={R:"→",L:"←",U:"↑",D:"↓",P:"🔌",S:"⭐"};
const DIR={R:[0,1],L:[0,-1],U:[-1,0],D:[1,0]};
const LEVELS=[
 {robot:[2,0],bat:[2,4],walls:[],main:6,star:0,rep:false,hint:"l1h"},
 {robot:[1,2],bat:[3,4],walls:[[2,1],[2,2],[2,3]],main:6,star:0,rep:false,hint:"l2h"},
 {robot:[4,0],bat:[0,4],walls:[],main:3,star:0,rep:true,hint:"l3h"},
 {robot:[4,0],bat:[0,4],walls:[[0,0],[0,1],[0,2],[0,3],[1,0],[1,1],[1,2],[2,0],[2,1],[2,4],[3,0],[3,3],[3,4],[4,2],[4,3],[4,4]],main:3,star:3,rep:true,hint:"l4h"}
];
let lv=0,main=[],star=[],focus="main",running=false,timer=0,pos=[0,0],won=[false,false,false,false];

function cur(){return LEVELS[lv]}
function list(n){return n==="main"?main:star}
function cap(n){return n==="main"?cur().main:cur().star}

function setMsg(k,bad){const m=$("#msg");m.textContent=k?t(k):"";m.className="msg"+(bad?" bad":"")}

function loadLevel(i){
  clearInterval(timer);running=false;
  lv=i;main=[];star=[];focus="main";pos=cur().robot.slice();
  $("#bNext").style.display="none";setMsg("");
  renderDemo();
}
function renderBoard(){
  const L=cur(),b=$("#board");b.innerHTML="";
  for(let r=0;r<5;r++)for(let c=0;c<5;c++){
    const d=document.createElement("div");d.className="cell";
    if(L.walls.some(w=>w[0]===r&&w[1]===c))d.classList.add("w");
    if(L.bat[0]===r&&L.bat[1]===c&&!L.taken){d.innerHTML='<img src="assets/img/battery.png" alt="">'}
    b.appendChild(d);
  }
  const rb=document.createElement("div");rb.className="robot";rb.id="robot";
  rb.innerHTML='<img src="assets/img/robot.png" alt="">';b.appendChild(rb);
  moveRobot();
}
function moveRobot(){
  const rb=$("#robot");if(!rb)return;
  const cs=rb.offsetWidth+2; // cell + gap
  rb.style.transform=`translate(${pos[1]*cs}px,${pos[0]*cs}px)`;
}
function renderLists(){
  ["main","star"].forEach(n=>{
    const box=$(n==="main"?"#slotsMain":"#slotsStar");box.innerHTML="";
    const l=list(n),cp=cap(n);
    for(let i=0;i<cp;i++){
      const s=document.createElement("div");s.className="slot";
      if(l[i]){s.textContent=ARW[l[i].t];if(l[i].n>1){const sb=document.createElement("sub");sb.textContent=l[i].n;s.appendChild(sb)}
        s.onclick=e=>{e.stopPropagation();if(running)return;l.splice(i,1);focus=n;renderLists()}}
      else if(i===l.length&&focus===n)s.classList.add("next");
      s.dataset.i=i;box.appendChild(s);
    }
  });
  $("#rowMain").classList.toggle("foc",focus==="main"&&cur().star>0);
  $("#rowStar").classList.toggle("foc",focus==="star");
}
function renderPal(){
  const L=cur(),p=$("#pal");p.innerHTML="";
  const types=["R","L","U","D","P"];if(L.star)types.push("S");
  types.forEach(k=>{
    const b=document.createElement("button");b.textContent=ARW[k];b.setAttribute("aria-label",k);
    b.onclick=()=>add(k);p.appendChild(b);
  });
  if(L.rep){const b=document.createElement("button");b.className="rep";b.textContent="🔁 "+t("d12");b.onclick=repeat;p.appendChild(b)}
}
function add(k){
  if(running)return;
  if(k==="S"&&focus==="star")return;
  const l=list(focus);
  if(l.length>=cap(focus)){setMsg("d13",true);return}
  l.push({t:k,n:1});setMsg("");renderLists();
}
function repeat(){
  if(running)return;
  const l=list(focus);if(!l.length)return;
  const b=l[l.length-1];if(b.t==="P")return;
  b.n=b.n>=5?1:b.n+1;renderLists();
}
function renderDots(){
  $("#dots").innerHTML=LEVELS.map((_,i)=>`<i class="${won[i]?"ok":i===lv?"on":""}"></i>`).join("");
  $("#lvn").textContent=lv+1;
}
function renderDemo(){
  const L=cur();L.taken=false;
  $("#hint").textContent=t(L.hint);
  const nx=$("#bNext span");nx.dataset.i18n=lv===LEVELS.length-1?"d7":"d6";nx.textContent=t(nx.dataset.i18n);
  $("#rowStar").style.display=L.star?"flex":"none";
  renderDots();renderBoard();renderPal();renderLists();
  requestAnimationFrame(moveRobot);
}
$("#rowMain").onclick=()=>{if(!running){focus="main";renderLists()}};
$("#rowStar").onclick=()=>{if(!running){focus="star";renderLists()}};
$("#bClear").onclick=()=>{if(running)return;main=[];star=[];focus="main";setMsg("");renderLists()};
$("#bReset").onclick=()=>{loadLevel(lv)};
$("#bNext").onclick=()=>{if(lv<LEVELS.length-1)loadLevel(lv+1);else loadLevel(0)};

/* run */
function compile(){
  const out=[];
  main.forEach((b,i)=>{
    for(let k=0;k<b.n;k++){
      if(b.t==="S"){star.forEach(sb=>{for(let j=0;j<sb.n;j++)out.push({t:sb.t,l:"star",i:star.indexOf(sb)})})}
      else out.push({t:b.t,l:"main",i});
    }
  });
  return out;
}
$("#bPlay").onclick=()=>{
  if(running)return;
  const L=cur();L.taken=false;pos=L.robot.slice();renderBoard();setMsg("");
  const steps=compile();if(!steps.length)return;
  running=true;let k=0;
  const finish=(ok,key)=>{
    clearInterval(timer);running=false;
    document.querySelectorAll(".slot.run").forEach(e=>e.classList.remove("run"));
    if(ok){won[lv]=true;setMsg(lv===LEVELS.length-1?"d14":"d8");$("#bNext").style.display="";confetti();renderDots()}
    else{setMsg(key,true)}
  };
  timer=setInterval(()=>{
    document.querySelectorAll(".slot.run").forEach(e=>e.classList.remove("run"));
    if(k>=steps.length){finish(false,"d9");return}
    const s=steps[k++];
    const box=$(s.l==="main"?"#slotsMain":"#slotsStar"),el=box.children[s.i];if(el)el.classList.add("run");
    if(s.t==="P"){
      if(pos[0]===L.bat[0]&&pos[1]===L.bat[1]){L.taken=true;renderBoard();finish(true)}
      else finish(false,"d9");
      return;
    }
    const d=DIR[s.t],nr=pos[0]+d[0],nc=pos[1]+d[1];
    if(nr<0||nr>4||nc<0||nc>4||L.walls.some(w=>w[0]===nr&&w[1]===nc)){
      const rb=$("#robot");rb.classList.add("bump");setTimeout(()=>rb.classList.remove("bump"),400);
      finish(false,"d10");return;
    }
    pos=[nr,nc];moveRobot();
  },520);
};

/* confetti */
const cv=$("#cf"),cx=cv.getContext("2d");let ps=[],raf=0;
function size(){cv.width=innerWidth;cv.height=innerHeight}size();addEventListener("resize",size);
function confetti(){
  const cols=["#ffd23f","#2fcf86","#12b5d6","#ff5fa2","#ff8a3d"];
  const r=$("#board").getBoundingClientRect();
  for(let i=0;i<110;i++)ps.push({x:r.left+r.width/2+(Math.random()-.5)*160,y:r.top+r.height/2,vx:(Math.random()-.5)*12,vy:-Math.random()*14-3,s:5+Math.random()*7,c:cols[i%5],r:Math.random()*6});
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
addEventListener("resize",moveRobot);
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll(".rv").forEach(e=>io.observe(e));

let init="";
try{init=localStorage.getItem("pfk-lang")||""}catch(e){}
if(!init){const n=(navigator.language||"en").toLowerCase().split("-")[0];init=I18N[n]?n:"en"}
applyLang(init,false);
})();
