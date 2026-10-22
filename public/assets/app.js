
const DATA=window.SITE.DATA;
const COFFEE=`<a class="coffee" href="https://buymeacoffee.com/the2planners" target="_blank" rel="noopener"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h12v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8z"/><path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16"/><path d="M8 2.5c0 1 1 1 1 2s-1 1-1 2M12 2.5c0 1 1 1 1 2s-1 1-1 2"/></svg><span>Buy us a coffee</span></a>`;
const SOCIAL=`<a class="soc" href="https://www.instagram.com/the2planners/" target="_blank" rel="noopener" aria-label="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg><span>Instagram</span></a><a class="soc" href="https://pt.pinterest.com/the2planners/" target="_blank" rel="noopener" aria-label="Pinterest"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.64 19.31c-.09-.79-.17-2 .03-2.86l1.17-4.97s-.3-.6-.3-1.48c0-1.39.8-2.42 1.8-2.42.85 0 1.26.64 1.26 1.4 0 .85-.54 2.13-.82 3.31-.24.99.5 1.8 1.47 1.8 1.77 0 3.13-1.86 3.13-4.55 0-2.38-1.71-4.04-4.15-4.04-2.83 0-4.49 2.12-4.49 4.31 0 .85.33 1.77.74 2.27.08.1.09.18.07.28l-.28 1.12c-.04.18-.14.22-.33.13-1.24-.58-2.02-2.4-2.02-3.86 0-3.14 2.28-6.03 6.58-6.03 3.46 0 6.14 2.46 6.14 5.75 0 3.43-2.16 6.2-5.17 6.2-1.01 0-1.96-.53-2.28-1.15l-.62 2.37c-.22.86-.83 1.95-1.24 2.61A10 10 0 1 0 12 2z"/></svg><span>Pinterest</span></a>`;
const IMG={couple:"/img/site/couple.webp",hero:"/img/site/hero.webp"};
const PH=window.SITE.PH;
const DIMS=window.SITE.DIMS;
const BLOB={};
const PATHS=!!(window.SITE&&window.SITE.paths);
const ORIGIN="https://the2planners.com";
const IMGBASE=PATHS?"/img/":"img/";
const src=id=>BLOB[id]?("/_blob/"+BLOB[id]):(IMGBASE+id+".webp");
const SECTIONS={recipes:"Recipes",travel:"Travel and city guides","eat-out":"Restaurant and hotel reviews",living:"Living, home and celebrations"};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const slug=s=>s.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,70);
const MON={January:"JAN",February:"FEB",March:"MAR",April:"APR",May:"MAY",June:"JUN",July:"JUL",August:"AUG",September:"SEP",October:"OCT",November:"NOV",December:"DEC"};
const TINTS={desserts:"#C9A27A",breakfast:"#D7B56D","main dishes":"#9AAE8C",appetizers:"#B98E7E",drinks:"#7FB0AA",bread:"#C8AE84",travel:"#86A9B8",review:"#B0938C",living:"#A9A07E"};
const ALL=[];
for(const [key,name] of Object.entries(SECTIONS)){
  for(const p of DATA[name]){
    p.kind=key;p.id="p-"+slug(p.title);p.tags=p.tags||[];p.photo=PH[p.title]||null;
    p.short=key==="recipes"?p.title.replace(/\s*-?\s*Recipe\s*$/i,"").replace(/\s+-\s+Recipe$/,""):p.title.replace(/[\u{1F1E6}-\u{1F1FF}\u{1F300}-\u{1FAFF}☀-➿️]/gu,"").trim();
    const t=new Date(p.date);p.ts=isNaN(t)?0:t.getTime();
    const base=p.short.replace(/\|\s*(City Guide|Road Trip|Trip Guide)\s*-\s*/i," ").replace(/^(.*?) - Recipe$/i,"$1");
    p.slug=slug(base);p.path={recipes:"/recipes/",travel:"/travel/","eat-out":"/our-daily-life/",living:"/our-daily-life/"}[key]+p.slug+"/";
    ALL.push(p);
  }
}
const byId=Object.fromEntries(ALL.map(p=>[p.id,p]));
const SEC_PATH={home:"/",recipes:"/recipes/",travel:"/travel/",living:"/our-daily-life/",about:"/about/"};
const byPath=Object.fromEntries(Object.entries(SEC_PATH).map(([k,v])=>[v,k]).concat(ALL.map(p=>[p.path,p.id])));
function H(key){if(!PATHS)return "#"+key;if(SEC_PATH[key])return SEC_PATH[key];if(key==="eat-out")return SEC_PATH.living;return byId[key]?byId[key].path:"/";}
function currentKey(){
  if(!PATHS){return (location.hash||"#home").slice(1);}
  let p=location.pathname;if(!p.endsWith("/"))p+="/";
  return byPath[p]||"notfound";
}
function navigate(href){
  if(PATHS){if(href!==location.pathname)history.pushState({},"",href);route();}
  else{location.hash=href.replace(/^#/,"");}
}
if(PATHS){
  document.querySelectorAll("[data-k]").forEach(a=>a.setAttribute("href",H(a.dataset.k)));
  if(currentKey()==="notfound"){
    const m=location.pathname.match(/(\d{2,6})(?:\.html)?\/?$/);
    if(m&&window.SITE.OLDIDS){const ti=Object.keys(window.SITE.OLDIDS).find(k=>window.SITE.OLDIDS[k]===m[1]);
      const special={"About Us":SEC_PATH.about,"Search by Country":SEC_PATH.travel};
      const pp=ti&&(special[ti]||(ALL.find(p=>p.title===ti)||{}).path);if(pp)location.replace(pp);}
  }
  if(location.hash.length>1){const k=location.hash.slice(1);const to=SEC_PATH[k]||(k==="eat-out"?SEC_PATH.living:byId[k]&&byId[k].path);if(to)history.replaceState({},"",to);}
  document.addEventListener("click",e=>{
    const a=e.target.closest("a[href]");if(!a||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target==="_blank")return;
    const h=a.getAttribute("href");if(!h||!h.startsWith("/")||h.startsWith("//"))return;
    e.preventDefault();navigate(h);
  });
  addEventListener("popstate",route);
}
function tint(p){
  if(p.kind==="travel")return TINTS.travel;if(p.kind==="eat-out")return TINTS.review;if(p.kind==="living")return TINTS.living;
  for(const k of ["drinks","bread","breakfast","appetizers","main dishes","desserts"]) if(p.tags.includes(k))return TINTS[k];
  return "#B9AE8E";
}
function mono(p){
  if(p.kind==="travel")return p.short.split("|")[0].trim().split(" ")[0].replace(/^(.)(.*)$/,(m,a,b)=>a+b.toLowerCase());
  const w=p.short.replace(/[^\p{L}\s]/gu,"").trim().split(/\s+/);return (w[0][0]+(w[1]?w[1][0]:"")).toUpperCase();
}
function postmark(p){
  if(!p.date)return"";const [d,m,y]=p.date.split(" ");
  return `<span class="postmark" aria-hidden="true">PORTO<br>${d.padStart(2,"0")} ${MON[m]||""}<br>${y}</span>`;
}
function stars(p){
  for(const b of p.blocks){const m=b[1].match(/[★✩☆]{3,}/);if(m)return m[0];}return"";
}
function subline(p){
  if(p.kind==="travel"){const parts=p.short.split("|");return parts[1]?parts[1].replace(/(City Guide|Road Trip|Trip Guide)\s*-\s*/i,"").trim():"";}
  if(p.kind==="eat-out"){const s=stars(p);return s?`<span class="stars" aria-label="Rating ${s.split("★").length-1} out of 5">${s}</span>`:"";}
  return "";
}
function titleOf(p){return p.kind==="travel"?p.short.split("|")[0].trim().replace(/^(.)(.*)$/,(m,a,b)=>a+b.toLowerCase()).replace(/(^|[\s-])(\w)/g,(m,a,c)=>a+c.toUpperCase()).replace(/\bDe\b/g,"de"):p.short;}
function stampInner(p,big){
  if(p.photo) return `<div class="stampin photo"><img src="${src(p.photo.cover)}" alt="${esc(titleOf(p))}" loading="${big?"eager":"lazy"}" decoding="async"></div>`;
  return `<div class="stampin" style="--tint:${tint(p)}"><span class="mono"${big?' style="font-size:clamp(36px,13vw,96px);max-width:100%;overflow-wrap:anywhere;text-align:center"':""}>${esc(mono(p))}</span><span class="soon">Photo coming soon</span></div>`;
}
function card(p){
  const kindLabel={recipes:(p.tags.find(t=>["desserts","main dishes","appetizers","breakfast","drinks","bread"].includes(t))||"recipe"),travel:"City guide","eat-out":p.tags.includes("restaurant")?"Restaurant":"Hotel",living:"At home"}[p.kind];
  const sub=subline(p);
  return `<a class="card" href="${H(p.id)}">
    <div class="stampbox">${stampInner(p,false)}</div>
    <span class="meta">${esc(kindLabel)}</span>
    <h3>${esc(titleOf(p))}</h3>${sub?`<p class="sub">${p.kind==="eat-out"?sub:esc(sub)}</p>`:""}
  </a>`;
}
const latest=(kind,n)=>ALL.filter(p=>p.kind===kind).sort((a,b)=>b.ts-a.ts).slice(0,n);

const F=pre=>ALL.find(p=>p.title.startsWith(pre));
const SLIDES=[["Cinque Terre","City guide","Five villages, two days and one very full camera roll."],["Pastel de Nata Pie","Recipe","Our favourite custard tart, made big enough to share. Or not."],["PRAGUE","City guide","Three snowy days, a lot of mulled wine and the prettiest Christmas markets."],["Francesinha","Recipe","Porto's famous sandwich, sauce and all. Bring an appetite."],["Christmas Markets","City guide","Budapest, Vienna and Prague in eight days of lights and hot chocolate."]];
const SLIDEP=pre=>F(pre)||ALL.find(p=>p.title.toUpperCase().startsWith(pre.toUpperCase()));
function carousel(){
  const sl=[`<div class="sl banner on" data-i="0"><img src="${IMG.hero}" alt="The 2 Planners banner: a chef holding a cake and a traveller with suitcases and a camera"></div>`];
  SLIDES.forEach(([pre,k,line],n)=>{const p=SLIDEP(pre);if(!p||!p.photo)return;
    sl.push(`<div class="sl" data-i="${sl.length}" aria-hidden="true"><img src="${src(p.photo.cover)}" alt="" loading="lazy"><div class="cap"><div class="in"><span class="k">${esc(k)}</span><h2>${esc(titleOf(p))}</h2><p>${esc(line)}</p><a href="${H(p.id)}" tabindex="-1">Read the post</a></div></div></div>`);});
  return `<div class="car" id="car" role="region" aria-roledescription="carousel" aria-label="Featured posts">${sl.join("")}
  <button class="ar p" type="button" aria-label="Previous slide"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>
  <button class="ar n" type="button" aria-label="Next slide"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>
  <div class="dots">${sl.map((_,n)=>`<button type="button" aria-label="Slide ${n+1}"${n?"":' class="on"'}></button>`).join("")}</div></div>`;
}
let carTimer=null;
function initCarousel(){
  clearInterval(carTimer);carTimer=null;
  const c=document.getElementById("car");if(!c)return;
  const sls=[...c.querySelectorAll(".sl")],dots=[...c.querySelectorAll(".dots button")];let i=0,paused=false;
  const still=matchMedia("(prefers-reduced-motion: reduce)").matches;if(still)c.classList.add("still");
  const show=n=>{i=(n+sls.length)%sls.length;sls.forEach((s,k)=>{s.classList.toggle("on",k===i);s.setAttribute("aria-hidden",k===i?"false":"true");s.querySelectorAll("a").forEach(a=>a.tabIndex=k===i?0:-1);const im=s.querySelector("img");if(k===i||k===(i+1)%sls.length)im.loading="eager";});
    dots.forEach((d,k)=>{d.classList.remove("on");if(k===i){void d.offsetWidth;d.classList.add("on");}});};
  const tick=()=>{if(!paused&&!document.hidden&&document.getElementById("car")===c)show(i+1);};
  const start=()=>{clearInterval(carTimer);if(!still)carTimer=setInterval(tick,6500);};
  c.querySelector(".ar.p").addEventListener("click",()=>{show(i-1);start();});
  c.querySelector(".ar.n").addEventListener("click",()=>{show(i+1);start();});
  dots.forEach((d,k)=>d.addEventListener("click",()=>{show(k);start();}));
  c.addEventListener("mouseenter",()=>{paused=true;c.classList.add("paused");});
  c.addEventListener("mouseleave",()=>{paused=false;c.classList.remove("paused");show(i);start();});
  c.addEventListener("focusin",()=>{paused=true;c.classList.add("paused");});
  c.addEventListener("focusout",()=>{paused=false;c.classList.remove("paused");});
  let x0=null;c.addEventListener("touchstart",e=>{x0=e.touches[0].clientX;},{passive:true});
  c.addEventListener("touchend",e=>{if(x0===null)return;const dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)>40){show(i+(dx<0?1:-1));start();}},{passive:true});
  start();
}
const kindName={recipes:"Recipe",travel:"City guide","eat-out":"Eating out",living:"Daily life"};
function bento(){
  const pool=ALL.filter(p=>p.photo).sort(()=>Math.random()-.5);
  const big=pool.find(p=>p.kind!=="recipes");
  const picks=[big,...pool.filter(p=>p!==big).slice(0,2)];
  return `<div class="bento">${picks.map(p=>`<a href="${H(p.id)}"><img src="${src(p.photo.cover)}" alt="" loading="lazy"><span class="bc"><small>${kindName[p.kind]}</small><b>${esc(titleOf(p))}</b></span></a>`).join("")}</div>`;
}
function surprise(){
  return `<div class="surprise"><div><h2>What shall we <em>cook tonight?</em></h2><p>Can't decide? Neither can we, most nights. Let the dice pick one of our ${ALL.filter(p=>p.kind==="recipes").length} recipes.</p>
  <button class="dice" id="dice" type="button"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8" cy="8" r="1.3" fill="currentColor"/><circle cx="16" cy="16" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="16" cy="8" r="1.3" fill="currentColor"/><circle cx="8" cy="16" r="1.3" fill="currentColor"/></svg>Surprise me</button></div>
  <div id="pickBox">${pickHTML(randRecipe())}</div></div>`;
}
const RECIPES=()=>ALL.filter(p=>p.kind==="recipes"&&p.photo);
const randRecipe=()=>{const r=RECIPES();return r[Math.floor(Math.random()*r.length)];};
function pickHTML(p,cls=""){
  const tag=p.tags.find(t=>["desserts","main dishes","appetizers","breakfast","drinks","bread"].includes(t))||"recipe";
  return `<a class="pick ${cls}" href="${H(p.id)}"><span class="ph"><img src="${src(p.photo.cover)}" alt=""></span><span><small>${esc(tag)}</small><b>${esc(titleOf(p))}</b><span class="go">Let's cook this</span></span></a>`;
}
function initSurprise(){
  const d=document.getElementById("dice"),box=document.getElementById("pickBox");if(!d)return;
  d.addEventListener("click",()=>{
    if(d.disabled)return;d.disabled=true;d.classList.remove("spin");void d.offsetWidth;d.classList.add("spin");
    const still=matchMedia("(prefers-reduced-motion: reduce)").matches;let n=still?0:9;
    const step=()=>{if(n-->0){box.innerHTML=pickHTML(randRecipe(),"rolling");setTimeout(step,70+(9-n)*12);}else{box.innerHTML=pickHTML(randRecipe(),"landed");d.disabled=false;}};
    step();
  });
}
function home(){
  return `${carousel()}
  <div class="wrap">
    <div class="lede">
      <div class="script">Hello,<br>we're Richie &amp; Andrew</div>
      <div><p>A couple from Porto who like to do everything ourselves. We cook our way through family recipes and far-off cuisines, plan trips down to the last tram stop, and write it all up here.</p>
      <div class="pillars">Cooking · Travelling · Daily life</div></div>
    </div>
    <section class="block"><div class="shead"><h2>Fresh <em>picks</em></h2></div>${bento()}</section>
    <section class="block">${surprise()}</section>
    <section class="block"><div class="shead"><h2>From our <em>kitchen</em></h2><a href="${H("recipes")}">All ${ALL.filter(p=>p.kind==="recipes").length} recipes</a></div><div class="grid">${latest("recipes",8).map(card).join("")}</div></section>
    <section class="block"><div class="shead"><h2>Where we've <em>been</em></h2><a href="${H("travel")}">All city guides</a></div>${tripMap()}</section>
    <section class="block"><div class="shead"><h2>Our daily <em>life</em></h2><a href="${H("living")}">See it all</a></div><div class="grid">${livingList("all").split("</a>").slice(0,4).join("</a>")+"</a>"}</div></section>
    <section class="block"><div class="since"><img src="${IMG.couple}" alt="Illustration of Richie and Andrew, arms round each other, with a ribbon reading Since 30.04.2016">
      <div><p>It started with a Christmas present for Richie's mum. For a whole year we recreated her recipes and designed her a cookbook, Maria Alice's Homemade Recipes. We never stopped.</p><p class="coffee-note">Enjoying our recipes and guides? Everything here is free, and a coffee keeps us cooking and planning.</p><div class="since-cta"><a class="btn" href="${H("about")}" style="text-decoration:none;display:inline-block">Meet us</a>${COFFEE}</div></div></div></section>
  </div>`;
}

