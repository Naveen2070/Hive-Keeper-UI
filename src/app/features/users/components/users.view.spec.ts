import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersViewComponent } from './users.view';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { beforeEach, describe, expect, it } from 'vitest';

describe('UsersViewComponent', () => {
  let component: UsersViewComponent;
  let fixture: ComponentFixture<UsersViewComponent>;

  const mockUsers = [
    {
      id: '1',
      email: 'admin@test.com',
      fullName: 'Admin User',
      active: true,
      roles: [{ roleId: 1, roleName: 'SUPER_ADMIN', domain: 'identity' }],
      createdAt: '',
      updatedAt: '',
    },
    {
      id: '2',
      email: 'org@test.com',
      fullName: 'Org User',
      active: true,
      roles: [{ roleId: 2, roleName: 'ORGANIZER', domain: 'events' }],
      createdAt: '',
      updatedAt: '',
    },
    {
      id: '3',
      email: 'banned@test.com',
      fullName: 'Banned User',
      active: false,
      roles: [],
      createdAt: '',
      updatedAt: '',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersViewComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersViewComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('users', mockUsers);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter users by search query', () => {
    component.onSearch('admin');
    fixture.detectChanges();
    expect(component.filteredUsers()).toHaveLength(1);
    expect(component.filteredUsers()[0].fullName).toBe('Admin User');
  });

  it('should filter users by active tab', () => {
    component.activeTab.set('Active');
    fixture.detectChanges();
    expect(component.filteredUsers()).toHaveLength(2);
    expect(component.filteredUsers().every((u) => u.active)).toBe(true);
  });

  it('should filter users by banned tab', () => {
    component.activeTab.set('Banned');
    fixture.detectChanges();
    expect(component.filteredUsers()).toHaveLength(1);
    expect(component.filteredUsers()[0].active).toBe(false);
  });

  it('should show all users when "All" tab is active', () => {
    component.activeTab.set('All');
    fixture.detectChanges();
    expect(component.filteredUsers()).toHaveLength(3);
  });

  it('should return correct role colors', () => {
    expect(component.getRoleColor('SUPER_ADMIN')).toContain('bg-purple-500/10');
    expect(component.getRoleColor('ADMIN')).toContain('bg-blue-500/10');
    expect(component.getRoleColor('ORGANIZER')).toContain('bg-emerald-500/10');
    expect(component.getRoleColor('USER')).toContain('bg-slate-500/10');
  });

  it('should count users for each tab correctly', () => {
    const allTab = (component as any).tabs.find((t: any) => t.id === 'All');
    const activeTab = (component as any).tabs.find((t: any) => t.id === 'Active');
    const bannedTab = (component as any).tabs.find((t: any) => t.id === 'Banned');

    expect(allTab?.count()).toBe(3);
    expect(activeTab?.count()).toBe(2);
    expect(bannedTab?.count()).toBe(1);
  });
});
