import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CinemaResponse } from '../services/cinema.service';

export interface CinemaStatusChangeEvent {
  id: string;
  status: 'Approved' | 'Rejected';
}

@Component({
  selector: 'app-cinemas-view',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule],
  template: `
    <div class="space-y-6 animate-in fade-in duration-500">
      <header class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-white tracking-tight">Cinema Approvals</h1>
          <p class="text-slate-400 mt-1">Review and manage organizer cinema submissions.</p>
        </div>
        <button
          mat-stroked-button
          (click)="refresh.emit()"
          class="!border-white/10 !text-slate-300 hover:!bg-white/5"
        >
          <mat-icon>refresh</mat-icon> Refresh Data
        </button>
      </header>

      <div class="bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
        <table mat-table [dataSource]="cinemas()" class="w-full !bg-transparent">
          <ng-container matColumnDef="name">
            <th
              mat-header-cell
              *matHeaderCellDef
              class="!text-slate-400 !font-mono !text-[11px] !uppercase !tracking-widest !border-white/5"
            >
              Cinema Name
            </th>
            <td mat-cell *matCellDef="let cinema" class="!text-slate-200 !font-medium !border-white/5">
              {{ cinema.name }}
            </td>
          </ng-container>

          <ng-container matColumnDef="location">
            <th
              mat-header-cell
              *matHeaderCellDef
              class="!text-slate-400 !font-mono !text-[11px] !uppercase !tracking-widest !border-white/5"
            >
              Location
            </th>
            <td mat-cell *matCellDef="let cinema" class="!text-slate-400 !border-white/5">
              <div class="flex items-center gap-2">
                <mat-icon class="scale-75 opacity-50">location_on</mat-icon>
                {{ cinema.location }}
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="approvalStatus">
            <th
              mat-header-cell
              *matHeaderCellDef
              class="!text-slate-400 !font-mono !text-[11px] !uppercase !tracking-widest !border-white/5"
            >
              Status
            </th>
            <td mat-cell *matCellDef="let cinema" class="!border-white/5">
              <span
                class="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border"
                [class.bg-amber-500\/10]="cinema.approvalStatus === 'Pending'"
                [class.text-amber-500]="cinema.approvalStatus === 'Pending'"
                [class.border-amber-500\/20]="cinema.approvalStatus === 'Pending'"
                [class.bg-emerald-500\/10]="cinema.approvalStatus === 'Approved'"
                [class.text-emerald-500]="cinema.approvalStatus === 'Approved'"
                [class.border-emerald-500\/20]="cinema.approvalStatus === 'Approved'"
                [class.bg-red-500\/10]="cinema.approvalStatus === 'Rejected'"
                [class.text-red-500]="cinema.approvalStatus === 'Rejected'"
                [class.border-red-500\/20]="cinema.approvalStatus === 'Rejected'"
              >
                {{ cinema.approvalStatus }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th
              mat-header-cell
              *matHeaderCellDef
              class="!text-right !text-slate-400 !font-mono !text-[11px] !uppercase !tracking-widest !border-white/5"
            >
              Actions
            </th>
            <td mat-cell *matCellDef="let cinema" class="!text-right !border-white/5">
              <div class="flex justify-end gap-2">
                <button
                  mat-icon-button
                  (click)="statusChange.emit({ id: cinema.id, status: 'Approved' })"
                  [disabled]="cinema.approvalStatus === 'Approved'"
                  class="!text-emerald-500 disabled:!text-slate-600 hover:bg-emerald-500/10 transition-colors"
                >
                  <mat-icon>check_circle</mat-icon>
                </button>
                <button
                  mat-icon-button
                  (click)="statusChange.emit({ id: cinema.id, status: 'Rejected' })"
                  [disabled]="cinema.approvalStatus === 'Rejected'"
                  class="!text-red-500 disabled:!text-slate-600 hover:bg-red-500/10 transition-colors"
                >
                  <mat-icon>cancel</mat-icon>
                </button>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr
            mat-row
            *matRowDef="let row; columns: displayedColumns"
            class="hover:bg-white/[0.02] transition-colors"
          ></tr>
        </table>

        @if (cinemas().length === 0) {
          <div class="p-12 text-center flex flex-col items-center justify-center text-slate-500">
            <mat-icon class="scale-150 mb-4 opacity-50">inbox</mat-icon>
            <p>No cinemas found matching criteria.</p>
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CinemasViewComponent {
  cinemas = input<CinemaResponse[]>([]);
  statusChange = output<CinemaStatusChangeEvent>();
  refresh = output<void>();

  protected readonly displayedColumns: string[] = ['name', 'location', 'approvalStatus', 'actions'];
}
