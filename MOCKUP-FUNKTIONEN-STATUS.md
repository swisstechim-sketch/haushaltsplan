# STAY Swiss – Mockup-Abgleich und Funktionslücken

Stand: 25.11.2026. Quelle: Original-SVG-Dateien unter `mockups/` sowie bestehende App-Implementierung in `app/src/main/assets/app.js`. Eine vorhandene SVG-Vorlage bedeutet **nicht**, dass ihre Funktion bereits implementiert ist.

## Abnahmebedingungen
- Tablet-Querformat und Hochformat: keine überlagerten Menüs, kein übergrosser Smartphone-Header, alle Klickziele erreichbar
- Jede Schaltfläche im Mockup muss eine funktionierende Aktion haben oder sichtbar als noch nicht verfügbar markiert sein
- Originalgetreue PDF-Ausgabe auf A4, korrekt mit gespeicherten Daten und unabhängig von der Bildschirmgrösse
- Kein Versand von E-Mails ohne Bestätigung in der Mail-App, keine ungeprüften Swiss-QR-Zahlteile als produktiv freigeben
- Bestehende lokale Datensätze müssen bei Updates erhalten bleiben
- Abnahme erst nach erfolgreichen Unit-, Emulator- und visuellen LDPlayer-Tests

## Umgesetzt im aktuellen Pull Request (Codeänderung, Geräteprüfung offen)
- [x] Tablet-Header und gruppierte Navigationsleiste statt riesigem Smartphone-Header
- [x] «Mehr» nicht in der separaten Tablet-Seitenleiste
- [x] SVG-Aktionssymbole links vom Text, vereinheitlichte Button-Abstände
- [x] Gäste: strukturierte Adresse, Land, Geburtsdatum, Ausweisdokument
- [x] Hotelprofil: strukturierte Adresse ohne zweite Adresseingabe
- [x] E-Mail-Vorlagen: 13 editierbare Vorlagen, Vorschau und nativer Mail-Composer
- [x] Schliessen-Knopf in den wichtigsten bisherigen Dokumentansichten
- [x] Hilfe und Über STAY Swiss inklusive Unterstützen-Link und Copyrighttext

## Tablet-Mockups – systematischer Abgleich
| Referenz | Mindestens zu prüfen/ergänzen | Status |
|---|---|---|
| `tablet/querformat/dashboard.svg` | Tageskennzahlen, An-/Abreisen, Schnellaktionen, Suchleiste, Header-Aktionen | Teilweise |
| `tablet/querformat/zimmerkalender.svg` | Tages-/Wochen-/Monatsansichten, Zimmeraktionen, Filter, Reservation aus Kalender | Offen |
| `tablet/querformat/reservationen.svg` | Buchungserfassung, Filter, Details, Statusaktionen, Export | Teilweise |
| `tablet/querformat/gasteverwaltung.svg` | Gastprofile, Historie, Rechnungen, Filter, Export, Dokumente | Teilweise |
| `tablet/querformat/check-in-check-out.svg` | Anreisen, Abreisen, im Haus, erledigt, Aktion pro Buchung, PDF/CSV/E-Mail | Teilweise |
| `tablet/querformat/housekeeping.svg` | Aufgaben, Zimmerstatus, Arbeitszuweisung, Berichte | Offen |
| `tablet/querformat/gastronomie.svg` | Mahlzeiten, Verpflegungspläne, Listen, Aktionen | Teilweise |
| `tablet/querformat/rechnungsverwaltung.svg` | Rechnungspositionen, Gutschriften, Mahnungen, offene Posten, Belege | Teilweise |
| `tablet/querformat/auswertungen.svg` | Zeitfilter, Kennzahlen, sämtliche Berichtsarten | Offen |
| `tablet/querformat/einstellungen.svg` | Hotelprofil, Stammdaten, Konfiguration, Rechte, Vorlagen | Teilweise |
| `tablet/querformat/pdf-betrachter.svg` | Original-PDF-Vorschau, Zoom, Seitenwechsel, Schliessen, Download, Druck | Offen |

Auch jedes entsprechende `tablet/hochformat/*.svg` sowie die Smartphone-Mockups separat visuell abgleichen.

