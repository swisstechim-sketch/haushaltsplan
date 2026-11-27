# STAY Swiss – laufender Projektstatus
Stand: 27.11.2026. Entwicklungsbranch: fix/form-select-consistency-20261126.
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

- 0ededf2: separater 13.-Monatslohn-Dialog an Lohnliste angebunden; eigener Entwurfstyp, reguläre Monatsentwürfe bleiben separat, Änderungen/Löschung der Anspruchsgrundlagen bei vorhandenen separaten Entwürfen gesperrt. Buchung separater Entwürfe bis fachlicher Versicherungs-/Quellensteuerprüfung gesperrt. CI, UI-Regression, Backupprüfung, Korrekturen und Zahlungshistorie offen.

- 6f8623f / e989538: allgemeine kumulative Versicherungsobergrenzen-Berechnung in Rappen mit getrennten AN-/AG-Sätzen und Regressionen ergänzt. Noch nicht an Lohnentwürfe angebunden; historische geprüfte Bemessungsgrundlagen, Beitragsperioden, BVG/Fixbeträge, Quellensteuer und Buchung weiterhin offen. CI nicht bestätigt; keine fachliche Freigabe.

- 6f76b6b / afbad1f: AHV-Rentnerfreibetrag berücksichtigt in der Berechnungsfunktion historische 13.-Monatslohn-Auszahlungsentwürfe desselben Monats; ungültige historische Beträge werden abgewiesen. Regression ergänzt. Anbindung an tatsächliche geprüfte AHV-Basen, Jahresabstimmung, weitere Versicherungen und CI-Nachweis offen.

- d2e204b: AHV-Basisvorschlag im regulären Lohnentwurf verwendet Alters-/Freibetragslogik und mitarbeiterbezogene Monatsentwürfe statt pauschalem Bruttolohn. Manuelle geprüfte Basis weiterhin möglich; bei fehlenden Stammdaten kein automatischer Vorschlag. Separate Auszahlung, ALV-Jahresabstimmung, Versicherungsverträge und fachliche/CI-Prüfung offen.

- 2a93886 / d760c96: explizit auswählbare ALV-Jahresobergrenzenregel in Versicherungsstammdaten und regulärer Lohnberechnung integriert; historische Basis/Sätze/Obergrenze gespeichert, fehlende oder abweichende Historie blockiert; nachfolgende ALV-Entwürfe schützen frühere Abrechnungen vor Änderung/Löschung. Keine automatische Migration alter Beiträge. Fachprüfung (unterjährige Anstellung, Satzwechsel, Sonderzahlungen), UI-/CI-Regression und Buchung offen.

- 43ddab4: Versicherungsregeln Monatsbeitrag einmalig, BU Arbeitgeber, NBU vertraglich und KTG vertraglich ergänzt; Monatsbeitragsduplikate im regulären Entwurf blockiert, separate Entwürfe bei dieser Regel übersprungen, BU-Arbeitnehmeranteil abgewiesen, Vertragskategorien geprüft. Keine automatische Umstellung bestehender Verträge. Separate Versicherungsberechnung, NBU-Arbeitszeitgrenze, Vertrags-/Jahresgrenzen, BVG-Sonderzahlungen, fachliche Prüfung und CI/UI-Tests offen.

- d862d9f: Versicherungs-Soll-/Habenkonto im Entwurf gespeichert; reguläre Lohnbuchung um AN-Abzüge (Lohnverbindlichkeit an Versicherungsverbindlichkeit) und AG-Aufwand erweitert. Fehlende/inaktive Konten, manuelle Positionen, unzugeordnete Quellensteuer und separate Auszahlung bleiben gesperrt. Kontenarten, fachliche Freigabe, Regression und CI offen.

- 708ce7a: Quellensteuer-Snapshot enthält eindeutige geprüfte Tarifzeile, Herkunft, Jahr, Kanton, Code und hinterlegtes Habenkonto; reguläre Buchung nutzt bestehende Gegenkontenprüfung. Sonderzahlungen, korrekte steuerbare Basis, Tarifgrenzen, Kontenarten, feste Zulagen/Abzüge und CI/Fachprüfung weiterhin offen.

