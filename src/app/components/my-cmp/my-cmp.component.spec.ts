import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCMPComponent } from './my-cmp.component';

describe('MyCMPComponent', () => {
  let component: MyCMPComponent;
  let fixture: ComponentFixture<MyCMPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyCMPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCMPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
