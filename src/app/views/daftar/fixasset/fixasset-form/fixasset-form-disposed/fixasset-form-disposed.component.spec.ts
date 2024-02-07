import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixassetFormDisposedComponent } from './fixasset-form-disposed.component';

describe('FixassetFormDisposedComponent', () => {
  let component: FixassetFormDisposedComponent;
  let fixture: ComponentFixture<FixassetFormDisposedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixassetFormDisposedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixassetFormDisposedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
