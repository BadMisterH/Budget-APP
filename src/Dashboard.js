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

  console.log(solde);

  elementHtml.innerHTML = `
   <div class="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
     <!-- Header avec meilleure hiérarchie desktop -->
     <div class="text-center mb-6 lg:mb-10">
       <div class="text-4xl lg:text-6xl mb-4">📊</div>
       <h1 class="text-2xl sm:text-3xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
         Tableau de Bord
       </h1>
       <p class="text-sm sm:text-base lg:text-lg text-base-content/60">Vue d'ensemble de vos finances</p>
     </div>

     <!-- Stats avec meilleur layout desktop -->
     <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 mb-6 lg:mb-10">
       <!-- Card Revenus -->
       <div class="card bg-gradient-to-br from-success/10 to-success/20 border border-success/30 shadow-lg hover:shadow-xl transition-all duration-300 lg:hover:scale-105">
         <div class="card-body text-center p-4 lg:p-8">
           <div class="text-3xl lg:text-5xl mb-2 lg:mb-4">📈</div>
           <h3 class="text-sm sm:text-base lg:text-xl font-semibold text-success mb-2">Revenus</h3>
           <div class="text-lg sm:text-2xl lg:text-4xl font-bold text-success">${parseFloat(totalRevenu).toFixed(2)}€</div>
           <p class="text-xs sm:text-sm lg:text-base text-success/70 mt-2">↗︎ Entrées d'argent</p>
         </div>
       </div>

       <!-- Card Dépenses -->
       <div class="card bg-gradient-to-br from-error/10 to-error/20 border border-error/30 shadow-lg hover:shadow-xl transition-all duration-300 lg:hover:scale-105">
         <div class="card-body text-center p-4 lg:p-8">
           <div class="text-3xl lg:text-5xl mb-2 lg:mb-4">📉</div>
           <h3 class="text-sm sm:text-base lg:text-xl font-semibold text-error mb-2">Dépenses</h3>
           <div class="text-lg sm:text-2xl lg:text-4xl font-bold text-error">${parseFloat(totalDepenses).toFixed(2)}€</div>
           <p class="text-xs sm:text-sm lg:text-base text-error/70 mt-2">↘︎ Sorties d'argent</p>
         </div>
       </div>

       <!-- Card Solde -->
       <div class="card bg-gradient-to-br ${solde >= 0 ? 'from-info/10 to-info/20 border-info/30' : 'from-warning/10 to-warning/20 border-warning/30'} border shadow-lg hover:shadow-xl transition-all duration-300 lg:hover:scale-105">
         <div class="card-body text-center p-4 lg:p-8">
           <div class="text-3xl lg:text-5xl mb-2 lg:mb-4">${solde >= 0 ? '💰' : '⚠️'}</div>
           <h3 class="text-sm sm:text-base lg:text-xl font-semibold ${solde >= 0 ? 'text-info' : 'text-warning'} mb-2">Solde</h3>
           <div class="text-lg sm:text-2xl lg:text-4xl font-bold ${solde >= 0 ? 'text-info' : 'text-warning'}">${solde.toFixed(2)}€</div>
           <p class="text-xs sm:text-sm lg:text-base ${solde >= 0 ? 'text-info/70' : 'text-warning/70'} mt-2">
             ${solde >= 0 ? 'Situation positive' : 'Attention au budget'}
           </p>
         </div>
       </div>
     </div>

     <!-- Message de statut avec design amélioré desktop -->
     <div class="card ${solde >= 0 ? 'bg-success/10 border-success/30' : 'bg-warning/10 border-warning/30'} border shadow-lg mb-6 lg:mb-10">
       <div class="card-body text-center p-4 lg:p-8">
         <div class="text-3xl lg:text-5xl mb-2 lg:mb-4">${solde >= 0 ? '🎉' : '💡'}</div>
         <h3 class="text-lg lg:text-2xl font-bold mb-2 lg:mb-4 ${solde >= 0 ? 'text-success' : 'text-warning'}">
           ${solde >= 0 ? 'Félicitations !' : 'Conseil Financier'}
         </h3>
         <p class="text-sm sm:text-base lg:text-lg ${solde >= 0 ? 'text-success/80' : 'text-warning/80'}">
           ${solde >= 0 
             ? 'Votre situation financière est excellente. Continuez sur cette lancée !' 
             : 'Vos dépenses dépassent vos revenus. Pensez à optimiser votre budget.'}
         </p>
       </div>
     </div>

     <!-- Charts Container avec meilleur layout desktop -->
     <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-10">
       <!-- Graphique en Camembert amélioré -->
       <div class="card bg-gradient-to-br from-primary/5 to-primary/15 border border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-300">
         <div class="card-body p-4 sm:p-6 lg:p-8">
           <div class="flex items-center justify-center gap-3 mb-4 lg:mb-8">
             <div class="p-2 lg:p-3 bg-primary/20 rounded-full">
               <span class="text-xl sm:text-2xl lg:text-3xl">🥧</span>
             </div>
             <h2 class="text-lg sm:text-xl lg:text-2xl font-bold text-primary">Répartition</h2>
           </div>
           <div class="bg-base-100 rounded-xl p-2 sm:p-4 lg:p-6 shadow-inner">
             <div class="h-64 lg:h-80 flex items-center justify-center">
               <canvas id="pieChart" class="max-w-full max-h-full"></canvas>
             </div>
           </div>
           <div class="text-center mt-3 lg:mt-6">
             <div class="badge badge-primary lg:badge-lg">Vue d'ensemble</div>
           </div>
         </div>
       </div>

       <!-- Graphique en Barres amélioré -->
       <div class="card bg-gradient-to-br from-secondary/5 to-secondary/15 border border-secondary/20 shadow-xl hover:shadow-2xl transition-all duration-300">
         <div class="card-body p-4 sm:p-6 lg:p-8">
           <div class="flex items-center justify-center gap-3 mb-4 lg:mb-8">
             <div class="p-2 lg:p-3 bg-secondary/20 rounded-full">
               <span class="text-xl sm:text-2xl lg:text-3xl">📊</span>
             </div>
             <h2 class="text-lg sm:text-xl lg:text-2xl font-bold text-secondary">Comparaison</h2>
           </div>
           <div class="bg-base-100 rounded-xl p-2 sm:p-4 lg:p-6 shadow-inner">
             <div class="h-64 lg:h-80 flex items-center justify-center">
               <canvas id="barChart" class="max-w-full max-h-full"></canvas>
             </div>
           </div>
           <div class="text-center mt-3 lg:mt-6">
             <div class="badge badge-secondary lg:badge-lg">Analyse détaillée</div>
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
    // Configuration commune
    const colors = {
      revenus: "#22c55e", // Vert
      depenses: "#ef4444", // Rouge
    };

    // Graphique en Camembert
    const pieCtx = document.getElementById("pieChart");
    if (pieCtx) {
      new Chart(pieCtx, {
        type: "doughnut",
        data: {
          labels: ["Revenus", "Dépenses"],
          datasets: [
            {
              data: [revenus, depenses],
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
              data: [revenus, depenses],
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
