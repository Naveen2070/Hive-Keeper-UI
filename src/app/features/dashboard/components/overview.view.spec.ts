import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverviewViewComponent } from './overview.view';
import { beforeEach, describe, expect, it } from 'vitest';

describe('OverviewViewComponent', () => {
  let component: OverviewViewComponent;
  let fixture: ComponentFixture<OverviewViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OverviewViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render services', () => {
    fixture.componentRef.setInput('services', [
      { name: 'Test Service', latency: 10, status: 'up' },
    ]);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test Service');
  });
});
