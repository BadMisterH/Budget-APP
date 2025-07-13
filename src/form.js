import { addTransaction } from "./CrudFireStore.js";

export function form(formElement) {
  formElement.innerHTML += `
   <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
     <form id="expense-form" class="w-full max-w-md lg:max-w-2xl bg-base-100 rounded-3xl shadow-2xl border border-base-300 p-6 lg:p-10 space-y-6 lg:space-y-8 transform transition-all duration-300 scale-100">
       <!-- Header avec animation amélioré desktop -->
       <div class="text-center space-y-2 lg:space-y-4">
         <div class="text-4xl lg:text-6xl mb-2 lg:mb-4">💰</div>
         <h2 class="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
           Nouvelle Transaction
         </h2>
         <p class="text-sm lg:text-lg text-base-content/60">Gérez vos finances en toute simplicité</p>
       </div>

       <!-- Type Selection avec design amélioré desktop -->
       <div class="grid grid-cols-2 gap-3 lg:gap-6">
         <button data-type="depenses" type="button" class="btn btn-outline btn-error hover:btn-error group transition-all duration-200 lg:btn-lg lg:text-lg lg:shadow-lg lg:hover:shadow-xl lg:hover:scale-105">
           <span class="group-hover:scale-110 transition-transform lg:text-2xl">💸</span>
           Dépenses
         </button>
         <button data-type="revenu" type="button" class="btn btn-outline btn-success hover:btn-success group transition-all duration-200 lg:btn-lg lg:text-lg lg:shadow-lg lg:hover:shadow-xl lg:hover:scale-105">
           <span class="group-hover:scale-110 transition-transform lg:text-2xl">💰</span>
           Revenu
         </button>
       </div>

       <!-- Amount Input avec style amélioré desktop -->
       <div class="form-control">
         <label class="label">
           <span class="label-text font-semibold flex items-center gap-2 lg:text-lg">
             <span class="text-lg lg:text-2xl">💳</span>
             Montant
           </span>
         </label>
         <div class="relative">
           <input 
             class="input input-bordered w-full text-xl lg:text-2xl font-mono pl-8 lg:pl-12 focus:input-primary transition-all duration-200 lg:input-lg lg:shadow-lg" 
             type="number" 
             placeholder="0.00" 
             name="amount" 
             id="amount" 
             min="0" 
             step="0.01"
             required
           >
           <span class="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 text-base-content/50 font-bold lg:text-xl">€</span>
         </div>
       </div>

       <!-- Category Selection avec style amélioré desktop -->
       <div class="form-control">
         <label class="label">
           <span class="label-text font-semibold flex items-center gap-2 lg:text-lg">
             <span class="text-lg lg:text-2xl">🏷️</span>
             Catégorie
           </span>
         </label>
         <select name="category" id="category" class="select select-bordered w-full focus:select-primary transition-all duration-200 lg:select-lg lg:text-lg lg:shadow-lg" required>
           <option value="">Choisir une catégorie</option>
         </select>
       </div>

       <!-- Description avec style amélioré desktop -->
       <div class="form-control">
         <label class="label">
           <span class="label-text font-semibold flex items-center gap-2 lg:text-lg">
             <span class="text-lg lg:text-2xl">📝</span>
             Description
           </span>
         </label>
         <textarea 
           id="description" 
           name="description" 
           class="textarea textarea-bordered w-full resize-none focus:textarea-primary transition-all duration-200 lg:textarea-lg lg:text-lg lg:shadow-lg" 
           placeholder="Décrivez votre transaction..." 
           rows="3"
           required
         ></textarea>
       </div>

       <!-- Actions avec design moderne desktop -->
       <div class="flex gap-3 lg:gap-6 pt-4 lg:pt-6">
         <button type="button" id="cancelBtn" class="btn btn-ghost flex-1 hover:bg-base-200 lg:btn-lg lg:text-lg lg:shadow-lg lg:hover:shadow-xl">
           <span class="text-lg lg:text-2xl">✕</span>
           Annuler
         </button>
         <button type="submit" class="btn btn-primary flex-1 hover:scale-105 transition-transform duration-200 lg:btn-lg lg:text-lg lg:shadow-lg lg:hover:shadow-xl">
           <span class="text-lg lg:text-2xl">✓</span>
           Ajouter
         </button>
       </div>
     </form>
   </div>
`;

  const categorySelected = document.getElementById("category");
  const buttons = document.querySelectorAll("button[data-type]");
  const cancelBtn = document.getElementById("cancelBtn");
  const formModal = formElement.querySelector('.fixed');

  // Variable pour stocker le gestionnaire d'événement Échap
  let escapeHandler;

  // Fonction pour fermer le formulaire
  function closeForm() {
    // Retirer le gestionnaire d'événement Échap
    if (escapeHandler) {
      document.removeEventListener('keydown', escapeHandler);
    }
    
    // Vider le contenu du formulaire
    formElement.innerHTML = '';
    
    // Retourner à la page analytics
    const analyticsLink = document.querySelector('[data-page="analytics"]');
    if (analyticsLink) {
      analyticsLink.click();
    }
  }

  // Gestionnaire pour le bouton Annuler
  if (cancelBtn) {
    cancelBtn.addEventListener('click', closeForm);
  }

  // Gestionnaire pour fermer en cliquant sur l'arrière-plan
  if (formModal) {
    formModal.addEventListener('click', (e) => {
      // Fermer seulement si on clique sur l'arrière-plan (pas sur le formulaire)
      if (e.target === formModal) {
        closeForm();
      }
    });
  }

  // Gestionnaire pour fermer avec la touche Échap
  escapeHandler = (e) => {
    if (e.key === 'Escape') {
      closeForm();
    }
  };
  document.addEventListener('keydown', escapeHandler);

  const categories = {
    revenu: [
      { value: "salaire", label: "💼 Salaire" },
      { value: "prime", label: "🎁 Prime" },
      { value: "vente", label: "🛍️ Vente" },
      { value: "autres", label: "📦 Autres revenus" },
    ],
    depenses: [
      { value: "logement", label: "🏠 Logement" },
      { value: "nourriture", label: "🍽️ Nourriture" },
      { value: "transport", label: "🚗 Transport" },
      { value: "loisir", label: "🎮 Loisir" },
      { value: "sante", label: "🩺 Santé" },
      { value: "autres", label: "📦 Autres dépenses" },
    ],
  };

  let selectedType = "depenses"; // Type de transaction sélectionné par défaut

  buttons.forEach((elementBtn) => {
    elementBtn.addEventListener("click", () => {
      selectedType = elementBtn.dataset.type;
      
      // Réinitialiser tous les boutons à l'état non sélectionné
      buttons.forEach((b) => {
        b.classList.remove("btn-success", "btn-error", "btn-outline");
        b.classList.add("btn-outline");
        if (b.dataset.type === "depenses") {
          b.classList.add("btn-error");
        } else {
          b.classList.add("btn-success");
        }
      });
      
      // Activer le bouton sélectionné
      const typeCategorie = elementBtn.dataset.type;
      ColorButton(elementBtn, typeCategorie);
      seletedChoise(typeCategorie);
    });
  });

  //changer l'etat du bouton en fonction de la catégorie
  function ColorButton(button, typeCategorie) {
    // Retirer l'état outline et ajouter l'état actif
    button.classList.remove("btn-outline");
    
    if (typeCategorie === "depenses") {
      button.classList.add("btn-error"); // État actif pour dépenses
    } else if (typeCategorie === "revenu") {
      button.classList.add("btn-success"); // État actif pour revenus
    }
  }

  function seletedChoise(typeCategorie) {
    // Vider et remplir le select avec les catégories appropriées
    categorySelected.innerHTML =
      '<option value="">Choisir une catégorie</option>';
    categories[typeCategorie].forEach((ele) => {
      const option = document.createElement("option");
      option.value = ele.value;
      option.textContent = ele.label;
      categorySelected.appendChild(option);
    });

    // if (typeCategorie === "revenu") {
    //   console.log("Mode Revenu sélectionné");
    // } else {
    //   console.log("Mode Dépenses sélectionné");
    // }
  }

  // Initialiser avec "depenses" par défaut
  seletedChoise("depenses");
  
  // Initialiser l'état visuel du bouton par défaut
  const defaultButton = document.querySelector('button[data-type="depenses"]');
  if (defaultButton) {
    ColorButton(defaultButton, "depenses");
  }
  // Ajouter le gestionnaire d'événements pour preventDefault
  const form = formElement.querySelector("#expense-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const amount = formData.get("amount");
    const description = formData.get("description");
    const cate = formData.get("category");

    // const category = formData.get("category");
    const typeActuel = document.querySelector("button[data-type].btn-error")
      ? "depenses"
      : document.querySelector("button[data-type].btn-success")
      ? "revenu"
      : "depenses";

    console.log(typeActuel);


    const transaction = {
      categories: cate,
      type: selectedType,
      amount: parseFloat(amount),
      description: description,
      date: new Date().toISOString().split("T")[0], // Date au format YYYY-MM-DD
    };

    try {
      await addTransaction(transaction);
      console.log("Transaction sauvegardée dans Firebase!");
      
      // Afficher un message de succès
      showSuccessMessage("Transaction ajoutée avec succès ! 🎉");
      
      // Fermer le formulaire après succès
      setTimeout(() => {
        closeForm();
      }, 1500);
      
      // Déclencher l'événement pour mettre à jour les autres vues
      window.dispatchEvent(
        new CustomEvent("transactionAdded", {
          detail: { transaction },
        })
      );
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      alert("Erreur lors de la sauvegarde de la transaction");
    }
  });

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
      successDiv.remove();
    }, 3000);
  }
}
