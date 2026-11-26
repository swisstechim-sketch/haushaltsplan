'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const src=fs.readFileSync('app/src/main/assets/app.js','utf8');
const hotel={name:'Test Hotel',iban:'CH9300762011623852957',street:'Teststrasse',houseNumber:'1',postalCode:'8000',city:'Zürich',country:'CH'};
const invoice={id:'i',number:'RE-2026-0001',total:108.10,issuer:hotel};
const ctx=vm.createContext({get:()=>invoice,db:{hotel,invoices:[invoice]},paid:()=>10,credited:()=>8.10});
for(const [name,next] of [['swissIban','qrPaymentData'],['qrPaymentData','qrDataView'],['invoiceTax','invoice']]){
 const start=src.indexOf('function '+name+'('),end=src.indexOf('function '+next+'(',start);
 assert.ok(start>=0&&end>start,name);
 vm.runInContext(src.slice(start,end),ctx);
}
assert.equal(ctx.swissIban(hotel.iban),true);
assert.equal(ctx.swissIban('CH9400762011623852957'),false);
assert.equal(ctx.swissIban(''),false);
const fields=ctx.qrPaymentData('i').split('\r\n');
assert.equal(fields.length,31);
assert.equal(fields[0],'SPC');
assert.equal(fields[18],'90.00');
assert.equal(fields[19],'CHF');
assert.equal(fields[27],'NON');
assert.equal(fields[30],'EPD');
const tax=ctx.invoiceTax([{vat:8.1,amount:108.10},{vat:3.8,amount:103.80}]);
assert.equal(tax[0].tax,3.8);
assert.equal(tax[1].tax,8.1);
assert.equal(tax[1].net,100);
invoice.total=18.10;
assert.throws(()=>ctx.qrPaymentData('i'));
invoice.total=NaN;
assert.throws(()=>ctx.qrPaymentData('i'));
invoice.total=108.10;
hotel.city='   ';
assert.throws(()=>ctx.qrPaymentData('i'));
console.log('Finance and QR payload checks passed');

// Exercise actual payment and credit helpers, including a paid invoice refund.
const ledger={invoices:[{id:'i',total:100,credits:[{amount:30}],refunds:[{amount:20}]}],payments:[{invoice:'i',amount:100},{invoice:'other',amount:50}]};
const ledgerCtx=vm.createContext({db:ledger,get:(k,id)=>ledger[k].find(x=>x.id===id)||{},cents:n=>Math.round(Number(n)*100),chf:n=>n/100});
const start=src.indexOf('const credited=id=>'),end=src.indexOf('function bindSvgAction',start);
assert.ok(start>=0&&end>start);
vm.runInContext(src.slice(start,end),ledgerCtx);
assert.equal(vm.runInContext("paid('i')",ledgerCtx),80);
assert.equal(vm.runInContext("credited('i')",ledgerCtx),30);
assert.equal(vm.runInContext("100-paid('i')-credited('i')",ledgerCtx),-10);
ledger.invoices[0].refunds.push({amount:10});
assert.equal(vm.runInContext("100-paid('i')-credited('i')",ledgerCtx),0);
assert.equal(vm.runInContext("paid('other')",ledgerCtx),50);
console.log('Payment, credit and refund balance checks passed');

assert.equal(ctx.qrReference('RE-2026-0001').length,27);
assert.equal(ctx.qrReference('RE-2026-0001'),'000000000000000000202600013');

// Current-year profit must exclude prior-year movements; balance sheet retains them.
const closingDb={accounts:[{id:'cash',category:'Aktiven'},{id:'sales',category:'Ertrag'},{id:'cost',category:'Aufwand'}],journal:[{date:'2025-12-31',debit:'cash',credit:'sales',amount:100},{date:'2026-01-01',debit:'cash',credit:'sales',amount:200},{date:'2026-11-26',debit:'cost',credit:'cash',amount:50},{date:'2026-12-01',debit:'cash',credit:'sales',amount:999}]};
const closingCtx=vm.createContext({db:closingDb,cents:n=>Math.round(Number(n)*100)});
vm.runInContext(src.slice(src.indexOf('function premiumClosingBalances('),src.indexOf('function financeStatements(')),closingCtx);
const closing=closingCtx.premiumClosingBalances('2026-11-26');
assert.equal(closing.period.Ertrag,20000);
assert.equal(closing.period.Aufwand,5000);
assert.equal(closing.periodProfit,15000);
assert.equal(closing.profit,25000);
assert.equal(closing.Aktiven,25000);
assert.equal(closing.difference,0);
assert.throws(()=>closingCtx.premiumClosingBalances('2026-02-30'));
assert.throws(()=>closingCtx.premiumClosingBalances('2026-11-26','2027-01-01'));
console.log('Annual closing period regression checks passed');

// Existing payroll arithmetic, optional amounts and invalid deductions.
const payrollCtx=vm.createContext({cents:n=>Math.round(Number(n)*100)});
vm.runInContext(src.slice(src.indexOf('function premiumPayrollAmounts('),src.indexOf('function premiumPayrollPrint(')),payrollCtx);
assert.equal(payrollCtx.premiumPayrollAmounts({gross:5000,deductions:450.25,allowances:200}).net,474975);
assert.equal(payrollCtx.premiumPayrollAmounts({gross:5000}).net,500000);
assert.throws(()=>payrollCtx.premiumPayrollAmounts({gross:100,deductions:101}));
assert.throws(()=>payrollCtx.premiumPayrollAmounts({gross:100,deductions:-1}));
assert.throws(()=>payrollCtx.premiumPayrollAmounts({gross:'invalid'}));
console.log('Payroll arithmetic regression checks passed');
