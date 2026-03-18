import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  CreateUserRequest,
  UpdateUserRolesRequest,
  UserDto,
  UserService,
} from '../services/user.service';
import { UsersViewComponent } from './users.view';
import { CreateUserDialogComponent } from './create-user-dialog/create-user-dialog.component';
import { ManageRolesDialogComponent } from './manage-roles-dialog/manage-roles-dialog.component';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-users-container',
  standalone: true,
  imports: [UsersViewComponent, MatSnackBarModule, MatDialogModule],
  template: `
    <app-users-view
      [users]="users()"
      [loading]="loading()"
      (toggleStatus)="onToggleStatus($event.id, $event.currentStatus)"
      (deleteRequest)="onDelete($event)"
      (createRequest)="onCreateUser()"
      (editRolesRequest)="onEditRoles($event)"
      (refresh)="loadUsers()"
    />
  `,
})
export class UsersContainerComponent implements OnInit {
  protected readonly users = signal<UserDto[]>([]);
  protected readonly loading = signal<boolean>(false);

  private readonly userService = inject(UserService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading.set(true);
    this.userService
      .getUsers(0, 100)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (response) => this.users.set(response.content),
        error: (err) => {
          console.error('Failed to load users', err);
          this.snackBar.open('Failed to connect to Identity Service.', 'Close', {
            duration: 5000,
          });
        },
      });
  }

  onToggleStatus(id: string, currentStatus: boolean) {
    const user = this.users().find((u) => u.id === id);
    if (!user) return;

    const newStatus = !currentStatus;
    const actionText = currentStatus ? 'Ban' : 'Unban';

    this.dialog
      .open<ConfirmDialogComponent, ConfirmDialogData, boolean>(ConfirmDialogComponent, {
        width: '400px',
        panelClass: 'hive-dialog',
        data: {
          title: `${actionText} User?`,
          message: `Are you sure you want to <strong>${actionText.toLowerCase()}</strong> ${user.email}? ${
            currentStatus
              ? 'They will instantly lose access to all connected platforms.'
              : 'Their platform access will be restored.'
          }`,
          confirmLabel: `Yes, ${actionText.toLowerCase()}`,
          confirmColor: currentStatus ? 'reject' : 'approve',
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          const prevUsers = this.users();
          // Optimistic Update
          this.users.update((curr) =>
            curr.map((u) => (u.id === id ? { ...u, active: newStatus } : u)),
          );

          this.userService
            .toggleStatus(id, newStatus)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () =>
                this.snackBar.open(`User ${actionText.toLowerCase()}ned successfully.`, 'Dismiss', {
                  duration: 3000,
                }),
              error: () => {
                this.snackBar.open(`Failed to update user status.`, 'Retry', { duration: 4000 });
                this.users.set(prevUsers);
              },
            });
        }
      });
  }

  onDelete(id: string) {
    const user = this.users().find((u) => u.id === id);
    if (!user) return;

    this.dialog
      .open<ConfirmDialogComponent, ConfirmDialogData, boolean>(ConfirmDialogComponent, {
        width: '420px',
        panelClass: 'hive-dialog',
        data: {
          title: 'Hard Delete User?',
          message: `You are about to permanently purge <strong>${user.email}</strong> from the database. <strong>This action bypasses soft-deletion and cannot be undone.</strong>`,
          confirmLabel: 'Yes, permanently delete',
          confirmColor: 'reject',
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          const prevUsers = this.users();
          this.users.update((curr) => curr.filter((u) => u.id !== id));

          this.userService
            .hardDeleteUser(id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () =>
                this.snackBar.open('User purged from database.', 'Dismiss', { duration: 3000 }),
              error: () => {
                this.snackBar.open('Failed to delete user.', 'Close', { duration: 5000 });
                this.users.set(prevUsers);
              },
            });
        }
      });
  }

  onCreateUser() {
    this.dialog
      .open<CreateUserDialogComponent, any, CreateUserRequest>(CreateUserDialogComponent, {
        width: '480px',
        panelClass: 'hive-dialog',
      })
      .afterClosed()
      .subscribe((request) => {
        if (request) {
          this.loading.set(true);
          this.userService
            .createUser(request)
            .pipe(
              finalize(() => this.loading.set(false)),
              takeUntilDestroyed(this.destroyRef),
            )
            .subscribe({
              next: (newUser) => {
                this.snackBar.open('User created successfully.', 'Dismiss', { duration: 3000 });
                this.users.update((curr) => [newUser, ...curr]);
              },
              error: (err) => {
                console.error('Failed to create user', err);
                this.snackBar.open('Failed to create user. Ensure email is unique.', 'Close', {
                  duration: 5000,
                });
              },
            });
        }
      });
  }

  onEditRoles(user: UserDto) {
    this.dialog
      .open<ManageRolesDialogComponent, { user: UserDto }, UpdateUserRolesRequest>(
        ManageRolesDialogComponent,
        {
          width: '450px',
          panelClass: 'hive-dialog',
          data: { user },
        },
      )
      .afterClosed()
      .subscribe((request) => {
        if (request) {
          this.loading.set(true);
          this.userService
            .updateRoles(user.id, request)
            .pipe(
              finalize(() => this.loading.set(false)),
              takeUntilDestroyed(this.destroyRef),
            )
            .subscribe({
              next: (updatedUser) => {
                this.snackBar.open('User roles updated successfully.', 'Dismiss', {
                  duration: 3000,
                });
                this.users.update((curr) =>
                  curr.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
                );
              },
              error: (err) => {
                console.error('Failed to update roles', err);
                this.snackBar.open('Failed to update user roles.', 'Close', { duration: 5000 });
              },
            });
        }
      });
  }
}
