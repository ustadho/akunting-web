import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaTipePajakFormComponent } from './fa-tipe-pajak-form.component';

describe('FaTipePajakFormComponent', () => {
  let component: FaTipePajakFormComponent;
  let fixture: ComponentFixture<FaTipePajakFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaTipePajakFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaTipePajakFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