## PDF-Mockups – bisher keine vollständige 1:1-Implementierung
### Reservationen und Gäste
- [ ] `buchungsbestaetigung.svg`
- [ ] `reservationsanderung.svg`
- [ ] `reservationsofferte.svg`
- [ ] `stornierungsbestatigung.svg`
- [ ] `anreiseinformationen.svg`
- [ ] `gruppenreservation.svg`
- [ ] `gastemeldeformular.svg`
- [ ] `in-house-gasteliste.svg`
- [ ] `gasteherkunft.svg`
- [ ] `gastewunsche.svg`
- [ ] `checkin-checkout-tagesliste.svg`
- [ ] `aufenthaltsplan.svg`

### Rechnung und Finanzen
- [ ] `rechnung.svg`
- [ ] `anzahlungsrechnung.svg`
- [ ] `qr-rechnung.svg`
- [ ] `zahlungsquittung.svg`
- [ ] `zahlungserinnerung.svg`
- [ ] `erste-mahnung.svg`
- [ ] `zweite-mahnung.svg`
- [ ] `letzte_mahnung.svg` (Dateiname im Repository: `letzte-mahnung.svg`)
- [ ] `gutschrift.svg`
- [ ] `ruckerstattungsbeleg.svg`
- [ ] `offene-posten.svg`
- [ ] `kassenbericht.svg`
- [ ] `tagesabschluss.svg`
- [ ] `monatsabschluss.svg`
- [ ] `jahresabschluss.svg`
- [ ] `mwst-auswertung.svg`
- [ ] `umsatz-nach-zahlungsarten.svg`
- [ ] `umsatz-nach-zimmerkategorien.svg`
- [ ] `auswertung.svg`

### Zimmer, Housekeeping, Gastronomie
- [ ] `freie-zimmer.svg`
- [ ] `zimmerstatusbericht.svg`
- [ ] `zimmerreinigungsplan.svg`
- [ ] `housekeeping-kontrollbericht.svg`
- [ ] `wartungsliste.svg`
- [ ] `fundgegenstande-protokoll.svg`
- [ ] `schichtubergabe.svg`
- [ ] `verpflegungsplan.svg`
- [ ] `wochenverpflegung.svg`
- [ ] `wochenbelegungsplan.svg`
- [ ] `monatsbelegungsplan.svg`
- [ ] `jahresbelegungsubersicht.svg`

## PDF-Berichtszentrum – neuer Zwischenstand

- [x] Alle 43 PDF-Mockup-Typen als Dokumentkatalog mit klarer Statusanzeige sichtbar
- [x] 12 datengesteuerte Listen-/Übersichtsberichte (Tagesliste Check-in/Check-out, In-house Gäste, Gästemeldeformular als Listenansicht, freie Zimmer, Zimmerstatus, Reinigungsplan, offene Posten, Zahlungen nach Zahlungsarten, Quittungsübersicht, Tagesübersicht, MWST-Übersicht, Reservationsübersicht)
- [x] Datumsauswahl, Schliessen, A4-Druckvorschau, CSV-Weitergabe für diese Übersichten
- [x] Berichtsregressionstests in Android CI
- [ ] Diese Listenberichte sind noch **keine** 1:1-Umsetzung der individuellen SVG-Dokumente. Einzelbelege wie Gästemeldeformular und Reservationsbestätigung brauchen jeweils eine dokumentbezogene Auswahl, Unterschrifts-/Adressfelder und Original-Layout
- [ ] 31 weitere individuelle Dokumentausgaben bleiben nicht verfügbar, werden im Katalog jedoch sichtbar als offen markiert

## Zusätzliche Umsetzung – 25.11.2026

- [x] Acht weitere datengesteuerte Berichtsübersichten: Gästeherkunft, Aufenthaltsplan, Verpflegungsplan, Wochenverpflegung, Wochenbelegungsplan, Umsatz nach Zimmerkategorie, Kassenbericht und Housekeeping-Kontrollbericht
- [x] Damit 20 verfügbare Berichtstypen im PDF-Katalog (kein Anspruch auf 1:1-Designparität)
- [x] Funktionale Tablet-Check-in-/Check-out-Ansicht mit Filter, Gast-/Zimmeranzeige und Statuswechsel-Aktion
- [x] Vollständige Android-ISO-Länderauswahl über Native Bridge; Browser-Fallback mit begrenzter Länderliste
- [ ] Weitere 23 Berichtstypen mit Original-Layout, vollständiger Fachlogik und Datenvalidierung umsetzen

## Weiterentwicklung – Belegung und Belege

