import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  EventDashboardStatsDTO,
  MovieDashboardStatsDTO,
  OverallDashboardStats,
} from '../models/dashboard.models';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly http = inject(HttpClient);

  getEventStats(): Observable<EventDashboardStatsDTO> {
    return this.http.get<EventDashboardStatsDTO>(`${environment.apiUrl}/dashboard/stats`);
  }

  getMovieStats(): Observable<MovieDashboardStatsDTO> {
    return this.http.get<MovieDashboardStatsDTO>(`${environment.apiUrl}/movies/dashboard`);
  }

  getOverallStats(): Observable<OverallDashboardStats> {
    return forkJoin({
      events: this.getEventStats(),
      movies: this.getMovieStats(),
    }).pipe(
      map(({ events, movies }) => {
        // Merge revenue trends
        const trendsMap = new Map<string, number>();
        events.revenueTrend.forEach((t) => trendsMap.set(t.date, t.revenue));
        movies.revenueTrend.forEach((t) => {
          trendsMap.set(t.date, (trendsMap.get(t.date) || 0) + t.revenue);
        });

        const combinedRevenueTrend = Array.from(trendsMap.entries())
          .map(([date, revenue]) => ({ date, revenue }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Merge recent sales
        const combinedRecentSales = [...events.recentSales, ...movies.recentSales]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 10);

        return {
          totalRevenue: events.totalRevenue + movies.totalRevenue,
          totalTicketsSold: events.totalTicketsSold + movies.totalMoviesSold,
          activeEventsCount: events.activeEventsCount,
          activeShowtimesCount: movies.activeShowtimesCount,
          revenueTrend: combinedRevenueTrend,
          recentSales: combinedRecentSales,
        };
      }),
    );
  }
}
