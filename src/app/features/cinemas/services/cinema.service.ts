import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface CinemaResponse {
  id: string; // Guid
  name: string;
  location: string;
  contactEmail: string;
  approvalStatus: 'Pending' | 'Approved' | 'Rejected';
}

export interface UpdateCinemaStatusRequest {
  status: 'Approved' | 'Rejected';
}

@Injectable({
  providedIn: 'root',
})
export class CinemaService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/movies/cinemas`;

  /**
   * Retrieves a list of all cinemas.
   * Note: Assuming a GET /api/cinemas endpoint exists for administration.
   */
  getCinemas(): Observable<CinemaResponse[]> {
    return this.http.get<CinemaResponse[]>(this.baseUrl);
  }

  /**
   * Updates the approval status of a cinema.
   * Path: PATCH /api/cinemas/{id}/status
   * Role Required: SUPER_ADMIN
   */
  updateApprovalStatus(id: string, status: 'Approved' | 'Rejected'): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/status`, { status } as UpdateCinemaStatusRequest);
  }
}
