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
 db:sample, today:()=>today, cents:v=>Math.round(Number(v)*100), chf:v=>Math.round(v)/100, nights:b=>Math.round((Date.parse(b.departure)-Date.parse(b.arrival))/86400000), get:(name,id)=>sample[name].find(x=>x.id===id)||{},
 formattedAddress:x=>[x.street,x.houseNumber,x.postalCode,x.city].filter(Boolean).join(' '),
 active:x=>!['Storniert','Anfrage','Ausgecheckt'].includes(x.status),
 paid:id=>sample.payments.filter(x=>x.invoice===id).reduce((n,x)=>n+x.amount,0),
 qrPaymentData:id=>{if(id!=='i1')throw Error('Invalid invoice');return 'SPC'},credited:()=>0,money:n=>'CHF '+Number(n).toFixed(2),
 invoiceTax:lines=>lines.map(x=>({rate:Number(x.vat),gross:Number(x.amount),net:Number(x.amount)/(1+Number(x.vat)/100),tax:Number(x.amount)-Number(x.amount)/(1+Number(x.vat)/100)})),
 esc:s=>String(s),btn:()=>'<button></button>'
});
vm.runInContext(js.slice(first,last),ctx);
const names=vm.runInContext('DOCUMENT_TYPES',ctx);
assert.equal(names.length,43,'all 43 PDF mockups are listed');
assert.equal(names.filter(x=>x.available).length,42,'42 reports have data-driven renderers');
sample.bookings[0].priceSnapshot={touristTax:15.2,touristTaxDetails:{enabled:true,adults:2,children:0,adultRate:3.8,childRate:0,amount:15.2}};
assert.equal(ctx.touristTaxMonthRows('2026-11').length,1,'monthly tourist tax includes saved room nights');
assert.equal(ctx.touristTaxMonthRows('2026-11')[0].total,15.2,'monthly tax uses saved nightly rates');
assert.equal(ctx.touristTaxMonthRows('2026-12').length,0,'other months are excluded');
assert.throws(()=>ctx.touristTaxMonthRows('2026-13'),/Ungültiger Berichtsmonat/);
sample.bookings[0].arrival='2026-11-29';
sample.bookings[0].departure='2026-12-03';
sample.bookings[0].priceSnapshot.touristTax=30.40;
sample.bookings[0].priceSnapshot.touristTaxDetails.amount=30.40;
assert.equal(ctx.touristTaxMonthRows('2026-11')[0].nights,2,'Nov 29-30 attributed to November');
assert.equal(ctx.touristTaxMonthRows('2026-11')[0].total,15.20,'November subtotal correct');
assert.equal(ctx.touristTaxMonthRows('2026-12')[0].nights,2,'Dec 1-2 attributed to December');
assert.equal(ctx.touristTaxMonthRows('2026-12')[0].total,15.20,'December subtotal correct');
sample.bookings[0].arrival=today;
sample.bookings[0].departure='2026-11-27';