- [x] Monatsbelegungsplan: Zimmernächte je Zimmer und Auslastungsquote aus gespeicherten Reservationen
- [x] Jahresbelegungsübersicht: zwölf Monatswerte und Jahresauslastung aus gespeicherten Zimmerdaten
- [x] Rechnung im Berichtszentrum: individuelle Rechnungsauswahl, Positionen, MWST, Zahlungen, Gutschriften und offener Betrag
- [x] Gutschrift im Berichtszentrum: individuelle gespeicherte Gutschrift mit Grund und Steueraufteilung
- [x] Direkte PDF-Aktionen aus Gästen, Reservationen, Zimmern, Housekeeping und Zahlungen
- [x] **24** datengesteuerte PDF-Berichtstypen von 43 Mockup-Dokumenten als Vorschau/Druck-Ausgabe
- [ ] **19** verbleibende Dokumenttypen und genaue visuelle Originalgestaltung
- [ ] Belegung berücksichtigt bei Zeitreihen nicht historisch wechselnde Zimmer-Sperr- und Reinigungsstatus; Auslastung als Planungswert deklarieren

## Weitere Dokumentfunktionen – 25.11.2026

- [x] Anreiseinformationen: Gast-, Hotel-, Zimmer- und Aufenthaltsdaten aus gespeicherter Reservation
- [x] Reservationsofferte: ausdrücklich unverbindlicher Entwurf aus Zimmerpreis × Nächten (ohne separat kalkulierte Zuschläge)
- [x] Stornierungsbestätigung: nur bei tatsächlich als storniert markierter Reservation; keine erfundenen Stornogebühren oder Erstattungen
- [x] Zahlungserinnerung: nur für offene Rechnungen, als nicht versendeter Entwurf gekennzeichnet
- [x] Monatsübersicht: Rechnungs- und Zahlungssummen nach Monat, **kein** geprüfter buchhalterischer Monatsabschluss
- [x] Insgesamt 29 von 43 Dokumenttypen als dynamische Berichtsausgabe verfügbar
- [ ] 14 Dokumenttypen fehlen weiterhin; individuelle PDF-Designparität und vollständige Fachlogik bleiben gesonderte Abnahmepunkte

## Layoutkorrekturen – neue Screenshots

- [x] SwissTech.im-Logo als echtes SVG mit Vektorformen, ohne eingebettetes JPEG; Copyright-Layout responsiv
- [x] «Über STAY Swiss»: Support- und Hilfe-Button gleich hoch und in einer Zeile
- [x] Vertikale Button-Abstände oben und unten auf Aktionsebenen vereinheitlicht
- [x] Tablet Check-in / Check-out: tabellarische Ansicht mit Mockup-Spalten und rechtsbündigen Aktionen
- [x] 32 von 43 Dokumenttypen haben eine datengesteuerte Ausgabe (11 weiterhin offen)
- [ ] Visuelle Pixel-/Geräteprüfung der geänderten SVG-Darstellung, Button-Abstände und Tabellen in LDPlayer
- [ ] Alle noch offenen Mockup-Aktionen und exakte PDF-Layoutparität

## Weitere Lücken
- [ ] Exakte Zuordnung sämtlicher SVG-Buttonaktionen inkl. Dialoge, Filter, Tabellen, Pagination
- [ ] PDF-Renderer je Berichtstyp mit realen Datensätzen, Druckvorschau und Export
- [ ] PDF-Vorlageneditor und PDF-Einstellungen
- [ ] Native PDF-Dateispeicherung bzw. Android-Teilen inkl. lesbaren Dateinamen
- [ ] E-Mail-Anhänge als tatsächliche PDFs
- [x] Alle von Android/ISO unterstützten Länder über native Länderliste anbieten (Browser-Fallback weiterhin verkürzt)
- [ ] Regulatorische Datenvalidierung und länderspezifische Meldepflichten prüfen
- [x] SwissTech.im-Logo aus dem Anhang als lokales komprimiertes SVG-Bildasset in die Über-Seite integrieren (optische Prüfung auf Gerät offen)
- [ ] Visueller Mockup-Vergleich für alle Seiten
- [ ] Fertige signierte Release-APK nach bestandenen Tests

Hinweis: Der aktuelle QR-Zahlteil ist ausdrücklich als Testentwurf gekennzeichnet, nicht als offiziell verwendbare Schweizer QR-Rechnung.
