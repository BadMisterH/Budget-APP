export function Nav(navigation) {
  navigation.innerHTML = `
    <nav class="flex justify-around navbar bg-base-100 shadow-lg">
      <div class="navbar-start">
        <div class="dropdown">
          <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16"></path>
            </svg>
          </div>
        </div>
        <a class="btn btn-ghost normal-case text-xl">Mon Budget</a>
      </div>
      
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1">
          <li><a data-page="dashboard" class="nav-link btn btn-primary">📊 Tableau de bord</a></li>
          <li><a data-page="transactions" class="nav-link btn btn-ghost">💰 Transactions</a></li>
          <li><a data-page="analytics" class="nav-link btn btn-ghost">📈 Analyses</a></li>
        </ul>
      </div>
    </nav>
  `;
}
