import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultAkunComponent } from './default-akun.component';

describe('DefaultAkunComponent', () => {
  let component: DefaultAkunComponent;
  let fixture: ComponentFixture<DefaultAkunComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefaultAkunComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultAkunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
