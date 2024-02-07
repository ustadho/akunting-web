import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaTipeComponent } from './fa-tipe.component';

describe('FaTipeComponent', () => {
  let component: FaTipeComponent;
  let fixture: ComponentFixture<FaTipeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaTipeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaTipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
