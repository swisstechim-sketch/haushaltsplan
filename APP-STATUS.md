# STAY Swiss – Android

Offline-Prototyp mit lokal eingebetteter Web-Oberfläche. CRUD für Gäste, Zimmer, Reservationen, Zusatzleistungen, Housekeeping, Zahlungen und E-Mail-Vorlagen; Zimmerkonfliktprüfung, Wochenkalender, einfache Rechnungen, Mahlzeitenübersicht, Suche, Hotelprofil und JSON-Sicherung.

Noch nicht vollständig: exakte SVG-Designparität, alle individuellen Dialoge, QR-Rechnung nach SIX, vollständige MWST-Abrechnung, Storno/Gutschriften, PDF-Vorlageneditor, sichere PIN/Rollen, E-Mail-Versand, vollständige Importvalidierung, native Dateiauswahl und automatisierte Tests. Rechnungsbeträge sind als Bruttobeträge modelliert; keine produktive Finanzfreigabe. Keine Geräte- oder Buildprüfung erfolgt.

## SQLite
Native SQLite storage replaces SharedPreferences. Separate entity tables, indexed foreign keys, atomic snapshot writes and legacy JSON migration. Entity attributes remain JSON payloads except relational keys; full column normalization, incremental CRUD, encrypted backups and device tests remain pending.
