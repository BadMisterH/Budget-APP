// Installation de la PWA
let deferredPrompt;

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', () => {
  const installBanner = document.getElementById('installBanner');
  const installBtn = document.getElementById('installBtn');
  const dismissBtn = document.getElementById('dismissBtn');

  // Écouter l'événement beforeinstallprompt
  window.addEventListener('beforeinstallprompt', (e) => {
    // console.log('PWA: beforeinstallprompt event was fired.');
    
    // Empêcher la mini-infobar par défaut
    e.preventDefault();
    
    // Sauvegarder l'événement pour l'utiliser plus tard
    deferredPrompt = e;
    
    // Afficher le banner d'installation personnalisé
    showInstallBanner();
  });

  // Fonction pour afficher le banner d'installation
  function showInstallBanner() {
    if (installBanner) {
      installBanner.classList.remove('hidden');
      // console.log('PWA: Install banner shown');
    }
  }

  // Fonction pour masquer le banner d'installation
  function hideInstallBanner() {
    if (installBanner) {
      installBanner.classList.add('hidden');
    }
  }

  // Gestionnaire du bouton d'installation
  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      // console.log('PWA: User clicked install button');
      
      if (!deferredPrompt) {
        console.log('PWA: deferredPrompt is not available');
        return;
      }
      
      // Afficher la boîte de dialogue d'installation
      deferredPrompt.prompt();
      
      // Attendre la réponse de l'utilisateur
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`PWA: User response to the install prompt: ${outcome}`);
      
      if (outcome === 'accepted') {
        console.log('PWA: User accepted the install prompt');
      } else {
        console.log('PWA: User dismissed the install prompt');
      }
      
      // Réinitialiser la variable
      deferredPrompt = null;
      
      // Masquer le banner
      hideInstallBanner();
    });
  }

  // Gestionnaire du bouton de fermeture
  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      hideInstallBanner();
    });
  }

  // Écouter l'événement appinstalled
  window.addEventListener('appinstalled', (evt) => {
    console.log('PWA: App was installed successfully');
    hideInstallBanner();
    
    // Optionnel : afficher un message de succès
    showToast('Application installée avec succès !', 'success');
  });

  // Vérifier si l'app est déjà installée
  if (isAppInstalled()) {
    console.log('PWA: App is already installed');
    hideInstallBanner();
  }
});

// Fonction pour afficher des toasts (notifications)
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-top toast-end`;
  toast.innerHTML = `
    <div class="alert alert-${type}">
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  // Supprimer le toast après 3 secondes
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Vérifier si l'app est déjà installée
function isAppInstalled() {
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.navigator.standalone === true;
}

// Export pour utilisation dans d'autres modules
export { showToast, isAppInstalled };
