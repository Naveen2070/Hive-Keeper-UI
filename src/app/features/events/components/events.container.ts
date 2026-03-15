import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EventDTO, EventService, EventStatus } from '../services/event.service';
import { EventsViewComponent } from './events.view';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../cinemas/components/confirm-dialog.component';

@Component({
  selector: 'app-events-container',
  standalone: true,
  imports: [EventsViewComponent, MatSnackBarModule, MatDialogModule],
  template: `
    <app-events-view
      [events]="events()"
      [loading]="loading()"
      (statusChange)="onStatusChange($event)"
      (deleteRequest)="onDelete($event)"
      (refresh)="loadEvents()"
    />
  `,
})
export class EventsContainerComponent implements OnInit {
  protected readonly events = signal<EventDTO[]>([]);
  protected readonly loading = signal<boolean>(false);
  private readonly eventService = inject(EventService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.loading.set(true);
    this.eventService
      .getEvents(0, 100)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (response) => this.events.set(response.content),
        error: (err) => {
          console.error('Failed to load events', err);
          this.snackBar.open('Failed to connect to Event Service.', 'Close', { duration: 5000 });
        },
      });
  }

  onStatusChange(event: { id: number; status: EventStatus }) {
    const previousEvents = this.events();

    // Optimistic UI Update
    this.events.update((current) =>
      current.map((e) => (e.id === event.id ? { ...e, status: event.status } : e)),
    );

    this.eventService
      .updateStatus(event.id, event.status)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () =>
          this.snackBar.open(`Event status updated to ${event.status}`, 'Dismiss', {
            duration: 3000,
          }),
        error: (err) => {
          console.error('Failed to update event status', err);
          this.snackBar.open(`Failed to update event status.`, 'Retry', { duration: 5000 });
          this.events.set(previousEvents); // Rollback
        },
      });
  }

  onDelete(id: number) {
    const event = this.events().find((e) => e.id === id);
    if (!event) return;

    this.dialog
      .open<ConfirmDialogComponent, ConfirmDialogData, boolean>(ConfirmDialogComponent, {
        width: '400px',
        panelClass: 'hive-dialog',
        data: {
          title: 'Delete Event?',
          message: `Are you absolutely sure you want to delete <strong>${event.title}</strong>? This action cannot be undone and will cancel all bookings.`,
          confirmLabel: 'Yes, delete permanently',
          confirmColor: 'reject',
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          const previousEvents = this.events();
          this.events.update((current) => current.filter((e) => e.id !== id));

          this.eventService
            .deleteEvent(id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () =>
                this.snackBar.open('Event deleted permanently.', 'Dismiss', { duration: 3000 }),
              error: (err) => {
                console.error('Failed to delete event', err);
                this.snackBar.open('Failed to delete event.', 'Close', { duration: 5000 });
                this.events.set(previousEvents); // Rollback
              },
            });
        }
      });
  }
}
