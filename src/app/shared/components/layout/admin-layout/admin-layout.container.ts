import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../features/auth/services/auth.service';
import { SidebarComponent } from '../sidebar/sidebar.view';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, MatIconModule, SidebarComponent],
  templateUrl: './admin-layout.view.html',
  styleUrl: './admin-layout.view.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayoutContainerComponent {
  private authService = inject(AuthService);
  // Read signals from AuthService
  userEmail = this.authService.userEmail;
  // Computed signal: check movies domain role (default is 'events' in service)
  primaryRole = computed(() => this.authService.primaryRole('movies'));
  private router = inject(Router);

  async onLogout() {
    this.authService.logout();
    await this.router.navigate(['/login']);
  }
}
