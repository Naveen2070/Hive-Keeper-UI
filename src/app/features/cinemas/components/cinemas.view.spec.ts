import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CinemasViewComponent } from './cinemas.view';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CinemasViewComponent', () => {
  let component: CinemasViewComponent;
  let fixture: ComponentFixture<CinemasViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CinemasViewComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CinemasViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render cinemas in table', () => {
    fixture.componentRef.setInput('cinemas', [
      { id: '1', name: 'Grand IMAX', location: 'NYC', contactEmail: 'a@b.com', approvalStatus: 'Pending' }
    ]);
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('table')).toBeTruthy();
    expect(compiled.textContent).toContain('Grand IMAX');
    expect(compiled.textContent).toContain('NYC');
  });

  it('should emit statusChange event when action buttons are clicked', () => {
    fixture.componentRef.setInput('cinemas', [
      { id: '1', name: 'Grand IMAX', location: 'NYC', contactEmail: 'a@b.com', approvalStatus: 'Pending' }
    ]);
    fixture.detectChanges();

    const spy = vi.spyOn(component.statusChange, 'emit');
    // Using a more specific selector that matches the icon inside or the button by icon name
    const approveBtn = fixture.nativeElement.querySelector('button:has(mat-icon:contains("check_circle"))') 
                    || fixture.nativeElement.querySelector('button'); // Fallback to first button for now to debug
    
    // Actually, let's just find the button with the emerald class, but carefully
    const buttons = fixture.nativeElement.querySelectorAll('button');
    let targetBtn: HTMLButtonElement | null = null;
    buttons.forEach((btn: HTMLButtonElement) => {
      if (btn.querySelector('mat-icon')?.textContent?.trim() === 'check_circle') {
        targetBtn = btn;
      }
    });

    if (targetBtn) {
      (targetBtn as HTMLButtonElement).click();
      expect(spy).toHaveBeenCalledWith({ id: '1', status: 'Approved' });
    } else {
      throw new Error('Target button not found');
    }
  });
});
