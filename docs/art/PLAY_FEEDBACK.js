/* Cosmetic turn memory belongs to feedback, never to the save or engine RNG. */
function feedbackBeginTurn(g){
  if(!feedbackCurrent(g))return;
  if(scFeedback.run!==g.run){if(scFeedback.run!==-1)feedbackCancel();scFeedback.run=g.run;}
  if(!scFeedback.history)scFeedback.history={turn:0,spoken:-3,asides:0,counts:{},low:false,ready:false};
  scFeedback.history.turn++;
  const restored=g.restoration?.cells.filter(c=>c.restored).map(c=>c.index)||[];
  scFeedback.turn={game:g,score:g.score,restored:new Set(restored),seen:new Set(restored),created:null,powers:0,waves:0,done:false};
  const actor=$('play-confite');if(actor)actor.dataset.mood='watching';
}
function feedbackSay(g,text,mood='happy'){
  if(!feedbackCurrent(g)||!text)return;
  setTip('«'+text+'»');
  const tip=$('board-tip');if(tip)tip.dataset.speaker='Confite';
  const actor=$('play-confite');if(actor){actor.innerHTML=confite(mood);actor.dataset.mood=mood;feedbackClass(actor,'sc-companion-react',650);}
}
function feedbackTurn(g,quiet=false){
  const turn=scFeedback.turn,history=scFeedback.history;
  if(!feedbackCurrent(g)||!turn||turn.game!==g||turn.done||!history)return;
  turn.done=true;
  const points=Math.max(0,g.score-turn.score),restored=(g.restoration?.restored||0)-turn.restored.size;
  const note=$('turn-note');if(note)note.textContent='+'+points.toLocaleString('es')+' de luz'+(restored?' · '+restored+' '+(restored===1?'zona':'zonas'):turn.waves>1?' · '+turn.waves+' cascadas':'');
  if(quiet)return;
  const candidates=[];
  if(restored>0)candidates.push(g.restoration.restored===g.restoration.total?'place_complete':g.restoration.kind);
  if(turn.created)candidates.push('created_'+turn.created);
  if(turn.powers>=2)candidates.push('power_chain');
  if(turn.waves>=3)candidates.push('cascade');
  if(g.pulse>=pulseNeed()&&!history.ready)candidates.push('pulse_ready');
  if(g.mode==='campaign'&&g.moves>0&&g.moves<=3&&!history.low)candidates.push('last_moves');
  if(g.pulse<pulseNeed())history.ready=false;
  const key=candidates.find(k=>(PLAY_LINES[k]?.length||0)>(history.counts[k]||0)&&(k==='place_complete'||(history.asides<3&&history.turn-history.spoken>=2)));
  if(!key)return;
  const lines=PLAY_LINES[key];
  const count=history.counts[key]||0;
  // Each line is heard once per attempt. Quiet is better than a looping cheer.
  if(count>=lines.length)return;
  history.counts[key]=count+1;history.spoken=history.turn;
  if(key!=='place_complete')history.asides++;
  if(key==='pulse_ready')history.ready=true;
  if(key==='last_moves')history.low=true;
  feedbackSay(g,lines[count],key==='last_moves'?'worried':restored?'celebrate':'excited');
}
function feedbackPower(g,triggered,group){
  if(!feedbackCurrent(g)||feedbackReduced()||!group)return;
  const board=$('board'),rect=board?.getBoundingClientRect();if(!rect?.width)return;
  const cell=rect.width/g.size;
  for(const i of (triggered||[]).slice(0,3)){
    const power=g.board[i]?.power,x=rect.left+(i%g.size+.5)*cell,y=rect.top+(Math.floor(i/g.size)+.5)*cell;
    if(power==='row'||power==='col')feedbackParticle(group,'sc-beam',power==='row'?rect.left+rect.width/2:x,power==='col'?rect.top+rect.height/2:y,{'--beam-w':(power==='row'?rect.width:5)+'px','--beam-h':(power==='col'?rect.height:5)+'px'});
    else if(power==='bomb')feedbackParticle(group,'sc-ring sc-power-ring',x,y,{'--fx-size':cell*2.7+'px','--fx-color':'#dfbd87'});
    else if(power==='prism')feedbackParticle(group,'sc-ring sc-power-ring',x,y,{'--fx-size':cell*2+'px','--fx-color':'#aacdc6'});
  }
}
function feedbackRestoration(g,indices,group){
  if(!feedbackCurrent(g)||!indices.length)return;
  feedbackSound('restore');
  const scene=$('play-scene');feedbackClass(scene,'sc-place-awake',700);
  if(feedbackReduced()||!group)return;
  const board=$('board'),rect=board?.getBoundingClientRect(),destination=feedbackCenter(scene);
  if(!rect?.width||!destination)return;
  const cell=rect.width/g.size;
  for(const i of indices.slice(0,3)){
    const x=rect.left+(i%g.size+.5)*cell,y=rect.top+(Math.floor(i/g.size)+.5)*cell,dx=destination.x-x,dy=destination.y-y;
    feedbackParticle(group,'sc-light sc-restoration-thread',x,y,{'--fx-x':dx+'px','--fx-y':dy+'px','--fx-mid-x':dx*.3+'px','--fx-mid-y':dy*.6+'px','--fx-delay':'0ms'});
  }
}
