/* Original native diorama. Copy into the single-file runtime; no IDs, assets,
 * timers, RNG, persistent fields or gameplay dependencies.
 *
 * Integration:
 * 1. Campaign .battle-scene receives class has-play-scene.
 * 2. Replace .battle-backdrop with playScene(g), preserving title, guardian,
 *    encounter brief and guardian-health IDs. Confite may be placed separately
 *    inside .play-confite (decorative, small, lower left).
 * 3. Call updatePlayScene(g) from the existing HUD update. Its return value
 *    `.advanced` allows feedbackClass(host,'sc-place-awake',700), guarded by the
 *    existing feedbackCurrent(g). No celebration on first render or repaint.
 */
function playSceneState(g){
 const r=g&&g.restoration;
 const total=r&&Number.isFinite(r.total)&&r.total>0?r.total:0;
 const restored=total&&Number.isFinite(r.restored)?Math.max(0,Math.min(total,r.restored)):0;
 const progress=total?restored/total:0;
 const aliases={river:'water',flora:'garden',shelter:'home'};
 const raw=r&&r.kind;
 const kind=['path','water','garden','home'].includes(raw)?raw:aliases[raw]||'path';
 return {kind,total,restored,progress,phase:progress>=1?3:progress>=2/3?2:progress>0?1:0};
}

