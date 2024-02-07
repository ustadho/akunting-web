import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodEndComponent } from './period-end.component';

describe('PeriodEndComponent', () => {
  let component: PeriodEndComponent;
  let fixture: ComponentFixture<PeriodEndComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeriodEndComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodEndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
