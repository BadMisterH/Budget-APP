import { getTransactions, supprimerTransaction } from "./CrudFireStore.js";

export function AffichageTransaction(transactionsList) {
  transactionsList.innerHTML = `
      <div class="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl space-y-6 lg:space-y-10">
        <!-- Header moderne avec gradient desktop amélioré -->
        <div class="text-center space-y-4 lg:space-y-6">
          <div class="text-4xl lg:text-8xl mb-4">📈</div>
          <h2 class="text-2xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Analyse Financière
          </h2>
          <p class="text-sm sm:text-base lg:text-xl text-base-content/60">Gérez vos finances au quotidien</p>
        </div>
        
        <!-- Container des transactions avec design desktop amélioré -->
        <div id="transactions-list" class="space-y-4 lg:space-y-6">
          <p class="text-center text-base-content/60 py-8 lg:py-16 text-sm lg:text-lg">Ajoutez une transaction pour commencer...</p>
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
          <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300/50 hover:border-primary/30 lg:hover:scale-[1.02]">
            <div class="card-body p-4 sm:p-6 lg:p-8">
              <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 lg:gap-8">
                <!-- Info principale avec design desktop amélioré -->
                <div class="flex items-center gap-4 lg:gap-6 flex-1">
                  <div class="p-3 lg:p-4 rounded-full ${transaction.type === 'revenu' ? 'bg-success/20 text-success' : 'bg-error/20 text-error'} lg:shadow-lg">
                    <span class="text-xl lg:text-3xl">${transaction.type === 'revenu' ? '📈' : '📉'}</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-bold text-base sm:text-lg lg:text-2xl truncate mb-1 lg:mb-3">${transaction.description}</h3>
                    <div class="flex flex-wrap items-center gap-2 lg:gap-4">
                      <div class="badge badge-${transaction.type === 'revenu' ? 'success' : 'error'} badge-sm lg:badge-lg lg:text-base">
                        ${transaction.type === 'revenu' ? '💰 Revenu' : '💸 Dépense'}
                      </div>
                      <span class="text-xs lg:text-sm text-base-content/60 lg:font-medium">
                        ${new Date(transaction.date).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </div>
                </div>
                
                <!-- Montant et actions avec design desktop amélioré -->
                <div class="flex items-center justify-between sm:justify-end gap-4 lg:gap-8">
                  <div class="text-right">
                    <div class="font-bold text-xl lg:text-3xl ${transaction.type === "depenses" ? "text-error" : "text-success"}">
                      ${transaction.type === "depenses" ? `-${parseFloat(transaction.amount).toFixed(2)}€` : `+${parseFloat(transaction.amount).toFixed(2)}€`}
                    </div>
                  </div>
                  <button data-action="delete" data-transaction-id="${transaction.id}" 
                          class="btn btn-ghost btn-sm lg:btn-md btn-circle text-error hover:bg-error/20 hover:scale-110 transition-all duration-200 lg:shadow-lg lg:hover:shadow-xl">
                    <i data-lucide="trash-2" class="w-4 h-4 lg:w-6 lg:h-6"></i>
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