- b15aece: Gegenkonten für vier regelmässige Zulagen und vier Abzüge in Personalstammdaten, Snapshot und Lohnbuchung ergänzt; Kontenklasse und Summen werden geprüft. Manuelle Beträge ohne Zuordnung bleiben gesperrt. Bestehende Snapshots nicht migriert. UI, fachliche Behandlung steuer-/versicherungspflichtiger Zulagen und CI offen.

- b692874: Lohnzahlungsdialog für gebuchte reguläre Löhne, Teilzahlungen über 2000/1020 mit eigener Journalreferenz, offene Verbindlichkeit aus Journal, Überzahlung und Datum vor Abrechnung blockiert. Bankkonto 1020 vorgegeben; Auswahl, sichtbare Zahlungshistorie, Storno, fachliche Prüfung und CI offen.

- b9fb41e: Bankkontenauswahl 1020–1099 und Lohnzahlungshistorie; fachliche Kontenauswahl und UI-Test offen.
- 0a21aab: Zahlungsstorno als Gegenbuchung, Doppelstornos gesperrt; Datum heute, UI und fachliche Regression offen.
- Buildstatus: #537 und #538 nach Neustart erfolgreich, #539–541 erfolgreich, #542–543 laufen. #536 erst nach Abschluss starten. Keine Release-Veröffentlichung.

- Lohnzahlungshistorie korrigiert: Storno zeigt ursprüngliches Bankkonto und negativen Betrag; Postkonto 1010 zugelassen, Geldtransit 1090 ausgeschlossen. Statische Prüfung der Aktionshandler erfolgt; CI und Live-Test offen. Korrekturabrechnung weiterhin offen.

- Regressionstests in tests/swiss-payroll.test.cjs für tatsächliche Saldenfunktion: ungebucht, Netto, Teilzahlung, Gegenbuchung, Vollzahlung, Überzahlung. CI-Ausführung noch nicht bestätigt; #542–544 liefen vor Änderung. Historische Neustarts zurückgestellt.

- Vor Lohnbuchung wird der Nettosaldo auf Konto 2000 gegen berechneten Nettolohn geprüft; negative oder abweichende Salden gesperrt. CI und fachliche Prüfung offen. Korrekturabrechnungen weiterhin offen.

- Regressionstest der tatsächlichen premiumPayrollBook-Funktion mit simuliertem Journal: korrekter Nettolohn erlaubt, abweichender und negativer Sollwert gesperrt, keine zusätzliche Buchung. CI-Nachweis offen.

- Allgemeine Journalstornierung für Lohnbuchungen und Lohnzahlungen gesperrt, damit die spezielle Zahlungshistorie nicht umgangen wird. Vollständige Korrekturabrechnung und CI-Prüfung offen.

- #544: Release fehlgeschlagen wegen Maven Central HTTP 429 bei kotlin-stdlib und kotlinx-coroutines-android; Build und Emulator erfolgreich. Begrenzte Wiederholungen auf fünf mit 120/240/360/480 Sekunden Wartezeit erweitert. #545–548 erfolgreich. #536 Versuch 2 erneut abgebrochen (Joblog operation canceled), historische Konkurrenzkonfiguration bleibt unveränderlich; keine parallelen Reruns. #531 lief bei Prüfung. Neuer Workflow-Build durch Push, Ergebnis offen.

- Lohnbuchhaltung: Bearbeitung verbuchter Löhne und Journalbuchungen bereits beim Öffnen gesperrt, Bearbeitungsicons entfernt, allgemeines Storno für Lohnbuchungen ausgeblendet, verbuchte Löhne in Liste und Druckdialog gekennzeichnet. Korrekturabrechnung weiterhin offen; CI und Live-Test offen. #549 bei Beginn laufend, #545–548 erfolgreich, PR #2 offen, kein Merge.

- LDPlayer-Rückmeldung: Gegenkonten in acht Positionsakkordeons verschoben, automatische Auswahl aus aktiven Stammdaten bzw. bekannten Konten (5000/5800, 1140, 2270); unklare Abzüge bleiben bewusst manuell. Unverbuchte Lohnentwürfe mit abhängigen Entwürfen nach expliziter Sammelbestätigung löschbar; verbuchte Abhängigkeiten gesperrt. CI/Live-Test offen, Korrekturabrechnung offen.

