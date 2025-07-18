/**
 * Word-Export-Modul für Kidos Tools
 * Spezifische Word-Export-Funktionalität mit RTF-Format
 */

class KidosWordExporter {
  constructor(exportUtils) {
    this.exportUtils = exportUtils;
  }

  export() {
    const data = this.exportUtils.getBasicData();
    this.exportUtils.showExportModal('word-export', data);
  }

  cancel() {
    this.exportUtils.hideExportModal('word-export');
  }

  async confirm() {
    this.exportUtils.hideExportModal('word-export');
    
    try {
      const data = this.exportUtils.getBasicData();
      const timestamp = this.exportUtils.generateTimestamp();
      const filename = `${timestamp} - ${data.childName}.doc`;
      
      // RTF-Inhalt erstellen mit einfacher Formatierung
      let rtfContent = `{\\rtf1\\ansi\\ansicpg1252\\deff0\\deflang1031 {\\fonttbl {\\f0\\fswiss\\fcharset0 Arial;}}
{\\colortbl ;\\red0\\green102\\blue204;}
\\paperw11906\\paperh16838\\margl1134\\margr1134\\margt1134\\margb1134
\\f0\\fs20

{\\header \\pard\\ql\\fs16 Kidos Tools - Entwicklungsbericht\\par}

{\\footer \\pard\\qr\\fs18 Seite \\chpgn\\par
\\pard\\qc\\fs16\\i \\u169? 2025 Benjamin Geisler \\u8211? Kidos Tools (MIT License)\\i0\\par}

\\pard\\qc\\b\\fs28 ENTWICKLUNGSBERICHT\\b0\\fs20\\par
\\par

\\pard\\qc\\b\\fs28 ${this.exportUtils.encodeRTF(data.childName)}\\b0\\fs20\\par
\\par

\\pard\\qc\\fs16 Alter: ${this.exportUtils.encodeRTF(data.childAge)} | Autor*in: ${this.exportUtils.encodeRTF(data.author)} | Datum: ${this.exportUtils.encodeRTF(data.assessmentDate)}\\par
\\par\\par

`;

      // Bewertungen sammeln und hinzufügen
      const assessmentData = this.exportUtils.collectAssessmentData();
      let currentPageLines = 0;
      const maxLinesPerPage = 45;
      let firstCategory = true;
      
      assessmentData.forEach(category => {
        // Intelligenter Seitenumbruch
        if (!firstCategory) {
          const pageUsagePercentage = currentPageLines / maxLinesPerPage;
          if (pageUsagePercentage > 0.5) {
            rtfContent += '\\page ';
            currentPageLines = 0;
          }
        }
        firstCategory = false;
        
        // Kategorie-Überschrift
        rtfContent += `\\pard\\qc\\b\\fs24 ${this.exportUtils.encodeRTF(category.name.toUpperCase())}\\b0\\fs20\\par\\par`;
        currentPageLines += 3;
        
        category.subcategories.forEach(subcategory => {
          // Unterkategorie-Überschrift
          rtfContent += `\\pard\\qc\\b\\fs22 ${this.exportUtils.encodeRTF(subcategory.name)}\\b0\\fs22\\par\\par`;
          currentPageLines += 3;
          
          subcategory.statements.forEach(statement => {
            // Aussage
            rtfContent += `\\pard\\ql\\fs22 ${this.exportUtils.encodeRTF(statement.text)}\\par`;
            currentPageLines += Math.ceil(statement.text.length / 80);
            
            // Bewertung
            if (statement.rating !== null) {
              rtfContent += `\\pard\\ql\\b\\cf1\\fs22 ${this.exportUtils.encodeRTF(statement.ratingText)}\\cf0\\b0\\par\\par`;
            } else {
              rtfContent += `\\pard\\ql\\fs22 Nicht bewertet\\par\\par`;
            }
            currentPageLines += 3;
          });
          
          rtfContent += '\\par';
          currentPageLines += 1;
        });
      });
      
      // Schlussbemerkung
      const currentDate = new Date();
      const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}.${String(currentDate.getMonth() + 1).padStart(2, '0')}.${currentDate.getFullYear()}`;
      
      rtfContent += `\\par\\par\\pard\\qc\\fs16\\par\\par
\\pard\\qr\\i\\fs14 ${this.exportUtils.encodeRTF(`Diese Datei wurde am ${formattedDate} von ${data.author} mit Kidos Tools erstellt.`)}\\i0\\par`;
      rtfContent += '}';
      
      // RTF-Datei erstellen und herunterladen
      const encoder = new TextEncoder();
      const rtfBytes = encoder.encode(rtfContent);
      
      this.exportUtils.downloadFile(rtfBytes, filename, 'application/rtf');
      
      console.log('Word-Datei wurde erstellt:', filename);
      alert('Professionelle Word-Datei wurde erfolgreich erstellt!');
      
    } catch (error) {
      console.error('Detaillierter Fehler beim Word-Export:', error);
      alert(`Fehler beim Word-Export: ${error.message}`);
    }
  }
}

// Export für ES6 Module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = KidosWordExporter;
}
