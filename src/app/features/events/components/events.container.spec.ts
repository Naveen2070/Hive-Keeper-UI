import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventsContainerComponent } from './events.container';
import { EventService, EventStatus } from '../services/event.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

describe('EventsContainerComponent', () => {
  let component: EventsContainerComponent;
  let fixture: ComponentFixture<EventsContainerComponent>;
  let mockEventService: any;
  let mockDialog: any;
  let mockSnackBar: any;

  const mockEvents = [
    {
      id: 1,
      title: 'Event 1',
      status: 'DRAFT' as EventStatus,
      organizerName: 'Org 1',
      location: 'Loc 1',
      startDate: '2026-03-20T20:00:00',
      endDate: '2026-03-20T23:00:00',
    },
    {
      id: 2,
      title: 'Event 2',
      status: 'PUBLISHED' as EventStatus,
      organizerName: 'Org 2',
      location: 'Loc 2',
      startDate: '2026-03-21T10:00:00',
      endDate: '2026-03-21T18:00:00',
    },
  ];

  beforeEach(async () => {
    mockEventService = {
      getEvents: vi.fn().mockReturnValue(of({ content: mockEvents })),
      updateStatus: vi.fn().mockReturnValue(of({})),
      deleteEvent: vi.fn().mockReturnValue(of({})),
    };

    mockDialog = {
      open: vi.fn().mockReturnValue({ afterClosed: () => of(true) }),
    };

    mockSnackBar = {
      open: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [EventsContainerComponent, NoopAnimationsModule],
      providers: [
        { provide: EventService, useValue: mockEventService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
    })
      .overrideComponent(EventsContainerComponent, {
        set: {
          providers: [
            { provide: EventService, useValue: mockEventService },
            { provide: MatDialog, useValue: mockDialog },
            { provide: MatSnackBar, useValue: mockSnackBar },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(EventsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load events on init', () => {
    expect(mockEventService.getEvents).toHaveBeenCalled();
    // events() is a signal, we can call it to get the value
    expect((component as any).events()).toEqual(mockEvents);
  });

  it('should open confirmation dialog for force publish', () => {
    component.onStatusChange({ id: 1, status: 'PUBLISHED' });
    expect(mockDialog.open).toHaveBeenCalledWith(
      ConfirmDialogComponent,
      expect.objectContaining({
        data: expect.objectContaining({ title: 'Force Publish Event?' }),
      }),
    );
  });

  it('should open confirmation dialog for force cancel', () => {
    component.onStatusChange({ id: 2, status: 'CANCELLED' });
    expect(mockDialog.open).toHaveBeenCalledWith(
      ConfirmDialogComponent,
      expect.objectContaining({
        data: expect.objectContaining({ title: 'Force Cancel Event?' }),
      }),
    );
  });

  it('should update status if confirmed', () => {
    component.onStatusChange({ id: 1, status: 'PUBLISHED' });
    expect(mockEventService.updateStatus).toHaveBeenCalledWith(1, 'PUBLISHED');
  });

  it('should not update status if cancelled', () => {
    mockDialog.open.mockReturnValue({ afterClosed: () => of(false) });
    component.onStatusChange({ id: 1, status: 'PUBLISHED' });
    expect(mockEventService.updateStatus).not.toHaveBeenCalled();
  });

  it('should handle update status error and rollback', () => {
    mockEventService.updateStatus.mockReturnValue(throwError(() => new Error('API Error')));
    const initialEvents = [...(component as any).events()];

    component.onStatusChange({ id: 1, status: 'PUBLISHED' });

    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'Failed to update event status.',
      'Retry',
      expect.anything(),
    );
    expect((component as any).events()).toEqual(initialEvents);
  });

  it('should open confirmation dialog for delete', () => {
    component.onDelete(1);
    expect(mockDialog.open).toHaveBeenCalledWith(
      ConfirmDialogComponent,
      expect.objectContaining({
        data: expect.objectContaining({ title: 'Delete Event?' }),
      }),
    );
  });

  it('should call deleteEvent if confirmed', () => {
    component.onDelete(1);
    expect(mockEventService.deleteEvent).toHaveBeenCalledWith(1);
  });
});
