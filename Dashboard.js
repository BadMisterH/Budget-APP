import { getTransactions } from "./src/CrudFireStore.js";

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
   <div class="card bg-base-100 shadow-xl mx-auto my-10 w-2/3">
     <div class="card-body">
       <h1 class="card-title text-3xl justify-center mb-6">💰 Tableau de Bord</h1>

       <div class="stats stats-vertical lg:stats-horizontal shadow">
         <div class="stat place-items-center">
           <h3 class="stat-title">Revenus</h3>
           <div class="stat-value text-success">${parseFloat(
             totalRevenu
           ).toFixed(2)}€</div>
           <div class="stat-desc">↗︎ Entrées</div>
         </div>
         
         <div class="stat place-items-center">
           <h3 class="stat-title">Dépenses</h3>
           <div class="stat-value text-error">-${parseFloat(
             totalDepenses
           ).toFixed(2)}€</div>
           <div class="stat-desc">↘︎ Sorties</div>
         </div>
         
        <div class="stat place-items-center">
           <h3 class="sta<t-title">Solde</h3>
          <div class="stat-value text-primary ${
            solde >= 0 ? "text-success" : "text-error"
          }">${solde.toFixed(2)}€
          </div>
          <div class="stat-desc ${
            solde >= 0 ? "text-success/70" : "text-error/70"
          }">
            ${solde >= 0 ? "Situation positive" : "Situation déficitaire"}
          </div>
         </div>
       </div>

              <div class="flex justify-center alert ${
                solde >= 0 ? "alert-success" : "alert-warning"
              } mt-6">
         <span class="text-lg  font-semibold">
           ${solde >= 0 ? "✅" : "⚠️"} 
           ${
             solde >= 0
               ? "Félicitations ! Votre situation financière est positive."
               : "Attention ! Vos dépenses dépassent vos revenus."
           }
         </span>
       </div>
     </div>

        <!-- Charts Container -->
       <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
         <!-- Graphique en Camembert -->
         <div class="card bg-gradient-to-br from-primary/10 to-secondary/10 shadow-lg border border-primary/20">
           <div class="card-body">
             <div class="flex items-center justify-center gap-2 mb-4">
               <span class="text-2xl">🥧</span>
               <h2 class="card-title text-xl font-bold">Répartition</h2>
             </div>
             <div class="flex justify-center bg-base-100 rounded-lg p-4">
               <canvas id="pieChart" width="280" height="280"></canvas>
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
               <span class="text-2xl">�</span>
               <h2 class="card-title text-xl font-bold">Comparaison</h2>
             </div>
             <div class="flex justify-center bg-base-100 rounded-lg p-4">
               <canvas id="barChart" width="280" height="280"></canvas>
             </div>
             <div class="text-center mt-3">
               <div class="badge badge-accent badge-sm">Analyse détaillée</div>
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
