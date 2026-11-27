'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const src=fs.readFileSync('app/src/main/assets/app.js','utf8');
const css=fs.readFileSync('app/src/main/assets/style.css','utf8');
const html=fs.readFileSync('app/src/main/assets/index.html','utf8');
const begin=src.indexOf('const COUNTRY_OPTIONS=');
const end=src.indexOf('const schemas=',begin);
assert.ok(begin>=0&&end>begin,'country and mail template helpers found');
const context=vm.createContext({db:{templates:[],hotel:{name:'Demo',street:'Teststrasse',houseNumber:'1',postalCode:'8000',city:'Zürich',country:'CH'}},uid:()=>String(Math.random()),esc:v=>String(v)});
vm.runInContext(src.slice(begin,end),context);
assert.equal(context.ensureDefaultTemplates(),true,'13 templates initialized');
assert.equal(context.db.templates.length,13);
const saved={...context.db.templates[0],body:'Individuell angepasst'};
context.db.templates[0]=saved;
assert.equal(context.ensureDefaultTemplates(),false,'templates are not duplicated');
assert.equal(context.db.templates[0].body,'Individuell angepasst','customizations preserved');
assert.equal(context.formattedAddress(context.db.hotel),'Teststrasse 1, 8000 Zürich, Schweiz');
assert.match(context.countrySelect('country','CH',true),/Schweiz/);
assert.match(context.countrySelect('country','CH',true),/selected/);
assert.match(src,/\['birthDate','Geburtsdatum','date'\]/);
assert.match(src,/\['documentType','Ausweisdokument'/);
assert.match(src,/\['country','Land','country'\]/);
assert.match(src,/pdf-preview-toolbar/);
assert.match(css,/\.pdf-preview-toolbar/);
assert.match(css,/\.action-svg/);
assert.match(html,/id="header-page-title"/);
assert.doesNotMatch(src,/else if\(page==='settings'\).*?Object\.keys\(db\.hotel\)/);
assert.match(src,/function helpPage\(\)/,'help is implemented');
assert.match(src,/function aboutPage\(\)/,'about is implemented');
assert.match(src,/\['help','Hilfe'/,'help appears in navigation');
assert.match(src,/\['about','Über STAY Swiss'/,'about appears in navigation');
assert.match(src,/buymeacoffee\.com\/swisstech/,'support button targets requested URL');
assert.match(css,/\.help-grid/,'help layouts are styled');
assert.match(css,/\.about-hero/,'about layouts are styled');
assert.match(src,/swisstech-logo\.svg/,'About uses attached logo asset');
assert.match(src,/else if\(page==='reception'\)\{const day=today\(\)/,'tablet reception uses dedicated live view');
assert.match(src,/receptionFilter/,'tablet reception filter actions');
assert.match(src,/checkin-checkout-tagesliste/,'reception has document link');
assert.match(src,/class="reception-table"/,'tablet reception follows table mockup');
assert.match(src,/class="reception-top-actions"/,'reception toolbar exists');
assert.match(css,/\.reception-table/,'reception table has responsive styling');
assert.match(css,/\.about-hero \.actions\{flex-wrap:nowrap/,'About actions are in one row');
assert.match(css,/\.about-footer \.company-logo/,'logo has responsive sizing');
const roomSection=src.match(/const ROOM_CATEGORIES=(\[[^;]+\]);/);
assert.ok(roomSection,'room category configuration is present');
const categories=JSON.parse(roomSection[1]);
assert.equal(categories.length,12,'exactly 12 selectable room categories');
assert.equal(new Set(categories).size,12,'room categories unique');
for(const name of ['Standard','Komfort','Suite'])assert.ok(categories.includes(name),'preserve existing SVG categories');
assert.match(src,/\['category','Zimmerkategorie',ROOM_CATEGORIES\]/,'room form uses dropdown');
assert.match(src,/bisherige Kategorie/,'legacy room category is retained on edits');
assert.match(src,/Bitte eine gültige Zimmerkategorie auswählen/,'room category validated on save');
assert.match(css,/\.dialog-identity/,'dialog heading section has mockup styling');
assert.match(css,/\.dialog-section-title/,'dialog has settings section');
assert.match(css,/@media \(min-width:800px\) and \(orientation:landscape\)/,'compact tablet landscape rules');
assert.match(css,/grid-template-columns:200px minmax\(0,1fr\)/,'tablet sidebar width is compact');
assert.match(css,/body:not\(\.reference-dashboard\) main h1\{font-size:24px/,'tablet heading scale reduced');
assert.match(css,/#dialog\{width:min\(100%,520px\)/,'modal width reduced on tablet');
assert.match(css,/\.dialog-toolbar h2\{font-size:19px/,'modal title scale reduced');
assert.match(css,/body\.document-preview \.report-a4\{font-size:11pt\}/,'PDF paper layout keeps print typography');
assert.match(src,/class="tariff-section" open/,'room tariff staffel is an expandable section');
assert.match(src,/Wochenendtarif · Freitag und Samstag/,'weekend rules explained in room dialog');
assert.match(src,/Saison-Tarife · zwei Zeiträume/,'season rules explained in room dialog');
assert.match(src,/const tariffUnchanged=Boolean/,'unchanged reservation uses stored price');
assert.match(css,/\.tariff-section>summary/,'tariff accordion has compact tablet styling');
assert.match(css,/\.meal-price-settings \.price-fields/,'board supplements are grouped in settings');
assert.match(src,/function showRoomTariff\(id\)/,'room-specific tariff preview exists');
assert.match(src,/btn\('Tarif prüfen','roomTariff'/,'room list opens its tariff preview');
assert.match(src,/Gespeicherter Preis/,'booking preview marks saved quote');
assert.match(css,/\.room-row-actions/,'room tariff actions are compact');
assert.match(src,/function touristTaxSettings\(h\)/,'hotel tourist tax configuration exists');
assert.match(src,/taxExemptAdults','Kurtaxenbefreite Erwachsene/,'adult visitor tax exemptions are configurable');
assert.match(src,/Kurtaxe \/ Gästetaxe/,'tourist tax appears on the invoice');
console.log('Tablet UI, guest fields, SVG buttons, email templates and preview controls: OK');

assert.match(src,/class="sidebar-section"/,'expandable sidebar sections');
assert.match(src,/class="more-menu-grid"/,'mobile grouped navigation');
assert.match(css,/\.more-menu-grid/,'responsive mobile menu');
assert.match(src,/size=12,total=Math\.max/,'management list page size');
assert.match(src,/function listFilterControls\(k\)/,'schema-driven filters');
assert.match(src,/data-list-filter/,'filter controls connected');
assert.match(src,/Einträge suchen und filtern/,'SVG search dialog');
assert.match(css,/\.list-filters/,'responsive filter layout');

assert.match(src,/function editorTabs\(k\)/);
assert.match(css,/\.editor-tab-panel\[hidden\]/);
assert.match(src,/dataset\.initialValues=JSON\.stringify/);
assert.match(src,/schema\[0\]\+' gespeichert'\);close\(true\)/);
const closeStart=src.indexOf('function close(force=false)');
const closeEnd=src.indexOf('function stayBack()',closeStart);
assert.ok(closeStart>=0&&closeEnd>closeStart);
const overlay={hidden:false},form={dataset:{initialValues:JSON.stringify([['room','101']])}};
let values=[['room','101']],answer=false,prompts=0;
const closeContext=vm.createContext({$:id=>id==='editor'?form:overlay,FormData:class{entries(){return values[Symbol.iterator]()}},confirm:()=>{prompts++;return answer}});
vm.runInContext(src.slice(closeStart,closeEnd),closeContext);
assert.equal(closeContext.close(),true);
assert.equal(prompts,0);
overlay.hidden=false;values=[['room','102']];
assert.equal(closeContext.close(),false);
assert.equal(overlay.hidden,false);
answer=true;
assert.equal(closeContext.close(),true);
assert.equal(overlay.hidden,true);
overlay.hidden=false;answer=false;
assert.equal(closeContext.close(true),true);
assert.equal(prompts,2);
console.log('Tabbed editor and unsaved changes regression checks: OK');

assert.match(src,/function calendarDetail\(b\)/,'calendar detail view exists');
assert.match(src,/calendar-detail-tabs/,'calendar detail has separate tabs');
assert.match(src,/\['Aufenthalt',\[/,'calendar detail separates stay');
assert.match(src,/\['Gäste',\[/,'calendar detail separates guests');
assert.match(src,/\['Verpflegung',\[/,'calendar detail separates meals');
assert.match(src,/\['Finanzen',\[/,'calendar detail separates payments');
assert.match(src,/aria-selected/,'calendar tabs expose selection');
assert.match(src,/e\.key==='ArrowRight'/,'calendar tabs support keyboard navigation');
assert.match(css,/\.calendar-detail \[role="tabpanel"\]\[hidden\]/,'inactive calendar detail panels are not visible');

assert.match(src,/function editorTabIcon\(title\)/,'dedicated tab icons');
assert.match(src,/editorTabIcon\(title\)/,'editor tabs use semantic icons');
assert.match(src,/editorTabIcon\(name\)/,'calendar tabs use semantic icons');
assert.match(src,/raw\.tabIndex=-1/,'technical meal field excluded from keyboard navigation');

// Swiss display formatting must not mutate stored ISO dates.
const swissDateContext=vm.createContext({});
vm.runInContext(src.slice(src.indexOf('function swissDate('),src.indexOf('function localDate(')),swissDateContext);
assert.equal(swissDateContext.swissDate('2026-11-26'),'26.11.2026');
assert.equal(swissDateContext.swissDate('2028-02-29'),'29.02.2028');
assert.equal(swissDateContext.swissDate(''),'–');

assert.match(src,/function openCalendarReservation\(room,day\)/,'shared calendar reservation entry');
assert.ok(src.includes("edit('bookings','',preset)"),'tablet reservation preserves calendar selection');
assert.match(src,/listFilters\[key\]==='Nicht zugeteilt'/,'housekeeping supports unassigned tasks');
assert.match(src,/a\.dueDate\|\|'9999-12-31'/,'housekeeping orders dated tasks before undated tasks');

 // Exercise multipage preview zoom without an Android device.
 const zoomPages=[{style:{}},{style:{}}],zoomMinus={},zoomPlus={},zoomReset={textContent:'',querySelector:()=>null,setAttribute(){}};
 const zoomMain={querySelectorAll:()=>zoomPages,querySelector:s=>s.includes('Reset')?zoomReset:s.includes('Out')?zoomMinus:zoomPlus};
 const zoomContext=vm.createContext({$:()=>zoomMain,documentZoom:100});
 vm.runInContext(src.slice(src.indexOf('function changeDocumentZoom('),src.indexOf('function documentClose(')),zoomContext);
 zoomContext.changeDocumentZoom(200);
 assert.equal(zoomPages[0].style.zoom,'2');
 assert.equal(zoomPages[1].style.zoom,'2');
 assert.equal(zoomPlus.disabled,true);
 zoomContext.changeDocumentZoom(-200);
 assert.equal(zoomMinus.disabled,true);
 assert.equal(zoomPages[1].style.zoom,'0.5');
 zoomContext.changeDocumentZoom(0);
 assert.equal(zoomReset.textContent,'100 %');
 assert.equal(zoomMinus.disabled,false);
 assert.equal(zoomPlus.disabled,false);

 // Premium finance: exercise real import and period-lock helpers.
 const financeContext=vm.createContext({storageReadFailed:false,db:{accounts:[{id:'existing',number:'1000',name:'Eigene Kasse'}],hotel:{financeLockedThrough:''}},uid:(()=>{let i=0;return ()=>String(++i)})(),confirm:()=>true,alert:()=>{},save:()=>{},render:()=>{},today:()=> '2026-11-26',swissDate:v=>v,prompt:()=> '2026-10-31',log:()=>{}});
 vm.runInContext(src.slice(src.indexOf('const HOTEL_ACCOUNT_TEMPLATE='),src.indexOf('function accountLedger(')),financeContext);
 let persisted='',preview='',notice='';
 financeContext.dialog=v=>{preview=v};
 financeContext.btn=(label,action)=>label+' '+action;
 financeContext.close=()=>{};
 financeContext.alert=v=>{notice=v};
 financeContext.save=()=>{persisted=JSON.stringify(financeContext.db)};
 financeContext.localStorage={getItem:()=>persisted};
 const importButton={disabled:false},importStatus={textContent:''};
 financeContext.$=id=>id==='account-import-save'?importButton:importStatus;
 financeContext.importHotelAccounts();
 assert.match(preview,/Alle Konten speichern/);
 assert.equal(financeContext.db.accounts.length,1);
 assert.equal(typeof importButton.onclick,'function');
 importButton.onclick();
 assert.equal(financeContext.db.accounts.length,45);
 assert.equal(JSON.parse(persisted).accounts.length,45);
 assert.match(notice,/44 neue Konten gespeichert\. Insgesamt 45 Konten vorhanden\./);
 assert.equal(financeContext.db.accounts[0].name,'Eigene Kasse');
 financeContext.confirmHotelAccounts();
 assert.equal(financeContext.db.accounts.length,45);
 assert.match(notice,/0 neue Konten gespeichert\. Insgesamt 45 Konten vorhanden\./);
 financeContext.localStorage.getItem=()=>JSON.stringify({accounts:[]});
 assert.throws(()=>financeContext.confirmHotelAccounts(),/Speicher gelesen/);
 financeContext.localStorage.getItem=()=>persisted;
 vm.runInContext(src.slice(src.indexOf('function lockFinancePeriod('),src.indexOf('function trialBalance(')),financeContext);
 financeContext.confirm=()=>true;
 financeContext.lockFinancePeriod();
 assert.equal(financeContext.db.hotel.financeLockedThrough,'2026-10-31');
 assert.throws(()=>financeContext.lockFinancePeriod(),/Abschlussdatum/);
 assert.match(src,/n\.date<=db\.hotel\.financeLockedThrough/);

const manifest=fs.readFileSync('app/src/main/AndroidManifest.xml','utf8');
assert.match(manifest,/android:screenOrientation="sensorLandscape"/);
assert.doesNotMatch(src,/window\.innerWidth<800/,'no mobile route switching');
const groups=JSON.parse(src.match(/const navGroups=(\[.*?\]);const sideIcons=/)[1]);
assert.equal(groups.length,9);
assert.deepEqual(groups.find(g=>g[0]==='VERWALTUNG & STAMMDATEN')[1],['settings','masterData','documents','pdfLayouts','templates']);
assert.deepEqual(groups.find(g=>g[0]==='SYSTEM & SUPPORT')[1],['backup','logs','help','about']);
const links=groups.flatMap(g=>g[1]);
assert.equal(new Set(links).size,links.length,'unique sidebar destinations');
for(const key of ['employees','accounts','journal','recipes','menus','stockItems','purchaseOrders'])assert.ok(links.includes(key),key);

// Hotel KPI regression: exclusive end, cancelled bookings, zero capacity.
const hotelKpiContext=vm.createContext({db:{rooms:[{id:'r1'},{id:'r2'}],bookings:[{room:'r1',arrival:'2026-11-01',departure:'2026-11-03',status:'Bestätigt',priceSnapshot:{lodging:200}},{room:'r2',arrival:'2026-11-02',departure:'2026-11-03',status:'Storniert',rate:100}]},nights:b=>(Date.parse(b.departure)-Date.parse(b.arrival))/86400000,get:()=>({rate:100})});
vm.runInContext(src.slice(src.indexOf('function premiumHotelMetrics('),src.indexOf('function premiumHotelReport(')),hotelKpiContext);
const hotelKpi=hotelKpiContext.premiumHotelMetrics('2026-11-01','2026-11-03');
assert.equal(hotelKpi.occupied,2);
assert.equal(hotelKpi.available,4);
assert.equal(hotelKpi.adr,100);
assert.equal(hotelKpi.revpar,50);
assert.equal(hotelKpi.occupancy,50);
assert.equal(hotelKpi.arrivals,1);
assert.equal(hotelKpi.departures,0);
assert.throws(()=>hotelKpiContext.premiumHotelMetrics('2026-11-03','2026-11-03'));
hotelKpiContext.db.rooms=[];hotelKpiContext.db.bookings=[];
assert.equal(hotelKpiContext.premiumHotelMetrics('2026-11-01','2026-11-03').revpar,0);

// Unified pages: no generic overview/workspace gate in the active renderer.
const unifiedRender=src.slice(src.indexOf('function render(){'),src.indexOf(" $('main').innerHTML=body")>=0?src.indexOf(" $('main').innerHTML=body"):src.indexOf("$('main').innerHTML=body"));
assert.ok(unifiedRender.length>1000);
assert.doesNotMatch(unifiedRender,/btn\('Arbeitsbereich(?: öffnen)?','tab'/);
assert.doesNotMatch(unifiedRender,/btn\('Übersicht','tab'/);
assert.doesNotMatch(unifiedRender,/if\(tab==='work'\)/);
assert.match(unifiedRender,/if\(schemas\[page\]\)\{body\+=card\(/);
assert.match(unifiedRender,/id="results"/);
assert.match(css,/\.actions\.master-type-tabs\{[^}]*flex-wrap:nowrap/);


// Tablet-only product copy and live navigation must stay aligned with the
// unified-page design. Historical SVG mockups are not invoked by render().
assert.match(src,/Optimiert ausschliesslich für Android-Tablets im Querformat\./);
assert.doesNotMatch(src,/Für Smartphones und Tablets\./);
assert.match(src,/function navigate\(p\)\{page=p;query='';listPage=1;listFilters=\{\};render\(\)\}/);
const liveRender=src.slice(src.indexOf('function render(){'),src.indexOf("document.addEventListener('click'",src.indexOf('function render(){')));
assert.match(liveRender,/if\(schemas\[page\]\)\{body\+=card\(/,'management renders KPIs, filters and list on same page');
assert.match(liveRender,/else if\(page==='reception'\)/,'reception uses a unified live table');
for(const legacy of ['renderDashboard();','renderReferenceList();','renderReception();','renderCalendarReference();'])
 assert.ok(!liveRender.includes(legacy),'obsolete split SVG renderer is not called: '+legacy);
assert.match(src,/Die verfügbaren Berichte und Vorlagen vor Verwendung als Vorschau prüfen/);
assert.match(src,/QR-Zahlungen und Finanzabschlüsse benötigen vor produktiver Verwendung eine fachliche Prüfung/);
console.log('Tablet-only copy and unified live-page regression checks: OK');

assert.match(css,/main \.actions:not\(\.master-type-tabs\):not\(\.settings-tabs\)>button\{[^}]*min-height:34px;padding:6px 10px/);

 // Scoped reservation and adaptive KPI layout regression.
 assert.ok(src.includes("(page==='bookings'?' reservation-metrics':'')"));
 assert.match(css,/\.metrics\.reservation-metrics\{[^}]*grid-template-columns:repeat\(6,minmax\(0,1fr\)\)/);
 for(const n of [2,3]){
   assert.ok(css.includes(':not(.reservation-metrics):has(>.card:nth-child('+n+'):last-child){grid-template-columns:repeat('+n+',minmax(0,1fr))}'));
 }
 assert.ok(css.includes(':not(.reservation-metrics):has(>.card:only-child){grid-template-columns:minmax(0,1fr)}'));
 console.log('Scoped and adaptive KPI layout checks: OK');

// Main navigation uses the app header as the sole page title.
assert.match(unifiedRender,/let body='';/);
assert.doesNotMatch(unifiedRender,/btn\('Zurück','go','dashboard'/);
assert.doesNotMatch(unifiedRender,/<h2>Check-in \/ Check-out<\/h2>|<h2>Tagesübersicht<\/h2>/);

// Quick actions remain on the dashboard, not on management pages.
assert.doesNotMatch(unifiedRender,/<h2>Schnellzugriffe<\/h2>/);
const dashboardBranch=unifiedRender.slice(unifiedRender.indexOf("else if(page==='dashboard')"),unifiedRender.indexOf("else if(page==='reception')"));
assert.ok(dashboardBranch.includes("btn('Neue Reservation','edit','bookings','primary')"));
assert.ok(dashboardBranch.includes("btn('Tagesabschluss','documentPreview','tagesabschluss')"));

 // Native WebView must support confirmation dialogs used by destructive actions.
 const nativeActivity=fs.readFileSync('app/src/main/java/ch/swisstech/stay/MainActivity.java','utf8');
 assert.match(nativeActivity,/web\.setWebChromeClient\(new WebChromeClient\(\)\)/);
 {
  const overlay={hidden:false},form={dataset:{initialValues:'[["name","old"]]'}};
  let allow=false,asked=0;
  const ctx=vm.createContext({$:id=>id==='overlay'?overlay:form,FormData:class{entries(){return [['name','new']]}},confirm:()=>{asked++;return allow}});
  const start=src.indexOf('function close(force=false)');
  const stop=src.indexOf('\nfunction stayBack',start);
  assert.ok(start>=0&&stop>start);
  vm.runInContext(src.slice(start,stop),ctx);
  assert.equal(ctx.close(),false);
  assert.equal(overlay.hidden,false);
  allow=true;
  assert.equal(ctx.close(),true);
  assert.equal(overlay.hidden,true);
  assert.equal(asked,2);
  overlay.hidden=false;
  assert.equal(ctx.close(true),true);
  assert.equal(asked,2);
 }


// Offline help: every existing topic has its own real three-step guide.
{
 const guideBegin=src.indexOf('const HELP_GUIDES=');
 const guideEnd=src.indexOf(';\nfunction helpPage()',guideBegin);
 assert.ok(guideBegin>=0&&guideEnd>guideBegin,'help guide registry exists');
 const guides=JSON.parse(src.slice(guideBegin+'const HELP_GUIDES='.length,guideEnd));
 const sectionBegin=src.indexOf('const HELP_SECTIONS=');
 const sectionEnd=src.indexOf(';\n\n/* Report centre',sectionBegin);
 assert.ok(sectionBegin>=0&&sectionEnd>sectionBegin);
 const sections=JSON.parse(src.slice(sectionBegin+'const HELP_SECTIONS='.length,sectionEnd));
 const extraBegin=src.indexOf('const HELP_EXTRA=');
 const extraEnd=src.indexOf(';\nconst HELP_GUIDES=',extraBegin);
 assert.ok(extraBegin>=0&&extraEnd>extraBegin);
 const extras=JSON.parse(src.slice(extraBegin+'const HELP_EXTRA='.length,extraEnd));
 assert.equal(sections.length+extras.length,27);
 for(const [topic] of sections.concat(extras)){
  assert.ok(Array.isArray(guides[topic]),'missing help topic: '+topic);
  assert.equal(guides[topic].length,3,'three steps required for '+topic);
  assert.ok(guides[topic].every(step=>step.trim().length>12));
 }
 assert.match(src,/class="help-steps"/);
 assert.match(src,/id="help-columns"/);
 assert.match(src,/id="help-open-all"/);
 assert.match(src,/id="help-close-all"/);
 assert.match(css,/\.help-manual \.help-tabs>button\{[^}]*min-height:44px/);
 assert.match(css,/\.help-manual #help-columns details\.card\{/);
}
// SVG decorator inserts once, always before the text, and does not replace handlers.
{
 const start=src.indexOf('function helpIcon(kind)');
 const end=src.indexOf('\nfunction bindHelpCenter()',start);
 assert.ok(start>=0&&end>start);
 const ctx=vm.createContext({});
 vm.runInContext(src.slice(start,end),ctx);
 const pdf=ctx.helpIcon('pdf');
 assert.match(pdf,/^<svg class="leading-svg" width="18" height="18"/);
 assert.match(pdf,/aria-hidden="true"/);
 let inserts=0,added='';
 const button={
   matches:()=>true,querySelectorAll:()=>[],querySelector:()=>inserts?{}:null,
   closest:()=>false,textContent:'PDF drucken',dataset:{},classList:{add:v=>{added=v}},
   insertAdjacentHTML:(where,markup)=>{assert.equal(where,'afterbegin');assert.match(markup,/leading-svg/);inserts++}
 };
 ctx.decorateTextButtons(button);
 ctx.decorateTextButtons(button);
 assert.equal(inserts,1,'no duplicate SVG icons');
 assert.equal(added,'icon-leading-button');
 assert.match(css,/button\.icon-leading-button\{[^}]*gap:8px;min-height:44px/);
}
// Annual payroll export retains validated original controls and sticky footer.
assert.match(src,/className='wage-certificate-footer'/);
assert.match(src,/id="wage-review"/);
assert.match(src,/footer\.appendChild\(exportAction\)/);
assert.match(src,/const groups=\['Übersicht','Personaldaten','Lohn','Abzüge','Spesen','PDF'\]/);
assert.match(src,/showTab\(5\);feedback\.textContent='PDF lokal gespeichert:/);
assert.match(src,/panels\[5\]\.appendChild\(p\)/);
assert.match(src,/Stay\.openOriginalWageCertificate\(\)/);
assert.match(css,/\.annual-payroll-dialog \.wage-certificate-footer\{[^}]*position:static!important/);
assert.match(css,/\.annual-payroll-dialog \.annual-tab-panel\[hidden\]\{display:none!important\}/);
console.log('Offline help, leading SVGs and annual payroll action regression checks: OK');
