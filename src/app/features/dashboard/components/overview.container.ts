import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { OverviewViewComponent, ServiceHealth } from './overview.view';

@Component({
  selector: 'app-overview-container',
  standalone: true,
  imports: [OverviewViewComponent],
  template: `<app-overview-view [services]="services()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewContainerComponent {
  protected readonly services = signal<ServiceHealth[]>([
    { name: 'Identity API', latency: 12, status: 'up' },
    { name: 'Cinema Service', latency: 45, status: 'up' },
    { name: 'Event Bus', latency: 5, status: 'up' },
    { name: 'Media Transformer', latency: 120, status: 'up' },
  ]);
}
