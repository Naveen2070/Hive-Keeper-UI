import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { DashboardViewMode, RecentSaleDTO, RevenueTrendItemDTO } from '../models/dashboard.models';

export interface ServiceHealth {
  name: string;
  latency: number;
  status: string;
}

export interface MetricTrend {
  label: string;
  class: string;
}

export interface DisplayStats {
  totalRevenue: number;
  revenueTrendStatus: MetricTrend;
  ticketsSoldLabel: string;
  totalTicketsSold: number;
  ticketsSoldTrendStatus: MetricTrend;
  activeLabel: string;
  activeCount: number | string;
  activeTrendStatus: MetricTrend;
  revenueTrend: RevenueTrendItemDTO[];
  recentSales: RecentSaleDTO[];
}

@Component({
  selector: 'app-overview-view',
  standalone: true,
  imports: [BaseChartDirective, CurrencyPipe, DatePipe, NgClass],
  templateUrl: './overview.view.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewViewComponent {
  services = input<ServiceHealth[]>([]);
  stats = input<DisplayStats | undefined>();
  userName = input<string | undefined>();
  viewMode = input<DashboardViewMode>('overall');

  viewModeChange = output<DashboardViewMode>();

  readonly chartData = computed<ChartConfiguration<'line'>['data']>(() => {
    const s = this.stats();
    if (!s) {
      return { labels: [], datasets: [] };
    }

    return {
      labels: s.revenueTrend.map((item) => {
        const date = new Date(item.date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }),
      datasets: [
        {
          data: s.revenueTrend.map((item) => item.revenue),
          label: 'Revenue',
          fill: true,
          tension: 0.4,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#3b82f6',
          pointHoverBackgroundColor: '#3b82f6',
          pointHoverBorderColor: '#fff',
        },
      ],
    };
  });

  readonly chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 500, // Snappier animation
      easing: 'easeOutQuart',
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: '#111827',
        titleColor: '#94a3b8',
        bodyColor: '#fff',
        borderColor: '#1f2937',
        borderWidth: 1,
        padding: 8,
        cornerRadius: 6,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#475569',
          font: {
            size: 10,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.03)',
        },
        ticks: {
          color: '#475569',
          font: {
            size: 10,
          },
          callback: (value) => {
            if (typeof value === 'number') {
              if (value >= 1000) return '$' + (value / 1000).toFixed(1) + 'k';
              return '$' + value;
            }
            return value;
          },
        },
      },
    },
  };
}
