import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CinemasContainerComponent } from './cinemas.container';
import { CinemaService } from '../services/cinema.service';
import { of, throwError } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CinemasContainerComponent', () => {
  let component: CinemasContainerComponent;
  let fixture: ComponentFixture<CinemasContainerComponent>;
  let mockCinemaService: any;
  let snackBarSpy: any;

  beforeEach(async () => {
    mockCinemaService = {
      getCinemas: vi.fn().mockReturnValue(of([])),
      updateApprovalStatus: vi.fn().mockReturnValue(of(null))
    };

    snackBarSpy = {
      open: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [CinemasContainerComponent],
    })
    .overrideComponent(CinemasContainerComponent, {
      set: {
        providers: [
          { provide: CinemaService, useValue: mockCinemaService },
          { provide: MatSnackBar, useValue: snackBarSpy }
        ]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(CinemasContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load cinemas on init', () => {
    expect(mockCinemaService.getCinemas).toHaveBeenCalled();
  });

  it('should call updateApprovalStatus and show snackbar on success', () => {
    component.onStatusChange({ id: '1', status: 'Approved' });
    
    expect(mockCinemaService.updateApprovalStatus).toHaveBeenCalledWith('1', 'Approved');
    expect(snackBarSpy.open).toHaveBeenCalled();
  });

  it('should revert status and show error snackbar on failure', () => {
    const initialCinemas = [{ id: '1', name: 'C1', location: 'L1', contactEmail: 'e', approvalStatus: 'Pending' }] as any;
    mockCinemaService.getCinemas.mockReturnValue(of(initialCinemas));
    component.loadCinemas();
    fixture.detectChanges();
    
    mockCinemaService.updateApprovalStatus.mockReturnValue(throwError(() => new Error('API Error')));
    
    component.onStatusChange({ id: '1', status: 'Approved' });
    
    expect(snackBarSpy.open).toHaveBeenCalled();
    expect(component['cinemas']()[0].approvalStatus).toBe('Pending');
  });
});
