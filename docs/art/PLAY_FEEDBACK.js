/* Cosmetic turn memory belongs to feedback, never to the save or engine RNG. */
function feedbackBeginTurn(g){
  if(!feedbackCurrent(g))return;
  if(scFeedback.run!==g.run){if(scFeedback.run!==-1)feedbackCancel();scFeedback.run=g.run;}
  if(!scFeedback.history)scFeedback.history={turn:0,spoken:-3,counts:{},low:false,ready:false};
  scFeedback.history.turn++;
  scFeedback.turn={game:g,score:g.score,restored:new Set(g.restoration?.cells.filter(c=>c.restored).map(c=>c.index)||[]),created:null,powers:0,waves:0,done:false};
  const actor=$('play-confite');if(actor)actor.dataset.mood='watching';
}
function feedbackSay(g,text,mood='happy'){
  if(!feedbackCurrent(g)||!text)return;
  setTip('«'+text+'»');
  const tip=$('board-tip');if(tip)tip.dataset.speaker='Confite';
  const actor=$('play-confite');if(actor){actor.innerHTML=confite(mood);actor.dataset.mood=mood;feedbackClass(actor,'sc-companion-react',650);}
}
function feedbackTurn(g){
  const turn=scFeedback.turn,history=scFeedback.history;
  if(!feedbackCurrent(g)||!turn||turn.game!==g||turn.done||!history)return;
  turn.done=true;
  const points=Math.max(0,g.score-turn.score),restored=(g.restoration?.restored||0)-turn.restored.size;
  const note=$('turn-note');if(note)note.textContent='+'+points.toLocaleString('es')+' de luz'+(turn.waves>1?' · '+turn.waves+' cascadas':'');
  let key=null;
  if(restored>0)key=g.restoration.restored===g.restoration.total?'place_complete':g.restoration.kind;
  else if(turn.created)key='created_'+turn.created;
  else if(turn.powers>=2)key='power_chain';
  else if(turn.waves>=3)key='cascade';
  else if(g.pulse>=pulseNeed()&&!history.ready){key='pulse_ready';history.ready=true;}
  else if(g.moves>0&&g.moves<=3&&!history.low){key='last_moves';history.low=true;}
  if(g.pulse<pulseNeed())history.ready=false;
  if(!key||(!restored&&history.turn-history.spoken<2))return;
  const lines=PLAY_LINES[key]||PLAY_LINES.cascade;
  const count=history.counts[key]||0;
  // Each line is heard once per attempt. Quiet is better than a looping cheer.
  if(count>=lines.length)return;
  history.counts[key]=count+1;history.spoken=history.turn;
  feedbackSay(g,lines[count],key==='last_moves'?'worried':restored?'celebrate':'excited');
}
function feedbackPower(g,triggered,group){
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
  if(!indices.length)return;
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
