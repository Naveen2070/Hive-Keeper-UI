import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-container',
  imports: [],
  template: `
    <div class="p-8 bg-[#111111] min-h-screen text-white">
      <header class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold">Admin Control Center</h1>
          <p class="text-slate-400">
            Welcome back, {{ authService.isAuthenticated() ? 'Admin' : 'Guest' }}
          </p>
        </div>
        <button
          (click)="logout()"
          class="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg border border-red-500/20 transition-colors"
        >
          Logout
        </button>
      </header>

      <main class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-[#222222] p-6 rounded-2xl border border-white/5">
          <h3 class="text-slate-400 text-sm font-medium mb-2 uppercase tracking-wider">
            Total Users
          </h3>
          <p class="text-4xl font-bold">1,234</p>
        </div>
        <div class="bg-[#222222] p-6 rounded-2xl border border-white/5">
          <h3 class="text-slate-400 text-sm font-medium mb-2 uppercase tracking-wider">
            Active Events
          </h3>
          <p class="text-4xl font-bold">42</p>
        </div>
        <div class="bg-[#222222] p-6 rounded-2xl border border-white/5">
          <h3 class="text-slate-400 text-sm font-medium mb-2 uppercase tracking-wider">
            Cinema Bookings
          </h3>
          <p class="text-4xl font-bold">892</p>
        </div>
      </main>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardContainerComponent {
  protected readonly authService = inject(AuthService);
  private router = inject(Router);

  async logout() {
    this.authService.logout();
    await this.router.navigate(['/auth/login']);
  }
}
