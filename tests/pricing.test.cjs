'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const app=fs.readFileSync('app/src/main/assets/app.js','utf8');
const start=app.indexOf('/* Room-only prices:'),end=app.indexOf('const schemas=',start);
assert.ok(start>=0&&end>start,'room pricing module is present');
const context=vm.createContext({
 nights:b=>Math.round((Date.parse(b.departure)-Date.parse(b.arrival))/86400000),
 esc:value=>String(value)
});
vm.runInContext(app.slice(start,end),context);
const room={
 rate:100,adultRate2:150,childRate1:20,weekendPercent:20,
 season1Name:'Winter',season1Start:'2026-11-27',season1End:'2026-11-28',season1Percent:10
};
const hotel={breakfastAdult:15,breakfastChild:8,halfBoardAdult:50,halfBoardChild:25,fullBoardAdult:75,fullBoardChild:40};
const base={arrival:'2026-11-26',departure:'2026-11-29',adults:2,children:1,meal:'Nur Logis'};
const quote=context.bookingQuote(base,room,hotel);
assert.equal(quote.nights,3);
assert.equal(quote.people,3);
assert.equal(quote.lodging,618.8,'Thu base and Fri/Sat weekend and season adjustments');
assert.equal(quote.breakfast,0);
assert.equal(quote.other,0);
assert.equal(quote.total,618.8);
assert.equal(context.bookingQuote({...base,meal:'Frühstück'},room,hotel).breakfast,114);
const half=context.bookingQuote({...base,meal:'Halbpension'},room,hotel);
assert.equal(half.breakfast,114);
assert.equal(half.other,261);
assert.equal(half.total,993.8);
const full=context.bookingQuote({...base,meal:'Vollpension'},room,hotel);
assert.equal(full.breakfast,114);
assert.equal(full.other,456);
assert.equal(full.total,1188.8);
assert.throws(()=>context.bookingQuote({...base,adults:0},room,hotel),/Erlaubt/);
assert.throws(()=>context.bookingQuote({...base,children:5},room,hotel),/Erlaubt/);
assert.throws(()=>context.validPricePlan({...room,weekendPercent:500}),/Wochenendzuschlag/);
assert.throws(()=>context.validPricePlan({...room,season2Start:'2026-11-28',season2End:'2026-11-30'}),/überschneiden/);
assert.throws(()=>context.validateMealPrices({...hotel,halfBoardAdult:10}),/mindestens das Frühstück/);
assert.match(app,/if\(q\.breakfast>0\)lines\.push\(\{name:'Frühstück/,'breakfast invoice line added');
assert.match(app,/vat:VAT_CATERING,amount:q\.other/,'other catering meal VAT separated');
assert.match(app,/priceSnapshot=q/,'reservation stores calculated price snapshot');
assert.match(app,/const isSnapshot=Boolean\(b\.priceSnapshot/,'old reservations remain grandfathered');
const persisted={room:'r1',arrival:'2026-11-26',departure:'2026-11-29',adults:2,children:1,meal:'Halbpension',priceSnapshot:{total:993.8}};
assert.equal(context.unchangedReservationTariff(persisted,{room:'r1',arrival:'2026-11-26',departure:'2026-11-29',adults:'2',children:'1',meal:'Halbpension'}),true,'unchanged booking retains original price');
assert.equal(context.unchangedReservationTariff(persisted,{room:'r1',arrival:'2026-11-26',departure:'2026-11-29',adults:'2',children:'0',meal:'Halbpension'}),false,'changed child count requires new price');
assert.equal(context.unchangedReservationTariff(persisted,{room:'r1',arrival:'2026-11-26',departure:'2026-11-29',adults:'2',children:'1',meal:'Vollpension'}),false,'changed meal requires new price');
console.log('Room, adult/child, weekend, season, meal and VAT price tests passed');