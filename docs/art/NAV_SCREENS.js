const NAV_ITEMS=[['home','Inicio'],['world','Campaña'],['modes','Modos'],['village','Aldea']];
const SCREEN_LABELS={home:'Inicio',world:'Campaña',modes:'Modos',village:'Aldea',memories:'Historia y recuerdos',settings:'Ajustes',game:'Partida',arena:'Combate'};
function navigationOrigin(){
 if(state.screen==='game')return state.game?.returnTo||'modes';
 if(state.screen==='arena')return typeof arenaState!=='undefined'&&arenaState?.returnTo||'modes';
 return ['home','world','modes','village','memories','settings'].includes(state.screen)?state.screen:'home';
}
function updateLocation(){
 const el=$('current-location');if(el)el.textContent=SCREEN_LABELS[state.screen]||'Inicio';
 const settings=$('resources')?.querySelector('[data-settings]');
 if(settings){if(state.screen==='settings')settings.setAttribute('aria-current','page');else settings.removeAttribute('aria-current');}
}
function renderNav(){
 if(!$('navigation'))return;
 const current=state.screen==='memories'?'world':state.screen==='arena'?'modes':state.screen==='game'?(state.game?.mode==='campaign'?'world':'modes'):state.screen;
 $('navigation').innerHTML='<div class="nav-caption">Tu viaje</div>'+NAV_ITEMS.map(([id,title])=>`<button class="nav-item ${current===id?'active':''}" data-destination="${id}" ${current===id?'aria-current="page"':''} onclick="navigate('${id}')">${icon(id)}<span>${title}</span></button>`).join('')+'<div class="nav-help"><strong>Un color a la vez.</strong>Combina, restaura y sigue el camino.<button class="text-btn" onclick="showHelp()">Cómo jugar</button></div>';
 updateLocation();
}
function focusScreen(name){
 const page=$('screen-'+name),heading=page?.querySelector('h1');
 if(heading){heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});}
 if($('announcer'))$('announcer').textContent=SCREEN_LABELS[name]||'';
 updateLocation();
}
function navigate(name){
 const renders={home:renderHome,world:renderWorld,modes:renderModes,village:renderVillage,memories:renderMemories,settings:renderSettings};
 if(!Object.hasOwn(renders,name))return false;
 if(name==='settings'&&state.screen!=='settings'){
  if(state.game?.returnTo)state.settingsReturn=state.game.returnTo;
  else if(typeof arenaState!=='undefined'&&arenaState?.returnTo)state.settingsReturn=arenaState.returnTo;
  else if(['home','world','modes','village','memories'].includes(state.screen))state.settingsReturn=state.screen;
 }
 if(state.game&&!state.game.done&&state.screen==='game'){pauseBoard(true,name);return false;}
 if(typeof arenaState!=='undefined'&&arenaState&&!arenaState.finished&&state.screen==='arena'){arenaExit(name);return false;}
 showScreen(name);renders[name]();focusScreen(name);return true;
}
function renderWorld(tid=state.territory){
 if(!Number.isInteger(tid)||tid<1||tid>8)return;
 state.territory=tid;
 const t=TERRITORIES[tid-1],done=completed(tid),open=territoryOpen(tid),next=campaignNext();
 const available=Array.from({length:10},(_,i)=>i+1).find(n=>levelOpen(tid,n)&&!starsAt(tid,n));
 $('screen-world').innerHTML=`<div class="page-content campaign-page">
  <div class="page-head"><div><h1>Campaña</h1><p>80 niveles para devolver el color.</p></div><button class="text-btn" aria-label="Historia y recuerdos" onclick="navigate('memories')">${icon('memories')} Historia</button></div>
  <div class="campaign-select"><label for="chapter-select">Capítulo</label><select id="chapter-select" onchange="renderWorld(Number(this.value));document.getElementById('chapter-select').focus()">${TERRITORIES.map(x=>`<option value="${x.id}" ${x.id===tid?'selected':''}>${x.id}. ${escapeHTML(x.name)}${territoryOpen(x.id)?'':' · Bloqueado'}</option>`).join('')}</select></div>
  <div class="campaign-layout"><section class="campaign-overview"><div class="world-panorama" style="${panoramaStyle(tid)};filter:grayscale(${1-done/10})" role="img" aria-label="Paisaje de ${escapeHTML(t.name)}"></div><div><span class="eyebrow">Capítulo ${tid} de 8</span><h2>${escapeHTML(t.name)}</h2><p>${escapeHTML(CAMPAIGN_ARCS[tid].steps[done<3?0:done<7?1:2])}</p><div class="progress-track"><i style="width:${done*10}%"></i></div><span class="campaign-count">${done} de 10 niveles completados</span>${!open?`<p class="chapter-locked">${icon('lock')} Completa el capítulo ${tid-1} para jugar aquí.</p>`:available?`<button class="btn" onclick="requestLevel(${tid},${available})">Jugar nivel ${(tid-1)*10+available} ${icon('play')}</button>`:'<p class="chapter-complete">Capítulo restaurado. Puedes repetir cualquier nivel.</p>'}</div></section>
  <section class="campaign-levels" aria-label="Niveles del capítulo ${tid}"><div class="level-list-title"><h2>Niveles</h2><span>${done} / 10</span></div>${Array.from({length:10},(_,i)=>{const n=i+1,canPlay=levelOpen(tid,n),stars=starsAt(tid,n),isNext=next.t===tid&&next.n===n;return `<button class="campaign-level ${isNext?'is-next':''} ${stars?'is-complete':''}" ${canPlay?'':'disabled'} onclick="requestLevel(${tid},${n})" aria-label="Nivel ${(tid-1)*10+n}: ${escapeHTML(LEVEL_NAMES_ALL[tid][n])}. ${stars?stars+' estrellas. Repetir':canPlay?'Disponible':n===1?'Completa el capítulo anterior':'Completa el nivel '+((tid-1)*10+n-1)}"><span class="level-number">${String((tid-1)*10+n).padStart(2,'0')}</span>${sprite(`monsters-t${tid}-v18.webp`,i,5,'level-portrait')}<span class="level-name"><strong>${escapeHTML(LEVEL_NAMES_ALL[tid][n])}</strong><small>${stars?'✦'.repeat(stars)+' · Completado':isNext?'Siguiente nivel':canPlay?'Disponible':n===1?'Completa el capítulo anterior':'Completa el nivel '+((tid-1)*10+n-1)}</small></span>${icon(!canPlay?'lock':stars?'check':'play')}</button>`;}).join('')}</section></div></div>`;
}
function renderModes(){
 const descriptions={daily:['Reto diario','Match-3 · Tablero del día','Completa el tablero de hoy. La recompensa se recibe una vez al día.'],zen:['Sin prisa','Match-3 · Sin reloj','Practica combinaciones y poderes sin límite de movimientos.'],survival:['Contrarreloj','Match-3 · 60 segundos','Consigue toda la luz que puedas antes de que termine el minuto.'],war:['Guerra 5v5','Combate · Equipo contra IA','Muévete, esquiva y destruye el cristal rival con tu equipo.'],royale:['Royale','Combate · Contra IA','Sobrevive al resto de combatientes y a la niebla que se cierra.']};
 const group=(title,ids)=>`<section class="mode-group"><h2>${title}</h2><div class="mode-cards">${ids.map(id=>{const m=MODES.find(x=>x.id===id),d=descriptions[id];return `<article class="mode-card"><div class="mode-card-art" style="--mode-art:url('${m.art}')">${sprite(m.sheet,m.cell,m.sheet==='assets/candies-restoration-v1.svg'?4:5)}</div><div class="mode-card-copy"><span>${d[1]}</span><h3>${d[0]}</h3><p>${d[2]}</p><small>${m.record()}</small><button class="btn secondary" onclick="launchMode('${id}')" aria-label="Jugar ${d[0]}">Jugar ${icon('play')}</button></div></article>`;}).join('')}</div></section>`;
 $('screen-modes').innerHTML=`<div class="page-content modes-page"><div class="page-head"><div><h1>Otros modos</h1><p>Partidas independientes de la campaña. Todas sin gastar vidas.</p></div></div>${group('Combina caramelos',['daily','zen','survival'])}${group('Muévete y combate',['war','royale'])}</div>`;
}
