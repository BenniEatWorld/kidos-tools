<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Antwort-Array initialisieren
$response = array();

try {
    // Nur POST-Requests erlauben
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Nur POST-Requests erlaubt');
    }
    
    // Parameter überprüfen
    if (!isset($_POST['action']) || $_POST['action'] !== 'save') {
        throw new Exception('Ungültige Aktion');
    }
    
    if (!isset($_POST['filename']) || !isset($_POST['content'])) {
        throw new Exception('Fehlende Parameter: filename oder content');
    }
    
    $filename = $_POST['filename'];
    $content = $_POST['content'];
    
    // Dateiname validieren
    if (!preg_match('/^[a-zA-Z0-9_-]+\.json$/', $filename)) {
        throw new Exception('Ungültiger Dateiname. Nur alphanumerische Zeichen, Bindestriche und Unterstriche sind erlaubt.');
    }
    
    // Sicherheitsprüfung: Nur Dateien im data/ Ordner
    $dataDir = __DIR__ . '/data/';
    $filePath = $dataDir . $filename;
    
    // Überprüfen ob data/ Ordner existiert
    if (!is_dir($dataDir)) {
        throw new Exception('Data-Verzeichnis nicht gefunden');
    }
    
    // Überprüfen ob die Datei bereits existiert (wir wollen nur bestehende Dateien überschreiben)
    if (!file_exists($filePath)) {
        throw new Exception('Datei existiert nicht. Neue Dateien können nur heruntergeladen werden.');
    }
    
    // JSON-Inhalt validieren
    $jsonData = json_decode($content);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Ungültiges JSON-Format: ' . json_last_error_msg());
    }
    
    // Backup der bestehenden Datei erstellen
    $backupDir = $dataDir . 'backups/';
    if (!is_dir($backupDir)) {
        mkdir($backupDir, 0755, true);
    }
    
    $timestamp = date('Y-m-d_H-i-s');
    $backupFile = $backupDir . pathinfo($filename, PATHINFO_FILENAME) . '_' . $timestamp . '.json';
    
    if (file_exists($filePath)) {
        copy($filePath, $backupFile);
    }
    
    // Neue Datei schreiben
    $result = file_put_contents($filePath, $content, LOCK_EX);
    
    if ($result === false) {
        throw new Exception('Fehler beim Schreiben der Datei');
    }
    
    $response['success'] = true;
    $response['message'] = "Datei $filename erfolgreich gespeichert";
    $response['backup_created'] = basename($backupFile);
    $response['timestamp'] = date('Y-m-d H:i:s');
    
} catch (Exception $e) {
    $response['success'] = false;
    $response['message'] = $e->getMessage();
    $response['error'] = true;
    
    // Fehler auch in Log schreiben
    error_log("JSON Save Error: " . $e->getMessage());
}

// JSON-Antwort senden
echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>
