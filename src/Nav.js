export function Nav(navigation) {
  navigation.innerHTML = `
    <nav class="navbar bg-base-100 shadow-lg sticky top-0 z-50">
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
        <a class="btn btn-ghost text-lg sm:text-xl font-bold">💰 My Budget</a>
      </div>
      
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1 gap-1">
          <li><a data-page="dashboard" class="nav-link btn btn-primary btn-sm">📊 Tableau de bord</a></li>
          <li><a data-page="transactions" class="nav-link btn btn-ghost btn-sm">💰 Transactions</a></li>
          <li><a data-page="analytics" class="nav-link btn btn-ghost btn-sm">📈 Analyses</a></li>
        </ul>
      </div>

      <div class="navbar-end lg:hidden">
        <button class="btn btn-ghost btn-circle">
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
