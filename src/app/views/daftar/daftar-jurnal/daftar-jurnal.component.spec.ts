import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DaftarJurnalComponent } from './daftar-jurnal.component';

describe('DaftarJurnalComponent', () => {
  let component: DaftarJurnalComponent;
  let fixture: ComponentFixture<DaftarJurnalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DaftarJurnalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaftarJurnalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
