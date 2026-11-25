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

invoice.dueDate='2026-11-01';
invoice.reminders=[{level:1,date:'2026-11-10',amount:100}];
assert.equal(ready(),false,'missing previous deadline must block follow-up reminder');

assert.match(ctx.reminderOverview(),/Mahnverlauf prüfen/,'missing deadline is visibly flagged');
invoice.reminders=[{level:9,date:'2026-11-10',dueDate:'2026-11-20',amount:100}];
assert.match(ctx.reminderOverview(),/Unbekannte Mahnstufe/,'unknown reminder level is visibly flagged');
assert.equal(ready(),false,'unknown reminder level blocks creation');

const archiveStart=src.indexOf('function reminderArchive(');
assert.ok(archiveStart>=0&&archiveStart<start);
let archiveHtml='';
const archiveCtx=vm.createContext({get:()=>invoice,esc:x=>String(x),money:x=>String(x),dialog:x=>{archiveHtml=x},btn:(label,action)=>action==='reminderArchivePdf'?'[PDF]':''});
vm.runInContext(src.slice(archiveStart,start),archiveCtx);
invoice.reminders=[{level:9,amount:100}];
archiveCtx.reminderArchive(invoice.id);
assert.match(archiveHtml,/Datensatz prüfen/);
assert.doesNotMatch(archiveHtml,/\[PDF\]/);
invoice.reminders=[{level:1,amount:100}];
archiveCtx.reminderArchive(invoice.id);
assert.match(archiveHtml,/\[PDF\]/);
assert.match(archiveHtml,/Versandstatus: nicht nachgewiesen/);
