import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportFixassetComponent } from './report-fixasset.component';

describe('ReportFixassetComponent', () => {
  let component: ReportFixassetComponent;
  let fixture: ComponentFixture<ReportFixassetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportFixassetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportFixassetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
