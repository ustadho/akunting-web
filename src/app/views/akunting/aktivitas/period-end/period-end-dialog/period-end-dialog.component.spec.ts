import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodEndDialogComponent } from './period-end-dialog.component';

describe('PeriodEndDialogComponent', () => {
  let component: PeriodEndDialogComponent;
  let fixture: ComponentFixture<PeriodEndDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeriodEndDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodEndDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
