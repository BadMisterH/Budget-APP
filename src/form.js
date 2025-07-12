import { addTransaction } from "./CrudFireStore.js";

export function form(formElement) {
  formElement.innerHTML += `
   <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
     <form id="expense-form" class="w-full max-w-sm sm:max-w-md lg:max-w-lg bg-base-200 rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
       <!-- Header -->
       <div class="text-center mb-4 sm:mb-6">
         <h2 class="text-xl sm:text-2xl font-bold">💰 Nouvelle Transaction</h2>
         <p class="text-sm text-base-content/60 mt-1">Ajoutez vos revenus ou dépenses</p>
       </div>

       <!-- Type Selection -->
       <div class="grid grid-cols-2 gap-2 sm:gap-3">
         <button data-type="depenses" type="button" class="btn btn-error btn-sm sm:btn-md flex-1">
           💸 Dépenses
         </button>
         <button data-type="revenu" type="button" class="btn btn-accent btn-sm sm:btn-md flex-1">
           💰 Revenu
         </button>
       </div>

       <!-- Amount Input -->
       <div class="form-control">
         <label class="label">
           <span class="label-text font-medium">Montant</span>
         </label>
         <input 
           class="input input-bordered w-full text-lg" 
           type="number" 
           placeholder="0.00" 
           name="amount" 
           id="amount" 
           min="0" 
           step="0.01"
           required
         >
       </div>

       <!-- Category Selection -->
       <div class="form-control">
         <label class="label">
           <span class="label-text font-medium">Catégorie</span>
         </label>
         <select name="category" id="category" class="select select-bordered w-full" required>
           <option value="">Choisir une catégorie</option>
         </select>
       </div>

       <!-- Description -->
       <div class="form-control">
         <label class="label">
           <span class="label-text font-medium">Description</span>
         </label>
         <textarea 
           id="description" 
           name="description" 
           class="textarea textarea-bordered w-full resize-none" 
           placeholder="Décrivez votre transaction..." 
           rows="3"
           required
         ></textarea>
       </div>

       <!-- Actions -->
       <div class="grid grid-cols-2 gap-2 sm:gap-3 pt-2">
         <button type="button" id="cancelBtn" class="btn btn-ghost btn-sm sm:btn-md">
           Annuler
         </button>
         <button type="submit" class="btn btn-primary btn-sm sm:btn-md">
           ✓ Ajouter
         </button>
       </div>
     </form>
   </div>
`;

  const categorySelected = document.getElementById("category");
  const buttons = document.querySelectorAll("button[data-type]");
  const cancelBtn = document.getElementById("cancelBtn");
  const formModal = formElement.querySelector('.fixed');
  const expenseForm = document.getElementById("expense-form");

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
      buttons.forEach((b) => {
        b.classList.remove("btn-success", "btn-error", "btn-active");
        b.classList.add("btn-accent");
      });
      const typeCategorie = elementBtn.dataset.type;

      categories[typeCategorie].forEach((ele) => {
        const option = document.createElement("option");
        option.value = ele.value;
        option.textContent = ele.label;
        categorySelected.appendChild(option);
      });

      ColorButton(elementBtn, typeCategorie);
      seletedChoise(typeCategorie);
    });
  });


  //changer l'etat du bouton en fonction de la catégorie
  function ColorButton(button, typeCategorie) {
    if (typeCategorie === "depenses") {
      button.classList.remove("btn-accent");
      button.classList.add("btn-error");
    } else if (typeCategorie === "revenu") {
      button.classList.remove("btn-accent");
      button.classList.add("btn-error");
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
