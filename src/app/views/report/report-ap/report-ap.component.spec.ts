import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportApComponent } from './report-ap.component';

describe('ReportApComponent', () => {
  let component: ReportApComponent;
  let fixture: ComponentFixture<ReportApComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportApComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportApComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
