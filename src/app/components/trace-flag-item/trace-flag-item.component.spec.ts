import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraceFlagItemComponent } from './trace-flag-item.component';

describe('TraceFlagItemComponent', () => {
  let component: TraceFlagItemComponent;
  let fixture: ComponentFixture<TraceFlagItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraceFlagItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraceFlagItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
