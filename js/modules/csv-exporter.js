/**
 * CSV-Export-Modul für Kidos Tools
 * Spezifische CSV-Export-Funktionalität
 */

class KidosCSVExporter {
  constructor(exportUtils) {
    this.exportUtils = exportUtils;
  }

  export() {
    const data = this.exportUtils.getBasicData();
    this.exportUtils.showExportModal('export', data);
  }

  cancel() {
    this.exportUtils.hideExportModal('export');
  }

  confirm() {
    this.exportUtils.hideExportModal('export');
    
    const data = this.exportUtils.getBasicData();
    const timestamp = this.exportUtils.generateTimestamp();
    const filename = `${timestamp} - ${data.childName}.csv`;
    
    // CSV-Inhalt erstellen mit UTF-8 BOM für korrekte Umlaut-Darstellung
    let csvContent = '\uFEFF'; // UTF-8 BOM
    
    // Grunddaten hinzufügen
    csvContent += 'GRUNDDATEN\n';
    csvContent += `Name des Kindes;${data.childName}\n`;
    csvContent += `Alter;${data.childAge}\n`;
    csvContent += `Autor*in;${data.author}\n`;
    csvContent += `Erhebungsdatum;${data.assessmentDate}\n`;
    csvContent += '\n';
    
    // Bewertungen sammeln
    const assessmentData = this.exportUtils.collectAssessmentData();
    
    assessmentData.forEach(category => {
      csvContent += `${category.name.toUpperCase()}\n`;
      
      category.subcategories.forEach(subcategory => {
        csvContent += `${subcategory.name}\n`;
        
        subcategory.statements.forEach(statement => {
          csvContent += `"${statement.text}";"${statement.ratingText}"\n`;
        });
        
        csvContent += '\n'; // Leerzeile nach jeder Unterkategorie
      });
      
      csvContent += '\n'; // Leerzeile nach jeder Kategorie
    });
    
    // Fußzeile hinzufügen
    const currentDate = new Date();
    const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}.${String(currentDate.getMonth() + 1).padStart(2, '0')}.${currentDate.getFullYear()}`;
    
    csvContent += `Diese Datei wurde am ${formattedDate} von ${data.author} mit Kidos Tools erstellt.\n`;
    csvContent += `© 2025 Benjamin Geisler - Kidos Tools. Erstellt mit jsPDF (MIT License).\n`;
    
    // CSV-Datei herunterladen
    if (typeof document.createElement('a').download !== 'undefined') {
      this.exportUtils.downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
      console.log('CSV-Datei wurde erstellt:', filename);
    } else {
      console.error('CSV-Export wird von diesem Browser nicht unterstützt.');
      alert('CSV-Export wird von diesem Browser nicht unterstützt.');
    }
  }
}

// Export für ES6 Module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = KidosCSVExporter;
}
