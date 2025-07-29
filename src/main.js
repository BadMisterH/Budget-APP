import "./style.css";
import { form } from "./form.js";
import { Nav } from "./Nav.js";
import { AffichageTransaction } from "./AffichageTransaction.js";
import { Dashboard } from "./Dashboard.js";
import { Calendar } from "./Calendar.js";
import "./pwa-install.js";
import { auth } from "../firebase-config.js";
import { onAuthStateChanged } from "firebase/auth";
import { formTraitement } from "./FormAuth.js";

onAuthStateChanged(auth, (user) => {
  if (user) {
    // ✅ UTILISATEUR CONNECTÉ
    console.log("✅ Utilisateur connecté:", user.email);
    showApp(); // Afficher l'app
  } else {
    // ❌ UTILISATEUR PAS CONNECTÉ
    console.log("❌ Aucun utilisateur connecté");
    showLogin(); // Afficher l'écran de connexion
  }
});

function showApp() {
  return All()
}

function showLogin() {
  formTraitement(document.querySelector("#app"));
}

// Enregistrement du Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        // console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        // console.log("SW registration failed: ", registrationError);
      });
  });
}

function All() {
  document.querySelector("#app").innerHTML = `
  <div class="min-h-screen bg-base-200">
    <div id="navigation" class="sticky top-0 z-50"></div>
    <main id="main-content" class="min-h-[calc(100vh-4rem)]"></main>
  </div>
`;

  // form(document.querySelector("#form-container"));
  Nav(document.querySelector("#navigation"));

  const navLinks = document.querySelectorAll(".nav-link");
  // console.log(navLinks);

  navLinks.forEach((element) => {
    element.addEventListener("click", () => {
      // Mettre à jour les styles de navigation
      navLinks.forEach((link) => {
        link.classList.remove("btn-primary");
        link.classList.add("btn-ghost");
      });
      element.classList.remove("btn-ghost");
      element.classList.add("btn-primary");

      NavTableauElement(element);
    });
  });

  // Initialiser avec le tableau de bord par défaut
  document.addEventListener("DOMContentLoaded", () => {
    const dashboardLink = document.querySelector('[data-page="dashboard"]');
    if (dashboardLink) {
      // Mettre le style actif sur dashboard
      dashboardLink.classList.remove("btn-ghost");
      dashboardLink.classList.add("btn-primary");
      // Afficher le tableau de bord
      NavTableauElement(dashboardLink);
    }
  });

  // Afficher immédiatement le tableau de bord
  const dashboardElement = { dataset: { page: "dashboard" } };
  NavTableauElement(dashboardElement);

  function NavTableauElement(element) {
    const ClickElementNav = element.dataset.page;
    const mainContent = document.querySelector("#main-content");

    // Supprimer le bouton flottant existant s'il y en a un
    const existingFab = document.querySelector("#fab-button");
    if (existingFab) existingFab.remove();

    if (ClickElementNav == "transactions") {
      mainContent.innerHTML = `
      <div class="container mx-auto p-4" id="form-container"></div>
    `;
      form(document.querySelector("#form-container"));
    } else if (ClickElementNav == "dashboard") {
      mainContent.innerHTML = `
      <div id="Dash" class="min-h-screen"></div>
    `;
      Dashboard(document.getElementById("Dash"));
    } else if (ClickElementNav == "calendar") {
      mainContent.innerHTML = `
      <div id="Calendar" class="min-h-screen"></div>
    `;
      Calendar(document.getElementById("Calendar"));
    } else if (ClickElementNav == "analytics") {
      mainContent.innerHTML = `
      <div id="transaction" class="min-h-screen"></div>
      <!-- Bouton flottant pour ajouter une transaction -->
      <div id="fab-button" class="fixed bottom-6 right-6 z-40">
        <button class="btn btn-circle btn-primary btn-lg shadow-lg hover:shadow-xl transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    `;
      AffichageTransaction(document.getElementById("transaction"));

      // Ajouter l'événement au bouton flottant
      document
        .querySelector("#fab-button button")
        .addEventListener("click", () => {
          // Naviguer vers la page transactions
          document.querySelector('[data-page="transactions"]').click();
        });
    }
  }
}