/* ---- trip map ---- */
const MAP=window.SITE.MAP;
const CITY_POSTS={"Porto":[],"Vigo":["VIGO"],"Barcelona":["BARCELONA"],"Picos de Europa":["PICOS DE EUROPA"],"Milan":["MILAN","ITALY"],"Cinque Terre":["CINQUE TERRE","ITALY"],"Pisa":["PISA","ITALY"],"Florence":["FLORENCE","ITALY"],"Venice":["VENICE","ITALY"],"Verona":["VERONA","ITALY"],"Budapest":["BUDAPEST","Christmas Markets"],"Prague":["PRAGUE","Christmas Markets"],"Vienna":["VIENNA","Christmas Markets"],"Beijing":["BEIJING","CHINA |"],"Xi'an":["XI'AN","CHINA |"],"Chengdu":["CHENGDU","CHINA |"],"Guilin":["GUILIN","CHINA |"],"Yangshuo":["YANGSHUO","CHINA |"],"Hangzhou":["HANGZHOU","CHINA |"],"Shanghai":["SHANGHAI","CHINA |"],"Bangkok":["BANGKOK","THAILAND |"],"Chiang Mai":["CHIANG MAI","THAILAND |"],"Phuket":["PHUKET","THAILAND |"],"Phi Phi":["PHI PHI","THAILAND |"],"Railay":["RAILAY","THAILAND |"],"Khao Sok":["KHAO SOK","THAILAND |"],"Koh Samui":["KOH SAMUI","THAILAND |"]};
const LBL={"Porto":[-12,4,"end"],"Aveiro":[-12,14,"end"],"Vigo":[-12,-2,"end"],"Barcelona":[12,4,"start"],"Picos de Europa":[0,-14,"middle"],"Milan":[-10,-10,"end"],"Cinque Terre":[-12,10,"end"],"Pisa":[-6,22,"middle"],"Florence":[12,14,"start"],"Venice":[12,-6,"start"],"Verona":[0,-14,"middle"],"Budapest":[12,4,"start"],"Prague":[12,-4,"start"],"Vienna":[-12,-8,"end"],"Beijing":[12,4,"start"],"Xi'an":[12,4,"start"],"Chengdu":[-12,4,"end"],"Guilin":[-12,0,"end"],"Yangshuo":[12,12,"start"],"Hangzhou":[-12,14,"end"],"Shanghai":[12,4,"start"],"Bangkok":[12,4,"start"],"Chiang Mai":[12,4,"start"],"Phuket":[-12,6,"end"],"Phi Phi":[12,12,"start"],"Railay":[12,2,"start"],"Khao Sok":[-12,-4,"end"],"Koh Samui":[12,4,"start"]};
const HOME=new Set(["Porto"]);
const COUNTRY_OF={"Porto":"Portugal","Vigo":"Spain","Barcelona":"Spain","Picos de Europa":"Spain","Milan":"Italy","Cinque Terre":"Italy","Pisa":"Italy","Florence":"Italy","Venice":"Italy","Verona":"Italy","Budapest":"Hungary","Prague":"Czech Republic","Vienna":"Austria","Beijing":"China","Xi'an":"China","Chengdu":"China","Guilin":"China","Yangshuo":"China","Hangzhou":"China","Shanghai":"China","Bangkok":"Thailand","Chiang Mai":"Thailand","Phuket":"Thailand","Phi Phi":"Thailand","Railay":"Thailand","Khao Sok":"Thailand","Koh Samui":"Thailand"};
const TRIPS=[{id:"italy",name:"8 days in Northern Italy",air:true,stops:["Milan","Cinque Terre","Pisa","Florence","Verona","Venice"]},{id:"xmas",name:"8 days of Christmas markets",air:true,stops:["Budapest","Prague","Vienna"]},{id:"vigo",name:"weekend road trip",air:false,stops:["Vigo"]},{id:"bcn",name:"Barcelona and Montserrat trip",air:true,stops:["Barcelona"]},{id:"picos",name:"Picos de Europa road trip",air:false,via:["Pontevedra","Santiago","Coruna","Oviedo","Gijon","Cangas","Arenas","Potes","FuenteDe"],stops:["Picos de Europa"]},{id:"china",name:"15 days in China",air:true,stops:["Beijing","Xi'an","Chengdu","Guilin","Yangshuo","Hangzhou","Shanghai"]},{id:"thai",name:"Thailand honeymoon",air:true,stops:["Bangkok","Chiang Mai","Phuket","Phi Phi","Railay","Khao Sok","Koh Samui"]}];
const tripOf=c=>TRIPS.find(tr=>tr.stops.includes(c));
const TRIPLINE={picos:"Porto → Pontevedra → Santiago → A Coruña → Oviedo → Gijón → Cangas de Onís → Arenas de Cabrales → Potes → Fuente Dé"};
function plane(a,c,b){const t=.5,x=(1-t)*(1-t)*a[0]+2*(1-t)*t*c[0]+t*t*b[0],y=(1-t)*(1-t)*a[1]+2*(1-t)*t*c[1]+t*t*b[1];const dx=2*(1-t)*(c[0]-a[0])+2*t*(b[0]-c[0]),dy=2*(1-t)*(c[1]-a[1])+2*t*(b[1]-c[1]);const ang=Math.atan2(dy,dx)*180/Math.PI;
  return `<g class="plane" transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${ang.toFixed(1)})"><g class="pi"><path d="M9,0 L-3,-2 L-7,-8 L-9,-8 L-6,-2 L-11,-1.5 L-13,-4 L-14.5,-4 L-13,0 L-14.5,4 L-13,4 L-11,1.5 L-6,2 L-9,8 L-7,8 L-3,2 Z"/></g></g>`;}
