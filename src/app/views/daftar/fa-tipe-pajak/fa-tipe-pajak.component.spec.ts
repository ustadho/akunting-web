import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaTipePajakComponent } from './fa-tipe-pajak.component';

describe('FaTipePajakComponent', () => {
  let component: FaTipePajakComponent;
  let fixture: ComponentFixture<FaTipePajakComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaTipePajakComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaTipePajakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
