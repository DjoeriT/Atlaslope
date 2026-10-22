import { chromium } from 'playwright';
const URL='file:///Users/djoeri/Developer/Atlaslope/mocks/guide-redesign-r1/index.html';
const b=await chromium.launch(); const out={};
for (const k of 'abcd') for (const w of [1440,390]) {
  const p=await (await b.newContext({viewport:{width:w,height:900}})).newPage();
  await p.goto('about:blank'); await p.goto(URL+'#solo='+k); await p.waitForTimeout(2000);
  out[k+w]=await p.evaluate(()=>{const over=[...document.querySelectorAll('.d-nums b, h1, h2, h3')].filter(e=>e.scrollWidth>e.clientWidth+1||e.getBoundingClientRect().right>innerWidth+1).map(e=>e.textContent.trim().slice(0,30));
    const srcs=[...document.querySelectorAll('img')].filter(i=>!i.closest('#story,.story,[id*=map]')).map(i=>i.src.slice(-60));const seen={};const dupAlt=[];[...document.querySelectorAll("img")].forEach(i=>{const s=i.src.slice(-60);if(seen[s])dupAlt.push(i.alt+" / "+seen[s]);else seen[s]=i.alt||"(no alt)"});const dup=dupAlt;
    const back=[...document.querySelectorAll('.back')].map(e=>e.getBoundingClientRect().height);
    return {sw:document.documentElement.scrollWidth,over,dup,back};});
  await p.close();
}
console.log(JSON.stringify(out));await b.close();
