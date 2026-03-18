import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageRolesDialogComponent } from './manage-roles-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UserDto } from '../../services/user.service';

describe('ManageRolesDialogComponent', () => {
  let component: ManageRolesDialogComponent;
  let fixture: ComponentFixture<ManageRolesDialogComponent>;
  let mockDialogRef: any;

  const mockUser: UserDto = {
    id: '1',
    email: 'test@hive.com',
    fullName: 'Test User',
    active: true,
    roles: [{ roleId: 1, roleName: 'ADMIN', domain: 'events' }],
    createdAt: '',
    updatedAt: '',
  };

  beforeEach(async () => {
    mockDialogRef = {
      close: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ManageRolesDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { user: mockUser } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageRolesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with existing roles', () => {
    expect(component.form.get('events')?.value).toBe('ADMIN');
    expect(component.form.get('movies')?.value).toBe('NONE');
  });

  it('should format domain roles correctly on submit', () => {
    component.form.patchValue({
      events: 'NONE',
      movies: 'ORGANIZER',
    });

    component.onSubmit();

    expect(mockDialogRef.close).toHaveBeenCalledWith({
      domainRoles: {
        movies: 'ORGANIZER',
      },
    });
  });

  it('should close dialog when cancel button is clicked', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');
    const cancelBtn = Array.from(buttons).find((btn: any) =>
      btn.textContent.includes('Cancel'),
    ) as HTMLButtonElement;
    cancelBtn.click();
    expect(mockDialogRef.close).toHaveBeenCalledWith();
  });
});
