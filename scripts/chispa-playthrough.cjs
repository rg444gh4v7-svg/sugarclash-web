'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const {loadCore}=require('./chispa-runtime.cjs');
const C=loadCore(),records=[];
for(const level of C.LEVELS){
 const session=new C.Session(level),shots=[];
 for(const angle of level.solution){
  const pending=session.begin(angle);assert.ok(pending,`Cannot start ${level.id}`);
  const preview=C.traceShot(level,session.state,angle);assert.equal(JSON.stringify(preview),JSON.stringify(pending.trace),'Preview diverged');
  const expected=JSON.stringify([preview.lamps,preview.actuator]),interval={minus:0,plus:0,step:.1,maxProbe:15};
  for(const [name,sign]of [['minus',-1],['plus',1]])for(let i=1;i<=150;i++){
   const probe=C.traceShot(level,session.state,angle+sign*i*.1);
   if(JSON.stringify([probe.lamps,probe.actuator])!==expected)break;
   interval[name]=i*.1;
  }
  interval.width=Number((interval.minus+interval.plus).toFixed(1));assert.ok(interval.width>=(Number(level.id)<=6?4:2),`Narrow aiming interval ${level.id}`);
  shots.push({angle,successInterval:interval,trace:pending.trace});assert.ok(session.commit(pending.token));
 }
 assert.equal(session.phase,'won',`Unsolved ${level.id}`);
 records.push({id:level.id,revision:level.revision,title:level.title,shots:session.state.shots,reference:level.reference,state:session.state,trace:shots});
}
const report={generatedAt:new Date().toISOString(),sourceSHA256:crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,'../prototypes/chispa/index.html'))).digest('hex'),engine:'actual inline ChispaCore / Session',storage:'none; isolated in memory',levels:records.length,completed:records.filter(r=>C.won(C.LEVELS.find(l=>l.id===r.id),r.state)).length,totalShots:records.reduce((sum,r)=>sum+r.shots,0),limits:'Authored solutions replayed through the real deterministic rules; not human UI, exhaustive search, optimality, fun or retention evidence.',records};
const dest=path.join(__dirname,'../docs/CHISPA_PLAYTHROUGH.json');fs.writeFileSync(dest,JSON.stringify(report,null,2)+'\n');
console.log(`${report.completed}/${report.levels} CHISPA scenes; ${report.totalShots} actual shots; no storage writes; report ${dest}`);
