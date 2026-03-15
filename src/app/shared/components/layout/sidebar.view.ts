import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  template: `
    <aside
      class="w-64 bg-[#0B1121] border-r border-white/5 flex flex-col hidden md:flex shrink-0 z-20 h-full"
    >
      <div class="h-16 flex items-center px-6 border-b border-white/5">
        <div
          class="w-8 h-8 bg-linear-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center text-white mr-3 shadow-lg shadow-blue-500/20"
        >
          <mat-icon class="scale-75">shield</mat-icon>
        </div>
        <span class="text-lg font-bold text-white tracking-wide"
          >Hive <span class="text-blue-500">Keeper</span></span
        >
      </div>

      <nav class="flex-1 px-4 py-6 flex flex-col gap-1.5 overflow-y-auto">
        <div
          class="text-[10px] font-mono font-semibold uppercase tracking-widest text-slate-500 mb-2 px-2 mt-2"
        >
          Main Menu
        </div>

        <a
          routerLink="/dashboard/overview"
          routerLinkActive="bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[inset_2px_0_0_#3b82f6]"
          [routerLinkActiveOptions]="{ exact: true }"
          class="group flex items-center gap-3 px-3 py-2.5 rounded-xl border border-transparent hover:bg-white/5 text-sm text-slate-400 hover:text-slate-200 transition-all duration-200"
        >
          <mat-icon class="scale-90 opacity-70 group-[.active]:opacity-100 transition-opacity"
            >dashboard</mat-icon
          >
          <span>Overview</span>
        </a>

        <a
          routerLink="/cinemas"
          routerLinkActive="bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[inset_2px_0_0_#3b82f6]"
          class="group flex items-center gap-3 px-3 py-2.5 rounded-xl border border-transparent hover:bg-white/5 text-sm text-slate-400 hover:text-slate-200 transition-all duration-200"
        >
          <mat-icon class="scale-90 opacity-70 group-[.active]:opacity-100 transition-opacity"
            >movie_filter</mat-icon
          >
          <span>Cinema Approvals</span>
        </a>

        <a
          routerLink="/events"
          routerLinkActive="bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[inset_2px_0_0_#3b82f6]"
          class="group flex items-center gap-3 px-3 py-2.5 rounded-xl border border-transparent hover:bg-white/5 text-sm text-slate-400 hover:text-slate-200 transition-all duration-200"
        >
          <mat-icon class="scale-90 opacity-70 group-[.active]:opacity-100 transition-opacity"
            >event_note</mat-icon
          >
          <span>Events Oversight</span>
        </a>

        <a
          routerLink="/dashboard/users"
          routerLinkActive="bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[inset_2px_0_0_#3b82f6]"
          class="group flex items-center gap-3 px-3 py-2.5 rounded-xl border border-transparent hover:bg-white/5 text-sm text-slate-400 hover:text-slate-200 transition-all duration-200"
        >
          <mat-icon class="scale-90 opacity-70 group-[.active]:opacity-100 transition-opacity"
            >manage_accounts</mat-icon
          >
          <span>User Management</span>
        </a>

        <div
          class="text-[10px] font-mono font-semibold uppercase tracking-widest text-slate-500 mb-2 px-2 mt-6"
        >
          Audit & Security
        </div>

        <a
          routerLink="/dashboard/audit"
          routerLinkActive="bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[inset_2px_0_0_#3b82f6]"
          class="group flex items-center gap-3 px-3 py-2.5 rounded-xl border border-transparent hover:bg-white/5 text-sm text-slate-400 hover:text-slate-200 transition-all duration-200"
        >
          <mat-icon class="scale-90 opacity-70 group-[.active]:opacity-100 transition-opacity"
            >receipt_long</mat-icon
          >
          <span>Audit Logs</span>
        </a>
      </nav>

      <div class="p-4 border-t border-white/5 bg-[#0B1121]">
        <div class="flex items-center gap-3 px-2 mb-4">
          <div
            class="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-blue-400 shrink-0"
          >
            <mat-icon class="scale-75">person</mat-icon>
          </div>
          <div class="flex flex-col overflow-hidden">
            <span class="text-xs font-medium text-white truncate">{{ userEmail() }}</span>
            <span class="text-[10px] font-mono text-slate-500 uppercase tracking-wider truncate"
              >Role: {{ primaryRole() }}</span
            >
          </div>
        </div>

        <button
          (click)="logout.emit()"
          class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#1A1A1A] hover:bg-[#222222] border border-white/10 text-slate-300 hover:text-white rounded-xl text-sm transition-all duration-200"
        >
          <mat-icon class="scale-90 text-slate-400">logout</mat-icon>
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  userEmail = input<string | undefined>();
  primaryRole = input<string>('N/A');
  logout = output<void>();
}
