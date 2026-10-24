/* Drop-in replacement. Original native SVG,110×100; no IDs or animation. */
function restoredPlaceArt(kind,alive=true){
 const stone=alive?'#b9aa8c':'#6e7474',leaf=alive?'#7ba9a6':'#515b5c',light=alive?'#ddbd7e':'#39444a',coral=alive?'#cf9279':'#6b7175',ink='#27313a';
 const scenes={
  path:alive?`
   <path d="M15 74Q53 19 96 74" fill="none" stroke="${stone}" stroke-width="11" stroke-linecap="square"/>
   <path d="M14 60Q53 8 97 60M22 51v11m17-26v11m19-15v11m19-5v12m16 3v12" fill="none" stroke="${stone}" stroke-width="3"/>
   <path d="m25 64 5 4m15-20 2 7m20-4-2 7m17 8-4 4" stroke="#e0d0aa" stroke-width="2"/>
   <path d="M8 83Q31 72 52 82T102 81" fill="none" stroke="${leaf}" stroke-width="5" stroke-linecap="round"/>
   <path d="M24 85q10-3 17 0m32-1 12-1" stroke="#bdcfc3" stroke-width="1.5" stroke-linecap="round"/>`:`
   <path d="M15 74Q24 55 39 46l5 5-6 5 3 5-9-1q-5 6-8 15ZM71 45q15 8 25 29l-11 1q-7-13-17-17l5-6-7-3Z" fill="${stone}"/>
   <path d="m15 61 10-14 12-9m44 6 12 13M24 49l-2 12m61-15 3 14" fill="none" stroke="${stone}" stroke-width="3"/>
   <path d="m46 64 11 10m5-18 6 14" stroke="#77796e" stroke-width="4" stroke-linecap="square"/>
   <path d="m46 64 3 7m17-2-2 5" stroke="#4b585b" stroke-width="2"/>
   <path d="M8 83q14-5 24-2m42 3 28-3" fill="none" stroke="${leaf}" stroke-width="4" stroke-linecap="round"/>`,
  water:alive?`
   <path d="M47 13Q80 29 56 49T49 88" fill="none" stroke="${leaf}" stroke-width="17" stroke-linecap="round"/>
   <path d="M48 18q14 8 13 16M48 66q-7 8 2 17" fill="none" stroke="#b5cbc1" stroke-width="2" stroke-linecap="round"/>
   <path d="M15 44h79v10H15Z" fill="${stone}"/>
   <path d="M15 41h79M21 36v23m66-23v23" stroke="${stone}" stroke-width="3" stroke-linecap="round"/>
   <path d="M31 45v8m12-8v8m12-8v8m12-8v8m12-8v8" stroke="#7c7761" stroke-width="1.8"/>
   <path d="m27 72 7-2m42-1 7 3" stroke="${light}" stroke-width="3" stroke-linecap="round"/>`:`
   <path d="M47 13Q71 25 62 35M45 66q-8 12 4 22" fill="none" stroke="${leaf}" stroke-width="14" stroke-linecap="round"/>
   <path d="M15 44h24v10H15m55-10h24v10H70" fill="${stone}"/>
   <path d="m21 37 2 21m64-21-3 21" stroke="${stone}" stroke-width="3"/>
   <path d="m30 49 8-16 17-2 11 13-9 16-18 1Zm26-5 13-10 15 8 1 16-18 6-10-8Z" fill="#737c7b" stroke="#424f52" stroke-width="2" stroke-linejoin="round"/>
   <path d="m36 62 8-10 14 5 4 15-18 4-11-6Z" fill="#64706f" stroke="#424f52" stroke-width="2"/>
   <path d="m41 37 9-1m19 5 8 5" stroke="#a0a69b" stroke-width="1.5" stroke-linecap="round"/>`,
  garden:alive?`
   <path d="M32 82V43m24 39V28m23 54V49" stroke="${leaf}" stroke-width="3.5" stroke-linecap="round"/>
   <path d="M32 69q-20 0-17-16 17 0 17 16Zm24-12q18-17 25-6-7 14-25 14Zm22 17q-1-19 16-20 4 17-16 20ZM54 77Q35 70 40 60q15 1 14 17Z" fill="${leaf}"/>
   <g fill="${coral}" stroke="#b68c75" stroke-width="1">
    <path d="M32 33q-10-10-15-1-6 8 4 12-1 12 10 11 10 3 12-8 11-3 7-12-5-9-18-2Z"/>
    <path d="M56 17q-10-10-16-1-7 8 3 13-1 12 11 12 10 3 13-9 11-3 7-12-6-10-18-3Z"/>
    <path d="M79 41q-8-9-14-1-6 6 3 11-1 10 9 10 10 3 12-8 10-2 7-10-5-9-17-2Z"/>
   </g>
   <g fill="${light}"><circle cx="31" cy="42" r="4"/><circle cx="55" cy="28" r="4"/><circle cx="78" cy="51" r="3.5"/></g>
   <path d="M14 84h83" stroke="${stone}" stroke-width="4" stroke-linecap="round"/>
   <path d="m22 84 4-7m62 7-3-5" stroke="${leaf}" stroke-width="2.5"/>`:`
   <path d="m14 84 22-4 20 4 22-3 19 3" fill="none" stroke="${stone}" stroke-width="4" stroke-linecap="round"/>
   <path d="M32 82 29 49l-8-9m9 20 12-10M55 82l3-49-8-11m8 26 12-10M78 82l-2-28 9-10m-8 23-11-9" fill="none" stroke="${leaf}" stroke-width="3" stroke-linecap="round"/>
   <path d="m32 82-10 7m11-7 9 8m13-7-9 7m10-7 11 6m11-7-5 9m5-9 12 7" stroke="#68716a" stroke-width="2" stroke-linecap="round"/>
   <path d="m17 72 8 3m43-4 7-2m17 7 5-3" stroke="#6b7470" stroke-width="2" stroke-linecap="round"/>`,
  home:alive?`
   <path d="M23 43h63v42H23Z" fill="${stone}"/>
   <path d="M73 31V15h8v22" fill="${stone}"/>
   <path d="m14 44 40-30 41 30Z" fill="${coral}"/>
   <path d="M29 35h47M22 42h64m-48-9 8 10m9-17 10 9m0 0 6 8" fill="none" stroke="#9e7868" stroke-width="1.7"/>
   <path d="M43 85V63q10-11 20 0v22Z" fill="${ink}"/>
   <path d="M29 54h11v13H29ZM68 54h11v13H68Z" fill="${light}" stroke="#8e886c" stroke-width="1.5"/>
   <path d="M34 54v13m-5-7h11m33-6v13m-5-7h11" stroke="#8f7f58" stroke-width="1.2"/>
   <path d="M76 12c-10-6 7-5 2-9m5 10c7-4-5-5 0-9" fill="none" stroke="#aebcb2" stroke-opacity=".6" stroke-width="2" stroke-linecap="round"/>
   <path d="M20 86h69" stroke="${stone}" stroke-width="3" stroke-linecap="round"/>`:`
   <path d="M23 43h63v42H23Z" fill="${stone}"/>
   <path d="m14 44 33-27-3 13 9 7-13 1-7 6Zm50-18 31 18H73l-5-10-8-1Z" fill="${coral}"/>
   <path d="M75 27V18l6-3v19" fill="#596464"/>
   <path d="M43 59h20v26H43ZM29 54h11v13H29ZM68 54h11v13H68Z" fill="${light}"/>
   <path d="m28 53 13 15m-13-1 13-12m26-2 13 14m-13 0 13-12m-37 7 21 13m-21-2 21 11" stroke="#969b8b" stroke-width="3"/>
   <path d="m80 72-7 5 3 8m-44-9 5 3-4 6M49 38l5 6 7-7" fill="none" stroke="#414f52" stroke-width="2"/>
   <path d="m11 85 9-5 9 7m56-1 8-7 8 7" fill="#515f5f"/>
   <path d="M20 87h72" stroke="#596765" stroke-width="2"/>`
 };
 return `<svg viewBox="0 0 110 100" aria-hidden="true"><path d="M5 90h100" stroke="#424f52" stroke-width="2"/>${scenes[kind]||scenes.path}</svg>`;
}
