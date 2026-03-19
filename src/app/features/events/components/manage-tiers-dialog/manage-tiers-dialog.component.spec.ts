import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTiersDialog } from './manage-tiers-dialog';

describe('ManageTiersDialog', () => {
  let component: ManageTiersDialog;
  let fixture: ComponentFixture<ManageTiersDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageTiersDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageTiersDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
