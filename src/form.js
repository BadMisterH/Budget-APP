import { addTransaction } from "./CrudFireStore.js";

export function form(formElement) {
  formElement.innerHTML += `
   <form id="expense-form" class="transform translate-x-[-50%] translate-y-[40%] flex w-full absolute left-3/6 top-3/6  flex-col gap-4 p-6 bg-base-200 rounded-lg shadow-md max-w-md">
      <div class="flex gap-2">
         <button data-type="depenses" type="button" class="btn btn-error flex-1">Dépenses</button>
         <button data-type="revenu" type="button" class="btn btn-accent flex-1">Revenu</button>
      </div>
      <input class="input input-bordered w-full" type="number" placeholder="Montant en (€)" name="amount" id="amount" min="0" step="0.01">

    <select name="category" id="category" class="select select-bordered w-full" >
        <option value="">Choisir une catégorie </option>
    </select>
    <textarea id="description" name="description" id="description" class="textarea textarea-bordered w-full" placeholder="Description de la transaction..." rows="3"></textarea>
    <input type="submit" value="Ajouter" class="btn btn-primary w-full">
    </form>
`;

  const categorySelected = document.getElementById("category");
  const buttons = document.querySelectorAll("button[data-type]");

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
      form.reset();
      seletedChoise("depenses");
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
}
