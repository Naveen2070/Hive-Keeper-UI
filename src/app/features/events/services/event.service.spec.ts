import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EventService, EventStatus } from './event.service';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('EventService', () => {
  let service: EventService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EventService],
    });
    service = TestBed.inject(EventService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch events', () => {
    const mockResponse = {
      content: [
        { id: 1, title: 'Event 1' },
        { id: 2, title: 'Event 2' },
      ],
      totalElements: 2,
    };

    service.getEvents(0, 10).subscribe((response) => {
      expect(response.content).toHaveLength(2);
      expect(response.totalElements).toBe(2);
    });

    const req = httpMock.expectOne(
      (request) => request.url.includes('/api/events') && request.params.get('page') === '0',
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should update event status', () => {
    const id = 1;
    const status: EventStatus = 'PUBLISHED';

    service.updateStatus(id, status).subscribe();

    const req = httpMock.expectOne((request) => request.url.includes(`/api/events/status/${id}`));
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ status });
    req.flush({});
  });

  it('should delete event', () => {
    const id = 1;

    service.deleteEvent(id).subscribe();

    const req = httpMock.expectOne((request) => request.url.includes(`/api/events/${id}`));
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
