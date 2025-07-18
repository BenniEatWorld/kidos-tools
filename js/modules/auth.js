/**
 * Authentifizierung-Modul für Kidos Tools
 * Verwaltet Token-basierte Authentifizierung
 */

class KidosAuth {
  static checkAuth() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const storedToken = sessionStorage.getItem('kidos_login_token');
    
    if (token && storedToken && token === storedToken) {
      // Gültiger Token
      document.getElementById('access-denied').style.display = 'none';
      document.getElementById('main-content').style.display = 'block';
      return true;
    } else {
      // Ungültiger oder fehlender Token
      document.getElementById('access-denied').style.display = 'flex';
      document.getElementById('main-content').style.display = 'none';
      return false;
    }
  }

  static logout() {
    sessionStorage.removeItem('kidos_login_token');
    window.location.href = '../index.html';
  }
}

// Export für ES6 Module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = KidosAuth;
}
