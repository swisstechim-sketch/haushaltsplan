'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const src=fs.readFileSync('app/src/main/assets/app.js','utf8');
const ctx=vm.createContext({});
vm.runInContext(src.slice(src.indexOf('const empty='),src.indexOf('let db='))+src.slice(src.indexOf('function validateCashDays('),src.indexOf('function list(k)'))+src.slice(src.indexOf('function reminderFee('),src.indexOf('function validateReminderSettings('))+src.slice(src.indexOf('function extraMealOverrides('),src.indexOf('function bookingQuote('))+';globalThis.make=empty;',ctx);
const d=ctx.make();d.guests.push({id:'g'});d.rooms.push({id:'r'});d.bookings.push({id:'b',guest:'g',room:'r'});d.invoices.push({id:'i',booking:'b',total:100,lines:[]});d.payments.push({id:'p',invoice:'i',amount:20});
assert.equal(ctx.validateBackup(d).payments.length,1);
for(const mutate of [x=>x.guests.push({id:'g'}),x=>x.payments[0].invoice='missing',x=>x.payments[0].amount=-1,x=>delete x.rooms]){const x=JSON.parse(JSON.stringify(d));mutate(x);assert.throws(()=>ctx.validateBackup(x))}
console.log('Backup checks passed');

const legacy=JSON.parse(JSON.stringify(d));for(const k of ['lostItems','guestWishes','maintenance','handover','cashDays'])delete legacy[k];legacy.bookings[0].deposit=25;
const restored=ctx.validateBackup(legacy);assert.equal(restored.bookings[0].depositAmount,25);assert.equal(restored.maintenance.length,0);
for(const key of ['credits','refunds']){const x=JSON.parse(JSON.stringify(d));x.invoices[0][key]=[{amount:10}];assert.equal(ctx.validateBackup(x).invoices[0][key][0].amount,10);for(const bad of [null,{},[{amount:-1}],[{amount:'invalid'}],[null]]){x.invoices[0][key]=bad;assert.throws(()=>ctx.validateBackup(x))}}
console.log('Legacy backup and nested financial validation checks passed');

const cash={id:'cash1',date:'2026-11-25',name:'Rezeption',opening:100,counted:120,entries:[{kind:'Ein',amount:20,name:'Einlage'}]};
d.cashDays=[cash];assert.equal(ctx.validateBackup(d).cashDays.length,1);assert.equal(restored.cashDays.length,0);
for(const bad of [[cash,{...cash,id:'cash2'}],[{...cash,date:'2026-02-30'}],[{...cash,counted:-1}],[{...cash,entries:[{kind:'Aus',amount:-1,name:'Test'}]}]]){assert.throws(()=>ctx.validateBackup({...d,cashDays:bad}))}
console.log('Cash backup validation checks passed');

const dispatch={date:'2026-11-25',channel:'Post',note:'Beleg',recordedAt:'2026-11-25T12:00:00Z'};
const withReminder=JSON.parse(JSON.stringify(d));withReminder.invoices[0].reminders=[{level:1,fee:12.5,dispatchHistory:[dispatch]}];
assert.equal(ctx.validateBackup(withReminder).invoices[0].reminders[0].fee,12.5);
for(const bad of [{fee:-1},{fee:1.001},{dispatchHistory:{}},{dispatchHistory:[{...dispatch,channel:'invalid'}]}]){const x=JSON.parse(JSON.stringify(withReminder));Object.assign(x.invoices[0].reminders[0],bad);assert.throws(()=>ctx.validateBackup(x))}

const mealBackup=JSON.parse(JSON.stringify(d));Object.assign(mealBackup.bookings[0],{arrival:'2026-11-25',departure:'2026-11-27',extraMealDays:'2026-11-26;1;2;3'});
assert.equal(ctx.validateBackup(mealBackup).bookings[0].extraMealDays,'2026-11-26;1;2;3');
for(const bad of [42,'2026-11-30;1;2;3','2026-11-26;101;0;0']){mealBackup.bookings[0].extraMealDays=bad;assert.throws(()=>ctx.validateBackup(mealBackup))}
