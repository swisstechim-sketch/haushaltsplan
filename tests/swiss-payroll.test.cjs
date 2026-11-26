'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const src=fs.readFileSync('app/src/main/assets/swiss-payroll-rules.js','utf8');
const ctx=vm.createContext({});
vm.runInContext(src,ctx);
const r=vm.runInContext('SwissPayrollRules',ctx);
assert.equal(r.bvg(22680,2026).insuredAnnual,0);
assert.equal(r.bvg(22681,2026).insuredAnnual,3780);
assert.equal(r.bvg(60000,2026).insuredAnnual,33540);
assert.equal(r.bvg(150000,2026).insuredAnnual,64260);
assert.throws(()=>r.bvg(60000,2027),/Grenzwerte/);
assert.equal(r.bvgMonthly(60000,'2026-02-28',{}).insuredPeriod,2795);
assert.equal(r.bvgMonthly(60000,'2026-02-28',{entryDate:'2026-02-15'}).insuredPeriod,1397.5);
assert.equal(r.bvgMonthly(60000,'2026-02-28',{entryDate:'2026-03-01'}).insuredPeriod,0);
assert.equal(r.bvgMonthly(60000,'2026-02-28',{exitDate:'2026-02-14'}).insuredPeriod,1397.5);
assert.equal(r.ahv({birthDate:'2010-01-01',ahvRetired:'Nein'},'2026-11-26',1000).base,0);
assert.equal(r.ahv({birthDate:'1980-01-01',ahvRetired:'Nein'},'2026-11-26',1000).base,100000);
assert.equal(r.ahv({birthDate:'1950-01-01',ahvRetired:'Ja'},'2026-11-26',1600).base,20000);
assert.equal(r.ahv({birthDate:'1950-01-01',ahvRetired:'Ja',ahvNoExemption:'Ja'},'2026-11-26',1600).base,160000);
assert.throws(()=>r.ahv({birthDate:'1950-01-01'},'2026-11-26',1600),/Referenzalter/);
const e={taxCanton:'ZH',taxTariff:'A0'},rows=[{year:2026,canton:'ZH',code:'A0',fromCents:0,toCents:499999,rate:2,source:'ESTV',verified:true},{year:2026,canton:'ZH',code:'A0',fromCents:500000,toCents:999999,rate:3,source:'ESTV',verified:true}];
assert.equal(r.tariffLookup(rows,e,'2026-11-26',5000).amount,15000);
assert.throws(()=>r.tariffLookup(rows,e,'2027-11-26',5000),/Keine eindeutige/);
assert.throws(()=>r.tariffLookup(rows.concat(rows[1]),e,'2026-11-26',5000),/Keine eindeutige/);
assert.throws(()=>r.tariffLookup([],e,'2026-11-26',5000),/Keine eindeutige/);
console.log('Swiss payroll: BVG limits, part-year periods, AHV cases and exact verified tariff matching passed');

const employee={id:'e1',entryDate:'2026-01-01',exitDate:'2026-06-30',thirteenthSalary:'Separat'};
const accrued=[{id:'a',employee:'e1',date:'2026-05-31',thirteenthSnapshot:{entitlement:50000,paid:0}}];
assert.equal(r.thirteenthBalance(accrued,'e1',2026).remaining,50000);
const payout=r.separateThirteenthDraft(accrued,employee,'2026-06-30',500);
assert.equal(payout.paid,50000);
assert.equal(payout.entitlement,0);
const history=accrued.concat({id:'b',employee:'e1',date:'2026-06-30',thirteenthSnapshot:payout});
assert.throws(()=>r.separateThirteenthDraft(history,employee,'2026-06-30',1),/Restanspruch/);
assert.equal(r.separateThirteenthDraft(accrued,employee,'2026-07-01',1).paid,100);
assert.throws(()=>r.separateThirteenthDraft(accrued,employee,'2025-12-31',1),/Anstellung/);
assert.throws(()=>r.separateThirteenthDraft(accrued,employee,'2026-05-01',1),/Spätere/);
assert.throws(()=>r.separateThirteenthDraft(accrued,employee,'2026-06-30',501),/Restanspruch/);
assert.throws(()=>r.thirteenthBalance(accrued.concat(accrued),'e1',2026),/Doppelte/);
assert.throws(()=>r.thirteenthBalance([{id:'old',employee:'e1',date:'2026-01-31'}],'e1',2026),/Anspruchsdaten/);
console.log('Separate thirteenth salary draft regression passed');

assert.deepEqual(JSON.parse(JSON.stringify(r.incrementalContribution({base:5000,previousBase:147000,annualLimit:148200,employeeRate:1.1,employerRate:1.1}))),{insuredBase:120000,employeeAmount:1320,employerAmount:1320});
assert.equal(r.incrementalContribution({base:5000,previousBase:148200,annualLimit:148200,employeeRate:1.1,employerRate:1.1}).employeeAmount,0);
assert.throws(()=>r.incrementalContribution({base:5000,previousBase:0,annualLimit:148200,employeeRate:-1,employerRate:1.1}),/Beitragssatz/);

