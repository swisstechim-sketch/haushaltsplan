'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const js=fs.readFileSync('app/src/main/assets/app.js','utf8');
const css=fs.readFileSync('app/src/main/assets/style.css','utf8');
const first=js.indexOf('const DOCUMENT_TYPES='),last=js.indexOf('function helpPage()',first);
assert.ok(first>=0&&last>first,'report definitions found');
const today='2026-11-25';
const sample={
 hotel:{name:'Test Hotel',street:'Teststrasse',houseNumber:'9',postalCode:'8000',city:'Zürich',country:'CH',email:'info@example.ch'},
 guests:[{id:'g1',name:'Anna',street:'Gastweg',houseNumber:'1',postalCode:'8000',city:'Zürich',country:'CH',birthDate:'1985-04-01',documentType:'Reisepass',documentNumber:'PASS1'}],
 rooms:[{id:'r1',number:'101',category:'Standard',status:'Bereit',rate:120},{id:'r2',number:'102',category:'Standard',status:'Bereit',rate:120}],
 bookings:[{id:'b1',guest:'g1',room:'r1',arrival:today,departure:'2026-11-27',status:'Bestätigt',people:2}],
 invoices:[{id:'i1',number:'RE-1',guest:'Anna',date:today,dueDate:'2026-12-10',total:240,lines:[{name:'Logis',amount:240,vat:3.8}]}],
 payments:[{id:'p1',invoice:'i1',amount:40,date:today,method:'TWINT'}],
 tasks:[{id:'t1',room:'r2',name:'Reinigung',status:'Offen'}]
};
const ctx=vm.createContext({
 db:sample, today:()=>today, get:(name,id)=>sample[name].find(x=>x.id===id)||{},
 formattedAddress:x=>[x.street,x.houseNumber,x.postalCode,x.city].filter(Boolean).join(' '),
 active:x=>!['Storniert','Anfrage','Ausgecheckt'].includes(x.status),
 paid:id=>sample.payments.filter(x=>x.invoice===id).reduce((n,x)=>n+x.amount,0),
 credited:()=>0,money:n=>'CHF '+Number(n).toFixed(2),
 invoiceTax:lines=>lines.map(x=>({rate:Number(x.vat),gross:Number(x.amount),net:Number(x.amount)/(1+Number(x.vat)/100),tax:Number(x.amount)-Number(x.amount)/(1+Number(x.vat)/100)})),
 esc:s=>String(s),btn:()=>'<button></button>'
});
vm.runInContext(js.slice(first,last),ctx);
const names=vm.runInContext('DOCUMENT_TYPES',ctx);
assert.equal(names.length,43,'all 43 PDF mockups are listed');
assert.equal(names.filter(x=>x.available).length,22,'22 reports have data-driven renderers');
assert.equal(ctx.reportBuild('checkin-checkout-tagesliste',today).rows.length,1);
assert.equal(ctx.reportBuild('freie-zimmer',today).rows.length,1);
assert.equal(ctx.reportBuild('aufenthaltsplan',today).rows.length,1);
assert.equal(ctx.reportBuild('gasteherkunft',today).rows[0][0],'CH');
assert.equal(ctx.reportBuild('wochenverpflegung',today).rows.length,7);
assert.equal(ctx.reportBuild('wochenbelegungsplan',today).rows.length,2);
assert.equal(ctx.reportBuild('monatsbelegungsplan',today).rows.length,2);
assert.equal(ctx.reportBuild('monatsbelegungsplan',today).rows[0][2],2);
assert.equal(ctx.reportBuild('jahresbelegungsubersicht',today).rows.length,12);
assert.equal(ctx.reportBuild('jahresbelegungsubersicht',today).rows[10][2],2);
assert.equal(ctx.reportBuild('verpflegungsplan',today).rows.length,1);
assert.equal(ctx.reportBuild('housekeeping-kontrollbericht',today).rows.length,1);
assert.equal(ctx.reportBuild('kassenbericht',today).rows[0][2],'40.00');
assert.equal(ctx.reportBuild('umsatz-nach-zimmerkategorien',today).rows.length,1);
assert.equal(ctx.reportBuild('offene-posten',today).rows[0][3],'200.00');
assert.equal(ctx.reportBuild('gastemeldeformular',today,'g1').rows[0][1],'Anna');
assert.equal(ctx.reportBuild('buchungsbestaetigung',today,'b1').rows[0][1],'Anna');
assert.equal(ctx.reportBuild('zahlungsquittung',today,'p1').rows[4][1],'40.00');
assert.throws(()=>ctx.reportBuild('qr-rechnung',today),/noch nicht implementiert/);
assert.match(css,/body\.document-preview/);
assert.doesNotMatch(css,/:has\(\.report-a4\)/);
assert.match(js,/function documentClose\(\)/);
assert.match(js,/function documentPickDate\(\)/);
console.log('PDF report catalogue and data extraction checks passed');