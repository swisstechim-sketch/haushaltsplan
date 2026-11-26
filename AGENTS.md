# STAY Swiss – Regelwerk und Chat-Übergabe
Stand: 26.11.2026
## Arbeitsweise
- Aktiver Entwicklungsbranch: fix/form-select-consistency-20261126. Vor Änderungen aktuellen Stand, offene PRs und letzte Builds prüfen. Keine unaufgeforderten Merges.
- Bestehende Arbeitsaufträge tatsächlich programmieren, möglichst mehrere pro Durchgang. Keine unnötige Funktionserweiterung. Keine Tests deaktivieren oder Fehler verschleiern.
- Status unterscheiden: offen, programmiert, automatisiert geprüft, Live-Test bestanden. Nur nach erfolgreichen Build-, Emulator- und Release-Jobs aktuelle signierte APK zur LDPlayer-Abnahme freigeben.
- Bei Fehlern Logs prüfen, Ursache beheben, Regressionstest ergänzen. Bestehende Daten und Funktionen erhalten; Migrationen ohne Datenlöschung. Keine Deinstallation oder Datenlöschung als Standardlösung.
## Design
- Verbindliche Zielplattform: ausschliesslich Android-Tablets im Querformat (sensorLandscape). Kein Hochformat und keine Smartphone-Layouts entwickeln oder als Abnahmekriterium verlangen. Bestehende Daten und Funktionen bleiben erhalten. Alle Übersicht- und Arbeitsbereich-Tabs, Dialoge und Datum-/Uhrzeitpicker im Tablet-Querformat prüfen.
- Helles Apple-Premium-Design, Weiss, Hellgrau, Hellblau, dunkle Texte. Original-Header, Sitepanel und Logos erhalten; keine überdeckten Inhalte.
- Buttons und Tabs einzeilig, passende SVG-Icons 18 px, Abstand 8 px, mittig ausgerichtet, mindestens 44 px Bedienhöhe. Keine sichtbaren horizontalen Seiten-Scrollbalken; Tab-Leiste bei Bedarf wischbar.
- Formulare im Tablet-Querformat grundsätzlich 3 Spalten; Auswahlfelder wo sinnvoll. Erweiterte Filter einklappbar. Tabellen kompakt, Aktionen rechts, 12 Einträge je Seite.
- Hilfe: thematische Tabs, je Tab zwei unabhängige Accordion-Spalten; Suche über alle Themen, alle öffnen/schliessen, direkte Modulnavigation, offline. Vollständige Anleitungen für tatsächlich vorhandene Funktionen.
- Housekeeping, Wartung, Fundgegenstände, Schichtübergabe: kompakte Tabellen im Tablet-Querformat, Kennzahlen, Statusfarben, Filter.
- Personal: Zulagen/Abzüge getrennte Accordions, vier je Typ, CHF/Prozent, Basis und Gültigkeit erhalten.
## Fachliche Anforderungen
- Schweiz: L-GAV, AHV/IV/EO/ALV, BVG/BU/NBU/KTG, historische Gültigkeit, Arbeitgeberbeiträge, Quellensteuer manuell gepflegte amtliche Tarife, keine Tarifimporte.
- Amtlicher ESTV Lohnausweis Formular 11: Original-PDF offline, automatisch befüllt, manuell editierbar, lokal speichern und teilen. Originaldatei und fachliche Validierung noch zu prüfen.
- Doppelte Buchhaltung, automatische Buchungen, Kontenplan, MWST-Abstimmung, Saldenliste, Bilanz/Erfolg, Jahresabschluss, PDF-Vorlagen. Keine produktive fachliche Freigabe ohne Validierung.
## Offene Abnahme
- SQLite Schema v3: zusätzliche Module dauerhaft speichern, Migration und native Regressionstests prüfen. Kontenimport 45 Konten, Neustart, erneuter Import ohne Duplikate.
- Hilfe-Center programmiert, vollständige Texte und Tests offen. Housekeeping-Design, Personal-Accordion, Finanzdialoge, Header-Überdeckung und fehlende Icons offen bzw. erneut prüfen.
- Historische Buildfehler nicht als aktuellen Status übernehmen. Neueste Builds und Logs vor weiterer Arbeit prüfen. Globale Uhrzeitauswahl inklusive Pflichtfelder, Abbrechen und Übernehmen testen.
- Abschliessender LDPlayer-Live-Test durch Nutzer: Installation als Update, Offline-Betrieb, Neustart, Datenpersistenz, sämtliche Module, PDFs, Backup/Restore, Tablet-Querformat.
## Neuer Chat
Dieses Regelwerk zuerst lesen, dann aktuellen Entwicklungsbranch und GitHub Actions prüfen. Nicht von historischen Statusangaben auf aktuelle Funktionsfähigkeit schliessen. Bis zur Live-Test-Bereitschaft bestehende Aufträge abarbeiten und konkrete Commits sowie verbleibende Blocker nennen.
