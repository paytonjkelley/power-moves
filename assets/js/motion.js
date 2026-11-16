(()=>{
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const hero=document.querySelector('.hero-media'),heroButton=document.querySelector('.hero-motion-toggle');
let heroPaused=reduced.matches;
function heroState(){hero.classList.toggle('is-paused',heroPaused);heroButton.textContent=heroPaused?'Play motion':'Pause motion';heroButton.setAttribute('aria-label',heroPaused?'Play hero animation':'Pause hero animation');heroButton.setAttribute('aria-pressed',String(heroPaused));}
heroButton.addEventListener('click',()=>{heroPaused=!heroPaused;heroState()});heroState();
reduced.addEventListener('change',()=>{heroPaused=reduced.matches;heroState()});
})();

(()=>{
const video=document.querySelector('.feature-video video');if(!video)return;
video.muted=true;let visible=false,manualPause=false;
video.addEventListener('pause',()=>{if(visible&&!document.hidden&&!video.ended)manualPause=true;});
video.addEventListener('play',()=>{manualPause=false;});
const update=()=>{if(visible&&!document.hidden&&!manualPause&&!video.ended){video.play().catch(()=>{});}else if(!visible||document.hidden){video.pause();}};
new IntersectionObserver(entries=>{visible=entries[0].intersectionRatio>=0.5;update();},{threshold:[0,0.5]}).observe(video);
document.addEventListener('visibilitychange',update);
})();
