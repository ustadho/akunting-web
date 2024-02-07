import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixAssetFormComponent } from './fixasset-form.component';

describe('FixassetFormComponent', () => {
  let component: FixAssetFormComponent;
  let fixture: ComponentFixture<FixAssetFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixAssetFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixAssetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
