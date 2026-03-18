import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './sidebar.view.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  userEmail = input<string | undefined>();
  primaryRole = input<string>('N/A');
  logout = output<void>();
}
