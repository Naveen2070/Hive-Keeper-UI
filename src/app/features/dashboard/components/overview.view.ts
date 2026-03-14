import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface ServiceHealth {
  name: string;
  latency: number;
  status: string;
}

@Component({
  selector: 'app-overview-view',
  standalone: true,
  imports: [],
  templateUrl: './overview.view.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewViewComponent {
  services = input<ServiceHealth[]>([]);
}
