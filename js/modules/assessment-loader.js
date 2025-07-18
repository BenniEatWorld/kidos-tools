/**
 * Assessment-Loader-Modul für Kidos Tools
 * Lädt und rendert Bewertungstabellen basierend auf JSON-Konfiguration
 */

class KidosAssessmentLoader {
  constructor(jsonFile, containerId = 'assessment-table') {
    this.jsonFile = jsonFile;
    this.containerId = containerId;
  }

  async loadAssessmentTable() {
    try {
      const response = await fetch(this.jsonFile);
      const data = await response.json();
      
      const tableContainer = document.getElementById(this.containerId);
      let html = '';
      
      data.kategorien.forEach(kategorie => {
        // Große Überschrift für die Kategorie
        html += `<div class="category-header">${kategorie.name}</div>`;
        
        kategorie.unterkategorien.forEach(unterkategorie => {
          // Unterüberschrift
          html += `<div class="subcategory-header">${unterkategorie.name}</div>`;
          
          // Aussagen mit Radio-Buttons
          unterkategorie.aussagen.forEach((aussage, index) => {
            const radioName = `rating_${kategorie.name}_${unterkategorie.name}_${index}`.replace(/[^a-zA-Z0-9]/g, '_');
            
            html += `
              <div class="assessment-row">
                <div class="assessment-content">
                  <div class="assessment-statement">${aussage}</div>
                  <div class="assessment-ratings">
                    <div class="rating-colors">
                      <label class="rating-color gray" for="${radioName}_0">
                        <input type="radio" name="${radioName}" value="0" id="${radioName}_0">
                        <span class="rating-indicator"></span>
                      </label>
                      <label class="rating-color dark-red" for="${radioName}_1">
                        <input type="radio" name="${radioName}" value="1" id="${radioName}_1">
                        <span class="rating-indicator"></span>
                      </label>
                      <label class="rating-color red" for="${radioName}_2">
                        <input type="radio" name="${radioName}" value="2" id="${radioName}_2">
                        <span class="rating-indicator"></span>
                      </label>
                      <label class="rating-color yellow" for="${radioName}_3">
                        <input type="radio" name="${radioName}" value="3" id="${radioName}_3">
                        <span class="rating-indicator"></span>
                      </label>
                      <label class="rating-color light-green" for="${radioName}_4">
                        <input type="radio" name="${radioName}" value="4" id="${radioName}_4">
                        <span class="rating-indicator"></span>
                      </label>
                      <label class="rating-color green" for="${radioName}_5">
                        <input type="radio" name="${radioName}" value="5" id="${radioName}_5">
                        <span class="rating-indicator"></span>
                      </label>
                    </div>
                    <div class="rating-legend">
                      <span class="legend-item">Nicht<br>bewertbar</span>
                      <span class="legend-item">Trifft nicht<br>zu</span>
                      <span class="legend-item">Trifft weniger<br>zu</span>
                      <span class="legend-item">Trifft<br>zu</span>
                      <span class="legend-item">Trifft eher<br>zu</span>
                      <span class="legend-item">Trifft absolut<br>zu</span>
                    </div>
                  </div>
                </div>
              </div>
            `;
          });
        });
      });
      
      tableContainer.innerHTML = html;
      return true;
    } catch (error) {
      console.error('Fehler beim Laden der Bewertungstabelle:', error);
      document.getElementById(this.containerId).innerHTML = '<p>Fehler beim Laden der Bewertungsdaten.</p>';
      return false;
    }
  }
}

// Export für ES6 Module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = KidosAssessmentLoader;
}
