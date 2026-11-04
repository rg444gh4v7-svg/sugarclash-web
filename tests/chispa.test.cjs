'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {loadCore}=require('../scripts/chispa-runtime.cjs');
const C=loadCore(),clean=v=>JSON.parse(JSON.stringify(v)),near=(a,b)=>assert.ok(Math.abs(a-b)<1e-5,`${a} != ${b}`);
const fixture=(surfaces=[],lamps=[C.lamp('l1',10,10)],actuators=[])=>C.level('test','Prueba',1,surfaces,lamps,actuators);

test('spark has a positive radius and the field border is an exit',()=>{
 const t=C.traceShot(C.LEVELS[0],C.initialState(),0);
 assert.equal(C.RADIUS,.75);assert.equal(t.terminal.kind,'exit');near(t.terminal.point.y,.75);near(t.distance,89.25);assert.equal(t.bounces,0);
});
test('preview is pure and repeated evaluation returns the same trace',()=>{
 const l=C.LEVELS[1],s=C.initialState(),before=JSON.stringify({l,s});
 assert.deepEqual(clean(C.traceShot(l,s,0)),clean(C.traceShot(l,s,0)));assert.equal(JSON.stringify({l,s}),before);
});
test('inactive actuator stops before changing the mirror; next shot uses the final pose',()=>{
 const l=C.LEVELS[1],s=C.initialState(),first=C.traceShot(l,s,0);
 assert.equal(first.terminal.kind,'actuator');assert.equal(first.bounces,0);assert.deepEqual(clean(first.lamps),[]);
 assert.equal(C.surfaces(l,s).find(s=>s.id==='m1').angle,45);
 const after=C.applyShot(l,s,first);assert.equal(C.surfaces(l,after).find(s=>s.id==='m1').angle,-45);
 const next=C.traceShot(l,after,0);assert.equal(next.actuator,null);assert.deepEqual(clean(next.lamps),['l1']);assert.equal(next.bounces,1);
});
test('a lamp before an actuator lights and remains passable',()=>{
 const t=C.traceShot(C.LEVELS[5],C.initialState(),0);
 assert.deepEqual(clean(t.lamps),['l1']);assert.equal(t.actuator,'a1');assert.ok(t.events[0].distance<t.terminal.distance);
});
test('a lamp behind the absorbing actuator is not reached',()=>{
 const l=fixture([C.mirror('m1',20,20)],[C.lamp('l1',50,30)],[C.actuator('a1',50,70,'m1',45)]);
 const t=C.traceShot(l,C.initialState(),0);assert.equal(t.actuator,'a1');assert.deepEqual(clean(t.lamps),[]);
});
test('active actuator does not stop or duplicate activation',()=>{
 const l=C.LEVELS[1],s=C.applyShot(l,C.initialState(),C.traceShot(l,C.initialState(),0));
 const t=C.traceShot(l,s,0);assert.equal(t.events.filter(e=>e.type==='actuator').length,0);assert.deepEqual(clean(C.applyShot(l,s,t).active),['a1']);
});
test('closed gate absorbs; opening it removes that collision',()=>{
 const l=C.LEVELS[4],s=C.initialState();assert.equal(C.traceShot(l,s,0).terminal.kind,'absorb');
 const opened=C.applyShot(l,s,C.traceShot(l,s,-61.82));assert.equal(C.surfaces(l,opened).some(s=>s.kind==='gate'),false);
 assert.equal(C.won(l,C.applyShot(l,opened,C.traceShot(l,opened,0))),true);
});
test('both faces of a mirror reflect',()=>{
 const l=fixture([C.mirror('m1',50,50)]),up=C.traceShot(l,C.initialState(),0);
 const downLevel={...l,source:C.P(50,10)},down=C.traceShot(downLevel,C.initialState(),180);
 assert.equal(up.bounces,1);assert.equal(down.bounces,1);assert.ok(up.terminal.point.x>90);assert.ok(down.terminal.point.x<10);
});
test('rounded endpoint collisions use the radius instead of an infinite ray line',()=>{
 const l={...fixture([C.wall('w1',20,50,40,50)]),source:C.P(41.5,90)};
 const t=C.traceShot(l,C.initialState(),0);assert.equal(t.bounces,1);assert.ok(t.segments[0].to.y>50);assert.ok(t.terminal.point.x>41.5);
 const miss={...l,source:C.P(42,90)};assert.equal(C.traceShot(miss,C.initialState(),0).bounces,0);
});
test('distance budget is total across reflections',()=>{
 const l=fixture([C.wall('w1',20,50,80,50)]),t=C.traceShot(l,C.initialState(),0,{maxDistance:50});
 assert.equal(t.bounces,1);assert.equal(t.terminal.kind,'distance');near(t.distance,50);near(t.segments.reduce((n,s)=>n+s.length,0),50);
});
test('six reflections allow a final seventh segment, but no seventh reflection',()=>{
 const l={...fixture([C.wall('left',40,5,40,95),C.wall('right',60,5,60,95)]),source:C.P(50,50)};
 const t=C.traceShot(l,C.initialState(),90);assert.equal(t.bounces,6);assert.equal(t.segments.length,7);assert.equal(t.terminal.kind,'bounce-limit');assert.ok(t.distance<300);
});
test('lamp on the final segment after the last allowed reflection still counts',()=>{
 const l={...fixture([C.wall('left',40,5,40,95),C.wall('right',60,5,60,95)],[C.lamp('l1',45,50)]),source:C.P(50,50)};
 const t=C.traceShot(l,C.initialState(),90,{maxBounces:1});assert.equal(t.bounces,1);assert.deepEqual(clean(t.lamps),['l1']);
});
test('simultaneous nonparallel contacts terminate as a corner',()=>{
 const l=fixture([C.wall('horizontal',20,40,80,40),C.wall('vertical',80,20,80,80)]);
 const start=l.source,contact=C.P(78.25,41.75),angle=Math.atan2(contact.x-start.x,start.y-contact.y)*180/Math.PI;
 const t=C.traceShot(l,C.initialState(),angle);assert.equal(t.terminal.kind,'corner');assert.equal(t.bounces,0);
});
test('absorption wins a tie against a reflecting surface',()=>{
 const l=fixture([C.wall('wall',20,50,80,50),C.gate('gate',20,50,80,50)]);
 const t=C.traceShot(l,C.initialState(),0);assert.equal(t.terminal.kind,'absorb');assert.equal(t.bounces,0);
});
test('same-distance lamp events have a stable id order independent of array order',()=>{
 const a=fixture([],[C.lamp('z',46,40),C.lamp('a',54,40)]),b={...a,lamps:[...a.lamps].reverse()};
 assert.deepEqual(clean(C.traceShot(a,C.initialState(),0).lamps),['a','z']);assert.deepEqual(clean(C.traceShot(a,C.initialState(),0)),clean(C.traceShot(b,C.initialState(),0)));
});
test('lamp at the distance limit is processed without extending the budget',()=>{
 const l=fixture([],[C.lamp('l1',50,35.75)]),t=C.traceShot(l,C.initialState(),0,{maxDistance:50});
 assert.equal(t.terminal.kind,'distance');near(t.distance,50);assert.deepEqual(clean(t.lamps),['l1']);
});
test('apply is pure and refuses stale, foreign, revised or already applied traces',()=>{
 const l=C.LEVELS[1],s=C.initialState(),trace=C.traceShot(l,s,0),before=JSON.stringify(s),after=C.applyShot(l,s,trace);
 assert.equal(JSON.stringify(s),before);assert.throws(()=>C.applyShot(l,after,trace),/resuelto/);assert.throws(()=>C.applyShot({...l,revision:2},s,trace),/sesión/);assert.throws(()=>C.applyShot({...l,id:'different'},s,trace),/sesión/);
});
test('victory requires lamps and does not require optional actuators or a reference score',()=>{
 const l=fixture([C.mirror('m1',20,20)],[C.lamp('l1',50,40)],[C.actuator('a1',20,70,'m1',45)]);
 const s=C.initialState();s.shots=99;const after=C.applyShot(l,s,C.traceShot(l,s,0));assert.equal(after.shots,100);assert.equal(C.won(l,after),true);assert.deepEqual(clean(after.active),[]);
});
test('session locks double shots and commits only once',()=>{
 const s=new C.Session(C.LEVELS[1]),p=s.begin(0);assert.equal(s.begin(0),null);assert.equal(s.commit(p.token),true);assert.equal(s.commit(p.token),false);assert.equal(s.state.shots,1);
});
test('undo restores all state and invalidates an in-flight shot',()=>{
 const s=new C.Session(C.LEVELS[5]),before=clean(s.state),p=s.begin(0);s.commit(p.token);assert.equal(s.state.lit.length,1);assert.equal(s.state.active.length,1);assert.equal(s.undo(),true);assert.deepEqual(clean(s.state),before);
 const pending=s.begin(0);assert.equal(s.undo(),true);assert.equal(s.commit(pending.token),false);assert.deepEqual(clean(s.state),before);
});
test('restart and destroying a session reject old callbacks',()=>{
 const s=new C.Session(C.LEVELS[1]),a=s.begin(0);s.restart();assert.equal(s.commit(a.token),false);assert.equal(s.state.shots,0);
 const b=s.begin(0);s.destroy();assert.equal(s.commit(b.token),false);assert.equal(s.begin(0),null);assert.equal(s.phase,'closed');
});
test('a completed attempt cannot be undone; replay starts from a clean attempt',()=>{
 const s=new C.Session(C.LEVELS[0]),a=s.begin(0);s.commit(a.token);assert.equal(s.phase,'won');assert.equal(s.undo(),false);s.restart();assert.equal(s.phase,'ready');assert.equal(s.state.lit.length,0);
});
test('invalid scenes, states, directions and limits fail explicitly',()=>{
 assert.throws(()=>C.validateLevel({...C.LEVELS[0],lamps:[]}),/incompleta/);
 assert.throws(()=>C.validateLevel({...C.LEVELS[0],source:C.P(-1,2)}),/Fuente/);
 assert.throws(()=>C.validateLevel(fixture([C.wall('same',10,10,20,10)],[C.lamp('same',50,40)])),/Identificador/);
 assert.throws(()=>C.validateLevel(fixture([],[C.lamp('l1',50,40)],[C.actuator('a1',20,70,'missing')])),/Conexión/);
 assert.throws(()=>C.traceShot(C.LEVELS[0],{lit:['missing'],active:[],shots:0},0),/Estado/);
 assert.throws(()=>C.traceShot(C.LEVELS[0],C.initialState(),NaN),/Dirección/);
 assert.throws(()=>C.traceShot(C.LEVELS[0],C.initialState(),0,{maxDistance:Infinity}),/Límite/);
});
test('scene validation rejects source occlusion and overlapping or out-of-field sensors',()=>{
 assert.throws(()=>C.validateLevel(fixture([C.wall('w1',40,90,60,90)])),/Fuente sobre/);
 assert.throws(()=>C.validateLevel(fixture([],[C.lamp('l1',50,40),C.lamp('l2',51,40)])),/superpuestos/);
 assert.throws(()=>C.validateLevel(fixture([],[C.lamp('l1',99,40)])),/fuera/);
 assert.throws(()=>C.validateLevel(fixture([C.wall('w1',.8,10,.8,80)])),/superficie|Superficie/);
});
test('final mirror poses are validated as well as the initial geometry',()=>{
 const l=fixture([{...C.mirror('m1',50,85,0),length:12}],[C.lamp('l1',10,10)],[C.actuator('a1',20,70,'m1',90)]);
 assert.throws(()=>C.validateLevel(l),/Fuente sobre/);
});
test('a shorter legitimate solution to the last scene is accepted',()=>{
 const l=C.LEVELS[11],s=new C.Session(l);for(const a of [-79.5,-13,-6.5]){const p=s.begin(a);s.commit(p.token);}assert.equal(s.phase,'won');assert.equal(s.state.shots,3);assert.ok(s.state.shots<l.reference);
});
test('all twelve authored solutions complete through the actual session engine',()=>{
 for(const l of C.LEVELS){const s=new C.Session(l);for(const angle of l.solution){const p=s.begin(angle);assert.ok(p,l.id);assert.ok(s.commit(p.token),l.id);}assert.equal(s.phase,'won',l.id);assert.equal(s.state.shots,l.reference,l.id);}
});
test('each early shot has a connected success interval of at least four degrees',()=>{
 for(const l of C.LEVELS.slice(0,6)){
  let state=C.initialState();
  for(const angle of l.solution){
   const trace=C.traceShot(l,state,angle),expected=JSON.stringify([trace.lamps,trace.actuator]);let span=0;
   for(const sign of [-1,1])for(let i=1;i<=150;i++){
    const probe=C.traceShot(l,state,angle+sign*i*.1);
    if(JSON.stringify([probe.lamps,probe.actuator])!==expected)break;
    span+=.1;
   }
   assert.ok(span>=4-1e-6,`${l.id}: success interval ${span} degrees`);state=C.applyShot(l,state,trace);
  }
 }
});
test('prototype embeds its fonts and companion and has no worker or network runtime dependency',()=>{
 const html=fs.readFileSync(path.join(__dirname,'../prototypes/chispa/index.html'),'utf8');assert.match(html,/@font-face/);assert.match(html,/data:font\/woff2;base64/);assert.match(html,/cf-portrait/);
 assert.doesNotMatch(html,/serviceWorker|sugarclash_renacer_v1|sugarclash_save_v1|fetch\(/);assert.doesNotMatch(html,/<script[^>]+src=|<link[^>]+rel="stylesheet"/);
});
