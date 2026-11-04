'use strict';
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

function loadCore(){
 const html=fs.readFileSync(path.join(__dirname,'../prototypes/chispa/index.html'),'utf8');
 const start=html.indexOf('/* CHISPA_CORE_START */'),end=html.indexOf('/* CHISPA_VIEW_START */');
 if(start<0||end<=start)throw Error('CHISPA core block not found');
 const context={};vm.runInNewContext(html.slice(start,end),context,{timeout:5000,filename:'chispa-inline-core.js'});
 return context.ChispaCore;
}
module.exports={loadCore};
