// Header-Loader für Kidos Tools
class ComponentLoader {
  static async loadHeader(containerId = 'header-container') {
    try {
      const response = await fetch('components/header.html');
      if (!response.ok) {
        // Fallback: Versuche von tools-Unterordner aus
        const fallbackResponse = await fetch('../components/header.html');
        if (!fallbackResponse.ok) {
          throw new Error('Header konnte nicht geladen werden');
        }
        const headerHTML = await fallbackResponse.text();
        document.getElementById(containerId).innerHTML = headerHTML;
        this.adjustPathsForSubfolder();
        return;
      }
      
      const headerHTML = await response.text();
      document.getElementById(containerId).innerHTML = headerHTML;
    } catch (error) {
      console.error('Fehler beim Laden des Headers:', error);
      // Fallback: Standard-Header anzeigen
      document.getElementById(containerId).innerHTML = `
        <header class="header">
          <div class="header-content">
            <div class="logo-section">
              <img src="gfx/logo_menu.png" alt="Kidos Tools" class="logo-image" height="70" />
            </div>
            <nav class="nav-links">
              <a href="index.html" class="nav-link">Home</a>
              <a href="#" class="nav-link">Dokumentation</a>
              <a href="#" class="nav-link">Über</a>
            </nav>
          </div>
        </header>
      `;
    }
  }

  static async loadFooter(containerId = 'footer-container') {
    try {
      const response = await fetch('components/footer.html');
      if (!response.ok) {
        // Fallback: Versuche von tools-Unterordner aus
        const fallbackResponse = await fetch('../components/footer.html');
        if (!fallbackResponse.ok) {
          throw new Error('Footer konnte nicht geladen werden');
        }
        const footerHTML = await fallbackResponse.text();
        document.getElementById(containerId).innerHTML = footerHTML;
        this.adjustFooterPathsForSubfolder();
        return;
      }
      
      const footerHTML = await response.text();
      document.getElementById(containerId).innerHTML = footerHTML;
    } catch (error) {
      console.error('Fehler beim Laden des Footers:', error);
      // Fallback: Standard-Footer anzeigen
      document.getElementById(containerId).innerHTML = `
        <footer class="footer">
          © 2025 Benjamin Geisler – Kidos Tools – 
          <a href="https://www.benjamingeisler.de/" target="_blank" rel="noopener noreferrer">benjamingeisler.de</a>
          | <a href="templates/impressum.html">Impressum</a>
        </footer>
      `;
    }
  }

  // Passt die Pfade für Seiten in Unterordnern an
  static adjustPathsForSubfolder() {
    const header = document.querySelector('#header-container header');
    if (header) {
      // Logo-Pfad anpassen
      const logo = header.querySelector('.logo-image');
      if (logo && !logo.src.includes('../')) {
        logo.src = '../gfx/logo_menu.png';
      }
    }
  }

  // Passt die Footer-Pfade für Seiten in Unterordnern an
  static adjustFooterPathsForSubfolder() {
    const footer = document.querySelector('#footer-container footer');
    if (footer) {
      // Impressum-Link anpassen
      const impressumLink = footer.querySelector('a[href="templates/impressum.html"]');
      if (impressumLink) {
        impressumLink.href = '../templates/impressum.html';
      }
    }
  }
}

// Automatisches Laden beim DOM-Load
document.addEventListener('DOMContentLoaded', function() {
  ComponentLoader.loadHeader();
  ComponentLoader.loadFooter();
});
