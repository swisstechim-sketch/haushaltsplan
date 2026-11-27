'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const src=fs.readFileSync('app/src/main/assets/app.js','utf8');
const code=src.slice(src.indexOf('const empty='),src.indexOf('function log('));
for(const fail of [true,false]){
 let writes=0;
 const ctx=vm.createContext({Stay:{load(){if(fail)throw Error('read');return ''},save(){writes++;return true}},alert(){}});
 vm.runInContext(code+src.slice(src.indexOf('function validateCashDays('),src.indexOf('function list(k)')),ctx);
 if(fail){assert.throws(()=>ctx.save());assert.equal(writes,0)}else{ctx.save();assert.equal(writes,1)}
}
console.log('Storage startup checks passed');
