/**
 * KI-Prompt-Modul für Kidos Tools
 * Verwaltet KI-Prompt-Funktionalität mit Zwischenablage
 */

class KidosPromptHandler {
  constructor(promptElementId = 'ki-prompt-text') {
    this.promptElementId = promptElementId;
  }

  copyToClipboard() {
    const promptText = document.getElementById(this.promptElementId).textContent;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(promptText).then(() => {
        alert('Prompt wurde in die Zwischenablage kopiert!');
      }).catch(err => {
        console.error('Fehler beim Kopieren:', err);
        this.fallbackCopyTextToClipboard(promptText);
      });
    } else {
      this.fallbackCopyTextToClipboard(promptText);
    }
  }

  fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        alert('Prompt wurde in die Zwischenablage kopiert!');
      } else {
        alert('Kopieren fehlgeschlagen. Bitte markieren Sie den Text manuell und kopieren Sie ihn.');
      }
    } catch (err) {
      console.error('Fallback-Kopieren fehlgeschlagen:', err);
      alert('Kopieren fehlgeschlagen. Bitte markieren Sie den Text manuell und kopieren Sie ihn.');
    }
    
    document.body.removeChild(textArea);
  }

  // Statische Methode für Standard-Prompt-Text
  static getDefaultPrompt() {
    return `Bitte erstelle einen positiv formulierten Entwicklungsbericht basierend auf den angehängten Bewertungsdaten. 

WICHTIGE RICHTLINIEN:
- Ignoriere alle Aussagen, die "Nicht bewertbar" oder "Nicht bewertet" sind
- Formuliere ausschließlich positiv und ressourcenorientiert
- Schreibe niemals von "auffälligem" Verhalten, sondern von "herausforderndem" Verhalten
- Weise auf Bereiche hin, die Ergänzungen oder weitere Beobachtungen benötigen
- Prüfe auf doppelte, sehr ähnliche oder widersprüchliche Beschreibungen und weise darauf hin
- Strukturiere den Bericht nach Entwicklungsbereichen
- Verwende eine professionelle, aber warme Sprache
- Betone Stärken und Potentiale des Kindes
- Formuliere Empfehlungen als Entwicklungschancen, nicht als Defizite

FORMAT:
1. Einleitung mit positiver Gesamteinschätzung
2. Entwicklungsbereiche mit Stärken und Potentialen
3. Hinweise auf Bereiche mit wenig Bewertungen
4. Empfehlungen für weitere Förderung
5. Positiver Ausblick

Achte besonders darauf, dass der Bericht Eltern und Fachkräfte ermutigt und das Kind in seinen Entwicklungsmöglichkeiten bestärkt.`;
  }
}

// Export für ES6 Module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = KidosPromptHandler;
}