delete sample.bookings[0].priceSnapshot;
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
assert.equal(ctx.reportBuild('anreiseinformationen',today,'b1').rows[0][1],'Anna');
assert.equal(ctx.reportBuild('reservationsofferte',today,'b1').rows.find(x=>x[0]==='Historischer Logis-Basispreis CHF')[1],'240.00');
sample.bookings[0].priceSnapshot={nights:2,adults:2,children:1,lodging:300,breakfast:60,other:80,total:440};
assert.equal(ctx.reportBuild('buchungsbestaetigung',today,'b1').rows.find(x=>x[0]==='Gesamtbetrag CHF')[1],'440.00');
assert.equal(ctx.reportBuild('reservationsofferte',today,'b1').rows.find(x=>x[0]==='Zusätzliche Mahlzeiten inkl. MWST CHF')[1],'80.00');
sample.bookings[0].groupRef='GR-1';
sample.bookings.push({...sample.bookings[0],id:'b2',room:'r2',priceSnapshot:{total:200}});
sample.bookings.push({...sample.bookings[0],id:'b3',status:'Storniert'});
assert.equal(ctx.reportBuild('gruppenreservation',today,'GR-1').rows.length,3);
assert.equal(ctx.reportBuild('gruppenreservation',today,'GR-1').rows[2][7],'640.00');
assert.throws(()=>ctx.reportBuild('gruppenreservation',today,'missing'),/Gruppenreferenz/);
sample.bookings.splice(1);
delete sample.bookings[0].groupRef;
assert.throws(()=>ctx.reportBuild('anzahlungsrechnung',today,'b1'),/Anzahlungsforderung/);
sample.bookings[0].depositAmount='100';
sample.bookings[0].depositDue='2026-11-26';
assert.equal(ctx.reportBuild('anzahlungsrechnung',today,'b1').rows.find(x=>x[0]==='Angeforderte Anzahlung CHF')[1],'100.00');
assert.equal(ctx.reportBuild('reservationsanderung',today,'b1').rows.find(x=>x[0]==='Gesamt CHF')[1],'440.00');
assert.equal(ctx.reportBuild('qr-rechnung',today,'i1').rows.find(x=>x[0]==='Offen CHF')[1],'200.00');
assert.equal(ctx.reportBuild('zahlungserinnerung',today,'i1').rows.find(x=>x[0]==='Offen CHF')[1],'200.00');
for(const [key,id] of [['lostItems','fundgegenstande-protokoll'],['guestWishes','gastewunsche'],['maintenance','wartungsliste'],['handover','schichtubergabe']]){
 sample[key]=[{id:'1',date:today,name:'Test',location:'101',details:'Notiz',status:'Offen'},{id:'2',date:'2026-11-26',name:'Zukunft'}];
 const report=ctx.reportBuild(id,today);
 assert.equal(report.rows.length,1);
 assert.equal(report.rows[0][1],'Test');
 assert.equal(report.rows[0][4],'Offen');
}
assert.equal(ctx.reportBuild('jahresabschluss',today).rows.length,13);
assert.deepEqual(Array.from(ctx.reportBuild('jahresabschluss',today).rows[10]),['2026-11','240.00','0.00','40.00','200.00']);
assert.deepEqual(Array.from(ctx.reportBuild('auswertung',today).rows[1]),['Total','240.00','0.00','40.00','200.00']);
sample.invoices[0].credits=[{date:'2026-12-01',amount:10.81}];
assert.deepEqual(Array.from(ctx.reportBuild('jahresabschluss',today).rows[11]),['2026-12','0.00','10.81','0.00','-10.81']);
delete sample.invoices[0].credits;
assert.equal(ctx.reportBuild('monatsabschluss',today).rows.some(x=>x[0]==='Rechnungsvolumen'),true);
assert.throws(()=>ctx.reportBuild('stornierungsbestatigung',today,'b1'),/stornierte Reservation/);
assert.equal(ctx.reportBuild('rechnung',today,'i1').rows[0][0],'Logis');
assert.equal(ctx.reportBuild('rechnung',today,'i1').rows.some(x=>x[0]==='Offen CHF'&&x[2]==='200.00'),true);
assert.throws(()=>ctx.reportBuild('gutschrift',today,'i1:0'),/gespeicherte Gutschrift/);
sample.invoices[0].credits=[{number:'GS-RE-1-1',date:today,amount:10.81,vat:8.1,name:'Korrektur',reason:'Testkorrektur'}];
assert.equal(ctx.reportBuild('gutschrift',today,'i1:0').rows[0][1],'GS-RE-1-1');
assert.equal(ctx.reportBuild('gastemeldeformular',today,'g1').rows[0][1],'Anna');
assert.equal(ctx.reportBuild('buchungsbestaetigung',today,'b1').rows[0][1],'Anna');
assert.equal(ctx.reportBuild('zahlungsquittung',today,'p1').rows[4][1],'40.00');
assert.throws(()=>ctx.reportBuild('qr-rechnung',today),/noch nicht implementiert/);
assert.match(css,/body\.document-preview/);
assert.doesNotMatch(css,/:has\(\.report-a4\)/);
assert.match(js,/function documentClose\(\)/);
assert.match(js,/function documentPickDate\(\)/);
console.log('PDF report catalogue and data extraction checks passed');