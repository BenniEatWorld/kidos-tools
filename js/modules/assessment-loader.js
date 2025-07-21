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
        const kategorieName = kategorie.kategorie || kategorie.name || '';
        html += `<div class="assessment-kategorie category-header">${kategorieName}</div>`;

        kategorie.unterkategorien.forEach(unterkategorie => {
          const unterkategorieName = unterkategorie.unterkategorie || unterkategorie.name || '';
          html += `<div class="assessment-unterkategorie subcategory-header">${unterkategorieName}</div>`;

          // Aussagen mit Radio-Buttons
          unterkategorie.aussagen.forEach((aussage, index) => {
            const radioName = `rating_${kategorieName}_${unterkategorieName}_${index}`.replace(/[^a-zA-Z0-9]/g, '_');
            const ergaenzungId = `ergaenzung_${kategorieName}_${unterkategorieName}_${index}`.replace(/[^a-zA-Z0-9]/g, '_');
            const plusId = `plus_${kategorieName}_${unterkategorieName}_${index}`.replace(/[^a-zA-Z0-9]/g, '_');

            html += `
              <div class="assessment-row" style="position:relative;">
                <div class="assessment-content">
                  <div class="assessment-statement">${aussage}</div>
                  <button type="button" class="ergaenzung-plus-btn" id="${plusId}" title="Ergänzung hinzufügen" style="position:absolute;left:0;bottom:6px;width:46px;height:46px;border:none;background:transparent;cursor:pointer;font-size:2.5em;line-height:1;z-index:2;display:flex;align-items:center;justify-content:center;">+</button>
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
              <div id="box_${ergaenzungId}" class="assessment-row" style="display:none;">
                <div class="assessment-content" style="display:block;padding:0;">
                  <textarea id="${ergaenzungId}" class="ergaenzung-textarea" placeholder="Ergänzung..."></textarea>
                </div>
              </div>
            `;
          });
        });
      });
      
      tableContainer.innerHTML = html;

      // Event-Listener für alle Plus-Buttons
      const plusButtons = tableContainer.querySelectorAll('.ergaenzung-plus-btn');
      plusButtons.forEach(btn => {
        btn.addEventListener('click', function() {
          const id = btn.id.replace('plus_', 'ergaenzung_');
          const box = document.getElementById('box_' + id);
          if (box) {
            box.style.display = box.style.display === 'none' ? 'block' : 'none';
            if (box.style.display === 'block') {
              const textarea = box.querySelector('textarea');
              if (textarea) textarea.focus();
            }
          }
        });
      });
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
