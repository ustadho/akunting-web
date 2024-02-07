import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportAkuntingComponent } from './report-akunting.component';

describe('ReportAkuntingComponent', () => {
  let component: ReportAkuntingComponent;
  let fixture: ComponentFixture<ReportAkuntingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportAkuntingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportAkuntingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
