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

## Weitere Lücken
- [ ] Exakte Zuordnung sämtlicher SVG-Buttonaktionen inkl. Dialoge, Filter, Tabellen, Pagination
- [ ] PDF-Renderer je Berichtstyp mit realen Datensätzen, Druckvorschau und Export
- [ ] PDF-Vorlageneditor und PDF-Einstellungen
- [ ] Native PDF-Dateispeicherung bzw. Android-Teilen inkl. lesbaren Dateinamen
- [ ] E-Mail-Anhänge als tatsächliche PDFs
- [ ] Länderauswahl vervollständigen und regulatorische Datenvalidierung prüfen
- [x] SwissTech.im-Logo aus dem Anhang als lokales komprimiertes SVG-Bildasset in die Über-Seite integrieren (optische Prüfung auf Gerät offen)
- [ ] Visueller Mockup-Vergleich für alle Seiten
- [ ] Fertige signierte Release-APK nach bestandenen Tests

Hinweis: Der aktuelle QR-Zahlteil ist ausdrücklich als Testentwurf gekennzeichnet, nicht als offiziell verwendbare Schweizer QR-Rechnung.
