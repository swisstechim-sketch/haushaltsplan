/* Schweizer Lohnregel-Pruefung: Jahreszahlen 2026; keine automatischen Annahmen fuer andere Jahre. */
'use strict';
const SwissPayrollRules=(function(){
  const YEARS={2026:{bvgEntry:22680,bvgDeduction:26460,bvgUpper:90720,bvgMinimum:3780,retireeExemptionMonth:1400,retireeExemptionYear:16800}};
  function values(year){const v=YEARS[Number(year)];if(!v)throw Error('Gesetzliche Grenzwerte fuer '+year+' nicht hinterlegt. Bitte amtlich pruefen.');return v}
  function iso(value){const s=String(value||'');if(!/^\d{4}-\d{2}-\d{2}$/.test(s)||new Date(s+'T12:00:00Z').toISOString().slice(0,10)!==s)throw Error('Datum ungueltig');return s}
  function cents(n){if(n==null||n===''||!Number.isFinite(Number(n))||Number(n)<0)throw Error('Lohnbetrag ungueltig');return Math.round(Number(n)*100)}
  function days(from,until){const a=Date.parse(iso(from)+'T12:00:00Z'),b=Date.parse(iso(until)+'T12:00:00Z');if(b<a)throw Error('Zeitraum ungueltig');return Math.round((b-a)/86400000)+1}
  function period(date,employee,from,until){date=iso(date);const monthStart=date.slice(0,7)+'-01',monthEnd=new Date(Date.UTC(+date.slice(0,4),+date.slice(5,7),0)).toISOString().slice(0,10);const start=[monthStart,employee.entryDate||monthStart,from||monthStart].reduce((a,b)=>a>b?a:b),end=[monthEnd,employee.exitDate||monthEnd,until||monthEnd].reduce((a,b)=>a<b?a:b);if(start>end)return {days:0,total:days(monthStart,monthEnd),fraction:0};const active=days(start,end),total=days(monthStart,monthEnd);return {days:active,total,fraction:active/total}}
  function bvg(annualSalary,year,options={}){const v=values(year),annual=cents(annualSalary)/100;if(annual<=v.bvgEntry)return {insuredAnnual:0,coordinationDeduction:v.bvgDeduction,entryThreshold:v.bvgEntry,upperLimit:v.bvgUpper};const coordinated=Math.min(annual,v.bvgUpper)-v.bvgDeduction;return {insuredAnnual:Math.max(v.bvgMinimum,coordinated),coordinationDeduction:v.bvgDeduction,entryThreshold:v.bvgEntry,upperLimit:v.bvgUpper}}
  function bvgMonthly(annualSalary,date,employee={}){const annual=bvg(annualSalary,iso(date).slice(0,4));const p=period(date,employee);return {...annual,insuredPeriod:Math.round(annual.insuredAnnual*100/12*p.fraction)/100,activeDays:p.days,monthDays:p.total}}
  function ahv(employee,date,gross,history=[]){date=iso(date);const v=values(date.slice(0,4)),grossCents=cents(gross),birth=employee.birthDate?iso(employee.birthDate):null;if(!birth)throw Error('AHV: Geburtsdatum fehlt');const year=+date.slice(0,4),birthYear=+birth.slice(0,4);
    if(year<=birthYear+17)return {base:0,reason:'Noch nicht beitragspflichtig'};
    if(employee.ahvRetired!=='Ja'&&employee.ahvRetired!=='Nein')throw Error('AHV-Referenzalter muss geprueft und erfasst werden');
    if(employee.ahvRetired==='Nein')return {base:grossCents,reason:'Normaler AHV-Lohn'};
    if(employee.ahvNoExemption==='Ja')return {base:grossCents,reason:'Verzicht auf Rentnerfreibetrag'};
    const used=history.filter(x=>x&&x.date&&String(x.date).slice(0,7)===date.slice(0,7)).reduce((sum,x)=>sum+cents(x.gross||0),0);
    const allowance=Math.max(0,v.retireeExemptionMonth*100-used);
    return {base:Math.max(0,grossCents-allowance),reason:'Rentnerfreibetrag monatlich'};
  }
  function tariffLookup(tables,employee,date,gross){date=iso(date);const canton=String(employee.taxCanton||'').toUpperCase(),code=String(employee.taxTariff||'').toUpperCase().trim(),year=+date.slice(0,4),salary=cents(gross);if(!/^[A-Z]{2}$/.test(canton)||!code)throw Error('Quellensteuer: Kanton und Tarifcode fehlen');
    const rows=(tables||[]).filter(r=>r.year===year&&r.canton===canton&&r.code===code&&r.source==='ESTV'&&r.verified===true&&Number.isSafeInteger(r.fromCents)&&Number.isSafeInteger(r.toCents)&&r.fromCents<=salary&&salary<=r.toCents);
    if(rows.length!==1)throw Error('Keine eindeutige amtlich verifizierte Quellensteuertarifzeile fuer Kanton/Jahr/Tarif/Lohn');
    const row=rows[0];if(!Number.isFinite(row.rate)||row.rate<0||row.rate>100)throw Error('Quellensteuersatz ungueltig');
    return {amount:Math.round(salary*row.rate/100),rate:row.rate,source:'ESTV',year,canton,code};
  }
  // All amounts are integer cents. Planned payouts are not proof of payment.
  function thirteenthBalance(rows,employeeId,year){
    if(!employeeId||!/^\d{4}$/.test(String(year)))throw Error('Mitarbeiter und Jahr prüfen');
    let entitlement=0,planned=0;const ids=new Set();
    for(const row of rows){
      if(row.employee!==employeeId||String(row.date).slice(0,4)!==String(year))continue;
      iso(row.date);
      if(!row.id||ids.has(row.id))throw Error('Doppelte Abrechnung');
      ids.add(row.id);
      const v=row.thirteenthSnapshot;
      if(!v||![v.entitlement,v.paid].every(n=>Number.isSafeInteger(n)&&n>=0))throw Error('Anspruchsdaten fehlen oder sind ungültig');
      entitlement+=v.entitlement;planned+=v.paid;
      if(!Number.isSafeInteger(entitlement)||!Number.isSafeInteger(planned))throw Error('Lohnsumme zu gross');
    }
    return {entitlement,planned,remaining:entitlement-planned};
  }
  function separateThirteenthDraft(rows,employee,date,amount){
    date=iso(date);
    if(employee.thirteenthSalary!=='Separat')throw Error('Separate Auszahlung nicht vereinbart');
    if(!employee.entryDate||date<iso(employee.entryDate)||(employee.exitDate&&date>iso(employee.exitDate)))throw Error('Abrechnungsdatum ausserhalb der Anstellung');
    const balance=thirteenthBalance(rows,employee.id,date.slice(0,4));
    const paid=cents(amount);
    if(paid<=0||paid>balance.remaining)throw Error('Auszahlung überschreitet Restanspruch oder ist null');
    return {mode:'Separat',entitlement:0,paid};
  }
  return {YEARS,values,period,bvg,bvgMonthly,ahv,tariffLookup,thirteenthBalance,separateThirteenthDraft};
})();
