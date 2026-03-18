import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './create-user-dialog.component.html',
  styleUrl: './create-user-dialog.component.css',
})
export class CreateUserDialogComponent {
  hidePassword = true;
  protected readonly ref = inject(MatDialogRef<CreateUserDialogComponent>);
  private readonly fb = inject(FormBuilder);
  form: FormGroup = this.fb.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    domainRoles: this.fb.group({
      events: ['NONE'],
      movies: ['NONE'],
    }),
  });

  onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;

    // Clean up domains that are set to NONE
    const domainRoles: Record<string, string> = {};
    if (formValue.domainRoles.events !== 'NONE') {
      domainRoles['events'] = formValue.domainRoles.events;
    }
    if (formValue.domainRoles.movies !== 'NONE') {
      domainRoles['movies'] = formValue.domainRoles.movies;
    }

    const payload = {
      fullName: formValue.fullName,
      email: formValue.email,
      password: formValue.password,
      domainRoles,
    };

    this.ref.close(payload);
  }
}
