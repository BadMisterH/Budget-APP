import { getTransactions } from "./CrudFireStore.js";

export async function Dashboard(elementHtml) {
  const a = await getTransactions();
  let totalRevenu = 0;
  let totalDepenses = 0;

  a.forEach((transaction) => {
    transaction.type === "revenu"
      ? (totalRevenu += transaction.amount)
      : transaction.type === "depenses"
      ? (totalDepenses += transaction.amount)
      : "";
  });
  const solde = totalRevenu - totalDepenses;

  // console.log(solde);

  elementHtml.innerHTML = `
   <div class="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
     <div class="card bg-base-100 shadow-xl">
       <div class="card-body p-4 sm:p-6 lg:p-8">
         <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 lg:mb-8">💰 Tableau de Bord</h1>

         <!-- Stats responsives -->
         <div class="stats stats-vertical sm:stats-horizontal shadow w-full mb-6">
           <div class="stat place-items-center p-4">
             <h3 class="stat-title text-sm sm:text-base">Revenus</h3>
             <div class="stat-value text-primary text-lg sm:text-2xl lg:text-3xl">${parseFloat(totalRevenu).toFixed(2)}€</div>
             <div class="stat-desc text-xs sm:text-sm">↗︎ Entrées</div>
           </div>
           
           <div class="stat place-items-center p-4">
             <h3 class="stat-title text-sm sm:text-base">Dépenses</h3>
             <div class="stat-value text-neutral text-lg sm:text-2xl lg:text-3xl">-${parseFloat(totalDepenses).toFixed(2)}€</div>
             <div class="stat-desc text-xs sm:text-sm">↘︎ Sorties</div>
           </div>
           
          <div class="stat place-items-center p-4">
             <h3 class="stat-title text-sm sm:text-base">Solde</h3>
            <div class="stat-value ${solde >= 0 ? "text-success" : "text-error"} text-lg sm:text-2xl lg:text-3xl">${solde.toFixed(2)}€</div>
            <div class="stat-desc text-xs sm:text-sm ${solde >= 0 ? "text-success/70" : "text-error/70"}">
              ${solde >= 0 ? "Situation positive" : "Situation déficitaire"}
            </div>
           </div>
         </div>

         <!-- Alert responsive -->
         <div class="alert ${solde >= 0 ? "alert-success" : "alert-warning"} mb-6">
           <span class="text-center text-sm sm:text-base lg:text-lg font-semibold">
             ${solde >= 0 ? "✅" : "⚠️"} 
             ${solde >= 0 ? "Félicitations ! Votre situation financière est positive." : "Attention ! Vos dépenses dépassent vos revenus."}
           </span>
         </div>
       </div>

        <!-- Charts Container - Responsive Grid -->
       <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6">
         <!-- Graphique en Camembert -->
         <div class="card bg-gradient-to-br from-primary/10 to-secondary/10 shadow-lg border border-primary/20">
           <div class="card-body p-4 sm:p-6">
             <div class="flex items-center justify-center gap-2 mb-4">
               <span class="text-xl sm:text-2xl">🥧</span>
               <h2 class="text-lg sm:text-xl font-bold">Répartition</h2>
             </div>
             <div class="flex justify-center bg-base-100 rounded-lg p-2 sm:p-4">
               <canvas id="pieChart" class="max-w-full h-auto"></canvas>
             </div>
             <div class="text-center mt-3">
               <div class="badge badge-primary badge-sm">Vue d'ensemble</div>
             </div>
           </div>
         </div>

         <!-- Graphique en Barres -->
         <div class="card bg-gradient-to-br from-accent/10 to-info/10 shadow-lg border border-accent/20">
           <div class="card-body">
             <div class="flex items-center justify-center gap-2 mb-4">
               <span class="text-2xl">📊</span>
               <h2 class="card-title text-xl font-bold">Comparaison</h2>
             </div>
             <div class="flex justify-center bg-base-100 rounded-lg p-4">
               <canvas id="barChart" width="280" height="280"></canvas>
             </div>
             <div class="text-center mt-3">
               <div class="badge badge-neutral badge-sm">Analyse détaillée</div>
             </div>
           </div>
         </div>
       </div>
     </div>
   </div>
  `;

  setTimeout(() => {
    createCharts(totalRevenu, totalDepenses);
  }, 100);
  function createCharts(revenus, depenses) {
    // Configuration commune - Couleurs personnalisées
    const colors = {
      revenus: "#ff7ac6", // Rose primary du thème synthwave
      depenses: "oklch(45% 0.24 277.023)", // Bleu personnalisé pour les dépenses
    };

    // Debug: vérifier les valeurs
    console.log("Données graphiques:", { revenus, depenses });

    // S'assurer que les valeurs ne sont pas nulles/undefined
    const revenusSafe = revenus || 0;
    const depensesSafe = depenses || 0;

    // Graphique en Camembert
    const pieCtx = document.getElementById("pieChart");
    if (pieCtx) {
      new Chart(pieCtx, {
        type: "doughnut",
        data: {
          labels: ["Revenus", "Dépenses"],
          datasets: [
            {
              data: [revenusSafe, depensesSafe],
              backgroundColor: [colors.revenus, colors.depenses],
              borderWidth: 3,
              borderColor: "#ffffff",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                padding: 20,
                usePointStyle: true,
                font: {
                  size: 14,
                  color: "#ffffff"
                },
              },
            },
          },
          cutout: "60%",
        },
      });
    }

    // Graphique en Barres
    const barCtx = document.getElementById("barChart");
    if (barCtx) {
      new Chart(barCtx, {
        type: "bar",
        data: {
          labels: ["Revenus", "Dépenses"],
          datasets: [
            {
              label: "Montant (€)",
              data: [revenusSafe, depensesSafe],
              backgroundColor: [colors.revenus, colors.depenses],
              borderRadius: 8,
              borderSkipped: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function (value) {
                  return value + "€";
                },
              },
            },
          },
        },
      });
    }
  }
}
