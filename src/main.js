import "./style.css";
import { form } from "./form.js";
import { Nav } from "./Nav.js";
import { AffichageTransaction } from "./AffichageTransaction.js";
import { Dashboard } from "../Dashboard.js";
import "./pwa-install.js";

// Enregistrement du Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

document.querySelector("#app").innerHTML = `
  <div class="w-full flex justify-center items-center border-red-600" id="navigation"></div>
    <div id="main-content"></div>

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

  if (ClickElementNav == "transactions") {
    mainContent.innerHTML = `
    <div class=" z-10 flex flex-col w-1/2 mx-auto justify-center items-center mt-3" id="form-container">
  `;
    form(document.querySelector("#form-container"));
  } else if (ClickElementNav == "dashboard") {
    mainContent.innerHTML = `
      <div id="Dash" class=" hero min-h-96 bg-base-200 rounded-lg">
      </div>
      `;
    Dashboard(document.getElementById("Dash"));
  } else if (ClickElementNav == "analytics") {
    mainContent.innerHTML = `
    <div class="flex flex-col w-2/3 m-auto gap-4 bg-base-200 mt-20 py-7 px-2" id="transaction"></div>
  `;
    AffichageTransaction(document.getElementById("transaction"));
  }
}
