import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel: string;
  confirmColor: 'approve' | 'reject';
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="p-7 bg-[#161a24] rounded-2xl border border-white/8">
      <!-- Icon -->
      <div
        class="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
        [class]="
          data.confirmColor === 'approve'
            ? 'bg-emerald-500/10 border border-emerald-500/20'
            : 'bg-red-500/10 border border-red-500/20'
        "
      >
        <mat-icon [class]="data.confirmColor === 'approve' ? 'text-emerald-500' : 'text-red-500'">
          {{ data.confirmColor === 'approve' ? 'check_circle' : 'cancel' }}
        </mat-icon>
      </div>

      <!-- Copy -->
      <mat-dialog-content class="!p-0">
        <h2 class="text-[16px] font-semibold text-slate-100 mb-2">{{ data.title }}</h2>
        <p class="text-[13px] text-slate-500 leading-relaxed" [innerHTML]="data.message"></p>
      </mat-dialog-content>

      <!-- Actions -->
      <mat-dialog-actions class="!pt-6 !pb-0 !px-0 flex gap-2 justify-end">
        <button
          mat-stroked-button
          (click)="ref.close(false)"
          class="!border-white/8 !text-slate-400 hover:!bg-white/5 !rounded-lg"
        >
          Cancel
        </button>
        <button
          mat-flat-button
          (click)="ref.close(true)"
          [class]="
            data.confirmColor === 'approve'
              ? '!bg-emerald-500 hover:!bg-emerald-600 !text-white !rounded-lg'
              : '!bg-red-500 hover:!bg-red-600 !text-white !rounded-lg'
          "
        >
          {{ data.confirmLabel }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
})
export class ConfirmDialogComponent {
  protected readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
  protected readonly ref = inject(MatDialogRef<ConfirmDialogComponent>);
}
