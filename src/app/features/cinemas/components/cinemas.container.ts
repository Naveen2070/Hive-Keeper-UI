import { Component, inject, OnInit, signal } from '@angular/core';
import { CinemaResponse, CinemaService } from '../services/cinema.service';
import { CinemasViewComponent, CinemaStatusChangeEvent } from './cinemas.view';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cinemas-container',
  standalone: true,
  imports: [CinemasViewComponent, MatSnackBarModule],
  template: `
    <app-cinemas-view
      [cinemas]="cinemas()"
      (statusChange)="onStatusChange($event)"
      (refresh)="loadCinemas()"
    />
  `,
})
export class CinemasContainerComponent implements OnInit {
  private readonly cinemaService = inject(CinemaService);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly cinemas = signal<CinemaResponse[]>([]);

  ngOnInit() {
    this.loadCinemas();
  }

  loadCinemas() {
    this.cinemaService.getCinemas().subscribe({
      next: (data) => this.cinemas.set(data),
      error: (err) => {
        console.error('Failed to load cinemas', err);
        this.snackBar.open('Failed to load cinemas. Please try again.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  onStatusChange(event: CinemaStatusChangeEvent) {
    const { id, status } = event;

    // Optimistic UI update
    const previousCinemas = this.cinemas();
    this.cinemas.update((current) =>
      current.map((c) => (c.id === id ? { ...c, approvalStatus: status } : c)),
    );

    this.cinemaService.updateApprovalStatus(id, status).subscribe({
      next: () => {
        this.snackBar.open(`Cinema ${status.toLowerCase()} successfully`, 'Dismiss', {
          duration: 3000,
        });
      },
      error: (err) => {
        console.error('Failed to update status', err);
        this.snackBar.open(`Failed to ${status.toLowerCase()} cinema.`, 'Retry', {
          duration: 5000,
        });
        // Revert on error
        this.cinemas.set(previousCinemas);
      },
    });
  }
}
