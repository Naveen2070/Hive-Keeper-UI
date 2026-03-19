import { Component, inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { EventDTO } from '../../services/event.service';
import { BookingDTO, BookingService, BookingStatus } from '../../services/booking.service';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-bookings-dialog',
  standalone: true,
  imports: [MatDialogModule, CurrencyPipe, DatePipe],
  templateUrl: './bookings-dialog.component.html',
  styleUrl: './bookings-dialog.component.css'
})
export class BookingsDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<BookingsDialogComponent>);
  readonly event: EventDTO = inject(MAT_DIALOG_DATA);
  private readonly bookingService = inject(BookingService);

  bookings = signal<BookingDTO[]>([]);
  loading = signal<boolean>(true);
  error = signal<string>('');

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.loading.set(true);
    this.bookingService.getEventBookings(this.event.id).subscribe({
      next: (data) => {
        this.bookings.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load bookings', err);
        this.error.set('Failed to load bookings. Please try again later.');
        this.loading.set(false);
      }
    });
  }

  updateStatus(bookingId: string, status: BookingStatus) {
    if (!confirm(`Are you sure you want to mark this booking as ${status}?`)) return;

    this.bookingService.updateBookingStatus(bookingId, status).subscribe({
      next: (updatedBooking) => {
        this.bookings.update(current => 
          current.map(b => b.id === bookingId ? updatedBooking : b)
        );
      },
      error: (err) => {
        console.error('Failed to update booking status', err);
        alert('Failed to update booking status.');
      }
    });
  }

  close() {
    this.dialogRef.close();
  }
}
