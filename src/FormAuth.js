import { getAuth } from "firebase/auth";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

// const { Authentifi } = await import('./src/FormAuth.js');
// await Authentifi('test@test.com', '123456');

const auth = getAuth();

export function formTraitement(form) {
  form.innerHTML = `
    <div class="min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center p-4">
      <div class="card w-full max-w-md shadow-2xl bg-base-100 border border-base-300">
        <div class="card-body p-8">
          <!-- Header avec emoji et titre -->
          <div class="text-center mb-6">
            <div class="text-6xl mb-4 animate-bounce">💰</div>
            <h1 class="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              My Budget App
            </h1>
            <p class="text-base-content/60 mt-2">Gérez vos finances en toute simplicité</p>
          </div>

          <!-- Onglets modernes -->
          <div class="tabs tabs-boxed mb-6 bg-base-200">
            <button id="loginTab" class="tab tab-active flex-1 font-semibold">
              🔑 Connexion
            </button>
            <button id="registerTab" class="tab flex-1 font-semibold">
              📝 Inscription
            </button>
          </div>

          <!-- Formulaire principal -->
          <form id="formAuth" class="space-y-4">
            <!-- Zone d'erreur -->
            <div id="errorZone" class="alert alert-error hidden animate-pulse">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span id="errorText"></span>
            </div>

            <!-- Email Input -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold flex items-center gap-2">
                  <span class="text-lg">📧</span>
                  Email
                </span>
              </label>
              <div class="relative">
                <input 
                  type="email" 
                  name="email" 
                  id="email" 
                  class="input input-bordered w-full pl-12 focus:input-primary transition-all duration-200" 
                  placeholder="votre@email.com"
                  required
                >
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/50">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                  </svg>
                </span>
              </div>
            </div>

            <!-- Password Input -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold flex items-center gap-2">
                  <span class="text-lg">🔒</span>
                  Mot de passe
                </span>
              </label>
              <div class="relative">
                <input 
                  type="password" 
                  name="mdp" 
                  id="mdp" 
                  class="input input-bordered w-full pl-12 pr-12 focus:input-primary transition-all duration-200" 
                  placeholder="••••••••"
                  required
                  minlength="6"
                >
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/50">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m0 0v2m0-2h2m-2 0H10m4-6V9a4 4 0 00-8 0v2m0 0V9a6 6 0 0112 0v2m-6 3a1 1 0 100-2 1 1 0 000 2z"></path>
                  </svg>
                </span>
                <button type="button" id="togglePassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content transition-colors">
                  <svg id="eyeOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </button>
              </div>
              <label class="label">
                <span class="label-text-alt text-xs opacity-70">Minimum 6 caractères</span>
              </label>
            </div>

            <!-- Mode actuel -->
            <div id="currentMode" class="text-center text-sm text-base-content/60 py-2">
              Mode: <span id="modeText" class="font-semibold text-primary">Connexion</span>
            </div>

            <!-- Boutons d'action -->
            <div class="form-control mt-6">
              <button 
                id="submitLog" 
                type="submit" 
                class="btn btn-primary w-full text-lg font-semibold hover:scale-105 transition-all duration-200 shadow-lg"
              >
                <span class="text-xl">🔑</span>
                <span id="submitText">Se connecter</span>
              </button>
            </div>

            <!-- Lien de basculement -->
            <div class="text-center pt-4">
              <p class="text-sm text-base-content/60">
                <span id="switchText">Pas encore de compte ?</span>
                <button type="button" id="switchMode" class="link link-primary font-semibold ml-1">
                  <span id="switchAction">S'inscrire</span>
                </button>
              </p>
            </div>
          </form>

          <!-- Loading state -->
          <div id="loadingState" class="text-center py-4 hidden">
            <span class="loading loading-spinner loading-md text-primary"></span>
            <p class="text-sm text-base-content/60 mt-2">Connexion en cours...</p>
          </div>
        </div>
      </div>
    </div>
  `;

  // État du formulaire
  let isLoginMode = true;

  // Éléments du DOM
  const loginTab = form.querySelector('#loginTab');
  const registerTab = form.querySelector('#registerTab');
  const formElement = form.querySelector('#formAuth');
  const switchModeBtn = form.querySelector('#switchMode');
  const togglePasswordBtn = form.querySelector('#togglePassword');
  const errorZone = form.querySelector('#errorZone');
  const loadingState = form.querySelector('#loadingState');

  // Gestion du basculement entre connexion/inscription
  function switchMode(toLogin = true) {
    isLoginMode = toLogin;
    
    const modeText = form.querySelector('#modeText');
    const submitText = form.querySelector('#submitText');
    const switchText = form.querySelector('#switchText');
    const switchAction = form.querySelector('#switchAction');
    const submitBtn = form.querySelector('#submitLog');

    if (isLoginMode) {
      // Mode connexion
      loginTab.classList.add('tab-active');
      registerTab.classList.remove('tab-active');
      modeText.textContent = 'Connexion';
      submitText.textContent = 'Se connecter';
      submitBtn.innerHTML = '<span class="text-xl">🔑</span><span>Se connecter</span>';
      submitBtn.className = 'btn btn-primary w-full text-lg font-semibold hover:scale-105 transition-all duration-200 shadow-lg';
      switchText.textContent = 'Pas encore de compte ?';
      switchAction.textContent = "S'inscrire";
    } else {
      // Mode inscription
      registerTab.classList.add('tab-active');
      loginTab.classList.remove('tab-active');
      modeText.textContent = 'Inscription';
      submitText.textContent = "S'inscrire";
      submitBtn.innerHTML = '<span class="text-xl">📝</span><span>S\'inscrire</span>';
      submitBtn.className = 'btn btn-secondary w-full text-lg font-semibold hover:scale-105 transition-all duration-200 shadow-lg';
      switchText.textContent = 'Déjà un compte ?';
      switchAction.textContent = 'Se connecter';
    }
    hideError();
  }

  // Gestion de l'affichage/masquage du mot de passe
  togglePasswordBtn.addEventListener('click', () => {
    const passwordInput = form.querySelector('#mdp');
    const isPassword = passwordInput.type === 'password';
    
    passwordInput.type = isPassword ? 'text' : 'password';
    togglePasswordBtn.innerHTML = isPassword ? 
      `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L12 12m7.071-7.071L21 3m-9 9l2.121 2.121"></path>
      </svg>` :
      `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
      </svg>`;
  });

  // Event listeners pour les onglets et le basculement
  loginTab.addEventListener('click', () => switchMode(true));
  registerTab.addEventListener('click', () => switchMode(false));
  switchModeBtn.addEventListener('click', () => switchMode(!isLoginMode));

  // Fonctions utilitaires
  function showError(message) {
    const errorText = form.querySelector('#errorText');
    errorText.textContent = message;
    errorZone.classList.remove('hidden');
    
    setTimeout(() => {
      errorZone.classList.add('hidden');
    }, 5000);
  }

  function hideError() {
    errorZone.classList.add('hidden');
  }

  function showLoading(show = true) {
    if (show) {
      formElement.classList.add('hidden');
      loadingState.classList.remove('hidden');
    } else {
      loadingState.classList.add('hidden');
      formElement.classList.remove('hidden');
    }
  }

  function getErrorMessage(errorCode) {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return '📧 Cet email est déjà utilisé. Essayez de vous connecter.';
      case 'auth/user-not-found':
        return '👤 Utilisateur non trouvé. Vérifiez votre email.';
      case 'auth/wrong-password':
        return '🔒 Mot de passe incorrect.';
      case 'auth/weak-password':
        return '🔒 Mot de passe trop faible (min. 6 caractères).';
      case 'auth/invalid-email':
        return '📧 Format d\'email invalide.';
      case 'auth/too-many-requests':
        return '⏰ Trop de tentatives. Réessayez plus tard.';
      default:
        return '❌ Une erreur est survenue. Veuillez réessayer.';
    }
  }

  // Gestion de la soumission du formulaire
  formElement.addEventListener("submit", SubmitForm);

  async function SubmitForm(e) {
    e.preventDefault();
    
    const email = form.querySelector('#email').value.trim();
    const password = form.querySelector('#mdp').value;

    // Validation côté client
    if (!email || !password) {
      showError('📝 Veuillez remplir tous les champs.');
      return;
    }

    if (password.length < 6) {
      showError('🔒 Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    hideError();
    showLoading(true);

    try {
      if (isLoginMode) {
        console.log("🔑 Tentative de connexion...");
        await Connexion(email, password);
        console.log("✅ Connexion réussie !");
      } else {
        console.log("📝 Tentative d'inscription...");
        await Authentifi(email, password);
        console.log("✅ Inscription réussie !");
      }

      e.target.reset();
      
    } catch (error) {
      console.error("❌ Erreur:", error.message);
      showError(getErrorMessage(error.code));
    } finally {
      showLoading(false);
    }
  }

  // Initialiser en mode connexion
  switchMode(true);
}

export async function Authentifi(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log("Utilisateur créé:", user.uid);
    return user;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Erreur d'authentification:", errorCode, errorMessage);
    throw error;
  }
}

export async function Connexion(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log("Utilisateur connecté:", user.uid);
    return user;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Erreur de connexion:", errorCode, errorMessage);
    throw error;
  }
}
