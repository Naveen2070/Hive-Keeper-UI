import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogData } from './confirm-dialog.component';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let mockDialogRef: any;

  const mockData: ConfirmDialogData = {
    title: 'Test Title',
    message: 'Test <strong>message</strong>',
    confirmLabel: 'Confirm',
    confirmColor: 'approve',
  };

  beforeEach(async () => {
    mockDialogRef = {
      close: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: MatDialogRef, useValue: mockDialogRef },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the title and message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toBe(mockData.title);
    expect(compiled.querySelector('p')?.innerHTML).toContain('Test <strong>message</strong>');
  });

  it('should render the correct confirm label', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');
    const confirmBtn = Array.from(buttons).find((btn: any) =>
      btn.textContent.includes(mockData.confirmLabel),
    );
    expect(confirmBtn).toBeTruthy();
  });

  it('should close with false when Cancel is clicked', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');
    const cancelBtn = Array.from(buttons).find((btn: any) =>
      btn.textContent.includes('Cancel'),
    ) as HTMLButtonElement;
    cancelBtn.click();
    expect(mockDialogRef.close).toHaveBeenCalledWith(false);
  });

  it('should close with true when confirm button is clicked', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');
    const confirmBtn = Array.from(buttons).find((btn: any) =>
      btn.textContent.includes(mockData.confirmLabel),
    ) as HTMLButtonElement;
    confirmBtn.click();
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should apply correct classes based on confirmColor', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const iconWrapper = compiled.querySelector('.w-11.h-11');
    expect(iconWrapper?.classList.contains('bg-emerald-500/10')).toBe(true);
  });

  it('should apply reject classes when color is reject', () => {
    // Re-configure with reject data
    TestBed.resetTestingModule();
    const rejectData: ConfirmDialogData = { ...mockData, confirmColor: 'reject' };

    TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: rejectData },
        { provide: MatDialogRef, useValue: mockDialogRef },
      ],
    }).compileComponents();

    const rejectFixture = TestBed.createComponent(ConfirmDialogComponent);
    rejectFixture.detectChanges();

    const compiled = rejectFixture.nativeElement as HTMLElement;
    const iconWrapper = compiled.querySelector('.w-11.h-11');
    expect(iconWrapper?.classList.contains('bg-red-500/10')).toBe(true);
  });
});
