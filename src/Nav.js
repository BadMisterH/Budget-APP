import { signOut, deleteUser } from "firebase/auth";
import { auth } from "../firebase-config.js";

export function Nav(navigation) {
  navigation.innerHTML = `
    <nav class="navbar bg-base-100 shadow-lg">
      <div class="navbar-start">
        <h1>💰 My Budget</h1>
      </div>
      
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1">
          <li><a data-page="dashboard" class="nav-link btn btn-primary">📊 Tableau de bord</a></li>
          <li><a data-page="transactions" class="nav-link btn btn-ghost">💰 Transactions</a></li>
          <li><a data-page="analytics" class="nav-link btn btn-ghost">📈 Analyses</a></li>
          <li><a data-page="calendar" class="nav-link btn btn-ghost">📅 Calendrier</a></li>
        </ul>
      </div>

      <div class="navbar-end">
        <!-- Bouton de déconnexion -->
        <div class="dropdown dropdown-end bg-primary/30 rounded-full">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle avata">
            <div class="w-10 rounded-full flex justify-center items-center align-self">
              <span class="text-sm font-bold">${auth.currentUser?.email?.charAt(0).toUpperCase() || 'U'}</span>
            </div>
          </div>
          <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li class="menu-title">
              <span class="text-xs">${auth.currentUser?.email || 'Utilisateur'}</span>
            </li>
            <li><button id="logoutBtn" class="text-warning hover:bg-warning/10">🚪 Déconnexion</button></li>
            <li><hr class="my-1"></li>
            <li><button id="deleteAccountBtn" class="text-error hover:bg-error/10">🗑️ Supprimer le compte</button></li>
          </ul>
        </div>
      </div>
    </nav>
  `;

  // Ajouter l'event listener pour la déconnexion
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        console.log("🚪 Déconnexion en cours...");
        await signOut(auth);
        console.log("✅ Déconnexion réussie !");
      } catch (error) {
        console.error('❌ Erreur lors de la déconnexion:', error);
      }
    });
  }

  // Ajouter l'event listener pour la suppression de compte
  const deleteAccountBtn = document.getElementById('deleteAccountBtn');
  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener('click', async () => {
      await handleDeleteAccount();
    });
  }

  // Fonction pour gérer la suppression de compte
  async function handleDeleteAccount() {
    const user = auth.currentUser;
    if (!user) {
      alert('❌ Aucun utilisateur connecté');
      return;
    }

    // Créer une modal de confirmation
    const confirmModal = document.createElement('div');
    confirmModal.className = 'modal modal-open';
    confirmModal.innerHTML = `
      <div class="modal-box max-w-md">
        <h3 class="font-bold text-lg text-error mb-4">
          ⚠️ Supprimer définitivement votre compte ?
        </h3>
        <div class="space-y-4">
          <div class="bg-error/10 p-4 rounded-lg">
            <p class="text-sm text-error font-semibold mb-2">
              ⚠️ Cette action est irréversible !
            </p>
            <p class="text-sm text-base-content/80">
              Toutes vos données seront supprimées :
            </p>
            <ul class="text-sm text-base-content/70 list-disc list-inside mt-2 space-y-1">
              <li>🗂️ Toutes vos transactions</li>
              <li>📊 Vos données financières</li>
              <li>👤 Votre compte utilisateur</li>
            </ul>
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">
                Tapez "SUPPRIMER" pour confirmer :
              </span>
            </label>
            <input 
              type="text" 
              id="confirmInput" 
              class="input input-bordered" 
              placeholder="SUPPRIMER"
              autocomplete="off"
            >
          </div>
        </div>
        
        <div class="modal-action">
          <button id="cancelDelete" class="btn btn-ghost">
            ❌ Annuler
          </button>
          <button id="confirmDelete" class="btn btn-error" disabled>
            <span class="loading loading-spinner loading-sm hidden" id="deleteLoading"></span>
            🗑️ Supprimer définitivement
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(confirmModal);

    const confirmInput = confirmModal.querySelector('#confirmInput');
    const confirmBtn = confirmModal.querySelector('#confirmDelete');
    const cancelBtn = confirmModal.querySelector('#cancelDelete');
    const loadingSpinner = confirmModal.querySelector('#deleteLoading');

    // Activer le bouton seulement si "SUPPRIMER" est tapé exactement
    confirmInput.addEventListener('input', (e) => {
      const isValid = e.target.value === 'SUPPRIMER';
      confirmBtn.disabled = !isValid;
      confirmBtn.classList.toggle('btn-error', isValid);
      confirmBtn.classList.toggle('btn-disabled', !isValid);
    });

    // Fermer la modal en cliquant sur Annuler
    cancelBtn.addEventListener('click', () => {
      document.body.removeChild(confirmModal);
    });

    // Gérer la suppression
    confirmBtn.addEventListener('click', async () => {
      if (confirmInput.value !== 'SUPPRIMER') return;

      try {
        loadingSpinner.classList.remove('hidden');
        confirmBtn.disabled = true;
        cancelBtn.disabled = true;

        console.log('🗑️ Début de la suppression du compte...');

        // 1. Supprimer toutes les données utilisateur (transactions)
        await deleteUserData(user.uid);

        // 2. Supprimer le compte utilisateur
        await deleteUser(user);

        console.log('✅ Compte supprimé avec succès');
        
        // 3. Fermer la modal
        document.body.removeChild(confirmModal);

        // 4. Afficher un message de confirmation
        showSuccessMessage('✅ Votre compte a été supprimé définitivement.');

      } catch (error) {
        console.error('❌ Erreur lors de la suppression:', error);
        
        // Gestion des erreurs spécifiques
        if (error.code === 'auth/requires-recent-login') {
          alert('🔐 Pour des raisons de sécurité, veuillez vous reconnecter avant de supprimer votre compte.');
          // Déconnecter pour forcer une nouvelle connexion
          await signOut(auth);
        } else {
          alert('❌ Erreur lors de la suppression : ' + error.message);
        }
        
        document.body.removeChild(confirmModal);
      }
    });

    // Focus sur l'input
    setTimeout(() => confirmInput.focus(), 100);
  }

  // Fonction pour supprimer les données utilisateur
  async function deleteUserData(userId) {
    try {
      // Import dynamique pour éviter les erreurs de build
      const { collection, query, where, getDocs, deleteDoc } = await import('firebase/firestore');
      const { db } = await import('../firebase-config.js');

      console.log('🗂️ Suppression des transactions...');

      // Récupérer toutes les transactions de l'utilisateur
      const q = query(
        collection(db, 'transactions'),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      
      // Supprimer chaque transaction
      const deletePromises = [];
      querySnapshot.forEach((doc) => {
        deletePromises.push(deleteDoc(doc.ref));
      });
      
      await Promise.all(deletePromises);
      console.log(`✅ ${deletePromises.length} transactions supprimées`);
      
    } catch (error) {
      console.error('❌ Erreur lors de la suppression des données:', error);
      throw error;
    }
  }

  // Fonction pour afficher un message de succès
  function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'toast toast-top toast-center z-50';
    successDiv.innerHTML = `
      <div class="alert alert-success">
        <span>${message}</span>
      </div>
    `;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
      if (document.body.contains(successDiv)) {
        document.body.removeChild(successDiv);
      }
    }, 3000);
  }
}