- Integrationsprüfung: aktuelle kumulative Version über Build #551 prüfen, statt historische Commits parallel erneut auszuführen. #549 erfolgreich (Maven-Backoff); #550/#551 bei Prüfung laufend. Historische Fehler bleiben als Historie sichtbar; nicht einzeln als behoben markieren ohne Ursachenprüfung. Letzte 100 Runs mit offenen historischen Fehlern/Abbrüchen: #544 failure, #536 cancelled, #535 cancelled, #534 cancelled, #533 cancelled, #532 cancelled, #531 cancelled, #530 cancelled, #529 cancelled, #528 cancelled, #527 cancelled, #526 cancelled, #525 cancelled, #524 cancelled, #522 cancelled, #518 cancelled, #517 cancelled, #515 cancelled, #514 cancelled, #513 cancelled, #512 failure, #511 cancelled, #510 cancelled, #508 cancelled, #507 cancelled, #505 failure, #504 cancelled, #503 failure, #502 cancelled, #501 failure, #499 cancelled, #498 cancelled, #497 cancelled, #495 cancelled, #494 cancelled, #493 cancelled, #492 cancelled, #489 cancelled, #488 cancelled, #487 cancelled, #486 cancelled, #485 cancelled, #484 cancelled, #482 cancelled, #481 cancelled, #480 cancelled, #479 cancelled, #477 cancelled, #475 cancelled, #472 cancelled, #470 cancelled, #469 cancelled, #467 cancelled, #466 cancelled, #464 cancelled, #458 failure, #457 failure, #456 failure, #453 failure, #452 failure.

- Regressionstests für Löschbestätigung, Schutz verbuchter Abhängigkeiten, unabhängige Mitarbeiter und automatische aktive Gegenkonten ergänzt. CI offen. #550 erfolgreich, #551 bei Beginn laufend; historische Neustarts erst nach Ursachenprüfung und ohne Konkurrenz.

- Lohnkorrektur: schreibgeschützte Gegenbuchungsvorschau mit Prüfung Zahlungen, Folgeabrechnungen, Periodensperre und historischen Konten ergänzt. Tatsächliche Korrekturbuchung und Neuberechnung weiterhin offen; CI/Live-Test offen. #551/#552 bei Beginn laufend, #550 erfolgreich.

- Korrekturplan aus Originaljournal mit exakten Rappenbeträgen, aktiven Konten, Zahlungsschutz, Folgeabrechnungen, Periodensperre und Doppelkorrekturschutz implementiert; Regressionstests ergänzt. Keine tatsächliche Gegenbuchung freigegeben, da historische Versicherungs-/13.-Monatslohn-Salden und Ersatzabrechnung noch integriert werden müssen. #551–553 erfolgreich; neue CI offen.

- Aktive Lohnhistorie als Vorbereitung für Korrekturen: Originale mit Korrekturjournalquelle aus Jahresübersicht, Lohnausweis, separatem 13. Monatslohn, ALV-/AHV-Historie und Monatsduplikatprüfung ausgeschlossen; AHV-Editor berücksichtigt eigenen Entwurf nicht erneut. Noch keine Korrekturbuchung freigegeben; weitere Abhängigkeiten und Tests offen. #554/#555 bei Beginn laufend.

- Regressionstest aktive Lohnhistorie: korrigiertes Original bleibt gespeichert, Ersatz zählt einmal, andere Mitarbeiter bleiben ausgeschlossen; ohne Korrekturjournal zählen beide Datensätze. CI offen; #554–556 bei Beginn laufend. Keine historische Wiederholung parallel gestartet.

- Korrigierte Originale: offene Auszahlung auf null, widersprüchliche Restzahlungen blockiert, generisches Storno von Korrekturjournal geschützt, Original in Liste gekennzeichnet, separater 13. Monatslohn nicht vom korrigierten Original startbar. Korrektur-Erstellung noch nicht freigegeben; CI und Tests offen. #554–557 bei Beginn laufend.

