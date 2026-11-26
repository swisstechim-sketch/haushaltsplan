# STAY Swiss – laufender Projektstatus
Stand: 26.11.2026. Entwicklungsbranch: fix/form-select-consistency-20261126.
Status: OFFEN / TEILWEISE / PROGRAMMIERT / CI BESTANDEN / LIVE ABGENOMMEN. Keine fachliche Freigabe allein aufgrund eines Builds.

| Bereich / Aufgabe | Status | Nachweis / nächste Aktion |
|---|---|---|
| Lohnentwürfe löschen | CI BESTANDEN | f7c4e22, Build 520; Live-Test offen |
| 13. Monatslohn monatlich | CI BESTANDEN | 47a40e3; Build 521 erfolgreich; Fachregression offen |
| Separate Auszahlung / Austritt / Restanspruch / Doppelzahlungsschutz | TEILWEISE | 0fabe4d: neuer zweiter Monatsentwurf gesperrt; CI offen. Separate Auszahlung, Austritt, Auszahlungshistorie und legitime Korrektur-/Zusatzabrechnungen offen. |
| Sozialversicherungen / Quellensteuer / Arbeitgeberanteile | TEILWEISE | Tarife, Grundlagen, BU-Arbeitgeberpflicht und Grenzfälle fachlich prüfen |
| L-GAV Arbeitszeit, Ferien, Krankheit, Unfall, Überstunden | TEILWEISE | Fachliche Validierung und fehlende Berechnungen |
| Lohnbuchungen mit Gegenkonten | TEILWEISE | Aufteilung und Abstimmung |
| ESTV Formular 11 | TEILWEISE | Kontrollentwurf vorhanden; amtliches Original fehlt |
| Doppelte Buchhaltung, Rechnungen, Kreditoren, Debitoren | TEILWEISE | Abschlussprüfung |
| MWST, Bilanz, Erfolgsrechnung, Jahresabschluss | TEILWEISE | Fachprüfung und Abschlusslogik |
| QR-Rechnungen, Mahnungen, Gutschriften | TEILWEISE | Abschlussprüfung |
| Reservationen, Check-in/out, Zimmer, Housekeeping | TEILWEISE | Abschlussprüfung |
| Rezepte, Verbrauch, Lager, Bestellungen | TEILWEISE | Abschlussprüfung |
| ADR/RevPAR, Hotelstatistik | TEILWEISE | Fachprüfung |
| PDF-Vorlagen, Berichte, lokale Ausgabe | TEILWEISE | Editor vervollständigen und prüfen |
| Tablet-Querformat, SVG-Abgleich, Icons, Formulare, Filter | TEILWEISE | Alle Seiten prüfen |
| Offline-Hilfe | TEILWEISE | Vollständigkeit prüfen |
| SQLite, Migration, Backup/Restore | TEILWEISE | Persistenz und Wiederherstellung abschliessend testen |
| Regression, signierte APK, LDPlayer | TEILWEISE | Build 519 erfolgreich; neuere Änderungen separat prüfen |

## Arbeitsregel
Bei jeder Änderung diese Datei im Repository-Hauptverzeichnis aktualisieren: Commit, Testnachweis, verbleibende Aufgaben. Keine neuen Module, keine ungefragten Merges. Live-Abnahme nur mit eindeutig zugeordnetem APK-Build und bestätigtem Test. Bestehende Daten schützen. Finanz- und Lohnfunktionen erst nach fachlicher Validierung produktiv freigeben.

## Arbeitsdurchgang
- 0fabe4d: vorläufiger Schutz gegen doppelte Monatsentwürfe pro Mitarbeiter. Keine Datenmigration. Regression und fachliche Prüfung offen; mehrere legitime Abrechnungen pro Monat benötigen später eine explizite Korrektur-/Zusatzlogik.

- 78eecf4: Jahresübersicht zeigt Anspruch, vorgesehene Auszahlung und Differenz des 13. Monatslohns aus gespeicherten Entwürfen; fehlende Altdaten werden ausgewiesen. Keine tatsächliche Zahlungsbestätigung. Separate Auszahlung, Austritt, Zahlungsabgleich und Regression bleiben offen.

- Buildkontrolle: 521 erfolgreich, 522 fehlgeschlagen, 523 erfolgreich (78eecf4). Ursache 522 noch nicht geprüft; fachliche Regression und Live-Abnahme offen. PR 2 offen und mergeable; kein Merge.

- a5bc827 / 15509ce: Berechnungsgrundlage für separate 13.-Monatslohn-Entwürfe ergänzt; Restanspruch in Rappen, Schutz vor Überzahlung, doppelten IDs und fehlenden historischen Anspruchsdaten. Regressionstests ergänzt, Ausführung/CI noch nicht bestätigt. UI-Anbindung, Austrittsabrechnung inklusive nachträglicher Auszahlung, Versicherungsberechnung, Korrekturabrechnungen und tatsächliche Zahlungshistorie bleiben offen. Keine fachliche Freigabe.

- 02a920f / 6b7059c: nachträgliche separate Auszahlung nach Austritt innerhalb desselben Anspruchsjahrs in Berechnungsfunktion ermöglicht; spätere Entwürfe sperren rückdatierte Auszahlung. Regression ergänzt, CI nicht bestätigt. UI-Anbindung weiterhin offen; jahresübergreifende Ansprüche und fachliche Prüfung offen.
