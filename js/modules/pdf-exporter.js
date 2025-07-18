/**
 * PDF-Export-Modul für Kidos Tools
 * Spezifische PDF-Export-Funktionalität
 */

class KidosPDFExporter {
  constructor(exportUtils) {
    this.exportUtils = exportUtils;
  }

  export() {
    const data = this.exportUtils.getBasicData();
    this.exportUtils.showExportModal('pdf-export', data);
  }

  cancel() {
    this.exportUtils.hideExportModal('pdf-export');
  }

  async confirm() {
    this.exportUtils.hideExportModal('pdf-export');
    
    try {
      const logoBase64 = await this.exportUtils.loadLogoAsBase64();
      const data = this.exportUtils.getBasicData();
      const timestamp = this.exportUtils.generateTimestamp();
      const filename = `${timestamp} - ${data.childName}.pdf`;
      
      // PDF erstellen
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      
      // Konfiguration
      const margin = 21.25;
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      let currentY = margin + 15;
      let pageNumber = 1;
      
      // Spaltenbreiten für Tabelle
      const availableWidth = pageWidth - (2 * margin);
      const colWidths = {
        statement: availableWidth - 72,
        rating1: 12, rating2: 12, rating3: 12, rating4: 12, rating5: 12, rating6: 12
      };
      
      const totalTableWidth = Object.values(colWidths).reduce((sum, width) => sum + width, 0);
      const tableStartX = margin;
      
      // Hilfsfunktionen
      const addHeader = (logoBase64 = null) => {
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        
        if (logoBase64) {
          try {
            doc.addImage(logoBase64, 'PNG', margin, 10, 8, 8);
            doc.text('Kidos Tools - Entwicklungsbericht', margin + 12, 15);
          } catch (error) {
            doc.text('Kidos Tools - Entwicklungsbericht', margin, 15);
          }
        } else {
          doc.text('Kidos Tools - Entwicklungsbericht', margin, 15);
        }
        
        doc.setLineWidth(0.5);
        doc.line(margin, 20, pageWidth - margin, 20);
      };
      
      const addFooter = () => {
        const footerY = pageHeight - 20;
        
        doc.setLineWidth(0.5);
        doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
        
        doc.setFontSize(8);
        doc.setFont(undefined, 'normal');
        
        const currentDate = new Date();
        const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}.${String(currentDate.getMonth() + 1).padStart(2, '0')}.${currentDate.getFullYear()}`;
        doc.text(`Erstellt am ${formattedDate} von ${data.author}`, margin, footerY);
        
        doc.setFontSize(9);
        doc.text(`Seite ${pageNumber}`, pageWidth - margin, footerY, { align: 'right' });
        
        doc.setFontSize(8);
        doc.setFont(undefined, 'italic');
        doc.text('\u00A9 2025 Benjamin Geisler \u2013 Kidos Tools (jsPDF: MIT License)', pageWidth / 2, footerY + 8, { align: 'center' });
      };
      
      const checkPageBreak = (additionalHeight = 10) => {
        if (currentY + additionalHeight > pageHeight - 35) {
          addFooter();
          doc.addPage();
          pageNumber++;
          addHeader(logoBase64);
          currentY = margin + 15;
          return true;
        }
        return false;
      };
      
      const addTableHeader = () => {
        checkPageBreak(20);
        
        doc.setFontSize(7);
        doc.setFont(undefined, 'bold');
        
        doc.setLineWidth(0.3);
        doc.rect(tableStartX, currentY, totalTableWidth, 15);
        
        let currentX = tableStartX;
        doc.text('Aussage', currentX + 2, currentY + 10);
        currentX += colWidths.statement;
        
        for (let i = 0; i <= 5; i++) {
          doc.line(currentX, currentY, currentX, currentY + 15);
          doc.text(i.toString(), currentX + 4, currentY + 10);
          currentX += colWidths[`rating${i + 1}`];
        }
        
        currentY += 18;
        
        doc.setFontSize(6);
        doc.setFont(undefined, 'normal');
        doc.text('0=Nicht bewertbar | 1=Trifft nicht zu | 2=Trifft weniger zu | 3=Trifft zu | 4=Trifft eher zu | 5=Trifft absolut zu', 
                pageWidth / 2, currentY, { align: 'center' });
        currentY += 8;
      };
      
      const addTableRow = (statement, selectedRating) => {
        checkPageBreak(12);
        
        const rowHeight = 10;
        
        doc.setLineWidth(0.2);
        doc.rect(tableStartX, currentY, totalTableWidth, rowHeight);
        
        doc.setFontSize(7);
        doc.setFont(undefined, 'normal');
        const lines = doc.splitTextToSize(statement, colWidths.statement - 4);
        const textY = currentY + 6;
        
        if (lines.length > 0) {
          doc.text(lines[0], tableStartX + 2, textY);
        }
        
        let currentX = tableStartX + colWidths.statement;
        
        for (let i = 0; i <= 5; i++) {
          doc.line(currentX, currentY, currentX, currentY + rowHeight);
          
          if (selectedRating === i.toString()) {
            doc.setFillColor(0, 102, 204);
            doc.circle(currentX + 6, currentY + 5, 2, 'F');
          }
          
          currentX += colWidths[`rating${i + 1}`];
        }
        
        currentY += rowHeight;
      };
      
      // PDF-Inhalt erstellen
      addHeader(logoBase64);
      
      // Titel
      doc.setFontSize(20);
      doc.setFont(undefined, 'bold');
      doc.text('Entwicklungsbericht', pageWidth / 2, currentY, { align: 'center' });
      currentY += 10;
      
      // Kindername
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text(data.childName, pageWidth / 2, currentY, { align: 'center' });
      currentY += 15;
      
      // Grunddaten
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`Alter: ${data.childAge} | Autor*in: ${data.author} | Datum: ${data.assessmentDate}`, 
               pageWidth / 2, currentY, { align: 'center' });
      currentY += 10;
      
      // Bewertungen
      const assessmentData = this.exportUtils.collectAssessmentData();
      let firstCategory = true;
      
      assessmentData.forEach(category => {
        // Intelligenter Seitenumbruch
        if (!firstCategory) {
          const usedPageHeight = currentY - (margin + 15);
          const availablePageHeight = pageHeight - 35 - (margin + 15);
          const pageUsagePercentage = usedPageHeight / availablePageHeight;
          
          if (pageUsagePercentage > 0.5) {
            addFooter();
            doc.addPage();
            pageNumber++;
            addHeader(logoBase64);
            currentY = margin + 15;
          }
        }
        firstCategory = false;
        
        checkPageBreak(30);
        
        // Kategorie-Überschrift
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(category.name.toUpperCase(), pageWidth / 2, currentY, { align: 'center' });
        currentY += 8;
        
        category.subcategories.forEach(subcategory => {
          checkPageBreak(35);
          
          // Unterkategorie-Überschrift
          doc.setFontSize(12);
          doc.setFont(undefined, 'bold');
          doc.text(subcategory.name, pageWidth / 2, currentY, { align: 'center' });
          currentY += 6;
          
          addTableHeader();
          
          subcategory.statements.forEach(statement => {
            addTableRow(statement.text, statement.rating);
          });
          
          currentY += 6;
        });
        
        currentY += 8;
      });
      
      addFooter();
      
      // PDF speichern
      doc.save(filename);
      console.log('PDF-Datei wurde erstellt:', filename);
      
    } catch (error) {
      console.error('Fehler beim PDF-Export:', error);
      alert(`Fehler beim PDF-Export: ${error.message}`);
    }
  }
}

// Export für ES6 Module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = KidosPDFExporter;
}
