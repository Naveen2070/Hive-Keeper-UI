import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-found-view',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  template: `
    <div class="h-screen w-full bg-[#111111] flex flex-col items-center justify-center p-8 font-sans relative overflow-hidden">
      <!-- Blueprint Grid Background -->
      <div class="absolute inset-0 bg-blueprint-grid opacity-20 pointer-events-none"></div>

      <div class="z-10 text-center max-w-md w-full">
        <div class="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-500 shadow-xl shadow-red-500/5">
          <mat-icon class="scale-[2.5]">error_outline</mat-icon>
        </div>
        
        <h1 class="text-7xl font-black text-white mb-2 tracking-tighter">404</h1>
        <h2 class="text-xl font-bold text-slate-200 mb-4 tracking-tight uppercase tracking-widest">Sector Not Found</h2>
        
        <p class="text-slate-400 mb-10 leading-relaxed text-sm">
          The coordinates you've provided do not exist in the Hive Keeper network. 
          Return to command center to re-authenticate or check system logs.
        </p>

        <a routerLink="/dashboard" 
           class="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30">
          <mat-icon class="scale-90">home</mat-icon>
          Return to Dashboard
        </a>
      </div>
    </div>
  `,
  styles: `
    .bg-blueprint-grid {
      background-image: linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 30px 30px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundViewComponent {}

@Component({
  selector: 'app-not-found-container',
  standalone: true,
  imports: [NotFoundViewComponent],
  template: `<app-not-found-view />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundContainerComponent {}
