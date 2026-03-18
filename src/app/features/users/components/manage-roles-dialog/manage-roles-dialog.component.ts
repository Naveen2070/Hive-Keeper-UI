import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { UserDto, UserRoleDto } from '../../services/user.service';

@Component({
  selector: 'app-manage-roles-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './manage-roles-dialog.component.html',
  styleUrl: './manage-roles-dialog.component.css',
})
export class ManageRolesDialogComponent {
  form: FormGroup;
  protected readonly ref = inject(MatDialogRef<ManageRolesDialogComponent>);
  protected readonly data = inject<{ user: UserDto }>(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);

  constructor() {
    const userRoles: UserRoleDto[] = this.data.user.roles || [];

    const eventsRole =
      userRoles.find((r) => r.domain === 'events')?.roleName?.replace('ROLE_', '') || 'NONE';
    const moviesRole =
      userRoles.find((r) => r.domain === 'movies')?.roleName?.replace('ROLE_', '') || 'NONE';

    this.form = this.fb.group({
      events: [eventsRole],
      movies: [moviesRole],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const domainRoles: Record<string, string> = {};

    if (formValue.events !== 'NONE') {
      domainRoles['events'] = formValue.events;
    }
    if (formValue.movies !== 'NONE') {
      domainRoles['movies'] = formValue.movies;
    }

    this.ref.close({ domainRoles });
  }
}
