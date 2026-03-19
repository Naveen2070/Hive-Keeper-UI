import { EventDashboardStatsDTO, MovieDashboardStatsDTO } from '../../features/dashboard/models/dashboard.models';

export const MOCK_EVENT_DASHBOARD_STATS: EventDashboardStatsDTO = {
  totalRevenue: 8450.5,
  totalTicketsSold: 542,
  activeEventsCount: 12,
  revenueTrend: [
    { date: '2023-10-01', revenue: 300 },
    { date: '2023-10-02', revenue: 400 },
    { date: '2023-10-03', revenue: 200 },
    { date: '2023-10-04', revenue: 800 },
    { date: '2023-10-05', revenue: 600 },
    { date: '2023-10-06', revenue: 1000 },
    { date: '2023-10-07', revenue: 1500 },
  ],
  recentSales: [
    { id: 'e1', amount: 120, date: new Date().toISOString(), description: '2x VIP Event Tickets' },
    { id: 'e2', amount: 45, date: new Date(Date.now() - 3600000).toISOString(), description: '1x Event General Admission' },
    { id: 'e3', amount: 240, date: new Date(Date.now() - 7200000).toISOString(), description: '4x Event Standard Tickets' },
  ],
};

export const MOCK_MOVIE_DASHBOARD_STATS: MovieDashboardStatsDTO = {
  totalRevenue: 4000.0,
  totalMoviesSold: 300,
  activeShowtimesCount: 24,
  revenueTrend: [
    { date: '2023-10-01', revenue: 200 },
    { date: '2023-10-02', revenue: 400 },
    { date: '2023-10-03', revenue: 400 },
    { date: '2023-10-04', revenue: 400 },
    { date: '2023-10-05', revenue: 300 },
    { date: '2023-10-06', revenue: 500 },
    { date: '2023-10-07', revenue: 600 },
  ],
  recentSales: [
    { id: 'm1', amount: 30, date: new Date(Date.now() - 1800000).toISOString(), description: '2x Movie Tickets' },
    { id: 'm2', amount: 60, date: new Date(Date.now() - 5400000).toISOString(), description: '4x Movie Tickets' },
    { id: 'm3', amount: 15, date: new Date(Date.now() - 86400000).toISOString(), description: '1x Movie Ticket' },
  ],
};