function playSceneArt(kind,progress=0){
 const p=Number.isFinite(progress)?Math.max(0,Math.min(1,progress)):0;
 const phase=p>=1?3:p>=2/3?2:p>0?1:0;
 const one=phase>=1,two=phase>=2,full=phase>=3;
 const known=['path','water','garden','home'].includes(kind)?kind:'path';
 const C={ink:'#202b33',soil:'#35423f',stone:'#697371',edge:'#8a9388',
  cream:'#c3b28e',warm:'#d8bd85',teal:'#79aaa2',deep:'#477b79',
  coral:'#c58c77',leaf:'#829e87',dry:'#707c73'};
 const repair=(s)=>`<g class="scene-repair">${s}</g>`;
 const reed=(x,y,alive=false)=>`<path d="M${x} ${y}v-11m0 8-5-6m5 4 5-8" fill="none" stroke="${alive?C.leaf:C.dry}" stroke-width="1.4" stroke-linecap="round"/>`;
 const flower=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 4v10m0-3-5-3m5 0 4-5" fill="none" stroke="${C.leaf}" stroke-width="1.5"/><path d="M0-1c-7-7-12 1-6 5-1 7 8 8 9 2 8-2 4-10-3-7Z" fill="${C.coral}"/><circle cy="3" r="2" fill="${C.warm}"/></g>`;
 const distant=known==='home'?
  '<path d="m58 66 13-16 12 16v18H58Zm29-4 10-12 11 12v21H87Zm155 1 13-16 15 16v22h-28Z" fill="#303c43"/><path d="M70 50V39m184 9V37" stroke="#3b474b" stroke-width="2"/>':
  known==='garden'?'<path d="M20 77q-7-23 3-30 12 8 2 31m280-5q-12-29-2-39 15 11 5 39" fill="#303e42"/><path d="M23 61v20m282-28v27" stroke="#414c4c" stroke-width="2"/>':
  '<path d="m40 72 29-23 21 20 31-25 32 24 20-12 31 19 26-17 29 16 19-20 30 23" fill="#303c43"/>';
 const common=`
  <path d="M0 0h360v120H0Z" fill="#1c252e"/>
  <path d="M0 66q32-13 63-5t57 0 64-6 65 3 58-8 53 12v58H0Z" fill="#28343d"/>
  ${distant}
  <path d="M0 87q38-15 79-6t72-1 69-4 71 6 69-5v43H0Z" fill="#3a4644"/>
  <path d="M0 105q50-14 91-3t75-1 95-1 99 2v18H0Z" fill="#303d3b"/>
  <path d="m10 99 14-3 20 2m242-6 22 1 21-3m-276 21 21-1m191 6 18-2" fill="none" stroke="#56615a" stroke-width="1.1" stroke-linecap="round"/>
  <path d="M0 120h360" stroke="#47524c"/>
 `;
 const scenes={
  path:`
   <path d="M181 70q-24 13-13 26t-13 24h73q-14-15-25-21t7-29Z" fill="${one?C.deep:'#4e5e5e'}"/>
   ${one?repair(`<path d="M187 75q-20 11-9 20m18 11 9 9m-31-14-7 9" fill="none" stroke="${C.teal}" stroke-width="2.3" stroke-linecap="round"/>`):''}
   <path d="m67 101 27-10 20-6m123-2 24 8 19 13" fill="none" stroke="#8a8b77" stroke-width="7"/>
   <path d="M105 99q15-29 46-29l3 5-11 4 3 5-11-1q-11 6-18 18Zm106-29q28 1 45 29l-13 2q-10-17-31-18l6-7-12-1Z" fill="${C.stone}"/>
   <path d="M105 85q17-26 42-27m70 1q23 4 39 27m-135-14v14m118-13v14" fill="none" stroke="${C.edge}" stroke-width="2.6"/>
   ${two?repair(`<path d="M140 81q39-22 77 0l-4 10q-35-20-69 0Z" fill="${C.cream}"/><path d="M147 77q31-15 62 0m-47-4 2 11m18-15v12m19-8-3 12" fill="none" stroke="#e0cda6" stroke-width="1.6"/>`):'<path d="m160 88 11 8m15-13 10 10" stroke="#7b8073" stroke-width="4"/><path d="m166 102 6 5m28-8 7 7" stroke="#586664" stroke-width="2"/>'}
   ${full?repair(`<path d="M115 81q64-47 132 0m-109-14v14m25-27v15m26-18v15m26-8v15m22 0v12" fill="none" stroke="${C.cream}" stroke-width="2.6"/>${flower(115,96,.58)}${flower(246,102,.65)}<path d="m211 109 13-2m-41 8 14-1" stroke="${C.teal}" stroke-width="1.4" stroke-linecap="round"/>`):''}
   ${reed(229,111,full)}${reed(138,112,one)}
  `,
  water:`
   <path d="M209 62q-51 10-33 25t-28 33h90q-43-12-35-27t27-31Z" fill="${one?C.deep:'#4a595b'}"/>
   ${one?repair(`<path d="M210 69q-42 6-27 19t-14 25" fill="none" stroke="${C.teal}" stroke-width="4"/><path d="m209 71-8 2m-15 22 4 5m-18 13-11 4" stroke="#b0c8b8" stroke-width="1.4" stroke-linecap="round"/>`):'<path d="m168 81 11-16 17 2 10 16-16 13-20-2Z" fill="#687572" stroke="#37494b" stroke-width="2"/>'}
   <path d="m110 89 20-6h24v9h-23l-19 5m97-14h22l24 10-4 7-22-9h-20Z" fill="${C.stone}"/>
   ${two?repair(`<path d="M146 83h70v10h-70Z" fill="${C.cream}"/><path d="m151 84 1 8m10-8 1 8m10-8 1 8m10-8 1 8m10-8 1 8m10-8 1 8" stroke="#6b7367" stroke-width="1.3"/><path d="M140 79h80m-75-5v23m69-23v23" stroke="${C.cream}" stroke-width="2"/>`):'<path d="m179 87 16-11 18 9-4 16-22 3-13-8Z" fill="#76807a" stroke="#37494b" stroke-width="2"/><path d="m181 85 7-4 9 3" fill="none" stroke="#9a9f8e" stroke-width="1.3"/>'}
   <path d="m119 107 10-8 13 5-1 9m83-38 7-7 12 4 5 9" fill="#67736a"/>
   ${full?repair(`${flower(142,103,.65)}${reed(223,104,true)}${reed(242,110,true)}<path d="m206 107 12-2m-43 12 15-1m33-45 8-1" stroke="${C.teal}" stroke-width="2" stroke-linecap="round"/><path d="m102 96 12-1m138 11 15 2" stroke="${C.cream}" stroke-width="2.5" stroke-linecap="round"/>`):reed(236,110)}
  `,
  garden:`
   <path d="m99 106 19-10 91 1 31 9-22 11H120Z" fill="#4b5146" stroke="#727a67" stroke-width="2"/>
   <path d="M133 106V80m34 29V67m34 42V78m23 26-1-18m-90 10-9-11m43 1 9-9m25 19-9-9" fill="none" stroke="${C.dry}" stroke-width="2.1" stroke-linecap="round"/>
   ${one?repair(`<path d="M133 107V87m34 22V82m34 27V92m-69 10q-11-1-10-9 10-1 11 9m34-5q-1-12 10-12 1 9-10 12m34 6q8-11 13-5-4 8-13 5" fill="${C.leaf}" stroke="${C.leaf}" stroke-width="1.6"/>`):'<path d="m133 107-8 6m10-7 7 8m24-5-7 7m10-7 10 6m22-6-5 7m5-7 9 6" stroke="#7b8070" stroke-width="1.5"/>'}
   ${two?repair(`<path d="M133 106V77m34 32V64m34 45V80m23 24V87" fill="none" stroke="${C.leaf}" stroke-width="2"/><path d="M133 94q-15 0-13-11 11 0 13 11m34-14q14-16 19-5-4 10-19 13m33 9q-13-2-11-11 11-2 11 11m24-2q13-9 13-1-4 6-13 7" fill="${C.leaf}"/><path d="m131 77 2-4 3 4m28-12 3-5 4 5m27 16 3-4 4 4" fill="${C.coral}" stroke="${C.coral}" stroke-width="2.5" stroke-linejoin="round"/>`):''}
   ${full?repair(`${flower(133,72,.92)}${flower(167,58,1.05)}${flower(201,76,.82)}${flower(224,83,.58)}<path d="m105 112 10-1m98 3 11-1m-68 0 11-1" stroke="${C.cream}" stroke-width="2" stroke-linecap="round"/>`):''}
   <path d="M92 106q-10-5-8-16m159 18q11-8 8-17" fill="none" stroke="#627067" stroke-width="2"/>
   ${full?repair(`${flower(83,84,.45)}${flower(251,85,.5)}`):''}
  `,
  home:`
   <path d="m130 115 16-11h66l18 11Z" fill="#777f6f"/>
   <path d="M139 72h72v37h-72Z" fill="${one?C.cream:'#747c72'}"/>
   <path d="M195 62V47h8v21" fill="${C.stone}"/>
   ${one?repair(`<path d="m129 74 46-29 47 29Z" fill="${C.coral}"/><path d="M143 65h64m-71 7h79m-55-13 5 12m16-18 9 12m0 0 6 7" fill="none" stroke="#825f54" stroke-width="1.4"/>`):'<path d="m129 74 35-23-2 10 8 8-13 1-9 4m41-22 33 22h-26l-6-8-10-1Z" fill="#7e7e6e"/><path d="m173 68 5-8 9 3" fill="none" stroke="#485855" stroke-width="3"/>'}
   <path d="M164 110V89q11-10 22 0v21Z" fill="#334343"/>
   <path d="M146 81h12v13h-12Zm47 0h12v13h-12Z" fill="${two?C.warm:'#3c494c'}"/>
   ${two?repair(`<path d="M152 81v13m-6-6h12m41-7v13m-6-6h12" stroke="#8f805e" stroke-width="1.3"/><path d="m165 109 2-21m10-2v23" stroke="#5b655a" stroke-width="1.4"/><circle cx="180" cy="99" r="1.3" fill="${C.warm}"/><path d="M135 110h81" stroke="${C.cream}" stroke-width="3"/>`):'<path d="m145 80 14 15m-14-1 13-12m34-2 14 15m-14-1 13-12m-39 7 20 9m-20 2 20 8" stroke="#939884" stroke-width="2.7"/>'}
   ${full?repair(`<path d="M198 43c-8-7 7-7 1-13m6 13c8-5-5-8 1-13" fill="none" stroke="#a9bbb1" stroke-opacity=".65" stroke-width="2" stroke-linecap="round"/>${flower(128,101,.55)}${flower(221,102,.6)}<path d="m163 117 13-2 9 2m-2-6 9 1" fill="none" stroke="${C.cream}" stroke-width="1.4" stroke-linecap="round"/>`):''}
   ${reed(113,110,two)}${reed(237,113,full)}
  `
 };
 return `<svg class="play-scene-art" viewBox="0 0 360 120" preserveAspectRatio="xMidYMax meet" data-kind="${known}" data-phase="${phase}" aria-hidden="true" focusable="false">${common}${scenes[known]}<path d="M0 118q37-7 76 0m204 1q41-9 80-1" fill="none" stroke="#23332f" stroke-width="5"/></svg>`;
}

function playScene(g){
 if(!g||!g.restoration)return '';
 const s=playSceneState(g);
 return `<div class="play-scene" data-kind="${s.kind}" data-phase="${s.phase}" data-restored="${s.restored}" style="--scene-progress:${s.progress}" aria-hidden="true">${playSceneArt(s.kind,s.progress)}</div>`;
}

function updatePlayScene(g,host){
 if(!g||!g.restoration)return {changed:false,advanced:false,host:null};
 if(!host&&typeof document!=='undefined')host=document.querySelector?.('#screen-game .play-scene');
 if(!host)return {changed:false,advanced:false,host:null};
 const s=playSceneState(g),previous=Number(host.dataset.restored);
 const changed=host.dataset.kind!==s.kind||Number(host.dataset.phase)!==s.phase;
 if(changed)host.innerHTML=playSceneArt(s.kind,s.progress);
 const advanced=Number.isFinite(previous)&&s.restored>previous;
 host.dataset.kind=s.kind;host.dataset.phase=String(s.phase);host.dataset.restored=String(s.restored);
 host.style.setProperty('--scene-progress',String(s.progress));
 return {changed,advanced,host,phase:s.phase};
}