function tripMap(){
  const P=MAP.pts;
  const pins=Object.entries(P).map(([c,[x,y]])=>{const [dx,dy,an]=LBL[c]||[12,4,"start"];
    return `<g class="pin${HOME.has(c)?" home":""}" data-c="${esc(c)}" transform="translate(${x},${y})" tabindex="0" role="button" aria-label="${esc(c)}"><g class="pi"><circle class="hit" r="12"/><circle class="ring" r="4.5"/><circle class="dot" r="5"/><text x="${dx}" y="${dy}" text-anchor="${an}">${esc(c)}</text></g></g>`;}).join("");
  const routes=TRIPS.map(tr=>{
    const a=P.Porto,b=P[tr.stops[0]];let out;
    if(tr.air){const d=Math.hypot(b[0]-a[0],b[1]-a[1]),lift=Math.min(150,Math.max(22,d*.3));const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2-lift;
      out=`<path class="leg air" d="M${a[0]},${a[1]} Q${mx},${my} ${b[0]},${b[1]}"/>`+plane(a,[mx,my],b);}
    else out=`<path class="leg road" d="M${a[0]},${a[1]} ${(tr.via||[]).map(v=>"L"+MAP.via[v].join(",")).join(" ")} L${b[0]},${b[1]}"/>`;
    const path=tr.stops.length>1?`<path class="leg hop" d="M${tr.stops.map(c=>P[c].join(",")).join(" L")}"/>`:"";
    return `<g class="trip" data-trip="${tr.id}">${out}${path}</g>`;}).join("");
  const guides=ALL.filter(p=>p.kind==="travel").length;
  const places=Object.keys(P).filter(c=>!HOME.has(c)).length;
  return `<div class="tmap"><div class="mbox"><button type="button" class="mreset" hidden>Show all trips</button><svg viewBox="0 0 ${MAP.W} ${MAP.H}" role="img" aria-label="Map of the places we've written about"><rect class="sea" x="-2000" y="-2000" width="${MAP.W+4000}" height="${MAP.H+4000}"/><path class="land" d="${MAP.land}"/><path class="vis" d="${MAP.visited}"/>${routes}${pins}</svg>
  <div class="legend"><span><i class="h"></i>Home</span><span><i></i>We've been</span></div></div>
  <div class="mpanel"><div class="stat"><div><b>${places}</b><span>Places</span></div><div><b>${new Set(Object.keys(P).filter(c=>!HOME.has(c)).map(c=>COUNTRY_OF[c]).filter(Boolean)).size}</b><span>Countries</span></div><div><b>${guides}</b><span>City guides</span></div></div><div class="mpanel" id="mpanel">${mapDefault(guides)}</div></div></div>`;
}
function mapDefault(guides){
  return `<p class="hint">Tap a pin to see what we wrote about each place.</p>
  <div class="mlist">${latest("travel",3).map(mItem).join("")}</div>`;
}
function mItem(p){return `<a href="${H(p.id)}">${p.photo?`<img src="${src(p.photo.cover)}" alt="" loading="lazy">`:"<span></span>"}<span><b>${esc(titleOf(p))}</b><small>${kindName[p.kind]}${subline(p)&&p.kind==="travel"?" · "+esc(subline(p)):""}</small></span></a>`;}
function mapScale(svg,vb){
  const cw=svg.getBoundingClientRect().width||MAP.W,s=vb[2]/cw*.85;
  svg.querySelectorAll(".pi").forEach(g=>g.setAttribute("transform",`scale(${s.toFixed(4)})`));
  return s;
}
function mapLabels(svg,s,first,vb){
  const placed=[],pins=[...svg.querySelectorAll(".pin")];
  const dots=pins.map(g=>{const c=g.dataset.c;return MAP.pts[c];});
  const order=pins.slice().sort((a,b)=>(b.classList.contains("on")-a.classList.contains("on"))||(b.classList.contains("intrip")-a.classList.contains("intrip"))||(first.indexOf(a.dataset.c)<0)-(first.indexOf(b.dataset.c)<0)*0);
  for(const g of order){
    const c=g.dataset.c,[x,y]=MAP.pts[c],[dx,dy,an]=LBL[c]||[12,4,"start"],w=c.length*7.2*s,h=13*s;
    let a2=an,dx2=dx;if(an==="start"&&x+dx*s+w>vb[0]+vb[2]-4*s){a2="end";dx2=-Math.abs(dx);}else if(an==="end"&&x+dx*s-w<vb[0]+4*s){a2="start";dx2=Math.abs(dx);}
    const tx=g.querySelector("text");tx.setAttribute("x",dx2);tx.setAttribute("text-anchor",a2);
    let x0=x+dx2*s;if(a2==="end")x0-=w;else if(a2==="middle")x0-=w/2;const y0=y+dy*s-h*.8;
    const box=[x0,y0,x0+w,y0+h];
    const hit=placed.some(q=>!(box[2]<q[0]||box[0]>q[2]||box[3]<q[1]||box[1]>q[3]))||dots.some(([px,py])=>(px!==x||py!==y)&&px>box[0]-4*s&&px<box[2]+4*s&&py>box[1]-4*s&&py<box[3]+4*s);
    g.classList.toggle("nolabel",hit);if(!hit)placed.push(box);
  }
}
function initMap(){
  const panel=document.getElementById("mpanel");if(!panel)return;
  const svg=view.querySelector(".tmap svg"),reset=view.querySelector(".tmap .mreset");
  const pins=[...svg.querySelectorAll(".pin")];
  const FULL=[0,0,MAP.W,MAP.H];let vb=FULL.slice(),anim=0;
  const first=["Porto","Barcelona","Vienna","Prague","Budapest","Florence","Beijing","Shanghai","Chengdu","Xi'an","Guilin"];
  const draw=()=>{svg.setAttribute("viewBox",vb.map(v=>v.toFixed(2)).join(" "));return mapScale(svg,vb);};
  const settle=()=>mapLabels(svg,draw(),first,vb);
  const fit=names=>{
    const xs=names.map(c=>MAP.pts[c][0]),ys=names.map(c=>MAP.pts[c][1]);
    let x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);
    let w=Math.max(x1-x0,60)*1.6+40,h=Math.max(y1-y0,30)*1.6+40;const ar=MAP.W/MAP.H;
    if(w/h<ar)w=h*ar;else h=w/ar;w=Math.min(w,MAP.W);h=Math.min(h,MAP.H);
    let cx=(x0+x1)/2,cy=(y0+y1)/2;let x=Math.min(Math.max(cx-w/2,0),MAP.W-w),y=Math.min(Math.max(cy-h/2,0),MAP.H-h);return [x,y,w,h];};
  const go=to=>{cancelAnimationFrame(anim);const from=vb.slice(),t0=performance.now(),D=matchMedia("(prefers-reduced-motion: reduce)").matches?0:550;
    const step=now=>{const k=D?Math.min(1,(now-t0)/D):1,e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;vb=from.map((v,i)=>v+(to[i]-v)*e);draw();if(k<1)anim=requestAnimationFrame(step);else settle();};
    anim=requestAnimationFrame(step);reset.hidden=to===FULL;};
  const pick=g=>{const c=g.dataset.c;pins.forEach(x=>x.classList.toggle("on",x===g));
    const tr=tripOf(c);svg.classList.toggle("focus",!!tr);svg.querySelectorAll(".trip").forEach(x=>x.classList.toggle("lit",!!tr&&x.dataset.trip===tr.id));
    pins.forEach(x=>x.classList.toggle("intrip",!!tr&&tr.stops.includes(x.dataset.c)));
    go(fit(tr?tr.stops:[c]));
    const posts=(CITY_POSTS[c]||[]).map(SLIDEP).filter(Boolean);
    panel.classList.remove("swap");void panel.offsetWidth;panel.classList.add("swap");
    panel.innerHTML=HOME.has(c)?`<h3><small>Home sweet home</small>${esc(c)}</h3><p class="hint">This is where we live, cook and plan every trip. Every journey on this map starts here.</p>`:`<h3><small>We've been to</small>${esc(c)}</h3>${tr?`<p class="hint trip-line">Part of our ${esc(tr.name)}: ${TRIPLINE[tr.id]?esc(TRIPLINE[tr.id]):["Porto"].concat(tr.stops).map(s=>s===c?`<b>${esc(s)}</b>`:esc(s)).join(" → ")}</p>`:""}<div class="mlist">${posts.map(mItem).join("")}</div>`;};
  reset.addEventListener("click",()=>{pins.forEach(x=>x.classList.remove("on","intrip"));svg.classList.remove("focus");svg.querySelectorAll(".trip").forEach(x=>x.classList.remove("lit"));go(FULL);panel.innerHTML=mapDefault();});
  pins.forEach(g=>{g.addEventListener("click",()=>pick(g));g.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();pick(g);}});});
  settle();
  if(window.ResizeObserver){const ro=new ResizeObserver(()=>{if(!document.body.contains(svg)){ro.disconnect();return;}settle();});ro.observe(svg);}
}

