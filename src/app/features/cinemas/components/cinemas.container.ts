import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { CinemaResponse, CinemaService } from '../services/cinema.service';
import { CinemasViewComponent } from './cinemas.view';
import { CinemaStatusChangeEvent } from './cinemas.types';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cinemas-container',
  standalone: true,
  imports: [CinemasViewComponent, MatSnackBarModule],
  templateUrl: './cinemas.container.html',
})
export class CinemasContainerComponent implements OnInit {
  private readonly cinemaService = inject(CinemaService);
  private readonly snackBar = inject(MatSnackBar);
  protected readonly loading = signal<boolean>(false);

  protected readonly cinemas = signal<CinemaResponse[]>([]);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.loadCinemas();
  }

  loadCinemas() {
    this.loading.set(true);
    this.cinemaService
      .getCinemas()
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
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
    this.updateLocalStatus([id], status);

    this.cinemaService
      .updateApprovalStatus(id, status)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
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

  onBatchStatusChange(event: { ids: string[]; status: 'Approved' | 'Rejected' }) {
    const { ids, status } = event;

    // Optimistic UI update
    const previousCinemas = this.cinemas();
    this.updateLocalStatus(ids, status);

    this.snackBar.open(`Processing ${ids.length} cinemas...`, undefined, { duration: 2000 });

    const requests = ids.map((id) =>
      this.cinemaService
        .updateApprovalStatus(id, status)
        .pipe(catchError(() => of({ id, failed: true as const }))),
    );

    forkJoin(requests)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((results) => {
        const failed = results.filter(
          (r): r is { id: string; failed: true } => !!r && typeof r === 'object' && 'failed' in r,
        );

        if (failed.length > 0) {
          console.error(`${failed.length} batch updates failed`);
          this.snackBar.open(`${failed.length} updates failed. Reverting changes.`, 'Dismiss', {
            duration: 5000,
          });
          // Revert on error
          this.cinemas.set(previousCinemas);
        } else {
          this.snackBar.open(
            `${ids.length} cinemas ${status.toLowerCase()} successfully`,
            'Dismiss',
            {
              duration: 3000,
            },
          );
        }
      });
  }

  private updateLocalStatus(ids: string[], status: 'Approved' | 'Rejected' | 'Pending') {
    this.cinemas.update((current) =>
      current.map((c) => (ids.includes(c.id) ? { ...c, approvalStatus: status } : c)),
    );
  }
}
