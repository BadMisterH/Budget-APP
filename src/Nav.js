import { signOut } from "firebase/auth";
import { auth } from "../firebase-config.js";

export function Nav(navigation) {
  navigation.innerHTML = `
    <nav class="navbar bg-base-100 shadow-lg">
      <div class="navbar-start">
        <a class="btn btn-ghost text-xl">💰 My Budget</a>
      </div>
      
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1">
          <li><a data-page="dashboard" class="nav-link btn btn-primary">📊 Tableau de bord</a></li>
          <li><a data-page="transactions" class="nav-link btn btn-ghost">💰 Transactions</a></li>
          <li><a data-page="analytics" class="nav-link btn btn-ghost">📈 Analyses</a></li>
        </ul>
      </div>

      <div class="navbar-end">
        <!-- Bouton de déconnexion -->
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span class="text-sm font-bold">${auth.currentUser?.email?.charAt(0).toUpperCase() || 'U'}</span>
            </div>
          </div>
          <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li class="menu-title">
              <span class="text-xs">${auth.currentUser?.email || 'Utilisateur'}</span>
            </li>
            <li><button id="logoutBtn" class="text-error">🚪 Déconnexion</button></li>
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
}