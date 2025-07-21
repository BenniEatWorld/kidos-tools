/**
 * Export-Utilities-Modul für Kidos Tools
 * Gemeinsame Export-Funktionen für CSV, PDF und Word
 */

class KidosExportUtils {
  constructor() {
    this.bewertungsTexte = {
      '0': 'Nicht bewertbar',
      '1': 'Trifft nicht zu',
      '2': 'Trifft weniger zu',
      '3': 'Trifft zu',
      '4': 'Trifft eher zu',
      '5': 'Trifft absolut zu'
    };
  }

  // Grunddaten sammeln
  getBasicData() {
    return {
      childName: document.getElementById('child-name')?.value.trim() || 'unbekannt',
      childAge: document.getElementById('child-age')?.value.trim() || 'nicht angegeben',
      author: document.getElementById('author')?.value.trim() || 'unbekannt',
      assessmentDate: document.getElementById('assessment-date')?.value || 'nicht angegeben'
    };
  }

  // Zeitstempel für Dateinamen erstellen
  generateTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}${month}${day}${hour}${minute}${second}`;
  }

  // Logo als Base64 laden
  async loadLogoAsBase64() {
    try {
      const response = await fetch('../gfx/Kidos-logo.png');
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.warn('Logo konnte nicht geladen werden:', error);
      return null;
    }
  }

  // Modal-Funktionen
  showExportModal(modalId, data) {
    document.getElementById(`${modalId}-child-name`).textContent = data.childName;
    document.getElementById(`${modalId}-child-age`).textContent = data.childAge;
    document.getElementById(`${modalId}-author`).textContent = data.author;
    document.getElementById(`${modalId}-date`).textContent = data.assessmentDate;
    document.getElementById(`${modalId}-modal`).style.display = 'flex';
  }

  hideExportModal(modalId) {
    document.getElementById(`${modalId}-modal`).style.display = 'none';
  }

  // RTF-Kodierung für Word-Export
  encodeRTF(text) {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/\{/g, '\\{')
      .replace(/\}/g, '\\}')
      .replace(/ä/g, "\\'e4")
      .replace(/ö/g, "\\'f6")
      .replace(/ü/g, "\\'fc")
      .replace(/Ä/g, "\\'c4")
      .replace(/Ö/g, "\\'d6")
      .replace(/Ü/g, "\\'dc")
      .replace(/ß/g, "\\'df")
      .replace(/\n/g, '\\par ')
      .replace(/\r/g, '');
  }

  // Datei-Download
  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Assessment-Daten sammeln
  collectAssessmentData() {
    const assessmentData = [];
    const categoryHeaders = document.querySelectorAll('.category-header');

    categoryHeaders.forEach(categoryHeader => {
      const kategorieName = categoryHeader.textContent.trim();
      const categoryData = {
        name: kategorieName,
        subcategories: []
      };

      let currentElement = categoryHeader.nextElementSibling;

      while (currentElement && !currentElement.classList.contains('category-header')) {
        if (currentElement.classList.contains('subcategory-header')) {
          const unterkategorieName = currentElement.textContent.trim();
          const subcategoryData = {
            name: unterkategorieName,
            statements: []
          };

          let assessmentElement = currentElement.nextElementSibling;

          while (assessmentElement &&

                 !assessmentElement.classList.contains('subcategory-header') &&
                 !assessmentElement.classList.contains('category-header')) {

            if (assessmentElement.classList.contains('assessment-row')) {
              const statementDiv = assessmentElement.querySelector('.assessment-statement');
              if (statementDiv) {
                const statement = statementDiv.textContent.trim();
                const checkedRadio = assessmentElement.querySelector('input[type="radio"]:checked');
                const selectedRating = checkedRadio ? checkedRadio.value : null;
                // Ergänzung als nächste .assessment-row mit .ergaenzung-textarea suchen
                let ergaenzung = '';
                let nextErgaenzung = assessmentElement.nextElementSibling;
                if (nextErgaenzung && nextErgaenzung.classList.contains('assessment-row')) {
                  const textarea = nextErgaenzung.querySelector('textarea.ergaenzung-textarea');
                  if (textarea) {
                    ergaenzung = textarea.value;
                  }
                }
                subcategoryData.statements.push({
                  text: statement,
                  rating: selectedRating,
                  ratingText: selectedRating !== null ? this.bewertungsTexte[selectedRating] : 'Nicht bewertet',
                  ergaenzung: ergaenzung.trim()
                });
              }
            }

            assessmentElement = assessmentElement.nextElementSibling;
          }

          categoryData.subcategories.push(subcategoryData);
        }

        currentElement = currentElement.nextElementSibling;
      }

      assessmentData.push(categoryData);
    });

    return assessmentData;
  }
}

// Export für ES6 Module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = KidosExportUtils;
}
