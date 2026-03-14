import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CinemaService, CinemaResponse } from './cinema.service';
import { environment } from '../../../../environments/environment';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('CinemaService', () => {
  let service: CinemaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CinemaService]
    });
    service = TestBed.inject(CinemaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch cinemas', () => {
    const mockCinemas: CinemaResponse[] = [
      { id: '1', name: 'Cinema 1', location: 'Loc 1', contactEmail: 'c1@test.com', approvalStatus: 'Pending' }
    ];

    service.getCinemas().subscribe(cinemas => {
      expect(cinemas).toEqual(mockCinemas);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/movies/cinemas`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCinemas);
  });

  it('should update approval status', () => {
    service.updateApprovalStatus('1', 'Approved').subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/movies/cinemas/1/status`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ status: 'Approved' });
    req.flush(null);
  });
});
