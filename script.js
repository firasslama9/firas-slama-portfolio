const menuButton=document.querySelector('.menu-toggle');
const nav=document.querySelector('.nav-links');

if(menuButton&&nav){
  menuButton.addEventListener('click',()=>{
    const open=nav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded',String(open));
    menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation');
  });
  nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
    nav.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded','false');
    menuButton.setAttribute('aria-label','Open navigation');
  }));
}

const year=document.querySelector('#year');
if(year) year.textContent=String(new Date().getFullYear());

const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const counters=document.querySelectorAll('.count-up[data-count]');
const statsBand=document.querySelector('.stats-band');

function renderCount(element,value){
  const pad=Number(element.dataset.pad||0);
  element.textContent=String(value).padStart(pad,'0')+(element.dataset.suffix||'');
}
function showFinal(element){renderCount(element,Number(element.dataset.count));}
function animateCount(element){
  const target=Number(element.dataset.count);
  const duration=1500;
  let started=null;
  const tick=(now)=>{
    if(started===null) started=now;
    const progress=Math.min((now-started)/duration,1);
    const eased=1-Math.pow(1-progress,3);
    renderCount(element,Math.round(target*eased));
    if(progress<1) window.requestAnimationFrame(tick);
    else showFinal(element);
  };
  window.requestAnimationFrame(tick);
}
if(reduceMotion){
  counters.forEach(showFinal);
}else if(statsBand&&counters.length&&'IntersectionObserver'in window){
  counters.forEach(el=>renderCount(el,0));
  let started=false;
  const observer=new IntersectionObserver(entries=>{
    if(!started&&entries.some(entry=>entry.isIntersecting)){
      started=true;
      counters.forEach((el,index)=>window.setTimeout(()=>animateCount(el),index*95));
      observer.disconnect();
    }
  },{threshold:.12});
  observer.observe(statsBand);
}else{
  counters.forEach(showFinal);
}

const revealItems=document.querySelectorAll('[data-reveal]');
if(reduceMotion||!('IntersectionObserver'in window)){
  revealItems.forEach(el=>el.classList.add('is-visible'));
}else{
  const revealObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },{threshold:.12,rootMargin:'0px 0px 35px 0px'});
  revealItems.forEach(el=>revealObserver.observe(el));
}
