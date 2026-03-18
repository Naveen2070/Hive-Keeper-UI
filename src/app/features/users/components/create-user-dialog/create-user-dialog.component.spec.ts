import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateUserDialogComponent } from './create-user-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('CreateUserDialogComponent', () => {
  let component: CreateUserDialogComponent;
  let fixture: ComponentFixture<CreateUserDialogComponent>;
  let mockDialogRef: any;

  beforeEach(async () => {
    mockDialogRef = {
      close: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CreateUserDialogComponent, NoopAnimationsModule],
      providers: [{ provide: MatDialogRef, useValue: mockDialogRef }],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should invalidate form when empty', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('should validate email format', () => {
    const emailControl = component.form.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTruthy();

    emailControl?.setValue('valid@test.com');
    expect(emailControl?.hasError('email')).toBeFalsy();
  });

  it('should validate password minimum length', () => {
    const passwordControl = component.form.get('password');
    passwordControl?.setValue('123');
    expect(passwordControl?.hasError('minlength')).toBeTruthy();

    passwordControl?.setValue('12345678');
    expect(passwordControl?.hasError('minlength')).toBeFalsy();
  });

  it('should format domain roles on submit', () => {
    component.form.patchValue({
      fullName: 'Test User',
      email: 'test@test.com',
      password: 'password123',
      domainRoles: {
        events: 'ADMIN',
        movies: 'NONE', // Should be filtered out
      },
    });

    component.onSubmit();

    expect(mockDialogRef.close).toHaveBeenCalledWith({
      fullName: 'Test User',
      email: 'test@test.com',
      password: 'password123',
      domainRoles: {
        events: 'ADMIN',
      },
    });
  });

  it('should not close dialog if form is invalid', () => {
    component.onSubmit();
    expect(mockDialogRef.close).not.toHaveBeenCalled();
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
