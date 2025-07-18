/**
 * Kidos-Tools-Manager
 * Orchestriert alle Module für ein Assessment-Tool
 */

class KidosToolsManager {
  constructor(config) {
    this.config = {
      jsonFile: '../data/EB_STD.json',
      toolTitle: 'Entwicklungsbericht',
      toolDescription: 'Standard Beschreibung',
      promptText: null, // Verwende Standard-Prompt wenn null
      ...config
    };

    // Module initialisieren
    this.exportUtils = new KidosExportUtils();
    this.assessmentLoader = new KidosAssessmentLoader(this.config.jsonFile);
    this.csvExporter = new KidosCSVExporter(this.exportUtils);
    this.pdfExporter = new KidosPDFExporter(this.exportUtils);
    this.wordExporter = new KidosWordExporter(this.exportUtils);
    this.promptHandler = new KidosPromptHandler();

    // Event-Listener binden
    this.bindEvents();
  }

  async initialize() {
    // Authentifizierung prüfen
    if (!KidosAuth.checkAuth()) {
      return false;
    }

    // Assessment-Tabelle laden
    await this.assessmentLoader.loadAssessmentTable();

    // Prompt-Text setzen falls konfiguriert
    if (this.config.promptText) {
      const promptElement = document.getElementById('ki-prompt-text');
      if (promptElement) {
        promptElement.textContent = this.config.promptText;
      }
    }

    // Tool-spezifische Inhalte setzen
    this.updateToolContent();

    // Bibliotheken prüfen
    this.checkLibraries();

    return true;
  }

  updateToolContent() {
    // Titel setzen
    const titleElement = document.querySelector('.page-title');
    if (titleElement && this.config.toolTitle) {
      titleElement.textContent = this.config.toolTitle;
    }

    // Beschreibung setzen
    const descriptionElement = document.querySelector('.page-description');
    if (descriptionElement && this.config.toolDescription) {
      descriptionElement.textContent = this.config.toolDescription;
    }
  }

  bindEvents() {
    // Export-Events als globale Funktionen verfügbar machen
    window.exportToCSV = () => this.csvExporter.export();
    window.cancelExport = () => this.csvExporter.cancel();
    window.confirmExport = () => this.csvExporter.confirm();

    window.exportToPDF = () => this.pdfExporter.export();
    window.cancelPDFExport = () => this.pdfExporter.cancel();
    window.confirmPDFExport = () => this.pdfExporter.confirm();

    window.exportToWord = () => this.wordExporter.export();
    window.cancelWordExport = () => this.wordExporter.cancel();
    window.confirmWordExport = () => this.wordExporter.confirm();

    window.copyPromptToClipboard = () => this.promptHandler.copyToClipboard();
    window.logout = () => KidosAuth.logout();
  }

  checkLibraries() {
    console.log('jsPDF verfügbar:', typeof jsPDF !== 'undefined');
    console.log('docx verfügbar:', typeof docx !== 'undefined');
    
    if (typeof docx !== 'undefined') {
      console.log('docx-Objekt:', docx);
      console.log('docx-Eigenschaften:', Object.keys(docx));
    } else {
      console.error('docx-Bibliothek wurde nicht geladen!');
    }
  }

  // Statische Methode für einfache Initialisierung
  static async create(config = {}) {
    const manager = new KidosToolsManager(config);
    await manager.initialize();
    return manager;
  }
}

// Export für ES6 Module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = KidosToolsManager;
}
