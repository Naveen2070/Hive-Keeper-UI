import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../auth/services/auth.service';
import { DashboardViewMode, RevenueTrendItemDTO } from '../models/dashboard.models';
import { DashboardService } from '../services/dashboard.service';
import { MetricTrend, OverviewViewComponent, ServiceHealth } from './overview.view';

@Component({
  selector: 'app-overview-container',
  standalone: true,
  imports: [OverviewViewComponent],
  template: `<app-overview-view 
    [services]="services()" 
    [stats]="displayStats()" 
    [viewMode]="viewMode()"
    [userName]="userName()"
    (viewModeChange)="viewMode.set($event)"
  />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewContainerComponent {
  private readonly dashboardService = inject(DashboardService);
  private readonly authService = inject(AuthService);

  readonly viewMode = signal<DashboardViewMode>('overall');
  readonly userName = computed(() => {
    const email = this.authService.userEmail();
    return email ? email.split('@')[0] : undefined;
  });

  private readonly eventStats = toSignal(this.dashboardService.getEventStats());
  private readonly movieStats = toSignal(this.dashboardService.getMovieStats());
  private readonly overallStats = toSignal(this.dashboardService.getOverallStats());

  readonly displayStats = computed(() => {
    const mode = this.viewMode();
    
    if (mode === 'events') {
      const s = this.eventStats();
      if (!s) return undefined;
      return {
        totalRevenue: s.totalRevenue,
        revenueTrendStatus: this.calculateTrend(s.revenueTrend),
        ticketsSoldLabel: 'Event Tickets',
        totalTicketsSold: s.totalTicketsSold,
        ticketsSoldTrendStatus: { label: 'Stable', class: 'text-indigo-400 bg-indigo-500/10' },
        activeLabel: 'Active Events',
        activeCount: s.activeEventsCount,
        activeTrendStatus: { label: 'Running', class: 'text-emerald-400 bg-emerald-500/10' },
        revenueTrend: s.revenueTrend,
        recentSales: s.recentSales,
      };
    }
    
    if (mode === 'movies') {
      const s = this.movieStats();
      if (!s) return undefined;
      return {
        totalRevenue: s.totalRevenue,
        revenueTrendStatus: this.calculateTrend(s.revenueTrend),
        ticketsSoldLabel: 'Movie Tickets',
        totalTicketsSold: s.totalMoviesSold,
        ticketsSoldTrendStatus: { label: 'Stable', class: 'text-indigo-400 bg-indigo-500/10' },
        activeLabel: 'Active Showtimes',
        activeCount: s.activeShowtimesCount,
        activeTrendStatus: { label: 'Running', class: 'text-emerald-400 bg-emerald-500/10' },
        revenueTrend: s.revenueTrend,
        recentSales: s.recentSales,
      };
    }

    // overall
    const s = this.overallStats();
    if (!s) return undefined;
    return {
      totalRevenue: s.totalRevenue,
      revenueTrendStatus: this.calculateTrend(s.revenueTrend),
      ticketsSoldLabel: 'Total Tickets',
      totalTicketsSold: s.totalTicketsSold,
      ticketsSoldTrendStatus: { label: 'Stable', class: 'text-indigo-400 bg-indigo-500/10' },
      activeLabel: 'Events / Showtimes',
      activeCount: `${s.activeEventsCount} / ${s.activeShowtimesCount}`,
      activeTrendStatus: { label: 'Active', class: 'text-emerald-400 bg-emerald-500/10' },
      revenueTrend: s.revenueTrend,
      recentSales: s.recentSales,
    };
  });

  private calculateTrend(trendData: RevenueTrendItemDTO[]): MetricTrend {
    if (trendData.length < 2) {
      return { label: 'Stable', class: 'text-slate-400 bg-slate-500/10' };
    }

    const last = trendData[trendData.length - 1].revenue;
    const prev = trendData[trendData.length - 2].revenue;

    if (prev === 0) {
      return last > 0 
        ? { label: 'Up', class: 'text-emerald-400 bg-emerald-500/10' }
        : { label: 'Stable', class: 'text-slate-400 bg-slate-500/10' };
    }

    const percentChange = ((last - prev) / prev) * 100;

    if (percentChange > 5) {
      return { label: `+${percentChange.toFixed(0)}%`, class: 'text-emerald-400 bg-emerald-500/10' };
    } else if (percentChange < -5) {
      return { label: `${percentChange.toFixed(0)}%`, class: 'text-rose-400 bg-rose-500/10' };
    }

    return { label: 'Stable', class: 'text-indigo-400 bg-indigo-500/10' };
  }

  protected readonly services = signal<ServiceHealth[]>([
    { name: 'Identity API', latency: 12, status: 'up' },
    { name: 'Cinema Service', latency: 45, status: 'up' },
    { name: 'Event Bus', latency: 5, status: 'up' },
    { name: 'Media Transformer', latency: 120, status: 'up' },
  ]);
}
