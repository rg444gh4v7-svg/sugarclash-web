/* TACTICAL_HINTS_START
 * Pure, deterministic analysis of the first visible wave of a swap.
 * Dependencies: runGroups, powerCreation, expandEffects, canCombine,
 * restorationStep, restorationTargets (the existing pure engine functions).
 * No DOM, save, timers, RNG, piece allocation, gravity, or future refills.
 * options.iceDamage must be the caller's snapshot of forja: 1 or 2.
 * Counts are facts; rank is a preference, not a guarantee of the best full turn.
 */
function hintNeighbors(index,size){
 return [index%size>0?index-1:-1,index%size<size-1?index+1:-1,index-size,index+size].filter(i=>i>=0&&i<size*size);
}
function hintPowerName(power){
 return {row:'un rayo horizontal',col:'un rayo vertical',bomb:'una bomba',prism:'una estrella'}[power]||'un poder';
}
function hintPrimaryText(g,facts){
 if(g.type==='collect'&&facts.primaryGain){
  const names=['caramelos rosas','ositos verdes','diamantes azules','piruletas doradas','espirales violetas','corazones coral','estrellas'];
  return 'recoge '+facts.primaryGain+' '+(names[g.targetColor]||'piezas de la meta');
 }
 if(g.type==='ice'){
  if(facts.primaryGain)return 'rompe '+facts.primaryGain+' '+(facts.primaryGain===1?'casilla':'casillas')+' de hielo';
  if(facts.iceDamagedHP)return 'quita '+facts.iceDamagedHP+' '+(facts.iceDamagedHP===1?'capa':'capas')+' de hielo';
 }
 return 'suma '+facts.scoreGain.toLocaleString('es')+' de luz';
}
function hintMessage(g,facts){
 const parts=[],rest=g.restoration,rule=rest?.rule.kind;
 if(facts.damagedHP){
  if(rule==='ordered'){
   const order=rest.cells.findIndex(cell=>cell.index===facts.damage[0].index)+1;
   parts.push(facts.zones?'restaura la zona '+order+' del recorrido':'quita '+facts.damagedHP+' capa de la zona '+order+' del recorrido');
  }else{
   const target=rule==='power'?'sello':'zona';
   if(facts.zones)parts.push((rule==='power'?'abre ':'restaura ')+facts.zones+' '+target+(facts.zones===1?'':'s'));
   else parts.push('quita '+facts.damagedHP+' '+(facts.damagedHP===1?'capa':'capas')+' de '+(rule==='power'?'los sellos':'las zonas marcadas'));
   if(rule==='tide'&&facts.activeTargets.length)parts[0]+=' de la fila '+(Math.floor(facts.activeTargets[0]/g.size)+1)+' activa';
  }
 }
 if(!parts.length&&facts.powersCreated)parts.push('crea '+hintPowerName(facts.created[0].power)+(rule==='power'&&facts.pendingZones?' para preparar los sellos':''));
 if(facts.primaryPending&&(facts.primaryGain||facts.iceDamagedHP))parts.push(hintPrimaryText(g,facts));
 if(!parts.length&&facts.powersTriggered)parts.push('activa '+facts.powersTriggered+' '+(facts.powersTriggered===1?'poder':'poderes'));
 if(!parts.length)parts.push(hintPrimaryText(g,facts));
 if(parts.length===1&&facts.damagedHP&&facts.powersCreated)parts.push('crea '+hintPowerName(facts.created[0].power));
 return 'Primera oleada: '+parts.slice(0,2).join('; ')+'.';
}
function analyzeHintMove(g,a,b,{iceDamage=1}={}){
 if(!g||!Array.isArray(g.board)||!Number.isInteger(g.size)||g.size<2||g.board.length!==g.size*g.size)return null;
 if(!Number.isInteger(a)||!Number.isInteger(b)||a<0||b<0||a>=g.board.length||b>=g.board.length)return null;
 if(Math.abs(Math.floor(a/g.size)-Math.floor(b/g.size))+Math.abs(a%g.size-b%g.size)!==1||!g.board[a]||!g.board[b])return null;
 // Objects as well as the array are copied. Applying a creation must not edit
 // a live piece, alter its id, or allocate a new engine piece id.
 const board=g.board.map(piece=>piece?{...piece}:null),beforeA=board[a],beforeB=board[b];
 const combo=canCombine(beforeA,beforeB),globalPrism=combo&&beforeA.color===6&&beforeB.color===6;
 [board[a],board[b]]=[board[b],board[a]];
 const groups=runGroups(board,g.size);
 if(!combo&&!groups.some(group=>group.cells.includes(a)||group.cells.includes(b)))return null;
 let seeds=null,prismColor=null,creation=null;
 if(combo){
  if(globalPrism)seeds=board.map((_,i)=>i);
  else if(beforeA.color===6||beforeB.color===6){
   prismColor=beforeA.color===6?beforeB.color:beforeA.color;
   seeds=[a,b,...board.flatMap((piece,i)=>piece?.color===prismColor?[i]:[])];
  }else seeds=[a,b];
 }else{
  creation=powerCreation(board,g.size,groups,[b,a]);
  if(creation){board[creation.index].color=creation.color;board[creation.index].power=creation.power;}
  seeds=[...new Set(groups.flatMap(group=>group.cells))];
 }
 const protectedIndex=creation?.index??-1,pulse=!!g.pulseArmed;
 const initial=expandEffects(board,g.size,seeds,protectedIndex,prismColor);
 let cells=[...initial.cells],triggered=[...initial.triggered],damage=[],restored=[],activeTargets=[];
 const pendingZones=g.restoration?g.restoration.cells.filter(cell=>!cell.restored).length:0;
 if(g.restoration){
  activeTargets=restorationTargets(g.restoration,g.size);
  const powered=globalPrism?initial.cells:initial.triggered.length?expandEffects(board,g.size,initial.triggered,protectedIndex,prismColor).cells:[];
  const step=restorationStep(g.restoration,board,g.size,initial.cells,{powered,pulse,protectedIndex});
  damage=g.restoration.cells.flatMap((cell,i)=>{
   const hp=cell.hp-step.state.cells[i].hp;
   return hp>0?[{index:cell.index,hp,before:cell.hp,after:step.state.cells[i].hp}]:[];
  });
  restored=[...step.restored];
  // A restoration burst can activate further visible powers in this wave.
  // It must not damage restoration a second time (ordered and HP2 included).
  if(restored.length){
   const burst=expandEffects(board,g.size,step.bonus,protectedIndex,prismColor);
   cells=[...new Set([...cells,...burst.cells])];
   triggered=[...new Set([...triggered,...burst.triggered])];
  }
 }
 const scoreGain=cells.length*20*(pulse?2:1),iceHits=new Set(),ice=[];
 const amount=iceDamage===2?2:1;
 for(const i of cells)for(const near of [i,...hintNeighbors(i,g.size)]){
  if(iceHits.has(near)||!(g.ice?.[near]>0))continue;
  iceHits.add(near);const before=g.ice[near],after=Math.max(0,before-amount);
  ice.push({index:near,hp:before-after,before,after});
 }
 const primaryGain=g.type==='collect'?cells.filter(i=>board[i]?.color===g.targetColor).length:g.type==='ice'?ice.filter(cell=>cell.after===0).length:scoreGain;
 const primaryPending=Number.isFinite(g.goal)&&g.progress<g.goal;
 const primaryUseful=primaryPending?Math.min(primaryGain,Math.max(0,g.goal-g.progress)):0;
 const damagedHP=damage.reduce((sum,cell)=>sum+cell.hp,0);
 const facts={
  move:[a,b],scope:'first-visible-wave',damagedHP,zones:restored.length,
  powersCreated:creation?1:0,powersTriggered:triggered.length,primaryGain,primaryUseful,primaryPending,scoreGain,
  iceDamagedHP:ice.reduce((sum,cell)=>sum+cell.hp,0),pendingZones,activeTargets:[...activeTargets],
  damage,restored,created:creation?[{...creation}]:[],triggered:triggered.map(index=>({index,power:board[index]?.power||null})),
  cleared:cells,ice,pulseArmed:pulse,globalPrism,protectedIndex,rule:g.restoration?.rule.kind||null
 };
 const restorationComplete=!pendingZones||facts.zones===pendingZones;
 facts.winsVisible=Number.isFinite(g.goal)&&g.progress+primaryGain>=g.goal&&restorationComplete;
 const creationValue=creation?({prism:12,bomb:7,row:5,col:5}[creation.power]||0):0;
 // Prefer real restoration while it remains. If no move touches a seal,
 // creating a power is useful preparation; it does not promise a later hit.
 const preparation=!!(pendingZones&&g.restoration.rule.kind==='power'&&creation);
 facts.priority=pendingZones?(damagedHP?'restore':preparation?'prepare-power':'primary'):primaryPending?'primary':'score';
 facts.rank=pendingZones?
  [facts.winsVisible?1:0,damagedHP?3:preparation?2:1,damagedHP*40+facts.zones*60,primaryUseful,facts.iceDamagedHP,creationValue,scoreGain]:
  [facts.winsVisible?1:0,primaryPending?primaryUseful:scoreGain,g.type==='ice'?facts.iceDamagedHP:0,creationValue,scoreGain];
 facts.message=hintMessage(g,facts);
 return facts;
}
function chooseHint(g,options={}){
 if(!g||g.done||g.busy||g.paused||!Array.isArray(g.board)||!Number.isInteger(g.size)||g.size<2||g.board.length!==g.size*g.size)return null;
 let best=null;
 // Enumerate on the copy inside analyzeHintMove. legalMoves temporarily swaps
 // its argument, so passing the live board to it would break strict purity.
 for(let a=0;a<g.board.length;a++)for(const b of [a%g.size<g.size-1?a+1:-1,a+g.size<g.board.length?a+g.size:-1]){
  if(b<0)continue;
  const candidate=analyzeHintMove(g,a,b,options);if(!candidate)continue;
  let better=!best;
  if(best)for(let i=0;i<candidate.rank.length;i++){
   const difference=candidate.rank[i]-(best.rank[i]||0);
   if(difference){better=difference>0;break;}
  }
  if(better)best=candidate;
 }
 return best;
}
/* TACTICAL_HINTS_END */
