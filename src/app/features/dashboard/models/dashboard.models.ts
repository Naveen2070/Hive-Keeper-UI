export interface RevenueTrendItemDTO {
  date: string;
  revenue: number;
}

export interface RecentSaleDTO {
  id: string;
  amount: number;
  date: string;
  description: string;
}

export interface EventDashboardStatsDTO {
  totalRevenue: number;
  totalTicketsSold: number;
  activeEventsCount: number;
  revenueTrend: RevenueTrendItemDTO[];
  recentSales: RecentSaleDTO[];
}

export interface MovieDashboardStatsDTO {
  totalRevenue: number;
  totalMoviesSold: number;
  activeShowtimesCount: number;
  revenueTrend: RevenueTrendItemDTO[];
  recentSales: RecentSaleDTO[];
}

export interface OverallDashboardStats {
  totalRevenue: number;
  totalTicketsSold: number;
  activeEventsCount: number;
  activeShowtimesCount: number;
  revenueTrend: RevenueTrendItemDTO[];
  recentSales: RecentSaleDTO[];
}

export type DashboardViewMode = 'overall' | 'events' | 'movies';
