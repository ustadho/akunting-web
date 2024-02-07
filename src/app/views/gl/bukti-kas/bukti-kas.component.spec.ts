import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuktiKasComponent } from './bukti-kas.component';

describe('BuktiKasComponent', () => {
  let component: BuktiKasComponent;
  let fixture: ComponentFixture<BuktiKasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuktiKasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuktiKasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
