'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const src=fs.readFileSync('app/src/main/assets/app.js','utf8');
const ctx=vm.createContext({});
vm.runInContext(src.slice(src.indexOf('const empty='),src.indexOf('let db='))+src.slice(src.indexOf('function validateBackup('),src.indexOf('function list(k)'))+';globalThis.make=empty;',ctx);
const d=ctx.make();d.guests.push({id:'g'});d.rooms.push({id:'r'});d.bookings.push({id:'b',guest:'g',room:'r'});d.invoices.push({id:'i',booking:'b',total:100,lines:[]});d.payments.push({id:'p',invoice:'i',amount:20});
assert.equal(ctx.validateBackup(d).payments.length,1);
for(const mutate of [x=>x.guests.push({id:'g'}),x=>x.payments[0].invoice='missing',x=>x.payments[0].amount=-1,x=>delete x.rooms]){const x=JSON.parse(JSON.stringify(d));mutate(x);assert.throws(()=>ctx.validateBackup(x))}
console.log('Backup checks passed');
