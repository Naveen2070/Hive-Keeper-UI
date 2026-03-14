import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  protected readonly title = signal('Hive Keeper Admin');

  ngOnInit() {
    console.log(
      `%c[HIVE-KEEPER-UI]%c Mode: ${environment.production ? 'Production' : 'Development'} | Mocking: ${environment.enableMock ? 'Enabled' : 'Disabled'}`,
      'color: #6366f1; font-weight: bold;',
      'color: inherit;',
    );
  }
}
