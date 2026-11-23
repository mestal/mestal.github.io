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
}
sel.onchange=()=>applyLang(sel.value,true);

/* misc */
addEventListener("scroll",()=>$("#nav").classList.toggle("sc",scrollY>20),{passive:true});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll(".rv").forEach(e=>io.observe(e));

let init="";
try{init=localStorage.getItem("pfk-lang")||""}catch(e){}
if(!init){const n=(navigator.language||"en").toLowerCase().split("-")[0];init=I18N[n]?n:"en"}
applyLang(init,false);
})();
