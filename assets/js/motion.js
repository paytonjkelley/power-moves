(()=>{
  const video=document.querySelector('.feature-video video');
  if(!video)return;
  video.defaultMuted=true;
  video.muted=true;
  video.playsInline=true;
  let visible=false,manualPause=false,pending=false,automaticPause=false;
  const fallback=document.createElement('button');
  fallback.type='button';fallback.className='video-start';
  fallback.textContent='Tap to play';fallback.hidden=true;
  video.parentElement.append(fallback);
  function pauseOffscreen(){
    if(!video.paused){automaticPause=true;video.pause();}
  }
  function attempt(){
    if(!visible||document.hidden||manualPause||video.ended||pending)return;
    pending=true;
    const result=video.play();
    if(result)result.then(()=>{fallback.hidden=true;}).catch(()=>{if(visible)fallback.hidden=false;}).finally(()=>{pending=false;});
    else pending=false;
  }
  video.addEventListener('pause',()=>{
    if(automaticPause){automaticPause=false;return;}
    if(visible&&!document.hidden&&!video.ended)manualPause=true;
  });
  video.addEventListener('playing',()=>{
    fallback.hidden=true;manualPause=false;
    if(!visible||document.hidden)pauseOffscreen();
  });
  fallback.addEventListener('click',()=>{manualPause=false;attempt();});
  new IntersectionObserver(entries=>{
    visible=entries[0].intersectionRatio>=0.35;
    video.autoplay=visible&&!manualPause;
    if(visible)attempt();else{fallback.hidden=true;pauseOffscreen();}
  },{threshold:[0,0.35]}).observe(video);
  ['loadedmetadata','canplay'].forEach(event=>video.addEventListener(event,attempt));
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseOffscreen();else attempt();});
  document.addEventListener('touchend',event=>{if(!event.target.closest('video,button'))attempt();},{passive:true});
})();