/* ---- motion: reveal below the fold ---- */
let revObs=null;
function initReveal(){
  if(revObs)revObs.disconnect();
  if(matchMedia("(prefers-reduced-motion: reduce)").matches||!("IntersectionObserver" in window))return;
  const vh=innerHeight;
  const els=[...view.querySelectorAll(".card,.shead,.bento a,.surprise,.tmap,.since,.inpics,.mosaic figure,.people .person,.body h3")].filter(e=>e.getBoundingClientRect().top>vh*0.95);
  revObs=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){const el=en.target;el.classList.remove("pre");revObs.unobserve(el);}}),{rootMargin:"0px 0px -6% 0px"});
  els.forEach((e,k)=>{e.classList.add("rv","pre");e.style.transitionDelay=((k%4)*60)+"ms";revObs.observe(e);});
}

/* ---- recipe tools: scaler + timers ---- */
const FR={"½":.5,"⅓":1/3,"⅔":2/3,"¼":.25,"¾":.75,"⅛":.125};
function parseNum(s){s=s.trim().replace(",",".");let m;
  if(m=s.match(/^(\d+)\s*([½⅓⅔¼¾⅛])$/))return +m[1]+FR[m[2]];
  if(FR[s]!==undefined)return FR[s];
  if(m=s.match(/^(\d+)\/(\d+)$/))return m[1]/m[2];
  return parseFloat(s);}
function fmtNum(v,unit){
  if(/^(g|kg|ml|mL|l|L|cl|cL)$/.test(unit||"")&&v>=20)return String(Math.round(v/5)*5);
  if(Math.abs(v-Math.round(v))<.02)return String(Math.round(v));
  const w=Math.floor(v),f=v-w;const opts=[[.25,"¼"],[1/3,"⅓"],[.5,"½"],[2/3,"⅔"],[.75,"¾"]];
  let best=opts[0];for(const o of opts)if(Math.abs(o[0]-f)<Math.abs(best[0]-f))best=o;
  if(Math.abs(best[0]-f)<.07)return (w?w:"")+best[1];
  return (Math.round(v*10)/10).toString();}
