const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const src=fs.readFileSync('app/src/main/assets/app.js','utf8');
const start=src.indexOf('function transitionStay('),end=src.indexOf('function receptionAction(',start);
assert.ok(start>=0&&end>start);
function fixture(status='Bestätigt'){
 const room={id:'r',status:'Bereit'},booking={id:'b',room:'r',status,arrival:'2026-11-25',departure:'2026-11-28'};
 const db={rooms:[room],bookings:[booking],tasks:[],maintenance:[]};
 const ctx={db,get:(k,id)=>db[k].find(x=>x.id===id)||{},today:()=> '2026-11-26',atomicChange:fn=>fn(),uid:()=> 'task',label:()=> 'Gast',close:()=>{},render:()=>{}};
 vm.createContext(ctx);vm.runInContext(src.slice(start,end),ctx);return {db,room,booking,run:target=>ctx.transitionStay('b',target)};
}
{const f=fixture();f.run('Eingecheckt');assert.equal(f.booking.status,'Eingecheckt')}
for(const [key,row] of [['tasks',{room:'r',status:'Kontrolle'}],['maintenance',{room:'r',status:'In Arbeit'}],['bookings',{id:'other',room:'r',status:'Eingecheckt'}]]){const f=fixture();f.db[key].push(row);assert.throws(()=>f.run('Eingecheckt'),/nicht bezugsbereit/);assert.equal(f.booking.status,'Bestätigt')}
{const f=fixture();f.db.tasks.push({room:'r',status:'Erledigt'});f.run('Eingecheckt');assert.equal(f.booking.status,'Eingecheckt')}
{const f=fixture('Eingecheckt');f.db.bookings.push({id:'next',room:'r',status:'Bestätigt',arrival:'2026-11-26'});f.run('Ausgecheckt');assert.equal(f.room.status,'Reinigung');assert.equal(f.db.tasks[0].priority,'Dringend');assert.equal(f.db.tasks[0].release,'Nein')}
{const f=fixture('Eingecheckt');f.db.tasks.push({room:'r',name:'Abreisereinigung',status:'Kontrolle'});f.run('Ausgecheckt');assert.equal(f.db.tasks.length,1)}
console.log('Housekeeping: 7 regression scenarios passed');
