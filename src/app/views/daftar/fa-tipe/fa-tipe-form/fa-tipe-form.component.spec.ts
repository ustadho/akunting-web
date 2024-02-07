import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaTipeFormComponent } from './fa-tipe-form.component';

describe('FaTipeFormComponent', () => {
  let component: FaTipeFormComponent;
  let fixture: ComponentFixture<FaTipeFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaTipeFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaTipeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