const QRE=/(\d+\s*[½⅓⅔¼¾⅛]|\d+\/\d+|[½⅓⅔¼¾⅛]|\d+(?:[.,]\d+)?)(\s*-\s*(\d+(?:[.,]\d+)?))?(\s?)(g|kg|ml|mL|l|L|cl|cL|tbsp|tsp|cups?|Cups?|oz|lb|Kg)?/;
function scaleLine(s,f){
  if(/^(oven|\d+\s*-?\s*\d*\s*min)/i.test(s))return null;
  const lead=s.match(new RegExp("^"+QRE.source));
  if(!lead)return null;
  const unit=lead[5]||"";
  if(/^\s*(min|minutes|º|°)/i.test(s.slice(lead[0].length)))return null;
  const a=parseNum(lead[1]);if(isNaN(a))return null;
  let out=fmtNum(a*f,unit);if(lead[3])out+="-"+fmtNum(parseNum(lead[3])*f,unit);
  let rest=s.slice(lead[0].length);
  rest=rest.replace(/\((\d+(?:[.,]\d+)?|[½⅓⅔¼¾⅛])\s?(g|ml|mL|tsp|tbsp|Cups?|cups?)\)/g,(m,n,u)=>"("+fmtNum(parseNum(n)*f,u)+" "+u+")");
  return out+lead[4]+unit+rest;
}
function scalerHTML(p){
  if(p.kind!=="recipes")return"";
  const n=p.blocks.filter(b=>b[0]==="ul"&&scaleLine(b[1],1)!==null).length;if(n<2)return"";
  return `<div class="scaler" role="group" aria-label="Scale the quantities"><span>Quantities</span>${[[.5,"½×"],[1,"1×"],[2,"2×"],[3,"3×"]].map(([f,l])=>`<button type="button" data-f="${f}" aria-pressed="${f===1}">${l}</button>`).join("")}<small>Making more or less? We'll do the maths. Cooking times stay roughly the same.</small></div>`;
}
function initScaler(){
  const sc=view.querySelector(".scaler");if(!sc)return;
  const spans=[...view.querySelectorAll(".ingr li span")];spans.forEach(s=>{s.dataset.o=s.dataset.o||s.textContent;});
  sc.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{
    const f=+b.dataset.f;sc.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b));
    spans.forEach(s=>{const o=s.dataset.o;const r=f===1?o:scaleLine(o,f);if(r===null)return;s.innerHTML=fmtText(r);s.classList.add("q","bump");setTimeout(()=>s.classList.remove("bump"),500);});
  }));
}
const TRE=/\b(\d+)(?:\s?(?:-|–|to)\s?(\d+))?\s?(minutes|minute|mins|min|hours|hour|h)\b/gi;
function withTimers(html){
  return html.replace(TRE,(m,a,b,u)=>{const mult=/^h/i.test(u)?3600:60;const secs=(+a)*mult;if(!secs||secs>6*3600)return m;
    return `<button type="button" class="tmr" data-s="${secs}" data-l="${esc(m)}" aria-label="Start a ${esc(m)} timer"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/></svg>${m}</button>`;});
}
let AC=null;
function beep(){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const t0=AC.currentTime;[0,.35,.7].forEach(d=>{const o=AC.createOscillator(),g=AC.createGain();o.frequency.value=880;g.gain.setValueAtTime(.0001,t0+d);g.gain.exponentialRampToValueAtTime(.3,t0+d+.02);g.gain.exponentialRampToValueAtTime(.0001,t0+d+.25);o.connect(g).connect(AC.destination);o.start(t0+d);o.stop(t0+d+.3);});}catch(e){}}
function startTimer(secs,label,title){
  let box=document.getElementById("timers");if(!box){box=document.createElement("div");box.id="timers";box.className="timers";box.setAttribute("aria-live","polite");document.body.appendChild(box);}
  try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();AC.resume&&AC.resume();}catch(e){}
  const el=document.createElement("div");el.className="tbox";
  el.innerHTML=`<b></b><span>${esc(title)}</span><button type="button" class="pp" aria-label="Pause"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg></button><button type="button" class="xx" aria-label="Stop timer"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>`;
  box.appendChild(el);
  let end=Date.now()+secs*1000,left=secs*1000,running=true,iv=null,done=false;
  const b=el.querySelector("b"),pp=el.querySelector(".pp");
  const draw=()=>{const ms=running?end-Date.now():left;const s=Math.max(0,Math.ceil(ms/1000));const h=Math.floor(s/3600),m=Math.floor(s%3600/60),ss=s%60;b.textContent=(h?h+":"+String(m).padStart(2,"0"):m)+":"+String(ss).padStart(2,"0");
    if(running&&ms<=0&&!done){done=true;clearInterval(iv);el.classList.add("done");b.textContent="Done!";pp.remove();beep();try{navigator.vibrate&&navigator.vibrate([200,100,200]);}catch(e){}}};
  iv=setInterval(draw,250);draw();
  pp.addEventListener("click",()=>{if(running){left=end-Date.now();running=false;pp.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5l12 7-12 7z"/></svg>';pp.setAttribute("aria-label","Resume");}else{end=Date.now()+left;running=true;pp.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg>';pp.setAttribute("aria-label","Pause");}draw();});
  el.querySelector(".xx").addEventListener("click",()=>{clearInterval(iv);el.remove();});
}
function initTimers(p){
  view.querySelectorAll(".tmr").forEach(t=>t.addEventListener("click",()=>startTimer(+t.dataset.s,t.dataset.l,titleOf(p))));
}

let recipeState={q:"",cat:"all"};
const CATS=[["all","All"],["desserts","Desserts"],["main dishes","Mains"],["appetizers","Starters"],["breakfast","Breakfast"],["bread","Bread"],["drinks","Drinks"],["portuguese","Portuguese"],["christmas","Christmas"],["gluten free","Gluten free"]];
function recipes(){
  try{const s=JSON.parse(localStorage.getItem("t2p-recipes")||"null");if(s)recipeState=Object.assign(recipeState,s);}catch(e){}
  return `<div class="wrap"><div class="pagehead"><span class="kicker">from our kitchen</span><h1>Recipes</h1><p>Portuguese classics from Maria Alice's notebook, Christmas baking, and dishes we tasted abroad and rebuilt at home. Oven temperatures are given in both ºC and ºF.</p></div>
  <div class="toolbar"><label class="search"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><span hidden>Search recipes</span><input id="q" type="search" placeholder="Search recipes or ingredients" value="${esc(recipeState.q)}" autocomplete="off"></label></div>
  <div class="chips" role="group" aria-label="Filter by category" style="margin:-10px 0 26px">${CATS.map(([k,l])=>`<button class="chip" data-cat="${k}" aria-pressed="${recipeState.cat===k}">${l}</button>`).join("")}</div>
  <div class="count" id="count"></div><div class="grid" id="rgrid"></div></div>`;
}
function drawRecipes(){
  const q=recipeState.q.trim().toLowerCase();
  const list=ALL.filter(p=>p.kind==="recipes").filter(p=>recipeState.cat==="all"||p.tags.includes(recipeState.cat))
    .filter(p=>!q||p.title.toLowerCase().includes(q)||p.blocks.some(b=>b[0]==="ul"&&b[1].toLowerCase().includes(q)))
    .sort((a,b)=>b.ts-a.ts||a.short.localeCompare(b.short));
  document.getElementById("rgrid").innerHTML=list.map(card).join("")||`<p class="empty">No recipes match “${esc(recipeState.q)}”. Try an ingredient like cinnamon or codfish.</p>`;
  document.getElementById("count").textContent=list.length+(list.length===1?" recipe":" recipes");
  try{localStorage.setItem("t2p-recipes",JSON.stringify(recipeState));}catch(e){}
}
function listPage(kind,kicker,title,intro,extra=""){
  return `<div class="wrap"><div class="pagehead"><span class="kicker">${kicker}</span><h1>${title}</h1><p>${intro}</p></div>${extra}<div class="grid ${kind==="travel"?"wide":""}" id="lgrid">${latest(kind,99).map(card).join("")}</div></div>`;
}
const COUNTRIES=["Austria","China","Czech Republic","Hungary","Italy","Spain","Thailand"];
function travel(){
  const chips=`<div class="countries" role="group" aria-label="Filter by country"><button class="chip" data-country="all" aria-pressed="true">All countries</button>${COUNTRIES.map(c=>`<button class="chip" data-country="${c.toLowerCase()}" aria-pressed="false">${c}</button>`).join("")}</div>`;
  return listPage("travel","where we've been","City guides","Day-by-day plans from our trips, from a weekend in Vigo and eight days chasing Christmas markets through Vienna, Prague and Budapest to fifteen days across China and our honeymoon in Thailand.",`<section class="block" style="padding-top:0">${tripMap()}</section>`+chips);
}
function living(f){
  const opts=[["all","Everything"],["eat-out","Eating out"],["living","Home & celebrations"]];
  const chips=`<div class="countries" role="group" aria-label="Filter daily life posts">${opts.map(([k,l])=>`<button class="chip" data-living="${k}" aria-pressed="${k===f}">${l}</button>`).join("")}</div>`;
  return `<div class="wrap"><div class="pagehead"><span class="kicker">life in Porto</span><h1>Our daily life</h1><p>Our first home, how we dress it up for Christmas, and where we go when neither of us wants to cook. The restaurant and hotel reviews are honest notes from birthday dinners and weekends away, and none of them are sponsored.</p></div>${chips}<div class="grid" id="lgrid">${livingList(f)}</div></div>`;
}
function livingList(f){
  return ALL.filter(p=>(p.kind==="living"||p.kind==="eat-out")&&(f==="all"||p.kind===f)).sort((a,b)=>b.ts-a.ts).map(card).join("");
}
function about(){
  const pics=[[87,"Florence"],[302,"Budapest"],[126,"Venice"],[566,"At home in Porto"],[12,""],[352,"Vienna"],[7,""],[274,"Budapest"],[355,"Vienna"]];
  return `<div class="wrap"><div class="pagehead"><span class="kicker">thanks for stopping by</span><h1>About us</h1></div>
  <div class="about"><button type="button" class="aboutpic" data-full="${src(57)}" aria-label="Open photo"><img src="${src(57)}" alt="Richie and Andrew in Manarola, Cinque Terre"></button>
  <div class="body"><p>We are The2Planners, a couple in Porto, Portugal, who love to do everything ourselves.</p>
  <p>It all began with a Christmas present for Richie's mum. For an entire year we recreated her recipes and designed her own cookbook, <em>Maria Alice's Homemade Recipes</em>. It was such an adventure that we couldn't stop, so now we share our life with you here.</p>
  <div class="people">
    <div class="person"><div class="phead"><img class="avatar" src="${src(138)}" alt="Richie"><h3>Richie</h3></div><div class="role">Content creator</div><p>Cheerful, adventurous and romantic.</p><p class="warn">Warning: not a morning person</p></div>
    <div class="person"><div class="phead"><img class="avatar" src="${src(137)}" alt="Andrew"><h3>Andrew</h3></div><div class="role">Radiation oncologist</div><p>Funny, crazy and sweet.</p><p class="warn">Warning: cleaning maniac</p></div>
  </div>
  <h4>Follow along</h4><div class="socials big">${SOCIAL}</div>
  <h4>Support us</h4><p class="coffee-note" style="margin:0 0 10px">Like what we do? A coffee keeps the blog going.</p>${COFFEE}
  <h4>Have fun with us</h4>
  <div class="email"><code id="mail">geral.the2planners@gmail.com</code><button class="btn" id="copy">Copy email</button></div></div></div>
  <section class="block"><div class="shead"><h2>Together since <em>30.04.2016</em></h2></div>
  <div class="mosaic">${pics.map(([id,c])=>`<figure><button type="button" data-full="${src(id)}" aria-label="Open photo${c?": "+c:""}"><img src="${src(id)}" alt="${esc(c||"Richie and Andrew")}" loading="lazy"></button>${c?`<figcaption>${esc(c)}</figcaption>`:""}</figure>`).join("")}</div></section></div>`;
}
function fmtText(t){
  return esc(t).replace(/(\d{2,3}\s?º\s?C(?:\s?\|\s?\d{2,3}\s?º\s?F)?|\d{2,3} Celsius degrees(?: \| \d{2,3} Fahren\w+ degrees)?)/g,'<span class="temp">$1</span>');
}
function coverStyle(p){
  const d=p.photo&&DIMS[p.photo.cover];if(!d)return"";
  const ar=d[0]/d[1];
  return ` style="--ar:${ar.toFixed(3)}${ar<1?`;max-width:${Math.round(ar*560)}px;margin:0 auto`:""}"`;
}
function figs(p,i){
  const ids=p.photo&&p.photo.pl&&p.photo.pl[i];
  if(!ids||!ids.length)return"";
  const r=g=>{const d=DIMS[g];return d?d[0]/d[1]:1.5;};
  const one=g=>`<button type="button" data-full="${src(g)}" aria-label="Open photo" style="flex:${r(g).toFixed(3)} 1 0;aspect-ratio:${r(g).toFixed(3)}"><img src="${src(g)}" alt="" loading="lazy" decoding="async"></button>`;
  const rows=[];let k=0;
  if(ids.length%2===1){rows.push([ids[0]]);k=1;}
  for(;k<ids.length;k+=2)rows.push(ids.slice(k,k+2));
  return `<div class="inpics">${rows.map(row=>`<div class="irow${row.length===1&&r(row[0])<1?" tall":""}">${row.map(one).join("")}</div>`).join("")}</div>`;
}
function gallery(p){
  if(!p.photo||!p.photo.g.length)return"";
  return `<div class="gallery">${p.photo.g.map(g=>`<button type="button" data-full="img/${g}.webp" aria-label="Open photo"><img src="img/${g}.webp" alt="" loading="lazy"></button>`).join("")}</div>`;
}
function seriesParts(p){return p.series?ALL.filter(q=>q.series===p.series).sort((a,b)=>a.part-b.part):[];}
function seriesNav(p){
  const parts=seriesParts(p);if(!parts.length)return"";const name=parts[0].seriesName||"This trip";
  return `<nav class="series" aria-label="${esc(name)}"><span class="k">${esc(name)}</span><ol>${parts.map(q=>`<li${q===p?' class="on"':""}><a href="${H(q.id)}"${q===p?' aria-current="page"':""}><i>${q.part?q.part:"★"}</i>${q.part?esc(titleOf(q)):"Full itinerary"}</a></li>`).join("")}</ol></nav>`;
}
function seriesNext(p){
  const parts=seriesParts(p);if(!parts.length)return"";const k=parts.indexOf(p),prev=parts[k-1],next=parts[k+1];
  const a=(q,lbl,cls)=>q?`<a class="${cls}" href="${H(q.id)}"><small>${lbl}</small>${q.part?esc(titleOf(q)):"Full itinerary"}</a>`:"<span></span>";
  return `<div class="series-next">${a(prev,"Previous stop","prev")}${a(next,next&&!p.part?"Start with":"Next stop","next")}</div>`;
}
function postView(p){
  const b=p.blocks;let html="",i=0;let ingrN=0;let sc=false;const R=p.kind==="recipes";const T=s=>R?withTimers(fmtText(s)):fmtText(s);
  while(i<b.length){
    const [t,x]=b[i];
    html+=figs(p,i);
    if(R&&!sc&&(t==="ul"||(t==="h4"&&/ingredient/i.test(x)))){html+=scalerHTML(p);sc=true;}
    if(t==="ul"||t==="ol"){
      const items=[];do{items.push(b[i][1]);i++;}while(i<b.length&&b[i][0]===t&&!(p.photo&&p.photo.pl&&p.photo.pl[i]));
      if(p.kind==="recipes"&&t==="ul") html+=`<ul class="ingr">${items.map(it=>`<li><label><input type="checkbox" id="ing-${ingrN++}"><span>${fmtText(it)}</span></label></li>`).join("")}</ul>`;
      else if(t==="ol") html+=`<ol class="steps">${items.map(it=>`<li><span>${T(it)}</span></li>`).join("")}</ol>`;
      else html+=`<ul class="plain">${items.map(it=>`<li>${fmtText(it)}</li>`).join("")}</ul>`;
      continue;
    }
    if(t==="h3")html+=`<h3>${esc(x)}</h3>`;
    else if(t==="h4")html+=`<h4>${esc(x.replace(/\s*:\s*$/,""))}</h4>`;
    else if(t==="tip")html+=`<p class="tip">${T(x)}</p>`;
    else html+=`<p>${T(x)}</p>`;
    i++;
  }
  const back={recipes:[H("recipes"),"All recipes"],travel:[H("travel"),"All city guides"],"eat-out":[H("living"),"Our daily life"],living:[H("living"),"Our daily life"]}[p.kind];
  const more=ALL.filter(q=>q.kind===p.kind&&q!==p).sort((a,c)=>{const s=x=>x.tags.filter(t=>p.tags.includes(t)).length;return s(c)-s(a)||c.ts-a.ts;}).slice(0,4);
  const tags=p.tags.filter(t=>!["recipes","cooking","travel","traveling"].includes(t));
  return `<div class="wrap"><a class="back" href="${back[0]}">← ${back[1]}</a>
  <div class="post"><article><div class="dateline">${esc(p.date||"")}</div><h1>${esc(titleOf(p))}</h1>${subline(p)?`<div class="dateline" style="margin-top:4px">${p.kind==="eat-out"?subline(p):esc(subline(p))}</div>`:""}
    <div class="tags">${tags.map(t=>`<span class="tag">${esc(t)}</span>`).join("")}</div>
    ${p.kind==="recipes"?`<a class="avg" id="avgRating" href="#rate" hidden></a>`:""}
    <div class="body"><div class="feature"><div class="stampbox"${coverStyle(p)}>${stampInner(p,true)}</div></div>${seriesNav(p)}${html}${figs(p,b.length)}
    ${seriesNext(p)}</div>${feedbackHTML(p)}</article>
  <aside class="side">
    <div class="box"><img class="couple" src="${IMG.couple}" alt=""><p>Richie and Andrew, cooking, travelling and living together in Porto since 2016.</p><div class="socials">${SOCIAL}</div><div class="side-coffee">${COFFEE}</div></div>
    <div class="box"><h4>You might also like</h4><div class="mini">${more.map(q=>`<a href="${H(q.id)}">${q.photo?`<img src="${src(q.photo.cover)}" alt="" loading="lazy">`:`<i style="--tint:${tint(q)}">${esc(mono(q)).slice(0,3)}</i>`}<span>${esc(titleOf(q))}</span></a>`).join("")}</div></div>
  </aside></div></div>`;
}

function notFound(){
  return `<div class="wrap"><div class="pagehead"><span class="kicker">oops</span><h1>We couldn't find that page</h1><p>It may have moved when we redesigned the blog. Try the search, or start from one of these:</p></div>
  <div class="countries" style="margin-bottom:40px"><a class="chip" href="${H("recipes")}" style="text-decoration:none">Recipes</a><a class="chip" href="${H("travel")}" style="text-decoration:none">City guides</a><a class="chip" href="${H("living")}" style="text-decoration:none">Our daily life</a><a class="chip" href="${H("home")}" style="text-decoration:none">Home</a></div>
  <div class="grid">${latest("recipes",4).map(card).join("")}</div></div>`;
}
const SEC_DESC={home:"Recipes, city guides and daily life from Richie and Andrew, a couple from Porto. Portuguese classics, Christmas baking and trips around Europe.",
  recipes:"All our recipes: Portuguese classics from Maria Alice's notebook, Christmas baking and dishes we tasted abroad and rebuilt at home in Porto.",
  travel:"Day by day city guides from our trips: Thailand, China, Barcelona, the Picos de Europa, Northern Italy, Prague, Vienna, Budapest and more.",
  living:"Our home in Porto, Christmas at our place and honest reviews of the restaurants and hotels we love.",
  about:"Meet Richie and Andrew, the couple from Porto behind The 2 Planners. Together, enjoying the world since 2016."};
function clip(s,n=158){s=s.replace(/\s+/g," ").trim();return s.length>n?s.slice(0,s.lastIndexOf(" ",n-1))+"...":s;}
function postDesc(p){
  const intro=p.blocks.find(b=>b[0]==="p"&&b[1].length>60&&!/^\d+\s*\./.test(b[1]));
  if(intro)return clip(intro[1]);
  const ing=p.blocks.filter(b=>b[0]==="ul").slice(0,5).map(b=>b[1].replace(/^[\d.,/½¼¾⅓⅔ ]+(g|kg|ml|mL|L|tbsp|tsp|cups?|Cups?)?\s*/,"").toLowerCase());
  return clip(p.kind==="recipes"?`How to make ${titleOf(p)} at home, step by step. With ${ing.join(", ")}.`:`${titleOf(p)} by The 2 Planners.`);
}
function isoDate(p){return p.ts?new Date(p.ts).toISOString().slice(0,10):undefined;}
function setTag(sel,make){let el=document.head.querySelector(sel);if(!el){el=make();document.head.appendChild(el);}return el;}
function meta(attr,name,val){const el=setTag(`meta[${attr}="${name}"]`,()=>{const m=document.createElement("meta");m.setAttribute(attr,name);return m;});el.setAttribute("content",val);}
function setSEO(h){
  if(!PATHS)return;
  const p=byId[h];
  const desc=p?postDesc(p):(SEC_DESC[h]||SEC_DESC.home);
  const url=ORIGIN+(p?p.path:(SEC_PATH[h]||"/"));
  const img=ORIGIN+(p&&p.photo?"/img/"+p.photo.cover+".webp":"/img/site/share.jpg");
  meta("name","description",desc);
  meta("property","og:title",document.title);meta("property","og:description",desc);meta("property","og:url",url);meta("property","og:image",img);
  meta("property","og:type",p?"article":"website");meta("property","og:site_name","The 2 Planners");
  meta("name","twitter:card","summary_large_image");
  const c=setTag('link[rel="canonical"]',()=>{const l=document.createElement("link");l.rel="canonical";return l;});c.href=url;
  const robots=setTag('meta[name="robots"]',()=>{const m=document.createElement("meta");m.name="robots";return m;});robots.content=h==="notfound"?"noindex":"index,follow";
  let ld;
  const org={"@type":"Organization","name":"The 2 Planners","url":ORIGIN+"/"};
  if(p&&p.kind==="recipes"){
    ld={"@context":"https://schema.org","@type":"Recipe","name":titleOf(p),"description":desc,"image":[img],"author":org,"publisher":org,"datePublished":isoDate(p),
      "recipeCategory":(p.tags.find(t=>["desserts","main dishes","appetizers","breakfast","drinks","bread"].includes(t))||undefined),
      "recipeCuisine":(p.tags.find(t=>["portuguese","italian","chinese","american","brazilian","mexican","french","british","vietnamese","swiss"].includes(t))||undefined),
      "keywords":p.tags.filter(t=>!["recipes","cooking"].includes(t)).join(", "),
      "recipeIngredient":p.blocks.filter(b=>b[0]==="ul").map(b=>b[1]),
      "recipeInstructions":p.blocks.filter(b=>b[0]==="ol"||(b[0]==="p"&&/^\d+\s*\./.test(b[1]))).map(b=>({"@type":"HowToStep","text":b[1].replace(/^\d+\s*\.\s*/,"")}))};
  }else if(p){
    ld={"@context":"https://schema.org","@type":"BlogPosting","headline":titleOf(p),"description":desc,"image":[img],"author":org,"publisher":org,"datePublished":isoDate(p),"mainEntityOfPage":url};
  }else{
    ld={"@context":"https://schema.org","@type":"WebSite","name":"The 2 Planners","url":ORIGIN+"/","description":SEC_DESC.home};
  }
  setTag('script[type="application/ld+json"]',()=>{const s=document.createElement("script");s.type="application/ld+json";return s;}).textContent=JSON.stringify(ld);
}
const view=document.getElementById("view");
function route(){
  const h=currentKey();
  let html,nav=h;
  if(h==="recipes")html=recipes();
  else if(h==="travel")html=travel();
  else if(h==="living"||h==="eat-out"){html=living(h==="eat-out"?"eat-out":"all");nav="living";}
  else if(h==="about")html=about();
  else if(byId[h]){html=postView(byId[h]);nav=byId[h].kind==="eat-out"?"living":byId[h].kind;}
  else if(h==="notfound"){html=notFound();nav="";}
  else {html=home();nav="home";}
  view.innerHTML=html;view.style.animation="none";void view.offsetWidth;view.style.animation="";
  document.querySelectorAll("nav.main a").forEach(a=>a.setAttribute("aria-current",a.dataset.k===nav?"page":"false"));
  window.scrollTo(0,0);
  initCarousel();initSurprise();initMap();
  if(byId[h]&&byId[h].kind==="recipes"){initScaler();initTimers(byId[h]);}
  if(byId[h])initFeedback(byId[h]);
  requestAnimationFrame(initReveal);
  const pageName={recipes:"Recipes",travel:"Travel",living:"Our daily life","eat-out":"Our daily life",about:"About us",notfound:"Page not found"}[h]||(byId[h]?titleOf(byId[h]):"");
  document.title=pageName?pageName+" | The 2 Planners":"The 2 Planners";
  setSEO(h);
  trackView(PATHS?location.pathname:"/"+(byId[h]||pageName?h:""),document.title);
  if(h==="recipes"){
    drawRecipes();
    document.getElementById("q").addEventListener("input",e=>{recipeState.q=e.target.value;drawRecipes();});
    view.querySelectorAll("[data-cat]").forEach(b=>b.addEventListener("click",()=>{recipeState.cat=b.dataset.cat;view.querySelectorAll("[data-cat]").forEach(x=>x.setAttribute("aria-pressed",x===b));drawRecipes();}));
  }
  if(h==="travel"){
    view.querySelectorAll("[data-country]").forEach(b=>b.addEventListener("click",()=>{
      view.querySelectorAll("[data-country]").forEach(x=>x.setAttribute("aria-pressed",x===b));
      const c=b.dataset.country;const list=latest("travel",99).filter(p=>c==="all"||p.tags.includes(c)||p.title.toLowerCase().includes(c)||(c==="czech republic"&&p.tags.includes("czech republic")));
      document.getElementById("lgrid").innerHTML=list.map(card).join("")||`<p class="empty">No guides for this country yet.</p>`;
    }));
  }
  if(h==="living"||h==="eat-out"){
    view.querySelectorAll("[data-living]").forEach(b=>b.addEventListener("click",()=>{
      view.querySelectorAll("[data-living]").forEach(x=>x.setAttribute("aria-pressed",x===b));
      document.getElementById("lgrid").innerHTML=livingList(b.dataset.living);
    }));
  }
  view.querySelectorAll(".inpics button").forEach(b=>b.addEventListener("click",()=>openLightbox(b.dataset.full)));
  view.querySelectorAll(".feature .stampin.photo").forEach(s=>{s.style.cursor="zoom-in";s.addEventListener("click",()=>openLightbox(s.querySelector("img").getAttribute("src")));});
  if(h==="about") view.querySelectorAll(".mosaic button,.aboutpic").forEach(b=>b.addEventListener("click",()=>openLightbox(b.dataset.full)));
  if(h==="about"){
    document.getElementById("copy").addEventListener("click",async e=>{
      const t=document.getElementById("mail").textContent;
      try{await navigator.clipboard.writeText(t);e.target.textContent="Copied";}
      catch(err){const r=document.createRange();r.selectNodeContents(document.getElementById("mail"));const s=getSelection();s.removeAllRanges();s.addRange(r);e.target.textContent="Selected, press copy";}
    });
  }
}
/* visit counting (GoatCounter, live site only): one view per page, including each post */
function trackView(path,title){
  let n=0;const go=()=>{const g=window.goatcounter;if(g&&g.count){g.count({path,title});}else if(n++<20){setTimeout(go,500);}};go();
}

/* ---- ratings and comments (live site only; stored with Netlify functions) ---- */
const STAR='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z"/></svg>';
const fbKey=p=>p.path.replace(/^\/|\/$/g,"");
function voterId(){let v=null;try{v=localStorage.getItem("t2p-voter");}catch(e){}
  if(!v){v=Array.from(crypto.getRandomValues(new Uint8Array(12)),b=>b.toString(36).padStart(2,"0")).join("").replace(/[^a-z0-9]/g,"").padEnd(16,"x").slice(0,24);try{localStorage.setItem("t2p-voter",v);}catch(e){}}
  return v;}
function starsRow(n,size){const f=Math.round(n*2)/2;let s="";for(let i=1;i<=5;i++)s+=`<span class="st ${f>=i?"full":f>=i-.5?"half":""}">${STAR}</span>`;return `<span class="stars-row ${size||""}">${s}</span>`;}
function feedbackHTML(p){
  const live=PATHS;
  const rate=p.kind==="recipes"?`<section class="rate" id="rate" aria-labelledby="rateH"><h3 id="rateH">Did you make it?</h3><p class="fb-note">Tell us how it went. Tap a star to rate this recipe.</p>
    <div class="rate-stars" role="radiogroup" aria-label="Rate this recipe">${[1,2,3,4,5].map(i=>`<button type="button" class="rs" data-v="${i}" role="radio" aria-checked="false" aria-label="${i} star${i>1?"s":""}"${live?"":" disabled"}>${STAR}</button>`).join("")}</div>
    <p class="rate-msg" id="rateMsg" aria-live="polite"></p></section>`:"";
  return `<div class="feedback">${rate}
  <section class="comments" aria-labelledby="cmH"><h3 id="cmH">Comments <span id="cmCount"></span></h3>
    <div id="cmList" class="cm-list">${live?`<p class="fb-note">Loading comments...</p>`:`<p class="fb-note">Ratings and comments work on the live site.</p>`}</div>
    <form id="cmForm" class="cm-form" novalidate>
      <h4>Leave a comment</h4>
      <label for="cmName">Your name</label><input id="cmName" name="name" maxlength="60" autocomplete="name" required>
      <label for="cmText">Comment</label><textarea id="cmText" name="text" rows="4" maxlength="2000" required></textarea>
      <div class="hp" aria-hidden="true"><label for="cmWeb">Website</label><input id="cmWeb" name="website" tabindex="-1" autocomplete="off"></div>
      <button class="btn" type="submit" id="cmSend"${live?"":" disabled"}>Send comment</button>
      <p class="fb-note">We read every comment before it appears, so it may take a little while to show up.</p>
      <p class="cm-msg" id="cmMsg" aria-live="polite"></p>
    </form></section></div>`;
}
function fmtDate(iso){try{return new Date(iso).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"});}catch(e){return "";}}
function showAvg(r){
  const a=document.getElementById("avgRating");
  if(a&&r&&r.count){a.hidden=false;a.innerHTML=`${starsRow(r.avg)}<b>${r.avg.toFixed(1)}</b><span>${r.count} rating${r.count>1?"s":""}</span>`;}
  const ld=document.head.querySelector('script[type="application/ld+json"]');
  if(ld&&r&&r.count){try{const o=JSON.parse(ld.textContent);if(o["@type"]==="Recipe"){o.aggregateRating={"@type":"AggregateRating","ratingValue":r.avg,"ratingCount":r.count,"bestRating":5,"worstRating":1};ld.textContent=JSON.stringify(o);}}catch(e){}}
}
function markMine(n){document.querySelectorAll(".rs").forEach(b=>{const v=+b.dataset.v;b.classList.toggle("on",v<=n);b.setAttribute("aria-checked",v===n?"true":"false");});}
function initFeedback(p){
  const list=document.getElementById("cmList");if(!list)return;
  const form=document.getElementById("cmForm"),msg=document.getElementById("cmMsg"),send=document.getElementById("cmSend");
  const t0=Date.now();
  form.addEventListener("submit",async e=>{
    e.preventDefault();if(!PATHS)return;
    const name=form.name.value.trim(),text=form.text.value.trim();
    if(!name){msg.textContent="Please add your name.";form.name.focus();return;}
    if(text.length<3){msg.textContent="Please write a comment.";form.text.focus();return;}
    send.disabled=true;msg.textContent="Sending...";
    try{const r=await fetch("/api/comment",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({post:fbKey(p),name,text,website:form.website.value,t:Date.now()-t0})});
      const j=await r.json();
      if(r.ok){form.reset();msg.textContent="Thank you! Your comment will appear once we've read it.";}
      else msg.textContent=j.error||"Something went wrong. Please try again.";
    }catch(err){msg.textContent="We couldn't send your comment. Check your connection and try again.";}
    send.disabled=false;
  });
  if(!PATHS)return;
  const voter=voterId();
  fetch(`/api/feedback?post=${encodeURIComponent(fbKey(p))}&voter=${voter}`).then(r=>r.ok?r.json():Promise.reject()).then(d=>{
    if(currentKey()!==p.id)return;
    const cs=d.comments||[];
    document.getElementById("cmCount").textContent=cs.length?`(${cs.length})`:"";
    list.innerHTML=cs.length?cs.map(c=>`<article class="cm"><header><b>${esc(c.name)}</b><time>${esc(fmtDate(c.date))}</time></header><p>${esc(c.text).replace(/\n/g,"<br>")}</p></article>`).join(""):`<p class="fb-note">No comments yet. Be the first!</p>`;
    if(d.rating){showAvg(d.rating);markMine(d.rating.mine||0);}
  }).catch(()=>{list.innerHTML=`<p class="fb-note">Comments couldn't load right now.</p>`;});
  const rmsg=document.getElementById("rateMsg");
  document.querySelectorAll(".rs").forEach(b=>{
    b.addEventListener("mouseenter",()=>document.querySelectorAll(".rs").forEach(x=>x.classList.toggle("hover",+x.dataset.v<=+b.dataset.v)));
    b.addEventListener("mouseleave",()=>document.querySelectorAll(".rs").forEach(x=>x.classList.remove("hover")));
    b.addEventListener("click",async()=>{
      const v=+b.dataset.v;markMine(v);rmsg.textContent="Saving...";
      try{const r=await fetch("/api/rate",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({post:fbKey(p),stars:v,voter})});
        const j=await r.json();
        if(r.ok){showAvg(j.rating);rmsg.textContent=`Thanks! You gave it ${v} star${v>1?"s":""}.`;}else rmsg.textContent=j.error||"Something went wrong.";
      }catch(e){rmsg.textContent="We couldn't save your rating. Try again later.";}
    });
  });
}
function openLightbox(start){
  const els=[...view.querySelectorAll(".feature .stampin.photo img, [data-full]")];
  let list=[...new Set(els.map(e=>e.dataset.full||e.getAttribute("src")))];
  let i=Math.max(0,list.indexOf(start));if(list.indexOf(start)<0){list=[start];i=0;}
  const many=list.length>1;
  const lb=document.createElement("div");lb.className="lightbox";lb.setAttribute("role","dialog");lb.setAttribute("aria-label","Photos");
  lb.innerHTML=`<img alt="">
    <button type="button" class="lb-close">Close</button>
    ${many?`<button type="button" class="lb-nav lb-prev" aria-label="Previous photo"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>
    <button type="button" class="lb-nav lb-next" aria-label="Next photo"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>
    <span class="lb-count" aria-live="polite"></span>`:""}`;
  const img=lb.querySelector("img"),count=lb.querySelector(".lb-count");
  const show=()=>{img.src=list[i];if(count)count.textContent=(i+1)+" / "+list.length;
    [list[(i+1)%list.length],list[(i-1+list.length)%list.length]].forEach(s=>{const p=new Image();p.src=s;});};
  const go=d=>{if(!many)return;i=(i+d+list.length)%list.length;show();};
  const close=()=>{lb.remove();document.removeEventListener("keydown",key);};
  const key=e=>{if(e.key==="Escape")close();else if(e.key==="ArrowRight")go(1);else if(e.key==="ArrowLeft")go(-1);};
  lb.addEventListener("click",e=>{
    if(e.target.closest(".lb-prev"))return go(-1);
    if(e.target.closest(".lb-next"))return go(1);
    if(e.target===img&&many)return go(1);
    close();
  });
  let x0=null;
  lb.addEventListener("touchstart",e=>{x0=e.touches[0].clientX;},{passive:true});
  lb.addEventListener("touchend",e=>{if(x0===null)return;const dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)>40){go(dx<0?1:-1);}},{passive:true});
  document.addEventListener("keydown",key);
  document.body.appendChild(lb);show();lb.querySelector(".lb-close").focus();
}
if(!PATHS)addEventListener("hashchange",route);route();
/* Buy Me a Coffee: open the donation panel on the page when the widget is available, otherwise follow the link */
document.addEventListener("click",e=>{
  const a=e.target.closest("a.coffee");if(!a)return;
  const w=document.getElementById("bmc-wbtn");
  if(w){e.preventDefault();w.click();}
});
/* ---- site search ---- */
(function(){
  const box=document.getElementById("srch"),q=document.getElementById("srchQ"),res=document.getElementById("srchRes"),btn=document.getElementById("searchBtn");
  const kindName={recipes:"Recipe",travel:"City guide","eat-out":"Eating out",living:"Daily life"};
  const norm=s=>s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  const IDX=ALL.map(p=>({p,ti:norm(titleOf(p)+" "+p.title),tg:norm(p.tags.join(" ")),mid:norm(p.blocks.filter(b=>b[0]==="ul"||b[0]==="h3"||b[0]==="h4").map(b=>b[1]).join(" ")),all:norm(p.blocks.map(b=>b[1]).join(" "))}));
  let sel=-1,items=[];
  const HINTS=["cinnamon","codfish","Prague","chocolate","Christmas","Porto"];
  function hl(text,words){let h=esc(text);for(const w of words){if(w.length<2)continue;const re=new RegExp("("+w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+")","ig");h=h.replace(re,"<mark>$1</mark>");}return h;}
  function run(){
    const raw=q.value.trim();const words=norm(raw).split(/\s+/).filter(Boolean);
    sel=-1;
    if(!words.length){res.innerHTML=`<div class="srch-msg">Try a dish, an ingredient or a city.<div class="srch-hints">${HINTS.map(h=>`<button type="button" class="chip" data-h="${h}">${h}</button>`).join("")}</div></div>`;
      res.querySelectorAll("[data-h]").forEach(b=>b.addEventListener("click",()=>{q.value=b.dataset.h;run();q.focus();}));items=[];return;}
    const out=[];
    for(const e of IDX){let s=0,ok=true;
      for(const w of words){const st=w.length>3?w.replace(/s$/,""):w;let ws=0;
        if(e.ti.includes(st))ws+=6;if(e.tg.includes(st))ws+=3;if(e.mid.includes(st))ws+=2;if(!ws&&e.all.includes(st))ws+=1;
        if(!ws){ok=false;break;}s+=ws;}
      if(ok)out.push([s,e.p]);}
    out.sort((a,b)=>b[0]-a[0]||b[1].ts-a[1].ts);
    items=out.slice(0,20).map(x=>x[1]);
    if(!items.length){res.innerHTML=`<div class="srch-msg">Nothing found for “${esc(raw)}”. Try another word.</div>`;return;}
    const shown=raw.split(/\s+/).filter(Boolean);
    res.innerHTML=items.map(p=>`<a href="${H(p.id)}">${p.photo?`<img src="${src(p.photo.cover)}" alt="" loading="lazy">`:`<i style="--tint:${tint(p)}">${esc(mono(p)).slice(0,2)}</i>`}<span><b>${hl(titleOf(p),shown)}</b><small>${kindName[p.kind]||""}${p.date?" · "+esc(p.date):""}</small></span></a>`).join("")+(out.length>20?`<div class="srch-msg">Showing 20 of ${out.length}. Add another word to narrow it down.</div>`:"");
    res.querySelectorAll("a").forEach(a=>a.addEventListener("click",close));
  }
  function mark(){res.querySelectorAll("a").forEach((a,i)=>a.classList.toggle("on",i===sel));const a=res.querySelectorAll("a")[sel];if(a)a.scrollIntoView({block:"nearest"});}
  function open(){box.hidden=false;run();setTimeout(()=>{q.focus();q.select();},30);}
  function close(){box.hidden=true;}
  btn.addEventListener("click",open);
  document.getElementById("srchClose").addEventListener("click",close);
  box.addEventListener("click",e=>{if(e.target===box)close();});
  q.addEventListener("input",run);
  q.addEventListener("keydown",e=>{
    const n=res.querySelectorAll("a").length;
    if(e.key==="ArrowDown"&&n){e.preventDefault();sel=(sel+1)%n;mark();}
    else if(e.key==="ArrowUp"&&n){e.preventDefault();sel=(sel-1+n)%n;mark();}
    else if(e.key==="Enter"&&n){e.preventDefault();const a=res.querySelectorAll("a")[Math.max(sel,0)];navigate(a.getAttribute("href"));close();}
  });
  document.addEventListener("keydown",e=>{
    if(e.key==="Escape"&&!box.hidden)close();
    else if(e.key==="/"&&box.hidden&&!/INPUT|TEXTAREA/.test(document.activeElement.tagName)){e.preventDefault();open();}
  });
})();


