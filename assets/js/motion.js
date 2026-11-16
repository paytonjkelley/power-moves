(()=>{
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const hero=document.querySelector('.hero-media'),heroButton=document.querySelector('.hero-motion-toggle');
let heroPaused=reduced.matches;
function heroState(){hero.classList.toggle('is-paused',heroPaused);heroButton.textContent=heroPaused?'Play motion':'Pause motion';heroButton.setAttribute('aria-label',heroPaused?'Play hero animation':'Pause hero animation');heroButton.setAttribute('aria-pressed',String(heroPaused));}
heroButton.addEventListener('click',()=>{heroPaused=!heroPaused;heroState()});heroState();
const button=document.querySelector('#motion-toggle'),photo=document.querySelector('.feature-bg'),caption=document.querySelector('.feature-caption');
const slides=[['concert.jpg','Stay for the encore.','Your battery will too.'],['experience-dining.png','Stay for one more story.','Keep the connection going.'],['experience-nightlife.png','Make a night of it.','Keep your moments powered.'],['experience-cafes.png','Make room for your next idea.','Power that moves with you.'],['experience-network.png','Meet your next connection.','Be present for the possibility.'],['experience-wellness.png','Find your balance.','Stay connected to what matters.']];
let paused=reduced.matches,i=0;function state(){button.textContent=paused?'Play':'Pause';button.setAttribute('aria-label',paused?'Play motion feature':'Pause motion feature');button.setAttribute('aria-pressed',String(paused));}button.addEventListener('click',()=>{paused=!paused;state()});state();
setInterval(()=>{if(paused||document.hidden)return;i=(i+1)%slides.length;const [src,title,sub]=slides[i];photo.src='assets/img/'+src;if(!reduced.matches)photo.animate([{opacity:.25},{opacity:1}],{duration:900,easing:'ease-out'});caption.replaceChildren(document.createTextNode(title),document.createElement('br'));const span=document.createElement('span');span.textContent=sub;caption.append(span);},5500);
reduced.addEventListener('change',()=>{paused=reduced.matches;heroPaused=reduced.matches;state();heroState()});
})();
