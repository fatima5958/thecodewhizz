(() => {
  'use strict';
  const stage = document.querySelector('#stage');
  const experience = document.querySelector('#experience');
  const canvas = document.querySelector('#food-canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const copy = document.querySelector('#hero-copy');
  const scene = document.querySelector('#food-scene');
  const note = document.querySelector('#ingredient-note');
  const noteNumber = document.querySelector('#ingredient-number');
  const noteName = document.querySelector('#ingredient-name');
  const progress = document.querySelector('#scroll-progress');
  const play = document.querySelector('#motion-control');
  const playLabel = document.querySelector('#play-label');
  const playIcon = document.querySelector('#play-icon');
  const mobile = matchMedia('(max-width:640px)');
  const reduce = matchMedia('(prefers-reduced-motion:reduce)');
  const sheets = Array.from({length:16}, () => ({ blob:null, fetching:null, bitmap:null, decoding:null, failed:false }));
  const clamp = (n,min=0,max=1) => Math.min(max,Math.max(min,n));
  let current=0, target=0, playing=false, visible=true, raf=0, previousTime=0, drawn=-1;
  let sectionTop=0, scrollDistance=1, activeSheet=1, drawingFailed=false;
  const startFrame=18, endFrame=156;
  const measure=()=> { sectionTop=experience.getBoundingClientRect().top+scrollY; scrollDistance=Math.max(1,experience.offsetHeight-stage.offsetHeight); target=clamp((scrollY-sectionTop)/scrollDistance); };
  function wake(){if(!raf && visible && !document.hidden) raf=requestAnimationFrame(tick);}
  async function fetchSheet(index){
    const s=sheets[index]; if(!s || s.failed) return null;
    if(s.blob) return s.blob;
    if(!s.fetching){s.fetching=fetch(`assets/ember/motion-${String(index+1).padStart(2,'0')}.webp`).then(r=>{if(!r.ok)throw new Error('Frame image unavailable');return r.blob();}).then(blob=>s.blob=blob).catch(()=>{s.failed=true;return null;});}
    return s.fetching;
  }
  function release(bitmap){if(typeof bitmap?.close==='function')bitmap.close();else if(bitmap)bitmap.src='';}
  function evict(){sheets.forEach((s,i)=>{if(s.bitmap && Math.abs(i-activeSheet)>1){release(s.bitmap);s.bitmap=null;}});}
  async function decodeSheet(index){
    const s=sheets[index]; if(!s || s.failed) return null;
    if(s.bitmap) return s.bitmap;
    if(!s.decoding){s.decoding=(async()=>{
      const blob=await fetchSheet(index);if(!blob)return null;
      let bitmap;
      try{if('createImageBitmap' in window) bitmap=await createImageBitmap(blob);else{const url=URL.createObjectURL(blob);bitmap=await new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>{URL.revokeObjectURL(url);resolve(img);};img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('Image decode failed'));};img.src=url;});}}
      catch{ s.failed=true;return null; }
      if(Math.abs(index-activeSheet)>1){release(bitmap);return null;}
      s.bitmap=bitmap;evict();wake();return bitmap;
    })().finally(()=>s.decoding=null);}
    return s.decoding;
  }
  function renderFrame(frame){
    const sheetIndex=Math.floor(frame/12);activeSheet=sheetIndex;
    const sheet=sheets[sheetIndex];
    if(!sheet.bitmap){decodeSheet(sheetIndex);return false;}
    if(frame!==drawn){const tile=frame%12;
      try{ctx.drawImage(sheet.bitmap,(tile%4)*480+100,Math.floor(tile/4)*854,380,854,0,0,380,854);}
      catch{drawingFailed=true;stage.classList.remove('sequence-ready');return false;}
      drawn=frame;stage.classList.add('sequence-ready');canvas.dataset.frame=String(frame);
    }
    decodeSheet(sheetIndex+1);decodeSheet(sheetIndex-1);evict();return true;
  }
  function syncPlay(){playLabel.textContent=playing?'Pause the layers':current>.96?'Replay the layers':'Play the layers';playIcon.textContent=playing?'Ⅱ':'▷';play.setAttribute('aria-label',playing?'Pause ingredient animation':'Play ingredient animation');}
  function renderLayout(){
    const p=current;
    if(mobile.matches){const fade=clamp(1-p/0.22);copy.style.opacity=String(fade);copy.style.transform=`translateY(${-p*30}px)`;copy.style.pointerEvents=fade<.1?'none':'';scene.style.transform=`translate(-50%,calc(-50% + ${12-p*22}px)) scale(${1-p*.08})`;note.style.opacity=String(clamp((p-.28)/.15));}
    else{copy.style.opacity='1';copy.style.transform='';copy.style.pointerEvents='';scene.style.transform=`translate(-50%,-50%) scale(${1-p*.07})`;note.style.opacity=String(clamp((p-.32)/.2));}
    const layer=p<.58?0:p<.8?1:2;
    noteNumber.textContent=['01 / THE FINISHING TOUCH','02 / THE PERFECT BALANCE','03 / AT THE HEART'][layer];
    noteName.textContent=['Golden brioche.','Freshness in every bite.','A little fire. A lot of flavor.'][layer];
    progress.style.transform=`scaleX(${p})`;stage.dataset.motion=playing?'playing':Math.abs(target-current)>.001?'scrubbing':'settled';
  }
  function tick(time){
    raf=0;const dt=Math.min(50,previousTime?time-previousTime:16.67);previousTime=time;
    if(playing){target=clamp(target+dt/6500);if(target>=1){playing=false;syncPlay();}}
    current=reduce.matches?0:current+(target-current)*(1-Math.exp(-dt/95));
    if(Math.abs(target-current)<.0005)current=target;
    if(!drawingFailed)renderFrame(startFrame+Math.round(current*(endFrame-startFrame)));
    renderLayout();
    if(playing||Math.abs(target-current)>.0005)wake();else{previousTime=0;syncPlay();}
  }
  function onScroll(){playing=false;target=clamp((scrollY-sectionTop)/scrollDistance);syncPlay();wake();}
  play.addEventListener('click',()=>{if(reduce.matches)return;if(playing){playing=false;syncPlay();return;}if(current>.96){current=0;target=0;}else target=current;playing=true;syncPlay();wake();});
  addEventListener('scroll',onScroll,{passive:true});
  addEventListener('resize',()=>{measure();wake();},{passive:true});
  reduce.addEventListener('change',()=>{playing=false;current=0;measure();syncPlay();wake();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){if(raf)cancelAnimationFrame(raf);raf=0;previousTime=0;playing=false;syncPlay();}else wake();});
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)wake();else{playing=false;syncPlay();}},{threshold:0}).observe(stage);
  measure();wake();
  if(!reduce.matches && !navigator.connection?.saveData){
    // Fetch compressed sheets progressively. Only current and adjacent sheets remain decoded.
    let next=0;const preload=async()=>{while(next<sheets.length){const i=next++;await fetchSheet(i);}};
    const idle=window.requestIdleCallback||((fn)=>setTimeout(fn,700));idle(()=>{preload();preload();});
  }
  const cards=[...document.querySelectorAll('.dish')];
  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
    document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    let count=0;cards.forEach(card=>{card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter;if(!card.hidden)count++;});
    document.querySelector('#menu-grid').scrollTo({left:0,behavior:'instant'});
    document.querySelector('#menu-status').textContent=`${count} sample ${count===1?'dish':'dishes'} · Illustrative prices`;
  }));
  const details={
    classic:{title:'The Ember Classic',description:'Golden brioche, a juicy grilled patty and just the right amount of melt.',ingredients:['Sesame brioche','Grilled beef patty','Cheddar cheese','Tomato, lettuce and onion','House burger sauce']},
    smoke:{title:'Smoke & Crunch',description:'A bolder bite with smoky sauce and a little extra crunch.',ingredients:['Toasted burger bun','Grilled patty','Smoky sauce','Fresh greens and pickles','Golden onions']},
    fries:{title:'Golden Hour Fries',description:'Crisp on the outside. Fluffy in the middle. Made for sharing—or keeping.',ingredients:['Golden potato fries','House seasoning','Signature dip']}
  };
  const dialog=document.querySelector('#dish-dialog');let trigger=null;
  document.querySelectorAll('[data-dish]').forEach(button=>button.addEventListener('click',()=>{
    const dish=details[button.dataset.dish];if(!dish)return;trigger=button;
    document.querySelector('#dialog-title').textContent=dish.title;document.querySelector('#dialog-description').textContent=dish.description;
    const list=document.querySelector('#dialog-ingredients');list.replaceChildren(...dish.ingredients.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));dialog.showModal();
  }));
  document.querySelectorAll('.dialog-close,.dialog-done').forEach(button=>button.addEventListener('click',()=>dialog.close()));
  dialog.addEventListener('click',e=>{if(e.target===dialog){const b=dialog.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)dialog.close();}});
  dialog.addEventListener('close',()=>trigger?.focus());
})();