- Vollständige Gegenbuchung unbezahlter Löhne mit Bestätigung, erneuter Planprüfung, atomarem Journalposting in Originalperiode und unverändertem Original implementiert. Separate 13.-Monatslohn-Entwürfe blockieren vorsorglich. Ersatzabrechnung manuell neu erstellen; automatische Ersatzabrechnung, Regression und fachliche Freigabe offen. #554 erfolgreich, #555–558 bei Beginn laufend.

- Build #556: build-Job 140114188427 fehlgeschlagen, finance.test.cjs:83 ReferenceError premiumActivePayrollRows; Emulator erfolgreich, Release übersprungen. Testumgebung lädt jetzt tatsächliche Hilfsfunktion und leeres Journal, bestehende Assertions unverändert. Neuer CI-Lauf erforderlich, historischer Rerun würde alten Fehler wiederholen. Ersatzabrechnung noch offen.

- Buildprüfung: #557–559 gleicher ReferenceError wie #556 laut Joblogs; Emulator jeweils erfolgreich, Release übersprungen. Fix 6555926 im aktiven Branch vorhanden, #560 prüft korrigierten Stand. #536 Build/Emulator extern abgebrochen, Release-Log nicht abrufbar (404); aktuelle Workflow-Concurrency pro Run ohne automatische Abbrüche. Historische Wiederholung nur einzeln nach Ende laufender Builds.

- Erneute Live-Fehlermeldung: Lohnentwürfe nicht löschbar, Dialoge teilweise nicht schliessbar. Native MainActivity hatte keinen WebChromeClient; JavaScript-Bestätigungen sind dadurch nicht zuverlässig verfügbar. d5454cc ergänzt Standard-WebChromeClient, 4830389 ergänzt statischen Nachweis und Regression der tatsächlichen close-Funktion (Abbrechen, Bestätigen, erzwungenes Schliessen). Keine Datenmigration. #560 und #551–554 erfolgreich vor Fix; neue CI und native Bedienungs-/LDPlayer-Abnahme offen. Löschabhängigkeiten weiterhin prüfen; keine Sammellöschung ohne Bestätigung. Historische Runs wurden offenbar bereinigt, keine Wiederholung gestartet. Keine Merges.

