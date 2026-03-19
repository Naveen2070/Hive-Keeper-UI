import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export interface BookingDTO {
  id: string;
  eventId: number;
  userId: string;
  userName: string;
  tierId: number;
  tierName: string;
  quantity: number;
  totalPrice: number;
  status: BookingStatus;
  bookingDate: string;
}

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/bookings`;

  /**
   * Retrieves bookings for a specific event.
   * Path: GET /api/bookings/events/{eventId}
   */
  getEventBookings(eventId: number): Observable<BookingDTO[]> {
    return this.http.get<BookingDTO[]>(`${this.baseUrl}/events/${eventId}`);
  }

  /**
   * Updates the status of a booking.
   * Path: PATCH /api/bookings/status/{id}
   */
  updateBookingStatus(id: string, status: BookingStatus): Observable<BookingDTO> {
    return this.http.patch<BookingDTO>(`${this.baseUrl}/status/${id}`, { status });
  }
}
