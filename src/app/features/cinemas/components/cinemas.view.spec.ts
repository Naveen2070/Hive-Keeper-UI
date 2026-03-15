import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CinemasViewComponent } from './cinemas.view';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CinemaResponse } from '../services/cinema.service';
import { of } from 'rxjs';

describe('CinemasViewComponent', () => {
  let component: CinemasViewComponent;
  let fixture: ComponentFixture<CinemasViewComponent>;

  const mockCinemas: CinemaResponse[] = [
    {
      id: '1',
      name: 'Grand IMAX',
      location: 'NYC',
      contactEmail: 'a@b.com',
      approvalStatus: 'Pending',
    },
    {
      id: '2',
      name: 'Horizon Cine',
      location: 'LA',
      contactEmail: 'b@c.com',
      approvalStatus: 'Approved',
    },
    {
      id: '3',
      name: 'Vintage Film',
      location: 'CHI',
      contactEmail: 'c@d.com',
      approvalStatus: 'Rejected',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CinemasViewComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CinemasViewComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('cinemas', mockCinemas);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter cinemas by search query', () => {
    component.onSearch('Grand');
    fixture.detectChanges();

    expect(component.filteredCinemas()).toHaveLength(1);
    expect(component.filteredCinemas()[0].name).toBe('Grand IMAX');
  });

  it('should filter cinemas by tab', () => {
    component.activeTab.set('Approved');
    fixture.detectChanges();

    expect(component.filteredCinemas()).toHaveLength(1);
    expect(component.filteredCinemas()[0].approvalStatus).toBe('Approved');
  });

  it('should clear selection when cinemas input changes via effect', async () => {
    // Select an item
    component.selection.select(mockCinemas[0]);
    expect(component.selection.selected).toHaveLength(1);

    // Update input
    fixture.componentRef.setInput('cinemas', [...mockCinemas]);
    fixture.detectChanges();

    // Wait for effect to run
    await fixture.whenStable();

    expect(component.selection.selected).toHaveLength(0);
  });

  it('should toggle all visible cinemas via masterToggle', () => {
    component.masterToggle();
    fixture.detectChanges();
    expect(component.selection.selected).toHaveLength(3);

    component.masterToggle();
    fixture.detectChanges();
    expect(component.selection.selected).toHaveLength(0);
  });

  it('should only toggle filtered cinemas via masterToggle', () => {
    component.onSearch('Grand');
    fixture.detectChanges();

    component.masterToggle();
    fixture.detectChanges();

    expect(component.selection.selected).toHaveLength(1);
    expect(component.selection.selected[0].name).toBe('Grand IMAX');
  });

  it('should emit statusChange event when onAction is confirmed', () => {
    // Mock dialog to return true
    const dialogSpy = vi.spyOn((component as any).dialog, 'open').mockReturnValue({
      afterClosed: () => of(true),
    } as any);
    const emitSpy = vi.spyOn(component.statusChange, 'emit');

    (component as any).onAction(mockCinemas[0], 'Approved');

    expect(emitSpy).toHaveBeenCalledWith({ id: '1', status: 'Approved' });
  });

  it('should show skeleton when loading is true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    // Each skeleton row has multiple pulsing elements
    expect(compiled.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });
});
