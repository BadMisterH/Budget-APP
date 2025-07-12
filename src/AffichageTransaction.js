import { getTransactions, supprimerTransaction } from "./CrudFireStore.js";

export function AffichageTransaction(transactionsList) {
  transactionsList.innerHTML = `
      <div class="container mx-auto p-4 sm:p-6 lg:p-8 max-w-6xl space-y-6">
        <!-- Header moderne avec gradient -->
        <div class="text-center space-y-4">
          <div class="text-6xl mb-4">📈</div>
          <h2 class="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Analyse Financière
          </h2>
          <p class="text-base-content/60">Gérez vos finances au quotidien</p>
        </div>
        <div id="transactions-list" class="space-y-4">
          <p class="text-center text-base-content/60 py-8">Ajoutez une transaction pour commencer...</p>
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
          <div class="hero min-h-64 sm:min-h-80">
            <div class="hero-content text-center">
              <div class="max-w-md px-4">
                <div class="text-4xl sm:text-6xl mb-4">💳</div>
                <h3 class="text-lg sm:text-xl lg:text-2xl font-semibold mb-2">Aucune transaction</h3>
                <p class="text-sm sm:text-base text-base-content/60 mb-4">Commencez par ajouter votre première transaction pour voir vos finances ici.</p>
                <div class="stats shadow w-full max-w-xs">
                  <div class="stat place-items-center">
                    <div class="stat-title text-xs sm:text-sm">Solde actuel</div>
                    <div class="stat-value text-lg sm:text-2xl">0,00€</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        return;
      }
      transactionsList2.innerHTML = transactions
        .map((transaction) => {
          return `
          <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300/50 hover:border-primary/30">
            <div class="card-body p-4 sm:p-6">
              <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <!-- Info principale -->
                <div class="flex items-center gap-4 flex-1">
                  <div class="p-3 rounded-full ${transaction.type === 'revenu' ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}">
                    <span class="text-xl">${transaction.type === 'revenu' ? '📈' : '📉'}</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-bold text-base sm:text-lg truncate mb-1">${transaction.description}</h3>
                    <div class="flex flex-wrap items-center gap-2">
                      <div class="badge badge-${transaction.type === 'revenu' ? 'success' : 'error'} badge-sm">
                        ${transaction.type === 'revenu' ? 'Revenu' : 'Dépense'}
                      </div>
                      <span class="text-xs text-base-content/60">
                        ${new Date(transaction.date).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </div>
                </div>
                
                <!-- Montant et actions -->
                <div class="flex items-center justify-between sm:justify-end gap-4">
                  <div class="text-right">
                    <div class="font-bold text-xl ${transaction.type === "depenses" ? "text-error" : "text-success"}">
                      ${transaction.type === "depenses" ? `-${parseFloat(transaction.amount).toFixed(2)}€` : `+${parseFloat(transaction.amount).toFixed(2)}€`}
                    </div>
                  </div>
                  <button data-action="delete" data-transaction-id="${transaction.id}" 
                          class="btn btn-ghost btn-sm btn-circle text-error hover:bg-error/20 hover:scale-110 transition-all duration-200">
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
