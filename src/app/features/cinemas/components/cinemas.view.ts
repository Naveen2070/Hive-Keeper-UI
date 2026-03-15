import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SelectionModel } from '@angular/cdk/collections';
import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
import { CinemaResponse } from '../services/cinema.service';
import { CinemaStatusChangeEvent } from './cinemas.types';
import { ConfirmDialogComponent, ConfirmDialogData } from './confirm-dialog.component';

@Component({
  selector: 'app-cinemas-view',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatCheckboxModule,
    MatTooltipModule,
    ClipboardModule,
  ],
  templateUrl: './cinemas.view.html',
  styleUrl: './cinemas.view.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CinemasViewComponent {
  loading = input<boolean>(false);
  batchStatusChange = output<{ ids: string[]; status: 'Approved' | 'Rejected' }>();

  cinemas = input<CinemaResponse[]>([]);
  searchQuery = signal<string>('');

  statusChange = output<CinemaStatusChangeEvent>();
  activeTab = signal<string>('All');
  refresh = output<void>();
  selection = new SelectionModel<CinemaResponse>(true, []);
  filteredCinemas = computed(() => {
    let result = this.cinemas();

    // Tab Filtering
    if (this.activeTab() !== 'All') {
      result = result.filter((c) => c.approvalStatus === this.activeTab());
    }

    // Search Filtering
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.location.toLowerCase().includes(query) ||
          c.contactEmail.toLowerCase().includes(query) ||
          c.id.toLowerCase().includes(query),
      );
    }

    return result;
  });
  protected readonly cols = ['select', 'name', 'location', 'approvalStatus', 'actions'];
  protected readonly skeletonData: any[] = Array.from({ length: 5 }, (_, i) => ({ _skeleton: i }));
  protected readonly tabs = [
    { id: 'All', label: 'All Submissions', count: computed(() => this.cinemas().length) },
    {
      id: 'Pending',
      label: 'Pending',
      count: computed(() => this.cinemas().filter((c) => c.approvalStatus === 'Pending').length),
    },
    {
      id: 'Approved',
      label: 'Approved',
      count: computed(() => this.cinemas().filter((c) => c.approvalStatus === 'Approved').length),
    },
    {
      id: 'Rejected',
      label: 'Rejected',
      count: computed(() => this.cinemas().filter((c) => c.approvalStatus === 'Rejected').length),
    },
  ];
  private readonly dialog = inject(MatDialog);
  private readonly clipboard = inject(Clipboard);

  constructor() {
    effect(() => {
      this.cinemas(); // track changes
      this.selection.clear();
    });
  }

  onSearch(query: string) {
    this.searchQuery.set(query);
    this.selection.clear();
  }

  clearFilters() {
    this.searchQuery.set('');
    this.activeTab.set('All');
    this.selection.clear();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.filteredCinemas().length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.filteredCinemas().forEach((row) => this.selection.select(row));
  }

  copyToClipboard(text: string) {
    this.clipboard.copy(text);
  }

  protected statusClass(status: string) {
    return (
      {
        Pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        Approved: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        Rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
      }[status] ?? ''
    );
  }

  protected dotClass(status: string) {
    return (
      { Pending: 'bg-amber-500', Approved: 'bg-emerald-500', Rejected: 'bg-red-500' }[status] ?? ''
    );
  }

  protected getTabClass(tabId: string) {
    if (this.activeTab() !== tabId) {
      return 'text-slate-500 border-transparent hover:text-slate-300 hover:bg-white/5';
    }

    const activeBase = 'border-b-2 ';
    switch (tabId) {
      case 'Pending':
        return activeBase + 'text-amber-400 border-amber-400 bg-amber-400/5';
      case 'Approved':
        return activeBase + 'text-emerald-400 border-emerald-400 bg-emerald-400/5';
      case 'Rejected':
        return activeBase + 'text-red-400 border-red-400 bg-red-400/5';
      default:
        return activeBase + 'text-blue-400 border-blue-400 bg-blue-400/5';
    }
  }

  protected onAction(cinema: CinemaResponse, status: 'Approved' | 'Rejected') {
    const isApprove = status === 'Approved';
    this.dialog
      .open<ConfirmDialogComponent, ConfirmDialogData, boolean>(ConfirmDialogComponent, {
        width: '380px',
        panelClass: 'hive-dialog',
        data: {
          title: isApprove ? 'Approve Cinema?' : 'Reject Cinema?',
          message: `You're about to <strong>${status.toLowerCase()}</strong> <strong>${cinema.name}</strong>. This will notify the organizer.`,
          confirmLabel: isApprove ? 'Yes, approve' : 'Yes, reject',
          confirmColor: isApprove ? 'approve' : 'reject',
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) this.statusChange.emit({ id: cinema.id, status });
      });
  }

  protected onBatchAction(status: 'Approved' | 'Rejected') {
    const count = this.selection.selected.length;
    const isApprove = status === 'Approved';

    this.dialog
      .open<ConfirmDialogComponent, ConfirmDialogData, boolean>(ConfirmDialogComponent, {
        width: '400px',
        panelClass: 'hive-dialog',
        data: {
          title: `Batch ${status} ${count} Cinemas?`,
          message: `You are about to <strong>${status.toLowerCase()}</strong> <strong>${count} selected cinemas</strong>. This action will notify all associated organizers.`,
          confirmLabel: isApprove ? `Approve All (${count})` : `Reject All (${count})`,
          confirmColor: isApprove ? 'approve' : 'reject',
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          const ids = this.selection.selected.map((c) => c.id);
          this.batchStatusChange.emit({ ids, status });
          this.selection.clear();
        }
      });
  }
}
