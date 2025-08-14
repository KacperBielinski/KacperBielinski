/* ========= Helpers ========= */
const qs  = (s, r=document) => r.querySelector(s);
const qsa = (s, r=document) => Array.from(r.querySelectorAll(s));

/* ========= Active nav on scroll ========= */
const links = qsa('.nav__link');
function setActiveLink(){
  const y = window.scrollY + 120;
  links.forEach(a => {
    const t = qs(a.getAttribute('href')); if (!t) return;
    const top = t.offsetTop, bottom = top + t.offsetHeight;
    a.classList.toggle('active', y >= top && y < bottom);
  });
}
window.addEventListener('scroll', setActiveLink);

/* ========= ABOUT: animacja wejścia boxu ========= */
const aboutCard = qs('.about-card');
if (aboutCard){
  const ioAbout = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if (!e.isIntersecting) return;
      aboutCard.classList.add('animate');
      ioAbout.unobserve(aboutCard);
    });
  }, {threshold:.2, rootMargin:'0px 0px -60px 0px'});
  ioAbout.observe(aboutCard);
}

/* ========= REEL: wysuwanie z dołu ========= */
const REVEAL_MS = 550;
const reel  = qs('#reel');
const items = qsa('.reel__item', reel || undefined);
let revealed = false;

function runReveal(){
  if (revealed) return;
  revealed = true;
  if (!reel) return;
  qsa('video', reel).forEach(v => v.pause());
  items.forEach((item, i) => setTimeout(() => item.classList.add('is-visible'), i * REVEAL_MS));
}
if (reel){
  const ioReel = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) runReveal(); });
  }, { threshold: .25 });
  ioReel.observe(reel);
}

/* ========= SERVICES: sekwencyjna animacja kart ========= */
const servicesGrid = qs('.services-grid');
if (servicesGrid){
  const cards = qsa('.service-card--themed', servicesGrid);
  const ioServices = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if (!entry.isIntersecting) return;
      cards.forEach((card, i)=>setTimeout(()=>{
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, i*140));
      ioServices.unobserve(servicesGrid);
    });
  }, {threshold:.15, rootMargin:'0px 0px -40px 0px'});
  ioServices.observe(servicesGrid);
}

/* ========= LIGHTBOX ========= */
const lb       = qs('#lightbox');
const lbStage  = qs('#lightbox-stage');
const lbCap    = qs('#lightbox-caption');
const lbClose  = qs('.lightbox__close');
const lbBack   = qs('.lightbox__backdrop');

function openLightbox({ type, src, title }){
  document.body.classList.add('no-scroll');
  lbStage.innerHTML = '';

  if (type === 'video'){
    const v = document.createElement('video');
    v.src = src;
    v.controls = true;
    v.autoplay = true;
    v.playsInline = true;
    v.setAttribute('muted',''); // iOS autoplay-safe
    lbStage.appendChild(v);
  } else {
    const img = document.createElement('img');
    img.src = src;
    img.alt = title || '';
    lbStage.appendChild(img);
  }

  lbCap.textContent = title || '';
  lb.removeAttribute('hidden');
  lb.setAttribute('aria-hidden', 'false');
  document.addEventListener('keydown', onEscClose);
}
function closeLightbox(){
  document.body.classList.remove('no-scroll');
  lb.setAttribute('aria-hidden', 'true');
  lb.setAttribute('hidden', '');
  lbStage.innerHTML = '';
  lbCap.textContent = '';
  document.removeEventListener('keydown', onEscClose);
}
function onEscClose(e){ if (e.key === 'Escape') closeLightbox(); }

lbClose.addEventListener('click', closeLightbox);
lbBack .addEventListener('click', closeLightbox);

/* Klik w kafelek – otwórz podgląd */
qsa('.reel__item').forEach(card => {
  card.addEventListener('click', () => {
    const type  = card.getAttribute('data-type');
    const src   = card.getAttribute('data-src');
    const title = card.getAttribute('data-title');
    const v = card.querySelector('video'); if (v) v.pause();
    openLightbox({ type, src, title });
  });
});

/* ===== Init ===== */
document.addEventListener('DOMContentLoaded', () => {
  setActiveLink();
});
