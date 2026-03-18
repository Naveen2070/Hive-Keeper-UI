import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventsViewComponent } from './events.view';
import { EventStatus } from '../services/event.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { beforeEach, describe, expect, it } from 'vitest';

describe('EventsViewComponent', () => {
  let component: EventsViewComponent;
  let fixture: ComponentFixture<EventsViewComponent>;

  const mockEvents = [
    {
      id: 1,
      title: 'Rock Concert',
      status: 'PUBLISHED' as EventStatus,
      organizerName: 'Org 1',
      location: 'London',
      startDate: '2026-03-20T20:00:00',
      endDate: '2026-03-20T23:00:00',
    },
    {
      id: 2,
      title: 'Art Gallery',
      status: 'DRAFT' as EventStatus,
      organizerName: 'Org 2',
      location: 'Paris',
      startDate: '2026-03-21T10:00:00',
      endDate: '2026-03-21T18:00:00',
    },
    {
      id: 3,
      title: 'Tech Talk',
      status: 'CANCELLED' as EventStatus,
      organizerName: 'Org 3',
      location: 'Berlin',
      startDate: '2026-03-22T09:00:00',
      endDate: '2026-03-22T12:00:00',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsViewComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(EventsViewComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('events', mockEvents);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter events by search query', () => {
    component.onSearch('rock');
    fixture.detectChanges();
    expect(component.filteredEvents()).toHaveLength(1);
    expect(component.filteredEvents()[0].title).toBe('Rock Concert');
  });

  it('should filter events by tab', () => {
    component.activeTab.set('PUBLISHED');
    fixture.detectChanges();
    expect(component.filteredEvents()).toHaveLength(1);
    expect(component.filteredEvents()[0].status).toBe('PUBLISHED');
  });

  it('should show all events when "All" tab is active', () => {
    component.activeTab.set('All');
    fixture.detectChanges();
    expect(component.filteredEvents()).toHaveLength(3);
  });

  it('should count events for each tab correctly', () => {
    const allTab = (component as any).tabs.find((t: any) => t.id === 'All');
    const publishedTab = (component as any).tabs.find((t: any) => t.id === 'PUBLISHED');

    expect(allTab?.count()).toBe(3);
    expect(publishedTab?.count()).toBe(1);
  });
});
