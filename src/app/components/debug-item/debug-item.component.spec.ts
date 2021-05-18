import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugItemComponent } from './debug-item.component';

describe('DebugItemComponent', () => {
  let component: DebugItemComponent;
  let fixture: ComponentFixture<DebugItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebugItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebugItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
