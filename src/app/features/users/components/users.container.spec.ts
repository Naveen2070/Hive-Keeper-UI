import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersContainerComponent } from './users.container';
import { UserService } from '../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CreateUserDialogComponent } from './create-user-dialog/create-user-dialog.component';
import { ManageRolesDialogComponent } from './manage-roles-dialog/manage-roles-dialog.component';

describe('UsersContainerComponent', () => {
  let component: UsersContainerComponent;
  let fixture: ComponentFixture<UsersContainerComponent>;
  let mockUserService: any;
  let mockDialog: any;
  let mockSnackBar: any;

  const mockUsers = [
    {
      id: '1',
      email: 'user1@test.com',
      fullName: 'User One',
      active: true,
      roles: [],
      createdAt: '',
      updatedAt: '',
    },
    {
      id: '2',
      email: 'user2@test.com',
      fullName: 'User Two',
      active: false,
      roles: [],
      createdAt: '',
      updatedAt: '',
    },
  ];

  beforeEach(async () => {
    mockUserService = {
      getUsers: vi.fn().mockReturnValue(of({ content: mockUsers })),
      toggleStatus: vi.fn().mockReturnValue(of({})),
      hardDeleteUser: vi.fn().mockReturnValue(of({})),
      createUser: vi
        .fn()
        .mockReturnValue(of({ id: '3', email: 'new@test.com', fullName: 'New User' })),
      updateRoles: vi
        .fn()
        .mockReturnValue(of({ ...mockUsers[0], roles: [{ roleName: 'ADMIN', domain: 'events' }] })),
    };

    mockDialog = {
      open: vi.fn().mockReturnValue({ afterClosed: () => of(true) }),
    };

    mockSnackBar = {
      open: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [UsersContainerComponent, NoopAnimationsModule],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
    })
      .overrideComponent(UsersContainerComponent, {
        set: {
          providers: [
            { provide: UserService, useValue: mockUserService },
            { provide: MatDialog, useValue: mockDialog },
            { provide: MatSnackBar, useValue: mockSnackBar },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(UsersContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    expect(mockUserService.getUsers).toHaveBeenCalled();
    expect((component as any).users()).toEqual(mockUsers);
  });

  it('should open confirmation dialog for banning a user', () => {
    component.onToggleStatus('1', true);
    expect(mockDialog.open).toHaveBeenCalledWith(
      ConfirmDialogComponent,
      expect.objectContaining({
        data: expect.objectContaining({ title: 'Ban User?' }),
      }),
    );
  });

  it('should open confirmation dialog for unbanning a user', () => {
    component.onToggleStatus('2', false);
    expect(mockDialog.open).toHaveBeenCalledWith(
      ConfirmDialogComponent,
      expect.objectContaining({
        data: expect.objectContaining({ title: 'Unban User?' }),
      }),
    );
  });

  it('should toggle status if confirmed', () => {
    component.onToggleStatus('1', true);
    expect(mockUserService.toggleStatus).toHaveBeenCalledWith('1', false);
  });

  it('should not toggle status if cancelled', () => {
    mockDialog.open.mockReturnValue({ afterClosed: () => of(false) });
    component.onToggleStatus('1', true);
    expect(mockUserService.toggleStatus).not.toHaveBeenCalled();
  });

  it('should handle toggle status error and rollback', () => {
    mockUserService.toggleStatus.mockReturnValue(throwError(() => new Error('API Error')));
    const initialUsers = [...(component as any).users()];

    component.onToggleStatus('1', true);

    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'Failed to update user status.',
      'Retry',
      expect.anything(),
    );
    expect((component as any).users()).toEqual(initialUsers);
  });

  it('should open confirmation dialog for hard delete', () => {
    component.onDelete('1');
    expect(mockDialog.open).toHaveBeenCalledWith(
      ConfirmDialogComponent,
      expect.objectContaining({
        data: expect.objectContaining({ title: 'Hard Delete User?' }),
      }),
    );
  });

  it('should call hardDeleteUser if confirmed', () => {
    component.onDelete('1');
    expect(mockUserService.hardDeleteUser).toHaveBeenCalledWith('1');
  });

  it('should handle delete user error and rollback', () => {
    mockUserService.hardDeleteUser.mockReturnValue(throwError(() => new Error('API Error')));
    const initialUsers = [...(component as any).users()];

    component.onDelete('1');

    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'Failed to delete user.',
      'Close',
      expect.anything(),
    );
    expect((component as any).users()).toEqual(initialUsers);
  });

  it('should open create user dialog', () => {
    mockDialog.open.mockReturnValue({ afterClosed: () => of(null) });
    component.onCreateUser();
    expect(mockDialog.open).toHaveBeenCalledWith(CreateUserDialogComponent, expect.anything());
  });

  it('should call createUser if dialog returns data', () => {
    const mockRequest = {
      fullName: 'New User',
      email: 'new@test.com',
      password: 'password',
      domainRoles: {},
    };
    mockDialog.open.mockReturnValue({ afterClosed: () => of(mockRequest) });

    component.onCreateUser();

    expect(mockUserService.createUser).toHaveBeenCalledWith(mockRequest);
    expect((component as any).users().length).toBe(3);
    expect((component as any).users()[0].email).toBe('new@test.com');
    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'User created successfully.',
      'Dismiss',
      expect.anything(),
    );
  });

  it('should handle createUser error', () => {
    const mockRequest = {
      fullName: 'New User',
      email: 'new@test.com',
      password: 'password',
      domainRoles: {},
    };
    mockDialog.open.mockReturnValue({ afterClosed: () => of(mockRequest) });
    mockUserService.createUser.mockReturnValue(throwError(() => new Error('API Error')));

    const initialLength = (component as any).users().length;
    component.onCreateUser();

    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'Failed to create user. Ensure email is unique.',
      'Close',
      expect.anything(),
    );
    expect((component as any).users().length).toBe(initialLength);
  });

  it('should open manage roles dialog', () => {
    mockDialog.open.mockReturnValue({ afterClosed: () => of(null) });
    component.onEditRoles(mockUsers[0] as any);
    expect(mockDialog.open).toHaveBeenCalledWith(
      ManageRolesDialogComponent,
      expect.objectContaining({
        data: { user: mockUsers[0] },
      }),
    );
  });

  it('should call updateRoles if dialog returns data', () => {
    const mockRequest = { domainRoles: { events: 'ADMIN' } };
    mockDialog.open.mockReturnValue({ afterClosed: () => of(mockRequest) });

    component.onEditRoles(mockUsers[0] as any);

    expect(mockUserService.updateRoles).toHaveBeenCalledWith('1', mockRequest);
    expect((component as any).users()[0].roles).toBeDefined();
    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'User roles updated successfully.',
      'Dismiss',
      expect.anything(),
    );
  });

  it('should handle updateRoles error', () => {
    const mockRequest = { domainRoles: { events: 'ADMIN' } };
    mockDialog.open.mockReturnValue({ afterClosed: () => of(mockRequest) });
    mockUserService.updateRoles.mockReturnValue(throwError(() => new Error('API Error')));

    component.onEditRoles(mockUsers[0] as any);

    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'Failed to update user roles.',
      'Close',
      expect.anything(),
    );
  });
});
