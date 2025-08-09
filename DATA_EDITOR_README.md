# Data Editor - Server-Setup

## Übersicht

Der Data Editor kann JSON-Dateien auf zwei Arten speichern:

1. **Download-Modus**: Dateien werden heruntergeladen (funktioniert immer)
2. **Server-Modus**: Dateien werden direkt überschrieben (erfordert PHP-Server)

## Server-Modus aktivieren

### Voraussetzungen
- PHP 7.0 oder höher
- Webserver (Apache, Nginx, oder lokaler PHP-Server)
- Schreibrechte im `data/` Verzeichnis

### Lokaler Server starten

```bash
# Im kidos-tools Hauptverzeichnis
php -S localhost:8000
```

Dann die Anwendung über `http://localhost:8000/data_edit.html` aufrufen.

### Ordner-Berechtigungen

Stellen Sie sicher, dass folgende Ordner beschreibbar sind:
- `data/` (für JSON-Dateien)
- `data/backups/` (für automatische Backups)

```bash
# Linux/macOS
chmod 755 data/
chmod 755 data/backups/

# Windows
# Rechtsklick auf Ordner → Eigenschaften → Sicherheit → Bearbeiten
```

## Funktionen

### Automatische Backups
- Bei jedem Speichern wird automatisch ein Backup erstellt
- Backups werden in `data/backups/` gespeichert
- Format: `dateiname_YYYY-MM-DD_HH-MM-SS.json`

### Sicherheitsfeatures
- Nur bestehende JSON-Dateien können überschrieben werden
- Dateinamen werden validiert (nur alphanumerisch + Bindestriche/Unterstriche)
- JSON-Inhalt wird vor dem Speichern validiert
- Backups werden automatisch erstellt

### Fallback-Verhalten
- Falls Server nicht verfügbar: Automatischer Download
- Falls Speichern fehlschlägt: Download als Alternative angeboten
- Moderne Browser: File System Access API als Alternative

## Fehlerbehebung

### "Server nicht verfügbar"
1. PHP-Server prüfen: `php -S localhost:8000`
2. save_json.php existiert und ist ausführbar
3. Berechtigungen im data/ Ordner prüfen

### "Datei existiert nicht"
- Neue Dateien können nur heruntergeladen werden
- Über Download erstellen, dann in data/ Ordner kopieren

### "Ungültiges JSON"
- JSON-Syntax im Editor prüfen
- Validierung vor Speichern durchführen

## Sicherheitshinweise

- Das PHP-Script sollte nur auf vertrauenswürdigen Servern eingesetzt werden
- Für Produktionsumgebungen zusätzliche Authentifizierung implementieren
- Backup-Ordner regelmäßig bereinigen
