import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { EventDTO, EventService, TicketTierDTO } from '../../services/event.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-manage-tiers-dialog',
  standalone: true,
  imports: [MatDialogModule, ReactiveFormsModule, CurrencyPipe, DatePipe],
  templateUrl: './manage-tiers-dialog.component.html',
  styleUrl: './manage-tiers-dialog.component.css'
})
export class ManageTiersDialogComponent {
  private readonly eventService = inject(EventService);
  private readonly fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<ManageTiersDialogComponent>);
  readonly event: EventDTO = inject(MAT_DIALOG_DATA);

  tiers: TicketTierDTO[] = [...this.event.ticketTiers];
  
  tierForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    totalAllocation: [0, [Validators.required, Validators.min(1)]],
    validFrom: ['', Validators.required],
    validUntil: ['', Validators.required],
  });
  
  isAdding = false;
  editingTierId: number | null = null;
  error = '';

  startAdding() {
    this.isAdding = true;
    this.editingTierId = null;
    this.tierForm.reset();
  }

  cancelAdding() {
    this.isAdding = false;
    this.editingTierId = null;
    this.tierForm.reset();
    this.error = '';
  }

  editTier(tier: TicketTierDTO) {
    this.isAdding = true;
    this.editingTierId = tier.id;
    this.tierForm.patchValue({
      name: tier.name,
      price: tier.price,
      totalAllocation: tier.totalAllocation,
      validFrom: tier.validFrom.split('T')[0], // Assuming date format needs truncation for input
      validUntil: tier.validUntil.split('T')[0],
    });
  }

  saveTier() {
    if (this.tierForm.invalid) return;

    const formValue = this.tierForm.value;
    const tierData: Omit<TicketTierDTO, 'id'> = {
      name: formValue.name,
      price: formValue.price,
      totalAllocation: formValue.totalAllocation,
      availableAllocation: formValue.totalAllocation, // New tiers start fully available
      validFrom: new Date(formValue.validFrom).toISOString(),
      validUntil: new Date(formValue.validUntil).toISOString(),
    };

    if (this.editingTierId) {
      this.eventService.updateTier(this.editingTierId, tierData).subscribe({
        next: (updatedTier) => {
          const index = this.tiers.findIndex(t => t.id === this.editingTierId);
          if (index !== -1) {
            this.tiers[index] = updatedTier;
          }
          this.cancelAdding();
        },
        error: (err) => {
          this.error = 'Failed to update tier.';
          console.error(err);
        }
      });
    } else {
      this.eventService.addTier(this.event.id, tierData).subscribe({
        next: (newTier) => {
          this.tiers.push(newTier);
          this.cancelAdding();
        },
        error: (err) => {
          this.error = 'Failed to add tier.';
          console.error(err);
        }
      });
    }
  }

  deleteTier(id: number) {
    if (!confirm('Are you sure you want to delete this tier?')) return;
    
    this.eventService.deleteTier(id).subscribe({
      next: () => {
        this.tiers = this.tiers.filter(t => t.id !== id);
      },
      error: (err) => {
        this.error = 'Failed to delete tier. Ensure no tickets are sold.';
        console.error(err);
      }
    });
  }

  close() {
    this.dialogRef.close(this.tiers);
  }
}
