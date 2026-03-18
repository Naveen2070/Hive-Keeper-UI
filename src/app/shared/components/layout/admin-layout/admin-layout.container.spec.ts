import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminLayoutContainerComponent } from './admin-layout.container';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../../../features/auth/services/auth.service';
import { Component, signal } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

@Component({
  standalone: true,
  template: '',
})
class MockComponent {}

describe('AdminLayoutContainerComponent', () => {
  let component: AdminLayoutContainerComponent;
  let fixture: ComponentFixture<AdminLayoutContainerComponent>;
  let mockAuthService: any;

  beforeEach(async () => {
    mockAuthService = {
      userEmail: signal('test@example.com'),
      primaryRole: vi.fn().mockReturnValue('admin'),
      logout: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [AdminLayoutContainerComponent],
      providers: [
        provideRouter([{ path: 'login', component: MockComponent }]),
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLayoutContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call logout on onLogout', async () => {
    await component.onLogout();
    expect(mockAuthService.logout).toHaveBeenCalled();
  });
});
