import { getTransactions, supprimerTransaction } from "./CrudFireStore.js";

export function AffichageTransaction(transactionsList) {
  transactionsList.innerHTML = `
      <div class="space-y-4">
        <h2 class=" mb-4 text-center m-auto text-2xl font-bold">💰 Mes Transactions</h2>
        <div id="transactions-list">
          <p class="text-gray-500 text text-center">Ajoutez une transaction pour commencer...</p>
        </div>
      </div>
    `;

  const transactionsList2 =
    transactionsList.querySelector("#transactions-list");

  async function chargerTransactions() {
    lucide.createIcons();

    try {
      const transactions = await getTransactions();
      //dire qu'il y a aucnne transaction
      if (!transactions || transactions.length === 0) {
        transactionsList2.innerHTML = `
          <div class="text-center py-12">
            <div class="text-6xl mb-4">💳</div>
            <h3 class="text-xl font-semibold mb-2">Aucune transaction</h3>
            <p class="text-base-content/60">Ajoutez votre première transaction</p>
          </div>
        `;
        return;
      }
      transactionsList2.innerHTML = transactions
        .map((transaction) => {
          return `
          <div class="card bg-base-100 shadow-sm mb-3">
            <div class="card-body p-4">
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-3">
                  <span class="text-2xl">${transaction.amount >= 0 ? '💰' : '�'}</span>
                  <div>
                    <h3 class="font-semibold">${transaction.description}</h3>
                    <div class="bg-black badge badge-${transaction.type === 'revenu' ? 'success' : 'error'} badge-sm">
                      ${transaction.type}
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <span class="font-bold text-lg ${transaction.type === "depenses" ? "text-error" : "text-success"}">
                  ${transaction.type === "depenses" ? `-${parseFloat(transaction.amount).toFixed(2)}` : `${parseFloat(transaction.amount).toFixed(2)}`}
                  </span>
                  <button data-action="delete" data-transaction-id="${transaction.id}" 
                          class="btn btn-ghost btn-sm btn-circle text-error">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
        })
        .join("");

      // Réinitialiser les icônes Lucide après avoir injecté le HTML
      lucide.createIcons();

      document.querySelectorAll('[data-action="delete"]').forEach((button) => {
        button.addEventListener("click", async (e) => {
          e.preventDefault();
          const transactionId =
            e.target.closest("button").dataset.transactionId;
          console.log("ID de transaction récupéré:", transactionId);
          if (!transactionId) {
            console.error("Aucun ID de transaction trouvé!");
            return;
          }

          try {
            await supprimerTransaction(transactionId);
            console.log("Suppression réussie, rechargement...");
            await chargerTransactions();
          } catch (error) {
            console.error("Erreur lors de la suppression:", error);
          }
        });
      });
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
      transactionsList2.innerHTML = `
        <div class="alert alert-error">
          <span>Erreur lors du chargement des transactions</span>
        </div>
      `;
    }
  }

  window.addEventListener("transactionAdded", () => {
    console.log("Nouvelle transaction détectée, rechargement...");
    chargerTransactions();
  });
  chargerTransactions();
}
