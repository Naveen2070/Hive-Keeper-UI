import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('Hive-Keeper-UI');

  constructor() {
    console.log(
      `%c[HIVE-KEEPER-UI]%c Mode: ${environment.production ? 'Production' : 'Development'} | Mocking: ${environment.enableMock ? 'Enabled' : 'Disabled'}`,
      'color: #6366f1; font-weight: bold;',
      'color: inherit;',
    );
  }
}
