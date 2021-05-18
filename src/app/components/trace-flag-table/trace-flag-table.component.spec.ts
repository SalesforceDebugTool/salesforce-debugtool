import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraceFlagTableComponent } from './trace-flag-table.component';

describe('TraceFlagTableComponent', () => {
  let component: TraceFlagTableComponent;
  let fixture: ComponentFixture<TraceFlagTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraceFlagTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraceFlagTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
