import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixassetFormRevaluationComponent } from './fixasset-form-revaluation.component';

describe('FixassetFormRevaluationComponent', () => {
  let component: FixassetFormRevaluationComponent;
  let fixture: ComponentFixture<FixassetFormRevaluationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixassetFormRevaluationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixassetFormRevaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
