/* Replacement renderHome; presentation only. Existing campaign entry guards,
   daily reward guards and save source remain unchanged. */
function homeEncounterSummary(e){
 const count=e.pattern.cells.length;
 const summaries={
  direct:e.pattern.hp===2?`Retira las dos capas de las ${count} marcas.`:`Combina sobre las ${count} marcas para restaurarlas.`,
  adjacent:`Restaura ${count} marcas combinando encima o a su lado.`,
  power:`Activa poderes o el Pulso sobre las ${count} marcas.`,
  ordered:`Restaura ${count} marcas siguiendo el orden iluminado.`,
  color:`Combina dorados junto a las ${count} marcas, o usa poderes.`,
  tide:'Restaura las marcas de la fila iluminada. Cambia con cada jugada.'
 };
 return summaries[e.rule.kind]||e.brief;
}

function renderHome(){
 const next=campaignNext(),t=TERRITORIES[next.t-1];
 const done=completed(next.t),released=totalReleased();
 const e=encounterConfig(next.t,next.n);
 const dailyDone=save.dailyChallenge.key===dayKey()&&save.dailyChallenge.won;
 const level=(next.t-1)*10+next.n;
 $('screen-home').innerHTML=`
  <div class="nav-home">
   <header class="home-heading">
    <h1>${released?'Continúa tu viaje':'El color empieza aquí'}</h1>
   </header>
   <section class="home-journey" aria-labelledby="home-next-title">
    <div class="home-scene" style="${restorationVisual(done)}">
     <div class="home-scene-ash" aria-hidden="true"></div>
     <div class="home-scene-life" aria-hidden="true"></div>
     <div class="home-territory">
      <span>Capítulo ${next.t} de 8</span>
      <h2>${escapeHTML(t.name)}</h2>
     </div>
     <div class="home-next">
      <div class="home-next-head">
       <div><span class="home-level">${next.complete?'Campaña completada · Vuelve a jugar':'Tu siguiente partida · Nivel '+level}</span><h2 id="home-next-title">${escapeHTML(LEVEL_NAMES_ALL[next.t][next.n])}</h2></div>
       ${sprite(`monsters-t${next.t}-v18.webp`,next.n-1,5,'home-guardian')}
      </div>
      <p class="home-rule">${escapeHTML(homeEncounterSummary(e))}</p>
     </div>
    </div>
    <div class="home-footer">
     <div class="home-actions"><button class="btn home-play" onclick="continueCampaign()">${icon('play')}<span>${next.complete?'Volver a jugar nivel '+level:'Jugar nivel '+level}</span>${icon('arrow')}</button></div>
     <div class="home-progress"><span><strong>${done} de 10</strong> lugares recuperados</span><button class="text-btn" onclick="state.territory=${next.t};navigate('world')">Ver niveles ${icon('arrow')}</button></div>
    </div>
   </section>
   <section class="home-quick" aria-labelledby="home-quick-title">
    <header><h2 id="home-quick-title">Partidas rápidas <span>Sin vidas</span></h2><button class="text-btn" onclick="navigate('modes')">Ver modos ${icon('arrow')}</button></header>
    <div class="home-quick-links">
     <button onclick="launchMode('war')">${icon('spark')}<span><strong>Guerra 5v5</strong><small>Equipo contra IA</small></span>${icon('arrow')}</button>
     <button onclick="launchMode('royale')">${icon('crown')}<span><strong>Royale</strong><small>Todos contra la niebla</small></span>${icon('arrow')}</button>
    </div>
   </section>
   <div class="home-secondary">
    <section class="home-daily" aria-labelledby="home-daily-title">
     <span class="home-daily-icon">${icon(dailyDone?'check':'sun')}</span>
     <div><h2 id="home-daily-title">Reto diario</h2><p>${dailyDone?'Completado hoy · Puedes mejorar tu marca':'Un tablero nuevo cada día. Sin gastar vidas.'}</p></div>
     <button class="text-btn" onclick="startDaily()" aria-label="${dailyDone?'Repetir reto diario':'Jugar reto diario'}">${dailyDone?'Repetir':'Jugar'} ${icon('arrow')}</button>
    </section>
    <div class="home-companion">${confite('happy')}<p>${released?'Sigamos por donde vuelve el color.':'El primer color está a una jugada.'}</p></div>
   </div>
  </div>`;
}
