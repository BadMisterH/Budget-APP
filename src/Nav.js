export function Nav(navigation) {
  navigation.innerHTML = `
    <nav class="navbar bg-base-100/80 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-base-300/50">
      <div class="navbar-start">
        <div class="dropdown">
          <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16"></path>
            </svg>
          </div>
          <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 lg:hidden">
            <li><a data-page="dashboard" class="nav-link">📊 Tableau de bord</a></li>
            <li><a data-page="transactions" class="nav-link">💰 Transactions</a></li>
            <li><a data-page="analytics" class="nav-link">📈 Analyses</a></li>
          </ul>
        </div>
        <a class="btn btn-ghost text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hover:scale-105 transition-transform duration-200">
          💰 My Budget
        </a>
      </div>
      
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1 gap-2 lg:gap-4">
          <li>
            <a data-page="dashboard" class="nav-link btn btn-primary lg:btn-lg lg:text-base font-semibold hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
              📊 Tableau de bord
            </a>
          </li>
          <li>
            <a data-page="transactions" class="nav-link btn btn-ghost lg:btn-lg lg:text-base font-semibold hover:scale-105 transition-all duration-200 hover:shadow-lg">
              💰 Transactions
            </a>
          </li>
          <li>
            <a data-page="analytics" class="nav-link btn btn-ghost lg:btn-lg lg:text-base font-semibold hover:scale-105 transition-all duration-200 hover:shadow-lg">
              📈 Analyses
            </a>
          </li>
        </ul>
      </div>

      <div class="navbar-end">
        <div class="dropdown dropdown-end hidden lg:block">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar hover:scale-110 transition-transform duration-200">
            <div class="w-10 lg:w-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shadow-lg">
              <span class="text-sm lg:text-base font-bold">U</span>
            </div>
          </div>
          <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-xl bg-base-100 rounded-box w-52 border border-base-300">
            <li class="menu-title">
              <span class="text-xs lg:text-sm">Utilisateur</span>
            </li>
            <li><a class="text-error hover:bg-error/10">🚪 Déconnexion</a></li>
          </ul>
        </div>
        
        <!-- Mobile end button -->
        <button class="btn btn-ghost btn-circle lg:hidden">
          <div class="indicator">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5-5-5h5v-6h5l-5-5-5 5h5v6z" />
            </svg>
          </div>
        </button>
      </div>
    </nav>
  `;
}
