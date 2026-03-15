import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { EventDTO, EventStatus } from '../services/event.service';

@Component({
  selector: 'app-events-view',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatDividerModule,
    DatePipe,
  ],
  templateUrl: './events.view.html',
  styleUrl: './events.view.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsViewComponent {
  events = input<EventDTO[]>([]);
  loading = input<boolean>(false);

  statusChange = output<{ id: number; status: EventStatus }>();
  deleteRequest = output<number>();
  refresh = output<void>();

  searchQuery = signal<string>('');
  activeTab = signal<string>('All');
  filteredEvents = computed(() => {
    let result = this.events();

    if (this.activeTab() !== 'All') {
      result = result.filter((e) => e.status === this.activeTab());
    }

    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(query) ||
          e.organizerName.toLowerCase().includes(query) ||
          e.location.toLowerCase().includes(query),
      );
    }

    return result;
  });
  protected readonly cols = ['title', 'organizer', 'dates', 'status', 'actions'];
  protected readonly skeletonData: any[] = Array.from({ length: 5 }, (_, i) => ({ _skeleton: i }));
  protected readonly tabs = [
    { id: 'All', label: 'All Events', count: computed(() => this.events().length) },
    {
      id: 'PUBLISHED',
      label: 'Published',
      count: computed(() => this.events().filter((e) => e.status === 'PUBLISHED').length),
    },
    {
      id: 'DRAFT',
      label: 'Drafts',
      count: computed(() => this.events().filter((e) => e.status === 'DRAFT').length),
    },
    {
      id: 'CANCELLED',
      label: 'Cancelled',
      count: computed(() => this.events().filter((e) => e.status === 'CANCELLED').length),
    },
  ];

  onSearch(query: string) {
    this.searchQuery.set(query);
  }

  protected statusClass(status: EventStatus) {
    return (
      {
        DRAFT: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
        PUBLISHED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        COMPLETED: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        CANCELLED: 'bg-red-500/10 text-red-400 border-red-500/20',
      }[status] ?? ''
    );
  }

  protected getTabClass(tabId: string) {
    if (this.activeTab() !== tabId) {
      return 'text-slate-500 border-transparent hover:text-slate-300 hover:bg-white/5';
    }

    const activeBase = 'border-b-2 ';
    switch (tabId) {
      case 'PUBLISHED':
        return activeBase + 'text-emerald-400 border-emerald-400 bg-emerald-400/5';
      case 'CANCELLED':
        return activeBase + 'text-red-400 border-red-400 bg-red-400/5';
      default:
        return activeBase + 'text-blue-400 border-blue-400 bg-blue-400/5';
    }
  }
}
