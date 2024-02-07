import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixassetListComponent } from './fixasset-list.component';

describe('FixassetComponent', () => {
  let component: FixassetListComponent;
  let fixture: ComponentFixture<FixassetListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixassetListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixassetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