- 27.11.2026 – Fortsetzung nach ausdrücklicher GitHub-Freigabe. Entwicklungsbranch und PRs geprüft (#2 und #1 offen, kein Merge). #561/#562 erfolgreich; historische fehlgeschlagene/abgebrochene Runs nicht erneut starten (Nutzerbereinigung). Commit 01ff4b1: Einzel-Löschen unverbuchter Lohnentwürfe statt Jahres-Sammellöschung, abhängige spätere ALV-Jahres- und separate 13.-Monatslohn-Entwürfe sperren, Journal-/Korrekturschutz auch unmittelbar vor Mutation, Schliessen ohne zusätzliche Speichern-Warnung nach bestätigtem Löschen. Aktive Stammdatenkonten nach Soll (Zulage) bzw. Haben (Abzug) nur bei eindeutiger gültiger Zuordnung übernehmen; bei Mehrdeutigkeit kein automatisches Gegenkonto. Commit d65b8f/b023907: Regressionstests für gezielte Löschung, abhängige Entwürfe, Buchungsschutz, Abbruch und Gegenkonten ergänzt, Testharness-Zeilenende berichtigt. Commit e84d1ff/5717368: Lohnkorrektur prüft Original-Nettolohn gegen Journal und mehrdeutige Kontonummern; entsprechende Regression ergänzt. Runs #563–567 bei Prüfung noch in_progress: CI BESTANDEN ausdrücklich noch nicht bestätigt; Android-Live-Test und fachliche Prüfung offen. Keine bestehende Datenmigration. Für vollständige Lohnbuchhaltung weiterhin offen: Ersatz-/Zusatzabrechnung, amtliches Formular 11, separate Auszahlung mit geprüften Abzügen/Arbeitgeberanteilen, Versicherungs-/Quellensteuer-Regelprüfung und Endabnahme. Bestehende Dialogkorrektur d5454cc im Code; umfassende native Dialog-Bedienungstests noch offen.

- 27.11.2026 – GitHub-Fortsetzung: Builds #563–567 sind abgeschlossen und im Build-Job fehlgeschlagen; Emulator-Job #567 erfolgreich, Release übersprungen. Joblog #567 zeigt `ReferenceError: premiumActivePayrollRows is not defined` in der isolierten Regression `premiumPayrollCorrectionPlan`, kein nachgewiesener Android-Laufzeitfehler. Commit e1245a8 lädt die vorhandene produktive Hilfsfunktion in denselben Testkontext, ohne Produktiv- oder Bestandsdaten zu ändern. Neuer CI-Nachweis noch offen; keine historischen Runs neu gestartet, kein Merge. Offene Abnahme: Korrektur-/Ersatzabrechnung, Lohnentwurf-Löschen und Dialoge am Gerät sowie versicherungsrechtliche Fachprüfung.

- Build #568: fehlende Hilfsfunktion behoben, danach Assertion in swiss-payroll.test.cjs:139 fehlgeschlagen, weil beide Testwerte dieselbe Variable verwendeten. Commit 6addf31 trennt Journal-Nettobetrag vom veränderlichen berechneten Nettolohn; Assertion und Produktivcode unverändert. Emulator erfolgreich, Release übersprungen; neuer CI-Nachweis offen.

- Build #569 (6addf31): Build, Emulator-Tests und Release erfolgreich abgeschlossen. Beide Regressionstest-Korrekturen bestätigt. Geräteabnahme und Ersatzabrechnung weiterhin offen.

- ded4733: Gegenbuchung erzeugt atomar verknüpften Ersatzentwurf mit neuer Referenz; Buchung bis Bearbeitung gesperrt, Snapshots werden bei erster Bearbeitung neu berechnet. Regressionstest für Kopie und Duplikatschutz ergänzt. CI und Geräteprüfung offen; amtlicher Lohnausweis und fachliche Validierung weiterhin offen.

- Builds #570–572 erfolgreich. 4abb8a5: Lohnausweis summiert nur aktive verbuchte Löhne, offene Entwürfe und unklassifizierte Abzüge werden angezeigt. Gezielter Regressionstest ergänzt; dessen CI-Nachweis noch offen. Amtliches PDF und fachliche Endabnahme weiterhin offen.

- 27.11.2026 – Amtliches Formular 11: Original-PDF im Assets-Ordner vorhanden; PDFBox-Befüllung, Android-Bridge, lokale Speicherung, Vorschau mit Zoom, Teilen und A4-Druck implementiert. Feldzuordnung für 43 erfasste Felder, Pflichtfeldprüfung, Spesen 13.1.1 und Rundungsregression ergänzt. Emulator-Roundtrip-Test 5b7875e prüft Originalfelder und gespeicherte Werte. #587 Build und Emulator scheiterten vor Testausführung an D8 Java heap space; ab75df8 erhöht Heap auf 3072 MB und begrenzt Worker auf zwei. Aktuelle CI-Sicht: #595 in_progress, #594 in_progress, #593 in_progress, #592 in_progress, #591 in_progress. Vollständige Feldvalidierung, fachliche Prüfung, separate 13.-Monatslohn-Buchung und Geräteabnahme offen. Keine Tests deaktiviert, keine historischen Runs neu gestartet, kein Merge.

- 27.11.2026 – Build #595 (ab75df8) beendet: Build-Job fehlgeschlagen, Emulator-Job erfolgreich, Release übersprungen. Vollständiger Joblog 140354255336: fünf Versuche von :app:checkDebugAarMetadata scheiterten jeweils mit HTTP 429 (Too Many Requests) von repo.maven.apache.org bei pdfbox-android 2.0.27.0, kotlin-stdlib 1.8.22 und kotlinx-coroutines-android 1.6.4. Kein Speicherfehler in diesem Build. Bestehende JavaScript-, Lohn- und UI-Regressionstests erfolgreich. Commits 8311bb0 (zusätzlicher Maven-Central-Endpunkt) und ca1f6ab (HTTP-Timeout für CI) eingespielt; neuer Build-Nachweis noch offen. Keine Testabschaltung, keine historischen Runs neu gestartet, kein Merge.
