import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';

export interface TicketTierDTO {
  id: number;
  name: string;
  price: number;
  totalAllocation: number;
  availableAllocation: number;
  validFrom: string;
  validUntil: string;
}

export interface EventDTO {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  status: EventStatus;
  ticketTiers: TicketTierDTO[];
  priceRange: string;
  organizerId: string;
  organizerName: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isLast: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/events`;
  private readonly tiersUrl = `${environment.apiUrl}/tiers`;

  /**
   * Retrieves a paginated list of events.
   */
  getEvents(page: number = 0, size: number = 50): Observable<PaginatedResponse<EventDTO>> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<PaginatedResponse<EventDTO>>(this.baseUrl, { params });
  }

  /**
   * Updates the status of an event.
   * Path: PATCH /api/events/status/{id}
   */
  updateStatus(id: number, status: EventStatus): Observable<EventDTO> {
    return this.http.patch<EventDTO>(`${this.baseUrl}/status/${id}`, { status });
  }

  /**
   * Deletes an event.
   * Path: DELETE /api/events/{id}
   */
  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * Adds a new ticket tier to an event.
   * Path: POST /api/tiers/events/{eventId}
   */
  addTier(eventId: number, tier: Omit<TicketTierDTO, 'id'>): Observable<TicketTierDTO> {
    return this.http.post<TicketTierDTO>(`${this.tiersUrl}/events/${eventId}`, tier);
  }

  /**
   * Updates an existing ticket tier.
   * Path: PUT /api/tiers/{tierId}
   */
  updateTier(tierId: number, tier: Omit<TicketTierDTO, 'id'>): Observable<TicketTierDTO> {
    return this.http.put<TicketTierDTO>(`${this.tiersUrl}/${tierId}`, tier);
  }

  /**
   * Deletes a ticket tier.
   * Path: DELETE /api/tiers/{tierId}
   */
  deleteTier(tierId: number): Observable<void> {
    return this.http.delete<void>(`${this.tiersUrl}/${tierId}`);
  }
}
