
document.querySelectorAll('.has-dropdown > a').forEach(a=>{
  a.addEventListener('click', e=>{ if(window.innerWidth<=900){ e.preventDefault(); const li=a.parentElement; const ex=li.classList.toggle('open'); a.setAttribute('aria-expanded', ex?'true':'false'); } });
});
