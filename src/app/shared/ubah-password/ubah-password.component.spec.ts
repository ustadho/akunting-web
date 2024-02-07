import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UbahPasswordComponent } from './ubah-password.component';

describe('UbahPasswordComponent', () => {
  let component: UbahPasswordComponent;
  let fixture: ComponentFixture<UbahPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UbahPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbahPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
