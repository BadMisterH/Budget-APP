import { getTransactions } from "./CrudFireStore.js";

export async function Calendar(elementHtml) {
  const transactions = await getTransactions();
  const currentDate = new Date();
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();

  function renderCalendar() {
    elementHtml.innerHTML = `
      <div class="container mx-auto p-4 max-w-6xl">
        <!-- Header du calendrier -->
        <div class="card bg-base-100 shadow-xl mb-6">
          <div class="card-body">
            <div class="flex flex-col lg:flex-row justify-between items-center gap-4">
              <div class="text-center lg:text-left">
                <h1 class="text-3xl font-bold flex items-center gap-2">
                  📅 Calendrier des Transactions
                </h1>
                <p class="text-base-content/60 mt-2">Visualisez vos transactions par date</p>
              </div>
              
              <!-- Navigation du mois -->
              <div class="flex items-center gap-4">
                <button id="prevMonth" class="btn btn-circle btn-outline">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>
                
                <div class="text-center min-w-48">
                  <h2 id="monthYear" class="text-xl font-bold">${getMonthName(currentMonth)} ${currentYear}</h2>
                </div>
                
                <button id="nextMonth" class="btn btn-circle btn-outline">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </div>
              
              <!-- Bouton aujourd'hui -->
              <button id="todayBtn" class="btn btn-primary btn-sm">
                📍 Aujourd'hui
              </button>
            </div>
          </div>
        </div>

        <!-- Légende -->
        <div class="card bg-base-100 shadow-lg mb-6">
          <div class="card-body py-4">
            <div class="flex flex-wrap justify-center gap-4 text-sm">
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 bg-success rounded-full"></div>
                <span>Revenus</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 bg-error rounded-full"></div>
                <span>Dépenses</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 bg-info rounded-full"></div>
                <span>Mixte</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 bg-base-300 rounded-full"></div>
                <span>Aucune transaction</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Grille du calendrier -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body p-2 lg:p-6">
            <!-- Jours de la semaine -->
            <div class="grid grid-cols-7 gap-1 lg:gap-2 mb-2">
              ${['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => 
                `<div class="text-center font-semibold text-base-content/60 p-2 text-sm lg:text-base">${day}</div>`
              ).join('')}
            </div>
            
            <!-- Grille des jours -->
            <div id="calendarGrid" class="grid grid-cols-7 gap-1 lg:gap-2">
              ${generateCalendarDays()}
            </div>
          </div>
        </div>

        <!-- Détails du jour sélectionné -->
        <div id="dayDetails" class="card bg-base-100 shadow-xl mt-6 hidden">
          <div class="card-body">
            <h3 id="dayDetailsTitle" class="text-xl font-bold mb-4"></h3>
            <div id="dayTransactions"></div>
          </div>
        </div>
      </div>
    `;

    setupEventListeners();
  }

  function generateCalendarDays() {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === currentMonth;
      const isToday = isDateToday(date);
      const dayTransactions = getTransactionsForDate(date);
      
      const dayClass = getDayClass(isCurrentMonth, isToday, dayTransactions);
      const transactionIndicator = getTransactionIndicator(dayTransactions);
      
      days.push(`
        <div class="${dayClass}" data-date="${formatDate(date)}">
          <div class="flex flex-col items-center">
            <span class="text-sm lg:text-base font-medium">${date.getDate()}</span>
            ${transactionIndicator}
            ${dayTransactions.length > 0 ? `<span class="text-xs mt-1">${dayTransactions.length}</span>` : ''}
          </div>
        </div>
      `);
    }
    
    return days.join('');
  }

  function getDayClass(isCurrentMonth, isToday, dayTransactions) {
    let baseClass = "calendar-day h-16 lg:h-20 p-1 lg:p-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md";
    
    if (!isCurrentMonth) {
      baseClass += " text-base-content/30 bg-base-200/50";
    } else if (isToday) {
      baseClass += " bg-primary text-primary-content font-bold ring-2 ring-primary-focus";
    } else if (dayTransactions.length > 0) {
      baseClass += " bg-base-200 hover:bg-base-300";
    } else {
      baseClass += " bg-base-100 hover:bg-base-200";
    }
    
    return baseClass;
  }

  function getTransactionIndicator(dayTransactions) {
    if (dayTransactions.length === 0) return '';
    
    const hasRevenu = dayTransactions.some(t => t.type === 'revenu');
    const hasDepenses = dayTransactions.some(t => t.type === 'depenses');
    
    let color = 'bg-base-300';
    if (hasRevenu && hasDepenses) {
      color = 'bg-info';
    } else if (hasRevenu) {
      color = 'bg-success';
    } else if (hasDepenses) {
      color = 'bg-error';
    }
    
    return `<div class="w-2 h-2 lg:w-3 lg:h-3 ${color} rounded-full mt-1"></div>`;
  }

  function getTransactionsForDate(date) {
    const dateStr = formatDate(date);
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return formatDate(transactionDate) === dateStr;
    });
  }

  function formatDate(date) {
    return date.toISOString().split('T')[0];
  }

  function isDateToday(date) {
    const today = new Date();
    return formatDate(date) === formatDate(today);
  }

  function getMonthName(monthIndex) {
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return months[monthIndex];
  }

  function setupEventListeners() {
    // Navigation mois précédent/suivant
    document.getElementById('prevMonth').addEventListener('click', () => {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      renderCalendar();
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      renderCalendar();
    });

    // Bouton aujourd'hui
    document.getElementById('todayBtn').addEventListener('click', () => {
      const today = new Date();
      currentMonth = today.getMonth();
      currentYear = today.getFullYear();
      renderCalendar();
    });

    // Clic sur un jour
    document.querySelectorAll('.calendar-day').forEach(day => {
      day.addEventListener('click', (e) => {
        const selectedDate = e.currentTarget.dataset.date;
        showDayDetails(selectedDate);
      });
    });
  }

  function showDayDetails(dateStr) {
    const date = new Date(dateStr);
    const dayTransactions = getTransactionsForDate(date);
    
    const dayDetails = document.getElementById('dayDetails');
    const title = document.getElementById('dayDetailsTitle');
    const transactionsContainer = document.getElementById('dayTransactions');
    
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    title.textContent = `📅 ${date.toLocaleDateString('fr-FR', options)}`;
    
    if (dayTransactions.length === 0) {
      transactionsContainer.innerHTML = `
        <div class="text-center py-8 text-base-content/60">
          <div class="text-4xl mb-2">📭</div>
          <p>Aucune transaction ce jour-là</p>
        </div>
      `;
    } else {
      const totalRevenu = dayTransactions
        .filter(t => t.type === 'revenu')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      const totalDepenses = dayTransactions
        .filter(t => t.type === 'depenses')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      transactionsContainer.innerHTML = `
        <!-- Résumé du jour -->
        <div class="stats stats-horizontal shadow mb-6 w-full">
          <div class="stat">
            <div class="stat-title">Revenus</div>
            <div class="stat-value text-success text-lg lg:text-2xl">${totalRevenu.toFixed(2)}€</div>
          </div>
          <div class="stat">
            <div class="stat-title">Dépenses</div>
            <div class="stat-value text-error text-lg lg:text-2xl">${totalDepenses.toFixed(2)}€</div>
          </div>
          <div class="stat">
            <div class="stat-title">Solde</div>
            <div class="stat-value ${totalRevenu - totalDepenses >= 0 ? 'text-info' : 'text-warning'} text-lg lg:text-2xl">
              ${(totalRevenu - totalDepenses).toFixed(2)}€
            </div>
          </div>
        </div>

        <!-- Liste des transactions -->
        <div class="space-y-3">
          <h4 class="font-semibold text-lg">Transactions (${dayTransactions.length})</h4>
          ${dayTransactions.map(transaction => `
            <div class="card bg-base-200 shadow-sm">
              <div class="card-body p-4">
                <div class="flex justify-between items-center">
                  <div class="flex items-center gap-3">
                    <div class="w-3 h-3 rounded-full ${transaction.type === 'revenu' ? 'bg-success' : 'bg-error'}"></div>
                    <div>
                      <h5 class="font-medium">${transaction.description}</h5>
                      <p class="text-sm text-base-content/60">${transaction.categories || 'Sans catégorie'}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="font-bold ${transaction.type === 'revenu' ? 'text-success' : 'text-error'}">
                      ${transaction.type === 'revenu' ? '+' : '-'}${parseFloat(transaction.amount).toFixed(2)}€
                    </p>
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
    
    dayDetails.classList.remove('hidden');
    dayDetails.scrollIntoView({ behavior: 'smooth' });
  }

  renderCalendar();
}
