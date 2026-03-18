import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { UserDto } from '../services/user.service';

@Component({
  selector: 'app-users-view',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatDividerModule,
    DatePipe,
  ],
  templateUrl: './users.view.html',
  styleUrl: './users.view.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersViewComponent {
  users = input<UserDto[]>([]);
  loading = input<boolean>(false);

  toggleStatus = output<{ id: string; currentStatus: boolean }>();
  deleteRequest = output<string>();
  createRequest = output<void>();
  editRolesRequest = output<UserDto>();
  refresh = output<void>();

  searchQuery = signal<string>('');
  activeTab = signal<string>('All');
  filteredUsers = computed(() => {
    let result = this.users();

    if (this.activeTab() === 'Active') result = result.filter((u) => u.active);
    if (this.activeTab() === 'Banned') result = result.filter((u) => !u.active);

    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      result = result.filter(
        (u) =>
          u.fullName.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query) ||
          u.id.toLowerCase().includes(query),
      );
    }
    return result;
  });
  protected readonly cols = ['user', 'roles', 'status', 'joined', 'actions'];
  protected readonly skeletonData: any[] = Array.from({ length: 5 }, (_, i) => ({ _skeleton: i }));
  protected readonly tabs = [
    { id: 'All', label: 'All Users', count: computed(() => this.users().length) },
    {
      id: 'Active',
      label: 'Active',
      count: computed(() => this.users().filter((u) => u.active).length),
    },
    {
      id: 'Banned',
      label: 'Banned',
      count: computed(() => this.users().filter((u) => !u.active).length),
    },
  ];

  onSearch(query: string) {
    this.searchQuery.set(query);
  }

  getRoleColor(roleName: string): string {
    if (roleName.includes('SUPER_ADMIN'))
      return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    if (roleName.includes('ADMIN')) return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    if (roleName.includes('ORGANIZER'))
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }

  getTabClass(tabId: string) {
    if (this.activeTab() !== tabId) {
      return 'text-slate-500 border-transparent hover:text-slate-300 hover:bg-white/5';
    }
    const base = 'border-b-2 ';
    if (tabId === 'Banned') return base + 'text-red-400 border-red-400 bg-red-400/5';
    if (tabId === 'Active') return base + 'text-emerald-400 border-emerald-400 bg-emerald-400/5';
    return base + 'text-blue-400 border-blue-400 bg-blue-400/5';
  }
}
