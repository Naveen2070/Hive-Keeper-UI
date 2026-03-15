import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CinemasContainerComponent } from './cinemas.container';
import { CinemaResponse, CinemaService } from '../services/cinema.service';
import { delay, of, throwError } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CinemasContainerComponent', () => {
  let component: CinemasContainerComponent;
  let fixture: ComponentFixture<CinemasContainerComponent>;
  let mockCinemaService: any;
  let snackBarSpy: any;

  const mockCinemas: CinemaResponse[] = [
    {
      id: '1',
      name: 'Cinema 1',
      location: 'Loc 1',
      contactEmail: 'c1@test.com',
      approvalStatus: 'Pending',
    },
    {
      id: '2',
      name: 'Cinema 2',
      location: 'Loc 2',
      contactEmail: 'c2@test.com',
      approvalStatus: 'Pending',
    },
  ];

  beforeEach(async () => {
    mockCinemaService = {
      getCinemas: vi.fn().mockReturnValue(of(mockCinemas)),
      updateApprovalStatus: vi.fn().mockReturnValue(of(null)),
    };

    snackBarSpy = {
      open: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CinemasContainerComponent, MatSnackBarModule, NoopAnimationsModule],
      providers: [
        { provide: CinemaService, useValue: mockCinemaService },
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CinemasContainerComponent);
    component = fixture.componentInstance;

    // Manually inject/assign the spy to ensure it's the one being called
    (component as any).snackBar = snackBarSpy;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load cinemas on init and set signal state', () => {
    expect(mockCinemaService.getCinemas).toHaveBeenCalled();
    expect(component['cinemas']()).toEqual(mockCinemas);
  });

  it('should handle load error and show snackbar', () => {
    mockCinemaService.getCinemas.mockReturnValue(throwError(() => new Error('API Error')));
    component.loadCinemas();
    fixture.detectChanges();
    expect(snackBarSpy.open).toHaveBeenCalled();
  });

  it('should update status optimistically and handle success', () => {
    component.onStatusChange({ id: '1', status: 'Approved' });
    fixture.detectChanges();

    // Check optimistic update
    expect(component['cinemas']().find((c) => c.id === '1')?.approvalStatus).toBe('Approved');

    expect(mockCinemaService.updateApprovalStatus).toHaveBeenCalledWith('1', 'Approved');
    expect(snackBarSpy.open).toHaveBeenCalled();
  });

  it('should revert status and show error snackbar on status change failure', () => {
    mockCinemaService.updateApprovalStatus.mockReturnValue(
      throwError(() => new Error('API Error')),
    );

    component.onStatusChange({ id: '1', status: 'Approved' });
    fixture.detectChanges();

    expect(snackBarSpy.open).toHaveBeenCalled();
    // Reverted back to Pending
    expect(component['cinemas']().find((c) => c.id === '1')?.approvalStatus).toBe('Pending');
  });

  it('should perform batch status updates successfully', () => {
    component.onBatchStatusChange({ ids: ['1', '2'], status: 'Approved' });
    fixture.detectChanges();

    expect(component['cinemas']().every((c) => c.approvalStatus === 'Approved')).toBe(true);
    expect(mockCinemaService.updateApprovalStatus).toHaveBeenCalledTimes(2);
    expect(snackBarSpy.open).toHaveBeenCalled();
  });

  it('should revert all batch changes if any individual update fails', () => {
    // Make second request fail
    mockCinemaService.updateApprovalStatus.mockImplementation((id: string) => {
      return id === '2' ? throwError(() => new Error('Fail')) : of(null);
    });

    component.onBatchStatusChange({ ids: ['1', '2'], status: 'Approved' });
    fixture.detectChanges();

    // Should have reverted to initial state
    expect(component['cinemas']().every((c) => c.approvalStatus === 'Pending')).toBe(true);
    expect(snackBarSpy.open).toHaveBeenCalled();
  });

  it('should set loading state correctly during loadCinemas', async () => {
    // Use a delayed observable to catch loading=true
    mockCinemaService.getCinemas.mockReturnValue(of(mockCinemas).pipe(delay(10)));

    const loadPromise = component.loadCinemas();
    expect(component['loading']()).toBe(true);

    // After it completes (need to wait for delay or use fakeAsync)
    // For simplicity in Vitest without fakeAsync setup:
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(component['loading']()).toBe(false);
  });
});
