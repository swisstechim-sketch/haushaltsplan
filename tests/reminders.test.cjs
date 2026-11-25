'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const src=fs.readFileSync('app/src/main/assets/app.js','utf8');
const start=src.indexOf('function reminderOverview()');
const end=src.indexOf('function reminderSettings(',start);
assert.ok(start>=0&&end>start,'reminder overview is present');
const invoice={id:'invoice1',number:'RE-2026-0001',total:100,dueDate:'2026-11-01',reminders:[]};
const ctx=vm.createContext({
 db:{invoices:[invoice]},today:()=> '2026-11-25',paid:()=>0,credited:()=>0,
 money:x=>'CHF '+x.toFixed(2),metric:()=>'',card:x=>x,
 get:()=>({name:'Testgast'}),esc:x=>String(x),
 btn:(label,action)=>action==='reminder'?'[CREATE_REMINDER]':''
});
vm.runInContext(src.slice(start,end),ctx);
const ready=()=>ctx.reminderOverview().includes('[CREATE_REMINDER]');
assert.equal(ready(),true,'overdue unpaid invoice permits first reminder');
invoice.reminders=[{level:1,date:'2026-11-10',dueDate:'2026-12-01',amount:100}];
assert.equal(ready(),false,'existing reminder grace period blocks next reminder');
invoice.reminders[0].dueDate='2026-11-20';
assert.equal(ready(),true,'next reminder becomes eligible after expiry');
invoice.reminders[0].date='2026-11-25';
assert.equal(ready(),false,'same-day duplicate reminder blocked');
invoice.reminders=[];
invoice.dueDate='2026-12-01';
assert.equal(ready(),false,'invoice not yet due cannot be reminded');
invoice.dueDate='2026-11-01';
invoice.reminders=[1,2,3].map(level=>({level,date:'2026-11-01',dueDate:'2026-11-02',amount:100}));
assert.equal(ready(),false,'fourth reminder cannot be created');
console.log('Reminder eligibility regression checks passed');

invoice.reminders=[{level:2,date:'2026-11-10',dueDate:'2026-11-20',amount:100}];
assert.equal(ready(),false,'inconsistent reminder sequence must not offer creation');
invoice.reminders=[];
invoice.total=0;
assert.equal(ready(),false,'settled invoice must not offer creation');
invoice.total=100;
invoice.dueDate='2026-11-25';
assert.equal(ready(),false,'invoice due today must not offer creation');
