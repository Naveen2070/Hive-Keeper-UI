import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverviewContainerComponent } from './overview.container';
import { AuthService } from '../../auth/services/auth.service';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('OverviewContainerComponent', () => {
  let component: OverviewContainerComponent;
  let fixture: ComponentFixture<OverviewContainerComponent>;

  beforeEach(async () => {
    const mockAuthService = {
      isAuthenticated: vi.fn().mockReturnValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [OverviewContainerComponent],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compileComponents();

    fixture = TestBed.createComponent(OverviewContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