assert.equal(r.ahv({birthDate:'1950-01-01',ahvRetired:'Ja'},'2026-11-26',1000,[{date:'2026-11-01',gross:0,thirteenthSnapshot:{paid:100000}}]).base,60000);
assert.throws(()=>r.ahv({birthDate:'1950-01-01',ahvRetired:'Ja'},'2026-11-26',1000,[{date:'2026-11-01',gross:0,thirteenthSnapshot:{paid:-1}}]),/historische Auszahlung/);


 // Exercise the actual application payment balance function with journal fixtures.
{
 const app=fs.readFileSync('app/src/main/assets/app.js','utf8');
 const start=app.indexOf('function premiumPayrollPaymentState(id)');
 const end=app.indexOf('\nfunction ',start+1);
 assert.ok(start>=0&&end>start);
 const db={accounts:[{id:'liability',number:'2000'}],journal:[]};
 const paymentCtx=vm.createContext({db,cents:v=>Math.round(Number(v)*100)});
 vm.runInContext(app.slice(start,end),paymentCtx);
 const state=()=>JSON.parse(vm.runInContext("JSON.stringify(premiumPayrollPaymentState('p'))",paymentCtx));
 assert.equal(state().booked,false);
 db.journal.push({source:'payroll:p',credit:'liability',debit:'expense',amount:5000},{source:'payroll:p',debit:'liability',credit:'insurance',amount:500});
 assert.equal(state().open,450000);
 db.journal.push({source:'payroll-payment:p:a',debit:'liability',credit:'bank',amount:2000});
 assert.equal(state().open,250000);
 db.journal.push({source:'payroll-payment:p:a:reversal',debit:'bank',credit:'liability',amount:2000});
 assert.equal(state().paid,0);
 assert.equal(state().open,450000);
 db.journal.push({source:'payroll-payment:p:b',debit:'liability',credit:'bank',amount:4500});
 assert.equal(state().open,0);
 db.journal.push({source:'payroll-payment:p:c',debit:'liability',credit:'bank',amount:1});
 assert.throws(state,/Lohnverbindlichkeit/);
}


{
 const app=fs.readFileSync('app/src/main/assets/app.js','utf8');
 const start=app.indexOf('function premiumPayrollBook(id)');
 const end=app.indexOf('\nfunction ',start+1);
 assert.ok(start>=0&&end>start);
 const draft={id:'p',name:'Test',gross:5000,date:'2026-11-26'};
 let expected=500000,posted=0;
 const ctx=vm.createContext({get:()=>draft,cents:v=>Math.round(Number(v)*100),premiumPayrollAmounts:()=>({gross:500000,deductions:0,allowances:0,net:expected}),confirm:()=>true,atomicChange:fn=>fn(),premiumPost:()=>posted++,render:()=>{}});
 vm.runInContext(app.slice(start,end),ctx);
 vm.runInContext("premiumPayrollBook('p')",ctx);
 assert.equal(posted,1);
 expected=499999;
 assert.throws(()=>vm.runInContext("premiumPayrollBook('p')",ctx),/Nettolohn/);
 assert.equal(posted,1);
 expected=-1;
 assert.throws(()=>vm.runInContext("premiumPayrollBook('p')",ctx),/Nettolohn/);
 assert.equal(posted,1);
}

{
 const app=fs.readFileSync('app/src/main/assets/app.js','utf8');
 const db={payrollDrafts:[{id:'a',employee:'e',date:'2026-01-31'},{id:'b',employee:'e',date:'2026-02-28'},{id:'c',employee:'other',date:'2026-02-28'}],journal:[],masterData:[],accounts:[{id:'w',number:'5000',category:'Aufwand',status:'Aktiv'},{id:'s',number:'2270',category:'Passiven',status:'Aktiv'}]};
 let approved=false;
 const ctx=vm.createContext({db,get:(k,id)=>db[k].find(r=>r.id===id)||{},confirm:()=>approved,atomicChange:fn=>fn(),close:()=>{},render:()=>{}});
 for(const name of ['premiumDeletePayrollDraft','premiumDefaultFixedAccount']){
  const start=app.indexOf('function '+name+'('),end=app.indexOf('\nfunction ',start+1);
  assert.ok(start>=0&&end>start);vm.runInContext(app.slice(start,end),ctx);
 }
 const del=()=>vm.runInContext("premiumDeletePayrollDraft('a')",ctx);
 del();assert.equal(db.payrollDrafts.length,3);
 approved=true;db.journal.push({source:'payroll:b'});
 assert.throws(del,/Abhängige verbuchte/);assert.equal(db.payrollDrafts.length,3);
 db.journal=[];del();assert.deepEqual(db.payrollDrafts.map(r=>r.id),['c']);
 assert.equal(vm.runInContext("premiumDefaultFixedAccount('Allowance','Nachtzulage')",ctx),'w');
 assert.equal(vm.runInContext("premiumDefaultFixedAccount('Deduction','ALV')",ctx),'s');
 assert.equal(vm.runInContext("premiumDefaultFixedAccount('Deduction','Unbekannt')",ctx),'');
 db.accounts[0].status='Inaktiv';
 assert.equal(vm.runInContext("premiumDefaultFixedAccount('Allowance','Nachtzulage')",ctx),'');
}
